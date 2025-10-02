import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from './../components/ui/button';
import { Card, CardContent } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './../components/ui/tabs';
import ProductCard from './../components/ProductCard';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Facebook, 
  Instagram, 
  Check,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { cn } from './../lib/utils';
import { fetchProducts, Product } from '../data/mockData';
import axios from 'axios';
import { RootState } from '../store';
import { useSelector } from "react-redux"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([]);
  const { id } = useParams();
  const product = products.find(p => p._id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false)

  const apiUrl = process.env.REACT_APP_API
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const addToFavorite = () => { 
    setLoading(true)

    axios.post(`${apiUrl}/v1/api/favorite`, {
      productId: id,
    }, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        setIsFavorite(!isFavorite)
        toast.success("Product Added Successfully To Your Favorites")
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      setLoading(false)
    })
  }

  const handleAddToCart = () => {
    setLoading(true)
    axios.post(`${apiUrl}/v1/api/cart`, {
      product_id: id,
      quantity
    }, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        toast.success("Product Added Successfully To Your Card")
        navigate("/cart")
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/categories/laptops">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const relatedProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const reviews = [
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      comment: 'Excellent product! Fast delivery and great quality.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      comment: 'Good value for money. Works as expected.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      user: 'Mike R.',
      rating: 5,
      comment: 'Perfect for my needs. Highly recommended!',
      date: '2024-01-08',
      verified: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link 
              to={`/categories/${product.category}`} 
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={`/categories/${product.category}`}>
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {product.category.replace('-', ' ')}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-accent/20 rounded-lg overflow-hidden">
              <img
                src={`${apiUrl}${product.mainImage}`}
                alt={product.name ?? ""}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square bg-accent/20 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img
                      src={`${apiUrl}${image}`}
                      alt={`${product.name ?? ""} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-muted-foreground font-medium">{product.brand}</p>
              <h1 className="text-3xl font-bold text-foreground mt-1">{product.name}</h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-cta text-cta-foreground">New</Badge>
              )}
              {discountPercentage && (
                <Badge variant="destructive">-{discountPercentage}% OFF</Badge>
              )}
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                product.availability === 'In Stock' && "bg-green-500",
                product.availability === 'Limited Stock' && "bg-orange-500",
                product.availability === 'Out of Stock' && "bg-red-500"
              )} />
              <span className={cn(
                "font-medium",
                product.availability === 'In Stock' && "text-green-600",
                product.availability === 'Limited Stock' && "text-orange-600",
                product.availability === 'Out of Stock' && "text-red-600"
              )}>
                {product.availability}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "text-cta fill-current"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} out of 5 ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-foreground">
                  {product.price} DA
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice} DA
                  </span>
                )}
              </div>
              {discountPercentage && (
                <p className="text-green-600 font-medium">
                  You save {(product.originalPrice! - product.price).toFixed(2)} DA
                </p>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Color:</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(index)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-colors",
                        selectedColor === index ? "border-primary" : "border-muted",
                        color === 'Black' && "bg-black",
                        color === 'White' && "bg-white border-gray-300",
                        color === 'Silver' && "bg-gray-300",
                        color === 'Gold' && "bg-yellow-400"
                      )}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {product.colors[selectedColor]}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-input rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: {(product.price * quantity).toFixed(2)} DA
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={product.availability === 'Out of Stock' || loading || !isAuthenticated}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {loading ? "Processing..." : "Add To Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={addToFavorite}
                className={cn(
                  "sm:w-auto",
                  isFavorite && "text-red-500 border-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>
            </div>

            {/* Social Share */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <span className="text-sm font-medium">On:</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-blue-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-pink-600">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <h3 className="font-semibold mb-4">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Product Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Brand:</dt>
                          <dd className="font-medium">{product.brand}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd className="font-medium capitalize">{product.category.replace('-', ' ')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Availability:</dt>
                          <dd className="font-medium">{product.availability}</dd>
                        </div>
                        {product.colors && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Colors:</dt>
                            <dd className="font-medium">{product.colors.join(', ')}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Technical Specifications</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{product.rating}</div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating)
                                  ? "text-cta fill-current"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.reviews} reviews
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center space-x-2">
                              <span className="text-sm w-8">{stars}★</span>
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-cta rounded-full h-2" 
                                  style={{ width: `${Math.random() * 80 + 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.user}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </time>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating
                                  ? "text-cta fill-current"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;