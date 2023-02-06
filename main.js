class Room {
    constructor(west, east, north, south, y, x, description, tb, spawnMonster) {
        this.west = west;
        this.east = east;
        this.north = north;
        this.south = south;
        this.x = x;
        this.y = y;
        this.description = description;
        this.discovered = false;
        this.textBox = tb;
        if (spawnMonster == true) {
            this.monster = new Monster(this.textBox);
        } else {
            this.monster = null;
        }
    }

    discover() {
        let cell = document.getElementById(String(this.x) + " " + String(this.y));
        cell.style.backgroundColor = "wheat";
        this.discovered = true;
        this.highlightDoors()
    }

    describe() {
        console.log(this.description);
        this.textBox.write(this.description);
        if (this.north) {
            this.textBox.write("There is a door to the north.");
        }
        if (this.east) {
            this.textBox.write("There is a door to the east.");
        }
        if (this.south) {
            this.textBox.write("There is a door to the south.");
        }
        if (this.west) {
            this.textBox.write("There is a door to the west.");
        }
        if (this.monster != null) {
            this.textBox.write("You see a " + this.monster.description + " here!")
        }
    }

    highlightPlayer() {
        let cell = document.getElementById(String(this.x) + " " + String(this.y));
        let img = document.createElement("img");
        img.src = "3-2.png";
        img.alt = "image";
        img.id = "image" + String(this.x) + String(this.y);
        img.style.display = "block"
        img.style.margin = "0 auto"
        cell.appendChild(img);
    }

    lowlightPlayer() {
        let cell = document.getElementById(String(this.x) + " " + String(this.y));
        let img = document.getElementById("image" + String(this.x) + String(this.y));
        cell.removeChild(img);
    }

    highlightDoors() {
        let cell = document.getElementById(String(this.x) + " " + String(this.y));
        if (this.north) {
            let img = document.createElement("img");
            img.src = "Doors/NorthDoor.png";
            img.alt - "north facing door";
            img.id = "NorthDoor_" + String(this.x) + String(this.y);
            img.style.position = "absolute";
            img.style.top = "0"
            cell.appendChild(img);
        }
        if (this.east) {
            let img = document.createElement("img");
            img.src = "Doors/EastDoor.png";
            img.alt - "east facing door";
            img.id = "EastDoor_" + String(this.x) + String(this.y);
            img.style.position = "absolute";
            img.style.right = "0"
            cell.appendChild(img);
        }
        if (this.south) {
            let img = document.createElement("img");
            img.src = "Doors/SouthDoor.png";
            img.alt - "south facing door";
            img.id = "SouthDoor_" + String(this.x) + String(this.y);
            img.style.position = "absolute";
            img.style.bottom = "0"
            cell.appendChild(img);
        }
        if (this.west) {
            let img = document.createElement("img");
            img.src = "Doors/WestDoor.png";
            img.alt - "west facing door";
            img.id = "WestDoor_" + String(this.x) + String(this.y);
            img.style.position = "absolute";
            img.style.left = "0"
            cell.appendChild(img);
        }

    }
}

