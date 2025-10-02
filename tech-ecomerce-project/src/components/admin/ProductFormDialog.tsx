import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './../../components/ui/dialog';
import { Button } from './../../components/ui/button';
import { Input } from './../../components/ui/input';
import { Label } from './../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../../components/ui/select';
import { Textarea } from './../../components/ui/textarea';
import { Product } from './../../data/mockData';
import { useToast } from './../../hooks/use-toast';
import axios from 'axios';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  mode: 'add' | 'edit';
  fetchProducts: () => void;
}

export default function ProductFormDialog({ open, onOpenChange, product, mode, fetchProducts }: ProductFormDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    name: string;
    category: 'laptops' | 'accessories' | 'laptop-parts';
    price: number;
    availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
    description: string;
    brand: string;
    mainImage: string; 
    file?: File;
  }>({
    name: product?.name || '',
    category: product?.category || 'laptops',
    price: product?.price || 0,
    availability: product?.availability || 'In Stock',
    description: product?.description || '',
    brand: product?.brand || '',
    mainImage: product?.mainImage || '',
  });

  const apiUrl = process.env.REACT_APP_API;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        // First create product without image
        const productRes = await axios.post(`${apiUrl}/v1/api/product`, {
          ...formData,
          mainImage: "", // initially empty
        });

        const createdProduct = productRes.data;

        // Then upload the file
        if (formData.file) {
          const imgData = new FormData();
          imgData.append("image", formData.file);
          imgData.append("productId", createdProduct._id);

          const uploadRes = await axios.post(`${apiUrl}/v1/api/images`, imgData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // ✅ Update product with the main image URL
          await axios.put(`${apiUrl}/v1/api/product/${createdProduct._id}`, {
            ...createdProduct,
            mainImage: uploadRes.data.url,
          });
        }

        toast({
          title: "Product Added",
          description: `${createdProduct.name} has been added successfully.`,
        });
      } else {
        // UPDATE
        const productRes = await axios.put(`${apiUrl}/v1/api/product/${product?._id}`, formData);
        const updatedProduct = productRes.data;

        if (formData.file) {
          const imgData = new FormData();
          imgData.append("image", formData.file);
          imgData.append("productId", updatedProduct._id);

          const uploadRes = await axios.post(`${apiUrl}/v1/api/images`, imgData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          await axios.put(`${apiUrl}/v1/api/product/${updatedProduct._id}`, {
            ...updatedProduct,
            mainImage: uploadRes.data.url,
          });
        }

        toast({
          title: "Product Updated",
          description: `${updatedProduct.name} has been updated successfully.`,
        });
      }

      fetchProducts();
      onOpenChange(false);

    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong while saving the product.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="laptop-parts">Laptop Parts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (DA)</Label>
              <Input
                id="price"
                type="number"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) => setFormData({ ...formData, availability: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Limited Stock">Limited Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            type="file"
            accept="image/*"
            name="image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const fileList = e.target.files;
              if (fileList && fileList.length > 0) {
                setFormData((prev) => ({
                  ...prev,
                  file: fileList[0],
                }));
              }
            }}
          />
          {formData.file && (
              <img
                src={URL.createObjectURL(formData.file) ?? "/placeholder.svg"}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-md border"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
