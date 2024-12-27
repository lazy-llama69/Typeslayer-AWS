import { PlayerModel } from "./playerModel";
import healingPotion from '../items/healingPotion';
import ironSword from '../items/woodenSword';
import steelArmor from '../items/steelArmor';
import { Item } from "../items/item";
  
  // Trader Model Class
  export class TraderModel {
    itemsForSale: Item[]; // List of items the trader is selling
  
    constructor() {
      // Define some items for sale (could be weapons, armor, potions)
      this.itemsForSale = [
        healingPotion,
        ironSword,
        steelArmor,
      ];
    }
  
    // Method to trade with the player
    trade(player: PlayerModel, itemId: string): boolean {
      // Find the item the player wants to purchase
      const itemToTrade = this.itemsForSale.find(item => item.id === itemId);
      
      if (!itemToTrade) {
        console.log('Item not found.');
        return false;
      }
      
      // Check if the player has enough money to purchase the item
      if (player.useMoney(itemToTrade.price)) {
        // Deduct money from the player and add item to inventory
        player.addItem(itemToTrade);
        console.log(`Successfully purchased: ${itemToTrade.name}`);
        return true;
      } else {
        console.log('Not enough money to purchase this item.');
        return false;
      }
    }
  
    // Show available items for trade
    showItemsForSale() {
      console.log('Items available for trade:');
      this.itemsForSale.forEach(item => {
        console.log(`${item.name} - Price: ${item.price}`);
      });
    }
  }
  