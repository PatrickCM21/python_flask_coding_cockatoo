const numbers = document.querySelectorAll('.update');
const bases = document.querySelectorAll('.bases')
startingDate = new Date("2025-02-02")
currentDate = new Date()
round = 0

set_bases();
function set_bases() {    
    const minutesSinceStart = (currentDate - startingDate) / (1000 * 60) 
    index = 0
    for (const base of bases) { //Calculates changes since I got the initial data
        found=false
        while (found === false) {
            if (items[index]["Base_Amount"] != 0) {
                increased_base = Math.round(items[index]["Base_Amount"] + (items[index]["ROC"] * minutesSinceStart))
                base.dataset.info = `Total Amount: ${increased_base.toLocaleString()}`      
                found=true      
            }
            index = index + 1  
        }
    }
}

const ua = detect.parse(navigator.userAgent)
phoneItem = document.querySelector('#phone')
if(ua.device.family === 'iPhone') {
    phoneItem.innerText += " And you're one of those iPhone snobs >:("
}else if (ua.device.family === 'Android') {
    phoneItem.innerText += " And that means you're my kinda guy!"
}else if (ua.device.family === 'Other') {
    phoneItem.innerText += " You're okay though, you use something else"
}else {
    phoneItem.innerText += " You're okay though, you use " + ua.device.family
}



setInterval(updateNumbers, 50); //1000 = 1 second, so this is 50 milliseconds
async function updateNumbers() {
    index = 0
    round = round + 1;
    for (const number of numbers) {
        new_number = (items[index]["ROC"] / 60 / 20) * round //ROC stands for Rate of Change and is measured in minutes
        number.innerText = Math.round(new_number)
        index = index + 1   
    };
}