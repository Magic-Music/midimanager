const { contextBridge, ipcRenderer } = require('electron')

const deviceApi = require('./devices/devicesApi')
contextBridge.exposeInMainWorld('devicesApi', {
    getBanks: (deviceSlug) => deviceApi.getBanks(deviceSlug),
    saveBanks: (deviceSlug, banks) => deviceApi.saveBanks(deviceSlug, banks),
    getDevices: () => deviceApi.getDevices(),
    saveDevices: (devices) => deviceApi.saveDevices(devices),
    getBankSlugs: (deviceSlug) => deviceApi.getBankSlugs(deviceSlug),
    getBankBySlug: (deviceSlug, bankSlug) => deviceApi.getBankBySlug(deviceSlug, bankSlug),
    getDeviceBySlug: (deviceSlug) => deviceApi.getDeviceBySlug(deviceSlug),
    getBankDataBySlug: (deviceSlug, bankSlug) => deviceApi.getBankDataBySlug(deviceSlug, bankSlug),
    getDeviceSlugList: () => deviceApi.getDeviceSlugList(),
    getDeviceNameBySlug: (deviceSlug) => deviceApi.getDeviceNameBySlug(deviceSlug)
})

const projectApi = require('./projects/projectsApi')
contextBridge.exposeInMainWorld('projectsApi', {
    selectPort: (projectSlug, port) => projectApi.selectPort(projectSlug, port),
    getProjects: () => projectApi.getProjects(),
    saveProjects: (projects) => projectApi.saveProjects(projects),
    getNextSongId: (projectSlug) => projectApi.getNextSongId(projectSlug),
    getProjectName: (projectSlug) => projectApi.getProjectName(projectSlug),
    getCurrentPort: (projectSlug) => projectApi.getCurrentPort(projectSlug),
    getConnections: (projectSlug) => projectApi.getConnections(projectSlug),
    saveConnections: (projectSlug, devices) => projectApi.saveConnections(projectSlug, devices),
    getDeviceChannels: (projectSlug) => projectApi.getDeviceChannels(projectSlug),
    getUsedDeviceList: (projectSlug) => projectApi.getUsedDeviceList(projectSlug),
    toggleMidiThru: (projectSlug) => projectApi.toggleMidiThru(projectSlug),
    getMidiThruStatus: (projectSlug) => projectApi.getMidiThruStatus(projectSlug)
})

const songApi = require('./songs/songsApi')
contextBridge.exposeInMainWorld('songsApi', {
    getSong: (projectSlug, songId) => songApi.getSong(projectSlug, songId),
    getSongs: (projectSlug) => songApi.getSongs(projectSlug),
    saveSongs: (projectSlug, songs) => songApi.saveSongs(projectSlug, songs),
    getSongInfo: (projectSlug, songs) => songApi.getSongInfo(projectSlug, songs),
    getPrograms: (projectSlug, songId) => songApi.getPrograms(projectSlug, songId),
    savePrograms: (projectSlug, songId, programs) => songApi.savePrograms(projectSlug, songId, programs),
    getSongsConcat: (projectSlug) => songApi.getSongsConcat(projectSlug),
    getSongTitleAndArtist: (projectSlug, songId) => songApi.getSongTitleAndArtist(projectSlug, songId)
})

const setApi = require('./sets/setsApi')
contextBridge.exposeInMainWorld('setsApi', {
    getSet: (projectSlug, setSlug) => setApi.getSet(projectSlug, setSlug),
    saveSet: (projectSlug, setSlug, songs) => setApi.saveSet(projectSlug, setSlug, songs),
    getSetlists: (projectSlug) => setApi.getSetlists(projectSlug),
    saveSetlists: (projectSlug, setlists) => setApi.saveSetlists(projectSlug, setlists),
})

const midi = require('./midi/midiApi')
contextBridge.exposeInMainWorld('midiApi', {
    getPorts: () => midi.getPorts(),
    resetMidi: () => midi.resetMidi(),
    sendSongById: (projectSlug, programData) => midi.sendSongById(projectSlug, programData),
    sendSongToMidi: (projectSlug, programData) => midi.sendSongToMidi(projectSlug, programData),
    connectMidiThru: (projectSlug) => midi.connectMidiThru(projectSlug),
    disconnectMidiThru: () => midi.disconnectMidiThru()
})

contextBridge.exposeInMainWorld('electronAPI', {
    setTrackName: (track) => ipcRenderer.send('setTrackName', track),
    playAudio: () => ipcRenderer.send('playAudio'),
    stopAudio: () => ipcRenderer.send('stopAudio'),
})