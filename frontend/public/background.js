import { ref } from 'vue'

const refTag = ref("hello from background.js")

// In background.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "useTabsAPI") {
        console.log("Message received from content script:", request.data.message)
        // Respond back to the sender (content script)
        
        sendResponse({response: "Received your message!"})
      }
    //   works fine i receive the response from the youtube frontend
      return true
    }
);


  

// In background.js
// check why this doesnt work
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {

      console.log("Tab updated and loaded: " + tab.url)
    }
})

export { refTag }