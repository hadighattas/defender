console.log("TimelinePostsScript");
scroll(5, scrapeTimelinePosts, sendTimelinePosts);

function addToList(post, postsList) {
  var postText = post.childNodes[0].innerText;
  postText.replace(/[^a-zA-Z0-9\!\?\(\)\\$<>\\/]/g, " ");
  var str = postText;
  if (str.replace(/[\s!?]/g, "").length) {
    postsList.push({ post: postText });
  }
}

function scrapeTimelinePosts() {
  var posts = document.querySelectorAll('[class^="_5pbx userContent _3576"]');
  var sharedPosts = document.querySelectorAll('[class^="mtm _5pco"]');
  var myPosts = document.querySelectorAll('[class^="_5_jv _58jw"]');
  var postsList = [];
  for (var i = 0; i < posts.length; i++) {
    addToList(posts[i], postsList);
  }
  for (i = 0; i < sharedPosts.length; i++) {
    addToList(sharedPosts[i], postsList);
  }
  for (i = 0; i < myPosts.length; i++) {
    addToList(myPosts[i], postsList);
  }
  return postsList;
}

function sendTimelinePosts(postsList) {
  var socket = io.connect("http://127.0.0.1:3000/");
  socket.on("welcome", function(data) {
    socket.emit("posts", postsList);
  });

  socket.on("postsreceived", function(data) {
    console.log(data.message);
    socket.disconnect();
  });
}
