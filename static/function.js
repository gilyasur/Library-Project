const MY_SERVER = "http://127.0.0.1:2003/"
let index= 0
let books = []
let customers = []
let loans = []
let loan_type_js = ""

var currentDate = new Date();

// Get the current date
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
var year = currentDate.getFullYear();

// Convert day, month, and year to strings
var dayStr = day < 10 ? '0' + day : day.toString();
var monthStr = month < 10 ? '0' + month : month.toString();
var yearStr = year.toString();

// Create the European date format "dd/mm/yyyy"
var europeanDateFormat = dayStr + '/' + monthStr + '/' + yearStr;



const get_data_books = async () => {
    try {
        const res = await axios.get(`${MY_SERVER}books/get`);
        const books = res.data;
        console.log(books); // Log the API response

        // Default value for loan_type_js if loan_type is missing
        const loanType = books.loan_type || 0; // Assuming 0 is a suitable default
        
        if (loanType == 1) { loan_type_js = "10 days"; }
        else if (loanType == 2) { loan_type_js = "5 days"; }
        else { loan_type_js = "2 days"; }

        return books;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}
const get_data_customers = async () => {
    try {
        const res = await axios.get(`${MY_SERVER}customers/get`);
        customers = res.data;
        return customers;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}
const get_data_loans = async () => {
    try {
        const res = await axios.get(`${MY_SERVER}loans/get`);
        loans = res.data;
        return loans;
    } catch (error) {
        console.error('Error fetching loans:', error);
        throw error;
    }
}



function get_all_data(){
    get_data_books();
    get_data_customers();
    get_data_loans();
}
get_all_data()

const del_book = async (id) => {
    try {
        const response = await axios.delete(`${MY_SERVER}/books/delete/${id}`);
        console.log(response.data); // Log the success message or handle it as needed

        // Optionally, you can refresh the books list or update the UI after a successful delete
        // Assuming displayBooks is an async function that fetches and displays the updated book list
        await displayBooks(); // Example: Refresh the books list

    } catch (error) {
        console.error('Error deleting book:', error);
        showErrorToast('Error Deleting Book. Please try again.');
    }
}

const del_customer = async (id) => {
    try {
        const response = await axios.delete(`${MY_SERVER}/customers/delete/${id}`);
        console.log(response.data); 
        
        displayCustomers(); 
    } catch (error) {
        console.error('Error deleting customer:', error);
        showErrorToast('Error Deleting Customer. Please try again.');
    }
    displayCustomers();
}

const upd_customer = async () => {
    try {
        // Get values from form fields
        const id = document.getElementById("upd_cust_id").value;
        const newName = document.getElementById("upd_cust_name").value;
        const newCity = document.getElementById("upd_cust_city").value;
        const newAge = document.getElementById("upd_cust_age").value;
        console.log("ID:", id);
        console.log("Name:", newName);
        console.log("City:", newCity);
        console.log("Age:", newAge);

        // Create an object with the fields to update
        const data = {
            name: newName,
            city: newCity,
            age: newAge
        };

        const response = await axios.patch(`${MY_SERVER}/customers/update/${id}`, data);
        console.log(response.data);

        // Check the response status code to handle success or failure
        if (response.status === 200) {
            showSuccessToast(`Customer Update successfully: ${newName} in city ${newCity}, at the age of ${newAge}`);

            console.log('Customer updated successfully');
            // Optionally, you can refresh the customer list after updating
            // displayCustomers();
        } else {
            showErrorToast('Error Updating customer. Please try again.');
            console.error('Failed to update customer:', response.data.error);
        }
    } catch (error) {
        console.error('Error updating customer:', error);
    }
    displayCustomers();
}

const upd_Book = async () => {
    try {
        // Get values from form fields
        const id = document.getElementById("upd_book_id").value;
        const newName = document.getElementById("upd_book_name").value;
        const newAuthor = document.getElementById("upd_book_author").value;
        const newyearPublished = document.getElementById("upd_book_yearPublished").value;
        const newLoantype = document.getElementById("upd_book_Loantype").value;
 

        // Create an object with the fields to update
        const data = {
            name: newName,
            author: newAuthor,
            year_published: newyearPublished,
            loan_type : newLoantype
        };

        const response = await axios.patch(`${MY_SERVER}/books/update/${id}`, data);
        console.log(response.data);

        // Check the response status code to handle success or failure
        if (response.status === 200) {
            console.log('Book updated successfully');
            // Optionally, you can refresh the customer list after updating
            showSuccessToast(`Book Update successfully: ${newName} by ${newAuthor}, published in ${newyearPublished}, Loan Type: ${newLoantype}`);
        } else {
            showErrorToast('Error Updating book. Please try again.');
            console.error('Failed to update Book:', response.data.error);
        }
    } catch (error) {
        console.error('Error updating customer:', error);
    }
    displayBooks();
}

function showSuccessToast(message) {
    Toastify({
        text: message,
        duration: 2000, // Display for 3 seconds
        gravity: "top", // Top or bottom
        position: "left", // Left, center, or right
        stopOnFocus: true, // Prevent dismissing on hover
        onClick: function() {} // Callback after click
    }).showToast();
}

function showErrorToast(message) {
    Toastify({
        text: message,
        duration: 2000, // Display for 3 seconds
        gravity: "top", // Top or bottom
        position: "left", // Left, center, or right
        stopOnFocus: true, // Prevent dismissing on hover
        onClick: function() {} // Callback after click
    }).showToast();
}

const add_book = async () => {
    // Get the input values
    const name = boo_name.value;
    const author = boo_author.value;
    const year_published = boo_year_published.value; // Make sure to use .value if this is an input element
    const loan_type = boo_loan_type.value; // Make sure to use .value if this is an input element

    // Validation: Check if any of the required fields are empty
    if (!name || !author || !year_published || !loan_type) {
        showErrorToast('Please fill in all the required fields.');
        return; // Exit the function early if any field is empty
    }

    // Validation: Check if "year_published" is a valid integer
    if (!Number.isInteger(Number(year_published))) {
        showErrorToast('Year published must be a valid integer.');
        return; // Exit the function early if year_published is not an integer
    }

    try {
        // Send a POST request to add the book
        const response = await axios.post(`${MY_SERVER}/books/post`, {
            name: name,
            author: author,
            year_published: year_published,
            loan_type: loan_type,
        });

        // Display a success toast with book details
        showSuccessToast(`Book added successfully: ${name} by ${author}, published in ${year_published}, Loan Type: ${loan_type}`);
    } catch (error) {
        console.error('Error adding book:', error);

        // Display an error toast if there's an error
        showErrorToast('Error adding book. Please try again.');
    }
    displayBooks();
}

const add_customer = async () => {
    // Get the input values
    const name = cust_name.value;
    const city = cust_city.value;
    const age = cust_age.value; // Make sure to use .value if this is an input element


    // Validation: Check if any of the required fields are empty
    if (!name || !city || !age ) {
        showErrorToast('Please fill in all the required fields.');
        return; // Exit the function early if any field is empty
    }

    // Validation: Check if "year_published" is a valid integer
    if (!Number.isInteger(Number(age))) {
        showErrorToast('Age must be a valid integer.');
        return; // Exit the function early if year_published is not an integer
    }

    try {
        // Send a POST request to add the customer
        const response = await axios.post(`${MY_SERVER}/customers/post`, {
            name: name,
            city: city,
            age: age,
            
        });

        // Display a success toast with book details
        showSuccessToast(`Customer added successfully: ${name} in ${city}, aged  ${age}`);
    } catch (error) {
        console.error('Error adding customer:', error);

        // Display an error toast if there's an error
        showErrorToast('Error adding customer. Please try again.');
    }
    displayCustomers();
}


// Function to create a loan
const createLoan = async () => {
    try {
        const customerDropdown = document.getElementById('customerDropdown');
        const bookDropdown = document.getElementById('bookDropdown');
        const loanDateInput = document.getElementById('loanDate');

        // Get selected customer and book IDs from the dropdowns
        const selectedCustomerId = customerDropdown.value;
        const selectedBookId = bookDropdown.value;

        // Get loan date and return date from the input fields
        const loanDate = loanDateInput.value;

        // Create the loan object
        const newLoan = {
            customer_id: selectedCustomerId,
            book_id: selectedBookId,
            loan_date: loanDate,
        };

        // Send the new loan data to your server or API using Axios
        const response = await axios.post(`${MY_SERVER}/loans/post`, newLoan);

        // Optionally, clear the form fields
        loanDateInput.value = '';

        // Check the response status and display an alert accordingly
        if (response.status === 201) {
            showSuccessToast('Loan added successfully');
            console.log("Loan added successfully");
        } else {
            console.error('Error adding loan:', response.data.error);
            showErrorToast('Error adding loan. Please try again.');
        }
        
    } catch (error) {
        console.error('Error adding loan:', error);
        showErrorToast('Error adding loan. Please try again.');
    }
    
    }


// Function to populate customer and book dropdowns
const populateDropdowns = async () => {
    const customerDropdown = document.getElementById('customerDropdown');
    const bookDropdown = document.getElementById('bookDropdown');
    const customersData = await get_data_customers();
    const booksData = await get_data_books();

    // Sort customersData and booksData alphabetically by name
    customersData.sort((a, b) => a.name.localeCompare(b.name));
    booksData.sort((a, b) => a.name.localeCompare(b.name));

    // Populate the customer dropdown
    customersData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        customerDropdown.appendChild(option);
    });

    // Populate the book dropdown
    booksData.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.name;
        bookDropdown.appendChild(option);
    });
};


