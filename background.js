// getting the json:
// https://stackoverflow.com/a/59916857
const getJSON = async url => {
    const response = await fetch(url);
    if(!response.ok) // check if response worked (no 404 errors etc...)
      throw new Error(response.statusText);
  
    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
}
// get the linku
console.log("Fetching data...");
getJSON("https://lipu-linku.github.io/jasima/data.json").then(data => {
    chrome.storage.local.set({linku_data: data}, () => console.log(data));
}).catch(error => {
    console.error(error);
});

chrome.runtime.onInstalled.addListener(() => {
    
})