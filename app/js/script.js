'use strict';

 const body = document.querySelector('body');
 const formInput = document.querySelector('.form__input');
 const addTodo = document.querySelector('.form__input--checkmark');
 const form = document.querySelector('.form');
 const formList = document.querySelector('.form__list');
 const todo = document.querySelectorAll('.form__item');
 const todoCount = document.getElementById('count');
 const clear = document.getElementById('clear__completed');
 const theme = document.getElementById('theme');

 theme.checked = true;

 function createTodo(e) {
  e.preventDefault();
  if (formInput.value.length > 0) {
   const newTodo = document.createElement('li');
   newTodo.classList.add('form__item', 'drag-item');
   newTodo.draggable = 'true';
   saveLocalTodos(formInput.value);
   newTodo.innerHTML = `<label class="form__label">
  <input type="checkbox" name="form__item--intput-1" />
  <span class="form__checkmark"></span>
  <span class="form__item--text">${formInput.value}</span>
 </label>
 <span class="form__item--remove" id="remove"></span>`;

   if (
    document.querySelector('.form__item input[type="radio"]:checked').id ===
    'completed'
   ) {
    newTodo.classList.add('hidden');
   }
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
  updateCount(-1);
  el.classList.add('fall');
  removeLocalTodos(el);
  el.addEventListener('transitionend', () => {
   el.remove();
  });
 }

 function clearCompleted() {
  document
   .querySelectorAll('.form__item input[type="checkbox"]:checked')
   .forEach((item) => {
    removeTodo(item.closest('li'));
   });
 }

 // Filter
 function filterTodos(id) {
  const allItems = formList.querySelectorAll('li');
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
    return;
  }
 }

 ///////////////////////////////
 // Drag & Drop
 function dragOver(e) {
  e.preventDefault();
  const dragEl = document.querySelector('.draggable-el');
  const currentEl = e.target;
  const canSort =
   dragEl !== currentEl && currentEl.classList.contains('drag-item');

  if (!canSort) {
   return;
  }

  const nextEl = getNextEl(e.clientY, currentEl);

  if (
   (nextEl && dragEl === nextEl.previousElementSibling) ||
   dragEl === nextEl
  ) {
   return;
  }

  formList.insertBefore(dragEl, nextEl);
 }

 // Dragover fires over the center of div
 function getNextEl(cursorPosition, currentEl) {
  const currentElCoords = currentEl.getBoundingClientRect();
  const currentElCenter = currentElCoords.y + currentElCoords.height / 2;

  return cursorPosition < currentElCenter
   ? currentEl
   : currentEl.nextElementSibling;
 }

 let todos;
 function checkLocalTodos(todo) {
  if (localStorage.getItem('todos') === null) {
   todos = [];
  } else {
   todos = JSON.parse(localStorage.getItem('todos'));
  }
 }

 // Local Storage
 function saveLocalTodos(todo) {
  checkLocalTodos(todos);
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
 }

 function getLocalTodos() {
  checkLocalTodos(todos);
  todos.forEach((todo) => {
   const newTodo = document.createElement('li');
   newTodo.classList.add('form__item', 'drag-item');
   newTodo.draggable = 'true';
   newTodo.innerHTML = `<label class="form__label">
      <input type="checkbox" name="form__item--intput-1" />
      <span class="form__checkmark"></span>
      <span class="form__item--text">${todo}</span>
     </label>
     <span class="form__item--remove" id="remove"></span>`;

   formList.appendChild(newTodo);
   updateCount(1);
  });
 }

 function removeLocalTodos(todo) {
  checkLocalTodos(todo);
  
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem('todos', JSON.stringify(todos));
 }

 ////////////////////////////////////////////////
 // Event Listeners

 // Load stored todos
 document.addEventListener('DOMContentLoaded', getLocalTodos);

 form.addEventListener('submit', (e) => {
  createTodo(e);
 });

 formList.addEventListener('click', (e) => {
  if (e.target.classList.contains('form__item--remove')) {
   removeTodo(e.target.parentElement);
  }
 });
 
 addTodo.addEventListener('click', createTodo);

 clear.addEventListener('click', (e) => {
  clearCompleted();
 });

 document
  .querySelectorAll('.form__item input[type="radio"]')
  .forEach((item) => {
   item.addEventListener('change', (e) => {
    filterTodos(e.target.id);
   });
  });

 theme.addEventListener('click', (e) => {
  body.classList = [theme.checked ? 'dark-theme' : 'light-theme'];
 });

 // Drag & Drop
 formList.addEventListener('dragstart', (e) => {
  e.target.classList.add('draggable-el');
 });

 formList.addEventListener('dragend', (e) => {
  e.target.classList.remove('draggable-el');
 });

 formList.addEventListener('dragover', (e) => {
  dragOver(e);
 });