class Player {
    constructor(name, hp, mp, gp, ap, tb) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.gp = gp;
        this.textBox = tb;
        this.ap = ap;
        this.floorMap = null;
        this.currRoom = null;
    }

    process(str) {
        let input = str.toLowerCase();
        if (input == "north") {
            this.moveNorth();
        } else if (input == "east") {
            this.moveEast();
        } else if (input == "south") {
            this.moveSouth();
        } else if (input == "west") {
            this.moveWest();
        } else if (input == "attack") {
            this.attack();
        } else {
            this.textBox.write("Input not recognized.")
        }
    }



    attack() {
        if (this.currRoom == null) {
            return;
        }

        if (this.currRoom.monster == null) {
            this.textBox.write("Nothing to attack.")
        } else {
            this.textBox.write("You attack the monster for " + this.ap + " damage!");
            if (this.currRoom.monster.takeDamage(this.ap) == 1) {
                this.currRoom.monster = null;
            } else {
                this.monsterAttack();
            }
        }

    }

    takeDamage(dmg) {
        this.textBox.write("You take " + dmg + " damage.");
        this.hp -= dmg;
        if (this.hp < 0) {
            // DIE
        }
    }

    monsterAttack() {
        this.textBox.write("The " + this.currRoom.monster.description + " attacks you!");
        this.takeDamage(this.currRoom.monster.ap);
    }

    moveWest() {
        if (this.currRoom.west) {
            this.currRoom.lowlightPlayer()
            this.currRoom = this.floorMap[this.currRoom.y][this.currRoom.x - 1];
            if (this.currRoom.discovered == false) {
                this.currRoom.discover();
            }
            this.currRoom.highlightPlayer()
            this.currRoom.describe();

        } else {
            this.textBox.write("No door here.")
        }
        console.log(this.currRoom);
    }
    moveEast() {
        if (this.currRoom.east) {
            this.currRoom.lowlightPlayer()
            this.currRoom = this.floorMap[this.currRoom.y][this.currRoom.x + 1];
            if (this.currRoom.discovered == false) {
                this.currRoom.discover();
            }
            this.currRoom.highlightPlayer()
            this.currRoom.describe();
        } else {
            this.textBox.write("No door here.")
        }
    }
    moveNorth() {
        if (this.currRoom.north) {
            this.currRoom.lowlightPlayer()
            this.currRoom = this.floorMap[this.currRoom.y - 1][this.currRoom.x];
            if (this.currRoom.discovered == false) {
                this.currRoom.discover();
            }
            this.currRoom.highlightPlayer()
            this.currRoom.describe();
        } else {
            this.textBox.write("No door here.")
        }
    }
    moveSouth() {
        if (this.currRoom.south) {
            this.currRoom.lowlightPlayer()
            this.currRoom = this.floorMap[this.currRoom.y + 1][this.currRoom.x];
            if (this.currRoom.discovered == false) {
                this.currRoom.discover();
            }
            this.currRoom.highlightPlayer()
            this.currRoom.describe();
        } else {
            this.textBox.write("No door here.")
        }
    }

}

class Monster {
    constructor(tb) {
        this.hp = 10;
        this.ap = 1;
        this.mp = 10;
        this.description = "monster";
        this.textBox = tb;
    }

    takeDamage(dmg) {
        this.textBox.write("The monster takes " + dmg + " damage.")
        this.hp -= dmg;
        if (this.hp < 0) {
            this.textBox.write("The monster dies!");
            return 1;
        } else {
            this.textBox.write("The monster has " + this.hp + " hp remaining");
            return 0;
        }
    }

}

