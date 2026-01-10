import { render, screen } from '@testing-library/react';
import App from './App';
import useItems from './hooks/useItems'; // Adjust the path if your hook is elsewhere

// 1. Mock the useItems hook
jest.mock('./hooks/useItems');

test('renders the application header', () => {
  // 2. Define what the mock should return
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
  
  // 3. Check for a piece of text that exists in your UI
  const titleElement = screen.getByText(/Item/i); 
  expect(titleElement).toBeInTheDocument();
});