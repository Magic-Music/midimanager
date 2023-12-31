const projects = window.projectsApi.getProjects()
window.onload = showProjects();

addListeners()

function showProjects() {
    let projectsContainer = document.getElementById('projects')

    let keypress = numbersOneKey;
    projects.forEach((project) => {
        projectsContainer.innerHTML += ("<button class='big-button' onclick='redirect(\"play/set.html\", {project:\"" + project.slug + "\"})'>" + project.name + "</button>")
        addKeyPress(keypress++, function () {
            redirect("play/set.html", {project: project.slug})
        })
    })
}

function addListeners() {
    addOnClick('setup-devices', function () {
        window.location = "devices/devices.html"
    })

    addOnClick('setup-projects', function () {
        window.location = "projects/projects.html"
    })

    addOnClick('exit-application', function () {
        window.close()
    })

    addKeyPress(goBackKey, function () {
        window.close()
    })

    setPlayControls()
}