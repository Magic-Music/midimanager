let port
let ports
let portTable
let edited = false

const projectSlug =getQueryParam('project')


window.onload = getPorts()
    .then((response) => {
        ports = response
        showPorts()
    });

addOnClick('return-to-connections', function() {
    redirect("projects/connections.html", {project:projectSlug})
})
addOnClick('home', function() {window.location="home/home.html"})

function getPorts()
{
    return window.midiApi.getPorts();
}

function showPorts()
{
    
    port = window.projectsApi.getCurrentPort(projectSlug);

    portTable = new Tabulator('#ports-table', {
        placeholder: "No midi ports discovered",
        data: ports,
        selectable: 1,
        layout: "fitColumns",

        columns: [
            {
                title: "Port",
                field: "port",
            }
        ],
    })

    portTable.on('rowClick', function (e,row) {selectPort(row)})

    portTable.on('tableBuilt', function() {highlightSelectedPort()})
}

function highlightSelectedPort() {
    if (port.length > 0) {
        let row = portTable.getRows().find(function(row) {return row.getData()['port'] === port})
        portTable.selectRow(row)
    }
}

function selectPort(row)
{
    row.select()
    port = row.getData().port
    window.projectsApi.selectPort(projectSlug, port)
}
