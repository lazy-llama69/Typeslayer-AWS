export class BossModel {
    name: string;         // Name of the boss
    health: number;       // Current health
    maxHealth: number;    // Maximum health
    damage: number;       // Damage dealt by the boss
    bounty: number;       // Reward after killing boss 
    score: number;
    url: string;          // Url to boss image
  
    constructor(name: string, maxHealth: number, damage: number, bounty: number, url: string) {
      this.name = name;
      this.health = maxHealth;
      this.maxHealth = maxHealth;
      this.damage = damage;
      this.bounty = bounty;
      this.score = bounty;
      this.url = url;
    }
  
    // Method to apply damage to the boss
    takeDamage(damage: number): BossModel {
      const newHealth = Math.max(0, this.health - damage); // Ensure health doesn't go below 0
      return new BossModel(this.name, this.maxHealth, this.damage, this.bounty, this.url) // Return a new BossModel instance
        .setHealth(newHealth); // Set the new health value
    }

    // Helper method to set health (can be used in combination with takeDamage)
    setHealth(health: number): BossModel {
      this.health = health;
      return this;
    } 
  
    // Method to heal
    heal(amount: number) {
      this.health = Math.min(this.maxHealth, this.health + amount);
    }

    // Return boss stats for display or debugging
    getStats() {
      return {
        name: this.name,
        health: this.health,
        maxHealth: this.maxHealth,
        damage: this.damage,
        bounty: this.bounty,
        score: this.score,  
      };
    }
  }
  