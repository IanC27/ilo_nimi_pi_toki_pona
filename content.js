
// listen for query request and respond with selected text
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(request.greeting);
        if (request.action) {
            selectedText = window.getSelection().toString();
            sendResponse({query: selectedText});
        } else {
            console.error("Invalid Request")
        }
        
    }
);
//console.log("okie dokie");