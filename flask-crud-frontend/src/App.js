import { useState, useEffect } from 'react';
import useItems from './hooks/useItems';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { items, loading, error, loadItems, addItem, editItem, removeItem } = useItems();

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, loadItems]);

  const handleSubmit = async (formData) => {
    if (editingItem) {
      await editItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      await addItem(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await removeItem(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Item Manager</h1>
          <p className="text-gray-600">Create, manage, and organize your items, Ahmed Aymane Harty</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <ItemForm
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <ItemList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}