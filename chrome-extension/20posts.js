console.log("20PostsScript");

loadMore(3, [get20Posts, send20Posts]);

function get20Posts() {
  // var seeTranslation = document.querySelectorAll('[class^="_43f9"]');
  // seeTranslation.forEach(function(currentValue, currentIndex, listObj) {
  //   currentValue.childNodes[0].click();
  // });

  var twentyPosts = [];
  var posts = document.querySelectorAll('[class^="_5pbx"]');

  posts.forEach(function(currentValue, currentIndex, listObj) {
    var postText = currentValue.innerText.replace(
      /[^a-zA-Z0-9!\?\(\)\\$<>\\/]/g,
      " "
    );
    var str = postText;
    if (str.replace(/[\s!?]/g, "").length) {
      twentyPosts.push({ post: postText });
    }
  });

  twentyPosts.splice(100, twentyPosts.length);
  console.log(twentyPosts);

  return twentyPosts;
}

function send20Posts(posts) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    // Respond with a message including this clients' id sent from the server
    console.log("Connected to server");
    socket.emit("20posts", posts);
  });

  socket.on("20postsreceived", function(data) {
    console.log(data.message);
  });
}
