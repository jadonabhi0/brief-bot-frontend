
let darkTheme = document.getElementById("theme-button");


//this is the function switching the dark and light mode
darkTheme.addEventListener("click", () => {
    let tab = document.getElementById("top-tab");
    let btn = document.getElementById("theme-button");
    let model = document.getElementById("model")
    let keySummary = document.getElementById("key-summary-btn")
    let allSummaryBtn = document.getElementById("summary-btn");
    let loadingOverlay = document.querySelector(".loading-overlay")
    loadingOverlay.classList.add("show-overlay")
    setTimeout(() => {
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
        loadingOverlay.classList.remove("show-overlay")
    }, 1500)
});


//fetching the model popup
let model = document.getElementById("model");

// getting the model-content div
let modelContent = document.getElementById("model-content")

// getting the counting 
let countingDetails = document.getElementById("counting");

//fetching both button
let keySummary = document.getElementById("key-summary-btn");
let allSummaryBtn = document.querySelector(".summary-btn");

// object that represents the current status of mode-popup summary
modelStatus = {
    currentContentType: "none",
    receivedData: "",
    count: { words: 0, characters: 0 }
}

// function for splitting the string
function splitString(inputString) {
    if (typeof inputString !== 'string') {
        throw new Error('Input must be a string');
    }

    return inputString.split('.');
}

// function count words and characters
function countWordsAndCharacters(inputString) {
    if (typeof inputString !== 'string') {
        throw new Error('Input must be a string');
    }

    const words = inputString.split(/\s+/).filter(word => word.length > 0);
    const characters = inputString.length;

    return {
        words: words.length,
        characters: characters
    };
}


// for triggering the summary popup
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


                    if (!data.success) {
                        // if received some useless response like received exception
                        let copyButton = document.getElementById("copy-btn");
                        modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
                        setTimeout(() => {
                            copyButton.disabled = true;
                            modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert">' + data.message + '</div> <p class="alert-text">Oops! It seems like there\'s no text to summarize. Please go-to web-pages contains some text content to generate a summary.</p>'
                        }, 4000)
                    } else {
                        // if actual response get
                        modelContent.innerHTML = data.openai.result;

                        let count = countWordsAndCharacters(data.openai.result);

                        // updating the state of object
                        modelStatus.receivedData = data.openai.result;
                        modelStatus.currentContentType = "summary"
                        modelStatus.isExecuted = true;
                        modelStatus.count.words = count.words;
                        modelStatus.count.characters = count.characters;

                        countingDetails.textContent = 'Words : ' + count.words + ' Characters : ' + count.characters;
                    }
                })
                .catch(error => {

                    // console.error('Error:', error);  // Handle errors, if any
                    copyButton.disabled = true;
                    modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert"> Something Went Wrong </div> <p class="alert-text">We apologize, but it seems that something unexpected has occurred. Our team is already working to resolve the issue and get things back on track.</p>'
                });
            ;

        });

    } else if (modelStatus.currentContentType === "keySummary") {
        modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
        setTimeout(() => {
            modelContent.innerHTML = modelStatus.receivedData;
        }, 4000)
        modelStatus.currentContentType = "summary"
        countingDetails.textContent = 'Words : ' + count.words + ' Characters : ' + count.characters;
    }
});


// for triggering the key-sentences summary
keySummary.addEventListener("click", () => {

    if (!model.classList.contains("show-model")) {
        model.classList.add("show-model")
        // load the keySummary

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


                    if (!data.success) {
                        // if received some useless response like received exception
                        let copyButton = document.getElementById("copy-btn");
                        modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
                        setTimeout(() => {
                            copyButton.disabled = true;
                            modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert">' + data.message + '</div> <p class="alert-text">Oops! It seems like there\'s no text to summarize. Please go-to web-pages contains some text content to generate a summary.</p>'
                        }, 4000)
                    } else {
                        // if actual response get
                        let array = splitString(data.openai.result);
                        let i = 1;
                        for (let str in array) {
                            if (i == 1) modelContent.innerHTML = "";
                            let text = '<p>' + i + "." + array[str] + "." + '<p/>'
                            modelContent.innerHTML += text;
                            if (i == array.length - 1) break;
                            i++;
                        }
                        let count = countWordsAndCharacters(data.openai.result);
                        // updating the state of object
                        modelStatus.receivedData = data.openai.result;
                        modelStatus.currentContentType = "keySummary"
                        modelStatus.isExecuted = true;
                        modelStatus.count.words = count.words;
                        modelStatus.count.characters = count.characters;

                        countingDetails.textContent = 'Words : ' + count.words + ' Characters : ' + count.characters;
                    }
                })
                .catch(error => {

                    // console.error('Error:', error);  // Handle errors, if any
                    copyButton.disabled = true;
                    modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert"> Something Went Wrong </div> <p class="alert-text">We apologize, but it seems that something unexpected has occurred. Our team is already working to resolve the issue and get things back on track.</p>'
                });
            ;

        });



    } else if (modelStatus.currentContentType === "summary") {
        modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
        let array = splitString(modelStatus.receivedData);
        setTimeout(() => {
            let i = 1;
            for (let str in array) {
                if (i == 1) modelContent.innerHTML = "";
                let text = '<p>' + i + "." + array[str] + "." + '<p/>'
                modelContent.innerHTML += text;
                if (i == array.length - 1) break;
                i++;
            }
        }, 3000)
        modelStatus.currentContentType = "keySummary"

        countingDetails.textContent = 'Words : ' + count.words + ' Characters : ' + count.characters;
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


// completing refresh button
let refreshButton = document.getElementById("refresh-btn");
let loadingOverlay = document.querySelector(".loading-overlay")
refreshButton.addEventListener("click", () => {
    loadingOverlay.classList.add("show-overlay");
    setTimeout(() => {
        if (model.classList.contains("show-model")) {
            model.classList.remove("show-model")
        }
        modelStatus.currentContentType = "none";
        modelStatus.receivedData = ""
        modelStatus.count.words = 0;
        modelStatus.count.characters = 0;
        loadingOverlay.classList.remove("show-overlay")
    }, 1000);

})









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
        // console.error('Error:', error); // Handle any errors that occur during the request
    }
}

// Example usage
// const apiUrl = 'https://brief-bot-back-production.up.railway.app/api/response/allsummary';

