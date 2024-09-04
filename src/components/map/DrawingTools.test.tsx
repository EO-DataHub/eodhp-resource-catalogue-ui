import type { Map } from 'ol'; // Import Map type

import { render, screen, userEvent } from '@/utils/renderers';

import { DrawingTools } from './DrawingTools';

const mockMap: Partial<Map> = {
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  addInteraction: vi.fn(),
  removeInteraction: vi.fn(),
};

describe('DrawingTools', () => {
  it('should render the DrawingTools component', () => {
    const drawRectangle = vi.fn();

    render(<DrawingTools drawRectangle={drawRectangle} map={mockMap as Map} />);

    expect(screen.getByRole('button', { name: 'Rectangle button' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Rectangle button' })).toBeInTheDocument();

    expect(drawRectangle).not.toHaveBeenCalled();
  });

  it('should call the drawRectangle function when button clicked', async () => {
    const user = userEvent.setup();

    const drawRectangle = vi.fn();

    render(<DrawingTools drawRectangle={drawRectangle} map={mockMap as Map} />);

    await user.click(screen.getByRole('button', { name: 'Rectangle button' }));

    expect(drawRectangle).toHaveBeenCalled();
  });
});
