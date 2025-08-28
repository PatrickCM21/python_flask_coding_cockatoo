document.getElementById('start').addEventListener('click', begin)

quizHolder = document.getElementById('quizHolder')

function begin() {
    measure = document.querySelector(`input[name="measurement"]:checked`).value
    getQuestion("Compare", 0)
}

function getQuestion(questionType, QuestionNumber) {
    quizHolder.innerHTML = ''
    submit = {
        "Question": questionType,
        "QuestionNumber": QuestionNumber,
        "Measurement": measure
    }
    fetch(`${window.origin}/get_question`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(submit),
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(response => response.text()) 
    .then(html => {
        quizHolder.innerHTML = html;

        
        const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)
        if (scriptContent) {
            const script = document.createElement('script');
            script.textContent = scriptContent[1]
            document.body.appendChild(script);
        }
    })
    .catch(error => console.error("Error loading HTML: ", error)) 
}