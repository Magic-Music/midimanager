let programsTable
let bankSlugs
let edited = false

const projectSlug =getQueryParam('project')
const songId = getQueryParam('song')

//const devices = window.devicesApi.getDeviceSlugList()
const devices = window.projectsApi.getUsedDeviceList(projectSlug)
const fullTitle = window.songsApi.getSongTitleAndArtist(projectSlug, songId)
let programs = window.songsApi.getPrograms(projectSlug, songId)

window.onload = showPrograms();

addOnClick('add-device', function() {addDevice()})
addOnClick('save-programs', function() {savePrograms()})
addOnClick('back-to-songs', function() {redirect("songs/songs.html", {project:projectSlug})})

addOnClick('home', function() {window.location="home/home.html"})
function showPrograms() {
    setHeader(fullTitle)

    programsTable = new Tabulator('#programs-table', {
        placeholder: "No programs defined",
        data: programs,
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
                title: "Bank",
                field: "bank",
                editor: "list",
                editorParams:{valuesLookup: function (cell) {return getBanks(cell)}},
                cellEdited: function (cell) {editBank(cell)}
            },
            {
                title: "Program",
                field: "program",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function (cell) {editProgram(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteProgram(cell)}
            }
        ],
    })
}

function programsEdited() {
    if (!edited)
    {
        visibleButton('save-programs')
    }

    edited = true
}

function editDevice(cell) {
    cell.getData().deviceSlug = devices[cell.getValue()]
    programsEdited()
}

function getBanks(cell) {
    let deviceSlug = cell.getData().deviceSlug
    bankSlugs = window.devicesApi.getBankSlugs(deviceSlug)

    let bankNames = Object.keys(bankSlugs)
    if (bankNames.length === 0) {
        bankNames = ['-']
    }

    return bankNames
}

function addDevice() {
    programs.push({
        device: "-",
        deviceSlug: "-",
        bank: "-",
        bankSlug: "-",
        program: "-"
    })

}

function editBank(cell) {
    cell.getData().bankSlug = bankSlugs[cell.getValue()]
    programsEdited()
}

function editProgram(cell) {
    programsEdited()
}

function deleteProgram(cell) {
    cell.getRow().delete()
    programsEdited()
}

function savePrograms() {
    let newPrograms = []

    programsTable.getData().forEach((program) => {
        if(program.deviceSlug !== '-' && program.program !== '-') {
            newPrograms.push({
                device: program.deviceSlug,
                bank: program.bankSlug,
                program: program.program
            })
        }
    })

    do {
        finished = false;
        let index = programs.indexOf(programs.find(function(p) {return p['program'] ==='-'}))
        if (index > -1) {
            programs.splice(index, 1)
        } else {
            finished = true
        }
    } while (!finished)

    window.songsApi.savePrograms(projectSlug, songId, newPrograms)

    invisibleButton('save-programs')
    edited = false
}
