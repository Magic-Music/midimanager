let devices
let deviceTable
let edited = false

window.onload = showDevices();

addOnClick('add-device', function() {addDevice()})
addOnClick('save-devices', function() {saveDevices()})
addOnClick('home', function() {window.location="home/home.html"})

function showDevices()
{
    devices = window.devicesApi.getDevices();

    deviceTable = new Tabulator('#devices-table', {
        placeholder: "No midi devices defined",
        data: devices,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Device",
                field: "name",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function(cell) {editDeviceName(cell)}
            },
            {
                title: "Banks",
                formatter: bankIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {editBanks(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteDevice(cell)}
            }
        ],
    })
}

function devicesEdited() {
    if (!edited)
    {
        visibleButton('save-devices')
    }

    edited = true
}

function addDevice() {
    // deviceTable.addRow({name: "-"})
    devices.push({name: "-", slug: "-"})
}

function editDeviceName(cell) {
    if (cell.getData().slug === '-') {
        cell.getRow().getData().slug = cell.getData().name.slugify()
    }

    devicesEdited()
}

function deleteDevice(cell) {
    cell.getRow().delete()

    devicesEdited()
}

function editBanks(cell) {
    if ((edited && confirm("You have unsaved changes, are you sure you want to leave this page?")) || !edited) {
        redirect("devices/banks.html", {device:cell.getRow().getData().slug})
    }
}

function saveDevices() {
    let newDevices = []

    deviceTable.getData().forEach((device) => {
        if(device.deviceSlug !== '-') {
            newDevices.push({
                name: device.name,
                slug: device.slug,
                banks: device.banks || []
            })
        }
    })

    do {
        finished = false;
        let index = devices.indexOf(devices.find(function(p) {return p['slug'] ==='-'}))
        if (index > -1) {
            devices.splice(index, 1)
        } else {
            finished = true
        }
    } while (!finished)

    window.devicesApi.saveDevices(newDevices)

    invisibleButton('save-devices')
    edited = false
}