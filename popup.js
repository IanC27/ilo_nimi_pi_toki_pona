let translateButton = document.getElementById("translateButton");
let textBox = document.getElementById("text");
let defPara = document.getElementById("definition");
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

const translate = () => {
    //console.log("clicked");
    if (words) {
        textEntry = textBox.value.trim();
        if (textEntry){
            if (textEntry in words) {
                if (lang in words[textEntry].def) {
                    //console.log(words[textEntry].def[lang]);
                    defPara.innerHTML = words[textEntry].def[lang];
                } else {
                    defPara.innerHTML = "translation not found in your language";
                }
            } else {
                defPara.innerHTML = "word not found";
            }
        }
    } else {
        console.log("could not access the database... wait a bit and try again?")
    }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "nimi seme?"}, function(response) {
      console.log(response.query);
      textBox.value = response.query;
      translate();
    });
  });

textBox.onchange = translate;
translateButton.onclick = translate;