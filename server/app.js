var http = require("http"),
  fs = require("fs"),
  request = require("request"),
  textrazorSdk = require("textrazor-sdk"),
  ParserSDK = require("textrazor-sdk/lib/Parser");
googleTrends = require("google-trends-api");

const textRazor = new textrazorSdk(
  "***REMOVED***"
);

var parser = new ParserSDK();

var app = http.createServer(function(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
});

var io = require("socket.io").listen(app);

var likesList;
var timelinePostsList;
var twentyPostslist;
var postsToAnalyze;
var topUserInterest;

io.on("connection", function(socket) {
  socket.emit("welcome", {
    message: "Welcome!",
    id: socket.id
  });

  socket.on("likes", function(data) {
    console.log("The likes have been received");
    likesList = data;
    socket.emit("likesreceived", {
      message: "Likes have beeen successfully sent to the server"
    });
  });

  socket.on("posts", function(data) {
    console.log("The timeline posts have been received");
    timelinePostsList = data;
    socket.emit("postsreceived", {
      message: "Posts have beeen successfully sent to the server"
    });
  });

  socket.on("20posts", function(data) {
    twentyPostslist = data;
    console.log("The first 20 timeline posts have been received");
    socket.emit("20postsreceived", {
      message: "The first 20 posts have beeen successfully sent to the server"
    });
  });

  socket.on("100posts", function(data) {
    console.log("The posts to be analyzed have been received");
    postsToAnalyze = data;
    console.log("Posts to analyze: ", postsToAnalyze[0].post);
    var userInterests = analyzeData(analyzePosts);
  });
});

app.listen(3000);

function analyzeData(callback) {
  var dataToAnalyze = "";
  for (var i = 0; i < likesList.length; i++) {
    dataToAnalyze += " " + likesList[i].like + ".\n";
  }
  for (var i = 0; i < timelinePostsList.length; i++) {
    dataToAnalyze += " " + timelinePostsList[i].post + ".\n";
  }
  for (var i = 0; i < twentyPostslist.length; i++) {
    dataToAnalyze += " " + twentyPostslist[i].post + ".\n";
  }
  textRazor.parser
    .parse(dataToAnalyze)
    .then(results => {
      var frequency = maxFrequencyEntity(results);
      topUserInterest = frequency[0];
      console.log(
        "Your likes, posts and news feed suggestions show that you are mostly interested in: ",
        frequency[0]
      );
      console.log(
        "Here is a comprehensive list of the topics you are interested in: "
      );
      console.log(frequency[1]);

      callback(postsToAnalyze);
    })
    .catch(err => {
      console.log(err);
    });
}

function analyzePosts(postsToAnalyze) {
  console.log(topUserInterest);
  var query = {
    keyword: topUserInterest,
    startTime: new Date("2018-01-01"),
    endTime: new Date(Date.now())
  };
  googleTrends
    .relatedTopics(query)
    .then(function(res) {
      result = JSON.parse(res);
      console.log(result.default.rankedList[0].rankedKeyword[0].topic);
    })
    .catch(function(err) {
      console.error(err);
    });
}

function maxFrequencyEntity(json) {
  var modeMap = {};
  var entities = json.response.entities;
  var maxEl = entities[0].entityEnglishId,
    maxCount = 1;
  for (var i = 0; i < entities.length; i++) {
    var el = entities[i].entityEnglishId;
    if (el == "") continue;
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return [maxEl, modeMap];
}
