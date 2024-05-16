export function appendButtonToComment(commentElement) {
    if (!commentElement.hasAttribute("data-button-appended")) {
        const button = document.getElementById("openModalButton").cloneNode(true);
        button.style.display = 'inline';

        button.onclick = function() {
            const commentText = commentElement.innerText.trim();
            document.getElementById("counterSpeechText").innerText = commentText;
            document.getElementById("myModal").style.display = "block";
        };

        commentElement.appendChild(button);
        commentElement.setAttribute("data-button-appended", "true");
    }
}
