browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ language: "en" });
    browser.storage.sync.set({ wordSpeaker: "jan_lakuse"});
    browser.storage.sync.set({ autoplay: false });
    browser.storage.sync.set({ sandbox: "requested" }).then(() => {console.log("ha!")});
    

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
            browser.browserAction.openPopup();
        }
    });
    
   
});