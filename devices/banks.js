let devices
let banks
let banksTable
let edited = false

const deviceSlug =getQueryParam('device')

window.onload = showBanks();

addOnClick('add-bank', function() {addBank()})
addOnClick('save-banks', function() {saveBanks()})
addOnClick('return-to-devices', function() {window.location="devices/devices.html"})
addOnClick('home', function() {window.location="home/home.html"})

function showBanks() {
    setHeader(window.devicesApi.getDeviceNameBySlug(deviceSlug))
    banks = window.devicesApi.getBanks(deviceSlug)

    banksTable = new Tabulator('#banks-table', {
        placeholder: "No banks defined",
        data: banks,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Bank name",
                field: "bank",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function (cell) {editBank(cell)}
            },
            {
                title: "MSB",
                field: "msb",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function (cell) {editBank(cell)}
            },
            {
                title: "LSB",
                field: "lsb",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function (cell) {editBank(cell)}
            },
            {
                title: "Program Offset",
                field: "offset",
                editor: "input",
                editorParams: {selectContents: true},
                cellEdited: function (cell) {editBank(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteBank(cell)}
            }
        ],
    })
}

function banksEdited() {
    if (!edited)
    {
        visibleButton('save-banks')
    }

    edited = true
}

function addBank() {
    banksTable.addRow({bank: "-", msb: "-", lsb: "-", offset: "-"})
}

function editBank(cell) {
    if (!cell.getData().slug) {
        cell.getRow().getData().slug = cell.getData().bank.slugify()
    }
    banksEdited()
}

function deleteBank(cell) {
    cell.getRow().delete()
    banksEdited()
}

function saveBanks() {
    let newBanks = []

    banksTable.getData().forEach((bank) => {
        if(bank.bank !== '-' && bank.msb !== '-' && bank.lsb !== '-' && bank.offset !== '-') {
            newBanks.push({
                bank: bank.bank,
                slug: bank.slug,
                msb: bank.msb,
                lsb:bank.lsb,
                offset:bank.offset
            })
        }
    })

    window.devicesApi.saveBanks(deviceSlug, newBanks)

    invisibleButton('save-banks')
    edited = false
}