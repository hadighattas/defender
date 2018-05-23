console.log("ShufflingPostsScript");
tempAlert("Fetching Posts", 2000);

loadMore(2, [action]);

function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute(
    "style",
    "position:absolute;top:5%;left:5%;background-color:white;font-size: 100px;text-align:center;"
  );
  el.innerHTML = msg;
  setTimeout(function() {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createNewPosts(postsParents) {
  var newPosts = [];
  newPosts.push(document.createElement("div"));
  newPosts[0].innerHTML = postsParents[0].innerHTML;
  newPosts.push(document.createElement("div"));
  newPosts[1].innerHTML = postsParents[1].innerHTML;
  for (var i = 0; i < postsParents.length - 2; i++) {
    newPosts.push(document.createElement("div"));
    newPosts[i + 2].innerHTML = postsParents[i + 2].childNodes[i % 5].outerHTML;
  }

  return newPosts;
}

function logPostsSwapped(post1, post2, postsIds) {
  console.log(
    postsIds.indexOf(post1.id),
    post1.id,
    " has been replaced by ",
    postsIds.indexOf(post2.id),
    post2.id
  );
}

function action() {
  var posts = document.querySelectorAll('[id^="hyperfeed_story_id_"]');
  var postsParents = [];
  var postsIds = [];
  posts.forEach(function(currentValue, currentIndex, listObj) {
    postsParents.push(currentValue.parentNode);
    postsIds.push(currentValue.id);
  });

  var newPosts = createNewPosts(postsParents);

  console.log("The old posts order is: ", newPosts);

  newPosts = shuffle(newPosts);

  console.log("The new posts order: ", newPosts);

  logPostsSwapped(
    postsParents[0].childNodes[0],
    newPosts[0].childNodes[0],
    postsIds
  );
  postsParents[0].replaceWith(newPosts[0]);

  logPostsSwapped(
    postsParents[1].childNodes[0],
    newPosts[1].childNodes[0],
    postsIds
  );
  postsParents[1].replaceWith(newPosts[1]);

  for (var i = 0; i < postsParents.length - 2; i++) {
    var currentNode = postsParents[i + 2].childNodes[i % 5];
    var newNode = newPosts[i + 2].childNodes[0];
    logPostsSwapped(currentNode, newNode, postsIds);
    currentNode.replaceWith(newNode);
  }

  tempAlert("Done posts have been randomly reordered", 1000);
}
