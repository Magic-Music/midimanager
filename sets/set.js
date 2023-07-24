let songsTable
let setSongsTable

const projectSlug = getQueryParam('project')
const setSlug = getQueryParam('set')

const songs = window.songsApi.getSongsConcat(projectSlug)
let set = window.setsApi.getSet(projectSlug, setSlug)
let setSongs = set.songs
let setName = set.name
console.log("SONGS",setSongs);

window.onload = showSetSongs();

addOnClick('return-to-sets', function() {redirect("sets/setlists.html", {project:projectSlug})})
addOnClick('home', function() {window.location="home/home.html"})

function showSetSongs()
{
    setHeader(setName)

    songsTable = new Tabulator('#songs-table', {
        placeholder: "No songs defined",
        data: songs,
        layout: "fitColumns",
        columns: [
            {
                title: "Song",
                field: "song"
            },
            {
                formatter: songIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {addSong(cell)}
            }
        ],
    })

    setTable = new Tabulator('#set-table', {
        placeholder: "No set songs defined",
        data: setSongs,
        layout: "fitColumns",
        movableRows: true,
        
        columns: [
            {
                rowHandle: true,
                formatter: "handle",
                headerSort: false,
                width: 70
            },
            {
                title: "Song",
                field: "song",
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteSetSong(cell)}
            }
        ],
    })

    setTable.on("cellDblTap", function (e, cell) {
        addSong(cell)
    })

    setTable.on("rowMoved", function() {
        saveSetSongs()
    })

    setTable.on("movableRowsReceivingStop", function() {
        saveSetSongs()
    })
}

function addSong(cell) {
    setTable.addRow(cell.getData())
    saveSetSongs()
}

function deleteSetSong(cell) {
    cell.getRow().delete()
    let data = setTable.getData()
    setTable.replaceData(data)

    saveSetSongs()
}

function saveSetSongs() {
    let songIds = setTable.getData().map(song => song.songId);
    window.setsApi.saveSet(projectSlug, setSlug, songIds)
}

