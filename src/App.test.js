import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Lorcana Ink Curve Calculator/i);
  expect(headingElement).toBeInTheDocument();
});
