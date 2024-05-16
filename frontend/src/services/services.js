import { ref, onMounted } from 'vue'

export const url_name = ref('');
export const comment_des = ref([]);

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
        console.log("Error fetching current tab:", error.message);
    }
}

export async function handleMessageListener() {
    if (!isChromeExtension()) {
        console.log("This function only works in a Chrome extension.");
    } else {
        chrome.runtime.onMessage.addListener(handleMessage);
    }
}

export function handleMessage(message, sender, sendResponse) {
    if (message.action === "updateComments") {
        comment_des.value = message.comments;
    }
}

onMounted(async () => {
    await getCurrentTab();
    await handleMessageListener();
});
