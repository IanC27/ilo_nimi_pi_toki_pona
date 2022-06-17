let translateButton = document.getElementById("translateButton");
let textBox = document.getElementById("text");
let defPara = document.getElementById("definition");
// TODO: language choice in options
let lang;
let words;
chrome.storage.local.get(["linku_data"], result => {
    console.log(result);
    words = result.linku_data.data;
});
chrome.storage.sync.get(["language"], result => {
    console.log(result);
    lang = result.language;
});


// TODO: get rid of button, maybe update on type?
translateButton.onclick = () => {
    //console.log("clicked");
    if (words) {
        textEntry = textBox.value.trim();
        if (textEntry){
            if (textEntry in words) {
                if (lang in words[textEntry].def) {
                    //console.log(words[textEntry].def[lang]);
                    defPara.innerHTML = words[textEntry].def[lang];
                } else {
                    console.log("translation not found in your language");
                }
            } else {
                console.log("word not found");
            }
        }
    } else {
        console.log("could not access the database... wait a bit and try again?")
    }
}