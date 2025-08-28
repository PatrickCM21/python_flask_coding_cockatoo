document.getElementById('submit').addEventListener('click', findGames)
main = document.getElementById('main')

function findGames() {
    //check if steam profile is valid
    document.getElementById("loading").classList.remove('d-none');
    id = document.getElementById('steamProfile')
    if (true) { //add some client side error checking to make sure its a valid link
        submit = {
            "SteamID": id.value
        }
        fetch(`${window.origin}/check_id`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(submit),
            headers: new Headers({
                "content-type": "application/json"
            })
            })
            .then((response) => {
                if (response.status == 200) {
                    console.log(response)
                    return response.text()
                } else {
                    console.error("There was an error ", response.status)
                    return Promise.reject("error " + response.status)
                }          
            })
            .then(html => {
                main.innerHTML = '';
                main.innerHTML = html;
                const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)
                if (scriptContent) {
                    const script = document.createElement('script');
                    script.textContent = scriptContent[1]
                    document.body.appendChild(script);
                }
            })
            .catch(error => console.error("Error loading HTML: ", error)) 
    }
    //if invalid get them to provie another
    //else fetch games
    //include error if it is private
}