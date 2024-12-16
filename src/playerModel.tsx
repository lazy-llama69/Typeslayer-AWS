export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion';
    effect?: string;  // for items like potions, this could describe the effect (e.g., 'restore health')
  }
  
  export interface Player {
    id: string;            // Unique identifier for the player (could be userId from Cognito)
    username: string;      // Player's username
    health: number;        // Player's health points
    maxHealth: number;     // Max health value (can scale with level)
    level: number;         // Current level of the player
    experience: number;    // Experience points to level up
    inventory: Item[];     // Inventory of items the player holds
    equippedItems: Item[]; // Items the player currently has equipped (e.g., weapon, armor)
    money: number;         // Money the player currently has
    score: number;         // Player overall score 
  }
  
  // Player Model Class with Methods
  export class PlayerModel implements Player {
    id: string;
    username: string;
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
    inventory: Item[];
    equippedItems: Item[];
    money: number;
    score: number;
  
    constructor(id: string, username: string) {
      this.id = id;
      this.username = username;
      this.health = 100;     // default health
      this.maxHealth = 100;  // default max health
      this.level = 1;        // default level
      this.experience = 0;   // default experience
      this.inventory = [];   // empty inventory
      this.equippedItems = []; // no items equipped initially
      this.money = 0;
      this.score = 0;
    }
  
    // Method to increase experience and level up
    gainExperience(amount: number) {
      this.experience += amount;
      while (this.experience >= this.level * 100) { // assuming 100 XP per level
        this.experience -= this.level * 100;
        this.levelUp();
      }
    }

    // Method to increase player score
    gainScore(amount: number){
      this.score += amount;
    }

    // Method to handle player money
    gainMoney(amount:number){
      this.money += amount;
    }

    // Method to use money
    useMoney(amount: number){
      if (this.money < amount){
        return false;
      } 
      this.money -= amount;
      return true;
    }
  
    // Method to level up player
    levelUp() {
      this.level++;
      this.maxHealth += 20; // Max health increases with each level
      this.health = this.maxHealth; // Restore full health upon leveling up
    }
  
    // Method to take damage (reduce health)
    takeDamage(amount: number) {
      this.health = Math.max(0, this.health - amount);
    }
  
    // Method to heal (increase health)
    heal(amount: number) {
      this.health = Math.min(this.maxHealth, this.health + amount);
    }
  
    // Method to add an item to inventory
    addItem(item: Item) {
      this.inventory.push(item);
    }
  
    // Method to equip an item
    equipItem(item: Item) {
      this.equippedItems.push(item);
    }
  
    // Method to use an item (e.g., potion)
    useItem(item: Item) {
      if (item.type === 'potion' && item.effect === 'heal') {
        this.heal(50); // Heal by 50 (for example)
        // After using the item, you may remove it from inventory if it's consumable
        this.removeItem(item);
      }
    }
  
    // Method to remove an item from inventory
    removeItem(item: Item) {
      this.inventory = this.inventory.filter(i => i.id !== item.id);
    }
  
    // Return player stats for display or debugging
    getStats() {
      return {
        username: this.username,
        health: this.health,
        maxHealth: this.maxHealth,
        level: this.level,
        experience: this.experience,
        inventory: this.inventory.map(i => i.name),
        money: this.money,
      };
    }
  }
  