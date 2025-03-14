from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
# Initialize Flask app, database, bcrypt, and login manager
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Route for home page (login required)
@app.route('/')
@login_required
def home():
    return render_template('index.html')

# Route for subjects (open for all)
@app.route('/c_programming')
def c_programming():
    return render_template('c_programming.html')

@app.route('/casa')
def casa():
    return render_template('casa.html')

@app.route('/deca')
def deca():
    return render_template('deca.html')

@app.route('/dent')
def dent():
    return render_template('dent.html')

@app.route('/frontend_engineering')
def frontend_engineering():
    return render_template('frontend_engineering.html')

@app.route('/mcp')
def mcp():
    return render_template('mcp.html')

@app.route('/operating_system')
def operating_system():
    return render_template('operating_system.html')

@app.route('/python')
def python():
    return render_template('python.html')

@app.route('/scm')
def scm():
    return render_template('scm.html')

# Route for login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html')  # Render login page for GET requests

# Route for logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('home'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if username and password are provided
        if not username or not password:
            flash('Username and password cannot be empty!', 'danger')
            return redirect(url_for('signup'))

        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already taken!', 'danger')
            return redirect(url_for('signup'))

        # Hash password and create user
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        flash('Account created! You can now log in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')  # Render signup page for GET requests

# Contact form handling
@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    flash('Thank you for your message! We will get back to you soon.')
    return redirect(url_for('home'))

# Error handling for 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

with app.app_context():
    db.create_all()
    
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for now

app.config['WTF_CSRF_ENABLED'] = False

if __name__ == '__main__':
    app.run(debug=True)
