// Set up the modal HTML and CSS once, not inside the appendButtonToComment function
const modalHTML = `
<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h1 class="modal-text">Counter speech</h1>
    <p id="counterSpeechText" class="modal-counter"></p>
    <button id="copy" class="modal-btn">Copy</button>
    <button id="generateCounterSpeech" class="modal-btn-gen">Generate Counter speech</button>
  </div>
</div>
<button id="openModalButton" class="open-modal-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
</button>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML)

const modal = document.getElementById("myModal");
const btn = document.getElementById("openModalButton");
const span = document.getElementsByClassName("close")[0];
const copy = document.getElementById("copy")

span.onclick = function() {
    modal.style.display = "none";
    // Clean up modal content
    document.getElementById("counterSpeechText").innerText = "";
}

btn.onclick = function() {
    // Locate the container that holds the comment text
    console.log("button hit")
    const commentContainer = document.getElementById('content-text');

    // Access the specific span containing the text
    const commentElement = commentContainer.querySelector('.yt-core-attributed-string--white-space-pre-wrap');
    
    if (commentElement) {
        const commentText = commentElement.innerText.trim();
        console.log("Comment Text:", commentText);
        // If you have a function to handle this text, call it here
        // analyzeCommentAndDisplayCounterSpeech(commentText);
    } else {
        console.log("Comment element not found.");
    }
};


copy.onclick = function() {
    console.log("copied")
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        // Clean up modal content
        document.getElementById("counterSpeechText").innerText = "";
    }
}

const css = `
.modal {
    display: none; 
    position: fixed;  
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto;
    background-color: rgba(0,0,0,0.4); 
}
.modal-content {
    background-color: #242424; /* Black background for better visibility */
    color: #ffffff; /* White text for contrast */
    margin: 15% auto;
    padding: 70px; /* Increased padding for more space around the text */
    border-radius: 10px;
    width: 40vw; /* Adjusted width */
    max-width: 800px; /* Adjusted max width */
    display: flex; /* Set display to flex */
    flex-direction: column; /* Stack children vertically */
    justify-content: center; /* Center children horizontally */
    align-items: center; /* Center children vertically */
    z-index: 9999; /* Ensure it's above the modal overlay */
}

.close {
    position: absolute; /* Positioning relative to modal-content */
    top: 10px; /* Distance from the top of modal-content */
    right: 20px; /* Distance from the right of modal-content */
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .close:hover, .close:focus {
    color: #646cff;
    text-decoration: none;
    cursor: pointer;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

// Function to send comment text to backend server for analysis
function analyzeCommentAndDisplayCounterSpeech(commentText) {
    fetch('http://localhost:6001/api/analyze_hate_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText }) // Sending comment text under 'text' key
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const modalContent = document.querySelector(".modal-content");
        if (data.analysis_result === "Hate Speech") {
            // If classified as hate speech, display counter speech in modal
            const counterSpeech = data.counter_speech;
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3 style="font-size:26px;">Counter speech</h3>
                <p id="counterSpeechText">${counterSpeech}</p>
                <button class="copy">Copy</button>
            `;
            modal.style.display = "block";
        } else {
            // If not classified as hate speech, show "No hate speech detected."
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3 style="font-size:26px;">Counter speech</h3>
                <p id="counterSpeechText">No hate speech detected.</p>
                <button class="copy">Copy</button>
            `;
            modal.style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




function appendButtonToComment(commentElement) {
    if (!commentElement.hasAttribute("data-button-appended")) {
        const button = btn.cloneNode(true);  // Clone the button for each comment
        button.style.display = 'inline';  // Make the button visible

        // Attach an event listener to this newly created button
        button.onclick = function() {
            // Set the comment text in the modal
            const commentText = commentElement.innerText.trim();
            document.getElementById("counterSpeechText").innerText = commentText;
            modal.style.display = "block";
        };

        commentElement.appendChild(button);
        commentElement.setAttribute("data-button-appended", "true"); // Mark this comment as having a button
    }
}


// IntersectionObserver and other event listeners remain the same


// IntersectionObserver and other event listeners remain the same







// link to the api
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const observedComments = new Set()

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            observedComments.add(entry.target)
            // button addition on every comment
            // appendButtonToComment(entry.target)
            

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
        // console.log(`Comment ${index + 1}: ${comment.innerText}`)

        // add the styling here to the comment
        // comment.highlight.add('highlight')
        //comment.style.backgroundColor = 'lightcoral'
    })

    console.log("Preparing to send message:", latestComments.map(comment => comment.innerText));
    chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )})
    
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observedComments.add(entry.target);
            appendButtonToComment(entry.target); // Ensure the button is appended to each comment
        } else {
            observedComments.delete(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

const observer2 = new IntersectionObserver(observerCallback, observerOptions)

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observer.observe(comment), comment => observer2.observe(comment));

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
        .forEach(comment => observer.observe(comment), comment => observer2.observe(comment))
});


