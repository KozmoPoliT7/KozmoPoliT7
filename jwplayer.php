<!doctype html>
<html lang="en">
<head>
<!-- Required meta tags -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
<link rel="icon" type="image/x-icon" href=" <!-- Favicon Path Here --> "/>
<script> document.title = "JWPlayer";</script>	
	
<!-- File Javascript -->
<script src="https://cdn.codenine.biz.id/assets/libraries/jwplayer/codenine-hls.min.js"></script>
<script src="https://cdn.codenine.biz.id/assets/libraries/jwplayer/codenine-provider.hlsjs.js"></script>
<script src="https://ssl.p.jwpcdn.com/player/v/8.8.6/jwplayer.js"></script>
<!-- File jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<!-- File Css -->
<link rel="stylesheet" type="text/css" href="https://cdn.codenine.biz.id/assets/libraries/jwplayer/player.css">

<script type="text/javascript">jwplayer.key="64HPbvSQorQcd52B8XFuhMtEoitbvY/EXJmMBfKcXZQU2Rnn";</script>


<link rel="dns-prefetch" href=" <!-- URL Address Here --> "/>
<link rel="dns-prefetch" href=" <!-- URL Address Here --> "/>
<link rel="dns-prefetch" href=" <!-- URL Address Here --> "/>
<link rel="dns-prefetch" href=" <!-- URL Address Here --> "/>
	
</head>
<body>
<!-- ID Perloader -->
<div id="loader-wrapper">
<div id="loader"></div>
<div class="circle-line">
<div class="circle-blue">&nbsp;</div>
<div class="circle-red">&nbsp;</div>
<div class="circle-green">&nbsp;</div>
<div class="circle-yellow">&nbsp;</div>
</div>
</div>
</div>
<!-- ID Player -->
<div id="codenine-player"></div>
<!-- JavaScript Setup JWPlayer -->
<script>
var p2pConfig = {
logLevel: 'debug',
live: true, // set to false in VOD mode        
}

if (!Hls.P2pEngine.isMSESupported() || Hls.P2pEngine.getBrowser() === 'Mac-Safari') {
new Hls.P2pEngine.ServiceWorkerEngine(p2pConfig)
} 

jwplayer('codenine-player').setup({
file: ' <!-- m3u8 file here --> ',
autostart: false,
stretching:"uniform",
aspectratio: "16:9",
image: " <!-- URL Poster or Thumbnail Here --> ",
playbackRateControls: true,
sharing: {
sites: ["facebook","twitter","email","linkedin","pinterest"]
},

captions: {
color: "#fff",
fontSize: 16,
isDefault: "true",
backgroundOpacity: 0,
fontfamily: "Helvetica",
edgeStyle: "depressed"
},

advertising: {
client: "vast",
schedule: {
adbreak1: {
offset : "pre",                         
tag: " <!-- URL Ad Vast Tags here --> ",
skipoffset: 10
},
adbreak2: {
offset: "50%",
tag: " <!-- URL Ad Vast Tags here --> ",
skipoffset: 10
},
},
},

logo: {
file: " <!-- watermark Image file here --> ",
position: "top-left",
link : "#",
},

skin: {
controlbar: {
"icons": "#FC376C",
"iconsActive": "#fff"
},
timeslider: {
"progress": "#fff",
}
},

hlsjsdefault: true,
hlsjsConfig: {
p2pConfig
},
});
</script>
<!-- Included PHP File - Pop-up Ads -->
<?php include './ad_popup.php'; ?>
<!-- Function JavaScript Perloader -->
<script>
setTimeout(function() {
$("#loader").delay(1000).fadeOut("slow");
$("#loader-wrapper").delay(1500).fadeOut("slow");
}, 2000);
</script>
</body>
</html>