let keyPresses = {}
let keyReleases = {}
let audioUnlocked = false

const keycodes = getKeycodes()

const goBackKey             = keycodes.ESCAPE
const openExtraSongModalKey = keycodes.HASH
const nextSongKey           = keycodes.RETURN
const previousSongKey       = keycodes.BACK_SPACE
const numbersOneKey         = keycodes.NUM1
const playAudioKey          = keycodes.P
const stopAudioKey          = keycodes.O
const unlockAudioKey        = keycodes.SPACE

String.prototype.slugify = function (separator = "-") {
    return this
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, separator);
};

function connectMidiThru() {
    window.midiApi.connectMidiThru(getQueryParam('project'))
}

function el(id) {
    return document.getElementById(id)
}

function html(id, html) {
    document.getElementById(id).innerHTML = html
}

function append(id, html) {
    document.getElementById(id).innerHTML += html
}

function setValue(id, value) {
    el(id).value = value
}

function getValue(id)
{
    return el(id).value
}

function addOnClick(id, fn) {
    el(id).addEventListener("click", fn)
}

function addKeyPress(keyCode, fn) {
    if (Object.keys(keyPresses).length === 0) {
        document.body.addEventListener('keydown', keyPressed)
    }

    keyPresses[keyCode] = fn
}

function keyPressed(event) {
    if ((keyPresses[event.keyCode] ?? null) && !event.repeat) {
        keyPresses[event.keyCode]()
    }
}

function addKeyRelease(keyCode, fn) {
    if (Object.keys(keyReleases).length === 0) {
        document.body.addEventListener('keyup', keyReleased)
    }

    keyReleases[keyCode] = fn
}

function keyReleased(event) {
    if ((keyReleases[event.keyCode] ?? null) && !event.repeat) {
        keyReleases[event.keyCode]()
    }
}

function setPlayControls() {
    addKeyPress(playAudioKey, function () {
        if (audioUnlocked) {
            window.electronAPI.playAudio()
        }
    })

    addKeyPress(stopAudioKey, function () {
        if (audioUnlocked) {
            window.electronAPI.stopAudio()
        }
    })

    addKeyPress(unlockAudioKey, function () {
        audioUnlocked = true
    })

    addKeyRelease(unlockAudioKey, function () {
        audioUnlocked = false
    })
}

function setCurrentTrack(track) {
    window.electronAPI.setTrackName(track)
}

function getQueryParam(key) {
    const searchParams = new  URLSearchParams(window.location.search)
    const params = Object.fromEntries(searchParams.entries());
    return params[key]
}

function redirect(url, queryParams = null) {
    window.midiApi.disconnectMidiThru()
    params = queryParams ? '?' + new URLSearchParams(queryParams).toString() : ''

    window.location = url + params
}

function visibleButton(id) {
    document.getElementById(id).style.visibility = 'visible'
}

function invisibleButton(id) {
    document.getElementById(id).style.visibility = 'hidden'
}

function setHeader(header) {
    document.getElementById('header').innerHTML = header
}

function deleteIcon() {
    return '<img src="icons/delete.svg" width=40px height=40px>'
}

function songIcon() {
    return '<img src="icons/songs.svg" width=40px height=40px>'
}

function connectIcon() {
    return '<img src="icons/connect.svg" width=40px height=40px>'
}

function midiIcon(solid) {
    return solid
        ? '<img src="icons/midi.svg" width=40px height=40px>'
        : '<img src="icons/midiEmpty.svg" width=40px height=40px>'
}

function playIcon() {
    return '<img src="icons/play.svg" width=40px height=40px>'
}

function listIcon() {
    return '<img src="icons/list.svg" width=40px height=40px>'
}

function bankIcon() {
    return '<img src="icons/folder-music.svg" width=40px height=40px>'
}

function infoIcon(solid) {
    return solid
        ? '<img src="icons/info-solid.svg" width=40px height=40px>'
        : '<img src="icons/info.svg" width=40px height=40px>'
}

function getKeycodes() {
    return {
        CANCEL: 3,
        HELP: 6,
        BACK_SPACE: 8,
        TAB: 9,
        CLEAR: 12,
        RETURN: 13,
        ENTER: 14,
        SHIFT: 16,
        CONTROL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        PRINTSCREEN: 44,
        INSERT: 45,
        DELETE: 46,
        NUM0: 48,
        NUM1: 49,
        NUM2: 50,
        NUM3: 51,
        NUM4: 52,
        NUM5: 53,
        NUM6: 54,
        NUM7: 55,
        NUM8: 56,
        NUM9: 57,
        SEMICOLON: 59,
        EQUALS: 61,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        CONTEXT_MENU: 93,
        NUMPAD0: 96,
        NUMPAD1: 97,
        NUMPAD2: 98,
        NUMPAD3: 99,
        NUMPAD4: 100,
        NUMPAD5: 101,
        NUMPAD6: 102,
        NUMPAD7: 103,
        NUMPAD8: 104,
        NUMPAD9: 105,
        MULTIPLY: 106,
        ADD: 107,
        SEPARATOR: 108,
        SUBTRACT: 109,
        DECIMAL: 110,
        DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        F16: 127,
        F17: 128,
        F18: 129,
        F19: 130,
        F20: 131,
        F21: 132,
        F22: 133,
        F23: 134,
        F24: 135,
        NUM_LOCK: 144,
        SCROLL_LOCK: 145,
        COMMA: 188,
        PERIOD: 190,
        SLASH: 191,
        BACK_QUOTE: 192,
        OPEN_BRACKET: 219,
        BACK_SLASH: 220,
        CLOSE_BRACKET: 221,
        QUOTE: 222,
        HASH: 222,
        META: 224
    };
}