import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const ItemForm = ({ editingItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    description: editingItem?.description || '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingItem]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {editingItem ? 'Edit Item' : 'Create New Item'}
        </h2>
        {editingItem && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Enter item name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onKeyPress={handleKeyPress}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Enter item description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="primary" onClick={handleSubmit}>
            <Plus className="w-4 h-4 inline mr-2" />
            {editingItem ? 'Update' : 'Create'}
          </Button>
          {editingItem && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ItemForm;