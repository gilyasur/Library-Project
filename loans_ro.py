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
            "return_date": return_date_str ,
             "loan_status": loan.loan_status # Include the formatted return_date
        })

    return jsonify(res)  # Use jsonify to return a JSON response





@loans.route('/post', methods=["POST"])
def add_loans():
    try:
        data = request.json

        # Check if the book is already loaned
        book = Book.query.get(data["book_id"])
        if not book:
            return jsonify({"error": "Book not found"}), 404

  

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
        loa = Loan.query.get(id)
        
        if not loa:
            return jsonify({"error": "Loan not found"}), 404  # Return a 404 response if the book doesn't exist

        db.session.delete(loa)
        db.session.commit()
        
        return jsonify({"message": "Loan deleted successfully"}), 200  # Return a success response with status code 200
    except Exception as e:
        return jsonify({"error": "Failed to delete loan", "details": str(e)}), 500  # Return an error response with status code 500 (Internal Server Error) if an exception occurs

@loans.route('/put/<int:id>', methods=["put"])
def update_loan(id):
    try:
       
        
        # Check if the loan with the specified ID exists
        loan = Loan.query.get(id)
  
        if not loan:
            return jsonify({"error": "Loan not found"}), 404 
        
        # Update the loan_status to True
        loan.loan_status = False
        
        db.session.commit()
        
        return jsonify({"message": "Loan updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update loan", "details": str(e)}), 500
