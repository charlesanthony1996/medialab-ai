chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateComments") {
      // Forward the message to all open tabs or a specific tab
      chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, message);
          });
      });
  }
});

// Example of another message listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.action === "useTabsAPI") {
          console.log("Message received from content script:", request.data.message);
          // Respond back to the sender (content script)
          sendResponse({response: request.data.message});
      }
      return true;
  }
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
      console.log("Tab updated and loaded: " + tab.url);
  }
});
