window.electronAPI.setTrackName((event, track) => {
    window.audioApi.setTrackName(track)
})

window.electronAPI.playAudio(() => {
    window.audioApi.playAudio()
    html('status', 'PLAYING')
})

window.electronAPI.stopAudio(() => {
    window.audioApi.stopAudio()
    html('status', 'PAUSED')
})