const {findBySlug} = require("../utilities");
const {getProjects, saveProjects} = require("../projects/projectsApi");
const {getSongsConcat} = require("../songs/songsApi");

let sets = []
let lastProjectSlug
let projects

const getSetlists = (projectSlug) => {
    if (sets.length == 0 || projectSlug !== lastProjectSlug) {
        try {
            projects = getProjects()
            project = findBySlug(projects, projectSlug)
            sets = project['sets'] ?? []

            lastProjectSlug = projectSlug
        } catch (e) {
        }
    }

    return sets
}

const saveSetlists = (projectSlug, setlists) => {
    let projects = getProjects()
    let project = findBySlug(projects, projectSlug)
    project.sets = setlists
    saveProjects(projects)
}

const getSet = (projectSlug, setSlug) => {
    let sets = getSetlists(projectSlug)
    let set = findBySlug(sets, setSlug)

    if (!set['songs'] ?? null) {
        set.songs = []
    } else {
        let songs = getSongsConcat(projectSlug)
        let songIds = set.songs
        let setSongs = []
        songIds.forEach((songId) => {
            setSongs.push(
                findBySlug(songs, songId, 'songId')
            )
        })
        set.songs = setSongs
    }

    return set
}

const saveSet = (projectSlug, setSlug, songs) => {
    let sets = getSetlists()
    let set = findBySlug(sets, setSlug)
    set.songs = songs

    saveProjects(projects)
}

module.exports = {
    getSet,
    saveSet,
    getSetlists,
    saveSetlists,
}