// Call the populateDropdowns function to fill the dropdowns with data
populateDropdowns();





const displayBooks = async (filter) => {
    const searchCustomerContainer = document.getElementById('searchCustomerContainer');
    searchCustomerContainer.style.display = 'none';
    const booksContainer = document.getElementById('display');
    try {
        const booksData = await get_data_books();

        // Filter books based on the search input
        const filteredBooks = filter
            ? booksData.filter(book => book.name.toLowerCase().includes(filter.toLowerCase()))
            : booksData;
        
         
        const header = document.createElement('h2');
        header.textContent = 'Books';
        header.style.textAlign = 'center';
        header.style.textDecoration = 'underline';
        // Create an HTML table to display the data
        const table = document.createElement('table');
        table.className = 'table table-bordered'; // You can add Bootstrap classes if needed
        
        // Create table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Year Published</th>
                    <th>Loan Type Period</th>
                    <th>Action</th>
                </tr>
            </thead>
        `;

        // Create table body
        const tableBody = document.createElement('tbody');

        filteredBooks.forEach(book => {
            const row = document.createElement('tr');

            // Populate the table cells with book data
            const idCell = document.createElement('td');
            idCell.textContent = book.id;

            const nameCell = document.createElement('td');
            nameCell.textContent = book.name;

            const authorCell = document.createElement('td');
            authorCell.textContent = book.author;

            const yearPublishedCell = document.createElement('td');
            yearPublishedCell.textContent = book.year_published;

            const loanTypeCell = document.createElement('td');
            loanTypeCell.textContent = book.loan_type === 1 ? "10 days" : (book.loan_type === 2 ? "5 days" : "2 days");

            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => del_book(book.id));
            
            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-success';
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => showBookupdForm(book.id, book.name, book.author, book.year_published, book.loan_type));

            actionCell.appendChild(deleteButton);
            actionCell.appendChild(updateButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(authorCell);
            row.appendChild(yearPublishedCell);
            row.appendChild(loanTypeCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Clear previous content and append the table
        booksContainer.innerHTML = '';
        booksContainer.appendChild(header);
        booksContainer.appendChild(table);
        showBookSearchInputAndButton();
    } catch (error) {
        console.error('Error displaying books:', error);
    }
}


const displayCustomers = async (filter) => {
    const customersContainer = document.getElementById('display');
    const searchBookContainer = document.getElementById('searchBookContainer');
    searchBookContainer.style.display = 'none';
    try {
        const customersData = await get_data_customers();

        // Filter customers based on the search input
        const filteredCustomers = filter
            ? customersData.filter(customer => customer.name.toLowerCase().includes(filter.toLowerCase()))
            : customersData;
        const header = document.createElement('h2');
        header.textContent = 'Customers';
        header.style.textAlign = 'center';
        header.style.textDecoration = 'underline';
        // Create an HTML table to display the data
        const table = document.createElement('table');
        table.className = 'table table-bordered'; // You can add Bootstrap classes if needed

        // Create table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
        `;

        // Create table body
        const tableBody = document.createElement('tbody');

        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');

            // Populate the table cells with customer data
            const idCell = document.createElement('td');
            idCell.textContent = customer.id;

            const nameCell = document.createElement('td');
            nameCell.textContent = customer.name;

            const cityCell = document.createElement('td');
            cityCell.textContent = customer.city;

            const ageCell = document.createElement('td');
            ageCell.textContent = customer.age;

            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => del_customer(customer.id));

            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-success';
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => showCustomerupdForm(customer.id, customer.name, customer.city, customer.age));

            actionCell.appendChild(deleteButton);
            actionCell.appendChild(updateButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(cityCell);
            row.appendChild(ageCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Clear previous content and append the table
        customersContainer.innerHTML = '';
        customersContainer.appendChild(header);
        customersContainer.appendChild(table);
        

        // Show the search input and button
        showSearchInputAndButton();

    } catch (error) {
        console.error('Error displaying customers:', error);
    }
};

