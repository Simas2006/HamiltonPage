var videoData,resetData,player1,player2;
var index = 0;
var waiting = false;
var expanded = false;

function render() {
  var animators = videoData.map(item => item[3].split(" (upload")[0]);
  animators = animators.filter((item,index) => index == animators.indexOf(item));
  animators = animators.map(item => `- ${item}\n`).join("");
  document.getElementById("animators").innerText = "Thank you to our animators (in order of appearance): \n" + animators;
  document.getElementById("author").innerText = videoData[index][2] + " by " + videoData[index][3];
  var box = document.getElementById("song-dropdown");
  while ( box.firstChild ) {
    box.removeChild(box.firstChild);
  }
  for ( var i = 0; i < videoData.length; i++ ) {
    var item = document.createElement("li");
    var a = document.createElement("a");
    a.innerText = videoData[i][2] + " by " + videoData[i][3];
    a.href = "javascript: changeSong(" + i + ",true)";
    item.appendChild(a);
    box.appendChild(item);
  }
}

function onYouTubeIframeAPIReady() {
  var req = new XMLHttpRequest();
  req.open("GET","videos.json");
  req.onload = function() {
    videoData = JSON.parse(this.responseText);
    resetData = JSON.parse(this.responseText);
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
    videoData = videoData.filter(item => ! item[5]);
    render();
    setTimeout(function() {
      setInterval(function() {
        if ( Math.round(player1.getCurrentTime()) - videoData[index][4] != Math.round(player2.getCurrentTime()) && ! waiting ) player2.seekTo(player1.getCurrentTime() - videoData[index][4]);
      },500);
    },1000);
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

function toggleExpansion() {
  expanded = ! expanded;
  var newVideoData = resetData.map(item => item); // pointers
  if ( ! expanded ) newVideoData = videoData.filter(item => ! item[5]);
  if ( newVideoData.map(item => JSON.stringify(item)).indexOf(JSON.stringify(videoData[index])) == -1 ) {
    index = newVideoData.map(item => JSON.stringify(item)).indexOf(JSON.stringify(videoData[index - 1])) + 1;
    videoData = newVideoData;
    changeSong(-1);
  } else {
    index = newVideoData.map(item => JSON.stringify(item)).indexOf(JSON.stringify(videoData[index]));
    videoData = newVideoData;
  }
  render();
}

function changeSong(move,set) {
  if ( move < 0 && index == 0 && ! set ) return;
  if ( move > 0 && index + 1 >= videoData.length && ! set ) return;
  if ( ! set ) index += move;
  else index = move;
  player1.loadVideoById(videoData[index][0]);
  player1.seekTo(videoData[index][4]);
  player2.loadVideoById(videoData[index][1]);
  document.getElementById("author").innerText = videoData[index][2] + " by " + videoData[index][3];
  waiting = false;
}

function onPlayerReady(event) {}
