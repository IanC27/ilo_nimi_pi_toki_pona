const translateButton = document.getElementById("translateButton");
const textBox = document.getElementById("text");
const dataElements = {
    def: document.getElementById("def"),
    word: document.getElementById("word"),
    book: document.getElementById("book"),
    sitelen: document.getElementById("sitelenpona"),
    linkuLink:  document.getElementById("moreinfo")
};
const audioElement = document.getElementById("audio");

let lang;
let words;
let sitelen = [];
let sitelenTitles = [];
let sitelenIndex = 0;

chrome.storage.local.get(["linku_data"], result => {
    //console.log(result);
    words = result.linku_data.data;
});
chrome.storage.sync.get(["language"], result => {
    //console.log(result);
    lang = result.language;
});

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
        audioElement.hidden = true;
        sitelen = [];
        sitelenTitles = [];
        sitelenIndex = 0;
    }

    function get_info(word) {
        wordData = words[word];
        dataElements.word.textContent = wordData.word;
        dataElements.book.textContent = wordData.book;

        dataElements.linkuLink.textContent = "see more";
        dataElements.linkuLink.href = "https://lipu-linku.github.io/?q=" + word;

        if ("audio" in wordData) {
            audioElement.hidden = false;
            audioElement.href = wordData.audio["kala_asi"];
        }

        if ("sitelen_pona" in wordData) {
            sitelen = sitelen.concat(wordData.sitelen_pona.split(" "));
            console.log(sitelen);
            for (let g of sitelen) {
                sitelenTitles.push("sitelen pona");
            }
        }

        if ("sitelen_emosi" in wordData) {
            sitelen.push(wordData.sitelen_emosi);
            sitelenTitles.push("sitelen emosi");
        }

        if (sitelen.length > 0) {
            dataElements.sitelen.textContent = sitelen[0];
            dataElements.sitelen.title = sitelenTitles[0]
        }

        if (lang in wordData.def) {
            //console.log(words[textEntry].def[lang]);
            dataElements.def.textContent = wordData.def[lang];
        } else {
            dataElements.def.textContent = "no translation in your language found";
        }
    }

    if (words) {
        clear_slate();
        let textEntry = sanitizeInput(textBox.value.trim());
        if (textEntry) {
            if (textEntry in words) {
                get_info(textEntry);
            } else if (textEntry.toLowerCase() in words) {
                get_info(textEntry.toLowerCase());
            } else {
                dataElements.def.textContent = `word "${textEntry}" not found`;   
            }
        }
    } else {
        console.error("could not access the data... report it to the dev? : https://github.com/IanC27/ilo_nimi_pi_toki_pona/issues")
    }
}

function sitelenFlip() {
    sitelenIndex = (sitelenIndex + 1) % sitelen.length;
    dataElements.sitelen.textContent = sitelen[sitelenIndex];
    dataElements.sitelen.title = sitelenTitles[sitelenIndex];
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
dataElements.sitelen.onclick = sitelenFlip;