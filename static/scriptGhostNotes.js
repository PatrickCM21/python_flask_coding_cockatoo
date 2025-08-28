
const main = document.getElementById('main')
var triedOnce = false
console.log(document.cookie)

var c = getCookie("messageGiven")
if (c == null) {
    try {
        fetch(`${window.origin}/ghost_welcome`, {
        method: "POST",
        credentials: "include",
        body: "",
        headers: new Headers({
        })
        })
        .then(response => response.text()) 
        .then(function (html) {
            main.innerHTML = html
        })
        .then(() => {
            document.getElementById('submit').addEventListener('click', trySubmit);
        })
    } catch(error) {console.error('Error getting welcome page', error)}
    } else {
        submit = {
            "Cookie": c
        }
        fetch(`${window.origin}/ghost_message`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(submit),
            headers: new Headers({
                "content-type": "application/json"
            })
            })
            .then(response => response.text()) 
            .then(function (html) {
                main.innerHTML = html
            })
            .then(() => {
                messageLocation = document.getElementById('receivedMessage')
                messageLocation.value = getCookie("todayMessage")
            })
    }

function getCookie(name) {
    var cookie = document.cookie;
    var prefix = name + "=";
    var begin = cookie.indexOf("; " + prefix)
    if (begin == -1) {
        begin = cookie.indexOf(prefix);
        if (begin != 0) return null;
    }else {
        begin +=2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = cookie.length;
        }
    }
    return decodeURI(cookie.substring(begin + prefix.length, end))
}

function trySubmit() {
    message = document.getElementById('userMessage')
    let warning = document.getElementById('noMessage')
    warning.classList.add('d-none')
    if (message.value === '') {
        warning.classList.remove('d-none')
        return;
    }
    if (triedOnce === false) {
        let reminder = document.getElementById('reminder')
        reminder.classList.remove('d-none')
        triedOnce = true
    } else { 
        const end = dayjs().endOf('day');
        if (!document.cookie.includes("messageGiven")) { //creates cookie to prevent sending another message on the same day
            document.cookie= `messageGiven=true; expires=${end.toDate().toUTCString()}; path=/`
        }
        submit = {
            "Message": message.value,
        }
        try {
            fetch(`${window.origin}/submit_note`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(submit),
            headers: new Headers({
                "content-type": "application/json"
            })
            })
            .then((response) => response.text())
            .then((html) => {
                main.innerHTML = html
                const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)
                if (scriptContent) {
                    const script = document.createElement('script');
                    script.textContent = scriptContent[1]
                    document.body.appendChild(script);
                }
            })
            .then(() => {
                messageLocation = document.getElementById('receivedMessage')
                console.log(messageLocation.value)
                const end = dayjs().endOf('day');
                document.cookie = `todayMessage=${messageLocation.value}; expires=${end.toDate().toUTCString()}; path=/`;
            })
        }
        catch(error) {
            console.error('error sending to the server', error)
        }
    }
}