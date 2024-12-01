document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-name");
  const taskStatus = document.getElementById("task-status");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  let tasks = [];

  const closeBtn = document.getElementById("close-btn");

  // Close button functionality with multiple messaging methods
  closeBtn.addEventListener("click", () => {
    try {
      // Method 1: Send message to content script
      chrome.runtime.sendMessage({ action: "closeWidget" });

      // Method 2: Direct window close
      window.close();

      // Method 3: Send message to background script
      chrome.runtime.sendMessage({
        action: "closeExtension",
        target: "background",
      });
    } catch (error) {
      console.error("Error closing extension:", error);
    }
  });

  // Load tasks from local storage
  const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = storedTasks;
    renderTasks();
  };

  // Render tasks to the DOM
  const renderTasks = () => {
    taskList.innerHTML = ""; // Clear the list
    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <span class="${task.status === "Completed" ? "completed" : ""}">${
        task.name
      }</span>
        <select class="task-status">
          <option value="Pending" ${
            task.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option value="In Progress" ${
            task.status === "In Progress" ? "selected" : ""
          }>In Progress</option>
          <option value="Completed" ${
            task.status === "Completed" ? "selected" : ""
          }>Completed</option>
        </select>
        <button class="remove-task-btn">X</button>
      `;
      taskList.appendChild(taskItem);
    });
  };

  // Add a new task
  const addTask = () => {
    const taskName = taskInput.value.trim();
    if (taskName === "") {
      alert("Please enter a task name.");
      return;
    }
    const newTask = {
      id: Date.now(),
      name: taskName,
      status: taskStatus.value,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ""; // Clear input
  };

  // Save tasks to local storage
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Remove a task
  const removeTask = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
  };

  // Event listeners
  addTaskBtn.addEventListener("click", addTask);
  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-task-btn")) {
      const taskElement = event.target.closest("li");
      const taskName = taskElement.querySelector("span").textContent;
      removeTask(tasks.find((task) => task.name === taskName).id);
    }
  });

  taskList.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-status")) {
      const taskElement = event.target.closest("li");
      const taskName = taskElement.querySelector("span").textContent;
      const updatedStatus = event.target.value;
      const task = tasks.find((task) => task.name === taskName);
      if (task) {
        task.status = updatedStatus;
        saveTasks();
        renderTasks();
      }
    }
  });

  loadTasks(); // Initial load
});
