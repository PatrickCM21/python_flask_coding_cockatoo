document.getElementById('anagramSearch').addEventListener('submit', findAnagrams);
const list = document.getElementById('anagramList')
const chosenList = document.getElementById('chosenWords')
const letters = document.getElementById('letters')

function findAnagrams() {
    event.preventDefault();
    toAnagram = document.getElementById('word').value
    toAnagram = toAnagram.replaceAll(" ", "")
    toAnagram = toAnagram.toLowerCase()
    chosenList.innerText = ''
    searchDictionary();
    updateLetters();
}

function searchDictionary() {
    list.innerText=''
    for (let i = 0; i < dictionary.length; i++) {
        const word = String(dictionary[i]["word"])
        if (checkLetters(word, toAnagram)) {
            const wordDiv = document.createElement('button') 
            wordDiv.classList.add('row', 'btn', 'btn-outline-primary', 'mb-2', 'me-3')
            wordDiv.innerText=word
            wordDiv.addEventListener('click', addWord);
            list.appendChild(wordDiv)
        }  
    }
}

function updateLetters() {
    if (toAnagram) {
        letters.innerText = toAnagram[0]
        for (let i = 1; i < toAnagram.length; i++) {
            letters.innerText += `, ${toAnagram[i]}`
        }
    }else {
        letters.innerText = 'Your anagram is finished, congratulations!'
    }
    
    
}

function addWord(event) {
    const clickedWord = event.target
    const wordDiv = document.createElement('button') 
    wordDiv.classList.add('row', 'btn', 'btn-success', 'mb-1', 'mb-2', 'me-3')
    wordDiv.innerText=clickedWord.innerText
    wordDiv.addEventListener('click', removeWord)
    toAnagram = removeLetters(wordDiv.innerText)
    searchDictionary()
    chosenList.appendChild(wordDiv)
    updateLetters();
}

function removeWord(event) {
    const clickedWord = event.target
    toAnagram = toAnagram + clickedWord.innerText
    clickedWord.remove()
    searchDictionary()
    updateLetters();
}

function removeLetters(letters) {
    let removalCount = {}
    for (let char of letters) {
        removalCount[char] = (removalCount[char] || 0) + 1
    }
    let result = ""
    for (let char of toAnagram) {
        if (removalCount[char]) {
            removalCount[char] --;
        } else {
            result += char
        }
    }
    return result
}

function checkLetters(word, toAnagram) {
    word.type
    if ((word === '') || (word.includes('-'))) {
        return false
    }
    let anagramCount = {}
    for (let char of toAnagram) {
        anagramCount[char] = (anagramCount[char] || 0) + 1
    }

    let wordCount = {}
    for (let char of word) {
        wordCount[char] = (wordCount[char] || 0) + 1
    }
    return Object.keys(wordCount).every(char => (((anagramCount[char] || 0) >= wordCount[char]) || (wordCount[char] === "'")));
}