class Floor {
    constructor(numRooms, tb) { 
        let vh = window.innerHeight;
        let vw = window.innerWidth;
        console.log(vh, vw)
        var sideLength = Math.ceil(Math.sqrt(numRooms * 4));
        let gameBoard = document.getElementById("gameBoard")
        
        gameBoard.style.gridTemplateColumns = 'repeat('+ sideLength +', 1fr)';
        var floorMap = [];
        let subDiv;
        for (let i = 0; i < sideLength; i++) {
            floorMap[i] = [];
            subDiv = document.createElement("div");
            gameBoard.appendChild(subDiv);
            for (let j = 0; j < sideLength; j++) {
              floorMap[i][j] = null;
              let cell = document.createElement("div");
              cell.className = "cell"
              cell.id = String(i) + " " + String(j)
              cell.style.height = String(100/sideLength) + "%";
              cell.style.width = String(100) + "%";
              subDiv.appendChild(cell);
            }
        }
        
        let startingCoord = Math.ceil(sideLength/2) - 1;
        let home = new Room(false, false, false, false, startingCoord, startingCoord, "Home", tb, false);
        floorMap[startingCoord][startingCoord] = home;
        let currRoom = home;
        let currY = startingCoord;
        let currX = startingCoord;
        // console.log(home.x, home.y);
        for (let i = 0; i < numRooms -1; i++) {
            // console.log("Added floor #", i, ":", currY, currX);
            var roomAdded = false;
            while (!roomAdded) {
                var direction = Math.floor(Math.random() * 4);
                // console.log(currY, currX, direction);
                if (direction == 0) { // add to west
                    if (currX == 0) {
                        // DO NOTHING
                    } else if (floorMap[currY][currX - 1] != null) {;
                        currRoom.west = true;
                        currRoom = floorMap[currY][currX - 1];
                        currRoom.east = true;
                        currX--;
                    } else {
                        let newRoom = new Room(false, true, false, false, currY, currX - 1, "A regular room", tb, true);
                        floorMap[currY][currX - 1] = newRoom;
                        currRoom.west = true;
                        currRoom = newRoom;
                        currX--;
                        roomAdded = true;
                    }
                } else if (direction == 1) { // add to east
                    if (currX == sideLength - 1) {
                        // DO NOTHING
                    } else if (floorMap[currY][currX + 1] != null) {
                        currRoom.east = true;
                        currRoom = floorMap[currY][currX + 1];
                        currRoom.west = true;
                        currX++;
                    } else {
                        let newRoom = new Room(true, false, false, false, currY, currX + 1, "A regular room", tb, true);
                        floorMap[currY][currX + 1] = newRoom;
                        currRoom.east = true;
                        currRoom = newRoom;
                        currX++;
                        roomAdded = true;
                    }
                } else if (direction == 2) { // add to north
                    if (currY == 0) {
                        // DO NOTHING
                    } else if (floorMap[currY - 1][currX] != null) {
                        currRoom.north = true;
                        currRoom = floorMap[currY - 1][currX];
                        currRoom.south = true;
                        currY--;
                    } else {
                        let newRoom = new Room(false, false, false, true, currY - 1, currX, "A regular room", tb, true);
                        floorMap[currY - 1][currX] = newRoom;
                        currRoom.north = true;
                        currRoom = newRoom;
                        currY--;
                        roomAdded = true;
                    }
                } else if (direction == 3) { // add to south
                    if (currY == sideLength - 1) {
                        // DO NOTHING
                    } else if (floorMap[currY + 1][currX] != null) {
                        currRoom.south = true;
                        currRoom = floorMap[currY + 1][currX];
                        currRoom.north = true;
                        currY++;
                    } else {
                        let newRoom = new Room(false, false, true, false, currY + 1, currX, "A regular room", tb, true);
                        floorMap[currY + 1][currX] = newRoom;
                        currRoom.south = true;
                        currRoom = newRoom;
                        roomAdded = true;
                        currY++;
                    }
                }
            }
        }
        this.textBox = tb;
        this.home = home;
        this.currentRoom = home;
        this.currY = currY;
        this.currX = currX;
        this.floorMap = floorMap;
    }
}

class GameBoard{
    constructor(player, floor) {
        this.player = player;
        this.floor = floor;
    }

    
}

class TextBox {
    constructor() {
        this.numLines = 0;
        this.maxLines = 14;
        this.box = document.getElementById("displayBox");
        this.lines = [];
        for (let i = 0; i < this.maxLines; i++) {
            let line = document.createElement("div");
            line.className = "textLine";
            line.id = "textLine_" + String((this.maxLines - 1) - i);
            this.box.appendChild(line);
            this.lines.unshift(line);
        }
    }

    write(str) {
        let currLine;
        let storeLineOne = "> " + str;
        let storeLineTwo;
        
        for (let i = 0; i <= this.numLines; i++) {
            currLine = this.lines[i];
            storeLineTwo = currLine.innerHTML;
            this.lines[i].innerHTML = storeLineOne;
            storeLineOne = storeLineTwo;
        }
        if (this.numLines < this.maxLines - 1) {
            this.numLines++;
        } 
    }
}


function setupGame(numFloors) {
    let inputText = document.getElementById("textBox");
    let tb = new TextBox();
    var floor = new Floor(numFloors, tb);
    var player = new Player("Player", 200, 10, 0, 3, tb);
    player.currRoom = floor.currentRoom
    player.floorMap = floor.floorMap;
    inputText.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            let input = inputText.value;
            if (input.length > 80) {
                this.textBox.write("Input too long.");
            } else {
                tb.write(input);
                player.process(input);
                document.getElementById("textBox").value = '';
                console.log(input);
            }   
        }
    });
    console.log(floor.floorMap);
    floor.home.describe();
    floor.home.discover();
    floor.home.highlightPlayer();
    console.log("done");
}


function main() {
    buttonHolder = document.getElementById("buttonHolder");
    button = document.getElementById("button");
    buttonHolder.removeChild(button);
    setupGame(10)
}