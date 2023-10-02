
function showSuccessToast(message) {
    Toastify({
        text: message,
        duration: 3000, // Display for 3 seconds
        gravity: "top", // Top or bottom
        position: "left", // Left, center, or right
        stopOnFocus: true, // Prevent dismissing on hover
        onClick: function() {} // Callback after click
    }).showToast();
}

function showErrorToast(message) {
    Toastify({
        text: message,
        duration: 3000, // Display for 3 seconds
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
}

const displayBooks = async () => {
    const booksContainer = document.getElementById('display');
    try {
        const booksData = await get_data_books();

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

        booksData.forEach(book => {
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
        booksContainer.appendChild(table);

    } catch (error) {
        console.error('Error displaying books:', error);
    }
}

const displayCustomers = async () => {
    const customersContainer = document.getElementById('display');
    try {
        const customersData = await get_data_customers();

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

        customersData.forEach(customer => {
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
        customersContainer.appendChild(table);

    } catch (error) {
        console.error('Error displaying customers:', error);
    }
}

const displayLoans = async () => {
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

            row.appendChild(idCell);
            row.appendChild(customerNameCell);
            row.appendChild(bookNameCell);
            row.appendChild(loanDateCell);
            row.appendChild(returnDateCell);

            tableBody.appendChild(row);
        });

        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Clear previous content and append the table
        loansContainer.innerHTML = '';
        loansContainer.appendChild(table);

    } catch (error) {
        console.error('Error displaying loans:', error);
    }
}

function showBookForm() {
    var form = document.getElementById("bookForm");
    form.style.display = "block";
}
function showCustomerForm() {
    var form = document.getElementById("customerForm");
    form.style.display = "block";
}
