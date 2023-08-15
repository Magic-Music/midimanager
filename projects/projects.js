let projects
let projectsTable

window.onload = showProjects();

addOnClick('add-project', function() {addProject()})
addOnClick('home', function() {window.location="home/home.html"})

function showProjects()
{
    projects = window.projectsApi.getProjects();

    projectsTable = new Tabulator('#projects-table', {
        placeholder: "No projects defined",
        data: projects,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
            {
                title: "Project",
                field: "name",
                editor: true,
                cellEdited: function(cell) {editProjectName(cell)}
            },
            {
                title: "Songs",
                formatter: songIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editSongs(cell)}
            },
            {
                title: "Sets",
                formatter: listIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editSets(cell)}
            },
            {
                title: "Devices",
                formatter: connectIcon,
                width: 140,
                hozAlign: "center",
                headerHozAlign: "center",
                headerSort: false,
                cellClick: function (e, cell) {editConnections(cell)}
            },
            {
                formatter: deleteIcon,
                width: 100,
                hozAlign: "center",
                headerSort: false,
                cellClick: function(e, cell) {deleteProject(cell)}
            }
        ],
    })
}

function addProject() {
    projectsTable.addRow({})
}

function saveProjects() {
    window.projectsApi.saveProjects(projectsTable.getData())
}

function editProjectName(cell) {
    if (!cell.getData().slug) {
        cell.getRow().getData().slug = cell.getData().name.slugify()
    }

    saveProjects()
}

function deleteProject(cell) {
    if (confirm("Are you sure you want to delete this project?")) {
        cell.getRow().delete()
        saveProjects()
    }
}

function editSongs(cell) {
    redirect("songs/songs.html", {project:cell.getRow().getData().slug})
}

function editSets(cell) {
    redirect("sets/setlists.html", {project:cell.getRow().getData().slug})
}

function editConnections(cell) {
    redirect("projects/connections.html", {project:cell.getRow().getData().slug})
}
