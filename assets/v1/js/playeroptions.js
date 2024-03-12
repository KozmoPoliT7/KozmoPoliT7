let playerSetting = JSON.parse($_('[data-player]').dataset.player);
const video = $_('video.live-video-player');
let fbd = $_('[name="fbd"]').content;
let onexd = $_('[name="onexd"]').content;
let hlsd = $_('[name="hlsd"]').content;
let derbyd = $_('[name="derbyd"]').content;
let deviceName = document.querySelector('[data-d]').dataset.d;
let deviceid = document.querySelector('[data-device]').dataset.device;
let oldVolume = 1;

let getSeo = function(data) {
    return fetch('/SEO', {
        timeout: "1000",
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
        },
        body: JSON.stringify(data)
    }).then(data => data.json()).then(data => {
        if (data.status == true) {
            document.title = data.title;
            $_('meta[name="description"]').content = data.description;
            $_('meta[name="keywords"]').content = data.keywords;
            $_('[property="og:title"]').content = data.title;
            $_('[property="og:description"]').content = data.description;
            $_('[rel="canonical"]').href = data.canonical;
            //$_('[rel="amphtml"]').href = data.amp;
            if (document.querySelector('[data-analytics]')) {
                gtag('config', document.querySelector('[data-analytics]').dataset.analytics, {
                    'page_path': window.location.pathname
                });
            }
        }
    })
}

