import { render, screen } from '@/utils/renderers';

import { QualityData } from './QAPanel';
import { QualityTable } from './QualityTable';

const mockData: QualityData[] = [
  {
    id: 'test-id-1',
    productInfo: { status: 'Good', label: 'Product A' },
    metrology: { status: 'Excellent', label: 'Metrology A' },
    productGeneration: { status: 'Ideal', label: 'Generation A' },
  },
  {
    id: 'test-id-2',
    productInfo: { status: 'Basic', label: 'Product B' },
    metrology: { status: 'Verified', label: 'Metrology B' },
    productGeneration: { status: 'Excellent', label: 'Generation B' },
  },
];

describe('QualityTable', () => {
  it('should render the table with headers', () => {
    render(<QualityTable data={[]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /quality information/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /product information/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /metrology/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /product generation/i })).toBeInTheDocument();
  });

  it('should render the table rows based on data', () => {
    render(<QualityTable data={mockData} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(4); // 2 header row + 2 data rows

    mockData.forEach((data) => {
      const productInfo = screen.getByRole('cell', { name: data.productInfo.label });
      expect(productInfo).toBeInTheDocument();
      expect(productInfo).toHaveClass(data.productInfo.status.toLowerCase());

      const metrology = screen.getByRole('cell', { name: data.metrology.label });
      expect(metrology).toBeInTheDocument();
      expect(metrology).toHaveClass(data.metrology.status.toLowerCase());

      const productGeneration = screen.getByRole('cell', { name: data.productGeneration.label });
      expect(productGeneration).toBeInTheDocument();
      expect(productGeneration).toHaveClass(data.productGeneration.status.toLowerCase());
    });
  });
});
