from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity

app = Flask(__name__)

# Configuración de la clave secreta para JWT
app.config['JWT_SECRET_KEY'] = 'tu_clave_secreta'  # Cambia esto por una clave segura

# Inicializar el JWT Manager
jwt = JWTManager(app)

# Almacenamiento de usuarios (en memoria, para el ejemplo)
usuarios = {}

# Ruta para servir el archivo HTML
@app.route('/')
def index():
    return render_template('index.html')

# Ruta de inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # Lógica de autenticación
    if username in usuarios and usuarios[username] == password:
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

# Ruta de registro
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    # Verificar si el usuario ya existe
    if username in usuarios:
        return jsonify({"msg": "El usuario ya fue creado"}), 400

    # Registrar el nuevo usuario
    usuarios[username] = password
    return jsonify({"msg": "Usuario registrado exitosamente"}), 201

# Ruta protegida
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# Ruta para refrescar el token
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(debug=True)

