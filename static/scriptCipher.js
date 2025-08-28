const choices = document.querySelectorAll('input[name="purpose"]')
for (var choice of choices) {
    choice.addEventListener('change', changePurpose)
}

var outputType = modifyOutput
var mode = 'encryption'
const output = document.getElementById('output')
const input = document.getElementById('input')

const langBox = document.getElementById('languageBox')

const language = document.getElementById('language')
language.addEventListener('change', changeLanguage)
input.addEventListener('input', outputType)

var emojified = false

var spacing = true
var punctuation = true

var password = document.getElementById('password')
password.addEventListener('input', outputType)

function changeLanguage() {
    if (mode == 'encryption') {
        var modify = output
        input.style.fontFamily = "Times New Roman, serif"
        if (emojified) {
            input.value = unEmojify(input.value)
        }
    } else {
        var modify = input
        output.style.fontFamily = "Times New Roman, serif"
        if (emojified) {
            output.value = unEmojify(output.value)
        } 
    }
    if (language.value == 'English') {
        modify.style.fontFamily = "Times New Roman, serif"
        modify.value = unEmojify(modify.value)
        emojified = false
        modify.placeholder="Output..."
    } else if (language.value == 'Wingdings') {
        modify.style.fontFamily = "Wingdings"
        modify.value = unEmojify(modify.value)
        emojified = false
        modify.placeholder="Output..."
    } else if (language.value == 'Webdings') {
        modify.style.fontFamily = "Webdings"
        modify.value = unEmojify(modify.value)
        emojified = false
        modify.placeholder="Output..."
    } else if (language.value == 'Emoji') {
        modify.style.fontFamily = "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji"
        emojified = true
        modify.value = swapForEmoji(modify.value)
        modify.placeholder="🐙🦄🐯🛶🦄🐯..."
    }
}

function changePurpose() {
    input.removeEventListener('input', outputType);
    password.removeEventListener('input', outputType);
    if (this.value == 'encryption') {
        input.placeholder = "Message to Encrypt..."
        outputType = modifyOutput
        mode = 'encryption'
        changeLanguage()      
    } else {
        input.placeholder = "Message to Decrypt..."
        outputType = modifyOutputDecrypt
        mode = 'decryption'
        changeLanguage()       
    }
    input.addEventListener('input', outputType);
    password.addEventListener('input', outputType);
}

function modifyOutputDecrypt() {
    var encryptedValue = "" 

    if (emojified) {    
        input.value = swapForEmoji(input.value)
        encryptedValue = unEmojify(input.value)
    } else {
        encryptedValue = input.value.toLowerCase()
    }

    encryptedValue = applySettings(encryptedValue)

    encryptedPasswordValue = ''
    var passwordIndex = 0
    var passwordValue = password.value
    if (passwordValue) {
        for (letter of encryptedValue) {
            console.log(letter)
            if (letter.match(/[a-z]/i)) { //gets a valid letter from the password, allows for no alphabetic characters but wont increment
                var increment = passwordValue[passwordIndex]
                console.log('matched')
                while (!increment.match(/[a-z]/i)) {
                    if (passwordIndex != passwordValue.length){
                        passwordIndex++
                    }else {
                        passwordIndex = 0
                    }
                    increment = passwordValue[passwordIndex]
                }
                passwordIndex++
                if (passwordIndex == passwordValue.length) {
                    passwordIndex = 0
                }
                var incrementValue = increment.charCodeAt(0) - 97
                var letterValue = letter.charCodeAt(0) - 97
                var encryptedLetter = letterValue - incrementValue 
                console.log(encryptedLetter)
                if (encryptedLetter < 0) {
                    encryptedLetter += 26
                }
                encryptedPasswordValue += String.fromCharCode(encryptedLetter + 97)
            }else { //adds the punctuation if any
                encryptedPasswordValue += letter
            }
        }       
        output.value = encryptedPasswordValue
    } else { //if no password
        output.value = encryptedValue
    }

    
}

