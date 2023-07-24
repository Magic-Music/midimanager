const projects = window.projectsApi.getProjects()

window.onload = showProjects();

function showProjects() {
    addOnClick('setup-devices', function() {window.location="devices/devices.html"})
    addOnClick('setup-projects', function() {window.location="projects/projects.html"})
    addOnClick('exit-application', function() {window.close()})

    let projectsContainer = document.getElementById('projects')

    projects.forEach((project) => {
        projectsContainer.innerHTML += ("<button class='big-button' onclick='redirect(\"play/set.html\", {project:\"" + project.slug + "\"})'>" + project.name + "</button>")
    })
}
