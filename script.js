
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("tasktitle");
const taskList = document.getElementById("task-list");
const errorMsg = document.getElementById("error-msg");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = [];

// Load tasks from localStorage or API on page load
window.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks && storedTasks.length > 0) {
    tasks = storedTasks;
    renderTasks(tasks);
  } else {
    // Fetch tasks from API if localStorage is empty
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then((response) => response.json())
      .then((data) => {
        const apiTasks = data.map((task) => ({
          id: task.id + Date.now(), // unique ID
          title: task.title,
          completed: task.completed,
        }));
        tasks = apiTasks;
        updateLocalStorage();
        renderTasks(tasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }
});

// form submit

function register(event) {
  event.preventDefault();

  if (!$("#task-form").data("validator")) {
    $("#task-form").validate({
      rules: {
        tasktitle: {
          required: true,
          minlength: 5,
          maxlength: 100,
        },
      },
      messages: {
        tasktitle: {
          required: "Task title is required",
          minlength: "Text is too short",
          maxlength: "Title must be no more than 100 characters",
        },
      },
    });
  }

  if ($("#task-form").valid()) {
    newTask();
  }
}

function newTask() {
  const title = taskInput.value; // get title
  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
  };

  tasks.push(newTask);
  updateLocalStorage();
  renderTasks(tasks);

  taskInput.value = "";
  // errorMsg.textContent = "";
  taskInput.classList.remove("error-input");
}

// Render tasks
function renderTasks(taskArray) {
  taskList.innerHTML = "";
  for (let i = 0; i < taskArray.length; i++) {
    const task = taskArray[i];
    // console.log(taskArray[i]);

    const card = document.createElement("div");
    card.className = `task-card ${task.completed ? "completed" : ""}`;

    const title = document.createElement("span");
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "actions"; 
    actions.style.display = 'flex';
    actions.style.gap = '8px';
    actions.style.alignItems = 'center';




    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.onclick = () => completeTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(actions);
    taskList.appendChild(card);
  }
}

// complete task
function completeTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  updateLocalStorage();
  renderTasks(tasks);
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  updateLocalStorage();
  renderTasks(tasks);
}

// filter

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", () => {
    const filter = filterButtons[i].value;
    console.log(filterButtons[i].value);

    if (filter === "all") {
      renderTasks(tasks);
    } else if (filter === "completed") {
      const finishedTask = tasks.filter((task) => task.completed);
      renderTasks(finishedTask);
      // renderTasks(tasks.filter(task => task.completed));
    } else if (filter === "pending") {
      const pendingTask = tasks.filter((task) => !task.completed);
      renderTasks(pendingTask);
      // renderTasks(tasks.filter(task => !task.completed));
    }
  });
}

// LocalStorage update
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
