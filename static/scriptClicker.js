const clicker = document.getElementById('clicker')
const counter = document.getElementById('counter')
const infoBox = document.getElementById('infoBox')
document.body.style.overflowX="hidden"

let sndUpgrade = new Audio("static/UpgradeSoundEffect.wav")
let sndBuilding = new Audio('static/BuildingSoundEffect.wav')

let cockatoos = 0;
let cockatooImage = 'url("/static/images/flyingcockatoo.png")'
let clickRate = 1;
let passive={}
for (i = 0; i<upgrades.length; i++) {
    if (upgrades[i]["Type"]) {
        passive[upgrades[i]["Name"]] = {
            "Count": 0,
            "Image": null
        }
    }
    console.log(passive)
}


setInterval(updateCount, 100);

setInterval(calculatePassive, 1000);

function calculatePassive() {
    for (var key in passive) {
        cockatoos += Number(passive[key]["Count"]);
    }
}

clicker.addEventListener('click', buttonClick)
function buttonClick() {
    cockatoos += clickRate
    if (Math.floor(Math.random() * 100) === 69) {
        setInfo()
    }
    updateCount()
    for (i = 0; i < Math.floor(clickRate); i++) {
        createCockatoo()
    }
    
}

function updateCount() {
    counter.innerText = cockatoos.toLocaleString()
    upgradeCheck()
}

function upgradeCheck() {
    for (i = 0; i < upgrades.length; i++) {
        if ((upgrades[i]["Visible"] === false) && (cockatoos >= upgrades[i]["ShowValue"])) {
            upgrades[i]["Visible"] = true;
            
            createUpgrade(upgrades[i], upgrades[i]["hd"], upgrades[i]["vd"])
        }
    }
}

function createUpgrade(upgrade, hd, vd) {
    const item = document.createElement('div');
    item.classList.add('col-md-auto', 'upgrade', 'me-1', 'mb-1')
    item.style.width="76px"
    item.style.height="76px"
    item.style.backgroundImage=upgrade["Img"]
    item.style.backgroundColor='Gray';
    item.style.border="solid black"
    item.style.backgroundRepeat ="no-repeat"
    item.style.backgroundSize=`${hd}px ${vd}px`      
    item.style.backgroundPosition = "center"; 
    //set image for upgrade
    
    let location = document.getElementById('upgrades')  
    item.addEventListener('mouseover', () => showInfo(item, upgrade))
    item.addEventListener('mouseout', () => {
        setInfo();
    })
    item.addEventListener('click', ()=> purchase(upgrade, item))
    location.appendChild(item)  
}

function purchase(upgrade, item) {
    if (Math.floor(upgrade["Cost"]) <= cockatoos) {
        cockatoos -= Math.floor(upgrade["Cost"])
        
        // IF IT IS AN UPGRADE
        if (upgrade["Type"] === "Upgrade") {
            
            switch(upgrade["For"]) {
                case "Cage":
                    clicker.style.backgroundImage=upgrade["ImgChange"]
                    clickRate *= upgrade["Increase"]
                    if (upgrade["Name"] === "Golden Cockatoo") {
                        cockatooImage='url("/static/images/flyinggoldencockatoo.png")'
                    }else if (upgrade["Name"] === "Diamond Cockatoo") {
                        cockatooImage='url("/static/images/flyingdiamondcockatoo.png")'
                    }
                    break;
                case "Building":
                    passive[upgrade["Name"]]["Image"] = upgrade["ImgChange"]
                    const buildings = document.querySelectorAll(`.${upgrade["Name"]}`);
                    for (const building of buildings){
                        building.style.backgroundImage=passive[upgrade["Name"]]["Image"]
                    }                       
                    passive[upgrade["Name"]]["Count"] = passive[upgrade["Name"]]["Count"] * upgrade["Increase"]
                    
                    break;
                default:
                    console.log("an error has occurred in upgrades")
                    break;
            }
            item.remove();
            sndUpgrade.play()

        // IF IT IS A BUILDING
        }else if (upgrade["Type"] === "Building") {
            if (Math.random() < 0.5) {
                buildingLocation = document.getElementById('leftBuildings')
            }else {
                buildingLocation = document.getElementById('rightBuildings')
            }
            building = document.createElement('div');
            building.classList.add(upgrade["Name"])
            areaSize = buildingLocation.getBoundingClientRect()
            const left = Math.floor((Math.random() * areaSize.width) + areaSize.left)
            building.style.left=`${left}px`;
            const top = Math.floor((Math.random() * areaSize.height) + areaSize.top)
            building.style.top=`${top}px`;
            building.style.width=`${upgrade['hd']}px`
            building.style.height=`${upgrade['vd']}px`
            building.style.position="absolute"
            if (passive[upgrade["Name"]]["Image"]) {
                building.style.backgroundImage=passive[upgrade["Name"]]["Image"];
            }else {
                building.style.backgroundImage=upgrade["Img"]
            }
            
            building.style.backgroundSize="cover";
            rotation=(Math.random() * 20) - 10;
            building.style.transform=`rotate(${rotation}deg)`

            passive[upgrade["Name"]]["Count"] += upgrade["Increase"];   
            upgrade["Cost"] = upgrade["Cost"] * 1.15  

            buildingLocation.appendChild(building)
            sndBuilding.play()
        }
        
        setInfo();
    }
}

function showInfo(item, upgrade) {
    infoBox.innerHTML=`<em>${upgrade['Description']}</em><br><strong>Cost: ${Math.floor(upgrade['Cost'])} Cockatoo's</strong>`
}

function setInfo() {
    quoteN=Math.floor(Math.random() * 100)    
    infoBox.innerHTML= `<em>${quotes[quoteN]["Phrase"]}</em>`
}

function createCockatoo() {
    clickerLocation= clicker.getBoundingClientRect()
    const bird = document.createElement('div');
    bird.style.width="63px";
    bird.style.height="39px";
    bird.style.backgroundImage=cockatooImage;
    bird.style.backgroundSize="cover";
    bird.style.position="fixed";
    bird.style.pointerEvents="none"
    const left = Math.floor((Math.random() * clickerLocation.width) + clickerLocation.left)
    bird.style.left=`${left}px`;
    const top = Math.floor((Math.random() * clickerLocation.height) + clickerLocation.top)
    bird.style.top=`${top}px`;
    rotation = Math.floor(Math.random() * 360);
    let transformValue = `rotate(${rotation}deg)`;
    if (rotation > 180) {
        transformValue +="scaleY(-1)"
    }
    bird.style.transform=transformValue;
    
    document.body.appendChild(bird)
    bird.style.transition='transform 3s linear';
    setTimeout(() => {
        const screenWidth = window.innerWidth;
       
        bird.style.transform+=`translateX(${screenWidth}px)`;
    }, 50)
    

    setTimeout(removeBird, 3100)

    function removeBird() {
        bird.remove()
    }
}
