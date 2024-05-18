export function handleTextSelection() {
    document.addEventListener('mouseup', function() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            fetch('http://localhost:6001/api/analyze_hate_speech', {
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
}
