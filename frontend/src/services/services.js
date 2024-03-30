import { ref, computed, onMounted } from 'vue'

export const url_name = ref('')

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

// onMounted(() => {
//     async function getCurrentTab() {
//         chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//             if (tabs.length > 0) {
//                 url_name.value = tabs[0].url
//                 return url_name
//             }
//         })
//     }
// })