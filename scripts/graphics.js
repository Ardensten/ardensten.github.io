let playerPosition = 0;
var currentPoints = 0;
var currentLives = 3;

var meow = new Audio('audio/meow.mp3');
var zombieScream = new Audio('audio/zombie.mp3');
var deathNoise = new Audio('audio/deathnoise.mp3');
var success = new Audio('audio/success.mp3');

const graphics = document.getElementById("graphics");
const description = document.getElementById("description");
const overlay = document.getElementById("overlay");
const points = document.getElementById("points");
const lives = document.getElementById("lives");
const map = document.getElementById(String(playerPosition));
const mapIDs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

// ----------------------Skapar platserna----------------------------

function MakeFrame(row, col, frameNumber, imageURL) {
    this.row = row;
    this.col = col;
    this.frameNumber = frameNumber;
    this.imageURL = imageURL;
}

const frames = [];

const imageUrls = [
    'images/1A.jpg',
    'images/1B.jpg',
    'images/1C.jpg',
    'images/1D.jpg',
    'images/1E.jpg',
    'images/2A.jpg',
    'images/2B.jpg',
    'images/2C.jpg',
    'images/2D.jpg',
    'images/2E.jpg',
    'images/3A.jpg',
    'images/3B.jpg',
    'images/3C.jpg',
    'images/3D.jpg',
    'images/3E.jpg',
    'images/4A.jpg',
    'images/4B.jpg',
    'images/4C.jpg',
    'images/4D.jpg',
    'images/4E.jpg',
    'images/5A.jpg',
    'images/5B.jpg',
    'images/5C.jpg',
    'images/5D.jpg',
    'images/5E.jpg',
];

let frameCounter = 0;
for (let rows = 1; rows < 6; rows++) {
    for (let cols = 1; cols < 6; cols++) {
        const frameNumber = frameCounter + 1;
        const row = rows;
        const col = cols;
        const imageUrl = imageUrls[frameCounter];
        const frame = new MakeFrame(row, col, frameNumber, imageUrl);
        frames.push(frame);
        frameCounter++;
    }
}

const imageElement = document.createElement('img');
imageElement.src = frames[playerPosition].imageURL;
graphics.appendChild(imageElement);

//---------------- skapar katter ---------------------------

const cats = [];

const catImageURLS = [
    'images/cat1.png',
    'images/cat2.png',
    'images/cat3.png',
    'images/cat4.png',
    'images/cat5.png',
];

function MakeCat(position, catImageURL) {
    this.position = position;
    this.catImageURL = catImageURL
}

let catCounter = 0;
for (let i = 1; i < 6; i++) {
    const position = Math.floor(Math.random() * 26);
    const catImageURL = catImageURLS[catCounter];
    const cat = new MakeCat(position, catImageURL);
    cats.push(cat);
    catCounter++;
}

//---------------- skapa zombies-------------------------------------

const zombies = [];

const zombieImageURLS = [
    'images/zombie1.png',
    'images/zombie2.png',
    'images/zombie3.png',
];

function MakeZombie(position, zombieImageURL) {
    this.position = position;
    this.zombieImageURL = zombieImageURL
}

let zombieCounter = 0;
for (let i = 1; i < 4; i++) {
    const position = Math.floor(Math.random() * 26);
    const zombieImageURL = zombieImageURLS[zombieCounter];
    const zombie = new MakeZombie(position, zombieImageURL);
    zombies.push(zombie);
    zombieCounter++;
}

//-------------------------------------------------------------------

let catImgElements = [];
let foundCats = [];

let zombieImgElements = [];

function UpdateGame() {
    description.innerHTML = "";

    APIcall();
    
    imageElement.src = frames[playerPosition].imageURL;

    mapIDs.forEach(function(mapID) {
        const element = document.getElementById(mapID);
        
        if (element) {
            element.innerHTML = '';
        }
    });

    const map = document.getElementById(String(playerPosition));

    let mapElement = document.createElement("p");
    mapElement.innerHTML = "♟";

    map.appendChild(mapElement);

    cats.forEach(function (cat, index) {
        if (cat.position === frames[playerPosition].frameNumber && !foundCats.includes(cat)) {
            if (!catImgElements[index]) {
                catImgElements[index] = document.createElement('img');
                catImgElements[index].src = cat.catImageURL;
                overlay.appendChild(catImgElements[index]);
                meow.play();
                currentPoints++;
                pointsElement.innerHTML = currentPoints + "/5 cats found";
                foundCats.push(cat);
            }
        } else {
            if (catImgElements[index]) {
                overlay.removeChild(catImgElements[index]);
                catImgElements[index] = undefined;
            }
        }
    });

    zombies.forEach(function (zombie, index) {
        if (zombie.position === frames[playerPosition].frameNumber) {
            if (!zombieImgElements[index]) {
                zombieImgElements[index] = document.createElement('img');
                zombieImgElements[index].src = zombie.zombieImageURL;
                overlay.appendChild(zombieImgElements[index]);
                zombieScream.play();
                currentLives--;
                lifeElement.innerHTML = "♥".repeat(currentLives);
            }
        } else {
            if (zombieImgElements[index]) {
                overlay.removeChild(zombieImgElements[index]);
                zombieImgElements[index] = undefined;
            }
        }
    });

    if (currentLives < 1) {
        deathNoise.play();
        alert("You died!")
    }

    if (currentPoints > 4) {
        success.play();
        alert("You found all the cats!")
    }
}

//----------------- GUI --------------------------

let pointsElement = document.createElement("p");
pointsElement.innerHTML = currentPoints + "/5 cats found";
points.appendChild(pointsElement);

let lifeElement = document.createElement("p");
lifeElement.innerHTML = "♥".repeat(currentLives);
lives.appendChild(lifeElement);

let mapElement = document.createElement("p");
mapElement.innerHTML = "♟";
map.appendChild(mapElement);



//---------------- Spelets kontroller -----------------------

function North() {
    playerPosition = playerPosition - 5;
    UpdateGame();
}

function East() {
    playerPosition++;
    UpdateGame();
}

function South() {
    playerPosition = playerPosition + 5;
    UpdateGame();
}

function West() {
    playerPosition--;
    UpdateGame();
}


// --------------------------- API ------------------------

function APIcall(){
var category = 'fear';
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
    headers: { 'X-Api-Key': 'qMTXBuXRUnCy9YB08GUAgA==wYXpJGE4VUF5uj07'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result); 
        
        let descriptionElement = document.createElement("p");
        descriptionElement.innerHTML = result[0].quote;
        description.appendChild(descriptionElement);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
}