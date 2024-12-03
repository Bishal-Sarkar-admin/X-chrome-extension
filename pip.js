const taskContainer = document.getElementById("task-container");
const addTaskButton = document.getElementById("add-task-button");
const newTaskInput = document.getElementById("new-task");

// Load saved tasks from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTask(task.text, task.completed));
});

// Add a new task
addTaskButton.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    saveTasks();
    newTaskInput.value = "";
  }
});

// Add task to the container
function addTask(taskText, completed = false) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  if (completed) taskDiv.classList.add("completed");

  taskDiv.innerHTML = `
    <span>${taskText}</span>
    <button class="delete-task">X</button>
  `;

  taskDiv.addEventListener("click", () => {
    taskDiv.classList.toggle("completed");
    saveTasks();
  });

  taskDiv.querySelector(".delete-task").addEventListener("click", (e) => {
    e.stopPropagation();
    taskDiv.remove();
    saveTasks();
  });

  taskContainer.appendChild(taskDiv);
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = Array.from(taskContainer.children).map((taskDiv) => ({
    text: taskDiv.querySelector("span").textContent,
    completed: taskDiv.classList.contains("completed"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
