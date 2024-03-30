import { ref, computed, onMounted } from 'vue'

export const url_name = ref('')

export const tabLoaded = ref('not loaded');

export function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true}, (tabs) => {
            if(tabs.length > 0) {
                url_name.value = tabs[0].url
                resolve(url_name.value)
            } else {
                reject(new Error("no active tab found"))
            }
        })
    })
}


export function getExampleTabAsync() {
    return new Promise((resolve, reject) => {
        const listener = function(tabId, changeInfo, tab) {
            if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
                console.log("Tab updated and loaded: " + tab.url);
                tabLoaded.value = "loaded";
                
                // Clean up this listener since we've accomplished our goal
                chrome.tabs.onUpdated.removeListener(listener);
                
                // Resolve the promise indicating we're done
                resolve(tabLoaded.value);
            }
        };
        
        // Add the listener to chrome.tabs.onUpdated
        chrome.tabs.onUpdated.addListener(listener);
    });
}


onMounted(async () => {

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

    try {
        const status = await getExampleTabAsync();
        console.log("Tab load status:", status);
    } catch (error) {
        console.error("Failed to load the tab:", error);
    }


    // url_name
    try {
        await getCurrentTab()
        console.log(url_name.value)
    } catch(error) {
        console.log(error)
    }
})