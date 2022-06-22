let translateButton = document.getElementById("translateButton");
let textBox = document.getElementById("text");
let defPara = document.getElementById("definition");
let nimi = document.getElementById("nimi");
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

// simple input sanitizer: https://developer.chrome.com/docs/extensions/mv3/security/
function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const translate = () => {
    //console.log("clicked");
    function get_def(word) {
        if (lang in words[word].def) {
                    //console.log(words[textEntry].def[lang]);
                    nimi.textContent = word;
                    defPara.textContent = words[word].def[lang];
                } else {
                    nimi.textContent = "";
                    defPara.textContent = "translation not found in your language";
                }
    }

    if (words) {
        let textEntry = sanitizeInput(textBox.value.trim());
        if (textEntry) {
            if (textEntry in words) {
                get_def(textEntry);
            } else if (textEntry.toLowerCase() in words) {
                get_def(textEntry.toLowerCase());
            } else {
                nimi.textContent = "";
                defPara.textContent = `word "${textEntry}" not found`;
            }
            
        }
    } else {
        console.error("could not access the database... report it to the dev? : https://github.com/IanC27/ilo_nimi_pi_toki_pona/issues")
    }
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "selection" }, function (response) {
        if (response.query) {
            //console.log(response.query);
            textBox.value = response.query;
            translate();
        }

    });
});



textBox.onchange = translate;
translateButton.onclick = translate;