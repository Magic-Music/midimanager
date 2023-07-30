const jzz = require('jzz');
const {getBankDataBySlug} = require("../devices/devicesApi");
const {getDeviceChannels, getCurrentPort, getMidiThruStatus} = require("../projects/projectsApi");
const {getPrograms} = require("../songs/songsApi");

let midiIn
let midiOut
let midiThru

let lastProjectSlug
let channels
let ports

const getPorts = async () => {
    let JZZ = await jzz()
    let outputs = JZZ.info().outputs

    ports = [];
    outputs.forEach((output) => {
        ports.push({port:output.name})
    })

    return ports
}

const sendSongById = (projectSlug, songId) => {
    let programData = getPrograms(projectSlug, songId)
    sendSongToMidi(projectSlug, programData)
}

const sendSongToMidi = (projectSlug, programData) => {
    let channels = getProjectMidiChannels(projectSlug)
    programData.forEach((progData) => {
        let channel = channels[progData.deviceSlug] - 1 //1-16 transmitted as 0-15
        let offset = 0

        if (progData.bankSlug !== '-') {
            let bankData = getBankDataBySlug(progData.deviceSlug, progData.bankSlug)
            offset = Number(bankData['offset'])
            getMidiOut(projectSlug).bank(channel, bankData.msb, bankData.lsb).wait(200)
        }

        let programNumber = offset
            + Number(progData.program)
        getMidiOut(projectSlug).program(channel, programNumber)
    })
}

const getProjectMidiChannels = (projectSlug) => {
    if (projectSlug !== lastProjectSlug) {
        channels = getDeviceChannels(projectSlug)
        lastProjectSlug = projectSlug
    }

    return channels
}

const getMidiOut = (projectSlug) => {
    if (!midiOut) {
        port = getCurrentPort(projectSlug)
        midiOut = jzz().openMidiOut(port).or(function() {alert("Can't open port")})
        midiOut.wait(100)
    }

    return midiOut
}

const getMidiIn = (projectSlug) => {
    if (!midiIn && projectSlug) {
        let port = getCurrentPort(projectSlug)
        midiIn = jzz().openMidiIn(port).or(function() {})
    }

    return midiIn
}

const connectMidiThru = (projectSlug) => {
    if (!getMidiThruStatus(projectSlug)) {
        return
    }

    let midiIn = getMidiIn(projectSlug)
    let midiOut = getMidiOut(projectSlug)

    if (!midiThru && midiIn && midiOut) {
        midiThru = jzz().Widget({
            _receive: function(msg) {
                if (msg[0] !== 254) { //Filter active sensing messages
                    this.emit(msg)
                }
            }
        })

        midiIn.connect(midiThru)
        midiThru.connect(midiOut)
    }
}

const disconnectMidiThru = () => {
    if (!getMidiThruStatus) {
        return
    }

    disconnect(midiThru)
    disconnect(midiOut)
    disconnect(midiIn)
}

const disconnect = (connection) => {
    if (typeof(connection) !== 'undefined') {
        connection.disconnect().close()
    }
}

module.exports = {
    getPorts,
    sendSongById,
    sendSongToMidi,
    connectMidiThru,
    disconnectMidiThru
}
