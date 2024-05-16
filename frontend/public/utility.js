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

const observedCommentsForCopy = new Set();

const observerCallbackForCopy = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            sendCommentToServer(entry.target.innerText)
                .then(result => {
                    observedCommentsForCopy.add(result);
                    if (result !== 'Is not HS') {
                        entry.target.style.backgroundColor = 'lightcoral';
                    } else {
                        entry.target.style.backgroundColor = 'darkolivegreen';
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

const observerForCopy = new IntersectionObserver(observerCallbackForCopy, observerOptionsForCopy);

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment);
        observer.observe(comment);
    });

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => {
        observerForCopy.observe(comment);
        observer.observe(comment);
    });
});
