import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import StatsCard from './../../components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [customerActivityData, setCustomerActivityData] = useState<any>()
  const [revenueGrowthData, setRevenueGrowthData] = useState<any>()
  const [salesData, setSalesData] = useState<any>();
  const [averageOrderValue, setAverageOrderValue] = useState<any>();

  const apiUrl = process.env.REACT_APP_API
  
  const fetchCustomerActivityData = () => {
    axios.get(`${apiUrl}/v1/api/stats/customer-activity`)
      .then((response) => {
        setCustomerActivityData(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  const fetchRevenueGrowthData = () => {
    axios.get(`${apiUrl}/v1/api/stats/revenue-growth`)
      .then((response) => {
        setRevenueGrowthData(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetchAverageOrderValue = () => {
    axios.get(`${apiUrl}/v1/api/stats/average-order-value`)
      .then((response) => {
        setAverageOrderValue(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
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
  useEffect(() => {
    fetchAverageOrderValue()
    fetchCustomerActivityData()
    fetchRevenueGrowthData()
    fetchSalesData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep insights into your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue Growth"
          value={revenueGrowthData}
          icon={TrendingUp}
          suffix="%"
          trend={{ value: 12.5, isPositive: true }}
          delay={0}
        />
        <StatsCard
          title="Average Order Value"
          value={averageOrderValue}
          icon={DollarSign}
          suffix=" DA"
          trend={{ value: 8.2, isPositive: true }}
          delay={100}
        />
        <StatsCard
          title="Conversion Rate"
          value={12}
          icon={ShoppingCart}
          suffix="%"
          trend={{ value: 3.1, isPositive: true }}
          delay={200}
        />
        <StatsCard
          title="Customer Retention"
          value={87}
          icon={Users}
          suffix="%"
          trend={{ value: 5.4, isPositive: true }}
          delay={300}
        />
      </div>

      {/* Revenue Growth Chart */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Revenue & Profit Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueGrowthData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#colorProfit)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales & Activity Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Sales */}
        <Card className="animate-fade-in hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
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
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Activity */}
        <Card className="animate-fade-in hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Weekly Customer Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={customerActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
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
                  dataKey="visitors" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="purchases" 
                  stroke="hsl(var(--cta))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--cta))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}