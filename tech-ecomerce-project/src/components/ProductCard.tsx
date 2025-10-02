import { Product } from './../data/mockData';
import { Button } from './../components/ui/button';
import { Badge } from './../components/ui/badge';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './../lib/utils';
import { useState } from 'react';
import { RootState } from '../store';
import { useSelector } from "react-redux"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const apiUrl = process.env.REACT_APP_API
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const handleAddToCart = () => {
    setLoading(true)
    axios.post(`${apiUrl}/v1/api/cart`, {
      product_id: product._id,
      quantity : 1
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
      .finally(() => {
      setLoading(false)
    })
  }

  const addToFavorite = () => {
    setLoading(true)
    axios.post(`${apiUrl}/v1/api/favorite`, {
      product_id: product._id,
    }, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        toast.success("Product Added Successfully To Your Card")
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      setLoading(false)
    })
  }
  
  return (
    <div className={cn(
      "group bg-card rounded-lg shadow-sm border hover-lift overflow-hidden transition-all duration-300",
      "hover:shadow-lg animate-fade-in",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-accent/20">
        <img
          src={`${apiUrl}${product.mainImage}`}
          alt={product.name ?? ""}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-cta text-cta-foreground">New</Badge>
          )}
          {discountPercentage && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {product.availability === 'Limited Stock' && (
            <Badge variant="outline" className="bg-background/90">Limited</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/90 hover:bg-background text-foreground shadow-sm"
            onClick={addToFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/products/${product._id}`}>
            <Button variant="secondary" className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{product.brand}</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
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
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-foreground">
            {product.price} DA
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice} DA
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-sm font-medium",
            product.availability === 'In Stock' && "text-green-600",
            product.availability === 'Limited Stock' && "text-orange-600",
            product.availability === 'Out of Stock' && "text-red-600"
          )}>
            {product.availability}
          </span>
        </div>

        <Button 
          variant="secondary" 
          className="w-full"
          disabled={product.availability === 'Out of Stock' || loading || !isAuthenticated}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : "Add To Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;