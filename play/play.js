let projectSlug
let currentSong = 0
let numberOfSongs = 0
let songIds = []
let allSongs

window.onload = showSet();

function showSet() {
    projectSlug = getQueryParam('project')
    const setSlug = getQueryParam('set')
    const set = window.setsApi.getSet(projectSlug, setSlug)
    songs = window.songsApi.getSongs(projectSlug)

    addOnClick('extra-song', function() {showExtraSongModal()})
    addKeyPress(106, function() {showExtraSongModal()})
    addOnClick('close', function() {hideExtraSongModal()})
    addKeyPress(111, function() {hideExtraSongModal()})

    addOnClick('back', function() {goBack()})
    addOnClick('end-set', function() {goBack()})
    addKeyPress(8, function() {goBack()})

    addOnClick('next-song', function() {nextSong()})
    addKeyPress(13, function() {nextSong()})
    addKeyPress(32, function() {nextSong()})

    html('set-name', set.name)

    set.songs.forEach((song) => {
        numberOfSongs++
        append(
            'setlist',
            "<div id='song-" + numberOfSongs + "' class='setlist-item' onclick='transmit(\"" +
            song.songId + "\")'>" + song.song + "</div>"
        )
    })

    allSongsTable = new Tabulator('#all-songs-table', {
        placeholder: "No songs defined",
        data: songs,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Song title",
                field: "title",
            },
            {
                title: "Artist",
                field: "artist",
            }
        ],
    })

    allSongsTable.on('rowClick', function(e, row) {
        window.midiApi.sendSongById(projectSlug, row.getData().songId)
    })

    connectMidiThru()
}

function transmit(songId) {
    window.midiApi.sendSongById(projectSlug, songId)
    html('song-info', window.songsApi.getSongInfo(projectSlug, songId))
}

function nextSong() {
    if (currentSong > 0) {
        el('song-' + currentSong).classList.remove('current-song')
    } else {
        html('next-song', "NEXT SONG")
    }

    currentSong++

    if (currentSong <= numberOfSongs) {
        el('song-' + currentSong).click()
        el('song-' + currentSong).classList.add('current-song')
    }

    if (currentSong == numberOfSongs) {
        endSet()
    }

    if (currentSong > numberOfSongs) {
        goBack()
    }
}

function endSet() {
    el('next-song').classList.add('button-hidden')
    el('end-set').classList.remove('button-hidden')
}

function goBack() {
    redirect("play/set.html",{project:projectSlug})
}

function showExtraSongModal()
{
    el('modal-background').classList.remove('modal-hidden')
}

function hideExtraSongModal()
{
    el('modal-background').classList.add('modal-hidden')
}