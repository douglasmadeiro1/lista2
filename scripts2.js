const firebaseConfig = {
  apiKey: "AIzaSyATxRE40okbcvn5GXC4CicHRDRrJYpruIQ",
  authDomain: "listavenda.firebaseapp.com",
  databaseURL: "https://listavenda-default-rtdb.firebaseio.com",
  projectId: "listavenda",
  storageBucket: "listavenda.appspot.com",
  messagingSenderId: "146426502512",
  appId: "1:146426502512:web:151cff147d7718647b83b5"
};
      };

      // Inicialize o Firebase
      firebase.initializeApp(firebaseConfig);

      const database = firebase.firestore();

      const saveTodoFirebase = (text, done = 0) => {
        const tarefasRef = database.collection("tarefas");
        const novaTarefa = {
          text: text,
          done: done
        };
        tarefasRef.add(novaTarefa);
      };

      const removeTodoFirebase = (todoText) => {
        const tarefasRef = database.collection("tarefas");
        tarefasRef
          .where("text", "==", todoText)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          });
      };

      const updateTodoStatusFirebase = (todoText) => {
        const tarefasRef = database.collection("tarefas");
        tarefasRef
          .where("text", "==", todoText)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const doneStatus = !doc.data().done;
              doc.ref.update({ done: doneStatus });
            });
          });
      };

      const updateTodoFirebase = (todoOldText, todoNewText) => {
        const tarefasRef = database.collection("tarefas");
        tarefasRef
          .where("text", "==", todoOldText)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({ text: todoNewText });
            });
          });
      };

      const getTodosFirebase = () => {
        const tarefasRef = database.collection("tarefas");
        return tarefasRef.get().then((querySnapshot) => {
          const todos = [];
          querySnapshot.forEach((doc) => {
            todos.push({
              text: doc.data().text,
              done: doc.data().done
            });
          });
          return todos;
        });
      };