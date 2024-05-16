import './modal.js';
import './observer.js';
import './api.js';
import './utility.js';

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
