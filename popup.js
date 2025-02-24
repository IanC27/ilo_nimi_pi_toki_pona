const translateButton = document.getElementById("translateButton");
const textBox = document.getElementById("text");
const sandboxCheckbox = document.getElementById("enable-sandbox");
const loadingImg = document.getElementById("loading");
const dataElements = {
    def: document.getElementById("def"),
    word: document.getElementById("word"),
    book: document.getElementById("book"),
    sitelen: document.getElementById("sitelenpona"),
    usage: document.getElementById("usagecategory")
};
const audioElement = document.getElementById("audio");
const playButton = document.getElementById("playAudio");
playButton.onclick = () => audioElement.play();

let defLang;
let sitelen = [];
let sitelenTitles = [];
let sitelenIndex = 0;

const wordsURL = 'https://api.linku.la/v1/words/';
const sandboxURL = 'https://api.linku.la/v1/sandbox/';

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
        dataElements.usage.style.display = 'none'
        playButton.hidden = true;
        sitelen = [];
        sitelenTitles = [];
        sitelenIndex = 0;
    }

    function showData(wordData) {
        console.log(wordData);
            dataElements.word.textContent = wordData.word;
            dataElements.book.textContent = wordData.book;
            //dataElements.linkuLink.textContent = "see more";
            //dataElements.linkuLink.href = "https://linku.la/words/" + wordData.id;

            dataElements.usage.href = "https://linku.la/words/" + wordData.id;
            dataElements.usage.style.display = 'inline-block';
            dataElements.usage.textContent = wordData.usage_category;
            switch (wordData.usage_category) {
                case 'sandbox': {
                    dataElements.usage.style.backgroundColor = 'black';
                    dataElements.usage.style.color = 'white';
                    break;
                }
                case 'obscure': {
                    dataElements.usage.style.backgroundColor = 'purple';
                    dataElements.usage.style.color = 'white';
                    break;
                }
                case 'uncommon': {
                    dataElements.usage.style.backgroundColor = 'red';
                    dataElements.usage.style.color = 'white';
                    break;
                }
                case 'common': {
                    dataElements.usage.style.backgroundColor = 'orange';
                    dataElements.usage.style.color = 'white';
                    break;
                }
                case 'core': {
                    dataElements.usage.style.backgroundColor = 'yellow';
                    dataElements.usage.style.color = "rgb(136, 114, 158)";
                    break;
                }
                default: {
                    break;
                }
            }
            
            
            if ("audio" in wordData) {
                playButton.hidden = false;
                chrome.storage.sync.get(["wordSpeaker"], result => {
                    if (audioClip = wordData.audio.find((a) => a.author === result.wordSpeaker)) {
                        audioElement.src = audioClip.link
                    } else {
                        let fallback = wordData.audio[0];
                        audioElement.src = fallback.link
                    }
                });
                chrome.storage.sync.get(["autoplay"], result => {
                    if (result.autoplay) {
                        audioElement.play()
                    };
                });
            }

            if ("ligatures" in wordData.representations) {
                sitelen = sitelen.concat(wordData.representations["ligatures"]);
                sitelenTitles = sitelenTitles.concat(Array(wordData.representations["ligatures"].length).fill("sitelen pona"));
            }
            if ("sitelen_emosi" in wordData.representations) {
                sitelen.push(wordData.representations["sitelen_emosi"]);
                sitelenTitles.push("sitelen emosi");
            }
            if ("sitelen_jelo" in wordData.representations) {
                sitelen = sitelen.concat(wordData.representations["sitelen_jelo"]);
                sitelenTitles = sitelenTitles.concat(Array(wordData.representations["sitelen_jelo"].length).fill("sitelen jelo"));
            }
            if (sitelen.length > 0) {
                dataElements.sitelen.textContent = sitelen[0];
                dataElements.sitelen.title = sitelenTitles[0];
            }
    
            textBox.focus();

            dataElements.def.textContent = wordData.translations[defLang].definition;
    }

    function get_info(word) {
        // show loading box
        loadingImg.style.display = "block";
        chrome.storage.sync.get(["language"]).then(result => {
            return result.language;
        }).then(res => {
            defLang = res;
            return fetch(wordsURL + `${word.toLowerCase()}?lang=${defLang}`)
        }, _ => {
            // default to english
            console.warn("could not find language")
            defLang = "en";
            return fetch(wordsURL + `${word.toLowerCase()}?lang=${defLang}`)
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response;
        }).catch(err => {
            // if sandbox search is enabled, otherwise skip
            //console.log("sandbox search")
            if (sandboxCheckbox.checked) {
                return fetch(sandboxURL + `${word}?lang=${defLang}`);
            } else {
                throw new Error(err.message);
            }
        }).then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(response.message);
            }
            const data = response.json();
            return data;
        })/*.then(data => { // a timeout wait to test loading gif
            return new Promise(resolve => setTimeout(() => resolve(data), 3000));
        })*/.then(data => {
            loadingImg.style.display = "none";
            showData(data);
        }).catch(err => {
            console.error(err);
            loadingImg.style.display = "none";
            dataElements.def.textContent = `could not find word "${word.toLowerCase()}"`;
        });
    }

    function processText() {
        clear_slate();
        let textEntry = sanitizeInput(textBox.value.trim());
        if (textEntry) {
            get_info(textEntry);
        }
        textBox.select();
    }

    processText();
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

const showSandboxArea = document.getElementById("sandbox-show");
chrome.storage.sync.get(["sandbox"]).then(result => {
    console.log(result);
    if (result.sandbox == "always") {
        sandboxCheckbox.checked = true;
        sandboxCheckbox.value = "yes";
        showSandboxArea.style.display = "none";
    } else if (result.sandbox == "never") {
        sandboxCheckbox.checked = false;
        showSandboxArea.style.display = "none"
    }
});

document.getElementById("settings").onclick = () => {
    chrome.runtime.openOptionsPage().then(
        () => {console.log("opened options")},
        () => {console.log("options failed to open")}
)};