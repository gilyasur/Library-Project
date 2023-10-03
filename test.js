// ...

booksData.forEach(book => {
    const row = document.createElement('tr');

    // Populate the table cells with book data
    const idCell = document.createElement('td');
    idCell.textContent = book.id;

    const nameCell = document.createElement('td');
    nameCell.textContent = book.name;

    const authorCell = document.createElement('td');
    authorCell.textContent = book.author;

    const bookstatusCell = document.createElement('td');
    bookstatusCell.textContent = book.book_status ? 'On Loan' : 'In Library';

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
    row.appendChild(bookstatusCell);
    row.appendChild(yearPublishedCell);
    row.appendChild(loanTypeCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
});

// ...
