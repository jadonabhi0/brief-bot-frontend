
let darkTheme = document.getElementById("theme-button");


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
        // fetching the url of currently open tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const url = tabs[0].url;
            console.log(url)

            const apiUrl = "http://localhost:8080/api/response/allsummary";
            // Replace with your API endpoint URL
            const requestData = {
                url: url
            };

            // Call the function to send the POST request
            postDataToApi(apiUrl, requestData)
                .then(data => {
                    console.log('API response:', data);  // Handle the response data

                    // getting the model-content div

                    let modelContent = document.getElementById("model-content")

                    if (!data.success) {
                        modelContent.innerHTML = data.message;
                    } else {
                        modelContent.innerHTML = data.openai.result;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);  // Handle errors, if any
                });
            ;

        });



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









/***************************************testing my api*************************************** */


// Function to send a POST request with data to an API

async function postDataToApi(url, data) {
    // Options for the fetch request
    const requestOptions = {
        method: 'POST',                 // Use the HTTP method POST
        headers: {
            'Content-Type': 'application/json'  // Set the content type of the request body to JSON
        },
        body: JSON.stringify(data)      // Convert the data to JSON format
    };

    // Make the fetch request and return a Promise
    try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
        console.log(responseData)
        return responseData;
    } catch (error) {
        console.error('Error:', error); // Handle any errors that occur during the request
    }
}

// Example usage
// const apiUrl = 'https://brief-bot-back-production.up.railway.app/api/response/allsummary';

