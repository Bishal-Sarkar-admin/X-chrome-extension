// Create the container for the To-Do widget
const container = document.createElement("div");
container.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
  z-index: 999999;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  resize: both;
  background: white;
  max-width: 90vw;
  max-height: 90vh;
`;

// Create the iframe to load the To-Do widget
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("index.html");
iframe.style.cssText = `
  width: 100%;
  height: 100%;
  border: none;
`;
container.appendChild(iframe);
document.body.appendChild(container);

// Improved drag functionality with boundary checks
let isDragging = false;
let offsetX, offsetY;

container.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", stopDrag);

function startDrag(e) {
  if (e.target !== container) return;

  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;

  container.style.cursor = "grabbing";
}

function drag(e) {
  if (!isDragging) return;

  // Boundary checks
  const maxX = window.innerWidth - container.offsetWidth;
  const maxY = window.innerHeight - container.offsetHeight;

  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;

  // Constrain to viewport
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  container.style.left = `${newX}px`;
  container.style.top = `${newY}px`;
}

function stopDrag() {
  isDragging = false;
  container.style.cursor = "grab";
}
// Existing code remains the same

// Listen for close message from script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeWidget") {
    // Remove the entire container
    const container = document.querySelector('div[style*="position: fixed"]');
    if (container) {
      container.remove();
    }
  }
});

// Add message listener to handle widget closure
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeWidget") {
    // Remove the entire container
    const container = document.querySelector('div[style*="position: fixed"]');
    if (container) {
      container.remove();
    }
  }
});
