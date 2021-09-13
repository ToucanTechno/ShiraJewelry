enum Currency {
  USD,
  ILS
}

interface Product {
  id: number;
  image_path: string;
  price: number;
  currency: Currency;
}

export {Product, Currency};
