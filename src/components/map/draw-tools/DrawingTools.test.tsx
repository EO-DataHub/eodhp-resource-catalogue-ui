// import { Modify } from 'ol/interaction';
import { Mock } from 'vitest';

import { useMap } from '@/hooks/useMap';
import { render, screen, userEvent } from '@/utils/renderers';

import { DrawingTools } from './DrawingTools';

// Mock the `useMap` hook and OpenLayers-related functionality
vi.mock('@/hooks/useMap', () => ({
  useMap: vi.fn(),
}));

vi.mock('ol/source/Vector', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addFeature: vi.fn(),
      clear: vi.fn(),
      getFeatures: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  };
});

vi.mock('ol/layer/Vector', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setZIndex: vi.fn(),
    })),
  };
});

describe('DrawingTools', () => {
  const mockMap = {
    addInteraction: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
  };

  beforeEach(() => {
    (useMap as Mock).mockReturnValue({ map: mockMap });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the drawing tools button', () => {
    render(<DrawingTools />);

    // Check that the button is rendered
    expect(
      screen.getByRole('button', { name: /display drawing tools panel/i }),
    ).toBeInTheDocument();
  });

  it('should toggle the DrawingToolbox visibility when the button is clicked', async () => {
    render(<DrawingTools />);

    const button = screen.getByRole('button', { name: /display drawing tools panel/i });

    // DrawingToolbox should not be visible initially
    const toolbox = screen.queryByRole('region', { name: /drawing-toolbox/i });
    expect(toolbox).toHaveClass('closed');

    // Click the button to open the DrawingToolbox
    await userEvent.click(button);
    expect(toolbox).toHaveClass('open');

    // Click the button again to close the DrawingToolbox
    await userEvent.click(button);
    expect(toolbox).toHaveClass('closed');
  });

  it('should add and remove layers from the map on mount and unmount', () => {
    const { unmount } = render(<DrawingTools />);

    // Check that the layer was added to the map
    expect(mockMap.addLayer).toHaveBeenCalled();

    // Unmount the component
    unmount();

    // Check that the layer was removed from the map
    expect(mockMap.removeLayer).toHaveBeenCalled();
  });

  // it('should add Modify interaction to the map', () => {
  //   render(<DrawingTools />);

  //   // Check that Modify interaction was added to the map
  //   expect(mockMap.addInteraction).toHaveBeenCalledWith(expect.any(Modify));
  // });
});
