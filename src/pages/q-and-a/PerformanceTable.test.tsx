import { render, screen } from '@/utils/renderers';

import { PerformanceTable } from './PerformanceTable';

const mockData = [
  {
    id: 'test-id-1',
    metric: 'Metric A',
    value: 'Value A',
    verified: true,
    result: 'success',
    lastChecked: new Date('2023-01-01'),
  },
  {
    id: 'test-id-2',
    metric: 'Metric B',
    value: 'Value B',
    verified: false,
    result: null,
    lastChecked: new Date('2023-02-01'),
  },
];

describe('PerformanceTable', () => {
  it('should render the table with headers', () => {
    render(<PerformanceTable data={[]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /metric/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /value/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /verified/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /result/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /last checked/i })).toBeInTheDocument();
  });

  it('should render the table rows based on data', () => {
    render(<PerformanceTable data={mockData} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // 1 header row + 2 data rows

    mockData.forEach((data) => {
      expect(screen.getByRole('cell', { name: data.metric })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: data.value })).toBeInTheDocument();
      expect(
        screen.getByRole('cell', { name: data.lastChecked.toLocaleDateString() }),
      ).toBeInTheDocument();
    });
  });

  it('should render the last checked date correctly', () => {
    render(<PerformanceTable data={mockData} />);

    mockData.forEach((data) => {
      expect(
        screen.getByRole('cell', { name: data.lastChecked.toLocaleDateString() }),
      ).toBeInTheDocument();
    });
  });
});
