from flask import Flask, render_template

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)