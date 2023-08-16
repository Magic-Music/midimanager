const { contextBridge, ipcRenderer } = require('electron')

const audio = require('./play/audioApi')
contextBridge.exposeInMainWorld('audioApi', {
    playAudio: () => audio.playAudio(),
    stopAudio: () => audio.stopAudio()
})

contextBridge.exposeInMainWorld('electronAPI', {
    playAudio: (c) => ipcRenderer.on('playAudio', c),
    stopAudio: (c) => ipcRenderer.on('stopAudio', c)
})