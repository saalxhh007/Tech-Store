import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { Button } from "./../components/ui/button";
import { Card } from "./../components/ui/card";
import { Input } from "./../components/ui/input";
import { Label } from "./../components/ui/label";
import { Separator } from "./../components/ui/separator";
import { useToast } from "./../hooks/use-toast";
import { useSelector, useDispatch } from "react-redux"; 
import { RootState } from "../store";
import { clearCart } from "../store/slices/cart.slice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const cartItems = useSelector((state: RootState) => state.cart);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shipping = 15;
  const tax = cartSubtotal * 0.037;
  const cartTotal = cartSubtotal + shipping + tax;

  const apiUrl = process.env.REACT_APP_API;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/v1/api/order`, {
        products: cartItems.map((item) => ({
          productId: item.product._id,
          priceAtPurchase: item.product.price,
          quantity: item.quantity,
        })),
        paymentMethod: "cash-on-delivery", // ✅ always COD
        shippingAddress: {
          street: (document.getElementById("address") as HTMLInputElement)?.value,
          city: (document.getElementById("city") as HTMLInputElement)?.value,
          state: (document.getElementById("state") as HTMLInputElement)?.value,
          zip: (document.getElementById("zip") as HTMLInputElement)?.value,
        },
      }, {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${response.data._id} has been confirmed.`,
      });

      dispatch(clearCart());
      navigate("/my-orders");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Order Failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 animate-fade-in">
          {[1, 2].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= num
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle2 className="h-6 w-6" /> : num}
              </div>
              {num < 2 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step > num ? "bg-secondary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Shipping Information */}
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">1</span>
                  Shipping Information
                </h2>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+213 555 000000" required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Algiers" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="Wilaya" required />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="16000" required />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-secondary hover:bg-secondary/90"
                  >
                    Continue to Review
                  </Button>
                </form>
              </Card>
            )}

            {/* Review & Place Order */}
            {step === 2 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">2</span>
                  Review & Place Order
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-green-600">
                    <Lock className="h-5 w-5" />
                    <span className="text-sm">Payment method: Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By placing this order, you agree to our terms and conditions.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-accent hover:bg-accent/90 text-black font-bold"
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{cartSubtotal.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{tax.toFixed(2)} DA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">{cartTotal.toFixed(2)} DA</span>
                </div>
              </div>
              <div className="bg-light p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Items in Cart</h3>
                <ul className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex justify-between">
                      <span>{item.product.name}</span>
                      <span>×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
