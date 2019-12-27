"use strict";

var savedPagesDiv = document.getElementById("savedPages");

var urls = [];
chrome.storage.sync.get(['urls'], function (savedUrls) {
    urls = savedUrls.urls;
    if (urls === undefined) urls = [];
    showSavedPages()
});

var currentPage = null;

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var d = new Date();
    currentPage = {
        title: tabs[0].title,
        url: tabs[0].url,
        date: d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear()
    };
});

var saveCurrentPageBtn = document.getElementById("saveCurrentPage");
saveCurrentPageBtn.onclick = saveCurrentPage;

function saveCurrentPage() {
    urls.push(currentPage);
    chrome.storage.sync.set({ 'urls': urls }, function () {
        showSavedPages();
    });
}

var deleteSavedPagesBtn = document.getElementById("deleteSavedPages");
deleteSavedPagesBtn.onclick = function () {
    chrome.storage.sync.set({ 'urls': [] }, function () {
        urls = [];
        showSavedPages();
    });
};

function showSavedPages() {
    savedPagesDiv.innerHTML = "";
    for (var page of urls) {
        var paragraph = document.createElement('p');
        paragraph.innerHTML = page.url + ', <i>' + page.title + '</i>, ' + page.date;
        savedPagesDiv.append(paragraph);
    }
}
