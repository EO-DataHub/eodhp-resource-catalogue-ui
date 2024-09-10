import { Feature as StacFeature } from '@/typings/stac';
import { render, screen, userEvent } from '@/utils/renderers';

import { PurchaseForm } from './PurchaseForm';

describe('PurchaseForm Component', () => {
  const mockSelectedItem: StacFeature = {
    id: 'test id',
    type: 'Feature',
    bbox: [10, 20, 30, 40],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [10, 20],
          [30, 20],
          [30, 40],
          [10, 40],
          [10, 20],
        ],
      ],
    },
    properties: {
      datetime: 'test datetime',
    },
    links: [],
  };

  it('should render the form fields correctly', () => {
    render(<PurchaseForm selectedItem={mockSelectedItem} />);

    expect(screen.getByRole('textbox', { name: /ordername:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /products:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /collection id:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /order size:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /api key:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /contract:/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /licence:/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create order/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<PurchaseForm selectedItem={mockSelectedItem} />);

    await user.click(screen.getByRole('button', { name: /create order/i }));

    const errorMessages = screen.getAllByRole('paragraph', { name: 'field-error' });
    expect(errorMessages).toHaveLength(6);
    errorMessages.forEach((error) =>
      expect(error).toHaveTextContent('Must be at least 3 characters'),
    );
  });

  it('should submit the form with valid data', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const user = userEvent.setup();
    render(<PurchaseForm selectedItem={mockSelectedItem} />);

    await user.type(screen.getByRole('textbox', { name: /ordername:/i }), 'Test Order');
    await user.type(screen.getByRole('textbox', { name: /products:/i }), 'Test Product');
    await user.type(screen.getByRole('textbox', { name: /collection id:/i }), 'Test Collection');
    await user.type(screen.getByRole('textbox', { name: /api key:/i }), 'Test API Key');
    await user.type(screen.getByRole('textbox', { name: /contract:/i }), 'Test Contract');
    await user.type(screen.getByRole('textbox', { name: /licence:/i }), 'Test Licence');

    await user.click(screen.getByRole('button', { name: /create order/i }));

    expect(consoleLogSpy).toHaveBeenCalledWith('SUBMIT FORM DATA: ', {
      name: 'Test Order',
      products: 'Test Product',
      collectionId: 'Test Collection',
      aoi: '4261422.9 km2', // Example area calculation
      apiKey: 'Test API Key',
      contract: 'Test Contract',
      licence: 'Test Licence',
    });

    consoleLogSpy.mockRestore();
  });
});
