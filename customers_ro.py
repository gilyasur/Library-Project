from flask import Blueprint, request, jsonify
import json
from models import *



customers = Blueprint('customers', __name__, url_prefix='/customers')


@customers.route('/get', methods=["GET"])  
def get_customers():
    res = []
    for customer in Customer.query.all(): 
        res.append({"id": customer.id, "name": customer.name,"city": customer.city,"age": customer.age})
    return json.dumps(res)



@customers.route('/post', methods=["POST"])
def add_cusomer():
    try:
        data = request.json
        newCustomer = Customer(data["name"], data["city"], data["age"])
        db.session.add(newCustomer)
        db.session.commit()
        
        return jsonify({"message": "Customer added successfully"}), 201  
    except Exception as e:
        return jsonify({"error": "Failed to add Customer", "details": str(e)}), 400  


@customers.route('/delete/<int:id>', methods=["DELETE"])  
def del_customer(id):
    try:
        
        cus = Customer.query.get(id)
        
        if not cus:
            return jsonify({"error": "Customer not found"}), 404  

        db.session.delete(cus)
        db.session.commit()
        
        return jsonify({"message": "Customer deleted successfully"}), 200  
    except Exception as e:
        return jsonify({"error": "Failed to Customer book", "details": str(e)}), 500 

@customers.route('/update/<int:id>', methods=["PATCH"])  
def update_customer(id):
    try:
        data = request.json  
        
        
        cust = Customer.query.get(id)
        
        if not cust:
            return jsonify({"error": "Customer not found"}), 404  
        
       
        if "name" in data:
            cust.name = data["name"]
        if "city" in data:
            cust.city = data["city"]
        if "age" in data:
            cust.age = data["age"]

        db.session.commit()
        
        return jsonify({"message": "Customer updated successfully"}), 200  
    except Exception as e:
        return jsonify({"error": "Failed to update customer", "details": str(e)}), 500 
