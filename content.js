console.log('Content script loaded.');

chrome.runtime.sendMessage({ action: 'fetchAndCleanHTML', htmlContent: document.documentElement.outerHTML }, function(response) {
  if (response && response.cleanedContent) {
    document.open();
    document.write(response.cleanedContent);
    document.close();
  }
});