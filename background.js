chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ language: "en" });
    chrome.storage.sync.set({ wordSpeaker: "jan_lakuse"});
    chrome.storage.sync.set({ autoplay: false });
    chrome.storage.sync.set({ sandbox: "requested" });
    
    // can't open popups from context menu yet:
    // https://github.com/GoogleChrome/developer.chrome.com/issues/2602
    /* 
    chrome.contextMenus.create({
        title: "Translate Toki Pona word \"%s\"",
        id: "translate",
        contexts: ["selection"],
    }, 
        () => {console.log("created menu item");
    });
    
    chrome.contextMenus.onClicked.addListener((info) => {
        console.log("ok");
        if (info.menuItemId == "translate") {
            console.log(info.selectionText);
            chrome.action.openPopup();
        }
    });
    */
   
});


// getting the json:
// https://stackoverflow.com/a/59916857
// no longer needed with new api.linku.la
/*
const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
        throw new Error(response.statusText);

    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
}
*/