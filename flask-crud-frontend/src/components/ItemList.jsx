import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ItemList = ({ items, onEdit, onDelete, loading }) => {
  if (loading) return <div className="text-center py-10 text-blue-600 animate-pulse">Loading items...</div>;
  if (items.length === 0) return <div className="bg-white p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">No items found.</div>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
          <div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={18} /></button>
            <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;