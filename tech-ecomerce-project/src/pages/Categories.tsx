import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from './../components/ui/button';
import { Card } from './../components/ui/card';
import ProductCard from './../components/ProductCard';
import ProductFilter from './../components/ProductFilter';
import { categories, fetchProducts, Product } from './../data/mockData';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Badge } from './../components/ui/badge';

const Categories = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { category } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    categories: category ? [category] : [] as string[],
    brands: [] as string[],
    priceRange: [0, 1000000] as [number, number],
    rating: 0,
    availability: [] as string[],
  });

  const [sortBy, setSortBy] = useState('featured');

  const categoryInfo = categories.find(cat => cat.slug === category);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product : Product) => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category.toLocaleLowerCase())) {
        return false;
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand.toLowerCase().replace(' ', '') )) {
        return false;
      }

      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      if (product.rating < filters.rating) {
        return false;
      }

      if (filters.availability.length > 0) {
        const availabilityMap: { [key: string]: string } = {
          'in-stock': 'In Stock',
          'limited-stock': 'Limited Stock',
          'out-of-stock': 'Out of Stock',
        };
        const mappedAvailability = filters.availability.map(a => availabilityMap[a]);
        if (!mappedAvailability.includes(product.availability)) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  }, [filters, sortBy, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      {categoryInfo && (
        <section className="bg-accent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">{categoryInfo.name}</h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {filteredProducts.length} products available
            </Badge>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-input rounded-md px-3 py-2 bg-background"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-input rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={() => setFilters({
                  categories: category ? [category] : [],
                  brands: [],
                  priceRange: [0, 2000],
                  rating: 0,
                  availability: [],
                })}>
                  Clear Filters
                </Button>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;