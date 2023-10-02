from flask import Blueprint, request, jsonify
import json
from models import *



customers = Blueprint('customers', __name__, url_prefix='/customers')


@customers.route('/get', methods=["GET"])  # Use correct route decorator
def get_customers():
    res = []
    for customer in Customer.query.all():  # Fix the query syntax
        res.append({"id": customer.id, "name": customer.name,"city": customer.city,"age": customer.age})
    return json.dumps(res)



@customers.route('/post', methods=["POST"])
def add_cusomer():
    try:
        data = request.json
        newCustomer = Customer(data["name"], data["city"], data["age"])
        db.session.add(newCustomer)
        db.session.commit()
        
        return jsonify({"message": "Customer added successfully"}), 201  # Return a success response with status code 201 (Created)
    except Exception as e:
        return jsonify({"error": "Failed to add Customer", "details": str(e)}), 400  # Return an error response with status code 400 (Bad Request)


@customers.route('/delete/<int:id>', methods=["DELETE"])  # Include 'id' as a route parameter
def del_customer(id):
    try:
        # Check if the book with the specified ID exists
        cus = Customer.query.get(id)
        
        if not cus:
            return jsonify({"error": "Customer not found"}), 404  # Return a 404 response if the book doesn't exist

        db.session.delete(cus)
        db.session.commit()
        
        return jsonify({"message": "Customer deleted successfully"}), 200  # Return a success response with status code 200
    except Exception as e:
        return jsonify({"error": "Failed to Customer book", "details": str(e)}), 500  # Return an error response with status code 500 (Internal Server Error) if an exception occurs

@customers.route('/update/<int:id>', methods=["PATCH"])  # Include 'id' as a route parameter
def update_customer(id):
    try:
        data = request.json  # JSON request body containing fields to update
        
        # Check if the book with the specified ID exists
        cust = Customer.query.get(id)
        
        if not cust:
            return jsonify({"error": "Customer not found"}), 404  # Return a 404 response if the book doesn't exist
        
        # Update the book fields based on the data provided in the request
        if "name" in data:
            cust.name = data["name"]
        if "city" in data:
            cust.city = data["city"]
        if "age" in data:
            cust.age = data["age"]

        
        db.session.commit()
        
        return jsonify({"message": "Customer updated successfully"}), 200  # Return a success response with status code 200
    except Exception as e:
        return jsonify({"error": "Failed to update customer", "details": str(e)}), 500  # Return an error response with status code 500 (Internal Server Error) if an exception occurs
