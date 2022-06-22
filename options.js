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
        opt.appendChild(document.createTextNode(languages[id].name_endonym))
        langSelect.appendChild(opt);
    }
});

langSelect.onchange = () => {
    saved = false;
    document.getElementById("save_dialog").innerHTML = "";
}

let saveButton = document.getElementById("saveButton")
saveButton.onclick = () => {
    let langID = langSelect.options[langSelect.selectedIndex].value;
    // make sure user chooses a language
    if (langID) {
        //console.log(langID);
        chrome.storage.sync.set({ language: langID });
        if (!saved) {
            saved = true;
            document.getElementById("save_dialog").innerHTML = "Settings Saved";
        }
    } else {
        document.getElementById("save_dialog").innerHTML = "Please select a language";
    }
    
}

