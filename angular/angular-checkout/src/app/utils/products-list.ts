import { environment } from 'environments/environment';

export interface Product {
  name: string;
  quantity: number;
  price: number;
  imagePath: string;
  description?: string;
}

export class ProductsList {
  public static products: Product[] = [
    {
      name: 'Bluetooth Speaker',
      quantity: 1,
      price: 135.99,
      imagePath: '../../assets/product-images/bluetooth-speaker.png',
      description: 'Powerful audio and seamless wireless streaming from any device.',
    },
    {
      name: 'Sneakers',
      quantity: 3,
      price: 178.0,
      imagePath: '../../assets/product-images/sneakers.png',
      description: 'Designed for both performance and fashion, they are perfect for any activity or casual outing',
    },
    {
      name: 'Lawn Mower',
      quantity: 1,
      price: 1463.59,
      imagePath: '../../assets/product-images/lawn-mower.png',
      description: 'Make lawn maintenance a breeze with our efficient and reliable lawn mower, built for both small and large yards.',
    },
  ];
  public static taxRate = environment.taxRate;
}
