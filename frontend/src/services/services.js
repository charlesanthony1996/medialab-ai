import { ref, computed, onMounted } from 'vue'

// export const tabLoaded = ref('not loaded');

// export function getCurrentTab() {
//     return new Promise((resolve, reject) => {
//         chrome.tabs.query({ active: true, lastFocusedWindow: true}, (tabs) => {
//             if(tabs.length > 0) {
//                 url_name.value = tabs[0].url
//                 resolve(url_name.value)
//             } else {
//                 reject(new Error("no active tab found"))
//             }
//         })
//     })
// }


// checking for a specific url whether it was loaded or not
// this doesnt work and is not needed
// export function getExampleTabAsync() {
//     return new Promise((resolve, reject) => {
//         const listener = function(tabId, changeInfo, tab) {
//             if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
//                 console.log("Tab updated and loaded: " + tab.url);
//                 tabLoaded.value = "loaded";
                
//                 // Clean up this listener since we've accomplished our goal
//                 chrome.tabs.onUpdated.removeListener(listener);
                
//                 // Resolve the promise indicating we're done
//                 resolve(tabLoaded.value);
//             }
//         };
        
//         // Add the listener to chrome.tabs.onUpdated
//         chrome.tabs.onUpdated.addListener(listener);
//     });
// }

// is it a chrome extension?
// import { ref } from 'vue';

export const url_name = ref('');

export function isChromeExtension() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

export async function getCurrentTab() {
    if (!isChromeExtension()) {
        console.log("This function is only available in a Chrome extension.");
        return;
    }
    try {
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tabs.length > 0) {
            url_name.value = tabs[0].url;
            console.log("Current tab URL is:", url_name.value);
            return url_name.value;
        } else {
            throw new Error("No active tab found");
        }
    } catch (error) {
        console.error("Error fetching current tab:", error.message);
    }
}



onMounted(async () => {
    getCurrentTab()
    url_name

    // trying to see whether you see loaded or not for example.com
    // tabUrl.value = await getCurrentTabAsync()
    // await getCurrentTabAsync()

    // const checkTabURL = (tabId, changeInfo, tab) => {
    //     if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
    //         console.log("Tab updated and loaded: " + tab.url);
    //         tabLoaded.value = "loaded"; // This updates the reactive property directly
    //     } else {
    //         tabLoaded.value = "not loaded";
    //     }
    // };

    // chrome.tabs.onUpdated.addListener(checkTabURL);

    // // getting "hello" here
    // chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
    //     if(request.action === "useTabsAPI") {
    //         receivedMessage.value = request.data.message
    //         return receivedMessage

    //     }
    // })
})