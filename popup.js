const translateButton = document.getElementById("translateButton");
const textBox = document.getElementById("text");
const dataElements = {
    def: document.getElementById("def"),
    word: document.getElementById("word"),
    book: document.getElementById("book"),
    sitelenpona: document.getElementById("sitelenpona")
};

let infoPrefs;
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
    infoPrefs = result.infoPrefs;
})

// simple input sanitizer: https://developer.chrome.com/docs/extensions/mv3/security/
function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const translate = () => {
    //console.log("clicked");
    function clear_slate() {
        for (let item of Object.keys(dataElements)) {
            dataElements[item].textContent = "";
        }
    }

    function get_info(word) {
        wordData = words[word];
        dataElements.word.textContent = wordData.word;
        dataElements.sitelenpona.textContent = wordData.sitelen_pona;

        if (lang in wordData.def) {
            //console.log(words[textEntry].def[lang]);
            dataElements.def.textContent = wordData.def[lang];
        } else {
            dataElements.def.textContent = "no translation in your language found";
        }

        if (infoPrefs) {
            if (infoPrefs["book"]) {
                dataElements.book.textContent = `nimi ${wordData.book}`;
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
                clear_slate();
                dataElements.def.textContent = `word "${textEntry}" not found`;   
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