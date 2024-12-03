// Listen for when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 400,
    height: 500,
  });
});

// Optional: Listen for storage changes to sync tasks across windows
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.tasks) {
    console.log("Tasks updated:", changes.tasks.newValue);
  }
});
