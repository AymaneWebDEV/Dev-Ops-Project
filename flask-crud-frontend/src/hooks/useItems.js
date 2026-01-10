import { useState } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../Api';

const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchItems(query);
      setItems(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await createItem(data);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Failed to create item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editItem = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateItem(id, data);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Failed to update item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteItem(id);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, loadItems, addItem, editItem, removeItem };
};

export default useItems;