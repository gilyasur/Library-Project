from flask import Blueprint, request, jsonify
import json
from models import *





books = Blueprint('books', __name__, url_prefix='/books')


@books.route('/get', methods=["GET"])  # Use correct route decorator
def get_books():
    res = []
    for book in Book.query.all():  # Fix the query syntax
        res.append({"id": book.id, "name": book.name,"author": book.author,"loan_type": book.loan_type,"year_published": book.year_published})
    return json.dumps(res)

from flask import jsonify, request

@books.route('/post', methods=["POST"])
def add_books():
    try:
        data = request.json
        newBook = Book(data["name"], data["author"], data["year_published"], data["loan_type"])
        db.session.add(newBook)
        db.session.commit()
        
        return jsonify({"message": "Book added successfully"}), 201  # Return a success response with status code 201 (Created)
    except Exception as e:
        return jsonify({"error": "Failed to add book", "details": str(e)}), 400  # Return an error response with status code 400 (Bad Request)
from flask import jsonify, request

@books.route('/delete/<int:id>', methods=["DELETE"])  # Include 'id' as a route parameter
def del_books(id):
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

@books.route('/update/<int:id>', methods=["PATCH"])  # Include 'id' as a route parameter
def update_book(id):
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
