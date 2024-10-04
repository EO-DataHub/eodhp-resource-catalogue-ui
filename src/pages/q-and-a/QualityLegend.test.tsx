import { render, screen } from '@/utils/renderers';

import { QualityLegend } from './QualityLegend';

const KEYS = ['Not Assessed', 'Not Assessable', 'Basic', 'Good', 'Excellent', 'Ideal', 'Verified'];

describe('QualityLegend', () => {
  it('should render the legend with all items', () => {
    render(<QualityLegend />);

    expect(screen.getByRole('list')).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items.length).toStrictEqual(7);
    items.forEach((item) => {
      expect(KEYS.includes(item.textContent)).toBeTruthy();
    });
  });
});
