// popup.js

document.addEventListener('DOMContentLoaded', function() {
    let extensionEnabled = true;

    function updateButton() {
        const button = document.getElementById("toggleButton");
        if (extensionEnabled) {
            button.textContent = "익스텐션 비활성화";
        } else {
            button.textContent = "익스텐션 활성화";
        }
    }

    updateButton();

    document.getElementById("toggleButton").addEventListener("click", function() {
        extensionEnabled = !extensionEnabled;
        updateButton();
        chrome.runtime.sendMessage({ action: "toggleExtension", enabled: extensionEnabled });
    });
});