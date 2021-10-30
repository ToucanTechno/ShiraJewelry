import {ProductEntry} from './product';

interface Category {
  name: string;
  description: string;
  imagePath: string;
  subcategories: Category[];
  products: ProductEntry[];
  ourPicks: ProductEntry[];
}

class CategoryEntry {
  id: number;
  name: string;
  descriptionHE: string;
  descriptionEN: string;
  displayNameHE: string;
  displayNameEN: string;
  imagePath: string;
  parentCategoryID: number;
  isVisible: string;
  parentCategoryName: string;

  constructor() {}
}

export {Category, CategoryEntry};
