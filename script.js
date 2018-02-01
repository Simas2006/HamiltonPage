var videoData,player1,player2;
var index = 0;

function onYouTubeIframeAPIReady() {
  var req = new XMLHttpRequest();
  req.open("GET","videos.json");
  req.onload = function() {
    videoData = JSON.parse(this.responseText);
    player1 = new YT.Player("player1", {
      videoId: videoData[index][0],
      events: {
        "onReady": onPlayerReady,
        "onStateChange": onPlayerStateChange
      }
    });
    player2 = new YT.Player("player2", {
      videoId: videoData[index][1],
      events: {
        "onReady": onPlayerReady,
        "onStateChange": onPlayerStateChange
      }
    });
  }
  req.send();
}

function onPlayerReady(event) {}
