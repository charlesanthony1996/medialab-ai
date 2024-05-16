// modal.js
export const modalHTML = `
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
document.body.insertAdjacentHTML("beforeend", modalHTML);

const modal = document.getElementById("myModal");
const btn = document.getElementById("openModalButton");
const span = document.getElementsByClassName("close")[0];
const copy = document.getElementById("copy");

span.onclick = function() {
    modal.style.display = "none";
    document.getElementById("counterSpeechText").innerText = "";
}

btn.onclick = function() {
    const commentContainer = document.getElementById('content-text');
    const commentElement = commentContainer.querySelector('.yt-core-attributed-string--white-space-pre-wrap');
    
    if (commentElement) {
        const commentText = commentElement.innerText.trim();
        console.log("Comment Text:", commentText);
        // analyzeCommentAndDisplayCounterSpeech(commentText); // Function call to handle comment text
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
    background-color: #242424; 
    color: #ffffff;
    margin: 15% auto;
    padding: 70px;
    border-radius: 10px;
    width: 40vw;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.close {
    position: absolute;
    top: 10px;
    right: 20px;
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

document.getElementById('generateCounterSpeech').addEventListener('click', function() {
    const commentText = document.getElementById('counterSpeechText').innerText;
    fetch('http://localhost:6001/api/analyze_hate_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.analysis_result) {
            document.getElementById('counterSpeechText').innerText = data.analysis_result;
        } else {
            document.getElementById('counterSpeechText').innerText = "No hate speech detected.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('counterSpeechText').innerText = "Error generating counter speech.";
    });
});
