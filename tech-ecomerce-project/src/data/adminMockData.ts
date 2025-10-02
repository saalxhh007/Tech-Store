import axios from "axios";

export interface OrderStatus {
  id: string;
  label: string;
  color: string;
}

export interface Order {
  id: string;
  customerName: string;
  status: 'pending' | 'shipped' | 'delivered';
  total: number;
  date: string;
  items: number;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface ChartDataInput {
    [key: string]: any;
}
export interface CategoryShare extends ChartDataInput {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  newCustomers: number;
  lowStockItems: number;
}

export const orderStatuses: OrderStatus[] = [
  { id: 'pending', label: 'Pending', color: 'bg-cta text-cta-foreground' },
  { id: 'shipped', label: 'Shipped', color: 'bg-secondary text-secondary-foreground' },
  { id: 'delivered', label: 'Delivered', color: 'bg-primary text-primary-foreground' },
];

export const salesData: SalesData[] = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 132 },
  { month: 'Apr', sales: 61000, orders: 168 },
  { month: 'May', sales: 55000, orders: 151 },
  { month: 'Jun', sales: 67000, orders: 189 },
  { month: 'Jul', sales: 72000, orders: 201 },
  { month: 'Aug', sales: 68000, orders: 195 },
  { month: 'Sep', sales: 75000, orders: 215 },
];

export const categoryShare: CategoryShare[] = [
  { name: 'Laptops', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Accessories', value: 30, color: 'hsl(var(--secondary))' },
  { name: 'Laptop Parts', value: 25, color: 'hsl(var(--accent))' },
];

const apiUrl = process.env.REACT_APP_API;
export const fetchOrders = async (accessToken: string): Promise<Order[]> => {
  try {
    const response = await axios.get(`${apiUrl}/v1/api/order`, { headers: { authorization: `Bearer ${accessToken}` } });
    console.log(response.data);
    
    return Array.isArray(response.data) ? response.data : response.data.orders
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

export const fetchCustomers = async (accessToken: string): Promise<Customer[]> => {
  try {
    const response = await axios.get(`${apiUrl}/v1/api/user`, { headers: { authorization: `Bearer ${accessToken}` } });
    console.log(response.data);
    
    return Array.isArray(response.data) ? response.data : response.data.customers
  } catch (err) {
    console.error("Error fetching customers:", err);
    return [];
  }
};