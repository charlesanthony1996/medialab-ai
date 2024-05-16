import { appendButtonToComment } from './utility.js';

const observedComments = new Set();

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observedComments.add(entry.target);
        } else {
            observedComments.delete(entry.target);
        }
    });

    const latestComments = Array.from(observedComments).slice(-5);
    console.log("Preparing to send message:", latestComments.map(comment => comment.innerText));
    chrome.runtime.sendMessage({ action: "updateComments", comments: latestComments.map(comment => comment.innerText )});
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
            appendButtonToComment(entry.target);
        } else {
            observedComments.delete(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
    .forEach(comment => observer.observe(comment));

window.addEventListener('scroll', () => {
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')
        .forEach(comment => observer.observe(comment));
});
