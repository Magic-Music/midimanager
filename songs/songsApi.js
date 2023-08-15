const {findBySlug} = require("../utilities");
const {getProjects, saveProjects} = require("../projects/projectsApi");
const {getDeviceNameBySlug, getBankBySlug} = require("../devices/devicesApi");
const {ipcRenderer} = require("electron");

let songs = []
let lastProjectSlug
let projects

const getSongs = (projectSlug) => {
    if (songs.length == 0 || projectSlug !== lastProjectSlug) {
        try {
            projects = getProjects()
            project = findBySlug(projects, projectSlug)
            songs = project['songs'] ?? []

            lastProjectSlug = projectSlug
        } catch (e) {
        }
    }
    return songs
}

const saveSongs = (projectSlug, songs) => {
    let projects = getProjects()
    let project = findBySlug(projects, projectSlug)
    project.songs = songs
    saveProjects(projects)
}

const getSong = (projectSlug, songId) => {
    let songs = getSongs(projectSlug)

    return findBySlug(songs, songId, 'songId')
}

const getPrograms = (projectSlug, songId) => {
    let songData = getSong(projectSlug, songId)
    let programs = songData['programs'] ?? []

    programData = []
    programs.forEach((program) => {
        let deviceSlug = program.device
        let bankSlug = program.bank
        programData.push({
            device: getDeviceNameBySlug(deviceSlug),
            deviceSlug: deviceSlug,
            bank: getBankBySlug(deviceSlug, bankSlug) ?? '-',
            bankSlug: bankSlug,
            program: program.program
        })
    })

    return programData
}

const getSongTitleAndArtist = (projectSlug, songId) => {
    let songData = getSong(projectSlug, songId)

    return songData.title + " - " + songData.artist
}

const getSongsConcat = (projectSlug) => {
    let songs = getSongs(projectSlug)

    songData = []
    songs.forEach((song) => {
        songData.push({
            song: song.title + " - " + song.artist,
            songId: song.songId
        })
    })

    return songData
}

const savePrograms = (projectSlug, songId, programs) => {
    let song = getSong(projectSlug, songId)
    song.programs = programs

    saveProjects(projects)
}

const getSongInfo = (projectSlug, songId) => {
    let title = getSongTitleAndArtist(projectSlug, songId) + "<br><br>"
    let songInfo = (getSong(projectSlug, songId).info ?? '').replace(/\n/g, "<br>")
    return title + songInfo
}

module.exports = {
    getSong,
    getSongs,
    saveSongs,
    getSongInfo,
    getPrograms,
    savePrograms,
    getSongsConcat,
    getSongTitleAndArtist
}