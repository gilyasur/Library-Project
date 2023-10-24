from flask import Blueprint, request, jsonify
import json
from models import *





books = Blueprint('books', __name__, url_prefix='/books')


@books.route('/get', methods=["GET"])  
def get_books():
    res = []
    for book in Book.query.all():  
        res.append({"id": book.id, "name": book.name,"author": book.author,"loan_type": book.loan_type,"year_published": book.year_published})
    return json.dumps(res)



@books.route('/post', methods=["POST"])
def add_books():
    try:
        data = request.json
        newBook = Book(data["name"], data["author"], data["year_published"], data["loan_type"])
        db.session.add(newBook)
        db.session.commit()
        
        return jsonify({"message": "Book added successfully"}), 201 
    except Exception as e:
        return jsonify({"error": "Failed to add book", "details": str(e)}), 400  
from flask import jsonify, request

@books.route('/delete/<int:id>', methods=["DELETE"])  
def del_books(id):
    try:
        
        boo = Book.query.get(id)
        
        if not boo:
            return jsonify({"error": "Book not found"}), 404  

        db.session.delete(boo)
        db.session.commit()
        
        return jsonify({"message": "Book deleted successfully"}), 200  
    except Exception as e:
        return jsonify({"error": "Failed to delete book", "details": str(e)}), 500   

@books.route('/update/<int:id>', methods=["PATCH"])  
def update_book(id):
    try:
        data = request.json  
        
        
        book = Book.query.get(id)
        
        if not book:
            return jsonify({"error": "Book not found"}), 404  
        
       
        if "name" in data:
            book.name = data["name"]
        if "author" in data:
            book.author = data["author"]
        if "year_published" in data:
            book.year_published = data["year_published"]
        if "loan_type" in data:
            book.loan_type = data["loan_type"]
        
        db.session.commit()
        
        return jsonify({"message": "Book updated successfully"}), 200 
    except Exception as e:
        return jsonify({"error": "Failed to update book", "details": str(e)}), 500  
