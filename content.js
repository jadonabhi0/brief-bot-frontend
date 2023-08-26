
let darkTheme = document.getElementById("theme-button");
console.log(darkTheme)

//this is the function switching the dark and light mode
darkTheme.addEventListener("click", () => {
    let tab = document.getElementById("top-tab");
    let btn = document.getElementById("theme-button");
    let model = document.getElementById("model")
    let keySummary = document.getElementById("key-summary-btn")
    let allSummaryBtn = document.getElementById("summary-btn");
    if (document.body.classList.contains("dark-theme")) {

        // setting the light mode
        document.body.classList.remove("dark-theme")
        document.body.classList.remove("text-light")
        document.body.classList.add("text-dark")
        tab.classList.remove("bg-dark");
        tab.classList.remove("text-light")
        tab.classList.add("text-dark")
        tab.classList.add("bg-top-tab-color")
        btn.textContent = "Dark Mode"
        model.classList.remove("model-bg");
        keySummary.classList.remove("btn-danger");
        keySummary.classList.add("btn-outline-danger");
        allSummaryBtn.classList.remove("btn-danger");
        allSummaryBtn.classList.add("btn-outline-danger");
    }
    else {
        //setting the dark mode
        document.body.classList.remove("text-dark")
        document.body.classList.add("dark-theme");
        document.body.classList.add("text-light")
        tab.classList.remove("text-dark");
        tab.classList.remove("bg-top-tab-color")
        tab.classList.add("text-light")
        tab.classList.add("bg-dark")
        btn.textContent = "Light Mode"
        model.classList.add("model-bg")
        keySummary.classList.remove("btn-outline-danger");
        keySummary.classList.add("btn-danger");
        allSummaryBtn.classList.remove("btn-outline-danger");
        allSummaryBtn.classList.add("btn-danger");
    }
});


//fetching the model popup
let model = document.getElementById("model");

// flag that defines the contentType present
let contentType = "summary";

//fetching both button
let keySummary = document.getElementById("key-summary-btn");
let allSummaryBtn = document.querySelector(".summary-btn");

// for triggering the summary popup
let count1 = 1;
allSummaryBtn.addEventListener("click", () => {
    if (!model.classList.contains("show-model")) {
        model.classList.add("show-model")
        // load the allSummary
    } else {
        if (contentType === "summary" && count1 === 1) {
            // if summary is already present
            count1++
        } else {
            // load all summary and remove key-sentences
        }
    }
});


// for triggering the key-sentences summary
let count2 = 1;
keySummary.addEventListener("click", () => {

    if (!model.classList.contains("show-model")) {
        model.classList.add("show-model")
        // load the keySummary
    } else {
        if (contentType === "keySummary" && count2 === 1) {
            // if summary is already present
            count2++
        } else {
            // load key-summary and remove all summary
        }
    }
});


// working on the close button
let closeBtn = document.getElementById("close-btn");
closeBtn.addEventListener("click", () => {
    model.classList.remove("show-model");
})


// function to copy text to clipboard
function copyTextOnButtonClick(divId) {
    var contentDiv = document.getElementById(divId);

    // Create a range and select the content inside the div
    var range = document.createRange();
    range.selectNode(contentDiv);

    // Add the range to the selection
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copy the selected text to the clipboard using the Clipboard API
    document.execCommand("copy");

    // Clean up by clearing the selection
    window.getSelection().removeAllRanges();
}

// working on copy button
let copyButton = document.getElementById("copy-btn");
copyButton.addEventListener("click", copyTextOnButtonClick("model-content"))



/**Getting the url of the currently active tab */


// Function to display the URL in the console
function displayTabUrl(url) {
    console.log(url);
}

// Send a message to the background script to get the URL
chrome.runtime.sendMessage({ action: "getTabUrl" }, function (response) {
    if (response.url) {
        displayTabUrl(response.url);
    }
});
