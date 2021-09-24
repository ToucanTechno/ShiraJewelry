import {Product} from './product';

interface Category {
  name: string;
  description: string;
  subcategories: Category[];
  products: Product[];
  ourPicks: Product[];
}

class CategoryEntry {
  id: number;
  name: string;
  descriptionHe: string;
  descriptionEn: string;
  displayNameHe: string;
  displayNameEn: string;
  imagePath: string;
  parentCategoryId: number;
  isVisible: string;
  parentCategoryName: string;

  constructor() {}
}

export {Category, CategoryEntry};
