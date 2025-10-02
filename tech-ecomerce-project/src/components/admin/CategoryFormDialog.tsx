import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './../../components/ui/dialog';
import { Button } from './../../components/ui/button';
import { Input } from './../../components/ui/input';
import { Label } from './../../components/ui/label';
import { Textarea } from './../../components/ui/textarea';
import { Category } from './../../data/mockData';
import { useToast } from './../../hooks/use-toast';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  mode: 'add' | 'edit';
}

export default function CategoryFormDialog({ open, onOpenChange, category, mode }: CategoryFormDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === 'add' ? 'Category Added' : 'Category Updated',
      description: `${formData.name} has been ${mode === 'add' ? 'added' : 'updated'} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Category' : 'Edit Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., laptops"
              required
            />
          </div>

          <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
        <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                // Create a preview URL for immediate display
                const previewUrl = URL.createObjectURL(file);
                setFormData({ ...formData, image: previewUrl });
            }
            }}
          />
          {formData.image && (
              <img
                src={formData.image ?? "/placeholder.svg"}
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
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Category' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
