import { analyzeCommentAndDisplayCounterSpeech, explain_hate_speech, generateCounterSpeech, callFakeFunction } from './api.js';
import { handleTextSelection } from './textSelection.js';

export function initModal() {
    const modalHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h1 class="modal-text">Counter speech</h1>
            <p id="commentText" class="modal-counter"></p>
            <p id="counterSpeechText" class="modal-counter"></p>
            <p id="explanationText" class="modal-counter"></p>
            <p id="testFakeFunctionText" class="modal-counter"></p>
            <button id="copy" class="modal-btn">Copy</button>
            <button id="reply" class="modal-btn">Reply</button>
            <button id="generateCounterSpeech" class="modal-btn">Generate Counter speech</button>
            <button id="explanation" class="modal-btn">Why is this hate speech?</button>
            <button id="testFakeFunction" class="modal-btn">Test Fake Function</button>
        </div>
    </div>
    <button id="openModalButton">
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="20" height="20" viewBox="0 0 50 10" fill="#000"
    preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,21.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
            <path d="M170 365 c-19 -14 -56 -28 -83 -31 l-50 -7 6 -73 c9 -116 60 -209
            134 -240 41 -18 74 -6 126 44 44 43 77 135 77 217 l0 52 -48 7 c-26 3 -64 17
            -84 31 -20 14 -38 25 -40 25 -2 -1 -19 -12 -38 -25z m85 -35 c22 -11 52 -20
            68 -20 l30 0 -7 -57 c-10 -90 -27 -133 -67 -175 -41 -43 -68 -48 -116 -18 -41
            25 -69 80 -83 161 -14 88 -14 89 18 89 15 0 45 9 67 19 51 24 44 24 90 1z"/>
            <path d="M176 305 c-11 -8 -33 -15 -49 -15 l-29 0 4 -57 c3 -32 11 -71 17 -88
            l13 -30 79 83 80 84 -38 19 c-44 23 -52 23 -77 4z"/>
            <path d="M233 182 c-73 -80 -87 -102 -62 -102 15 0 150 160 147 176 -2 10 -29
            -13 -85 -74z"/>
            <path d="M256 125 c-26 -31 -46 -58 -44 -60 9 -10 68 37 83 65 28 55 11 53
            -39 -5z"/>
        </g>
    </svg>
    </button>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openModalButton");
    const span = document.getElementsByClassName("close")[0];
    const copy = document.getElementById("copy");
    const exp = document.getElementById("explanation");
    const genCounterSpeech = document.getElementById("generateCounterSpeech");
    const testFake = document.getElementById("testFakeFunction");

    btn.style.display = 'inline-flex';
    btn.style.backgroundColor = '#f0f0f0';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '5px';
    btn.style.padding = '0px';
    btn.style.cursor = 'pointer';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    span.onclick = function() {
        modal.style.display = "none"
        // document.getElementById("commentText").innerText = ""
        // document.getElementById("counterSpeechText").innerText = ""
    }

    // btn.onclick = function() {
    //     const commentContainer = document.getElementById('content-text')
    //     const commentElement = commentContainer.querySelector('.yt-core-attributed-string--white-space-pre-wrap')

    //     if (commentElement) {
    //         const commentText = commentElement.innerText.trim();
    //         document.getElementById("commentText").innerText = commentText
    //         console.log("Comment Text set in modal:", commentText)
    //         document.getElementById("myModal").style.display = "block"
    //     } else {
    //         console.log("Comment element not found.")
    //         document.getElementById("counterSpeechText").innerText = "Comment element not found."
    //     }
    // }

    copy.onclick = function() {
        const counterSpeechText = document.getElementById("counterSpeechText").innerText
        navigator.clipboard.writeText(counterSpeechText).then(() => {
            console.log("Copied to clipboard");
        }).catch(err => {
            console.log("Error copying to clipboard: ", err)
        })
    }

    exp.onclick = function() {
        const commentText = document.getElementById("commentText").innerText.trim()
        // if (!commentText) {
        //     document.getElementById("counterSpeechText").innerText = "No comment text found."
        //     return;
        // }
        explain_hate_speech(commentText)
    };

    genCounterSpeech.onclick = function() {
        const commentText = document.getElementById("commentText").innerText.trim()
        // console.log(commentText)
        // if (!commentText) {
        //     document.getElementById("counterSpeechText").innerText = "No comment text found."
        //     return
        // }
        generateCounterSpeech(commentText)
    }

    testFake.onclick = function() {
        const commentText = document.getElementById("commentText").innerText.trim()
        // if (!commentText) {
        //     document.getElementById("counterSpeechText").innerText = "No comment text found."
        //     return
        // }
        callFakeFunction(commentText)
    }

    // window.onclick = function(event) {
    //     if (event.target === modal) {
    //         modal.style.display = "none";
    //         document.getElementById("commentText").innerText = ""
    //         document.getElementById("counterSpeechText").innerText = ""
    //     }
    // };

    // window.onclick = function(event) {
    //     if (event.target === modal) {
    //         modal.style.display = "none";
    //         document.getElementById("commentText").innerText = ""
    //         document.getElementById("explanationText").innerText = ""
    //     }
    // };

    // window.onclick = function(event) {
    //     if (event.target === modal) {
    //         modal.style.display = "none";
    //         document.getElementById("commentText").innerText = ""
    //         document.getElementById("testFakeFunction").innerText = ""
    //     }
    // };

    handleTextSelection();
}
