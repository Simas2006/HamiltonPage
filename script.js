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

function onPlayerStateChange(event) {
  if ( event.data == YT.PlayerState.PLAYING ) {
    player1.playVideo();
    player2.playVideo();
    player1.setVolume(0);
  }
  if ( event.data == YT.PlayerState.PAUSED ) {
    player1.pauseVideo();
    player2.pauseVideo();
  }
  if ( event.data == YT.PlayerState.ENDED && event.target.a.id == "player2" ) {
    index++;
    player1.loadVideoById(videoData[index][0]);
    player2.loadVideoById(videoData[index][1]);
  }
}

function changeSong(move) {
  index += move;
  player1.loadVideoById(videoData[index][0]);
  player2.loadVideoById(videoData[index][1]);
}

function onPlayerReady(event) {}
