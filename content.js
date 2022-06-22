
// listen for query request and respond with selected text
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(request.greeting);
        selectedText = window.getSelection().toString();
        sendResponse({query: selectedText});
    }
);
//console.log("okie dokie");