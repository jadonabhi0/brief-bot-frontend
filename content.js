
let darkTheme = document.getElementById("theme-button");
// console.log(darkTheme)

//this is the function switching the dark and light mode
darkTheme.addEventListener("click", () => {
    let tab = document.getElementById("top-tab");
    let btn = document.getElementById("theme-button");
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
    }
});

// for showing the model popup
let modelPopUp = () => {
    let model = document.querySelector(".model");
    console.log(model);
}
modelPopUp();

// for triggering the summary popup
let allSummaryBtn = document.querySelector(".summary-btn");
console.log(allSummaryBtn)

allSummaryBtn.addEventListener("click", () => {
    console.log("hello i am clicked")
});


