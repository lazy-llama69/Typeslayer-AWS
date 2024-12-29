// item.tsx
export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion';
    price: number;  // Price of the item for trading
    effect?: string;  // Optional effect, used for potions
    url: string;  // path to image 
}