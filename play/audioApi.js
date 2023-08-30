const {Howl, Howler} = require('howler');
const fs = require('fs')
const jukeboxPath = './jukebox'
const backingPath = './backing'

let howlAudio
let audioFiles
let trackNumber = 0;
let playInitiated = false
let playing = false;
let fading = false;
let backingTrack = false;

const getAudioFiles = () => {
    return fs.readdirSync(jukeboxPath).filter((filename) => {
        return filename !== '.gitignore'
    })
}

const setTrackName = (track) => {
    backingTrack = track
}

const playAudio = () => {
    if (backingTrack) {
        playTrack()
    } else {
        playJukebox()
    }
}

const playJukebox = () => {
    if (!playInitiated) {
        playInitiated = true
        playing = true
        audioFiles = shuffleTracks(getAudioFiles())
        playNextTrack()
    } else {
        if (!playing && !fading) {
            fading = true
            playing = true
            howlAudio.fade(0, 1, 2000)
            howlAudio.play()
            howlAudio.once('fade', () => {
                fading = false;
            })
        }
    }
}

const playTrack = () => {
    if (playInitiated && playing) {
        howlAudio.unload()
    }
    playing = true
    playInitiated = false

    howlAudio = new Howl({
        src: backingPath + '/' + backingTrack + '.mp3',
        html5: true
    })

    howlAudio.on('end', () => {
        howlAudio.unload()
        playing = false
    })

    howlAudio.play()
}

const playNextTrack = () => {
    howlAudio = new Howl({
        src: audioFiles[trackNumber],
        html5: true
    })

    howlAudio.on('end', () => {
        trackNumber++
        if(trackNumber >= audioFiles.length) {
            trackNumber = 0
        }

        howlAudio.unload()
        playNextTrack()
    })

    howlAudio.play()
}

const stopAudio = () => {
    if (!playing || fading) {
        return
    }

    if (playing && !playInitiated) {
        howlAudio.unload()
        playing = false
        return
    }

    fading = true;
    howlAudio.fade(1, 0, 3000)
    howlAudio.once('fade', () => {
        setTimeout(() => {
            fading = false;
            playing = false;
            howlAudio.pause()
        }, 300)
    })
}

const shuffleTracks = (files) => {
    for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]]
    }

    for (let i = 0; i < files.length; i++) {
        files[i] = jukeboxPath + '/' + files[i]
    }

    return files
}

module.exports = {
    playAudio,
    stopAudio,
    setTrackName,
    getAudioFiles,
}