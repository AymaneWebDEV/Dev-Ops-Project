import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the application title', () => {
  render(<App />);
  // Adjust 'Item Manager' to match the actual text in your UI
  const linkElement = screen.getByText(/Item/i); 
  expect(linkElement).toBeInTheDocument();
});