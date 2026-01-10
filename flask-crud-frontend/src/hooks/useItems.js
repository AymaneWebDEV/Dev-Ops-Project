import { useState, useCallback } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../Api';

const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchItems(query);
      setItems(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (data) => {
    try {
      await createItem(data);
      await loadItems();
    } catch (err) {
      setError('Failed to create item');
    }
  }, [loadItems]);

  const editItem = useCallback(async (id, data) => {
    try {
      await updateItem(id, data);
      await loadItems();
    } catch (err) {
      setError('Failed to update item');
    }
  }, [loadItems]);

  const removeItem = useCallback(async (id) => {
    try {
      await deleteItem(id);
      await loadItems();
    } catch (err) {
      setError('Failed to delete item');
    }
  }, [loadItems]);

  return { items, loading, error, loadItems, addItem, editItem, removeItem };
};

export default useItems;