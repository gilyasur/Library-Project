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
DEBUG = False
def create_sample_data():
    # Create some sample books
    book1 = Book(name="Book 1", author="Author 1", year_published=2020, loan_type=1)
    book2 = Book(name="Book 2", author="Author 2", year_published=2018, loan_type=2)
    book3 = Book(name="Book 3", author="Author 3", year_published=2015, loan_type=1)

    # Create some sample customers
    customer1 = Customer(name="Customer 1", city="City 1", age=30)
    customer2 = Customer(name="Customer 2", city="City 2", age=25)
    customer3 = Customer(name="Customer 3", age=28)



    # Add objects to the session and commit to the database
    db.session.add_all([book1, book2, book3, customer1, customer2, customer3])
    db.session.commit()


if __name__ == "__main__":
    # Create the database tables if they don't exist
    db.init_app(app)
    
    db.create_all()
    if DEBUG :
        create_sample_data()
    # Run the Flask application
    app.run(debug=True,port=2003)
