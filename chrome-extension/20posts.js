console.log("20PostsScript");

loadMore(3, [get20Posts, send20Posts]);

function get20Posts() {
  var twentyPosts = [];
  // getting posts based on their tag "class"
  var posts = document.querySelectorAll('[class^="_5pbx"]');

  posts.forEach(function(currentValue, currentIndex, listObj) {
    // cleaning up the expressions, removing non-alphabetical characters
    var postText = currentValue.innerText.replace(
      /[^a-zA-Z0-9!\?\(\)\\$<>\\/]/g,
      " "
    );
    var str = postText;
    // if post is not empty add it to list
    if (str.replace(/[\s!?]/g, "").length) {
      twentyPosts.push({ post: postText });
    }
  });

  twentyPosts.splice(100, twentyPosts.length);
  console.log(twentyPosts);

  return twentyPosts;
}

// sending posts to the server
function send20Posts(posts) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    console.log("Connected to server");
    socket.emit("20posts", posts);
  });

  socket.on("20postsreceived", function(data) {
    console.log(data.message);
  });
}
