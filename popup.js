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

// 서버에서 광고 목록을 가져와서 팝업 페이지에 표시하는 함수
function displayAdList() {
    fetch('http://localhost:5000/get_ads')
        .then(response => response.json())
        .then(data => {
            const adList = document.getElementById('adList');
            adList.innerHTML = ''; // 이전 목록 초기화

            data.ads.forEach(ad => {
                const listItem = document.createElement('li');
                listItem.textContent = ad;
                listItem.addEventListener('click', (event) => {
                    // 사용자가 광고를 클릭하여 차단할 때의 동작
                    blockAd(event, ad);
                });
                adList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching ad list:', error);
        });
}

// 사용자가 광고를 클릭하여 차단하는 함수
function blockAd(event, ad) {
    event.preventDefault(); // 기본 동작 막기

    fetch('http://localhost:5000/block_ad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ad: ad })
    })
    .then(response => {
        if (response.ok) {
            console.log('광고가 성공적으로 차단되었습니다.');
        } else {
            console.error('광고 차단에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error blocking ad:', error);
    });
}

// 팝업 페이지가 열릴 때 광고 목록을 표시
document.addEventListener('DOMContentLoaded', displayAdList);