export function analyzeCommentAndDisplayCounterSpeech(commentText) {
    fetch('http://localhost:8000/api/analyze_hate_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
    .then(data => {
        const modalContent = document.querySelector(".modal-content")
        const isHateSpeech = data.analysis_result === "Hate Speech"
        const counterSpeech = isHateSpeech ? data.counter_speech : "No hate speech detected."
        
        document.getElementById("counterSpeechText").innerText = counterSpeech

        if (isHateSpeech) {
            document.getElementById("explanation").style.display = "block"
        } else {
            document.getElementById("explanation").style.display = "none"
        }

        document.getElementById("myModal").style.display = "block"
    })
    .catch(error => {
        console.error('Error:', error)
    })
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
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(data => {
            resolve(data.comment)
        })
        .catch(error => {
            console.error('Error sending comment to server:', error)
            reject(error)
        })
    })
}

export function generateCounterSpeech(commentText) {
    console.log("Sending payload:", { text: commentText }); // Log the payload being sent
    fetch("http://localhost:6001/api/generate_counter_speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
        if (data.counter_speech_result) {
            document.getElementById("counterSpeechText").innerText = data.counter_speech_result;
        } else {
            document.getElementById("counterSpeechText").innerText = "No counter speech generated.";
        }
    })
    .catch(error => {
        console.log("Error generating counter speech:", error);
        document.getElementById("counterSpeechText").innerText = "Error generating counter speech.";
    });
}



export function explain_hate_speech(commentText) {
    fetch("http://localhost:6001/api/explain_hate_speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
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
        console.log(data)
        if (data.explanation_result) {
            document.getElementById("explanationText").innerText = data.explanation_result;
            // console.log(data.explanation_result)
        } else {
            document.getElementById("explanationText").innerText = "No explanation given";
            // console.log("no exp given")
        }
    })
    .catch(error => {
        console.log("Error generating counter speech:", error)
        document.getElementById("explanationText").innerText = "Error generating explanation."
    });
}

export function callFakeFunction(commentText) {
    fetch("http://localhost:6001/api/fake_response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            // console.log(data)
            document.getElementById("testFakeFunctionText").innerText = data.fake_response
        } else {
            document.getElementById("testFakeFunctionText").innerText = "No response generated."
        }
        // document.getElementById("testFakeFunction").innerText = data;
        // console.log(data)
    })
    .catch(error => {
        console.log("Error calling fake function:", error);
        document.getElementById("testFakeFunctionText").innerText = "Error calling fake function."
    });
}
