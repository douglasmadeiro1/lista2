const firebaseConfig = {
  apiKey: "AIzaSyATxRE40okbcvn5GXC4CicHRDRrJYpruIQ",
  authDomain: "listavenda.firebaseapp.com",
  databaseURL: "https://listavenda-default-rtdb.firebaseio.com",
  projectId: "listavenda",
  storageBucket: "listavenda.appspot.com",
  messagingSenderId: "146426502512",
  appId: "1:146426502512:web:151cff147d7718647b83b5"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const createTodoElement = (text, done) => {
  const todoElement = document.createElement("div");
  todoElement.className = "todo";
  todoElement.id = Date.now().toString();

  const todoText = document.createElement("h3");
  todoText.textContent = text;
  if (done) {
    todoText.classList.add("done");
  }
  todoElement.appendChild(todoText);

  const finishButton = document.createElement("button");
  finishButton.className = "finish-todo";
  finishButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  todoElement.appendChild(finishButton);

  const editButton = document.createElement("button");
  editButton.className = "edit-todo";
  editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
  todoElement.appendChild(editButton);

  const removeButton = document.createElement("button");
  removeButton.className = "remove-todo";
  removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  todoElement.appendChild(removeButton);

  return todoElement;
};

const saveTodoFirebase = async (text, done) => {
  const todoData = {
    text: text,
    done: done,
  };

  try {
    const docRef = await firestore.collection("todos").add(todoData);
    console.log("Tarefa salva com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao salvar a tarefa:", error);
  }
};

const updateTodoFirebase = async (id, text, done) => {
  const todoDoc = firestore.collection("todos").doc(id);

  try {
    await todoDoc.update({ text, done });
    console.log("Tarefa atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
  }
};

const deleteTodoFirebase = async (id) => {
  const todoDoc = firestore.collection("todos").doc(id);

  try {
    await todoDoc.delete();
    console.log("Tarefa excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir a tarefa:", error);
  }
};

const saveTodo = (text, done = false, saveToFirebase = true) => {
  const todoElement = createTodoElement(text, done);
  todoList.appendChild(todoElement);
  if (saveToFirebase) {
    saveTodoFirebase(text, done);
  }
};

const removeTodoElement = (id, deleteFromFirebase = true) => {
  const todoElement = document.getElementById(id);
  todoList.removeChild(todoElement);
  if (deleteFromFirebase) {
    deleteTodoFirebase(id);
  }
};

const updateTodoElement = (id, text, done) => {
  const todoElement = document.getElementById(id);
  const todoText = todoElement.querySelector("h3");
  todoText.textContent = text;
  if (done) {
    todoText.classList.add("done");
  } else {
    todoText.classList.remove("done");
  }
};

const handleTodoSubmit = (event) => {
  event.preventDefault();
  const todoInput = document.getElementById("todo-input");
  const todoText = todoInput.value.trim();
  if (todoText !== "") {
    saveTodo(todoText);
    todoInput.value = "";
  }
};

const handleFinishTodo = (event) => {
  const todoElement = event.target.closest(".todo");
  const todoText = todoElement.querySelector("h3");
  const id = todoElement.id;
  const done = !todoText.classList.contains("done");

  updateTodoElement(id, todoText.textContent, done);
  updateTodoFirebase(id, todoText.textContent, done);
};

const handleEditTodo = (event) => {
  const todoElement = event.target.closest(".todo");
  const todoText = todoElement.querySelector("h3");
  const id = todoElement.id;

  editForm.classList.remove("hide");
  editInput.value = todoText.textContent;
  editInput.focus();
  todoList.classList.add("hide");
  todoInput.disabled = true;
  addTodoBtn.disabled = true;
  cancelEditBtn.addEventListener("click", handleCancelEdit);
  editForm.addEventListener("submit", (event) => {
    handleUpdateTodo(event, id, todoElement);
  });
};

const handleUpdateTodo = (event, id, todoElement) => {
  event.preventDefault();
  const updatedText = editInput.value.trim();
  if (updatedText !== "") {
    const done = todoElement.querySelector("h3").classList.contains("done");
    updateTodoElement(id, updatedText, done);
    updateTodoFirebase(id, updatedText, done);
    editForm.classList.add("hide");
    todoList.classList.remove("hide");
    todoInput.disabled = false;
    addTodoBtn.disabled = false;
  }
};

const handleCancelEdit = () => {
  editForm.classList.add("hide");
  todoList.classList.remove("hide");
  todoInput.disabled = false;
  addTodoBtn.disabled = false;
};

const handleRemoveTodo = (event) => {
  const todoElement = event.target.closest(".todo");
  const id = todoElement.id;

  removeTodoElement(id);
};

const handleSearch = () => {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.trim().toLowerCase();
  const todos = document.getElementsByClassName("todo");

  Array.from(todos).forEach((todo) => {
    const todoText = todo.querySelector("h3").textContent.toLowerCase();
    if (todoText.includes(searchTerm)) {
      todo.classList.remove("hide");
    } else {
      todo.classList.add("hide");
    }
  });
};

const handleFilterChange = () => {
  const filterSelect = document.getElementById("filter-select");
  const filterValue = filterSelect.value;

  const todos = document.getElementsByClassName("todo");

  Array.from(todos).forEach((todo) => {
    const todoText = todo.querySelector("h3");
    if (filterValue === "all") {
      todo.classList.remove("hide");
    } else if (filterValue === "done") {
      if (todoText.classList.contains("done")) {
        todo.classList.remove("hide");
      } else {
        todo.classList.add("hide");
      }
    } else if (filterValue === "todo") {
      if (!todoText.classList.contains("done")) {
        todo.classList.remove("hide");
      } else {
        todo.classList.add("hide");
      }
    }
  });
};

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-input");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");

todoForm.addEventListener("submit", handleTodoSubmit);
todoList.addEventListener("click", (event) => {
  if (event.target.matches(".finish-todo")) {
    handleFinishTodo(event);
  } else if (event.target.matches(".edit-todo")) {
    handleEditTodo(event);
  } else if (event.target.matches(".remove-todo")) {
    handleRemoveTodo(event);
  }
});
searchInput.addEventListener("input", handleSearch);
filterSelect.addEventListener("change", handleFilterChange);