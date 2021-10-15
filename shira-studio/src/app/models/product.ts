enum Currency {
  USD,
  ILS
}

class ProductEntry {
  id: number;
  name: string;
  displayNameHE: string;
  displayNameEN: string;
  descriptionHE: string;
  descriptionEN: string;
  imagePath: string;
  price: number;
  stock: number;
  parentCategories: { id, name, displayNameHE, displayNameEN }[];
  currency: Currency;

  constructor() {}
}

export {ProductEntry, Currency};
