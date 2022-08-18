let languages;
let langSelect = document.getElementById("langSelect");
let saved = false;
chrome.storage.local.get(["linku_data"], result => {
    //console.log(result);
    languages = result.linku_data.languages;
    langIDs = Object.keys(languages);
    for (let id of langIDs) {
        let opt = document.createElement("option");
        opt.value = id;
        opt.appendChild(document.createTextNode(languages[id].name_endonym));
        langSelect.appendChild(opt);
    }
});

function settingChange() {
    saved = false;
    document.getElementById("save_dialog").textContent = "";
}

langSelect.onchange = settingChange;

function save_options() {
    let langID = langSelect.options[langSelect.selectedIndex].value;
    // make sure user chooses a language
    if (langID) {
        //console.log(langID);
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
    console.log("load options");
    chrome.storage.sync.get(["language"], function(opt) {
        langSelect.value = opt.language;
    });
}

document.getElementById("saveButton").addEventListener("click", save_options);
document.addEventListener("DOMContentLoaded", load_options);
