const firebaseConfig = {
  apiKey: "AIzaSyAGIWz0_aBCPipzvJtfkE4Mmh2uJPHkOU0",
  authDomain: "listavendas-6435b.firebaseapp.com",
  projectId: "listavendas-6435b",
  storageBucket: "listavendas-6435b.appspot.com",
  messagingSenderId: "245789738195",
  appId: "1:245789738195:web:270a1db545aefa0c88c026"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referenciar a coleção 'tasks' no Firestore
const db = firebase.firestore();
const tasksRef = db.collection('tasks');

// Função para adicionar uma nova tarefa
document.getElementById("taskForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o comportamento padrão de atualização da página
  addTask();
});

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const valueInput = document.getElementById('valueInput');

  const task = taskInput.value.trim();
  const value = valueInput.value.trim();

  if (task !== '' && value !== '') {
    // Salvar a tarefa no Firestore com os campos adicionais
    tasksRef.add({ description: task, value: value })
      .then(() => {
        taskInput.value = '';
        valueInput.value = '';
        renderTasks(); // Atualiza a lista de tarefas na tela
      })
      .catch(error => {
        console.error('Erro ao adicionar a tarefa:', error);
      });
  }
}

// Função para excluir uma tarefa
function deleteTask(id) {
  // Pedir confirmação antes de excluir a tarefa
  const confirmed = confirm("Deseja realmente excluir esse lançamento?");
  if (confirmed) {
    // Excluir a tarefa do Firestore
    tasksRef.doc(id)
      .delete()
      .then(() => {
        renderTasks(); // Atualiza a lista de tarefas na tela
      })
      .catch(error => {
        console.error('Erro ao excluir a tarefa:', error);
      });
  }
}

function editTask(id, newDescription, newValue) {
  // Atualizar a descrição e o valor da tarefa no Firestore
  tasksRef
    .doc(id)
    .update({ description: newDescription, value: newValue })
    .then(() => {
      renderTasks(); // Atualiza a lista de tarefas na tela
    })
    .catch(error => {
      console.error('Erro ao editar a tarefa:', error);
    });
}

function handleEditButtonClick(id, description, value) {
  const newDescription = prompt('Digite a nova descrição da tarefa:', description);
  const newValue = prompt('Digite o novo valor da tarefa:', value);
  if (newDescription !== null && newDescription.trim() !== '') {
    editTask(id, newDescription.trim(), newValue);
  }
}

// Função para renderizar as tarefas na página
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  // Obter as tarefas do Firestore
  tasksRef.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const task = doc.data();
        const id = doc.id;

        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        if (task.completed) {
          todoItem.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed; // Define o estado da checkbox
        checkbox.addEventListener('change', () => {
          toggleTaskCompleted(id, task.completed);
        });

        const taskText = document.createElement('span');
        taskText.textContent = task.description;

        const valueText = document.createElement('span');
        valueText.textContent = task.value;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteButton.addEventListener('click', () => {
          deleteTask(id);
        });

        const editButton = document.createElement("button");
        editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        editButton.addEventListener("click", () => {
          handleEditButtonClick(id, task.description, task.value);
        });


        todoItem.appendChild(taskText);
        todoItem.appendChild(valueText);
        todoItem.appendChild(checkbox);
        todoItem.appendChild(deleteButton);
        todoItem.appendChild(editButton);

        taskList.appendChild(todoItem);
      });
    })
    .catch(error => {
      console.error('Erro ao obter as tarefas:', error);
    });
}

// Função para marcar ou desmarcar uma tarefa como concluída
function toggleTaskCompleted(id, completed) {
  // Atualizar a propriedade 'completed' da tarefa no Firestore
  tasksRef.doc(id).update({ completed: !completed })
    .then(() => {
      renderTasks(); // Atualiza a lista de tarefas na tela
    })
    .catch(error => {
      console.error('Erro ao atualizar a tarefa:', error);
    });
}

// Renderizar as tarefas ao carregar a página
renderTasks();