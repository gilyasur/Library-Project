from flask import Blueprint, request, jsonify
import json
from models import *
from flask import jsonify, request
from datetime import datetime, timedelta


loans = Blueprint('loans', __name__, url_prefix='/loans')


from flask import jsonify

@loans.route('/get', methods=["GET"])
def get_loans():
    res = []
    
    for loan in Loan.query.all():
        # Convert loan.return_date to a string in the desired format
        return_date_str = loan.return_date.strftime("%Y-%m-%d")
        
        res.append({
            "id": loan.id,
            "customer_id": loan.customer_id,
            "book_id": loan.book_id,
            "loan_date": loan.loan_date.strftime("%Y-%m-%d"),  # Convert loan_date as well
            "return_date": return_date_str  # Include the formatted return_date
        })
    
    return jsonify(res)  # Use jsonify to return a JSON response



# @loans.route('/post', methods=["POST"])
# def add_loans():
#     try:
#         data = request.json
#         newBook = Book(data["name"], data["author"], data["year_published"], data["loan_type"])
#         db.session.add(newBook)
#         db.session.commit()
        
#         return jsonify({"message": "Loan added successfully"}), 201  # Return a success response with status code 201 (Created)
#     except Exception as e:
#         return jsonify({"error": "Failed to add loan", "details": str(e)}), 400  # Return an error response with status code 400 (Bad Request)




@loans.route('/post', methods=["POST"])
def add_loans():
    try:
        data = request.json

        # Update the book's status to indicate that it's currently on loan
        book = Book.query.get(data["book_id"])
        if book:
            book.book_status = True

        # Parse loan_date and return_date as Python date objects
        loan_date = datetime.strptime(data["loan_date"], "%Y-%m-%d")
        
        # Determine the loan type and set the return_date accordingly
        if book.loan_type == 1:
            return_date = loan_date + timedelta(days=10)
        elif book.loan_type == 2:
            return_date = loan_date + timedelta(days=5)
        elif book.loan_type == 3:
            return_date = loan_date + timedelta(days=2)
        else:
            return jsonify({"error": "Invalid loan type"}), 400

        new_loan = Loan(data["customer_id"], data["book_id"], loan_date, return_date)

        db.session.add(new_loan)
        db.session.commit()

        return jsonify({"message": "Loan added successfully"}), 201
    except Exception as e:
        return jsonify({"error": "Failed to add loan", "details": str(e)}), 400
@loans.route('/delete/<int:id>', methods=["DELETE"])  # Include 'id' as a route parameter
def del_loans(id):
    try:
        # Check if the book with the specified ID exists
        boo = Book.query.get(id)
        
        if not boo:
            return jsonify({"error": "Book not found"}), 404  # Return a 404 response if the book doesn't exist

        db.session.delete(boo)
        db.session.commit()
        
        return jsonify({"message": "Book deleted successfully"}), 200  # Return a success response with status code 200
    except Exception as e:
        return jsonify({"error": "Failed to delete book", "details": str(e)}), 500  # Return an error response with status code 500 (Internal Server Error) if an exception occurs

@loans.route('/update/<int:id>', methods=["PATCH"])  # Include 'id' as a route parameter
def update_loan(id):
    try:
        data = request.json  # JSON request body containing fields to update
        
        # Check if the book with the specified ID exists
        book = Book.query.get(id)
        
        if not book:
            return jsonify({"error": "Book not found"}), 404  # Return a 404 response if the book doesn't exist
        
        # Update the book fields based on the data provided in the request
        if "name" in data:
            book.name = data["name"]
        if "author" in data:
            book.author = data["author"]
        if "year_published" in data:
            book.year_published = data["year_published"]
        if "loan_type" in data:
            book.loan_type = data["loan_type"]
        
        db.session.commit()
        
        return jsonify({"message": "Book updated successfully"}), 200  # Return a success response with status code 200
    except Exception as e:
        return jsonify({"error": "Failed to update book", "details": str(e)}), 500  # Return an error response with status code 500 (Internal Server Error) if an exception occurs
