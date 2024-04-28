// link to the api
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const observedComments = new Set()

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            observedComments.add(entry.target)
            // button addition on every comment
            appendButtonToComment(entry.target)
            

        } else {
            observedComments.delete(entry.target)
            //entry.target.style.backgroundColor = ''
        }
    })

    // clearing the comments and only highlighting the latest 5 processed
    observedComments.forEach(comment => {
        //comment.style.backgroundColor = ''
    })


    // get the latest 5 comments from the observed comments set
    const latestComments = Array.from(observedComments).slice(-5)
    // console.clear()
    latestComments.forEach((comment, index) => {
        console.log(`Comment ${index + 1}: ${comment.innerText}`)

        // add the styling here to the comment
        // comment.highlight.add('highlight')
        //comment.style.backgroundColor = 'lightcoral'
    })

    chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )})
    
}

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

function appendButtonToComment(commentElement) {
    const button = document.createElement("button")
    button.textContent = 'Open Extension'
    button.style.marginLeft = '10px'
    button.className = 'open-extension-button'

    button.onclick = function() {
        chrome.runtime.sendMessage({ action: "openPopup"})
    }

    commentElement.appendChild(button)
}

const observedCommentsForCopy = new Set();


const observerCallbackForCopy = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            sendCommentToServer(entry.target.innerText)
                .then(result => {
                    // button addition here as well
                    appendButtonToComment(entry.target)
                    // Making it display here 'Is not HS'. Its commented out just to highlight atm
                    // Good for testing
                    // entry.target.innerText = result;
                    console.log(`Server result: ${result}`);
                    console.log('Result:', result); // Log the value of result
                    observedCommentsForCopy.add(result);
                    if (result !== 'Is not HS') {
                        entry.target.style.backgroundColor = 'lightcoral';
                        console.log('Setting background color to lightcoral');
                    } else {
                        entry.target.style.backgroundColor = 'darkolivegreen'
                        console.log('Resetting background color');
                    }
                })
                .catch(error => {
                    console.error('Error sending comment to server:', error);
                });
        } else {
            observedCommentsForCopy.delete(entry.target);
        }
    });
};



const observerOptionsForCopy = {
    root: null,
    rootMargin: '10px',
    threshold: 0.5
}

const observerForCopy = new IntersectionObserver(observerCallbackForCopy, observerOptionsForCopy)

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment)
        // appendButtonToComment(comment)
    })

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment)
        // appendButtonToComment(comment)
})
})

const sendCommentToServer = (commentText) => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/api/process_comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: commentText })  // Sending single comment with key 'comment'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response JSON
        })
        .then(data => {
            console.log('Comment sent successfully');
            resolve(data.comment); // Resolve with the comment from the response
        })
        .catch(error => {
            console.error('Error sending comment to server:', error);
            reject(error);
        });
    });
};


document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText.length > 0) {
        fetch('http://localhost:8000/api/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
        })
        .then(response => response.json())
        .then(data => {
            alert("Analysis Result: " + data.filtered_text);
            selection.removeAllRanges();  // Unhighlight the text
        })
        .catch(error => console.error('Error:', error));
    }
});