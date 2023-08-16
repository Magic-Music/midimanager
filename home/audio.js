window.electronAPI.playAudio(() => {
    window.audioApi.playAudio()
    html('status', 'PLAYING')
})

window.electronAPI.stopAudio(() => {
    window.audioApi.stopAudio()
    html('status', 'PAUSED')
})