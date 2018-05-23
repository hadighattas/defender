console.log("LikesScript");
scroll(10, [scrapeLikes, sendLikes]);

function scrapeLikes() {
  var likes = document.querySelectorAll('[class^="fsl"]');
  var likesList = [];
  for (var i = 0; i < likes.length; i++) {
    likesList.push({ like: likes[i].childNodes[0].innerHTML });
  }
  return likesList;
}

function sendLikes(likesList) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    socket.emit("likes", likesList);
  });

  socket.on("likesreceived", function(data) {
    console.log(data.message);
    socket.disconnect();
  });
}
