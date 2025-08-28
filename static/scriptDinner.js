const radioButtons = document.querySelectorAll('input[name="person-no"]');
for (const radioButton of radioButtons){
    radioButton.addEventListener('change', updateGuests)
}                    
function updateGuests() {
    if(this.checked) {
        guests = 5;
        console.log(this.value);
        guest_count = Number(this.value);
        for (let i = 1; i <= guest_count; i++) {
            id = 'personinput'+ i.toString();
            var box = document.getElementById(id);
            box.classList.remove('d-none');
            box.required = true;
        }
        for (let j = guest_count + 1; j <= guests; j++) {
            id = 'personinput'+ j.toString();
            var box = document.getElementById(id);                              
            box.classList.add('d-none');
            box.required = false;
        }
    }
}

//handle server request
document.getElementById("first-submit").addEventListener("submit", send_response);


function send_response() {
    event.preventDefault();
    console.log("worked");
    document.getElementById("initial-submit-button").disabled = true;
    document.getElementById("initial-submit-button").classList.add("btn-secondary");
    document.getElementById("loading-initial").classList.remove('d-none');
    var topic = document.getElementById("topic");         
    var user = document.getElementById("user");
    var mood = document.getElementById("mood");
    var context = document.getElementById("context");
    var guest_count = document.querySelector('input[name="person-no"]:checked').value;

    var submit = {
        topic: topic.value,
        user: user.value,
        mood: mood.value,
        context: context.value,
        guests: guest_count,
    }

    for (let i = 1; i <= guest_count; i++) {
        var guestInput = document.getElementById(`personinput${i}`);
        submit[`guest${i}`] = guestInput.value;
    }

    fetch(`${window.origin}/dinner_start`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(submit),
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function (response) {
        if (response.status !== 200) {
            console.log(`Response sending error: ${response.status}`)
            document.getElementById("loading-initial").classList.add('d-none');
            document.getElementById("error-message").classList.remove('d-none');
            return ;
        }
        document.getElementById("loading-initial").classList.add('d-none');
        document.getElementById("user-response-button").disabled = false;
        document.getElementById("user-response-button").classList.remove("btn-secondary");
        document.getElementById("user-response-button").classList.add("btn-primary");
        response.json().then(function (data) {
            console.log(data.context)
            console.log(data.dialogue)
            const discussionLocation = document.querySelector('#discussion')
            if (data.context != '') {
                generateContext(data, discussionLocation)   
            }
            for (i = 0; i < data.dialogue.length; i++) {
                generateDialogue(data, discussionLocation)
            }
        })

    })
    .catch ((error) => {
        console.error("An error occured", error)
        document.getElementById("loading-intitial").classList.add('d-none');
        document.getElementById("error-message").classList.remove('d-none');
    })
}

document.getElementById("subsequent-submit").addEventListener("submit", send_subsequent_response);

function send_subsequent_response() {
    event.preventDefault();             
    var user_response = document.getElementById("user-response");
    document.getElementById("user-response-button").disabled = true;
    document.getElementById("loading-subsequent").classList.remove('d-none');
    document.getElementById("user-response-button").classList.add("btn-secondary");
    document.getElementById("user-response-button").classList.remove("btn-primary");
    document.getElementById("loading-subsequent").classList.remove('d-none');
    var submit = {
        user_response: user_response.value
    };

    
    fetch(`${window.origin}/dinner_response`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(submit),
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function (response) {
        if (response.status !== 200) {
            console.log(`Response sending error: ${response.status}`)
            document.getElementById("loading-subsequent").classList.add('d-none');
            document.getElementById("error-message").classList.remove('d-none')
            return ;
        }
        document.getElementById("loading-subsequent").classList.add('d-none');
        document.getElementById("user-response-button").disabled = false;
        document.getElementById("user-response-button").classList.remove("btn-secondary");
        document.getElementById("user-response-button").classList.add("btn-primary");
        response.json().then(function (data) {
            console.log(data.context)
            console.log(data.dialogue)
            const discussionLocation = document.querySelector('#discussion')
            if (data.context != '') {
                generateContext(data, discussionLocation)           
            }
            for (i = 0; i < data.dialogue.length; i++) {
                generateDialogue(data, discussionLocation)
            }
        })

    })
    .catch((error) => {
        console.error('An error occurred', error);
        document.getElementById("loading-subsequent").classList.add('d-none');
        document.getElementById("error-message").classList.remove('d-none')
    })
    document.getElementById("user-response").value = ''
}

function generateDialogue(data, discussionLocation) {
    console.log(data.images)
    console.log(data.speaker[i])
    console.log(data.images[data.speaker[i]])
    const dialogue = document.createElement('p')
    dialogue.classList.add('dialogue')
    dialogue.appendChild(document.createTextNode(data.dialogue[i]))
    const divrow = document.createElement('div')
    divrow.classList.add('row', 'mb-1', 'mt-1', 'align-items-center')
    const picture = document.createElement('img') 
    if (data.images[data.speaker[i]] != '') {
        picture.src = data.images[data.speaker[i]]
        picture.classList.add('rounded', 'float-start', 'guestpic', 'me-1')
        const divpic = document.createElement('div')
        divpic.classList.add('col-md-auto')
        divpic.appendChild(picture)
        divrow.appendChild(divpic)
    } 
    const divdialogue = document.createElement('div')
    divdialogue.classList.add('col')
    divdialogue.appendChild(dialogue)
    divrow.appendChild(divdialogue)
    discussionLocation.appendChild(divrow)
}

function generateContext(data, discussionLocation) {
    const context = document.createElement('p')
    context.classList.add('context')
    context.appendChild(document.createTextNode(data.context))   
    discussionLocation.appendChild(context)
}