
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    year_published = db.Column(db.Integer, nullable=False)
    loan_type = db.Column(db.Integer, nullable=False)
    book_status = db.Column(db.Boolean, default=False)

    loans = db.relationship('Loan', backref='book', lazy=True)

    def __init__(self, name, author, year_published,loan_type):
        self.name = name
        self.author = author
        self.year_published = year_published
        self.loan_type = loan_type

class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255))
    age = db.Column(db.Integer)

    loans = db.relationship('Loan', backref='customer', lazy=True)

    def __init__(self, name, city=None, age=None):
        self.name = name
        self.city = city
        self.age = age

class Loan(db.Model):
    __tablename__ = 'loans'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    loan_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date)

    def __init__(self, customer_id, book_id, loan_date, return_date=None):
        self.customer_id = customer_id
        self.book_id = book_id
        self.loan_date = loan_date
        self.return_date = return_date

# Adding foreign key constraints
db.ForeignKeyConstraint(['customer_id'], ['customers.id'])
db.ForeignKeyConstraint(['book_id'], ['books.id'])

# Adding unique constraint for customer names
db.UniqueConstraint('name', name='unique_customer_name')

# Adding check constraint for book_status (should be 0 or 1)
db.CheckConstraint('book_status IN (0, 1)', name='check_book_status')
