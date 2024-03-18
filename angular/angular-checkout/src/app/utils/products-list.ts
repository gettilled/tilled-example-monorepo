import { environment } from 'environments/environment';

interface Product {
  name: string;
  quantity: number;
  price: number;
  imagePath: string;
}

export class ProductsList {
  public static products: Product[] = [
    {
      name: 'Bluetooth Speaker',
      quantity: 1,
      price: 135.99,
      imagePath: '../../assets/product-images/bluetooth-speaker.png',
    },
    {
      name: 'Sneakers',
      quantity: 3,
      price: 178.0,
      imagePath: '../../assets/product-images/sneakers.png',
    },
    {
      name: 'Lawn Mower',
      quantity: 1,
      price: 1463.59,
      imagePath: '../../assets/product-images/lawn-mower.png',
    },
  ];
  public static taxRate = environment.taxRate;
}
