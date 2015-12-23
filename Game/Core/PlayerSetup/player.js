var player = function(socket) {

	this.name = '';
	this.description = 'You see nothing special about them';
  this.age = 18;
  this.information = {
    level: 1,
    race: '',
    class: '',
    alignment: '',
    alignmentScore: 0,
    experience: 0,
    experienceToNextLevel: 0,
    maxHitpoints:0,
    hitpoints:0,
    maxMana: 0,
    mana:0,
      stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }
  };
	this.location = {
    region: "",
    area: "",
    areaID: 0,
    coordsY: 0,
    coordsX: 0
  };
 this.password = '';
 this.inventory = {};
 this.equipment = {};
 this.explored = 0;
 this.questPoints = 0;
 this.gold = 0;
 this.silver = 0;
 this.copper = 0;

//Get
 this.getName = function () { return this.name; };
 this.getDescription = function () { return this.description; };
 this.getLocation = function () { return this.location; };
 this.getInformation = function () { return this.information; };
 self.getSocket = function () { return socket; };

//Set
this.setDescription = function (description) { this.description = description; };

}
