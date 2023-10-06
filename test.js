const displayCustomers = async (filter) => {
    const customersContainer = document.getElementById('display');
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

// Function to show the search input and button
function showSearchInputAndButton() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.style.display = 'block'; // Show the search input and button
}

// Initial display of customers without any filter
displayCustomers('');
