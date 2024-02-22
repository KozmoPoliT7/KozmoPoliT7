var player = videojs('player', {
  debug: true
});

// Function to jump to 2 minutes mark
function jumpToTwoMinutes() {
    if (player.readyState() > 0) {
        player.currentTime(120); // Jump to 2 minutes
    } else {
        setTimeout(jumpToTwoMinutes, 500); // Retry after 500ms
    }
}

// Set initial playback time to 2 minutes once the player is ready
player.on('firstplay', function() {
  jumpToTwoMinutes();
  console.log('Total video duration: ' + player.duration() + ' seconds');
});

// Monitor playback to stop at 3 minutes
player.on('timeupdate', function() {
  if (player.currentTime() >= 180) {
    player.pause();
    player.currentTime(180);
    console.warn('VIDEOJS: Stopped at 3 minutes mark');
  }
});

// Existing code for logging events
player.on(['loadstart', 'play', 'playing', 'firstplay', 'pause', 'ended', 'adplay', 'adplaying', 'adfirstplay', 'adpause', 'adended', 'contentplay', 'contentplaying', 'contentfirstplay', 'contentpause', 'contentended', 'contentupdate', 'loadeddata', 'loadedmetadata'], function(e) {
  console.warn('VIDEOJS player event: ',  e.type);
});
