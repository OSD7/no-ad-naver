 // background.js

console.log("Service worker is running.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker is installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
});