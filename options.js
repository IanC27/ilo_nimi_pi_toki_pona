let languages;
const langSelect = document.getElementById("langSelect");
const preferredSpeaker = document.getElementById("voicePref");
const autoplayBox = document.getElementById("autoplay");

let saved = false;
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
    const autoplayOn = autoplay.checked;
    // make sure user chooses a language
    chrome.storage.sync.set({ wordSpeaker: speaker});
    chrome.storage.sync.set({ autoplay: autoplayOn});
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
    chrome.storage.sync.get(["language", "wordSpeaker", "autoplay"], function(opt) {
        langSelect.value = opt.language;
        preferredSpeaker.value = opt.wordSpeaker;
        autoplay.checked = opt.autoplay;
    });
}

document.getElementById("saveButton").addEventListener("click", save_options);
