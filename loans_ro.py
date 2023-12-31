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
            "loan_date": loan.loan_date.strftime("%Y-%m-%d"),  
            "return_date": return_date_str ,
             "loan_status": loan.loan_status # Include the formatted return_date
        })

    return jsonify(res)  




@loans.route('/post', methods=["POST"])
def add_loans():
    try:
        data = request.json

        # Check if the book is already loaned or returned
        existing_loan = Loan.query.filter_by(book_id=data["book_id"], loan_status=True).first()
        if existing_loan:
            return jsonify({"error": "Book is already loaned"}), 400

        
        loan_date = datetime.strptime(data["loan_date"], "%Y-%m-%d")

        # Determine the loan type and set the return_date accordingly
        book = Book.query.get(data["book_id"])
        if not book:
            return jsonify({"error": "Book not found"}), 404

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

    
@loans.route('/delete/<int:id>', methods=["DELETE"])  
def del_loans(id):
    try:
       
        loa = Loan.query.get(id)
        
        if not loa:
            return jsonify({"error": "Loan not found"}), 404  

        db.session.delete(loa)
        db.session.commit()
        
        return jsonify({"message": "Loan deleted successfully"}), 200 
    except Exception as e:
        return jsonify({"error": "Failed to delete loan", "details": str(e)}), 500 

@loans.route('/put/<int:id>', methods=["put"])
def update_loan(id):
    try:
       
        
        
        loan = Loan.query.get(id)
  
        if not loan:
            return jsonify({"error": "Loan not found"}), 404 
        
    
        loan.loan_status = False
        
        db.session.commit()
        
        return jsonify({"message": "Loan updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update loan", "details": str(e)}), 500
