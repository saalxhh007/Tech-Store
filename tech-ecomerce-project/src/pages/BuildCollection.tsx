import { useEffect, useState } from 'react';
import { Button } from "./../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import ProductCard from './../components/ProductCard';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Check, 
  Laptop, 
  Mouse, 
  Keyboard, 
  ArrowRight,
  Star
} from 'lucide-react';
import { fetchProducts, Product } from '../data/mockData';
import axios from 'axios';
import { RootState } from '../store';
import { useSelector } from "react-redux"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CollectionItem {
  product: any;
  quantity: number;
}

const BuildCollection = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [selectedLaptop, setSelectedLaptop] = useState<any>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [budget, setBudget] = useState(2000);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false)

  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const apiUrl = process.env.REACT_APP_API

  const laptops = products.filter(p => p.category.toLocaleLowerCase() === 'laptops');
  const accessories = products.filter(p => p.category.toLocaleLowerCase() === 'accessories');
  const parts = products.filter(p => p.category.toLocaleLowerCase() === 'laptop-parts');

  const steps = [
    { number: 1, title: 'Choose Your Laptop', icon: Laptop },
    { number: 2, title: 'Select Accessories', icon: Mouse },
    { number: 3, title: 'Add Upgrades', icon: Keyboard },
    { number: 4, title: 'Review & Order', icon: Check }
  ];

  const addToCollection = (product: any, quantity: number = 1) => {
    setCollection(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCollection = (productId: string) => {
    setCollection(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCollection(productId);
      return;
    }
    setCollection(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const totalPrice = collection.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  const remainingBudget = budget - totalPrice;

  const categoryRecommendations = {
    accessories: [
      { title: 'Gaming Setup', products: accessories.filter(p => p.tags.includes('Gaming')) },
      { title: 'Professional Setup', products: accessories.filter(p => p.tags.includes('Business') || p.brand === 'KeyCraft') },
      { title: 'Essential Accessories', products: accessories.slice(0, 3) }
    ],
    parts: [
      { title: 'Performance Upgrades', products: parts.filter(p => p.tags.includes('Performance')) },
      { title: 'Storage Solutions', products: parts.filter(p => p.tags.includes('Storage')) },
      { title: 'Memory Upgrades', products: parts.filter(p => p.tags.includes('Memory')) }
    ]
  };

  const handleAddToCart = () => {
    setLoading(true);

    const payload = collection.map(item => ({
      product: item.product.id,
      quantity: item.quantity,
    }));

    axios.post(`${apiUrl}/v1/api/cart/add-items`, { collection: payload }, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then(() => {
        toast.success("Collection Added Successfully To Your Cart")
        navigate("/cart")
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      });
  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-cta text-cta-foreground mb-4">Custom Build</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Build My Collection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create the perfect laptop setup tailored to your needs and budget. 
            Our interactive builder helps you choose the right combination of laptop, accessories, and upgrades.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((stepItem, index) => {
                const IconComponent = stepItem.icon;
                const isActive = step === stepItem.number;
                const isCompleted = step > stepItem.number;
                
                return (
                  <div key={stepItem.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isActive ? 'bg-primary text-primary-foreground border-primary' : ''}
                        ${isCompleted ? 'bg-green-500 text-white border-green-500' : ''}
                        ${!isActive && !isCompleted ? 'bg-background text-muted-foreground border-muted' : ''}
                      `}>
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <IconComponent className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {stepItem.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${step > stepItem.number ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Step 1: Choose Laptop */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Choose Your Laptop</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Budget:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBudget(Math.max(1000000, budget - 200))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-20 text-center">{budget} DA</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBudget(budget + 1000)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {laptops && laptops.length > 0 ?
                    laptops.map((laptop) => (
                    <div key={laptop._id} className="relative">
                      <ProductCard product={laptop} />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button
                          variant={selectedLaptop?.id === laptop._id ? "default" : "secondary"}
                          className="w-full"
                          onClick={() => {
                            setSelectedLaptop(laptop);
                            if (!collection.find(item => item.product.id === laptop._id)) {
                              addToCollection(laptop);
                            }
                          }}
                        >
                          {selectedLaptop?.id === laptop._id ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Plus className="h-4 w-4 mr-2" />
                          )}
                          {selectedLaptop?.id === laptop._id ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  )) : (
                  <p>No products available.</p>
                  )}
                </div>

                {selectedLaptop && (
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} size="lg">
                      Next: Choose Accessories
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Accessories */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Select Accessories</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Next: Add Upgrades
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {categoryRecommendations.accessories.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Star className="h-5 w-5 text-cta mr-2" />
                      {category.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {category.products && category.products.length > 0 ?
                        category.products.map((product) => (
                        <div key={product._id} className="relative">
                          <ProductCard product={product} />
                          <div className="absolute bottom-4 left-4 right-4">
                            <Button
                              variant="secondary"
                              className="w-full"
                              onClick={() => addToCollection(product)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Collection
                            </Button>
                          </div>
                        </div>
                      )) : (
                          <p>No products available.</p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Add Upgrades */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add Upgrades</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(4)}>
                      Review Collection
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {categoryRecommendations.parts.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Star className="h-5 w-5 text-cta mr-2" />
                      {category.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {category.products && category.products.length > 0 ?
                      category.products.map((product) => (
                        <div key={product._id} className="relative">
                          <ProductCard product={product} />
                          <div className="absolute bottom-4 left-4 right-4">
                            <Button
                              variant="secondary"
                              className="w-full"
                              onClick={() => addToCollection(product)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Collection
                            </Button>
                          </div>
                        </div>
                      )) : (
                          <p>No products available.</p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review & Order */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Review Your Collection</h2>
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back  
                  </Button>
                </div>

                {collection.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <h3 className="text-xl font-semibold mb-2">Your collection is empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Go back and add some items to your collection.
                      </p>
                      <Button onClick={() => setStep(1)}>
                        Start Building
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {collection.map((item) => (
                      <Card key={item.product.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <img
                              src={`${apiUrl}${item.product.mainImage}`}
                              alt={item.product.name ?? ""}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.product.name}</h3>
                              <p className="text-muted-foreground">{item.product.brand}</p>
                              <p className="font-bold">{item.product.price} DA</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{(item.product.price * item.quantity).toFixed(2)} DA</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCollection(item.product.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="bg-primary text-primary-foreground">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-4">Ready to Order?</h3>
                        <p className="mb-6">Your custom collection is ready. Add all items to cart and proceed to checkout.</p>
                          <Button variant="secondary"
                            size="lg"
                            className="w-full sm:w-auto"
                            disabled={loading || !isAuthenticated}
                            onClick={handleAddToCart}
                          >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          
                          {loading ? "Processing..." : "Add Collection to Cart"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Collection Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget:</span>
                    <span className="font-medium">{budget} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-bold">{totalPrice.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className={`font-medium ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remainingBudget.toFixed(2)} DA
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        remainingBudget >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (totalPrice / budget) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Collection Items */}
                <div className="space-y-3">
                  <h4 className="font-medium">Items ({collection.length})</h4>
                  {collection.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {collection.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-2 text-sm">
                          <img
                            src={`${apiUrl}${item.product.mainImage}`}
                            alt={item.product.name ?? ""}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{item.product.name}</p>
                            <p className="text-muted-foreground">
                              {item.quantity} x {item.product.price} DA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {collection.length > 0 && (
                  <Button
                    className="w-full"
                    onClick={() => setStep(4)}
                  >
                    Review Collection
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildCollection;