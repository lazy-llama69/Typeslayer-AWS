export class BossModel {
    name: string;         // Name of the boss
    health: number;       // Current health
    maxHealth: number;    // Maximum health
    damage: number;       // Damage dealt by the boss
    bounty: number;       // Reward after killing boss 
    score: number;
  
    constructor(name: string, maxHealth: number, damage: number, bounty: number) {
      this.name = name;
      this.health = maxHealth;
      this.maxHealth = maxHealth;
      this.damage = damage;
      this.bounty = bounty;
      this.score = bounty;
    }
  
    // Method to take damage
    takeDamage(amount: number) {
      this.health = Math.max(0, this.health - amount);
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
  