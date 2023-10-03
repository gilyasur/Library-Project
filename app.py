import json
from flask import Flask, request, render_template
from flask_sqlalchemy import SQLAlchemy
from loans_ro import loans
from books_ro import books
from customers_ro import customers
from models import *
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
app.register_blueprint(loans)
app.register_blueprint(books)
app.register_blueprint(customers)

# Correct the typo in the configuration key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.sqlite3'



# Set up the application context
app.app_context().push()

@app.route('/')
def Home():
    return render_template('index.html')

if __name__ == "__main__":
    # Create the database tables if they don't exist
    db.init_app(app)
    db.create_all()

    # Run the Flask application
    app.run(debug=True,port=2001)
