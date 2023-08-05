const projects = window.projectsApi.getProjects()

window.onload = showProjects();

function showProjects() {
    addOnClick('setup-devices', function() {window.location="devices/devices.html"})
    addOnClick('setup-projects', function() {window.location="projects/projects.html"})
    addOnClick('exit-application', function() {window.close()})

    let projectsContainer = document.getElementById('projects')

    let keypress = numberPadOne;
    projects.forEach((project) => {
        projectsContainer.innerHTML += ("<button class='big-button' onclick='redirect(\"play/set.html\", {project:\"" + project.slug + "\"})'>" + project.name + "</button>")
        addKeyPress(keypress++, function() {
            console.log("Project is", project)
            redirect("play/set.html", {project: project.slug})
        })
    })
}
