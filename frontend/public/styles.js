export function applyStyles() {
    const css = `
    .modal {
        display: none; 
        position: fixed;  
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        overflow: auto;
        background-color: rgba(0,0,0,0.4); 
    }
    .modal-content {
        background-color: #242424; 
        color: #ffffff;
        margin: 15% auto;
        padding: 70px; 
        border-radius: 10px;
        width: 40vw; 
        max-width: 800px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .close {
        position: absolute; 
        top: 10px; 
        right: 20px;
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    .close:hover, .close:focus {
        color: #646cff;
        text-decoration: none;
        cursor: pointer;
    }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}
