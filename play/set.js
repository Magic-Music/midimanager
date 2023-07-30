window.onload = showSetlists();

function showSetlists() {
    addOnClick('home', function() {redirect("home/home.html")})
    const projectSlug = getQueryParam('project')
    const sets = window.setsApi.getSetlists(projectSlug)
    let setlistContainer = document.getElementById('setlists')

    sets.forEach((set) => {
        let query = JSON.stringify({project:projectSlug, set:set.slug})
        setlistContainer.innerHTML += ("<button class='big-button set-button' onclick='redirect(\"play/play.html\", " + query + ")'>" + set.name + "</button>")
    })

    connectMidiThru()
    html('midi-thru', window.projectsApi.getMidiThruStatus(projectSlug) ? "Midi Thru Enabled" : "Midi Thru Disabled")
}
