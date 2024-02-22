var video = document.querySelector("#player");
if (Hls.isSupported()) {
  var hls = new Hls();
  // Replace the url with the anime url
  hls.loadSource(
    "https://corsproxy.org/?https://cakal.click/yayinzirve.m3u8"
  );
  hls.attachMedia(video);
}
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  player = loadPlayer();
});
function updateQuality(newQuality) {
  hls.levels.forEach((level, levelIndex) => {
    if (level.height === newQuality) {
      console.log("Found quality match with " + newQuality);
      hls.currentLevel = levelIndex;
    }
  });
}
function loadPlayer() {
  // If HLS is supported (ie non-mobile), we add video quality settings
  const defaultOptions = {};
  const availableQualities = hls.levels.map((l) => l.height);
  // Add new qualities to option
  // You can add and customize this object according to your flash player
  defaultOptions.quality = {
    default: availableQualities[1],
    options: availableQualities,
    // this ensures Plyr to use Hls to update quality level
    forced: true,
    onChange: (e) => updateQuality(e)
  };
  // Initialize here
  const player = new Plyr("#player", defaultOptions);
  // Start HLS load on play event
  // Handle HLS quality changes
  return player;
}
