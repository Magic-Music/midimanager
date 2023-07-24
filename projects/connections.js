let devices
let connections
let connectionsTable
let edited = false

const projectSlug =getQueryParam('project')

window.onload = showConnections();

addOnClick('select-port', function() {redirect("projects/port.html", {project:projectSlug})})
addOnClick('add-connection', function() {addConnection()})
addOnClick('save-connections', function() {saveConnections()})
addOnClick('return-to-projects', function() {window.location="projects/projects.html"})
addOnClick('home', function() {window.location="home/home.html"})

function showConnections() {
    setHeader(window.projectsApi.getProjectName(projectSlug))
    connections = window.projectsApi.getConnections(projectSlug)
    devices = window.devicesApi.getDeviceSlugList()

    connectionsTable = new Tabulator('#connections-table', {
        placeholder: "No connections defined",
        data: connections,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Device",
                field: "device",
                editor: "list",
                editorParams: {values: Object.keys(devices)},
                cellEdited: function (cell) {editDevice(cell)}
            },
            {
                title: "Midi channel",
                field: "channel",
                editor: "list",
                editorParams: {values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
                cellEdited: function (cell) {editConnection(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteConnection(cell)}
            }
        ],
    })
}

function connectionsEdited() {
    if (!edited)
    {
        visibleButton('save-connections')
    }

    edited = true
}

function addConnection() {
    connectionsTable.addRow({device: "-", slug: "-", channel: "-"})
}

function editDevice(cell) {
    cell.getData().slug = devices[cell.getValue()]
    connectionsEdited()
}

function editConnection(cell) {
    connectionsEdited()
}

function deleteConnection(cell) {
    cell.getRow().delete()
    connectionsEdited()
}

function saveConnections() {
    let newDevices = []

    connectionsTable.getData().forEach((device) => {
        if(device.slug !== '-' && device.channel !== '-') {
            newDevices.push({deviceSlug: device.slug, midiChannel: device.channel})
        }
    })

    window.projectsApi.saveConnections(projectSlug, newDevices)

    invisibleButton('save-connections')
    edited = false
}