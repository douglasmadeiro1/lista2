
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
const saveTodoFirebase = (text, done = 0) => {
  const tarefasRef = ref(database, "tarefas");
  const novaTarefa = {
    text: text,
    done: done
  };
  const novaTarefaRef = push(tarefasRef);
  set(novaTarefaRef, novaTarefa);
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

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
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

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

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

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
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

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const tarefasRef = ref(database, "tarefas");

  // Leia os dados do banco de dados usando on() para obter atualizações em tempo real
  onValue(tarefasRef, (snapshot) => {
    const tarefas = snapshot.val();

    // Limpe a lista atual de tarefas
    todoList.innerHTML = "";

    // Percorra as tarefas e adicione-as à lista
    for (const key in tarefas) {
      const tarefa = tarefas[key];
      saveTodo(tarefa.text, tarefa.done, 0);
    }
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoFirebase = (todoText) => {
  const tarefasRef = ref(database, "tarefas");
  const todos = getTodosFirebase();

  todos.forEach((todo) => {
    if (todo.text === todoText) {
      for (const key in tarefasRef) {
        if (tarefasRef[key].text === todoText) {
          set(ref(database, `tarefas/${key}`), null);
          break;
        }
      }
    }
  });
};

const updateTodoStatusFirebase = (todoText) => {
  const tarefasRef = ref(database, "tarefas");
  const todos = getTodosFirebase();

  todos.forEach((todo) => {
    if (todo.text === todoText) {
      for (const key in tarefasRef) {
        if (tarefasRef[key].text === todoText) {
          set(ref(database, `tarefas/${key}/done`), !todo.done);
          break;
        }
      }
    }
  });
};

const updateTodoFirebase = (todoOldText, todoNewText) => {
  const tarefasRef = ref(database, "tarefas");
  const todos = getTodosFirebase();

  todos.forEach((todo) => {
    if (todo.text === todoOldText) {
      for (const key in tarefasRef) {
        if (tarefasRef[key].text === todoOldText) {
          set(ref(database, `tarefas/${key}/text`), todoNewText);
          break;
        }
      }
    }
  });
};

const getTodosFirebase = () => {
  const tarefasRef = ref(database, "tarefas");
  const todos = [];

  onValue(tarefasRef, (snapshot) => {
    const tarefas = snapshot.val();

    for (const key in tarefas) {
      todos.push({
        text: tarefas[key].text,
        done: tarefas[key].done
      });
    }
  });

  return todos;
};
loadTodos();
