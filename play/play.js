let projectSlug
let currentSong = 0
let numberOfSongs = 0
let modalOpen = false

window.onload = showSet();

function showSet() {
    projectSlug = getQueryParam('project')
    const setSlug = getQueryParam('set')
    const set = window.setsApi.getSet(projectSlug, setSlug)
    songs = window.songsApi.getSongs(projectSlug)
    html('set-name', set.name)

    addListeners()

    set.songs.forEach((song) => {
        if (song.songId == 0) {
            append('setlist', '<div style="height:40px">')
        } else {
            numberOfSongs++
            append(
                'setlist',
                "<div id='song-" + numberOfSongs + "' class='setlist-item' onclick='transmit(\"" +
                song.songId + "\")'>" + song.song + "</div>"
            )
        }
    })

    allSongsTable = new Tabulator('#all-songs-table', {
        placeholder: "No songs defined",
        data: songs,
        layout: "fitColumns",
        columns: [
            {
                title: "Song title",
                field: "title",
                headerFilter: "input"
            },
            {
                title: "Artist",
                field: "artist",
                headerFilter: "input"
            }
        ],
    })

    allSongsTable.on('rowClick', function (e, row) {
        window.midiApi.sendSongById(projectSlug, row.getData().songId)
    })

    connectMidiThru()
}

function addListeners() {
    addKeyPress(openExtraSongModalKey, function () {
        showExtraSongModal()
    })

    addKeyPress(goBackKey, function () {
        goBackKeyPressed()
    })

    addKeyPress(nextSongKey, function () {
        nextSong()
    })

    addKeyPress(previousSongKey, function () {
        previousSong()
    })

    addKeyPress(resetMidiKey, function () {
        resetMidi()
    })

    setPlayControls();
}

function transmit(songId) {
    window.midiApi.sendSongById(projectSlug, songId)
    html('song-info', window.songsApi.getSongInfo(projectSlug, songId))
    setCurrentTrack(window.songsApi.getSongTitleAndArtist(projectSlug, songId))
}

function nextSong() {
    if (currentSong > 0) {
        el('song-' + currentSong).classList.remove('current-song')
    } else {
        html('next-song', "Enter: Next song | Backspace: Previous song | #: Extra song | Z: Reset Midi | Esc: Exit")
    }

    currentSong++

    if (currentSong <= numberOfSongs) {
        el('song-' + currentSong).click()
        el('song-' + currentSong).classList.add('current-song')
        scrollTo('song-' + currentSong)
    }

    if (currentSong > numberOfSongs) {
        endSet()
    }
}

function previousSong() {
    if (currentSong > 1) {
        el('song-' + currentSong).classList.remove('current-song')
        currentSong--
        el('song-' + currentSong).click()
        el('song-' + currentSong).classList.add('current-song')
        scrollTo('song-' + currentSong)
    }
}

function goBackKeyPressed() {
    if (modalOpen) {
        hideExtraSongModal()
    } else {
        goBack()
    }
}

function endSet() {
    el('next-song').classList.add('button-hidden')
    el('end-set').classList.remove('button-hidden')
    html('song-info', 'END OF SET!')
}

function goBack() {
    redirect("play/set.html", {project: projectSlug})
}

function showExtraSongModal() {
    el('modal-background').classList.remove('modal-hidden')
    setTimeout(function() {
        allSongsTable.setHeaderFilterFocus('title')
    }, 100)
    modalOpen = true
}

function hideExtraSongModal() {
    el('modal-background').classList.add('modal-hidden')
    modalOpen = false
}