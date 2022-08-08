chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ language: "en" });

    // set up default preferences:
    const wordInfoItems = ["book", "coined_era", "coined_year", "source_language", "etymology"]
    const wordInfoPrefs = {};
    for (let item of wordInfoItems) {
        wordInfoPrefs[item] = false;
    }
    wordInfoPrefs["book"] = true;

    chrome.storage.sync.set({infoPrefs: wordInfoPrefs});
    // can't open popups from context menu yet:
    // https://github.com/GoogleChrome/developer.chrome.com/issues/2602
    /* 
    
    chrome.contextMenus.create({
        title: "Translate Toki Pona word \"%s\"",
        id: "translate",
        contexts: ["selection"]
    });
    
    chrome.contextMenus.onClicked.addListener((info) => {
        console.log("ok");
        if (info.menuItemId == "translate") {
            console.log(info.selectionText);
            
        }
    });
    */

});

// getting the json:
// https://stackoverflow.com/a/59916857
const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
        throw new Error(response.statusText);

    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
}

// get the linku
//console.log("Fetching data...");
getJSON("https://lipu-linku.github.io/jasima/data.json").then(data => {
    chrome.storage.local.set({ linku_data: data }, () => console.log(data));
    let time_updated = Date();
    chrome.storage.local.set({ linku_update_time: time_updated}, () => console.log(time_updated));
}).catch(error => {
    console.error(error);
});



