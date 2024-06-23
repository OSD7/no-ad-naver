document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['filters'], data => {
    const filters = data.filters || [];
    filters.forEach(filter => removeAds(filter));
  });
});

function removeAds(selector) {
  const ads = document.querySelectorAll(selector);
  ads.forEach(ad => ad.remove());
}