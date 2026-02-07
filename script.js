// ==============================
// Select DOM Elements
// ==============================
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');

// ==============================
// Load saved todos from localStorage
// ==============================
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

// ==============================
// Save todos to localStorage
// ==============================
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ==============================
// Update task counter
// ==============================
function updateTaskCount() {
  if (!taskCount) return;

  const completed = todos.filter(t => t.completed).length;
  taskCount.textContent =
    todos.length === 0
      ? ''
      : `${completed}/${todos.length} completed`;
}

// ==============================
// Create a single Todo DOM node
// ==============================
function createTodoNode(todo, index, isNew = false) {
  const li = document.createElement('li');

  if (todo.completed) {
    li.classList.add('completed');
  }

  if (isNew) {
    li.classList.add('new');
  }

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    li.classList.toggle('completed', todo.completed);
    saveTodos();
    updateTaskCount();
  });

  // Todo text
  const textSpan = document.createElement('span');
  textSpan.textContent = todo.text;

  textSpan.addEventListener('dblclick', () => {
    const newText = prompt('Edit todo', todo.text);
    if (newText && newText.trim()) {
      todo.text = newText.trim();
      textSpan.textContent = todo.text;
      saveTodos();
    }
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';

  delBtn.addEventListener('click', () => {
    todos.splice(index, 1);
    saveTodos();
    render();
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(delBtn);

  return li;
}

// ==============================
// Render Todo List
// ==============================
function render() {
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    list.appendChild(node);
  });

  if (emptyState) {
    emptyState.style.display = todos.length === 0 ? 'block' : 'none';
  }

  updateTaskCount();
}

// ==============================
// Add New Todo
// ==============================
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const newTodo = { text, completed: false };
  todos.push(newTodo);

  const node = createTodoNode(newTodo, todos.length - 1, true);
  list.appendChild(node);

  input.value = '';
  input.focus();

  saveTodos();
  updateTaskCount();

  if (emptyState) {
    emptyState.style.display = 'none';
  }
}

// ==============================
// Event Listeners
// ==============================
addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// ==============================
// Initial Setup
// ==============================
input.focus();
render();