document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const userSelect = document.getElementById('userSelect');
  const enterSystemButton = document.getElementById('enterSystem');
  const availableBooksTableBody = document.querySelector('#availableBooksTable tbody');
  const unavailableBooksTableBody = document.querySelector('#unavailableBooksTable tbody');
  const checkoutButton = document.getElementById('checkoutButton');
  const returnBooksButton = document.getElementById('returnBooksButton');
  const returnBooksTableBody = document.querySelector('#returnBooksTable tbody');
  const returnButton = document.getElementById('returnButton');
  const reportLostButton = document.getElementById('reportLostButton')
  const backButton = document.getElementById('backButton');
  const donateBooksButton = document.getElementById('donateBooksButton');
  const donateModal = document.getElementById('donateModal');
  const closeModal = document.getElementById('closeModal');
  const donateForm = document.getElementById('donateForm');
  const commentsList = document.getElementById('commentsList');
  const commentInput = document.getElementById('commentInput');
  const submitCommentButton = document.getElementById('submitComment');
  const logoutButton = document.getElementById('logoutButton');
  const noBooksMessage = document.getElementById('noBooksMessage');
  let selectedBooks = [];
  let selectedBooksToReturn = [];

  // Load Users
  async function loadUsers() {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();

      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
      });

      userSelect.addEventListener('change', () => {
        enterSystemButton.disabled = !userSelect.value;
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  // Enter System
  if (enterSystemButton) {
    enterSystemButton.addEventListener('click', () => {
      const userId = userSelect.value;
      localStorage.setItem('userId', userId);
      window.location.href = 'books.html';
    });
  }

  // Load Available Books
  async function loadAvailableBooks() {
    try {
      const response = await fetch('/api/books/available');
      const books = await response.json();

      books.forEach(book => {
        const row = availableBooksTableBody.insertRow();
        row.innerHTML = `
          <td><input type="checkbox" name="bookSelect" value="${book.id}" onclick="handleCheckboxChange()"></td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.category}</td>
          <td><button class="details-button" onclick="viewBookDetails(${book.id})">View Details</button></td>
        `;
      });
    } catch (error) {
      console.error('Error loading available books:', error);
    }
  }

  // Load Unavailable Books
  async function loadUnavailableBooks() {
    try {
      const response = await fetch('/api/books/unavailable');
      const books = await response.json();

      books.forEach(book => {
        const row = unavailableBooksTableBody.insertRow();
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.category}</td> 
          <td class="${book.status === 'lost' ? 'status-lost' : ''}">
          ${book.status.charAt(0).toUpperCase() + book.status.slice(1)}
          </td>
          <td><button class="details-button" onclick="viewBookDetails(${book.id})">View Details</button></td>
        `;
      });
    } catch (error) {
      console.error('Error loading unavailable books:', error);
    }
  }

  // Handle Checkbox Change
  window.handleCheckboxChange = () => {
    const checkboxes = document.querySelectorAll('input[name="bookSelect"]:checked');
    selectedBooks = Array.from(checkboxes).map(cb => cb.value);
    checkoutButton.disabled = selectedBooks.length === 0;
  };

  // Checkout Books
  if (checkoutButton) {
    checkoutButton.addEventListener('click', async () => {
      if (selectedBooks.length > 0) {
        try {
          const userId = localStorage.getItem('userId');
          const response = await fetch('/api/books/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, bookIds: selectedBooks }),
          });

          if (response.ok) {
            alert('Books successfully checked out!');
            location.reload();
          } else {
            alert('Error during checkout. Please try again.');
          }
        } catch (error) {
          console.error('Error checking out books:', error);
        }
      }
    });
  }

  // Handle Return Books Button
  if (returnBooksButton) {
    returnBooksButton.addEventListener('click', () => {
      window.location.href = 'returnBooks.html';
    });
  }

  // Handle Back to Books Button
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'books.html';
    });
  }

  // Load Checked Out Books (Return Books Page)
  async function loadCheckedOutBooks() {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/checkouts/user/${userId}`);
      const books = await response.json();

      if (books.length === 0) {
        noBooksMessage.style.display = 'block';
        returnBooksTableBody.innerHTML = '';
        returnButton.style.display = 'none';
        reportLostButton.style.display = 'none';
      } else {
        noBooksMessage.style.display = 'none';
        books.forEach(book => {
          const row = returnBooksTableBody.insertRow();
          row.innerHTML = `
            <td><input type="checkbox" name="bookReturn" value="${book.checkoutId}"></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${new Date(book.checkout_date).toLocaleDateString()}</td>
          `;
        });

        // Handle checkbox changes for returning books
        returnBooksTableBody.addEventListener('change', (e) => {
          const checkbox = e.target;
          const bookId = checkbox.value;

          if (checkbox.checked) {
            selectedBooksToReturn.push(bookId);
          } else {
            selectedBooksToReturn = selectedBooksToReturn.filter(id => id !== bookId);
          }

          returnButton.disabled = selectedBooksToReturn.length === 0;
          reportLostButton.disabled = selectedBooksToReturn.length === 0;
        });
      }
    } catch (error) {
      console.error('Error loading checked out books:', error);
    }
  }

  // Return Selected Books
  if (returnButton) {
    returnButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/checkouts/return', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutIds: selectedBooksToReturn }),
        });

        if (response.ok) {
          alert('Books returned successfully!');
          window.location.reload();
        } else {
          alert('Error returning books');
        }
      } catch (error) {
        console.error('Error returning books:', error);
      }
    });
  }

  // Report lost on Selected Books
  if (reportLostButton) {
    reportLostButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/checkouts/lost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lostIds: selectedBooksToReturn }),
        });

        if (response.ok) {
          alert('Books reported lost successfully!');
          window.location.reload();
        } else {
          alert('Error reporting lost books');
        }
      } catch (error) {
        console.error('Error reporting lost books:', error);
      }
    });
  }

  // View Book Details
  window.viewBookDetails = (bookId) => {
    localStorage.setItem('bookId', bookId);
    window.location.href = 'bookDetails.html';
  };

  // Load Comments for a Book
  async function loadBookDetails() {
    const bookId = localStorage.getItem('bookId');
    try {
      const response = await fetch(`/api/books/${bookId}`);
      const book = await response.json();
      document.getElementById('bookTitle').textContent = `${book.title} by ${book.author}`;

      const commentsResponse = await fetch(`/api/comments/${bookId}`);
      const comments = await commentsResponse.json();
      commentsList.innerHTML = '';
      if (comments.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No comments found';
        commentsList.appendChild(li);
      } else {
        comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = `${comment.user_name} - "${comment.comment}"`;
        commentsList.appendChild(li);
      });
    }
    } catch (error) {
      console.error('Error loading book details or comments:', error);
    }
  }

  // Add Comment
  if (submitCommentButton) {
    submitCommentButton.addEventListener('click', async () => {
      const bookId = localStorage.getItem('bookId');
      const userId = localStorage.getItem('userId');
      const comment = commentInput.value;

      if (!comment) return alert('Comment cannot be empty.');

      try {
        const response = await fetch(`/api/comments/${bookId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, comment }),
        });

        if (response.ok) {
          commentInput.value = '';
          loadBookDetails();
        } else {
          alert('Failed to add comment.');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    });
  }

  // Donate Books
  if (donateBooksButton) {
    donateBooksButton.addEventListener('click', () => {
      donateModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
      donateModal.style.display = 'none';
    });

    donateForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(donateForm);
      const data = {
        title: formData.get('title'),
        author: formData.get('author'),
        type: formData.get('type') || 'Unknown',
      };

      try {
        const response = await fetch('/api/books/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Book donated successfully!');
          donateModal.style.display = 'none';
          donateForm.reset();
          window.location.href = 'books.html';
        } else {
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error donating book:', error);
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Initialize Pages 
  if (userSelect) loadUsers(); 
  if (availableBooksTableBody) loadAvailableBooks(); 
  if (unavailableBooksTableBody) loadUnavailableBooks(); 
  if (window.location.pathname.endsWith('returnBooks.html')) loadCheckedOutBooks(); 
  if (window.location.pathname.endsWith('bookDetails.html')) loadBookDetails(); 
});
