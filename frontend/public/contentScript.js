// console.log("script loads now 2")

// link to the api
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const observedComments = new Set()

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            observedComments.add(entry.target)
            entry.target.style.backgroundColor = 'lightcoral'

        } else {
            observedComments.delete(entry.target)
            entry.target.style.backgroundColor = ''
        }
    })

    // clear previous highlights
    // document.querySelectorAll('.highlight').forEach(el => {
    //     el.classList.remove('highlight')
    //     el.style.backgroundColor = ''
    // })

    // clearing the comments and only highlighting the latest 5 processed
    observedComments.forEach(comment => {
        comment.style.backgroundColor = ''
    })


    // get the latest 5 comments from the observed comments set
    const latestComments = Array.from(observedComments).slice(-5)
    // console.clear()
    latestComments.forEach((comment, index) => {
        console.log(`Comment ${index + 1}: ${comment.innerText}`)

        // add the styling here to the comment
        // comment.highlight.add('highlight')
        comment.style.backgroundColor = 'lightcoral'
    })

    chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )})
    
}

// chrome.runtime.sendMessage({action: "useTabsAPI", data: { message: "hello" }}, function(response) {
//     console.log(response.response)
// })
  

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
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

const observedCommentsForCopy = new Set();

const observerCallbackForCopy = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observedCommentsForCopy.add(entry.target);
            // Send each comment to the server
            // sendCommentToServer(entry.target.innerText);
        } else {
            observedCommentsForCopy.delete(entry.target);
        }
    })
}

// const sendCommentToServer = (commentText) => {
//     fetch('http://localhost:8000/api/process_comments', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ comments: [commentText] })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Comment sent successfully:', data);
//     })
//     .catch(error => {
//         console.error('Error sending comment to server:', error);
//     });
// };

const observerOptionsForCopy = {
    root: null,
    rootMargin: '10px',
    threshold: 0.5
}

const observerForCopy = new IntersectionObserver(observerCallbackForCopy, observerOptionsForCopy)

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observerForCopy.observe(comment))

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observerForCopy.observe(comment))
})

// using the same consistent extension size function from services
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.windows.create({
//         url: chrome.runtime.getURL("index.html"),
//         type: "popup",
//         width: 400,
//         height: 800
//     })
// })