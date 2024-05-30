// background.js

console.log("Service worker is running.");

// 파이썬 서버 URL
const SERVER_URL = 'http://localhost:5000'; 

// 서버 종료 요청 보내는 함수
function stopServer() {
    fetch(`${SERVER_URL}/shutdown`)
        .then(response => {
            if (response.ok) {
                console.log('서버 종료 요청이 성공적으로 전송되었습니다.');
            } else {
                console.error('서버 종료 요청에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('서버 종료 요청에 실패했습니다.', error);
        });
}

// 익스텐션이 설치될 때와 비활성화될 때의 처리
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker is installed.");
});

chrome.runtime.onSuspend.addListener(() => {
    stopServer();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchAndCleanHTML') {
        fetch('http://localhost:5000/block_ads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ html_content: message.htmlContent })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ cleanedContent: data.cleaned_content });
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true; // indicates async response
    } else if (message.action === 'toggleExtension') {
        // 익스텐션의 활성화 상태 변경
        console.log('Extension is now', message.enabled ? 'enabled' : 'disabled');
        // 활성화 상태에 따른 작업 수행
        if (message.enabled) {
            // 익스텐션 활성화될 때의 동작
        } else {
            // 익스텐션 비활성화될 때의 동작
        }
    }
});