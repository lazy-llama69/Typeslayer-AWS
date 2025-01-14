// item.tsx
export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion';
    price: number;  // Price of the item for trading
    effect?: string;  // Effect to player 
    url: string;  // path to image 
    count: number; // number of the item in player inventory
}