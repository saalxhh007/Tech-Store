import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Button } from './../../components/ui/button';
import { categories, Category } from './../../data/mockData';
import { useState } from 'react';
import CategoryFormDialog from '../../components/admin/CategoryFormDialog';
import axios from 'axios';

export default function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button className="gap-2" onClick={() => {
          setDialogMode('add');
          setSelectedCategory(undefined);
          setDialogOpen(true);
        }}>
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories && categories.length > 0 ?
          (categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-secondary" onClick={() => {
                    setDialogMode('edit');
                    setSelectedCategory(category);
                    setDialogOpen(true);
                  }}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 size={16}/>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={category.image ?? "/placeholder.svg"}
                alt={category.name ?? ""}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <p className="text-sm font-medium mt-2">
                {category.productCount} products
              </p>
            </CardContent>
          </Card>
          ))) : (
            <p>No products available.</p>
          )}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        mode={dialogMode}
      />
    </div>
  );
}
