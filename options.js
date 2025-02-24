const langSelect = document.getElementById("langSelect");
const preferredSpeaker = document.getElementById("voicePref");
const autoplayBox = document.getElementById("autoplay");
const sandboxSelect = document.getElementById("sandbox");
const langURL = 'https://api.linku.la/v1/languages'

let saved = false;

/*
chrome.storage.local.get(["linku_data"], result => {
    languages = result.linku_data.languages;
    langIDs = Object.keys(languages);
    for (let id of langIDs) {
        let opt = document.createElement("option");
        opt.value = id;
        opt.appendChild(document.createTextNode(languages[id].name_endonym));
        langSelect.appendChild(opt);
    }
    load_options();
});
*/
const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
        throw new Error(response.statusText);
    
    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
}

getJSON(langURL).then((languages => {
    console.log(languages);
    langIDs = Object.keys(languages);
    for (let id of langIDs) {
        let opt = document.createElement("option");
        opt.value = id;
        opt.appendChild(document.createTextNode(languages[id].name.endonym));
        langSelect.appendChild(opt);
    }
    load_options();
})).catch(_ => {
    console.log("whoopsie");
    document.getElementById("warning").textContent = "Could not load languages. Please contact the dev or report on Github"
    load_options();
})


function settingChange() {
    saved = false;
    document.getElementById("save_dialog").textContent = "";
}

langSelect.onchange = settingChange;
preferredSpeaker.onchange = settingChange;
autoplayBox.onchange = settingChange;

function save_options() {
    const langID = langSelect.value;
    const speaker = preferredSpeaker.value;
    const autoplayOn = autoplayBox.checked;
    const sandboxSetting = sandboxSelect.value;
    // make sure user chooses a language
    chrome.storage.sync.set({ wordSpeaker: speaker});
    chrome.storage.sync.set({ autoplay: autoplayOn});
    chrome.storage.sync.set({ sandbox: sandboxSetting});
    if (langID) {
        chrome.storage.sync.set({ language: langID });
        if (!saved) {
            saved = true;
            document.getElementById("save_dialog").textContent = "Settings Saved";
        }
    } else {
        document.getElementById("save_dialog").textContent = "Please select a language";
    }
}

function load_options() {
    //console.log("load options");
    chrome.storage.sync.get(["language", "wordSpeaker", "autoplay", "sandbox"], function(opt) {
        langSelect.value = opt.language;
        preferredSpeaker.value = opt.wordSpeaker;
        autoplayBox.checked = opt.autoplay;
        sandboxSelect.value = opt.sandbox;
    });
}

document.getElementById("saveButton").addEventListener("click", save_options);
