// Function to get the URL of the currently active tab
function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;
        callback(url);
    });
}

// Listen for requests from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getTabUrl") {
        getCurrentTabUrl(function (url) {
            sendResponse({ url: url });
        });
    }
    return true; // Required for asynchronous response
});