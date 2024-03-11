// script.js

const splitter = document.getElementById('splitter');
const inputSection = document.querySelector('.input-section');
const resultSection = document.querySelector('.result-section');

const svgLeft = document.querySelector('.splitter_left');
const svgRight = document.querySelector('.splitter_right');

let isResizing = false;

splitter.addEventListener('mousedown', (event) => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

function handleMouseMove(event) {
    if (!isResizing) return;
    
    const inputWidth = event.clientX - inputSection.getBoundingClientRect().left;
    inputSection.style.width = inputWidth + 'px';
    resultSection.style.width = `calc(100% - ${inputWidth}px)`;
}

function handleMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("selected");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add("selected");
}

function selectSubTool(event, subToolName) {
    var i, subToolLinks;
    subToolLinks = document.querySelectorAll("#subToolList a");
    for (i = 0; i < subToolLinks.length; i++) {
        subToolLinks[i].classList.remove("selected");
    }
    event.currentTarget.classList.add("selected");
    // Here you can add logic to handle the selection of the sub-tool
}

function toggleInputSection() {
    var inputSection = document.getElementById("inputSection");
    var splitter = document.getElementById("splitter");
    if (inputSection.style.width === "0px" || inputSection.style.width === "") {
        inputSection.style.width = "50%";
        resultSection.style.width = "50%";
        splitter.style.cursor = "col-resize";

        svgLeft.style.display = "block";
        svgRight.style.display = "none";
    } else {
        inputSection.style.width = "0px";
        resultSection.style.width = "100%";
        splitter.style.cursor = "pointer";
        svgLeft.style.display = "none";
        svgRight.style.display = "block";
    }
}


document.getElementById("userButton").addEventListener("click", function() {
    var dropdown = document.getElementById("userDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

// Close the dropdown if the user clicks outside of it
window.addEventListener("click", function(event) {
    if (!event.target.matches("#userButton")) {
        var dropdown = document.getElementById("userDropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
});
