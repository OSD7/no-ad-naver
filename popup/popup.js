document.addEventListener('DOMContentLoaded', () => {
    const toggleExtension = document.getElementById('toggle-extension');
    const toggleJs = document.getElementById('toggle-js');
    const togglePopups = document.getElementById('toggle-popups');
    const openOptions = document.getElementById('open-options');

    chrome.storage.sync.get(['isEnabled', 'blockJavaScript', 'blockPopups'], (data) => {
        toggleExtension.checked = data.isEnabled !== undefined ? data.isEnabled : true;
        toggleJs.checked = data.blockJavaScript || false;
        togglePopups.checked = data.blockPopups || false;
    });

    toggleExtension.addEventListener('change', () => {
        chrome.storage.sync.set({ isEnabled: toggleExtension.checked });
    });

    toggleJs.addEventListener('change', () => {
        chrome.storage.sync.set({ blockJavaScript: toggleJs.checked });
    });

    togglePopups.addEventListener('change', () => {
        chrome.storage.sync.set({ blockPopups: togglePopups.checked });
    });

    openOptions.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});