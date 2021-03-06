// function that scrolls a page to a certain depth
// and then calls multiple callback functions
function scroll(depth, callbackFunctions) {
  var timesToScroll = depth;
  var timer = setInterval(function() {
    timesToScroll--;
    window.scrollTo(0, document.body.scrollHeight);
    if (timesToScroll < 0) {
      clearInterval(timer);
      window.scrollTo(0, 0);
      var resultFunction1 = callbackFunctions[0]();
      if (callbackFunctions.length == 2) {
        callbackFunctions[1](resultFunction1);
      }
    }
  }, 1000);
}

// function that simulates a click on the load more button
// of the news feed and calls multiple callback functions
function loadMore(depth, callbackFunctions) {
  var timesScrolled = depth;
  var timer = setInterval(function() {
    var a = document.getElementsByClassName("_5usd")[0];
    a.click();
    timesScrolled--;
    if (timesScrolled < 0) {
      clearInterval(timer);
      window.scrollTo(0, 0);
      var resultFunction1 = callbackFunctions[0]();
      if (callbackFunctions.length == 2) {
        callbackFunctions[1](resultFunction1);
      }
    }
  }, 2000);
}
