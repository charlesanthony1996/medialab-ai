// In background.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "useTabsAPI") {
        console.log("Message received from content script:", request.data.message)
        // Respond back to the sender (content script)
        
        // sendResponse({response: "Received your message!"})
        sendResponse({response: request.data.message})
      }
      return true
    }
  )
  

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
  
      console.log("Tab updated and loaded: " + tab.url)
    }
})

// chrome.contextMenus.create({
//   id: "myContextMenu",
//   title: "HS not detected? Mark as hatespeech!",
//   contexts: ['selection']
// })

// let manuallyHighlighted

// // Add click event listener to the context menu item
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId === "myContextMenu") {
//       // Display the selected text in an alert
//       manuallyHighlighted = info.selectionText
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({message: manuallyHighlighted})
})