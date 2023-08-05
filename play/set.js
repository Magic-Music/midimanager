window.onload = showSetlists();

function showSetlists() {
    addOnClick('home', function() {redirect("home/home.html")})
    const projectSlug = getQueryParam('project')
    const sets = window.setsApi.getSetlists(projectSlug)
    let setlistContainer = document.getElementById('setlists')

    let keypress = numberPadOne;
    sets.forEach((set) => {
        let query = {project:projectSlug, set:set.slug}
        let queryString = JSON.stringify(query)
        setlistContainer.innerHTML += ("<button class='big-button set-button' onclick='redirect(\"play/play.html\", " + queryString + ")'>" + set.name + "</button>")
        addKeyPress(keypress++, function() {
            redirect("play/play.html", query)
        })
    })

    connectMidiThru()
    html('midi-thru', window.projectsApi.getMidiThruStatus(projectSlug) ? "Midi Thru Enabled" : "Midi Thru Disabled")
}
