//Executing ultiple scripts in a tab to make functions
//of one script available to the other
function shufflePosts() {
  chrome.tabs.executeScript({ file: "scroll.js" });
  chrome.tabs.executeScript({ file: "content.js" });
}

function getLikes() {
  chrome.tabs.executeScript({ file: "socket.io.js" });
  chrome.tabs.executeScript({ file: "scroll.js" });
  chrome.tabs.executeScript({ file: "likes.js" });
}

function get20Posts() {
  chrome.tabs.executeScript({ file: "socket.io.js" });
  chrome.tabs.executeScript({ file: "scroll.js" });
  chrome.tabs.executeScript({ file: "20posts.js" });
}

function getTimelinePosts() {
  chrome.tabs.executeScript({ file: "socket.io.js" });
  chrome.tabs.executeScript({ file: "scroll.js" });
  chrome.tabs.executeScript({ file: "timeline.js" });
}

function analyzePosts() {
  chrome.tabs.executeScript({ file: "socket.io.js" });
  chrome.tabs.executeScript({ file: "scroll.js" });
  chrome.tabs.executeScript({ file: "analyze.js" });
}

document
  .getElementById("shuffleButton")
  .addEventListener("click", shufflePosts);
document.getElementById("likesButton").addEventListener("click", getLikes);
document.getElementById("20PostsButton").addEventListener("click", get20Posts);
document
  .getElementById("timelinePostsButton")
  .addEventListener("click", getTimelinePosts);
document
  .getElementById("analyzeButton")
  .addEventListener("click", analyzePosts);
