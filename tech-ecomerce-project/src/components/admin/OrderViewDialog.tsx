import { Dialog, DialogContent, DialogHeader, DialogTitle } from './../../components/ui/dialog';
import { Badge } from './../../components/ui/badge';
import { Order } from './../../data/adminMockData';
import { Calendar, Package, User, DollarSign } from 'lucide-react';

interface OrderViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
}

export default function OrderViewDialog({ open, onOpenChange, order }: OrderViewDialogProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-primary text-primary-foreground';
      case 'shipped':
        return 'bg-secondary text-secondary-foreground';
      case 'pending':
        return 'bg-cta text-cta-foreground';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package size={18} />
                <span className="text-sm">Order ID</span>
              </div>
              <p className="font-semibold text-lg">{order.id}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User size={18} />
                <span className="text-sm">Customer</span>
              </div>
              <p className="font-semibold text-lg">{order.customerName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={18} />
                <span className="text-sm">Order Date</span>
              </div>
              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign size={18} />
                <span className="text-sm">Total Amount</span>
              </div>
              <p className="font-semibold text-lg">{order.total.toFixed(2)} DA</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Items</p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium">{order.items} item(s) in this order</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold">Shipping Information</h4>
            <p className="text-sm text-muted-foreground">
              Standard shipping to customer's registered address
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
