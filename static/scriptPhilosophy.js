const form = document.getElementById("form-submit");
const submitButton = document.getElementById("submit-button");
form.addEventListener("change", () => {
    const allOptions = document.querySelectorAll(".radios");
    let allChecked = true;

    allOptions.forEach(group => {
        const checked = group.querySelector("input[type='radio']:checked");
        if (!checked) {
            allChecked = false;
        }
    })
    if (allChecked) {
        submitButton.disabled = false;
        submitButton.classList.add("btn-primary");
        submitButton.classList.remove("btn-secondary");
    } else {
        submitButton.disabled = true;
        submitButton.classList.add("btn-secondary");
        submitButton.classList.remove("btn-primary");
    }
    
})

const reset_button = document.getElementById('reset')
reset_button.addEventListener("click", reset);
function reset(){
    window.location.reload(); 
    window.scrollTo(
        {top: 0, 
        left: 0, 
        behavior: "instant",
    });
}

form.addEventListener("submit", find_philosopher);

async function find_philosopher() {
    //find quiz result
    event.preventDefault();
    console.log("worked");
    submitButton.disabled = true;
    submitButton.classList.add("btn-secondary");
    document.getElementById("loading").classList.remove('d-none');

    var answer_points = {
        "Albert Camus": 0,
        "Laozi": 0,
        "Immanuel Kant": 0,
        "Marcus Aurelius": 0,
        "Aristotle": 0
    }

    console.log(questionscount)
    for (i = 0; i < questionscount; i++) { 
        answer = document.querySelector(`input[name="q${i}ans"]:checked`).value;
        console.log(answer);
        answer_points[answer] += 1;
    }
    
    
    const values = Object.values(answer_points);
    let highest = 0;
    highest = Math.max(...values)
    const winner = Object.keys(answer_points).find(key => answer_points[key] === highest);
    
    console.log(answer_points);
    console.log(winner);
    console.log(winners)
    const winning_text = winners[winner].info;
    const winning_quote = winners[winner].quote;
    const winning_weakness = winners[winner].weakness;
    const winning_philosophers = winners[winner]["similar philosophers"];

    //display information

    box_location = document.getElementById('winner_box');
    box_location.classList.remove('d-none')

    const winner_heading = document.createElement('h1');
    winner_heading.appendChild(document.createTextNode(winner));

    const quote = document.createElement('q');
    quote.appendChild(document.createTextNode(winning_quote));
    quote.classList.add('fst-italic', 'h2')

    const text = document.createElement('p');
    text.appendChild(document.createTextNode(winning_text));

    const weakness = document.createElement('p');
    weakness.appendChild(document.createTextNode(winning_weakness))

    const picture = document.createElement('img') 
    picture.src = winners[winner]["picture"];
    picture.classList.add('rounded', 'float-start', 'picMBTI', 'me-1')

    const philosophers_list = document.createElement('ul')
    for (let philosopher of winning_philosophers) {
        const list_item = document.createElement('li');
        list_item.textContent = philosopher;
        philosophers_list.appendChild(list_item);
    }
    
    document.getElementById('form-submit').classList.add('d-none');

    document.getElementById('name').appendChild(winner_heading);
   
    document.getElementById('quote').appendChild(quote);
    document.getElementById('pic').appendChild(picture);
    document.getElementById('text').appendChild(text);
    document.getElementById('weakness').appendChild(weakness);
    document.getElementById('similars').appendChild(philosophers_list);
    window.scrollTo({
        top: 0, 
        left: 0, 
        behavior: "instant",
    });
    if (record = true) {
        const roundtableans = document.querySelector(`input[name="roundtableans"]:checked`).value;
        update_data = {
        "winner": winner, 
        "roundtable": roundtableans
        };
        try {
            await fetch(`${window.origin}/update_mbti`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(update_data),
                headers: new Headers({
                    "content-type": "application/json"
                })
            })
            if (!Response.ok) {
                throw new error(`Response status: ${response.status}`)
            }
        } catch (error) {
            console.error(error);
        }
    } 
    document.getElementById("loading").classList.add('d-none');
}