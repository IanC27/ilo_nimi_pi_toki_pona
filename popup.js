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
const playButton = document.getElementById("playAudio");
playButton.onclick = () => audioElement.play();

let lang;
let sitelen = [];
let sitelenTitles = [];
let sitelenIndex = 0;

const wordsURL = 'https://api.linku.la/v1/words/'

const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
        throw new Error(response.message);

    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
}
// simple input sanitizer: https://developer.chrome.com/docs/extensions/mv3/security/
function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const translate = () => {
    function clear_slate() {
        for (let item of Object.keys(dataElements)) {
            dataElements[item].textContent = "";
        }
        playButton.hidden = true;
        sitelen = [];
        sitelenTitles = [];
        sitelenIndex = 0;
    }

    function get_info(word) {
        chrome.storage.sync.get(["language"]).then(result => {
            //console.log(result);
            const lang = result.language;
            return lang; 
        }).then(res => {
            let lang = res;
            return getJSON(wordsURL + `${word}?lang=${lang}`)
        }, err => {
            // default to english
            console.warn("could not find language ")
            return getJSON(wordsURL + `${word}?lang=en`)
        }).then(res => {
            console.log(res);
        }, err => {
            console.error(err);
        });

            
        //wordData = words[word];

        /*
        dataElements.word.textContent = wordData.word;
        dataElements.book.textContent = wordData.book;
        dataElements.linkuLink.textContent = "see more";
        dataElements.linkuLink.href = "https://linku.la/?q=" + word;

        if ("audio" in wordData) {
            playButton.hidden = false;
            chrome.storage.sync.get(["wordSpeaker"], result => {
                if (result.wordSpeaker in wordData.audio) {
                    audioElement.src = wordData.audio[result.wordSpeaker];
                } else {
                    let fallback = Object.keys(wordData.audio)[0];
                    audioElement.src = wordData.audio[fallback];
                }
            });
            chrome.storage.sync.get(["autoplay"], result => {
                if (result.autoplay) {
                    audioElement.play()
                };
            });
        }

        if ("sitelen_pona" in wordData) {
            sitelen = sitelen.concat(wordData.sitelen_pona.split(" "));
            sitelen.forEach(() => {
                sitelenTitles.push("sitelen pona");
            });
        }

        if ("sitelen_emosi" in wordData) {
            sitelen.push(wordData.sitelen_emosi);
            sitelenTitles.push("sitelen emosi");
        }

        if (sitelen.length > 0) {
            dataElements.sitelen.textContent = sitelen[0];
            dataElements.sitelen.title = sitelenTitles[0]
        }

        textBox.focus();

        chrome.storage.sync.get(["language"], result => {
            //console.log(result);
            const lang = result.language;

            if (lang in wordData.def) {
            //console.log(words[textEntry].def[lang]);
                dataElements.def.textContent = wordData.def[lang];
            } else {
                dataElements.def.textContent = "no translation in your language found";
            }
        });
        */
    }

    function processText() {
        clear_slate();
        let textEntry = sanitizeInput(textBox.value.trim());
        if (textEntry) {
            get_info(textEntry);
            /*
            if (textEntry in words) {
                get_info(textEntry);
            } else if (textEntry.toLowerCase() in words) {
                get_info(textEntry.toLowerCase());
            } else {
                dataElements.def.textContent = `word "${textEntry}" not found`;   
            }
                */
        }
        textBox.select();
    }

    if (lang) {
        processText();
    } else {
        chrome.storage.local.get(["language"], result => {
            lang = result.language;
            processText();
        });
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

textBox.focus();
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


// TODO: FIX HERE
document.getElementById("settings").onclick = () => {
    chrome.runtime.openOptionsPage().then(
        () => {console.log("opened options")},
        () => {console.log("options failed to open")}
    )};