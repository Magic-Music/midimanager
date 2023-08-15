const {Howl, Howler} = require('howler');
const fs = require('fs')
const audioPath = './audio'

let howlAudio
let audioFiles
let trackNumber = 0;
let playing = false

const getAudioFiles = () => {
    return fs.readdirSync(audioPath).filter((filename) => {
        return filename !== '.gitignore'
    })
}

const playAudio = () => {
    if (!playing) {
        audioFiles = shuffleTracks(getAudioFiles())
        playing = true
        playNextTrack()
    } else {
        howlAudio.fade(0, 1, 2000)
        howlAudio.play()
    }
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
    howlAudio.fade(1, 0, 3000)

    howlAudio.once('fade', () => {
        setTimeout(() => {
            howlAudio.pause()
        }, 2000)
    })
}

const shuffleTracks = (files) => {
    for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]]
    }

    for (let i = 0; i < files.length; i++) {
        files[i] = 'audio/' + files[i]
    }

    return files
}

module.exports = {
    playAudio,
    stopAudio,
    getAudioFiles,
}