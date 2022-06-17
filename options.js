let languages;
let langSelect = document.getElementById("langSelect");
chrome.storage.local.get(["linku_data"], result => {
    console.log(result);
    languages = result.linku_data.languages;
    langIDs = Object.keys(languages);
    for(let id of langIDs) {
        let opt = document.createElement("option");
        opt.value = id;
        opt.appendChild(document.createTextNode(languages[id].name_endonym))
        langSelect.appendChild(opt);
    }
});

let saveButton = document.getElementById("saveButton")
saveButton.onclick = () => {
   let langID = langSelect.options[langSelect.selectedIndex].value;
   console.log(langID);
   chrome.storage.sync.set({language: langID})
}

