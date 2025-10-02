// mockData.ts
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  category: 'laptops' | 'accessories' | 'laptop-parts';
  price: number;
  originalPrice?: number;
  mainImage: string;
  images: string[];
  rating: number;
  reviews: number;
  availability: 'In Stock' | 'Out of Stock' | 'Limited Stock';
  description: string;
  features: string[];
  colors?: string[];
  tags: string[];
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

const apiUrl = process.env.REACT_APP_API;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${apiUrl}/v1/api/product`);
    return Array.isArray(response.data) ? response.data : response.data.products;
    
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Laptops',
    slug: 'laptops',
    image: '/placeholder.svg',
    description: 'High-performance laptops for gaming, work, and creativity',
    productCount: 156
  },
  {
    id: '2',
    name: 'Accessories',
    slug: 'accessories',
    image: '/placeholder.svg',
    description: 'Essential accessories to enhance your laptop experience',
    productCount: 89
  },
  {
    id: '3',
    name: 'Laptop Parts',
    slug: 'laptop-parts',
    image: '/placeholder.svg',
    description: 'Replacement parts and upgrades for your laptop',
    productCount: 234
  }
];