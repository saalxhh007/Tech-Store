import { useEffect, useState } from 'react';
import { Eye, Download, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { Badge } from './../../components/ui/badge';
import { Input } from './../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../../components/ui/select';
import { orderStatuses, Order, fetchOrders } from './../../data/adminMockData';
import OrderViewDialog from '../../components/admin/OrderViewDialog';
import SendEmailDialog from '../../components/admin/SendEmailDialog';
import { useSelector } from "react-redux";
import { RootState } from '../../store';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | undefined>();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.includes(searchTerm.toLowerCase()) ||
      order.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.id === status);
    return statusConfig?.color || 'bg-muted';
  };

  const loadOrders = async () => {
    if (accessToken) {
      const data = await fetchOrders(accessToken);
      setOrders(data);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [accessToken]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={18} />
          Export Orders
        </Button>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
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
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">#{order._id}</TableCell>
                    <TableCell>{order.userId.fullName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusStyle(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.products.map((product: any) => (
                        <p key={product.productId._id}>{product.productId.name}</p>
                      ))}
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{order.totalPrice.toFixed(2)} DA</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-secondary hover:text-secondary-foreground"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            setSelectedOrder(order);
                            setEmailDialogOpen(true);
                          }}
                        >
                          <Mail size={16} />
                        </Button>
                        <Select>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No Order Exists!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        order={selectedOrder}
      />

      <SendEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        recipientEmail={selectedOrder?.userId.email}
        recipientName={selectedOrder?.userId.fullName}
      />
    </div>
  );
}
