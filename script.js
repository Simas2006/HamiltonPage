var videoData,player1,player2;
var index = 0;
var waiting = false;

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
    var animators = videoData.map(item => item[3].split(" (upload")[0]);
    animators = animators.filter((item,index) => index == animators.indexOf(item));
    animators = animators.map(item => `- ${item}\n`).join("");
    document.getElementById("animators").innerText = "Thank you to our animators (in order of appearance): \n" + animators;
    document.getElementById("author").innerText = videoData[index][2] + " by " + videoData[index][3];
    setInterval(function() {
      if ( Math.round(player1.getCurrentTime()) != Math.round(player2.getCurrentTime()) && ! waiting ) player2.seekTo(player1.getCurrentTime());
    },500);
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
    changeSong(1);
  }
  if ( event.data == YT.PlayerState.ENDED && event.target.a.id == "player1" ) {
    waiting = true;
  }
}

function changeSong(move) {
  if ( move < 0 && index == 0 ) return;
  if ( move > 0 && index + 1 >= videoData.length ) return;
  index += move;
  player1.loadVideoById(videoData[index][0]);
  player2.loadVideoById(videoData[index][1]);
  document.getElementById("author").innerText = videoData[index][2] + " by " + videoData[index][3];
  waiting = false;
}

function onPlayerReady(event) {}
