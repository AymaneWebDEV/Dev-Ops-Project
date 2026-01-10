import { render, screen } from '@testing-library/react';
import App from './App';
import useItems from './hooks/useItems';

// 1. Mock the custom hook
jest.mock('./hooks/useItems');

// 2. Mock child components to avoid "undefined" element errors
jest.mock('./components/ItemForm', () => () => <div data-testid="item-form" />);
jest.mock('./components/SearchBar', () => () => <div data-testid="search-bar" />);
jest.mock('./components/ItemList', () => () => <div data-testid="item-list" />);

test('renders the Item Manager title', () => {
  // Setup the mock return for the hook
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
  
  // 3. Look for your actual title: "Item Manager"
  const titleElement = screen.getByText(/Item Manager/i);
  expect(titleElement).toBeInTheDocument();
});