import { appendButtonToComment } from './utility.js';
import { sendCommentToServer } from './api.js';

export function initObservers() {
    const observedComments = new Set();

    const observerCallback = async (entries) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                observedComments.add(entry.target);
                try {
                    const commentText = entry.target.innerText;
                    const result = await sendCommentToServer(commentText);
                    console.log('Server response:', result);
                } catch (error) {
                    console.error('Error sending comment to server:', error);
                }
            } else {
                observedComments.delete(entry.target);
            }
        });

        const latestComments = Array.from(observedComments).slice(-5);
        console.log("Preparing to send message:", latestComments.map(comment => comment.innerText));
        chrome.runtime.sendMessage({
            action: "updateComments",
            comments: latestComments.map(comment => comment.innerText)
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
        .forEach(comment => observer.observe(comment));

    window.addEventListener('scroll', () => {
        document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
            .forEach(comment => observer.observe(comment));
    });
}