let updateSEO = function() {
    if ($_('.real-matches .active')) {
        let {seolink} = $_('.real-matches .active').dataset;
        history.pushState({}, "", `/mac-izle/${seolink}`);
        return getSeo({
            type: "match",
            data: seolink
        })
    }
    if ($_('.free-matches .active')) {
        let {seolink} = $_('.free-matches .active').dataset;
        history.pushState({}, "", `/maci-canli-izle/${seolink}`);
        return getSeo({
            type: "match",
            data: seolink
        })
    }
    if ($_('.bet-matches .active')) {
        let {stream} = $_('.bet-matches .active').dataset
        history.pushState({}, "", `${$_('.bet-matches .active').pathname}`);
        return getSeo({
            type: "bet",
            data: stream.replace('betlivematch-', '')
        });
    }
    if ($_('[data-channel="true"].active')) {
        let {name, stream} = $_('[data-channel="true"].active').dataset;
        history.pushState({}, "", `/canli-izle/${stream}`);
        return getSeo({
            type: "channel",
            data: stream
        })
    }

    if ($_('[data-onemli].active')) {
        let {matchseo} = $_('[data-onemli].active').dataset;
        history.pushState({}, "", `/mac-izle/${matchseo}`);
        return getSeo({
            type: "match",
            data: matchseo
        })
    }
}
let canliOynat;
if (video) {
    let hlsOptions = {
        maxBufferSize: 5,
        manifestLoadingTimeOut: 5000,
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 1000,
        manifestLoadingMaxRetryTimeout: 10000,
        debug: false
    };
    let hls = new Hls(hlsOptions);
    let tvLoader = function() {
        if ($_('.matchEndedScreen')) {
            $_('.matchEndedScreen').remove();
        }
        if ($_('.lastTime')) {
            $_('.lastTime').remove();
        }
        $_('.channel-name').textContent = $_('[data-stream].active') ? $_('[data-stream].active').dataset.name : '';
        $_('.watermark') ? $_('.watermark').classList.remove('show') : '';
        if ($_('.video-loader')) {
            $_('.video-loader').remove();
        }
        let div = document.createElement('DIV');
        div.classList.add('video-loader');
        let home, away, channel;
        if ($_('.live-list .single-match.active')) {
            home = `
				<img src="${$_('.live-list .single-match.active img').src}">
				<div class="loader-team-name">${$_('.single-match.active .teams > div:first-child').textContent}</div>
				`;
            away = `
				<img src="${$_('.live-list .single-match.active img:last-of-type').src}">
				<div class="loader-team-name">${$_('.single-match.active .teams > div:last-child').textContent}</div>
				`;
            div.innerHTML = `
			<div class="loader-text">
				<div class="loader-teams">
					<div class="loader-home">${home}</div>
					<div class="loader-bar"><div></div><div></div><div></div></div>
					<div class="loader-away">${away}</div>
				</div>
				<div class="loader-loading">Yükleniyor...</div>
			</div>`;
        } else if ($_('.channel-list [data-stream].active')) {
            div.innerHTML = `
				${$_('.channel-list [data-stream].active').querySelector('picture').outerHTML}
				<div class="loader-bar"><div></div><div></div><div></div></div>
				<div class="loader-loading">${$_('.channel-list [data-stream].active').dataset.name} Yükleniyor...</div>`;
        }
        $_('.plyr--video').append(div);
    }
 
    
    let watermark;
    if (playerSetting.watermark.is_active == '1' && playerSetting.watermark.imageUrl.length) {
        watermark = `<div class="watermark ${playerSetting.watermark.position}">
			${playerSetting.watermark.link.length?`<a href="${playerSetting.watermark.link}" target="_blank">`:''}
			<img src="${playerSetting.watermark.imageUrl}" alt="Yayın Logosu">
			${playerSetting.watermark.link.length?`</a>`:''}</div>`;
    } else {
        watermark = '';
    }
    var player = new Plyr(video, {
        title: '',
        controls: `
			${watermark}
	<div class="channel-name">${$_('[data-stream].active')?$_('[data-stream].active').dataset.name:''}</div>
	<div class="plyr__controls">
	<div class="player-flex">
	<div class="live-button">
		<div class="live-blink"></div>
		<div class="live-text">CANLI</div>
	</div>
		<button type="button" class="plyr__control" data-plyr="rewind">
			<svg role="presentation" viewBox="0 0 512 512">
			<g class="fa-group"><path fill="currentColor" d="M129 383a12 12 0 0 1 16.37-.56A166.77 166.77 0 0 0 256 424c93.82 0 167.24-76 168-166.55C424.79 162 346.91 87.21 254.51 88a166.73 166.73 0 0 0-113.2 45.25L84.69 76.69A247.12 247.12 0 0 1 255.54 8C392.35 7.76 504 119.19 504 256c0 137-111 248-248 248a247.11 247.11 0 0 1-166.18-63.91l-.49-.46a12 12 0 0 1 0-17z" class="fa-secondary"></path><path fill="currentColor" d="M49 41l134.06 134c15.09 15.15 4.38 41-17 41H32a24 24 0 0 1-24-24V57.94C8 36.56 33.85 25.85 49 41z" class="fa-primary"></path></g> 
			</svg>
			<span class="plyr__tooltip" role="tooltip">{seektime} saniye geriye sar</span>
		</button>
		<button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
			<svg class="icon--pressed" role="presentation" viewBox="0 0 448 512">
			
			<g class="fa-group">
			<path fill="currentColor" d="M144 31H48A48 48 0 0 0 0 79v352a48 48 0 0 0 48 48h96a48 48 0 0 0 48-48V79a48 48 0 0 0-48-48zm-16 368a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V111a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16zM400 31h-96a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h96a48 48 0 0 0 48-48V79a48 48 0 0 0-48-48zm-16 368a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V111a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16z"  class="fa-secondary"></path>
			<path fill="transparent" d="M112 95H80a16 16 0 0 0-16 16v288a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V111a16 16 0 0 0-16-16zm256 0h-32a16 16 0 0 0-16 16v288a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V111a16 16 0 0 0-16-16z"  class="fa-primary"></path></g>
	
			</svg>
			<svg class="icon--not-pressed" role="presentation" viewBox="0 0 448 512">
			<g class="fa-group"><path fill="currentColor" d="M424.41 214.66L72.41 6.55C43.81-10.34 0 6.05 0 47.87V464c0 37.5 40.69 60.09 72.41 41.3l352-208c31.4-18.54 31.5-64.14 0-82.64zM321.89 283.5L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.78 27-40.16 48.28-27.54l209.61 123.95a32 32 0 0 1 0 55.09z" class="fa-secondary"></path><path fill="transparent" d="M112.28 104.48l209.61 123.93a32 32 0 0 1 0 55.09L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.76 27-40.14 48.28-27.52z" class="fa-primary"></path></g>
			</svg>
			<span class="label--pressed plyr__tooltip" role="tooltip">Durdur</span>
			<span class="label--not-pressed plyr__tooltip" role="tooltip">Oynat</span>
		</button>
	
		<button type="button" class="plyr__control" data-light="on">
		<svg id="light-icon" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><g class="fa-group"><path fill="currentColor" d="M319.45,0C217.44.31,144,83,144,176a175,175,0,0,0,43.56,115.78c16.52,18.85,42.36,58.22,52.21,91.44,0,.28.07.53.11.78H400.12c0-.25.07-.5.11-.78,9.85-33.22,35.69-72.59,52.21-91.44A175,175,0,0,0,496,176C496,78.63,416.91-.31,319.45,0ZM320,96a80.09,80.09,0,0,0-80,80,16,16,0,0,1-32,0A112.12,112.12,0,0,1,320,64a16,16,0,0,1,0,32Z" class="fa-secondary"></path><path fill="currentColor" d="M240.06,454.34A32,32,0,0,0,245.42,472l17.1,25.69c5.23,7.91,17.17,14.28,26.64,14.28h61.7c9.47,0,21.41-6.37,26.64-14.28L394.59,472A37.47,37.47,0,0,0,400,454.34L400,416H240ZM112,192a24,24,0,0,0-24-24H24a24,24,0,0,0,0,48H88A24,24,0,0,0,112,192Zm504-24H552a24,24,0,0,0,0,48h64a24,24,0,0,0,0-48ZM131.08,55.22l-55.42-32a24,24,0,1,0-24,41.56l55.42,32a24,24,0,1,0,24-41.56Zm457.26,264-55.42-32a24,24,0,1,0-24,41.56l55.42,32a24,24,0,0,0,24-41.56Zm-481.26-32-55.42,32a24,24,0,1,0,24,41.56l55.42-32a24,24,0,0,0-24-41.56ZM520.94,100a23.8,23.8,0,0,0,12-3.22l55.42-32a24,24,0,0,0-24-41.56l-55.42,32a24,24,0,0,0,12,44.78Z" class="fa-primary"></path></g></svg>
			<span class="label--not-pressed plyr__tooltip" role="tooltip">Işıkları Kapat</span>
		</button>
	   
	</div>
	
	
	<div class="player-flex">
		<button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
			<svg class="icon--pressed" role="presentation" viewBox="0 0 640 512">
			
			<g class="fa-group"><path  style="opacity:.7" fill="currentColor" d="M393.11 107.22a23.9 23.9 0 0 1 33.12-7.46A185.33 185.33 0 0 1 488.74 346l-38.65-29.9a136.7 136.7 0 0 0-49.57-175.52 24.29 24.29 0 0 1-7.41-33.36zm60.68-46.79a233.7 233.7 0 0 1 73 315l38.52 29.78A282.1 282.1 0 0 0 480.35 20a24.2 24.2 0 1 0-26.56 40.46zM347.07 221.19a40 40 0 0 1 20.75 31.32l42.92 33.18A86.79 86.79 0 0 0 416 256a87.89 87.89 0 0 0-45.78-76.86 24 24 0 1 0-23.16 42.06zM288 190.82V88c0-21.46-26-32-41-17l-49.7 49.69zM32 184v144a24 24 0 0 0 24 24h102.06L247 441c15 15 41 4.47 41-17v-71.4L43.76 163.84C36.86 168.05 32 175.32 32 184z" class="fa-secondary"></path><path fill="currentColor" d="M594.54 508.63L6.18 53.9a16 16 0 0 1-2.81-22.45L23 6.18a16 16 0 0 1 22.47-2.81L633.82 458.1a16 16 0 0 1 2.82 22.45L617 505.82a16 16 0 0 1-22.46 2.81z" class="fa-primary"></path></g>
			
			</svg>
			<svg class="icon--not-pressed" role="presentation" viewBox="0 0 576 512">
			
			<g class="fa-group"><path fill="currentColor" d="M0 328V184a24 24 0 0 1 24-24h102.06l89-88.95c15-15 41-4.49 41 17V424c0 21.44-25.94 32-41 17l-89-88.95H24A24 24 0 0 1 0 328z" class="fa-secondary"></path><path fill="currentColor" d="M338.23 179.13a24 24 0 1 0-23.16 42.06 39.42 39.42 0 0 1 0 69.62 24 24 0 1 0 23.16 42.06 87.43 87.43 0 0 0 0-153.74zM480 256a184.64 184.64 0 0 0-85.77-156.24 23.9 23.9 0 0 0-33.12 7.46 24.29 24.29 0 0 0 7.41 33.36 136.67 136.67 0 0 1 0 230.84 24.28 24.28 0 0 0-7.41 33.36 23.94 23.94 0 0 0 33.12 7.46A184.62 184.62 0 0 0 480 256zM448.35 20a24.2 24.2 0 1 0-26.56 40.46 233.65 233.65 0 0 1 0 391.16A24.2 24.2 0 1 0 448.35 492a282 282 0 0 0 0-472.07z" class="fa-primary"></path></g>
			
			</svg>
			<span class="label--pressed plyr__tooltip" role="tooltip">Sesi Aç</span>
			<span class="label--not-pressed plyr__tooltip" role="tooltip">Sesi Kapat</span>
		</button>
	
		<div class="plyr__volume">
			<input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
		</div>
		
	
	
		<button type="button" class="plyr__control" data-plyr="wide">
		<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrows-alt-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M508.485 247.515l-99.03-99.029c-7.56-7.56-20.485-2.206-20.485 8.485V228H123.03v-71.03c0-10.691-12.926-16.045-20.485-8.485l-99.03 99.029c-4.686 4.686-4.686 12.284 0 16.971l99.03 99.029c7.56 7.56 20.485 2.206 20.485-8.485V284h265.941v71.03c0 10.691 12.926 16.045 20.485 8.485l99.03-99.029c4.686-4.687 4.686-12.285-.001-16.971z" class=""></path></svg>
			<span class="label--not-pressed plyr__tooltip" role="tooltip">Genişlet</span>
		</button>
	
		<button type="button" class="plyr__control" data-plyr="fullscreen">
			<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
			<svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
			<span class="label--pressed plyr__tooltip" role="tooltip">Tam Ekrandan Çık</span>
			<span class="label--not-pressed plyr__tooltip" role="tooltip">Tam Ekran Yap</span>
		</button>
	
	</div>
	</div>
	`,
        settings: ['quality'],
        blankVideo: 'https://cdn.plyr.io/static/blank.mp4',
        seekTime: 5,
        autoplay: true,
        clickToPlay: true,
        disableContextMenu: true,
        displayDuration: false,
        ratio: '16:9',
        quality: {
            default: 720,
            options: [1080, 720, 480, 360, 240]
        },
        fullscreen: {
            enabled: true,
            iosNative: true
        },
        captions: {
            active: true,
            update: true,
            language: 'tr'
        },
        i18n: {
            restart: 'Yeniden Oynat',
            rewind: '{seektime} saniye geri al',
            play: 'Oynat',
            pause: 'Durdur',
            fastForward: '{seektime} saniye ilerlet',
            seek: 'Seek',
            seekLabel: '{currentTime} of {duration}',
            played: 'Durduruldu',
            buffered: 'Buffered',
            currentTime: 'Şuanki süre',
            duration: 'Süre',
            volume: 'Ses',
            mute: 'Sesi Kapat',
            unmute: 'Sesi Aç',
            enterFullscreen: 'Tam Ekran Yap',
            exitFullscreen: 'Tam Ekrandan Çık',
            frameTitle: '{title} Oynatılıyor',
            captions: 'Altyazılar',
            settings: 'Ayarlar',
            menuBack: 'Önceki menüye dön',
            speed: 'Hız',
            normal: 'Normal',
            quality: 'Kalite',
            loop: 'Loop',
            start: 'Başlat',
            end: 'Bitir',
            all: 'Hepsi',
            reset: 'Sıfırla',
            disabled: 'Kapalı',
            enabled: 'Açık',
            debug: true,
            advertisement: 'Sponsor',
            qualityBadge: {
                2160: '4K',
                1440: 'HD',
                1080: 'HD',
                720: 'HD',
                576: 'SD',
                480: 'SD',
            },
        },
    });
	
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}


    canliOynat = function(src, cdn, first) {
        yyn = src;
        if (!first && !$_('[name="ddos"]')) {
            updateSEO();
        }
        let link;
        if (cdn && cdn.length) {
            link = `${fbd}/${src}.m3u8`;
        } else {
			
            if (src.includes('betlivematch-')) {
                link = `${onexd}/${src.replace('betlivematch-', '')}.m3u8`;
            } else {
				link = `${src}`;
            }

        }
     /*else if (src.includes('derbi-')) {
                link = `${derbyd}/${src.replace('derbi-', '')}.m3u8`;
            }*/
        if (Hls.isSupported()) {
            hls.destroy();
            hls = new Hls();
            hls.loadSource(link);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
			/*if( isMobile.any() ) {
				$('.player-attributes').html('<iframe class="live-video-player" src="'+iframe+'" frameborder="0" width="100%" height="170">');
			} else {
				$('.player-attributes').html('<iframe class="live-video-player" src="'+iframe+'" frameborder="0" width="100%" height="424">');
			}*/
			
        } else {
            video.src = link;
            video.play();
        }
        $_('.live-player').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        tvLoader();
        return player.play()
    };
    player.on('ready', () => {
		
        player.currentTime = player.duration;
        player.play();
        $_('.player-attributes').style.setProperty('--color', playerSetting.color);
    });
    player.on('pause', (e) => {
        $_('.live-video-player').removeAttribute('poster');
        $_('.video-loader') ? $_('.video-loader').remove() : null;
        $_('.plyr__poster') ? $_('.plyr__poster').remove() : null;
        let div = document.createElement('DIV');
        div.classList.add('pause-button');
        div.innerHTML = `<svg class="" role="presentation" viewBox="0 0 448 512">
			<g class="fa-group"><path fill="currentColor" d="M424.41 214.66L72.41 6.55C43.81-10.34 0 6.05 0 47.87V464c0 37.5 40.69 60.09 72.41 41.3l352-208c31.4-18.54 31.5-64.14 0-82.64zM321.89 283.5L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.78 27-40.16 48.28-27.54l209.61 123.95a32 32 0 0 1 0 55.09z" class="fa-secondary"></path><path fill="transparent" d="M112.28 104.48l209.61 123.93a32 32 0 0 1 0 55.09L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.76 27-40.14 48.28-27.52z" class="fa-primary"></path></g>
			</svg>`;
        $_('.plyr--video').append(div);
    }
	);
    player.on('playing', () => {
        if ($_('.video-loader')) {
            $_('.video-loader').remove();
        }
		
		if ($_('.reload-source')) {
            $_('.reload-source').remove();
        }
		
        if ($_('.pause-button')) {
            Array.from($$_('.pause-button')).forEach(item => item.remove());
        }
        if ($_('.lastTime')) {
            Array.from($$_('.lastTime')).forEach(item => item.remove());
        }
        $_('.watermark') ? $_('.watermark').classList.add('show') : '';
    });
    player.on('ended', function(e) {
        console.log('Kaynak bitti yenilenecek');
        if ($_('.pause-button')) {
            Array.from($$_('.pause-button')).forEach(item=>item.remove());
        }
        if (!$_('.reload-source')) {
            let kynynl = document.createElement('DIV');
            kynynl.classList.add('reload-source')
            kynynl.classList.add(`device${deviceid}`)
            kynynl.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path></svg><div class="title">İzlemekte olduğunuz yayının kaynağı yenilenmiştir. <span class="reload-cast">Lütfen <strong class="count">10</strong> saniye bekledikten sonra buraya tıklayıp yayını tekrar açın.</span></div>`;
            deviceid == "m" ? document.body.append(kynynl) : $_('.plyr').append(kynynl);
            let geriSayYayin = setInterval(()=>{
                let time = $_('.reload-cast .count').textContent;
                if (time == 1) {
                    $_('.reload-cast').innerHTML = `Lütfen <strong class="open-tv">buraya tıklayıp</strong> yayını tekrar açın.`;
                    return clearInterval(geriSayYayin);
                }
                $_('.reload-cast .count').textContent -= 1;
            }
            , 1000);
        }
    });
   /* player.on('timeupdate', () => {
        if (playerSetting.adsBannerSmall.is_active == '1') {
            let time = player.currentTime.toFixed(0);
			
            if (time > playerSetting.adsOptions.timing && time != 0) {
                let screen = player.fullscreen.active == true ? 'fullscreen' : 'smallscreen';
                let width, height;
                if (screen == 'fullscreen') {
                    width = '728';
                    height = '90';
                } else if (screen == 'smallscreen') {
                    width = '468';
                    height = '60';
                }
                if (!$_('.stream-ads')) {
					
                    let div = document.createElement('a');
                    if (playerSetting.adsBannerSmall.link.length) {
                        div.href = playerSetting.adsBannerSmall.link;
                        div.target = '_blank';
                    }
                    div.classList.add('stream-ads');
                    div.classList.add(screen);
                    div.style.width = width + 'px';
                    div.style.height = height + 'px';
                    div.style.left = `calc(50% - ${width/2}px)`;
                    div.style.display = 'block';
                    $_('.plyr').append(div);

                    setTimeout(() => {
                        if ($_('.stream-ads')) {
                            $_('.stream-ads').remove();
                        }
                    }, playerSetting.adsOptions.duration * 1000);
                    setTimeout(() => {
                        if ($_('.stream-ads')) {
                            $_('.stream-ads').classList.add('ads-close');
                        }
                    }, (playerSetting.adsOptions.duration - 0.5) * 1000);
                }
            }
        }
    });*/
    player.on('enterfullscreen', () => {
        $_('[data-light]').classList.add('displaynone');
        $_('.watermark') ? $_('.watermark').classList.add('fullscreen') : '';
        $_('.custom-ads') ? $_('.custom-ads').classList.add('fullscreen') : '';
        if ($_('.stream-ads')) {
            $_('.stream-ads').className = 'stream-ads fullscreen';
        }
    });
    player.on('exitfullscreen', () => {
        if ($_('.stream-ads')) {
            $_('.stream-ads').className = 'stream-ads smallscreen';
        }
        $_('[data-light]').classList.remove('displaynone');
        $_('.watermark') ? $_('.watermark').classList.remove('fullscreen') : '';
        $_('.custom-ads') ? $_('.custom-ads').classList.remove('fullscreen') : '';
    });
    let sonAn = function() {
        if ($_('.lastTime')) return;
        let div = document.createElement('DIV');
        div.classList.add('lastTime');
        div.innerHTML = `<div class="title">Lütfen bekleyin..</div><div class="loader"><div></div><div></div><div></div></div>`;
        $_('.plyr--video').append(div);
    };
    $_('.live-button').addEventListener('click', function(e) {
        if ($_('.next-match-splash')) {
            $_('.next-match-splash').remove()
        }
        sonAn();
        player.currentTime = player.duration;
    });
    if ($_('.player-grid.single')) {
        $_('video').poster = 'https://www.ahaberci.com/d/news/46480.jpg';
    }
    if ($_('.single-match.active') && $_('[data-d]').dataset.d == "d") {
        let channel = "";
        if ($_('.real-matches .single-match.active[data-livecdn]')) {
            channel = $_('.real-matches .single-match.active[data-livecdn]').dataset.livecdn;
            canliOynat(channel, 'livecdn');
        } else {
            channel = $_('.single-match.active').dataset.stream;
            canliOynat(channel);
        }
        $_('.live-player').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }
    if (($_('.channel-list .active') && !$_('.live-list .single-match.active')) && $_('[data-d]').dataset.d == "d") {
        canliOynat($_('.channel-list .active').dataset.streamx);
        $_('.live-player').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }
    if (window.location.pathname == "/" && $_('[data-d]').dataset.d == "d") {
        let firstMatchPlay = function() {
            player.volume = 0;
            $_('.single-match').classList.add('active');
            let type = $_('.single-match').dataset.stream;
            if (type == undefined) {
                canliOynat($_('.single-match.active').dataset.livecdn, 'livecdn', 'b');
            } else {
                canliOynat($_('.single-match.active').dataset.stream, "", "a");
            }
            return new Promise(function(resolve, reject) {
                resolve(player)
            })
        }
        firstMatchPlay().then((data) => {
            setTimeout(() => {
                data.play();
                $_('.live-player').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                player.volume = $_('.video-skip') && $_('.video-skip') ? 0 : 1;
            }, 1000)
        })
    }
} else {
    canliOynat = function(src, cdn, first) {
        updateSEO();
        $_('.limit-screen').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    };
    var player = {
        play: function() {
            return
        }
    }
}

   if (playerSetting.videoBefore.is_active == '1' && !$_('.video-before')) {
			
            player.volume = 0;
            if (playerSetting.videoBefore.format == "video") {
                let div = document.createElement('DIV');
                div.classList.add('video-before');
                div.innerHTML = `
				<video playsinline="playsinline" autoplay muted id="video-before">
				<source src="/assets/depo/${playerSetting.videoBefore.imageUrl}"></video>
				<div class="video-before-play"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" ><path fill="currentColor" d="M633.82 458.1l-69-53.33C592.42 360.8 608 309.68 608 256c0-95.33-47.73-183.58-127.65-236.03-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 42.78-11.96 83.59-33.22 119.06l-38.12-29.46C503.49 318.68 512 288.06 512 256c0-63.09-32.06-122.09-85.77-156.16-11.19-7.09-26.03-3.8-33.12 7.41-7.09 11.2-3.78 26.03 7.41 33.13C440.27 165.59 464 209.44 464 256c0 21.21-5.03 41.57-14.2 59.88l-39.56-30.58c3.38-9.35 5.76-19.07 5.76-29.3 0-31.88-17.53-61.33-45.77-76.88-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61 11.76 6.46 19.12 18.18 20.4 31.06L288 190.82V88.02c0-21.46-25.96-31.98-40.97-16.97l-49.71 49.7L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM32 184v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V352.6L43.76 163.84C36.86 168.05 32 175.32 32 184z" class=""></path></svg></div>
				<div class="video-skip" data-type="video" data-time="${playerSetting.skipTime}"><span>${playerSetting.skipTime} saniye kaldı..</span></div>`
                $_('.live-player').prepend(div);
                if ($_('.video-skip[data-type="video"]')) {
                    let a = JSON.parse($_('[data-player]').dataset.player);
                    $_('.video-before-play').addEventListener('click', function(e) {
                        this.remove();
                        $_('#video-before').volume = 1;
                        $_('#video-before').muted = false;
                        $_('#video-before').play();
                    })
                    $_('.video-before video').addEventListener('playing', function(e) {
                        if ($_('.video-skip').dataset.time < 0) {
                            $_('.status-bar') ? $_('.status-bar').remove() : '';
                            return $_('.video-before').remove(),
                            player.volume = oldVolume;
                        }
                        let t, s = setInterval(()=>{
                            $_('.video-before video') ? (a.skipTime--,
                            (t = a.skipTime),
                            ($_('.video-skip[data-type="video"]').dataset.time = t),
                            ($_('.video-skip[data-type="video"] span').textContent = `${a.skipTime} saniye kaldı..`),
                            0 == t && (($_('.video-skip[data-type="video"] span').textContent = 'Reklamı Geç..'),
                            $_('.video-skip[data-type="video"]').classList.add('done'),
                            clearInterval(s))) : clearInterval(s);
                        }
                        , 1e3);
                    });
					
					
					$_('.video-before video').addEventListener('ended', function(e) {
							$('.status-bar') ? $('.status-bar').remove() : '';
							return $_('.video-before').remove(), 
							player.volume = oldVolume;
					});
					
					
			
			
                }
            }
            if (playerSetting.videoBefore.format == "image") {
                let div = document.createElement('DIV');
                div.classList.add('video-before');
                div.innerHTML = `<a href="${playerSetting.videoBefore.link}" target="_blank"><img src="/assets/depo/${playerSetting.videoBefore.imageUrl}" alt="Video Önü Reklam" loading="lazy"></a><div class="video-skip done" data-type="image" data-time="10"><span>Reklamı Geç..</span></div>`
                $_('.live-player').prepend(div);
            }
        }
		
window.addEventListener('popstate', function(event) {
    let link = document.location.pathname;
    let streamElement = $_(`.live-list a[href="${link}"]`);
    if (streamElement) {
        $_('.single-match.active').classList.remove('active');
        streamElement.classList.add('active');
        return canliOynat(streamElement.dataset.stream);
    }
})
window.addEventListener('click', function(e) {
	if (e.target.closest('.reload-source .open-tv')) {
        return canliOynat(yyn);
    }
    if (e.target.closest('.single-channel-play')) {
        $_('.single-channel-play').remove();
        return canliOynat($_('[data-singlechannel]').dataset.singlechannel);
    }
    if (e.target.closest('.pause-button')) {
        return canliOynat(yyn);
    }
    if (e.target.closest('.channel-list [data-stream]')) {
        e.preventDefault();
        let data = e.target.closest('.channel-list [data-stream]');
    }
    if (e.target.closest('a.single-match.active')) {
        e.preventDefault();
        let stream = e.target.closest('a.single-match.active').dataset.stream;
        canliOynat(stream);
        return player.play()
    }
    if (e.target.closest('[data-tabbed="next"] .single-match')) {
        e.preventDefault();
        return
    }
    if (e.target.closest('[data-livecdn]')) {
        let id = e.target.closest('[data-livecdn]').dataset.livecdn;
        if ($$_('[data-stream].active,[data-livecdn].active')) {
            Array.from($$_('[data-stream].active,[data-livecdn].active')).forEach(item => item.classList.remove('active'));
        }
        e.target.closest('[data-livecdn]').classList.add('active');
        canliOynat(id, 'livecdn');
        return player.play();
    }
    if (e.target.closest('.live-list [data-stream]')) {
        e.preventDefault();
        let data = e.target.closest('.live-list [data-stream]');
    }
    if (e.target.closest('.single-channel[data-stream]')) {
        e.preventDefault();
        el = e.target.closest('.single-channel[data-stream]');
        $_('.single-channel.active') ? Array.from($$_('.single-channel.active')).forEach(item => item.classList.remove('active')) : '';
        el.classList.add('active');
        $_('.live-list .list-area .active') ? Array.from($$_('.live-list .list-area .active')).forEach(item => item.classList.remove('active')) : "";
        return canliOynat(el.dataset.streamx);
    }
     if (e.target.closest('[data-stream]')) {
        oddsYerlestir(e.target.closest('[data-stream]'));
        if ($_('.video-before') && $_('.video-skip[data-time]') && $_('.video-skip[data-time]').dataset.time == 0)
            $_('.video-before').remove();
        if ($_('.video-before') && $_('.video-skip[data-time]') && $_('.video-skip[data-time]').dataset.time != 0)
            return statusBar({
                status: false,
                title: 'Reklam',
                text: 'Lütfen reklamın bitmesini bekleyin.'
            });
        if ($$_('[data-stream].active,[data-livecdn].active')) {
            Array.from($$_('[data-stream].active,[data-livecdn].active')).forEach(item=>item.classList.remove('active'));
        }
        let streamID = e.target.closest('[data-stream]').dataset.stream;
        Array.from($$_(`[data-stream="${streamID}"]`)).forEach(item=>item.classList.add('active'));
        if (e.target.closest('[data-tabbed="live"]') && $_(`[data-tabbed="live"] a[data-stream="${streamID}"]`)) {
            return $_(`[data-tabbed="live"] a[data-stream="${streamID}"]`).click();
        }
        if (e.target.closest('[data-tabbed="next"]') && $_(`[data-tabbed="next"] a[data-stream="${streamID}"]`)) {
            return $_(`[data-tabbed="next"] a[data-stream="${streamID}"]`).click();
        }
        canliOynat(e.target.closest('[data-stream]'), streamID);

     
        return
    }
	if (e.target.closest('.video-skip.done')) {
        $('.status-bar') ? $('.status-bar').remove() : '';
        return $_('.video-before').remove(), player.volume = oldVolume;
    }
    if (e.target.closest('[data-light]')) {
        let value = e.target.closest('[data-light]').dataset.light;
        if (value == 'on') {
            $_('[data-light] span').textContent = 'Işıkları Aç';
            $_('[data-light]').dataset.light = 'off';
            $_('#light-icon').innerHTML = `<g class="fa-group"><path fill="currentColor" d="M163.75 94.79C192.16 39.71 249 .2 319.45 0a175.9 175.9 0 0 1 133 291.78c-3.86 4.41-8.24 9.94-12.79 16.25l-197-152.29A80.16 80.16 0 0 1 320 96a16 16 0 1 0 0-32 112.16 112.16 0 0 0-104.22 71zm0 161.77a176 176 0 0 0 23.83 35.22c16.52 18.85 42.36 58.23 52.21 91.45 0 .26.07.52.11.78h88.74zM240 416v38.35a32 32 0 0 0 5.41 17.65l17.09 25.69A32 32 0 0 0 289.14 512h61.71a32 32 0 0 0 26.64-14.28L394.58 472a32 32 0 0 0 5.36-17.69V439.1L370 416z" class="fa-secondary"></path><path fill="currentColor" d="M3.37 31.45L23 6.18a16 16 0 0 1 22.47-2.81L633.82 458.1a16 16 0 0 1 2.82 22.45L617 505.82a16 16 0 0 1-22.46 2.81L6.18 53.9a16 16 0 0 1-2.81-22.45z" class="fa-primary"></path></g>`;
        } else {
            $_('[data-light] span').textContent = 'Işıkları Kapat';
            $_('[data-light]').dataset.light = 'on';
            $_('#light-icon').innerHTML = `<g class="fa-group"><path fill="currentColor" d="M319.45,0C217.44.31,144,83,144,176a175,175,0,0,0,43.56,115.78c16.52,18.85,42.36,58.22,52.21,91.44,0,.28.07.53.11.78H400.12c0-.25.07-.5.11-.78,9.85-33.22,35.69-72.59,52.21-91.44A175,175,0,0,0,496,176C496,78.63,416.91-.31,319.45,0ZM320,96a80.09,80.09,0,0,0-80,80,16,16,0,0,1-32,0A112.12,112.12,0,0,1,320,64a16,16,0,0,1,0,32Z" class="fa-secondary"></path><path fill="currentColor" d="M240.06,454.34A32,32,0,0,0,245.42,472l17.1,25.69c5.23,7.91,17.17,14.28,26.64,14.28h61.7c9.47,0,21.41-6.37,26.64-14.28L394.59,472A37.47,37.47,0,0,0,400,454.34L400,416H240ZM112,192a24,24,0,0,0-24-24H24a24,24,0,0,0,0,48H88A24,24,0,0,0,112,192Zm504-24H552a24,24,0,0,0,0,48h64a24,24,0,0,0,0-48ZM131.08,55.22l-55.42-32a24,24,0,1,0-24,41.56l55.42,32a24,24,0,1,0,24-41.56Zm457.26,264-55.42-32a24,24,0,1,0-24,41.56l55.42,32a24,24,0,0,0,24-41.56Zm-481.26-32-55.42,32a24,24,0,1,0,24,41.56l55.42-32a24,24,0,0,0-24-41.56ZM520.94,100a23.8,23.8,0,0,0,12-3.22l55.42-32a24,24,0,0,0-24-41.56l-55.42,32a24,24,0,0,0,12,44.78Z" class="fa-primary"></path></g>`;
        }
        return lightToggle();
    }
});