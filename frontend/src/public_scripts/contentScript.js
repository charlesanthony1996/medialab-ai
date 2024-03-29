console.log("script loads now 2")

// link to the api
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const observedComments = new Set()

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            observedComments.add(entry.target)
        } else {
            observedComments.delete(entry.target)
        }
    })

    // get the latest 5 comments from the observed comments set
    const latestComments = Array.from(observedComments).slice(-5)
    // console.clear()
    latestComments.forEach((comment, index) => {
        console.log(`Comment ${index + 1}: ${comment.innerText}`)
    })

    // chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )})
    
}

// chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )})

// chrome.runtime.sendMessage({greeting: "hello"})

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete') {
//         chrome.tabs.sendMessage(tabId, {greeting: "hello"}, function(response) {
//             console.log(response.farewell);
//         });
//     }
// });

// In contentScript.js
chrome.runtime.sendMessage({action: "useTabsAPI", data: { message: "hello" }})

chrome.runtime.sendMessage({action: "useTabsAPI", data: { message: "hello" }}, function(response) {
    console.log(response.response)
})
  

const observerOptions = {
    root: null,
    rootMargin: '10px',
    threshold: 0.5
}

const observer = new IntersectionObserver(observerCallback, observerOptions)

// assuming comments are initially present otherwise you may need to wait or retry this
document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observer.observe(comment))


// listen to scroll to attach observer to dynamically loaded comments
window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observer.observe(comment))
})

// setInterval(() => {
//     const comments = document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');

//     // for (let i = 0; i < comments.length && i < 5; i++) {
//     //     console.log(`Comment ${i + 1}: ${comments[i].innerText}`);
//     // }

//     for (let i = 0; i < comments.length; i++) {

//         const commentTextElement = comments[i].querySelector('#content')
//         if (commentTextElement) {
//             console.log(`Comment ${i + 1}: ${commentTextElement}`)
//         }
//     }
// }, 4000)

// things to do
// get the comments displyed on the extension view
// make the ui persistent?
// how to export the comments to hatespeech.vue?
// looks like the dom tree had to be adjusted again? check it
// not saving or storing comments. fixed issue with arthur
// how do we use the youtube api? do we need it?


// element.addEventListener('touchstart', event => {

// }, { passive: true })

// does not work
// export { observedComments }