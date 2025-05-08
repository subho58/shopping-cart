const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const itemInput = document.getElementById('item-input');
const clearAll = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isSetToEdit = false;

function onPageLoad() {
  const itemsFromLocal = getItemFromLocal();

  itemsFromLocal.forEach((item) => addItemToDOM(item));
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const itemName = itemInput.value;

  // Removes value from input field once item is added
  itemInput.value = '';

  if (itemName.trim() === '') {
    alert('Please add a item');
    return;
  }

  if (isSetToEdit) {
    const itemToEdit = itemList.querySelector('.edit-item');

    removeItemFromLocal(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-item');
    itemToEdit.remove();
    isSetToEdit = false;
  } else if (checkDuplicate(itemName)) {
    alert('That item already exists');
    return;
  }

  // Adds element in the DOM
  addItemToDOM(itemName);

  // Adds element  in the localStorage
  addItemToLocal(itemName);
}

function addItemToDOM(itemName) {
  const item = createItem(itemName);

  itemList.appendChild(item);
  checkUI();
}

function addItemToLocal(itemName) {
  const itemFromLocal = getItemFromLocal();

  // Adds new item to the parsed array and stringifies it and puts it back to the localStorage
  itemFromLocal.push(itemName);
  localStorage.setItem('items', JSON.stringify(itemFromLocal));

  // console.log(itemFromLocal);
}

function checkDuplicate(item) {
  const itemFromLocal = getItemFromLocal();

  return itemFromLocal.includes(item);
}

function createItem(itemName) {
  const item = document.createElement('li');
  const itemText = document.createTextNode(itemName);
  item.appendChild(itemText);

  const button = createButton('remove-btn text-red');

  item.appendChild(button);

  return item;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');

  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;

  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-btn')) {
    const item = e.target.parentElement.parentElement;

    removeItem(item);
  } else if (e.target.tagName === 'LI') {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isSetToEdit = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-item'));

  item.classList.add('edit-item');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item';
  formBtn.style.backgroundColor = '#228b22';

  itemInput.value = item.textContent;
}

function removeItemFromLocal(item) {
  let itemFromLocal = getItemFromLocal();

  // Filters out the item to be removed
  itemFromLocal = itemFromLocal.filter((i) => i !== item);

  localStorage.setItem('items', JSON.stringify(itemFromLocal));
}

function removeItem(item) {
  if (confirm('Are you sure')) {
    // Remove Item from DOM
    item.remove();

    // Remove item From Local
    removeItemFromLocal(item.textContent);

    checkUI();
  }
}

function clearAllItem(e) {
  while (itemList.firstChild) {
    itemList.firstChild.remove();
    // itemList.removeChild(itemList.firstChild);
  }

  // Removes all items from local storage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.innerText.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  // console.log('Done');
}

function getItemFromLocal() {
  let itemFromLocal;

  // if there is no item in localStorage then makes an empty array.
  // if there is items in local then it fetches it and parses it into a array.
  if (localStorage.getItem('items') === null) {
    itemFromLocal = [];
  } else {
    itemFromLocal = JSON.parse(localStorage.getItem('items'));
  }

  return itemFromLocal;
}

// Checking the UI whether items is present or not.  If items are not present then sets diplay to none for filter and clearAll button as they are not needed
function checkUI() {
  const items = itemList.querySelectorAll('li');
  itemInput.value = '';

  if (items.length === 0) {
    filter.style.display = 'none';
    clearAll.style.display = 'none';
  } else {
    filter.style.display = 'block';
    clearAll.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Add Item';
  formBtn.style.backgroundColor = '#333';
  isSetToEdit = false;
  // console.log(items);
}

// Initialize function
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearAll.addEventListener('click', clearAllItem);
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', onPageLoad);

  checkUI();
}

init();

// localStorage.clear();

// Testing Local and Session Storage
// document.getElementById('local-storage').addEventListener('click', () => {
//   localStorage.setItem('name', 'Patrow');
//   localStorage.setItem('address', 'Subhadip');
// });
// document.getElementById('clear-local-storage').addEventListener('click', () => {
//   localStorage.clear();
// });

// document.getElementById('session-storage').addEventListener('click', () => {
//   sessionStorage.setItem('name', 'Patrow');
//   sessionStorage.setItem('address', 'Subhadip');
// });
// document
//   .getElementById('clear-session-storage')
//   .addEventListener('click', () => {
//     sessionStorage.clear();
//   });
