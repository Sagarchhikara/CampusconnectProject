from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Required for flashing messages

# Route for home page
@app.route('/')
def home():
    return render_template('index.html')

# Route for subjects
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

# Add login route to handle login form submissions
@app.route('/login', methods=['POST'])
def login():
    # Get form data
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Add authentication logic here
    # For now, just redirect to home page
    flash('Login functionality not implemented yet')
    return redirect(url_for('home'))

# Add contact form handling
@app.route('/contact', methods=['POST'])
def contact():
    # Get form data
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    
    # Process contact form (e.g., send email, save to database)
    flash('Thank you for your message! We will get back to you soon.')
    return redirect(url_for('home'))

# Error handling for 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)