// modal stuff


// IntersectionObserver and other event listeners remain the same


// detecting for hate speech
// Function to send comment text to backend server for analysis
// function analyzeCommentAndDisplayCounterSpeech(commentText) {
//     fetch('http://localhost:6001/api/analyze_hate_speech', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ text: commentText }) // Sending comment text under 'text' key
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.analysis_result === "Hate Speech") {
//             // If classified as hate speech, display counter speech in modal
//             const counterSpeech = data.counter_speech;
//             console.log("yo read this: ", data.counterSpeech)
//             // Update modal content with counter speech
//             const modalContent = document.querySelector(".modal-content");
//             modalContent.innerHTML = `
//                 <span class="close">&times;</span>
//                 <h3 style="font-size:26px;">Counter speech</h3>
//                 <p>${counterSpeech}</p>
//                 <button class="copy">Copy</button>
//             `;
//             // Display modal
//             modal.style.display = "block";
//         } else {
//             // If not classified as hate speech, handle it differently
//             console.log("Comment is not hate speech");
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }




const observedCommentsForCopy = new Set();


const observerCallbackForCopy = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // analyzeCommentAndDisplayCounterSpeech(entry.target.innerText)
            sendCommentToServer(entry.target.innerText)
                .then(result => {
                    // button addition here as well
                    // appendButtonToComment(entry.target)
                    // Making it display here 'Is not HS'. Its commented out just to highlight atm
                    // Good for testing
                    // entry.target.innerText = result;
                    // console.log(`Server result: ${result}`);
                    console.log('Result:', result); // Log the value of result
                    observedCommentsForCopy.add(result);
                    if (result !== 'Is not HS') {
                        entry.target.style.backgroundColor = 'lightcoral';
                        // console.log('Setting background color to lightcoral');
                    } else {
                        entry.target.style.backgroundColor = 'darkolivegreen'
                        // console.log('Resetting background color');
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
    rootMargin: '0px',
    threshold: 0.1
}

const observerForCopy = new IntersectionObserver(observerCallbackForCopy, observerOptionsForCopy)

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment)
        // appendButtonToComment(comment)
        observer2.observe(comment)
    })

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment)
        // appendButtonToComment(comment)
        observer2.observe(comment)

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
            // console.log('Comment sent successfully');
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
            selection.removeAllRanges();
        })
        .catch(error => console.error('Error:', error));
    }
});


// function handleReplyInteraction() {
//     const replyButtons = document.querySelectorAll('ytd-button-renderer#reply-button-end button')

//     if(replyButtons.length > 0) {
//         replyButtons[0].click()

//         setTimeout(() => {
//             const editableDiv = document.querySelector("#contenteditable-root")

//             if(editableDiv) {
//                 editableDiv.focus()
//                 editableDiv.innerText = "Im sonic and im fast"


//                 // trigger event to simulate user input
//                 const event = new Event('input', {
//                     bubbles: true,
//                     cancelable: true
//                 })
//                 editableDiv.dispatchEvent(event)
//             }
//         }, 5000)
//     }
// }

// window.addEventListener("scroll", handleReplyInteraction)

// delayInteractionStart() 


// Correct method to inject HTML

document.getElementById('generateCounterSpeech').addEventListener('click', function() {
    // Get the current text displayed in the modal
    const commentText = document.getElementById('counterSpeechText').innerText;

    // Send the text to the backend to analyze and generate counter speech
    fetch('http://localhost:6001/api/analyze_hate_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText }) // Sending the displayed comment text
    })
    .then(response => response.json())
    .then(data => {
        // Check the response for counter speech or indication of no hate speech
        if (data.analysis_result) {
            // Display the generated counter speech in the modal
            document.getElementById('counterSpeechText').innerText = data.analysis_result;
        } else {
            // If no counter speech is generated, display a no hate speech message
            document.getElementById('counterSpeechText').innerText = "No hate speech detected.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('counterSpeechText').innerText = "Error generating counter speech.";
    });
});