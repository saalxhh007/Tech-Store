import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import StatsCard from './../../components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Badge } from './../../components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { categoryShare, orderStatuses } from './../../data/adminMockData';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchProducts, Product } from '../../data/mockData';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  newCustomers: number;
  lowStockItems: number;
}

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();
  const [salesData, setSalesData] = useState<any>();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const bestSellingProducts = products.slice(0, 4);

  const apiUrl = process.env.REACT_APP_API

  const getStatusStyle = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.id === status);
    return statusConfig?.color || 'bg-muted';
  }

  const fetchSalesData = () => {
    axios.get(`${apiUrl}/v1/api/stats/monthly`)
      .then((response) => {
        setSalesData(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetchRecentOrders = () => {
    axios.get(`${apiUrl}/v1/api/order/`)
      .then((response) => {
        console.log(response.data);
        setRecentOrders(response.data.slice(0, 5))
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetchDashboardStats = () => {
    axios.get(`${apiUrl}/v1/api/stats/admin`)
      .then((response) => {
        setDashboardStats(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  useEffect(() => {
    fetchDashboardStats()
    fetchRecentOrders()
    fetchSalesData()
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, [])
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value={dashboardStats?.totalSales ?? 0}
          icon={DollarSign}
          suffix=" DA"
          trend={{ value: 12.5, isPositive: true }}
          delay={0}
        />
        <StatsCard
          title="Total Orders"
          value={dashboardStats?.totalOrders ?? 0}
          icon={ShoppingBag}
          trend={{ value: 8.2, isPositive: true }}
          delay={100}
        />
        <StatsCard
          title="New Customers"
          value={dashboardStats?.newCustomers ?? 0}
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
          delay={200}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={dashboardStats?.lowStockItems ?? 0}
          icon={AlertTriangle}
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Chart */}
        <Card className="animate-fade-in hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="animate-fade-in hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryShare}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Monthly Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusStyle(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right font-medium">
                    {order.total.toFixed(2)} DA 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Best Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {bestSellingProducts && bestSellingProducts.length > 0 ?
              (bestSellingProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all hover:scale-105"
              >
                <img
                  src={`${apiUrl}${product.mainImage}`}
                  alt={product.name ?? ""}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    {product.price.toFixed(2)} DA
                  </p>
                </div>
              </div>
            ))) : (
                <p>No products available.</p>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}