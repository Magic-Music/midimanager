let setlists
let setlistsTable

const projectSlug = getQueryParam('project')

window.onload = showSetlists();

addOnClick('add-setlist', function() {addSetlist()})
addOnClick('return-to-projects', function() {window.location="projects/projects.html"})
addOnClick('home', function() {window.location="home/home.html"})

function showSetlists()
{
    setHeader(window.projectsApi.getProjectName(projectSlug))
    setlists = window.setsApi.getSetlists(projectSlug);

    setlistsTable = new Tabulator('#setlists-table', {
        placeholder: "No set lists defined",
        data: setlists,
        reactiveData: true,
        layout: "fitColumns",
        movableRows: true,
        columns: [
            {
                rowHandle:true,
                formatter:"handle",
                headerSort:false,
                frozen:true,
                width:30,
                minWidth:30
            },
            {
                title: "Set List",
                field: "name",
                editor: true,
                editorParams: {selectContents: true},
                cellEdited: function(cell) {editSetlistName(cell)}
            },
            {
                title: "Songs",
                formatter: songIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editSet(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteSetlist(cell)}
            }
        ],
    })

    setlistsTable.on("rowMoved", function() {
        editSetlistOrder()
    })
}

function addSetlist() {
    setlists.push({name: "-", slug: "-"})
}

function deleteSetlist(cell) {
    let slug = cell.getData().slug

    setlists.splice(
        setlists.indexOf(
            setlists.find(function(set) {
                return set['slug'] === slug
            })
        ), 1
    )

    cell.getRow().delete()

    saveSetlists()
}

function editSetlistName(cell) {
    cell.getRow().getData().slug = cell.getData().name.slugify()

    saveSetlists()
}

function editSetlistOrder() {
    setlists = setlistsTable.getData()

    saveSetlists()
}

function saveSetlists() {
    window.setsApi.saveSetlists(projectSlug, setlists)
}

function editSet(cell) {
    redirect("sets/set.html", {project: projectSlug, set: cell.getRow().getData().slug})
}
