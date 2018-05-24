// imports
var http = require("http"),
  fs = require("fs"),
  request = require("request"),
  textrazorSdk = require("textrazor-sdk"),
  ParserSDK = require("textrazor-sdk/lib/Parser"),
  googleTrends = require("google-trends-api");

const textRazor = new textrazorSdk(
  "***REMOVED***"
);

// instantiating the textrazor parser
var parser = new ParserSDK();

var app = http.createServer(function(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
});

var io = require("socket.io").listen(app);

// variabls accesible by all functions
var likesList;
var timelinePostsList;
var twentyPostslist;
var postsToAnalyze;
var topUserInterest;
var trendingTopic;

io.on("connection", function(socket) {
  socket.emit("welcome", {
    message: "Welcome!",
    id: socket.id
  });

  // executed when likes of user are received
  socket.on("likes", function(data) {
    console.log("The likes have been received");
    likesList = data;
    socket.emit("likesreceived", {
      message: "Likes have beeen successfully sent to the server"
    });
  });

  // executed when timeline posts of user are received
  socket.on("posts", function(data) {
    console.log("The timeline posts have been received");
    timelinePostsList = data;
    socket.emit("postsreceived", {
      message: "Posts have beeen successfully sent to the server"
    });
  });

  // executed when the first 20 posts of the user's newsfeed are received
  socket.on("20posts", function(data) {
    twentyPostslist = data;
    console.log("The first 20 timeline posts have been received");
    socket.emit("20postsreceived", {
      message: "The first 20 posts have beeen successfully sent to the server"
    });
  });

  // executed when the posts to analyze are received
  socket.on("100posts", function(data) {
    console.log("The posts to be analyzed have been received");
    postsToAnalyze = data;
    // as all functions are asynchronous, call next function on callback
    analyzeData(function() {
      getTrends(function() {
        analyzePosts(0, function() {});
      });
    });
  });
});

app.listen(3000);

// function that groups all the likes and posts into a single var, and sends it to texrazor api to determine the main topics
function analyzeData(callback) {
  // combine all the data collected to send them to text razor api
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
  // send data to text razor api
  textRazor.parser
    .parse(dataToAnalyze)
    .then(results => {
      var frequency = maxFrequencyEntity(results);
      topUserInterest = frequency[0]; // most frequent topic in the user's data
      console.log(
        "Your likes, posts and news feed suggestions show that you are mostly interested in: ",
        frequency[0]
      );
      console.log(
        "Here is a comprehensive list of the topics you are interested in: "
      );
      console.log(frequency[1]);

      callback();
    })
    .catch(err => {
      console.log(err);
    });
}

// function that sends the top result in user's interests to google trends, and gets the trend in that topic
function getTrends(callback) {
  console.log(topUserInterest);
  var query = {
    keyword: topUserInterest, // the user's top interest
    startTime: new Date("2018-01-01"),
    endTime: new Date(Date.now())
  };
  // send a request to the google trends api to get most trending topic for the user's top interest
  googleTrends
    .relatedTopics(query)
    .then(function(res) {
      result = JSON.parse(res);
      trendingTopic = result.default.rankedList[0].rankedKeyword[0].topic.title;
      console.log(trendingTopic); // the trend in that topic

      callback();
    })
    .catch(function(err) {
      console.error(err);
    });
}

// This function is a async loop where the next iteration is executed on callback
function analyzePosts(counter, callback) {
  console.log(postsToAnalyze[counter].post.text);
  textRazor.parser
    .parse(postsToAnalyze[counter].post.text)
    .then(results => {
      console.log(results);
      var frequency = maxFrequencyEntity(results);
      topic = frequency[0]; // most frequent topic in the user's data
      // check is the topic of the post matches the trending topic
      if (topic == trendingTopic) {
        console.log("Like the following post: ", postsToAnalyze[i]);
      }
      // if this is the last call, execute the function's original callback
      if (counter == postsToAnalyze.length - 1) {
        callback();
      } else {
        // execute next iteration of function after response of textrazor api
        analyzePosts(++counter, callback);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

// function that counts the repetitions in the user's topics
function maxFrequencyEntity(json) {
  var modeMap = {};
  var entities = json.response.entities;
  if (typeof entities != "undefined") {
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
  return [0, 0];
}
