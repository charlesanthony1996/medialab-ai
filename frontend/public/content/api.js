export function analyzeCommentAndDisplayCounterSpeech(commentText) {
    fetch('http://localhost:6001/api/analyze_hate_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
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
            const counterSpeech = data.counter_speech;
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3 style="font-size:26px;">Counter speech</h3>
                <p id="counterSpeechText">${counterSpeech}</p>
                <button class="copy">Copy</button>
            `;
            document.getElementById("myModal").style.display = "block";
        } else {
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3 style="font-size:26px;">Counter speech</h3>
                <p id="counterSpeechText">No hate speech detected.</p>
                <button class="copy">Copy</button>
            `;
            document.getElementById("myModal").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export function sendCommentToServer(commentText) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/api/process_comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: commentText })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data.comment);
        })
        .catch(error => {
            console.error('Error sending comment to server:', error);
            reject(error);
        });
    });
}
