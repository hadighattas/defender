console.log("LikesScript");
var timesScrolled = 0;
var timer = setInterval(function() {
  timesScrolled++;
  window.scrollTo(0, document.body.scrollHeight);
  if (timesScrolled > 5) {
    clearInterval(timer);
    window.scrollTo(0, 0);
    var likesList = scrapeLikes();
    console.log(likesList);
    sendLikes(likesList);
  }
}, 500);

function scrapeLikes() {
  var likes = document.querySelectorAll('[class^="fsl"]');
  var likesList = [];
  for (var i = 0; i < likes.length; i++) {
    likesList.push({ like:likes[i].childNodes[0].innerHTML});
  }
  return likesList;
}

function sendLikes(likesList) {

  var socket = io.connect('http://127.0.0.1:3000/');
  socket.on('welcome', function(data) {
    // Respond with a message including this clients' id sent from the server
    socket.emit('likes', 
      likesList
    );
  });

  socket.on('likesreceived', function(data) {
    console.log(data.message);
    socket.disconnect();
  });

}
