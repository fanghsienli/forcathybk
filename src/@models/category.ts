import { Category } from "@entities/category";

export class CategorySelect {
    id: string;
    value: string;
    itemQuantity: number;
}

export class CategoryGrid {
    category: Category;
    itemQuantity: number;
}