const displayLoans = async () => {
    const searchCustomerContainer = document.getElementById('searchCustomerContainer');
    searchCustomerContainer.style.display = 'none';

    const loansContainer = document.getElementById('display');
    try {
        const loansData = await get_data_loans();
        const customersData = await get_data_customers();
        const booksData = await get_data_books();

        // Create an object to map customer IDs to names
        const customerMap = {};
        customersData.forEach(customer => {
            customerMap[customer.id] = customer.name;
        });

        // Create an object to map book IDs to names
        const bookMap = {};
        booksData.forEach(book => {
            bookMap[book.id] = book.name;
        });
        const header = document.createElement('h2');
        header.textContent = 'Loans';
        header.style.textAlign = 'center';
        header.style.textDecoration = 'underline';
        // Create an HTML table to display the data
        const table = document.createElement('table');
        table.className = 'table table-bordered'; // You can add Bootstrap classes if needed

        // Create table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Book Name</th>
                    <th>Loan Date</th>
                    <th>Return Date</th>
                    <th>Loan Status</th>
                    <th>Action</th>
                </tr>
            </thead>
        `;

        // Create table body
        const tableBody = document.createElement('tbody');

        loansData.forEach(loan => {
            const row = document.createElement('tr');

            // Populate the table cells with loan data
            const idCell = document.createElement('td');
            idCell.textContent = loan.id;

            const customerNameCell = document.createElement('td');
            customerNameCell.textContent = customerMap[loan.customer_id];

            const bookNameCell = document.createElement('td');
            bookNameCell.textContent = bookMap[loan.book_id];

            const loanDateCell = document.createElement('td');
            loanDateCell.textContent = loan.loan_date;

            const returnDateCell = document.createElement('td');
            returnDateCell.textContent = loan.return_date;

            const LoanStatusCell = document.createElement('td');
            LoanStatusCell.textContent = loan.loan_status ? 'On Loan' : 'Returned';

            const actionCell = document.createElement('td');
            const ReturnedButton = document.createElement('button');
            ReturnedButton.className = 'btn btn-danger';
            ReturnedButton.textContent = 'Return Book';

            ReturnedButton.addEventListener('click', async () => {
                try {
                    
                    await returnLoan(loan.id);
                    // Update the UI to reflect the returned status
                    LoanStatusCell.textContent = 'Returned';
                    ReturnedButton.disabled = true; // Disable the button after returning
                } catch (error) {
                    console.error('Error returning loan:', error);
                }
            });

            actionCell.appendChild(ReturnedButton);

            row.appendChild(idCell);
            row.appendChild(customerNameCell);
            row.appendChild(bookNameCell);
            row.appendChild(loanDateCell);
            row.appendChild(returnDateCell);
            row.appendChild(LoanStatusCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Clear previous content and append the table
        loansContainer.innerHTML = '';
        loansContainer.appendChild(header);
        loansContainer.appendChild(table);

    } catch (error) {
        console.error('Error displaying loans:', error);
        // Display an error message to the user if needed
        loansContainer.innerHTML = 'Error displaying loans. Please try again later.';
    }
}

displayLoans();


function showLoanForm() {
    var bookForm = document.getElementById("bookForm");
    var customerForm = document.getElementById("customerForm");
    var customerupdForm = document.getElementById("customerupdForm");
    var bookupdForm = document.getElementById('bookupdForm');
    var loanForm = document.getElementById('loanForm');


    bookForm.style.display = "none";
    customerupdForm.style.display = "none";
    customerForm.style.display = "none"; 
    bookupdForm.style.display = "none" ;
    loanForm.style.display = "block" ;
}

function showBookForm() {
    var bookForm = document.getElementById("bookForm");
    var customerForm = document.getElementById("customerForm");
    var customerupdForm = document.getElementById("customerupdForm");
    var bookupdForm = document.getElementById('bookupdForm');
    var loanForm = document.getElementById('loanForm');

    bookForm.style.display = "block";
    customerupdForm.style.display = "none";
    customerForm.style.display = "none"; 
    bookupdForm.style.display = "none" ;
    loanForm.style.display = "none" ;
}

function showCustomerForm() {
    var bookForm = document.getElementById("bookForm");
    var customerForm = document.getElementById("customerForm");
    var customerupdForm = document.getElementById("customerupdForm");
    var bookupdForm = document.getElementById("bookupdForm");

    bookForm.style.display = "none"; // Hide the book form
    customerupdForm.style.display = "none";
    customerForm.style.display = "block";
    bookupdForm.style.display = "none" ;
    loanForm.style.display = "none" ;
}

function showCustomerupdForm(id, name,city,age) {
    var bookForm = document.getElementById("bookForm");
    var customerForm = document.getElementById("customerForm");
    var customerupdForm = document.getElementById("customerupdForm");
    var bookupdForm = document.getElementById('bookupdForm')

    bookForm.style.display = "none";
    customerForm.style.display = "none";
    customerupdForm.style.display = "block";
    bookupdForm.style.display = "none" ;
    loanForm.style.display = "none" ;

    // Assuming you have form fields with IDs "upd_cust_id" and "cust_name"
    document.getElementById("upd_cust_id").value = id;
    document.getElementById("upd_cust_name").value = name;
    document.getElementById("upd_cust_city").value = city;
    document.getElementById("upd_cust_age").value = age;
}

function showBookupdForm(id,name,author,year_published,loan_type) {
    var bookForm = document.getElementById("bookForm");
    var customerForm = document.getElementById("customerForm");
    var customerupdForm = document.getElementById("customerupdForm");
    var bookupdForm = document.getElementById('bookupdForm');

    bookForm.style.display = "none";
    customerForm.style.display = "none";
    customerupdForm.style.display = "none";
    bookupdForm.style.display = "block" ;
    loanForm.style.display = "none" ;

   
    document.getElementById("upd_book_id").value = id;
    document.getElementById("upd_book_name").value = name;
    document.getElementById("upd_book_author").value = author;
    document.getElementById("upd_book_yearPublished").value = year_published;
    document.getElementById("upd_book_Loantype").value = loan_type;



   
}
const returnLoan = async (id) => {
    try {
        await axios.put(`${MY_SERVER}loans/put/${id}`);
        console.log(id);
        console.log("Loan updated successfully");
        
    } catch (error) {
        console.error("Error updating loan:", error);
    }
    }
    displayLoans();

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
const searchInput = document.getElementById('searchInput').value;
displayCustomers(searchInput);
});

function showSearchInputAndButton() {
    const searchCustomerContainer = document.getElementById('searchCustomerContainer');
    searchCustomerContainer.style.display = 'block'; // Show the search input and button
}

function show() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("content").style.marginLeft = "250px";
 }
 function hide() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("content").style.marginLeft = "0";
 }
 show()

 const searchBookButton = document.getElementById('searchBookButton');
    searchBookButton.addEventListener('click', () => {
    const searchBookInput = document.getElementById('searchBookInput').value;
    displayBooks(searchBookInput);
    });

function showBookSearchInputAndButton() {
    const searchBookContainer = document.getElementById('searchBookContainer');
    searchBookContainer.style.display = 'block'; // Show the search input and button
}


const displayLateLoans = async () => {
    const loansContainer = document.getElementById('display');
    try {
        const loansData = await get_data_loans();
        const customersData = await get_data_customers();
        const booksData = await get_data_books();

        // Create an object to map customer IDs to names
        const customerMap = {};
        customersData.forEach(customer => {
            customerMap[customer.id] = customer.name;
        });

        // Create an object to map book IDs to names
        const bookMap = {};
        booksData.forEach(book => {
            bookMap[book.id] = book.name;
        });

        // Get the current date
        const currentDate = new Date();

        // Filter loans that are late
        const lateLoans = loansData.filter(loan => {
            const returnDate = new Date(loan.return_date);
            return loan.loan_status && returnDate < currentDate;
            
            // Check loan status and return date
        });
        

        // Create an HTML container for the header and the table
        const container = document.createElement('div');

        // Create the header element
        const header = document.createElement('h2');
        header.textContent = 'Late Loans';
      
        header.style.textAlign = 'center';
        header.style.textDecoration = 'underline';

        // Create an HTML table to display the late loans
        const table = document.createElement('table');
        table.className = 'table table-bordered'; // You can add Bootstrap classes if needed

        // Create table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Book Name</th>
                    <th>Loan Date</th>
                    <th>Return Date</th>
                    <th>Loan Status</th>
                </tr>
            </thead>
        `;

        // Create table body
        const tableBody = document.createElement('tbody');

        lateLoans.forEach(loan => {
            const row = document.createElement('tr');

            // Populate the table cells with late loan data
            const idCell = document.createElement('td');
            idCell.textContent = loan.id;

            const customerNameCell = document.createElement('td');
            customerNameCell.textContent = customerMap[loan.customer_id];

            const bookNameCell = document.createElement('td');
            bookNameCell.textContent = bookMap[loan.book_id];

            const loanDateCell = document.createElement('td');
            loanDateCell.textContent = loan.loan_date;

            const returnDateCell = document.createElement('td');
            returnDateCell.textContent = loan.return_date;

            const loanStatusCell = document.createElement('td');
            loanStatusCell.textContent = loan.loan_status ? 'On Loan' : 'Returned';

            row.appendChild(idCell);
            row.appendChild(customerNameCell);
            row.appendChild(bookNameCell);
            row.appendChild(loanDateCell);
            row.appendChild(returnDateCell);
            row.appendChild(loanStatusCell);

            tableBody.appendChild(row);
        });

        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Append the header and the table to the container
        container.appendChild(header);
        container.appendChild(table);

        // Clear previous content and append the container to the late loans div
        loansContainer.innerHTML = '';
        loansContainer.appendChild(container);
    } catch (error) {
        console.error('Error displaying late loans:', error);
        // Display an error message to the user if needed
        loansContainer.innerHTML = 'Error displaying late loans. Please try again later.';
    }
}



