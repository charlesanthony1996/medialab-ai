import { ref, computed } from 'vue'

export const url_name = ref('')

export function getCurrentTab() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            url_name.value = tabs[0].url
            return url_name
    
        }
    })
}



