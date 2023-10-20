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
        loansContainer.appendChild(table);

    } catch (error) {
        console.error('Error displaying loans:', error);
        // Display an error message to the user if needed
        loansContainer.innerHTML = 'Error displaying loans. Please try again later.';
    }
}
