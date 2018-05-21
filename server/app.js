var http = require("http"),
  fs = require("fs"),
  request = require("request"),
  textrazorSdk = require("textrazor-sdk"),
  ParserSDK = require("textrazor-sdk/lib/Parser");

const textRazor = new textrazorSdk("***REMOVED***");

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
var tba;

// Socket.io server listens to our app

io.on("connection", function(socket) {
  // Use socket to communicate with this particular client only, sending it it's own id
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

  socket.on("100posts", function(data){
    console.log("The posts to be analyzed have been received");
    tba = data;
    analyzeData();
    // analyzePosts(tba);

  });

});

app.listen(3000);

function analyzeData(){
  var likesString = '';
  for(var i = 0; i < likesList.length; i++){
    likesString += " "+ likesList[i].like + " ";
  }
  textRazor.parser.parse(likesString).then((results)=>{

    // toWrite = JSON.stringify(results);
    // fs.writeFile("C:/Users/hadi_/Desktop/text.txt", toWrite, function(err) {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log("The file was saved!");
    // });
    var frequency = maxFrequencyEntity(results);
    console.log("Your likes show that you are mostly interested in: ", frequency[0]);
    console.log("Here is a comprehensive list of the topics you like: ");
    console.log(frequency[1]); 
    
    
    var timelineString = "";
    for (var i = 0; i < timelinePostsList.length; i++) {
      timelineString += " " + timelinePostsList[i].post + " ";
    }
    textRazor.parser
      .parse(timelineString)
      .then(results => {
        var frequency = maxFrequencyEntity(results);
        console.log("Your posts show that you are mostly interested in: ", frequency[0]);
        console.log("Here is a comprehensive list of the topics you post about: ");
        console.log(frequency[1]);


          var twentyPostsString = "";
          for (var i = 0; i < twentyPostslist.length; i++) {
            twentyPostsString += " " + twentyPostslist[i].post + " ";
          }
          textRazor.parser
            .parse(twentyPostsString)
            .then(results => {
              var frequency = maxFrequencyEntity(results);
              console.log("Your news feed shows that you are mostly interested in: ", frequency[0]);
              console.log("Here is a comprehensive list of the topics facebook proposes to you: ");
              console.log(frequency[1]);
            })
            .catch(err => {
              console.log(err);
            });

      })
      .catch(err => {
        console.log(err);
      });


  }).catch((err) => {
    console.log(err);
  });

  
  
  

}

function analyzePosts(){

}

function maxFrequencyEntity(json) {
  var modeMap = {};
  var entities = json.response.entities;
  var maxEl = entities[0].entityEnglishId,
    maxCount = 1;
  for (var i = 0; i < entities.length; i++) {
    var el = entities[i].entityEnglishId;
    if(el == "" || el == "Translation" || el == "Hypertext Transfer Protocol" || el == "Netflix" || el == "Hogwarts") continue;
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return [maxEl, modeMap];
}