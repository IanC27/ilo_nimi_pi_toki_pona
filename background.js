chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ language: "en" });
    chrome.storage.sync.set({ wordSpeaker: "jan_lakuse"});
    chrome.storage.sync.set({ autoplay: false });
    chrome.storage.sync.set({ sandbox: "requested" });
    
    browser.contextMenus.create({
        title: "Translate Toki Pona word \"%s\"",
        id: "translate",
        contexts: ["selection"],
    }, 
        () => {console.log("created menu item");
    });
    
    browser.contextMenus.onClicked.addListener((info) => {
        console.log("ok");
        if (info.menuItemId == "translate") {
            console.log(info.selectionText);
            browser.action.openPopup();
        }
    });
    
   
});