import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./../components/ui/button";
import ProductCard from "./../components/ProductCard";
import { Product } from "../data/mockData";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const apiUrl = process.env.REACT_APP_API

  const removeFromFavorites = (id: string) => {
    axios.delete(`${apiUrl}/v1/api/favorite`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        setFavorites(favorites.filter(item => item._id !== id));
      })
      .catch((err) => {
        console.log(err);
    })
  };

  const fetchFavoritesItems = () => {
    setLoading(true)
    if (accessToken) {
    axios.get(`${apiUrl}/v1/api/favorite`, {
      withCredentials: true,
      headers: {
        authorization : `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        setFavorites(response.data)
      })
      .catch((err) => {
      console.log(err);
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    fetchFavoritesItems()
  }, [accessToken])
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 animate-fade-in">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8">Start adding products to your wishlist</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link to="/categories/laptops">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">My Favorites</h1>
            <p className="text-muted-foreground">{favorites.length} items in your wishlist</p>
          </div>
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add All to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product, index) => (
            <div
              key={product._id}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromFavorites(product._id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;