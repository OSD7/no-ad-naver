document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab-link').forEach(button => {
    button.addEventListener('click', function() {
      openTab(this.getAttribute('data-tab'));
    });
  });

  document.getElementById('defaultOpen').click();
  loadSettings();

  document.getElementById('addFilterButton').addEventListener('click', addFilter);
  document.getElementById('addWhitelistButton').addEventListener('click', addWhitelist);
  document.getElementById('addUserFilterButton').addEventListener('click', addUserFilter);
  document.getElementById('languageSelect').addEventListener('change', setLanguage);

  function loadSettings() {
    chrome.storage.sync.get(['userFilters', 'whitelist', 'language'], function(data) {
      if (data.userFilters) {
        data.userFilters.forEach(addFilterToList);
      }
      if (data.whitelist) {
        data.whitelist.forEach(addWhitelistToList);
      }
      if (data.language) {
        document.getElementById('languageSelect').value = data.language;
      }
    });
  }

  function addFilter() {
    const fileInput = document.getElementById('filterFileInput');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const filterText = e.target.result;
        const filterLines = filterText.split('\n').filter(line => isValidRule(line));
        chrome.storage.sync.get(['userFilters'], function(data) {
          let userFilters = data.userFilters || [];
          userFilters = userFilters.concat(filterLines);
          chrome.storage.sync.set({ userFilters: userFilters });
          filterLines.forEach(addFilterToList);
        });
      };
      reader.readAsText(file);
    }
  }

  function addWhitelist() {
    const input = document.getElementById('whitelistInput');
    const url = input.value.trim();
    if (url) {
      chrome.storage.sync.get(['whitelist'], function(data) {
        let whitelist = data.whitelist || [];
        whitelist.push(url);
        chrome.storage.sync.set({ whitelist: whitelist });
        addWhitelistToList(url);
      });
    }
  }

  function addUserFilter() {
    const input = document.getElementById('userFilterInput');
    const filter = input.value.trim();
    if (filter) {
      chrome.storage.sync.get(['userFilters'], function(data) {
        let userFilters = data.userFilters || [];
        userFilters.push(filter);
        chrome.storage.sync.set({ userFilters: userFilters });
        addFilterToList(filter);
      });
    }
  }

  function setLanguage() {
    const language = document.getElementById('languageSelect').value;
    chrome.storage.sync.set({ language: language });
    // 필요 시 페이지를 다시 로드하거나, 메시지를 보내서 즉시 반영할 수 있음.
  }

  function addFilterToList(filter) {
    const ul = document.getElementById('filterList');
    const li = document.createElement('li');
    li.textContent = filter;
    ul.appendChild(li);
  }

  function addWhitelistToList(url) {
    const ul = document.getElementById('whitelistUrls');
    const li = document.createElement('li');
    li.textContent = url;
    ul.appendChild(li);
  }

  function isValidRule(line) {
    return line && !line.startsWith('!') && !line.startsWith('[');
  }
});

function openTab(tabName) {
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
  }
  const tabLinks = document.getElementsByClassName('tab-link');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  document.querySelector(`[data-tab=${tabName}]`).className += ' active';
}
