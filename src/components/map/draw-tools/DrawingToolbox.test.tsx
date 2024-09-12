import { Feature, Map } from 'ol';
import { Geometry } from 'ol/geom';
import { Draw, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';

import { render, screen, userEvent } from '@/utils/renderers';

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
    render(
      <DrawingToolbox
        drawingSource={mockSource}
        isToolboxVisible={isToolboxVisible}
        map={mockMap}
      />,
    );

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

  it.each(['box', 'Polygon', 'Circle'])(
    'should trigger drawShape for `%s` drawing',
    async (shape) => {
      const { mockMap } = setup();
      const user = userEvent.setup();

      // Simulate a user clicking the tool button
      const tool = screen.getByRole('button', { name: shape });
      await user.click(tool);

      // Verify that the draw and snap interactions have been added to the map
      // Note: There are 10 defaults, so while it isn't the best te
      expect(mockMap.getInteractions().getArray()).toHaveLength(12);
      expect(
        mockMap
          .getInteractions()
          .getArray()
          .some((interaction) => interaction instanceof Draw),
      ).toBeTruthy();
      expect(
        mockMap
          .getInteractions()
          .getArray()
          .some((interaction) => interaction instanceof Snap),
      ).toBeTruthy();
    },
  );
});
