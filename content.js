

// Wrapping code inside the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {

    /**********************************************<Object>******************************************************** */

    // object that represents the current status of model-popup
    modelStatus = {
        currentContentType: "none",
        receivedData: "",
        count: { words: 0, characters: 0 }
    }

    /************************************************* Some Constants ****************************************************** */

    // This is the API url
    const API_URL = "http://localhost:8080/api/response/allsummary";

    // This is the warning messages for showing an alert
    const WARNING_MESSAGE = "Something Went Wrong"

    // This is the suggesation message for showing the suggesation to the user 
    const WARNING_SUGGESATION = "We apologize, but it seems that something unexpected has occurred, Kindly check your internet connection."






    /* ********************************************** Buttons Declarations **************************************************** */

    //fetching both button of key-sentences and all allSummaryBtn

    //selecting the key-summary button
    let keySummary = document.getElementById("key-summary-btn");

    //selecting the All-summary button
    let allSummaryBtn = document.querySelector(".summary-btn");

    //selecting the copy button
    let copyButton = document.getElementById("copy-btn");

    //selecting the close button
    let closeBtn = document.getElementById("close-btn");

    //selecting the refresh button
    let refreshButton = document.getElementById("refresh-btn");

    //selecting the theme button
    let darkTheme = document.getElementById("theme-button");


    /********************************************Fetching Components*********************************************** */
    //fetching the model popup
    let model = document.getElementById("model");

    // getting the model-content div
    let modelContent = document.getElementById("model-content")

    // getting the counting detail component
    let countingDetails = document.getElementById("counting");

    // getting estimated reading time component
    let timingDetails = document.getElementById("timing");

    // get loading overlay
    let loadingOverlay = document.querySelector(".loading-overlay")



    /****************************************** API Callings ********************************************************* */

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
            // console.log(responseData)
            return responseData;
        } catch (error) {
            // console.error('Error:', error); // Handle any errors that occur during the request
        }
    }



    /****************************************** Functions Decelerations ********************************************************* */


    /**
     * @param {String} inputString
     * @returns the the array of splitted strings 
     */

    // function for splitting the string at the given regex
    function splitString(inputString) {
        if (typeof inputString !== 'string') {
            throw new Error('Input must be a string');
        }

        return inputString.split('.');
    }




    /**
     * @param {String} inputString  
     * @returns an object containing count of words and characters
     */

    // function count words and characters
    function countWordsAndCharacters(inputString) {
        if (typeof inputString !== 'string') {
            throw new Error('Input must be a string');
        }

        // split the string by single or multiple space
        const words = inputString.split(/\s+/).filter(word => word.length > 0);
        const characters = inputString.length;

        return {
            words: words.length,
            characters: characters
        };
    }



    /**
     * @param {id} divId 
     */

    // this is the function that copy the text of an html element on clipboard
    function copyTextToClipboard(divId) {
        const textToCopy = document.getElementById(divId).innerText;

        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            console.log('Text copied to clipboard');
        } catch (err) {
            console.error('Unable to copy text to clipboard:', err);
        }

        document.body.removeChild(textArea);
    }





    /************************************** Button Event Listeners *************************************************** */


    /**this is the function for toggling between the dark and light mode */
    darkTheme.addEventListener("click", () => {

        /* toggling between dark and light theme*/
        let tab = document.getElementById("top-tab");
        let btn = document.getElementById("theme-button");
        let model = document.getElementById("model")
        let keySummary = document.getElementById("key-summary-btn")
        let allSummaryBtn = document.getElementById("summary-btn");
        let loadingOverlay = document.querySelector(".loading-overlay")
        loadingOverlay.classList.add("show-overlay")

        setTimeout(() => {
            if (document.body.classList.contains("dark-theme")) {

                // toggling the light mode
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
                //toggling the dark mode
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






    /*Adding the addEventListener to All-summary button*/
    allSummaryBtn.addEventListener("click", () => {


        if (!model.classList.contains("show-model")) {
            model.classList.add("show-model")

            // fetching the url of currently open tab in window
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const url = tabs[0].url;
                console.log(url)

                // Replace with your API endpoint URL
                const apiUrl = API_URL;

                const requestData = {
                    url: url
                };

                // Call the function to send the POST request
                postDataToApi(apiUrl, requestData)
                    .then(data => {

                        console.log(data)

                        /*Handle the response data*/

                        if (!data.success) { // if receive useless response like receive exceptions

                            modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
                            setTimeout(() => {
                                // in-case of useless response disable copy button
                                copyButton.disabled = true;

                                // showing the alert box
                                modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert">' + data.message + '</div> <p class="alert-text">' + data.suggesation + '</p>'
                            }, 4000)
                        } else { // if actual response get

                            // setting the useful summary
                            let content = data.openai.result.replace(":", "");
                            console.log(content)
                            modelContent.innerHTML = content;

                            // finding and updating the counting of words and characters
                            let counting = countWordsAndCharacters(content);

                            // updating the state of object
                            modelStatus.receivedData = content;
                            modelStatus.currentContentType = "summary"
                            modelStatus.isExecuted = true;
                            modelStatus.count.words = counting.words;
                            modelStatus.count.characters = counting.characters;

                            // updating the estimated reading time
                            timingDetails.textContent = "Estimated Reading Time : " + Math.ceil(counting.words / 3) + " sec";

                            // setting the counting of words and characters
                            countingDetails.textContent = 'Words : ' + counting.words + ' Characters : ' + counting.characters;
                        }
                    })
                    .catch(error => {// Handle errors, if any

                        // disable copy button
                        copyButton.disabled = true;

                        // showing alert-box
                        modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert">' + WARNING_MESSAGE + '</div> <p class="alert-text">' + WARNING_SUGGESATION + '</p>'
                    });
                ;

            });

            /**This section handles, if already key-sentences present*/
        } else if (modelStatus.currentContentType === "keySummary") {

            countingDetails.textContent = "";
            timingDetails.textContent = "";

            // showing the loading bar
            modelContent.innerHTML = '<img src="./images/process.svg" alt="">'

            // setting the all-summary
            setTimeout(() => {
                modelContent.innerHTML = modelStatus.receivedData;
            }, 4000)

            // updating the state of object
            modelStatus.currentContentType = "summary"

            // updating the estimated reading time
            timingDetails.textContent = "Estimated Reading Time : " + Math.ceil(modelStatus.count.words / 3) + " sec"

            //updating the counting of words and characters
            countingDetails.textContent = 'Words : ' + modelStatus.count.words + ' Characters : ' + modelStatus.count.characters;
            String
        }
    });


    // Adding addEventListener to key-sentences button
    keySummary.addEventListener("click", () => {


        if (!model.classList.contains("show-model")) {
            model.classList.add("show-model")

            // fetching the url of currently open tab in window
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const url = tabs[0].url;
                console.log(url)

                // Replace with your API endpoint URL
                const apiUrl = API_URL;

                const requestData = {
                    url: url
                };

                // Call the function to send the POST request
                postDataToApi(apiUrl, requestData)
                    .then(data => {
                        console.log('API response:', data);  // Handle the response data


                        if (!data.success) {
                            // if received some useless response like receive exception
                            modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
                            setTimeout(() => {
                                // in-case of useless response disable copy button
                                copyButton.disabled = true;

                                // showing the alert box
                                modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert">' + data.message + '</div> <p class="alert-text">' + data.suggesation + '</p>'
                            }, 4000)

                        } else {// if actual response get

                            let content = data.openai.result.replace(":", "");

                            // splitting the summary into sentences
                            let array = splitString(content);
                            let i = 1;
                            for (let str in array) {
                                if (array[str].length <= 5) continue;
                                if (i == 1) modelContent.innerHTML = "";
                                let text = '<p>' + i + ". " + array[str] + "." + '<p/>'
                                modelContent.innerHTML += text;
                                if (i == array.length - 1) break;
                                i++;
                            }


                            // finding and updating the counting of words and characters
                            let counting = countWordsAndCharacters(content);

                            // updating the state of object
                            modelStatus.receivedData = content;
                            modelStatus.currentContentType = "keySummary"
                            modelStatus.isExecuted = true;
                            modelStatus.count.words = counting.words;
                            modelStatus.count.characters = counting.characters;

                            //setting the estimated reading time
                            timingDetails.textContent = "Estimated Reading Time : " + Math.ceil(counting.words / 3) + " sec"

                            // setting the counting of words and characters
                            countingDetails.textContent = 'Words : ' + counting.words + ' Characters : ' + counting.characters;
                        }
                    })
                    .catch(error => {

                        // disable copy button
                        copyButton.disabled = true;

                        // showing the alert-box
                        modelContent.innerHTML = '<div class="alert alert-danger text-center" role="alert"> ' + WARNING_MESSAGE + ' </div> <p class="alert-text">' + WARNING_SUGGESATION + '</p>'
                    });
                ;

            });


            /**This section handles, if already All-Summary present*/
        } else if (modelStatus.currentContentType === "summary") {
            countingDetails.textContent = "";
            timingDetails.textContent = "";
            modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
            let array = splitString(modelStatus.receivedData);
            setTimeout(() => {
                let i = 1;
                for (let str in array) {
                    if (array[str].length <= 5) continue;
                    if (i == 1) modelContent.innerHTML = "";
                    let text = '<p>' + i + "." + array[str] + "." + '<p/>'
                    modelContent.innerHTML += text;
                    if (i == array.length - 1) break;
                    i++;
                }
            }, 3000)

            //updating the object state
            modelStatus.currentContentType = "keySummary"

            //setting the estimated reading time
            timingDetails.textContent = "Estimated Reading Time : " + Math.ceil(modelStatus.count.words / 3) + " sec"

            //updating the counting of words and characters
            countingDetails.textContent = 'Words : ' + modelStatus.count.words + ' Characters : ' + modelStatus.count.characters;
        }
    });



    /*Adding addEventListener to close button*/
    closeBtn.addEventListener("click", () => {
        model.classList.remove("show-model");
        countingDetails.textContent = "";
        timingDetails.textContent = "";
    })



    /*Adding addEventListener to close button*/
    document.getElementById('copy-btn').addEventListener('click', function () {
        copyTextToClipboard('model-content');
    });



    // Adding addEventListener to refresh button
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
            modelContent.innerHTML = '<img src="./images/process.svg" alt="">'
            countingDetails.textContent = "";
            timingDetails.textContent = "";
            document.getElementById("copy-btn").disabled = false;
        }, 1000);

    })


});


