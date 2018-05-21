function scroll(depth, scrapeCallback, sendCallback) {
  var timesToScroll = depth;
  var timer = setInterval(function() {
    timesToScroll--;
    window.scrollTo(0, document.body.scrollHeight);
    if (timesToScroll < 0) {
      clearInterval(timer);
      window.scrollTo(0, 0);
      var list = scrapeCallback();
      console.log(list);
      sendCallback(list);
    }
  }, 1000);
}
