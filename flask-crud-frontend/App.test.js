import { render, screen } from '@testing-library/react';
import App from './App';
import useItems from './src/hooks/useItems'; // Verify this path matches your file structure

// 1. Mock the entire module containing the hook
jest.mock('./hooks/useItems');

test('renders the application UI successfully', () => {
  // 2. Define exactly what the mock hook should return for this test
  useItems.mockReturnValue({
    items: [],
    loading: false,
    error: null,
    loadItems: jest.fn(),
    addItem: jest.fn(),
    editItem: jest.fn(),
    removeItem: jest.fn(),
  });

  render(<App />);
  
  // 3. Look for a common element in your UI (e.g., an "Add Item" button or title)
  const element = screen.getByText(/Item/i); 
  expect(element).toBeInTheDocument();
});