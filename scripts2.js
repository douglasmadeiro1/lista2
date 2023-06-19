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
    firebase.initializeApp(firebaseConfig);

    // Referenciar a coleção 'tasks' no Firestore
    const db = firebase.firestore();
    const tasksRef = db.collection('tasks');

    // Função para adicionar uma nova tarefa
    function addTask() {
        const taskInput = document.getElementById('taskInput');
        const task = taskInput.value.trim();

        if (task !== '') {
          // Salvar a tarefa no Firestore
          tasksRef.add({ description: task })
            .then(() => {
              taskInput.value = '';
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
  const confirmed = confirm("Tem certeza de que deseja excluir esta tarefa?");
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

    function editTask(id, newDescription) {
        // Atualizar a descrição da tarefa no Firestore
        tasksRef.doc(id).update({ description: newDescription })
          .then(() => {
            renderTasks(); // Atualiza a lista de tarefas na tela
          })
          .catch(error => {
            console.error('Erro ao editar a tarefa:', error);
          });
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

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            deleteButton.addEventListener('click', () => {
              deleteTask(id);
            });

            const editButton = document.createElement("button");
              editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
              editButton.addEventListener("click", () => {
                const newDescription = prompt('Editar lançamento:');
                if (newDescription !== null && newDescription.trim() !== '') {
                  editTask(id, newDescription.trim());
                }
              });

            todoItem.appendChild(checkbox);
            todoItem.appendChild(taskText);
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