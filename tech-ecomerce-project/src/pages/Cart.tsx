import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "./../components/ui/button";
import { Card } from "./../components/ui/card";
import { Separator } from "./../components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";
import { setCart } from "../store/slices/cart.slice";

interface cartItem {
  _id: string
  product: Product
  quantity: number
}

interface Product {
  _id: string
  name: string
  price: number
  mainImage: string
  availibility: "In Stock" | "Out of Stock" | "Limited Stock"
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const apiUrl = process.env.REACT_APP_API

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    axios.delete(`${apiUrl}/v1/api/cart/clear`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        setCartItems(items => items.filter(item => item._id !== id));
      })
      .catch((err) => {
        console.log(err);
    })
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const fetchCartItems = () => {
      setLoading(true);
      if (accessToken) {
          axios.get(`${apiUrl}/v1/api/cart`, {
              withCredentials: true,
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
          })
            .then((response) => {
            if (response.data && Array.isArray(response.data.items)) {
              setCartItems(response.data.items)
            } else {
              setCartItems([])
            }
          })
          .catch((err) => {
              console.log(err);
          })
          .finally(() => {
              setLoading(false);
          });
      }
  }

  useEffect(() => {
    fetchCartItems()
  }, [accessToken])
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 animate-fade-in">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products to get started</p>
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
        <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            {cartItems.map((item, index) => (
              <Card key={item._id} className="p-6 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex gap-6">
                  <img
                    src={`${apiUrl}${item.product.mainImage}`}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                    <p className="text-sm text-green-600 mb-4">{item.product.availibility}</p>
                    <p className="text-2xl font-bold text-accent mb-4">{item.product.price} DA</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item._id, -1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item._id, 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item._id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold">{tax.toFixed(2)} DA</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent">{total.toFixed(2)} DA</span>
                </div>
              </div>

              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-lg py-6">
                <Link to="/checkout" onClick={() => {
                  dispatch(setCart(cartItems))
                }}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/categories/laptops">Continue Shopping</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;