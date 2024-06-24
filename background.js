  // 로컬 필터 불러오기(설치파일 filters 폴더)
const filterFiles = [
  'filters/easylist.txt',
  'filters/easyprivacy.txt',
  'filters/adguard_filters.txt'
];
  // 인터넷 상 필터 불러오기(url)
const filterLists = [
  "https://easylist.to/easylist/easylist.txt",
  "https://easylist.to/easylist/easyprivacy.txt",
  "https://filters.adtidy.org/extension/chromium/filters/2.txt",
  "https://filters.adtidy.org/extension/chromium/filters/3.txt",
  "https://filters.adtidy.org/extension/chromium/filters/14.txt",
  "https://github.com/uBlockOrigin/uAssets/raw/master/filters/filters.txt",
  "https://github.com/uBlockOrigin/uAssets/raw/master/filters/filters-2020.txt",
  "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=1",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/annoyances-cookies.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/annoyances-others.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/badware.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/filters-2021.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/filters-2022.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/filters-2023.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/filters-2024.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/0aed10a3ad213d629d8113f6c64b5497871c1653/filters/filters-mobile.txt",
  "https://raw.github.com/reek/anti-adblock-killer/master/anti-adblock-killer-filters.txt",
  "https://easylist-downloads.adblockplus.org/abp-filters-anti-cv.txt",
  "https://easylist-msie.adblockplus.org/abp-filters-anti-cv.txt",
  "https://raw.githubusercontent.com/abp-filters/abp-filters-anti-cv/master/english.txt",
  "https://raw.githubusercontent.com/k2jp/abp-japanese-filters/master/abpjf.txt",
  "https://www.joinhoney.com/whitelist/honey-smart-shopping.txt",
  "https://gitlab.com/malware-filter/urlhaus-filter/-/raw/master/urlhaus-filter.txt"
];

let blockRules = [];
let userFilters = [];
let userRules = [];
let whitelist = [];
let isEnabled = true;
let blockJavaScript = false;
let blockPopups = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log('익스텐션이 설치되었습니다.');
  loadFilters();
  loadUserSettings();
});

chrome.runtime.onStartup.addListener(() => {
  loadFilters();
  loadUserSettings();
});

function loadFilters() {
  // 로컬 파일 사용 필터 불러오기
  filterFiles.forEach(file => {
    fetch(chrome.runtime.getURL(file))
      .then(response => response.text())
      .then(text => {
        const rules = parseRules(text);
        blockRules = blockRules.concat(rules);
      })
      .catch(error => console.error('Error loading local filter:', error));
  });

  // 외부 URL 사용 필터 불러오기
  filterLists.forEach(url => {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const rules = parseRules(data);
        blockRules = blockRules.concat(rules);
      })
      .catch(error => console.error('Error loading external filter:', error));
  });
}

function parseRules(text) {
  return text.split('\n').filter(line => isValidRule(line));
}

function isValidRule(line) {
  return line && !line.startsWith('!') && !line.startsWith('[');
}

function loadUserSettings() {
  chrome.storage.sync.get(['userFilters', 'userRules', 'whitelist', 'isEnabled', 'blockJavaScript', 'blockPopups'], (data) => {
    userFilters = data.userFilters || [];
    userRules = data.userRules || [];
    whitelist = data.whitelist || [];
    isEnabled = data.isEnabled !== undefined ? data.isEnabled : true;
    blockJavaScript = data.blockJavaScript || false;
    blockPopups = data.blockPopups || false;
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isEnabled) return { cancel: false };
    const url = details.url;
    return { cancel: shouldBlockRequest(url, details.type) };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function shouldBlockRequest(url, type) {
  if (whitelist.some(item => url.includes(item))) return false;
  if (userFilters.some(item => url.includes(item))) return true;
  if (blockJavaScript && type === "script") return true;
  return blockRules.some(rule => url.includes(rule));
}

setInterval(loadFilters, 24 * 60 * 60 * 1000);  // 매 24시간마다 필터 업데이트
