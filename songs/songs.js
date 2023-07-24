let devices
let songs
let songsTable

const projectSlug = getQueryParam('project')

window.onload = showSongs();

addOnClick('add-song', function() {addSong()})
addOnClick('save-songs', function() {saveSongs()})
addOnClick('back', function() {window.location = "projects/projects.html"})
addOnClick('home', function() {window.location = "home/home.html"})
addOnClick('info-cancel', function() {modalClose()})
addOnClick('info-ok', function() {modalSave()})

function showSongs()
{
    setHeader(window.projectsApi.getProjectName(projectSlug))
    songs = window.songsApi.getSongs(projectSlug)

    songsTable = new Tabulator('#songs-table', {
        placeholder: "No songs defined",
        data: songs,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Song title",
                field: "title",
                editor: 'input',
                editorParams: {selectContents: true},
                cellEdited: function (cell) {saveSongs()}
            },
            {
                title: "Artist",
                field: "artist",
                editor: 'input',
                editorParams: {selectContents: true},
                cellEdited: function (cell) {saveSongs()}
            },
            {
                title: "Info",
                field: "info",
                formatter: function(cell) {return infoIcon(cell.getData().info ?? null)},
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editInfo(cell)}
            },
            {
                title: "Patches",
                formatter: function(cell) {return midiIcon(cell.getData().programs ?? null)},
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editPrograms(cell)}
            },
            {
                title: "Play",
                formatter: playIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {playSong(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteSong(cell)}
            }
        ],
    })
}

function addSong() {
    songsTable.addRow({songId: 0, title: "-", artist: "-"})    
}

function editSong() {
    saveSongs()
}

function editInfo(cell) {
    editCell = cell
    setValue('info', cell.getValue() ?? '')
    el('modal-background').classList.remove('modal-hidden')
}

function modalClose() {
    el('modal-background').classList.add('modal-hidden')
}

function modalSave() {
    editCell.setValue(getValue('info'))
    modalClose()
    saveSongs()
}

function editPrograms(cell) {
    redirect("songs/programs.html", {project:projectSlug, song:cell.getRow().getData().songId})
}

function playSong(cell) {
    let songId = cell.getData().songId
    let programs = window.songsApi.getPrograms(projectSlug, songId)
    window.midiApi.sendSongToMidi(projectSlug, programs)
}

function deleteSong(cell) {
    cell.getRow().delete()
    saveSongs()
}

function saveSongs() {
    let songData = []

    songsTable.getRows().forEach((songRow) => {
        song = songRow.getData()
        if(song.title !== '-' && song.artist !== '-') {
            if (song.songId == 0) {
                song.songId = window.projectsApi.getNextSongId(projectSlug)
                songRow.songId = song.songId
            }
            songData.push({
                songId:song.songId,
                title: song.title,
                artist: song.artist,
                info: song.info,
                programs: song.programs
            })
        }
    })

    window.songsApi.saveSongs(projectSlug, songData)

    invisibleButton('save-songs')
}
