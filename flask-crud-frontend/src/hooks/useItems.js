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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (data) => {
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
  }, [loadItems]);

  const editItem = useCallback(async (id, data) => {
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
  }, [loadItems]);

  const removeItem = useCallback(async (id) => {
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
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    loadItems,
    addItem,
    editItem,
    removeItem,
  };
};

export default useItems;