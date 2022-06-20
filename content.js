chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "nimi seme?") {
            selectedText = window.getSelection().toString();
            sendResponse({query: selectedText});
        }
    }
);
//console.log("okie dokie");