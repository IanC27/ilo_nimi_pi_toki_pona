const translateButton = document.getElementById("translateButton");
const textBox = document.getElementById("text");
const dataElements = new Map();
const defElement = document.getElementById("def");
const wordElement = document.getElementById("word");

let lang;
let words;

chrome.storage.local.get(["linku_data"], result => {
    //console.log(result);
    words = result.linku_data.data;
});
chrome.storage.sync.get(["language"], result => {
    //console.log(result);
    lang = result.language;
});
chrome.storage.sync.get(["infoPrefs"], result => {
    //console.log(result);
    let infoPrefs = result.infoPrefs;
    for(let k of Object.keys(infoPrefs)) {
        if (infoPrefs[k]) {
            dataElements.set(k, document.getElementById(k));
        }
    }
})

// simple input sanitizer: https://developer.chrome.com/docs/extensions/mv3/security/
function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const translate = () => {
    //console.log("clicked");
    function get_info(word) {
        if (lang in words[word].def) {
            //console.log(words[textEntry].def[lang]);
            wordElement.textContent = words[word].word;
            defElement.textContent = words[word].def[lang];

            for (let item of dataElements.keys()){
                if (item in words[word]) {
                    dataElements.get(item).textContent = `${item}: ${words[word][item]}`
                } else {
                    dataElements.get(item).textContent = ""
                }
            }
        } else {
            defElement.textContent = "translation not found in your language";
            for (let item of Object.keys(dataElements)) {
                dataElements.get(item).textContent = ""
            }
        }
    }

    if (words) {
        let textEntry = sanitizeInput(textBox.value.trim());
        if (textEntry) {
            if (textEntry in words) {
                get_info(textEntry);
            } else if (textEntry.toLowerCase() in words) {
                get_info(textEntry.toLowerCase());
            } else {
                wordElement.textContent = "";
                defElement.textContent = `word "${textEntry}" not found`;
                for (let item of Object.keys(dataElements)) {
                    dataElements.get(item).textContent = ""
                }
            }

        }
    } else {
        console.error("could not access the data... report it to the dev? : https://github.com/IanC27/ilo_nimi_pi_toki_pona/issues")
    }
}

// script to inject into the page to get the selected text
function sendSelectedText() {
    chrome.runtime.sendMessage({ query: window.getSelection().toString() }, function (response) {
        //console.log(response.confirm);
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: sendSelectedText
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            sendResponse({ confirm: "recieved" });
            if (request.query) {
                textBox.value = request.query;
                translate();
            }
        });

});


textBox.onchange = translate;
translateButton.onclick = translate;