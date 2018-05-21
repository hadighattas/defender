console.log("ShufflingPostsScript");
tempAlert("Fetching Posts", 2000);

// import file from 'socekt.io';
console.log("hi");
var timesScrolled = 0;
var timer = setInterval(function() {
  // timesScrolled++;
  // window.scrollBy(0, 10000);
  var a = document.getElementsByClassName("_5usd")[0];
  a.click();
  timesScrolled++;
  if (timesScrolled > 2) {
    clearInterval(timer);
    window.scrollTo(0, 0);
    action();
  }
}, 2000);

function action() {
  var posts = document.querySelectorAll('[id^="hyperfeed_story_id_"]');
  var postsParents = [];
  var postsIds = [];
  posts.forEach(function(currentValue, currentIndex, listObj) {
    postsParents.push(currentValue.parentNode);
    postsIds.push(currentValue.id);
  });

  var newPosts = [];
  newPosts.push(document.createElement("div"));
  newPosts[0].innerHTML = postsParents[0].innerHTML;
  newPosts.push(document.createElement("div"));
  newPosts[1].innerHTML = postsParents[1].innerHTML;
  for (var i = 0; i < postsParents.length - 2; i++) {
    newPosts.push(document.createElement("div"));
    newPosts[i + 2].innerHTML = postsParents[i + 2].childNodes[i % 5].outerHTML;
  }
  console.log("The old posts order is: ", newPosts);

  newPosts = shuffle(newPosts);
  console.log("The new posts order: ", newPosts);

  console.log(
    postsIds.indexOf(postsParents[0].childNodes[0].id),
    postsParents[0].childNodes[0].id,
    " has been replaced by ",
    postsIds.indexOf(newPosts[0].childNodes[0].id),
    newPosts[0].childNodes[0].id
  );
  postsParents[0].replaceWith(newPosts[0]);
  console.log(
    postsIds.indexOf(postsParents[1].childNodes[0].id),
    postsParents[1].childNodes[0].id,
    " has been replaced by ",
    postsIds.indexOf(newPosts[1].childNodes[0].id),
    newPosts[1].childNodes[0].id
  );
  postsParents[1].replaceWith(newPosts[1]);
  for (var i = 0; i < postsParents.length - 2; i++) {
    var currentNode = postsParents[i + 2].childNodes[i % 5];
    var newNode = newPosts[i + 2].childNodes[0];
    console.log(
      postsIds.indexOf(currentNode.id),
      currentNode.id,
      " has been replaced by ",
      postsIds.indexOf(newNode.id),
      newNode.id
    );
    currentNode.replaceWith(newNode);
  }

  tempAlert("Done posts have been randomly reordered", 1000);
}

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
