import {Product} from './product';

interface Category {
  name: string;
  description: string;
  subcategories: Category[];
  products: Product[];
  ourPicks: Product[];
}

export {Category};
