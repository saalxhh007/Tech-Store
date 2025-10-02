import { useState } from 'react';
import { Button } from './../components/ui/button';
import { Card } from './../components/ui/card';
import { Checkbox } from './../components/ui/checkbox';
import { Label } from './../components/ui/label';
import { Slider } from './../components/ui/slider';
import { Separator } from './../components/ui/separator';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  availability: string[];
}

interface ProductFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const ProductFilter = ({ isOpen, onToggle, filters, onFiltersChange }: ProductFilterProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { id: 'laptops', label: 'Laptops' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'laptop-parts', label: 'Laptop Parts' },
  ];

  const brands = [
    { id: 'techpro', label: 'TechPro' },
    { id: 'airtech', label: 'AirTech' },
    { id: 'gamegear', label: 'GameGear' },
    { id: 'keycraft', label: 'KeyCraft' },
    { id: 'memorymax', label: 'MemoryMax' },
    { id: 'speeddrive', label: 'SpeedDrive' },
  ];

  const availabilityOptions = [
    { id: 'in-stock', label: 'In Stock' },
    { id: 'limited-stock', label: 'Limited Stock' },
    { id: 'out-of-stock', label: 'Out of Stock' },
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...localFilters.categories, categoryId]
      : localFilters.categories.filter(c => c !== categoryId);
    
    setLocalFilters({ ...localFilters, categories: updatedCategories });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const updatedBrands = checked
      ? [...localFilters.brands, brandId]
      : localFilters.brands.filter(b => b !== brandId);
    
    setLocalFilters({ ...localFilters, brands: updatedBrands });
  };

  const handleAvailabilityChange = (availabilityId: string, checked: boolean) => {
    const updatedAvailability = checked
      ? [...localFilters.availability, availabilityId]
      : localFilters.availability.filter(a => a !== availabilityId);
    
    setLocalFilters({ ...localFilters, availability: updatedAvailability });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, priceRange: [value[0], value[1]] });
  };

  const handleRatingChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, rating: value[0] });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: [0, 1000000] as [number, number],
      rating: 0,
      availability: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {isOpen && <X className="h-4 w-4 ml-auto" />}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`lg:block ${isOpen ? 'block' : 'hidden'} p-6 space-y-6`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-medium">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={localFilters.categories.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <h4 className="font-medium">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={localFilters.brands.includes(brand.id)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={brand.id}
                  className="text-sm cursor-pointer"
                >
                  {brand.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Range</h4>
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              max={1000000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{localFilters.priceRange[0]} DA</span>
              <span>{localFilters.priceRange[1]} DA</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="font-medium">Minimum Rating</h4>
          <div className="px-2">
            <Slider
              value={[localFilters.rating]}
              onValueChange={handleRatingChange}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-2">
              {localFilters.rating} stars & up
            </div>
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <h4 className="font-medium">Availability</h4>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={localFilters.availability.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange(option.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </Card>
    </>
  );
};

export default ProductFilter;