// import { ref } from 'vue'

// const refTag = ref("hello from background.js")

// In background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "useTabsAPI") {
      console.log("Message received from content script:", request.data.message)
      // Respond back to the sender (content script)
      
      // sendResponse({response: "Received your message!"})
      sendResponse({response: request.data.message})
    }
  //   works fine i receive the response from the youtube frontend
    return true
  }
)

