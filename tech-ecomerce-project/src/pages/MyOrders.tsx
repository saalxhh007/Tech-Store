import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Download, ShoppingBag } from "lucide-react";
import { Button } from "./../components/ui/button";
import { Card } from "./../components/ui/card";
import { Badge } from "./../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";

interface Order {
  id: string
  date: Date
  status: "pending" | "paid" | "shipped" | "completed" | "canceled"
  total: number
  items: Item[]
}

interface Item {
  name: string
  quantity: number
  coverImage: string
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const apiUrl = process.env.REACT_APP_API

  const fetchMyOrders = () => {
      if (accessToken) {
          axios.get(`${apiUrl}/v1/api/order/my/orders`, {
              withCredentials: true,
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
          })
            .then((response) => {
              console.log(response.data);
              
              const mappedOrders: Order[] = response.data.map((order: any) => ({
                id: order._id,
                date: new Date(order.createdAt),
                status: order.status,
                total: order.totalPrice,
                items: order.products.map((p: any) => ({
                  name: p.productId?.name || "Unknown",
                  quantity: p.quantity,
                  coverImage: p.productId?.mainImage || "",
                })),
              }));
              setOrders(mappedOrders);
            })
            .catch((err) => {
              console.log(err);
              setOrders([])
            })
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [accessToken])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500";
      case "Shipped": return "bg-blue-500";
      case "Processing": return "bg-accent";
      default: return "bg-muted";
    }
  };

  const filterOrders = (status: string) => {
    if (status === "all") return orders;
    return orders.filter(order => order.status.toLowerCase() === status);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 animate-fade-in">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping to see your orders here</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link to="/categories/laptops">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">My Orders</h1>

        <Tabs defaultValue="all" className="animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order, index) => (
              <Card
                key={order.id}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex gap-4">
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={`${apiUrl}${item.coverImage}`}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Placed on {order.date.toDateString()}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-accent">{order.total} DA</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        )}
                        {order.status !== "shipped" && (
                          <Button variant="outline" size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {["pending", "shipped", "delivered"].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterOrders(status).map((order, index) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex gap-4">
                      {order.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={`${apiUrl}${item.coverImage}`}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">Placed on {order.date.toDateString()}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm">
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-accent">{order.total} DA</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "shipped" && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Invoice
                            </Button>
                          )}
                          {order.status !== "shipped" && (
                            <Button variant="outline" size="sm">
                              <Package className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MyOrders;