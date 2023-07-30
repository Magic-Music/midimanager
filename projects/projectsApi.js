const fs = require('fs')
const path = require('path')

const {getDevices} = require("../devices/devicesApi");
const {findBySlug} = require("../utilities");

let projects = []

const getProjects = () => {
    if (projects.length == 0) {
        try {
            projects = require('../config/projects.json')
        } catch (e) {
        }
    }

    return projects
}

const saveProjects = (projectData) => {
    fs.writeFileSync(path.join(process.cwd(), 'config/projects.json'), JSON.stringify(projectData, null, 1))
    projects = projectData
}

const getProjectBySlug = (projectSlug) => {
    return findBySlug(getProjects(), projectSlug)
}

const getProjectName = (projectSlug) => {
    return getProjectBySlug(projectSlug).name
}

/*
 * Get the midi device connections for a project
 * Work out the name of the device from the slug and include it
 */
const getConnections = (projectSlug) => {
    let deviceConfig = getDevices()
    let project = getProjectBySlug(projectSlug)
    let deviceConnections = project['devices'] ?? [];

    let connections = []
    deviceConnections.forEach((connection) => {
        let deviceSlug = connection.deviceSlug
        let device = findBySlug(deviceConfig, deviceSlug)
        connections.push({
            device: device.name,
            slug: device.slug,
            channel: connection.midiChannel
        })
    })

    return connections
}

const getUsedDeviceList = (projectSlug) => {
    let devices = getDevices()
    let project = getProjectBySlug(projectSlug)
    let projectDevices = project['devices'] ?? [];
    let usedDevices = {}
    projectDevices.forEach((device) => {
        let deviceName = findBySlug(devices, device.deviceSlug).name       
        usedDevices[deviceName] = device.deviceSlug
    })
    return usedDevices
}

const getDeviceChannels = (projectSlug) => {
    let project = getProjectBySlug(projectSlug)
    let devices = project['devices'];
    let connections = {}
    devices.forEach((device) => {
        connections[device.deviceSlug] = device.midiChannel
    })

    return connections
}

const saveConnections = (projectSlug, devices) => {
    let project = getProjectBySlug(projectSlug)
    project.devices = devices

    saveProjects(projects)
}

const getNextSongId = (projectSlug) => {
    let project = getProjectBySlug(projectSlug)

    let songId = project['lastSongId'] ?? 0
    songId++
    project.lastSongId = songId

    saveProjects(projects)
    return songId.toString()
}

const getCurrentPort = (projectSlug) => {
    let project = getProjectBySlug(projectSlug)
    return (typeof project ==='undefined') ? '' : (project['midiPort'] ?? '')
}

const selectPort = (projectSlug, port) => {
    let project = getProjectBySlug(projectSlug)
    project.midiPort = port
    saveProjects(projects)
}

const getMidiThruStatus = (projectSlug) => {
    let project = getProjectBySlug(projectSlug)
    return project['midiThru'] ?? false
}

const toggleMidiThru = (projectSlug) => {
    let project = getProjectBySlug(projectSlug)
    project.midiThru = !(project['midiThru'] ?? false)
    saveProjects(projects)
    return project['midiThru']
}

module.exports = {
    selectPort,
    getProjects,
    saveProjects,
    getNextSongId,
    getCurrentPort,
    getConnections,
    getProjectName,
    saveConnections,
    getDeviceChannels,
    getUsedDeviceList,
    toggleMidiThru,
    getMidiThruStatus,
}
