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

    addKeyPress(playAudioKey, function () {
        window.electronAPI.playAudio()
    })

    addKeyPress(stopAudioKey, function () {
        window.electronAPI.stopAudio()
    })
}

function transmit(songId) {
    window.midiApi.sendSongById(projectSlug, songId)
    html('song-info', window.songsApi.getSongInfo(projectSlug, songId))
}

function nextSong() {
    if (currentSong > 0) {
        el('song-' + currentSong).classList.remove('current-song')
    } else {
        html('next-song', "Enter: Next song | Backspace: Previous song | Space: Extra song | Escape: Exit")
    }

    currentSong++

    if (currentSong <= numberOfSongs) {
        el('song-' + currentSong).click()
        el('song-' + currentSong).classList.add('current-song')
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
    modalOpen = true
}

function hideExtraSongModal() {
    el('modal-background').classList.add('modal-hidden')
    modalOpen = false
}