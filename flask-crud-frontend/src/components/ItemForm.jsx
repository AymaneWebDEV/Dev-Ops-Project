import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const ItemForm = ({ editingItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (editingItem) {
      setFormData({ name: editingItem.name, description: editingItem.description || '' });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Item' : 'New Item'}</h2>
        {editingItem && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <div className="flex gap-2">
          <button type="submit" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} className="mr-1" /> {editingItem ? 'Update' : 'Create'}
          </button>
          {editingItem && (
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemForm;