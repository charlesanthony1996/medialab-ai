import { analyzeCommentAndDisplayCounterSpeech } from './api.js'
import { handleTextSelection } from './textSelection.js'

export function initModal() {
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
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openModalButton");
    const span = document.getElementsByClassName("close")[0];
    const copy = document.getElementById("copy");

    span.onclick = function() {
        modal.style.display = "none";
        document.getElementById("counterSpeechText").innerText = "";
    };

    btn.onclick = function() {
        const commentContainer = document.getElementById('content-text');
        const commentElement = commentContainer.querySelector('.yt-core-attributed-string--white-space-pre-wrap');

        if (commentElement) {
            const commentText = commentElement.innerText.trim();
            console.log("Comment Text:", commentText);
            analyzeCommentAndDisplayCounterSpeech(commentText);
        } else {
            console.log("Comment element not found.");
        }
    };

    copy.onclick = function() {
        console.log("copied");
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none"
            document.getElementById("counterSpeechText").innerText = ""
        }
    };

    handleTextSelection()

}
