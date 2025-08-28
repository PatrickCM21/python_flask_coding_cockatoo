from flask import Flask, render_template, request, redirect, jsonify, make_response
from openai import OpenAI
from string import Template
import os
from dotenv import load_dotenv
import re
import json
import requests
import pandas as pd
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)

convo_history = []

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.abspath("ghostNotes.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String)

with app.app_context():
    print("Creating Tables...")
    db.create_all()

if __name__ == '__main__':
    app.run()

#HOME
guests = 4
@app.route("/")
def landing():
 return redirect("/home")

@app.route("/home")
def home():
    title="Home"
    return render_template("index.html", title=title)

#SECTION FOR AI DINNER
@app.route("/dinner")
def AIDinner():       
    convo_history.clear()
    title = 'Dinner Time!'
    return render_template("AIDinner.html", guests=guests, title=title)

@app.route("/dinner_start", methods=["POST"])
def dinner_start():
    req = request.get_json()
    topic = req["topic"]
    mood = req["mood"]
    guests = req["guests"]
    context = req["context"]
    global userName
    userName = req["user"]
    people = []
    for i in range(1, int(guests) + 1):
        id = "guest" + str(i)
        people.append(req[id])
    print(topic, mood, people, context)
    prompt = make_prompt(topic, mood, people, context, guests)
    response = user_chat(prompt)

    broken_down_response = read_gpt(response)
    
    sendable_response = make_response(broken_down_response, 200)
    return sendable_response

@app.route("/dinner_response", methods=["POST"])
def dinner_response():
    req = request.get_json()
    user_response = req["user_response"]
    print(user_response)
    response = user_chat(user_response)

    #This is where I split up the response data
    broken_down_response = read_gpt(response)
    
    sendable_response = make_response(broken_down_response, 200)
    return sendable_response

def make_prompt(topic, mood, people, context, guestn):
    prompt = Template(str(os.getenv('PROMPT')))
    new_prompt = prompt.safe_substitute(topic=topic, mood=mood, context=context, user=userName, guestn=guestn) 
    counter = 0
    for person in people:
        counter +=1
        if counter != len(people):
            person = person + ", " 
        new_prompt = new_prompt + person
    return new_prompt

client = OpenAI(api_key=os.getenv('API_KEY'))

def user_chat(prompt):
    response = client.chat.completions.create(
    model="gpt-4o-mini",
    store=True,
    messages=[
        {"role": "system", "content": prompt}
    ] + convo_history
    ) 
    convo_history.append({"role": "system", "content": prompt})
    convo_history.append({"role": "assistant", "content": response.choices[0].message.content})
    return response.choices[0].message.content.strip()

def find_profile(person):
    payload = {
        'key': os.getenv('SEARCH_API'),
        'q': person,
        'cx': os.getenv('SEARCH_ID'),
        'start': 1,
        'num': 1,
        'searchType': "image"
    }

    response = requests.get('https://customsearch.googleapis.com/customsearch/v1', payload)
    if response.status_code !=200:
        raise Exception('Request failed')
    result = response.json().get("items")
    return result[0]["link"]

def read_gpt(response):
    try:
        context = re.search('AAA(.*)AAA', response).group(1)
    except AttributeError:
        context = ''

    try:
        dialogue = re.findall('ZZZ(.*)ZZZ', response)
    except AttributeError:
        dialogue = ''

    speaker = []
    for i in range(0, len(dialogue)):
      index = dialogue[i].index(":")
      speaker.append(dialogue[i][:index])

    response_images = {}
    for i in range(0, len(speaker)):
        print(speaker[i])
        print(userName)
        if speaker[i] not in response_images:
            if speaker[i].strip() != userName.strip():
                response_images[speaker[i]] = find_profile(speaker[i])
            else:
                response_images[speaker[i]] = ''

    response = jsonify({"context": context, "dialogue": dialogue, "speaker": speaker, "images": response_images})
    return response
    

#SECTION FOR FUNDING TRACKER - UNUSED ATM

@app.route("/funding_tracker")
def funding_tracker():
    title="School Funding Tracker"
    return render_template("fundingtracker.html", MAPS_API = os.getenv('MAPS_API_KEY'), title=title)

@app.route("/funding_tracker/markers", methods=["POST"])
def funding_tracker_markers():
    try:
        with open('static/files/CompleteNSWSchoolProfiles.json', 'r') as file:
            data = json.load(file)
        return make_response(data, 200)
    except FileNotFoundError:
        return make_response("File not found", 404)
    except json.JSONDecodeError:
        return make_response("error reading JSON", 400)


#SECTION FOR PHILOSOPHY MBTI
@app.route("/philosophy_mbti")
def philosophy_mbti():
    title="Philosophy MBTI Quiz"
    try:
        with open('static/files/philosopherquestions.json', 'r') as file:
            questions = json.load(file)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")

    try:
        with open('static/files/philosopherWinningText.json', 'r') as file2:
            winnings = json.load(file2)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")
        
    return render_template("philosophymbti.html", questionscount = len(questions), questions=questions, title=title, winnings=winnings, record=False)

@app.route("/philosophy_mbti_society")
def philosophy_mbti_society():
    title="Philosophy Society MBTI Quiz"
    try:
        with open('static/files/philosopherquestions.json', 'r') as file:
            questions = json.load(file)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")

    try:
        with open('static/files/philosopherWinningText.json', 'r') as file2:
            winnings = json.load(file2)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")
        
    return render_template("philosophymbtisociety.html", questionscount = len(questions), questions=questions, title=title, winnings=winnings, record=True)


@app.route("/philosophy_religion_quiz")
def philosophy_religion_quiz():
    title="Philosophy Society MBTI Quiz"
    try:
        with open('static/files/religiousPhilosophyQuestions.json', 'r') as file:
            questions = json.load(file)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")

    try:
        with open('static/files/religionWinningText.json', 'r') as file2:
            winnings = json.load(file2)
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")
        
    return render_template("philosophyreligionquiz.html", questionscount = len(questions), questions=questions, title=title, winnings=winnings, record=True)

@app.route("/update_mbti", methods=["POST"])
def update_mbti():
    req = request.get_json()
    philosopher = req["winner"]
    roundtable = req["roundtable"]
    try:
        with open('static/files/mbti_results.json', 'r') as file:
            results = json.load(file)
            file.close()
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")
    print(results)
    results[0][philosopher] += 1
    results[1][roundtable] += 1

    try:
        with open('static/files/mbti_results.json', 'w+') as file:
            file.write(json.dumps(results))
            file.close()
    except FileNotFoundError:
        print("ERROR: no file found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read")

    return make_response("", 200)

# How Many Page

@app.route("/how_many")
def how_many():
    title = "How Many?"
    try:
        with open('static/files/howManyItems.json', 'r') as file:
            items = json.load(file)
            file.close
    except FileNotFoundError:
        print("ERROR: How Many file could not be found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read for How Many")
    return render_template("howmany.html", title=title, items=items)

# Anagram Page

@app.route("/alright_anagrams")
def anagrams():
    title="Actually Alright Anagrams"
    try:
        df = pd.read_excel('static/files/wordFrequency.xlsx')
        df = df.fillna("")
        dictionary = df.to_dict(orient='records')
    except FileNotFoundError:
        print('CSV File Could Not Be Found - Anagrams')
    return render_template('anagrammaker.html', title=title, dictionary=dictionary)

# Cockatoo Clicker Page

@app.route('/cockatoo_clicker')
def cockatoo_clicker():
    title = 'Cockatoo Clicker'
    try:
        with open('static/files/clickerUpgrades.json', 'r') as file:
            upgrades = json.load(file)
            file.close()
    except FileNotFoundError:
        print("ERROR: Upgrades file could not be found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read upgrades file")

    try:
        with open('static/files/cockatooQuotes.json', 'r') as file:
            quotes = json.load(file)
            file.close()
    except FileNotFoundError:
        print("ERROR: Quotes file could not be found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read quotes file")

    return render_template('cockatooclicker.html', title=title, upgrades=upgrades, quotes=quotes)


# CALORIE GUESSER- DON'T INCLUDE, IT KINDA SUCKS

@app.route("/calorie_guesser")
def calorie_guesser():
    title="Calorie Guesser"
    return render_template('calorieguesser.html', title=title)

@app.route('/get_question', methods=["POST"])
def get_question():
    req = request.get_json()
    questionType = req["Question"]
    questionNumber = req["QuestionNumber"]
    measurement = req["Measurement"]
    try:
        with open('static/files/calorieQuestions.json', 'r') as file:
            questions = json.load(file)
            file.close
    except FileNotFoundError:
        print("ERROR: Questions file could not be found")
    except json.JSONDecodeError:
        print("ERROR: JSON could not be read for questions")

    question = questions[questionType][questionNumber]
    if questionType == 'Compare':
        return render_template('compareQuestion.html', measurement=measurement, img1=question["Img1"], img2=question["Img2"], measure1=question["Calories1"], measure2=question["Calories2"], food1=question["Food1"], food2=question["Food2"])
    elif questionType == 'GuessCalories':
        return render_template('guesscalories.html', measurement=measurement, measure=question["Calories"], food=question["Food"], img=question["Img"]) 
    
# GHOST NOTES - ANANOYMOUS MESSAGE BOARD
@app.route('/ghost_notes')
def ghostNotes():
    title = "Ghost Notes"
    return render_template("ghostnotes.html", title=title, welcome=render_template('ghostwelcome.html'))

@app.route('/ghost_welcome', methods=["POST"])
def ghostWelcome():
    return render_template("ghostwelcome.html")

@app.route('/submit_note', methods=["POST"])
def submitMessage():
    req = request.get_json()
    userMessage = req["Message"]
    randomMessage = getMessage()
    insertMessage(userMessage)

    return render_template('ghostmessage.html', message=randomMessage)

@app.route('/ghost_message', methods=["POST"])
def ghostMessage():
    return render_template('ghostmessage.html')

def insertMessage(userMessage):
    with app.app_context():
        new_message = Message(message=userMessage)
        db.session.add(new_message)
        db.session.commit()
        print("Message Successfully Added!")

def getMessage():
    with app.app_context():
        randMessage = Message.query.order_by(db.func.random()).first()
        if randMessage:
            db.session.delete(randMessage)
            db.session.commit()
            print("Found random message")
            return randMessage.message
        else:
            print("No messages in database")

# STEAM HIDDEN GEMS
@app.route("/steam_gems")
def SteamGems():
    title = "Steam Hidden Gems"
    
    return render_template("steamgems.html", title=title)

@app.route("/check_id", methods=["POST"])
def checkID():
    req = request.get_json()
    steamAPI = os.getenv('STEAM_API')
    id = req["SteamID"]
    response = requests.get(f'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={steamAPI}&steamid={id}&format=json&include_appinfo=true')
    if response.status_code == 200:
        userData=response.json()
        userGames = userData["response"]["games"]
        unplayedGames = []
        for game in userGames:
            if (game["playtime_forever"] / 60) < 10:
                unplayedGames.append(game["name"])

        igdbID = os.getenv('IGDB_ID')
        igdbSecret = os.getenv('IGDB_SECRET')

        try:
            authURL = f'https://id.twitch.tv/oauth2/token?client_id={igdbID}&client_secret={igdbSecret}&grant_type=client_credentials'
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")

        authToken = requests.post(authURL)
        accessToken = authToken.json()
        unplayedGamesQuery = " | ".join([f'name = "{games}"' for games in unplayedGames])
        req_url = 'https://api.igdb.com/v4/games'
        req_headers = {
            "Client-ID": igdbID,
            "Authorization": f"Bearer {accessToken["access_token"]}",
            "Content-Type": "application/json"
        }
        query = f"""
            fields name, cover.image_id, rating;
            where ({unplayedGamesQuery}) & rating_count > 10 & rating > 80;
            sort rating desc;
            limit 69;
        """
        igdbResponse = requests.post(req_url, headers=req_headers, data=query)
        gamesList = igdbResponse.json()
        for game in gamesList:
            if game.get('cover') is None:
                game['cover'] = {}

        return make_response(render_template("steamgemsoutput.html", userData = gamesList), 200)
    else:
        print("Error occurred", response.status_code)
        return make_response("Error occurred", response.status_code)


@app.route("/find_games", methods=["POST"])
def findGames():
    req = request.get_json()

# CIPHER MAKER

@app.route('/cipher_maker')
def cipherMaker():
    title="Cipher Maker"
    return render_template('ciphermaker.html', title=title)

# COMP 1511 SHADOW ASSISTANT

@app.route('/comp1511_shadows')
def comp1511Shadows():
    title="COMP1511 Shadows"
    return render_template('comp1511ass1shadows.html', title=title)