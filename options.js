let languages;
let langSelect = document.getElementById("langSelect");
let saved = false;
const wordInfoItems = ["book"];

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
for (let item of wordInfoItems) {
    document.getElementById(`show_${item}`).onchange = settingChange;
}

function save_options() {
    let langID = langSelect.options[langSelect.selectedIndex].value;
    // make sure user chooses a language
    if (langID) {
        //console.log(langID);
        chrome.storage.sync.set({ language: langID });
        const wordInfoPrefs = {};
        for (let item of wordInfoItems) {
            let val = document.getElementById(`show_${item}`).checked;
            //console.log("something");
            wordInfoPrefs[item] = val;
        }
        chrome.storage.sync.set({infoPrefs: wordInfoPrefs});

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
    chrome.storage.sync.get(["language", "infoPrefs"], function(opt) {
        langSelect.value = opt.language;
        //console.log(opt.infoPrefs);

        for (let key of Object.keys(opt.infoPrefs)) {
            let checkbox = document.getElementById(`show_${key}`);
            checkbox.checked = opt.infoPrefs[key];
        }
    })
}

document.getElementById("saveButton").addEventListener("click", save_options);
document.addEventListener("DOMContentLoaded", load_options);
