// Handle extension closure
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeExtension") {
    // Close the current tab or window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
  }
});

// Existing click listener to inject content script
chrome.action.onClicked.addListener((tab) => {
  try {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (error) {
    console.error("Error executing content script:", error);
  }
});
