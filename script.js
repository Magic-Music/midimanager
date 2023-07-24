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

function getQueryParam(key) {
    const searchParams = new  URLSearchParams(window.location.search)
    const params = Object.fromEntries(searchParams.entries());
    return params[key]
}

function redirect(url, queryParams = null) {
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
