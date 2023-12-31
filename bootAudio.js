const { contextBridge, ipcRenderer } = require('electron')

const audio = require('./play/audioApi')
contextBridge.exposeInMainWorld('audioApi', {
    setTrackName: (track) => audio.setTrackName(track),
    playAudio: () => audio.playAudio(),
    stopAudio: () => audio.stopAudio()
})

contextBridge.exposeInMainWorld('electronAPI', {
    setTrackName: (c, track) => ipcRenderer.on('setTrackName', c, track),
    playAudio: (c) => ipcRenderer.on('playAudio', c),
    stopAudio: (c) => ipcRenderer.on('stopAudio', c)
})