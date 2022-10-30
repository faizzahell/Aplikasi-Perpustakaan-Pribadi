const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, timestamp, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    timestamp,
    isCompleted
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('container-from');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function addBook() {
    const titleBook = document.getElementById('title').value;
    const authorBook = document.getElementById('author').value;
    const yearBook = document.getElementById('year').value;
    const timestamp = document.getElementById('date').value;
   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, timestamp, false);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {

  const {id, title, author, year, timestamp, isCompleted} = bookObject;

  const textTitle = document.createElement('h1');
  textTitle.innerText = title;
 
  const authorBook = document.createElement('p');
  authorBook.innerText = author;
 
  const yearBook = document.createElement('p');
  yearBook.innerText = year;
 
  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, authorBook, yearBook, textTimestamp);
 
  const container = document.createElement('div');
  container.classList.add('shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });
    
    container.append(checkButton, trashButton);
  }

  return container;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('books');
  uncompletedBOOKList.innerHTML = '';

  const completedBOOKList = document.getElementById('completed-books');
  completedBOOKList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});