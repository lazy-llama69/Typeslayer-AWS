import { Item } from "../items/item";

  
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
    damage: number;        // Player base damage
    armor: number;        // Player armor
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
    damage: number;
    armor: number;
  
    constructor(id: string, username: string) {
      this.id = id;
      this.username = username;
      this.health = 100;        // default health
      this.maxHealth = 100;     // default max health
      this.level = 1;           // default level
      this.experience = 0;      // default experience
      this.inventory = [];      // empty inventory
      this.equippedItems = [];  // no items equipped initially
      this.money = 100000;           // default money
      this.score = 0;           // default score
      this.damage = 5;          // base damage
      this.armor = 0;           // default armor
    }
  
    // Method to increase experience and level up
    gainExperience(amount: number) {
      this.experience += amount;
      while (this.experience >= this.level * 100) { // assuming 100 XP per level
        this.experience -= this.level * 100;
        this.levelUp();
      }
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
      // Check if item exists in the inventory
      const existingItem = this.inventory.find(i => i.id === item.id);

      if (!existingItem) {
        // If item doesn't exist, add it to the inventory
        const newItem = { ...item, count: 1 }; // Clone and initialize count
        this.inventory.push(newItem);
      } else {
        // If item exists, update the count 
        existingItem.count += 1;
      }
    }
  
    // Method to equip an item
    equipItem(item: Item) {
      this.equippedItems.push(item);
      if (item.type === 'armor'){
        this.armor += parseInt(item.effect || '0', 10);
      } else{
        this.damage = parseInt(item.effect || '0', 10);
      }
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
      const existingItem = this.inventory.find(i => i.id === item.id);
      if (existingItem){
        existingItem.count -= 1;
        if (existingItem.count === 0){
          this.inventory = this.inventory.filter(i => i.id !== item.id);
        }
      }
    }

    // Method to unequip item 
    unequipItem(item: Item) {
      this.equippedItems = this.equippedItems.filter(i => i.id !== item.id);
      if (item.type === 'armor'){
        this.armor -= parseInt(item.effect || '0', 10);
      } else{
        this.damage = 5;
      }
    }
  }
  