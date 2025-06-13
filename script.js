// let parentElement = document.getElementById("task-list")
//   let storedTask = localStorage.getItem("tasks") 
//  parentElement.innerHTML= storedTask


// function addTask(event) {
//  event.preventDefault()
//     console.log('submit');
//    let newTask = document.getElementById("task-input").value
//    console.log(newTask);
   
//    parentElement.innerHTML  +=`<li>${newTask}</li>`
//    localStorage.setItem("tasks" , parentElement.innerHTML)
   
   
// }

// function clearTask() {
//     localStorage.removeItem("tasks")
//     parentElement.innerHTML=""
// }


const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-title');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = [];

// Load tasks from localStorage on page load
// window.addEventListener('DOMContentLoaded', () => {
//   const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   tasks = storedTasks;
//   renderTasks(tasks);
// });

// Load tasks from localStorage or API on page load
window.addEventListener('DOMContentLoaded', () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));

  if (storedTasks && storedTasks.length > 0) {
    tasks = storedTasks;
    renderTasks(tasks);
  } else {
    // Fetch tasks from API if localStorage is empty
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(response => response.json())
      .then(data => {
        const apiTasks = data.map(task => ({
          id: task.id + Date.now(), // unique ID
          title: task.title,
          completed: task.completed
        }));
        tasks = apiTasks;
        updateLocalStorage();
        renderTasks(tasks);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
      });
  }
});

// Form submit
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
   const title = taskInput.value.trim();
  
   if (!title) {
     errorMsg.textContent = 'Task title cannot be empty.';
    taskInput.classList.add('error-input');
     return;
  }


// $('#task-form').validate({
//     rules:{
//        tasktitle:{
//             required:true,
//             minlength:3,
//             maxlength:15

//         },
        
//     },
//     messages :{
//            tasktitle:{

//             required:'required',
//             minlength:'less',
//             maxlength:'more'
//         },
//     }
    
// })
   









  const newTask = {
    id: Date.now(),
    title,
    completed: false
  };

  tasks.push(newTask);
  updateLocalStorage();
  renderTasks(tasks);

  taskInput.value = '';
  errorMsg.textContent = '';
  taskInput.classList.remove('error-input');
});

// Render tasks
function renderTasks(taskArray) {
   taskList.innerHTML = '';
  for (let i = 0; i < taskArray.length; i++){
    const task = taskArray[i]
    console.log(taskArray[i]);
    
const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    
    const title = document.createElement('span');
    title.textContent = task.title;

    const actions = document.createElement('div');

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = () => completeTask(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(actions);
    taskList.appendChild(card);
  };
}
  
    

// complete task
function completeTask(id) {
  tasks = tasks.map(task =>
  
    {
      if (task.id===id){
        task.completed = !task.completed
      }
      return(task)
    }
  );
  updateLocalStorage();
  renderTasks(tasks);
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateLocalStorage();
  renderTasks(tasks);
}


for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', () => {
    const filter = filterButtons[i].value; 
    console.log(filterButtons[i].value);
    
    if (filter === 'all') {
      renderTasks(tasks);
    } else if (filter === 'completed') {
      const completeTask =tasks.filter(task => task.completed);
renderTasks(completeTask)
      // renderTasks(tasks.filter(task => task.completed));
    } else if (filter === 'pending') {
const pendingTask = tasks.filter(task => !task.completed);
renderTasks(pendingTask)
      // renderTasks(tasks.filter(task => !task.completed));
    }
  });
}


// LocalStorage update
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}