import { Feature, Map } from 'ol';
import { Geometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';

import { render, screen } from '@/utils/renderers';

import { DrawingToolbox } from './DrawingToolbox';

// Mocking the necessary imports from OpenLayers
vi.mock('ol/interaction/Draw', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Draw: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      setActive: vi.fn(),
    })),
    createBox: vi.fn(() => 'mockedBoxFunction'), // Mock createBox function
  };
});
vi.mock('ol/interaction/Snap', () => ({
  Snap: vi.fn(),
}));

vi.mock('ol/geom/Polygon', () => ({
  fromCircle: vi.fn(),
}));

vi.mock('ol/format/GeoJSON', () => ({
  GeoJSON: vi.fn(() => ({
    writeGeometryObject: vi.fn(),
  })),
}));

describe('DrawingToolbox', () => {
  const setup = (isToolboxVisible = true) => {
    const mockMap = new Map(); // Creating a mock map object
    const mockSource = new VectorSource<Feature<Geometry>>(); // Creating a mock source

    // Rendering the DrawingToolbox component
    render(<DrawingToolbox isDrawingToolboxVisible={isToolboxVisible} map={mockMap} />);

    return { mockMap, mockSource };
  };

  it('should render the drawing toolbox when visible', () => {
    setup();

    const toolbox = screen.getByRole('region', { name: /drawing-toolbox/i });
    // Ensure the toolbox is rendered
    expect(toolbox).toBeInTheDocument();
    // Ensure the toolbox is rendered with the open class
    expect(toolbox).toHaveClass('open');
  });

  it('should render closed state when toolbox is not visible', () => {
    setup(false);

    // Ensure the toolbox is rendered with the closed class
    expect(screen.getByRole('region', { name: /drawing-toolbox/i })).toHaveClass('closed');
  });
});