const emojiList = [
    "🍎", // A - Apple  
    "🐻", // B - Bear  
    "🐱", // C - Cat  
    "🐶", // D - Dog  
    "🦅", // E - Eagle  
    "🐸", // F - Frog  
    "🦒", // G - Giraffe  
    "🐴", // H - Horse  
    "🍦", // I - Ice Cream  
    "🧃", // J - Juice Box 
    "🔑", // K - Key  
    "🦁", // L - Lion  
    "🌙", // M - Moon  
    "🌰", // N - Nut  
    "🐙", // O - Octopus  
    "🛶", // P - Paddle (or Pirate Ship)  
    "👑", // Q - Queen's Crown  
    "🤖", // R - Robot  
    "🐍", // S - Snake  
    "🐯", // T - Tiger  
    "🦄", // U - Unicorn  
    "🎻", // V - Violin  
    "🌊", // W - Waves  
    "❌", // X - X Mark  
    "🍋", // Y - Yellow Lemon  
    "🦓"  // Z - Zebra  
];



function applySettings(encryptedValue) {
    if (!spacing) {
        encryptedValue = encryptedValue.replaceAll(" ", "")
    }
    if (!punctuation) {
        encryptedValue = encryptedValue.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    }
    return encryptedValue
}

function modifyOutput() {
    var encryptedValue = input.value.toLowerCase()
    encryptedValue = applySettings(encryptedValue)

    encryptedPasswordValue = ''
    var passwordIndex = 0
    var passwordValue = password.value
    if (passwordValue) {
        for (letter of encryptedValue) {
            if (letter.match(/[a-z]/i)) { //gets a valid letter from the password, allows for no alphabetic characters but wont increment
                var increment = passwordValue[passwordIndex]
                while (!increment.match(/[a-z]/i)) {
                    if (passwordIndex != passwordValue.length){
                        passwordIndex++
                    }else {
                        passwordIndex = 0
                    }
                    increment = passwordValue[passwordIndex]
                }
                passwordIndex++
                if (passwordIndex == passwordValue.length) {
                    passwordIndex = 0
                }
                var incrementValue = increment.charCodeAt(0) - 97
                var letterValue = letter.charCodeAt(0) - 97
                var encryptedLetter = incrementValue + letterValue
                if (encryptedLetter > 26) {
                    encryptedLetter -= 26
                }
                encryptedPasswordValue += String.fromCharCode(encryptedLetter + 97)
            }else { //adds the punctuation if any
                encryptedPasswordValue += letter
            }
        }       
        output.value = encryptedPasswordValue
    } else { //if no password
        output.value = encryptedValue
    }

    if (emojified) {
        output.value = swapForEmoji(output.value)
    }
}

document.getElementById('spacing').addEventListener('change', (event) => {
    if (event.target.checked) {
        spacing = true
    } else {
        spacing = false
    }
    outputType()
})

document.getElementById('punctuation').addEventListener('change', (event) => {
    if (event.target.checked) {
        punctuation = true
    } else {
        punctuation = false
    }
    outputType()
})



function unEmojify(input) {
    var textString = ''
    for (let value of input) {
        if (emojiList.includes(value)) {
            var valuePosition = emojiList.indexOf(value)
            if (valuePosition >= 0 && valuePosition < 26) {
                var textValue = valuePosition + 97
                textString += String.fromCharCode(textValue)
            }     
        } else {
            textString += value
        }
    } 
    return textString
}

function swapForEmoji(input) {
    var emojiString = ''
    for (i = 0; i < input.length; i++) {
        var value = input[i]
        if (value.match(/[a-z]/i)) {
            var valueLower = value.toLowerCase()
            var emojiValue = (valueLower.charCodeAt(0) - 97)
            emojiString += emojiList[emojiValue]
        } else {
            emojiString += value
        }
    }
    return emojiString
}

