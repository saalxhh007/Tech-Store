import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './../components/ui/button';
import { Card, CardContent } from './../components/ui/card';
import ProductCard from './../components/ProductCard';
import ProductFilter from './../components/ProductFilter';
import { Badge } from './../components/ui/badge';
import { categories, Product, fetchProducts } from './../data/mockData';
import { ArrowRight, Laptop, Headphones, HardDrive, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import premiumLaptopsCollection from "./../assets/accessories-banner.jpg"
import laptopAccessoires from "./../assets/hero-laptop.jpg"

const Home = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

  const apiUrl = process.env.REACT_APP_API
  
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 2000] as [number, number],
    rating: 0,
    availability: [] as string[],
  });

  const weeklyHighlights = [
    {
      title: 'Products of the Week',
      products: featuredProducts.slice(0, 3),
      icon: Star,
      badge: 'Featured',
      bgColor: 'bg-accent'
    },
    {
      title: 'New Deals for Today',
      products: saleProducts.slice(0, 3),
      icon: Zap,
      badge: 'Limited Time',
      bgColor: 'bg-cta/20'
    },
    {
      title: 'Top Deals',
      products: products.filter(p => p.originalPrice).slice(0, 3),
      icon: TrendingUp,
      badge: 'Best Value',
      bgColor: 'bg-secondary/20'
    },
    {
      title: 'Recently Added',
      products: newProducts.slice(0, 3),
      icon: Clock,
      badge: 'New Arrivals',
      bgColor: 'bg-primary/10'
    }
  ];

  const categoryIcons = {
    laptops: Laptop,
    accessories: Headphones,
    'laptop-parts': HardDrive,
  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFeaturedProducts(data.filter(p => p.isFeatured))
      setNewProducts(data.filter(p => p.isNew))
      setSaleProducts(data.filter(p => p.isOnSale))
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={premiumLaptopsCollection ?? "/placeholder.svg"}
            alt="Premium laptops collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl space-y-6 animate-fade-in">
            <Badge className="bg-cta text-cta-foreground mb-4">Best Laptops at Unbeatable Prices</Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Premium Laptops & Tech Accessories
            </h1>
            <p className="text-xl text-white/90">
              Discover our curated collection of high-performance laptops, gaming accessories, 
              and upgrade parts from top brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/categories/laptops">
                <Button size="lg" className="text-lg px-8">
                  Shop Laptops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/build-my-collection">
                <Button variant="secondary" size="lg" className="text-lg px-8">
                  Build My Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilter
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            {/* Category Quick Links */}
            <Card className="mt-6 p-6 space-y-4">
              <h3 className="font-semibold text-lg">Shop by Category</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons];
                  return (
                    <Link
                      key={category.id}
                      to={`/categories/${category.slug}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors duration-300 group"
                    >
                      <IconComponent className="h-5 w-5 text-primary group-hover:text-primary/80" />
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.productCount} items
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Banner */}
            <Card className="relative overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 space-y-4">
                  <Badge className="bg-cta text-cta-foreground">Featured Collection</Badge>
                  <h2 className="text-3xl font-bold">Essential Laptop Accessories</h2>
                  <p className="text-muted-foreground">
                    Complete your setup with our premium collection of gaming mice, 
                    mechanical keyboards, and laptop stands.
                  </p>
                  <Link to="/categories/accessories">
                    <Button variant="secondary" className="mt-4">
                      View Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-1/2">
                  <img
                    src={laptopAccessoires ?? "/placeholder.svg"}
                    alt="Laptop accessories collection"
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
              </div>
            </Card>

            {/* New Products Slider */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">New Products</h2>
                <Link to="/categories/laptops">
                  <Button variant="ghost" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {newProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>

            {/* Weekly Highlights Grid */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Weekly Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {weeklyHighlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                    <Card key={index} className={`${highlight.bgColor} border-none`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{highlight.title}</h3>
                          </div>
                          <Badge variant="outline">{highlight.badge}</Badge>
                        </div>
                        <div className="space-y-3">
                          {highlight.products && highlight.products.length > 0 ?
                            (highlight.products.map((product) => (
                            <Link
                              key={product._id}
                              to={`/products/${product._id}`}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background/50 transition-colors group"
                            >
                              <img
                                src={`${apiUrl}${product.mainImage}`}
                                alt={product.name ?? ""}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate group-hover:text-primary transition-colors">
                                  {product.name}
                                </div>
                                <div className="text-sm font-bold text-primary">
                                  {product.price} DA
                                </div>
                              </div>
                            </Link>
                            ))) : (
                              <p>No products available.</p>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Marketing Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Last Added Product */}
            {products.length > 0 && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                      <img
                        src={`${apiUrl}${products[0].mainImage}`}
                      alt={products[0].name ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Badge className="bg-cta text-cta-foreground mb-2">Latest Addition</Badge>
                      <h3 className="text-xl font-bold mb-2">{products[0].name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold">{products[0].price} DA</span>
                        {products[0].colors && (
                          <div className="flex space-x-1">
                            {products[0].colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border-2 border-white bg-muted"
                                title={color}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

              {/* Marketing Content */}
              <Card className="flex items-center">
                <CardContent className="p-8 space-y-6">
                  <Badge className="bg-primary text-primary-foreground">Why Choose Us</Badge>
                  <h3 className="text-2xl font-bold">
                    Best Laptops at Unbeatable Prices
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cta rounded-full" />
                      <span>Free shipping on orders over 20000 DA</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cta rounded-full" />
                      <span>30-day money-back guarantee</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cta rounded-full" />
                      <span>Expert technical support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cta rounded-full" />
                      <span>Authorized dealer warranties</span>
                    </li>
                  </ul>
                  <Link to="/about">
                    <Button>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>

            {/* Most Popular Products */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Most Popular Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>

            {/* For You Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;