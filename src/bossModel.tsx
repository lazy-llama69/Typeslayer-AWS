export class BossModel {
    name: string;         // Name of the boss
    health: number;       // Current health
    maxHealth: number;    // Maximum health
    damage: number;       // Damage dealt by the boss
  
    constructor(name: string, maxHealth: number, damage: number) {
      this.name = name;
      this.health = maxHealth;
      this.maxHealth = maxHealth;
      this.damage = damage;
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
      };
    }
  }
  