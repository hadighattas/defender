console.log("TimelinePostsScript");
var timesScrolled = 0;
var timer = setInterval(function() {
  timesScrolled++;
  window.scrollTo(0, document.body.scrollHeight);
  if (timesScrolled > 20) {
    clearInterval(timer);
    window.scrollTo(0, 0);
    var postsList = scrapePosts();
    console.log(postsList);
    sendPosts(postsList);
  }
}, 1000);

function scrapePosts() {
  var posts = document.querySelectorAll('[class^="_5pbx userContent _3576"]');
  console.log(posts);
  var sharedPosts = document.querySelectorAll('[class^="mtm _5pco"]');
  var myPosts = document.querySelectorAll('[class^="_5_jv _58jw"]');
  var postsList = [];
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i].childNodes[0].innerText;
    post.replace(/[^a-zA-Z0-9\!\?\(\)\\$<>\\/]/g, " ");
    var str = post;
    if (str.replace(/[\s!?]/g, "").length) {
      postsList.push({ post: post });
    }
  }
  for (i = 0; i < sharedPosts.length; i++) {
    var sharedPost = sharedPosts[i].childNodes[0].innerText;
    sharedPost.replace(/[^a-zA-Z0-9!\?\(\)\\$<>\\/]/g, " ");
    var str = sharedPost;
    if (str.replace(/[\s!?]/g, "").length) {
      postsList.push({ post: sharedPost });
    }
  }
  for (i = 0; i < myPosts.length; i++) {
    var myPost = myPosts[i].childNodes[0].innerText;
    myPost.replace(/[^a-zA-Z0-9!\?\(\)\\$<>\\/]/g, " ");
    var str = myPost;
    if (str.replace(/[\s!?]/g, "").length) {
      postsList.push({ post: myPost });
    }
  }
  return postsList;
}

function sendPosts(postsList) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    // Respond with a message including this clients' id sent from the server
    console.log("hi");
    socket.emit("posts", postsList);
  });

  socket.on("postsreceived", function(data) {
    console.log(data.message);
    socket.disconnect();
  });
}
