enum Currency {
  USD,
  ILS
}

interface ProductEntry {
  id: number;
  name: string;
  display_name_he: string;
  display_name_en: string;
  description_he: string;
  description_en: string;
  image_path: string;
  price: number;
  stock: number;
  parent_category_ids: number[];
  parent_category_names: string[];
  currency: Currency;
}

export {ProductEntry, Currency};
