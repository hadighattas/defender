//Scroll more to get more posts to analyze
console.log("AnalyzeScript");

loadMore(10, [get100Posts, send100Posts]);

function get100Posts() {
  var seeTranslation = document.querySelectorAll('[class^="_43f9"]');
  seeTranslation.forEach(function(currentValue, currentIndex, listObj) {
    currentValue.childNodes[0].click();
  });

  var hundredPosts = [];
  var posts = document.querySelectorAll('[class^="_5pbx"]');
  console.log(posts);

  posts.forEach(function(currentValue, currentIndex, listObj) {
    var postText = currentValue.innerText.replace(
      /[^a-zA-Z0-9!\?\(\)\\$<>\\/]/g,
      " "
    );
    var str = postText;
    if (str.replace(/[\s!?]/g, "").length) {
      var postParent =
        currentValue.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode;
      hundredPosts.push({
        post: { class: postParent.className, text: postText }
      });
      // console.log(hundredPosts);
    }
    if (
      hundredPosts[hundredPosts.length - 1].post.class.endsWith("hidden_elem")
    ) {
      hundredPosts.pop();
    }
  });

  hundredPosts.splice(0, 20);
  hundredPosts.splice(100, hundredPosts.length);
  console.log(hundredPosts);

  return hundredPosts;
}

function send100Posts(posts) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    console.log("Connected to server");
    socket.emit("100posts", posts);
  });

  socket.on("100postsreceived", function(data) {
    console.log(data.message);
    socket.disconnect();
  });
}
