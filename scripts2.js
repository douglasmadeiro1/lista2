import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, getDocs, query, onSnapshot } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyATxRE40okbcvn5GXC4CicHRDRrJYpruIQ",
  authDomain: "listavenda.firebaseapp.com",
  databaseURL: "https://listavenda-default-rtdb.firebaseio.com",
  projectId: "listavenda",
  storageBucket: "listavenda.appspot.com",
  messagingSenderId: "146426502512",
  appId: "1:146426502512:web:151cff147d7718647b83b5"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodoFirebase = async (text, done = false) => {
  const todosCollection = collection(firestore, "todos");
  const newTodo = { text, done };
  await addDoc(todosCollection, newTodo);
};
  const novaTarefaRef = push(tarefasRef);
  set(novaTarefaRef, novaTarefa);
};

const removeTodoFirebase = async (todoText) => {
  const todosCollection = collection(firestore, "todos");
  const todosQuery = query(todosCollection);
  const todosSnapshot = await getDocs(todosQuery);

  todosSnapshot.forEach((doc) => {
    const todo = doc.data();
    if (todo.text === todoText) {
      deleteDoc(doc.ref);
    }
  });
};

const updateTodoStatusFirebase = async (todoText) => {
  const todosCollection = collection(firestore, "todos");
  const todosQuery = query(todosCollection);
  const todosSnapshot = await getDocs(todosQuery);

  todosSnapshot.forEach((doc) => {
    const todo = doc.data();
    if (todo.text === todoText) {
      updateDoc(doc.ref, { done: !todo.done });
    }
  });
};

const updateTodoFirebase = async (todoOldText, todoNewText) => {
  const todosCollection = collection(firestore, "todos");
  const todosQuery = query(todosCollection);
  const todosSnapshot = await getDocs(todosQuery);

  todosSnapshot.forEach((doc) => {
    const todo = doc.data();
    if (todo.text === todoOldText) {
      updateDoc(doc.ref, { text: todoNewText });
    }
  });
};

const getTodosFirebase = () => {
  const todosCollection = collection(firestore, "todos");
  const todos = [];

  onSnapshot(todosCollection, (snapshot) => {
    snapshot.forEach((doc) => {
      const todo = doc.data();
      todos.push({
        id: doc.id,
        text: todo.text,
        done: todo.done
      });
    });
  });

  return todos;
};

const saveTodoFirebase = async (text, done = false) => {
  const todosCollection = collection(firestore, "todos");
  const newTodo = { text, done };

  const docRef = await addDoc(todosCollection, newTodo);
  const todoId = docRef.id;

  // Adicionar o ID ao objeto da tarefa
  const todoWithId = { id: todoId, ...newTodo };

  // Atualizar o documento com o ID
  await updateDoc(docRef, todoWithId);
};

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoFirebase(text);
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      updateTodoFirebase(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatusFirebase(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodoFirebase(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Carregar dados do Firebase
const loadTodos = () => {
  const todos = getTodosFirebase();

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

loadTodos();
