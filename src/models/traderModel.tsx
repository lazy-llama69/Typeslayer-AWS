import { PlayerModel } from "./playerModel";
import healingPotion from '../items/potions/healingPotion';
import ironSword from '../items/weapons/woodenSword';
import steelArmor from '../items/armor/steelArmor';
import fireArmor from "../items/armor/fireArmor";
import woodenArmor from "../items/armor/woodenArmor";
import armorPotion from "../items/potions/armorPotion";
import attackPotion from "../items/potions/attackPotion";
import bow_and_arrow from "../items/weapons/bow_and_arrow";
import magic_wand from "../items/weapons/magic_wand";
import { Item } from "../items/item";
  
  // Trader Model Class
  export class TraderModel {
    itemsForSale: Item[]; // List of items the trader is selling
  
    constructor() {
      // Define items for sale
      this.itemsForSale = [
        healingPotion,
        ironSword,
        steelArmor,
        fireArmor,
        woodenArmor,
        armorPotion,
        attackPotion,
        bow_and_arrow,
        magic_wand,
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
        console.log(player.inventory);
        return true;
      } else {
        console.log('Not enough money to purchase this item.');
        return false;
      }
    }
  }
  