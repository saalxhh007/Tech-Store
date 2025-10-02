import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { Badge } from './../../components/ui/badge';
import { Input } from './../../components/ui/input';
import { fetchProducts, Product } from './../../data/mockData';
import ProductFormDialog from '../../components/admin/ProductFormDialog';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  const apiUrl = process.env.REACT_APP_API
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);
  
  const deleteProduct = async (id: any) => {
    try {
      await axios.delete(`${apiUrl}/v1/api/product/${id}`);
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Button className="gap-2" onClick={() => {
          setDialogMode('add');
          setSelectedProduct(undefined);
          setDialogOpen(true);
        }}>
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts && filteredProducts.length > 0 ?
                (filteredProducts.map((product) => (
                <TableRow key={product._id} className="hover:bg-muted/50">
                  <TableCell>
                    <img
                      src={`${apiUrl}${product.mainImage}`}
                      alt={product.name ?? ""}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      product.availability === 'In Stock' ? 'bg-secondary' : 
                      product.availability === 'Limited Stock' ? 'bg-cta' : 
                      'bg-destructive'
                    }>
                      {product.availability}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{product.price.toFixed(2)} DA</TableCell>
                  <TableCell>⭐ {product.rating}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-secondary hover:text-secondary-foreground"
                        onClick={() => {
                          setDialogMode('edit');
                          setSelectedProduct(product);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        onClick={() => {deleteProduct(product._id)}}  
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 size={16}/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))): (
                  <p>No products available.</p>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        mode={dialogMode}
        fetchProducts={loadProducts}
      />
    </div>
  );
}
