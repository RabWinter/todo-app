const formInput = document.querySelector('.form__input');
const form = document.querySelector('.form');
const formList = document.querySelector('.form__list');
const todo = document.querySelectorAll('.form__item');
const todoCount = document.getElementById('count');
const clear = document.getElementById('clear__completed');
// let todoText = document.querySelector('.form__item--text')

const checkMark = document.getElementById('check');
let circle = document.querySelector('span');

function createTodo(e) {
 e.preventDefault();
 if (formInput.value.length > 0) {
  const newTodo = document.createElement('li');
  newTodo.classList.add('form__item', 'drag-item');
  newTodo.draggable = 'true';
  newTodo.innerHTML = `<label class="form__label">
  <input type="checkbox" name="form__item--intput-1" />
  <span class="form__checkmark"></span>
  <span class="form__item--text">${formInput.value}</span>
 </label>
 <span class="form__item--remove" id="remove"></span>`;

  formList.appendChild(newTodo);
  updateCount(1);

  // Reset text
  formInput.value = '';
 } else {
  alert('Please enter a task');
 }
}

function updateCount(number) {
 todoCount.innerText = +todoCount.innerText + number;
}

function removeTodo(el) {
 el.remove();
 updateCount(-1);
}

function clearCompleted() {
 document
  .querySelectorAll('.form__item input[type="checkbox"]:checked')
  .forEach((item) => {
   removeTodo(item.closest('li'));
  });
}

function filterTodos(id) {
 const allItems = document.querySelectorAll('li');
 ////////////////
 switch (id) {
  case 'all':
   allItems.forEach((item) => {
    item.classList.remove('hidden');
   });
   return 'all';
  case 'active':
   allItems.forEach((item) => {
    item.querySelector('input').checked
     ? item.classList.add('hidden')
     : item.classList.remove('hidden');
   });
   return 'active';
  default:
   allItems.forEach((item) => {
    !item.querySelector('input').checked
     ? item.classList.add('hidden')
     : item.classList.remove('hidden');
   });
 }
 ///////////////////////////////
}

form.addEventListener('submit', (e) => {
 createTodo(e);
});

formList.addEventListener('click', (e) => {
 if (e.target.classList.contains('form__item--remove')) {
  removeTodo(e.target.parentElement);
 }
});

clear.addEventListener('click', (e) => {
 clearCompleted();
});

document.querySelectorAll('input[type="radio"]').forEach((item) => {
 item.addEventListener('click', (e) => {
  filterTodos(e.target.id);
 });
});

// Drag & Drop
function dragOver(e) {
 e.preventDefault();
 const dragEl = document.querySelector('.draggable-el');
 const currentEl = e.target;
 const canSort =
  dragEl !== currentEl && currentEl.classList.contains('drag-item');

 if (!canSort) return;

 const nextEl =
  currentEl === dragEl.nextElementSibling
   ? currentEl.nextElementSibling
   : currentEl;

 formList.insertBefore(dragEl, nextEl);
}

formList.addEventListener('dragstart', (e) => {
 e.target.classList.add('draggable-el');
});

formList.addEventListener('dragend', (e) => {
 e.target.classList.remove('draggable-el');
});

formList.addEventListener('dragover', (e) => {
 dragOver(e);
});
