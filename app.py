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

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.sqlite3'

app.app_context().push()

@app.route('/')
def Home():
    return render_template('index.html')
DEBUG = True
def create_sample_data():
    # Create some sample books
    book1 = Book(name="Harry Potter", author="Jk Rowling", year_published=1997, loan_type=1)
    book2 = Book(name="The Bible", author="God", year_published=1, loan_type=2)
    book3 = Book(name="1984", author="George Orwell", year_published=1949, loan_type=1)

    # Create some sample customers
    customer1 = Customer(name="Gil", city="Yavne", age=34)
    customer2 = Customer(name="Nir", city="Kazir", age=37)
    customer3 = Customer(name="Guy", city="Lehavot", age=41)



    db.session.add(book1)
    db.session.add(book2)
    db.session.add(book3)
    db.session.add(customer1)
    db.session.add(customer2)
    db.session.add(customer3)
    db.session.commit()


if __name__ == "__main__":
    db.init_app(app)
    db.create_all()
    if DEBUG:
        create_sample_data()
    app.run(debug=True, port=2003, use_reloader=False)
