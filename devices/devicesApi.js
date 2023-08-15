const fs = require('fs')
const path = require('path')
const {findBySlug} = require("../utilities");

let devices = []

const getDevices = () => {
    if (devices.length == 0) {
        try {
            devices = require('../config/devices.json')
        } catch (e) {
        }
    }

    return devices
}

const saveDevices = (devices) => {
    fs.writeFileSync(path.join(process.cwd(), 'config/devices.json'), JSON.stringify(devices, null, 1))
}

const getDeviceBySlug = (deviceSlug) => {
    let devices = getDevices()
    return findBySlug(devices, deviceSlug)
}

const getDeviceSlugList = () => {
    let devices = getDevices()
    let deviceSlugs = {}

    devices.forEach((device) => {
        deviceSlugs[device.name] = device.slug
    })

    return deviceSlugs
}

const getDeviceNameBySlug = (deviceSlug) => {
    return getDeviceBySlug(deviceSlug).name
}

const getBanks = (deviceSlug) => {
    let device = getDeviceBySlug(deviceSlug)
    return device['banks'] ?? []
}

const getBankBySlug = (deviceSlug, bankSlug) => {
    let bank = getBankDataBySlug(deviceSlug, bankSlug)
    return bank ? bank.bank : null
}

const getBankDataBySlug = (deviceSlug, bankSlug) => {
    let banks = getBanks(deviceSlug)
    return findBySlug(banks, bankSlug)
}

const getBankSlugs = (deviceSlug) => {
    let banks = getBanks(deviceSlug)

    bankSlugs={}
    banks.forEach((bank) => {
        bankSlugs[bank.bank] = bank.slug
    })

    return bankSlugs
}

const saveBanks = (deviceSlug, banks) => {
    let device = getDeviceBySlug(deviceSlug)
    device.banks = banks
    saveDevices(devices)
}


module.exports = {
    getBanks,
    saveBanks,
    getDevices,
    saveDevices,
    getBankSlugs,
    getBankBySlug,
    getDeviceBySlug,
    getBankDataBySlug,
    getDeviceSlugList,
    getDeviceNameBySlug
}