import { HttpResponse, http, server } from '@/mocks/server';
import { Collection } from '@/typings/stac';
import { render, screen, waitFor } from '@/utils/renderers';

import { DataCatalogueRow } from './DataCatalogueRow';

const mockParent = {
  id: 'parent-catalog',
  title: 'Test Parent Catalog',
};

const mockRow: Collection = {
  id: '1',
  title: 'Test Collection',
  description: 'A test collection',
  lastUpdated: '2023-01-01',
  stacUrl: 'http://example.com',
  thumbnailUrl: 'http://example.com/thumbnail.jpg',
  type: 'Collection',
  links: [
    {
      rel: 'parent',
      href: 'http://example.com/parent',
    },
  ],
  stac_version: '1.0.0',
  license: '',
  extent: undefined,
};

describe('DataCatalogueRow', () => {
  it('should render loading state initially', () => {
    render(<DataCatalogueRow row={mockRow} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render row data after fetching parent data', async () => {
    server.use(
      http.get('*/parent', () => {
        return HttpResponse.json(mockParent);
      }),
    );

    render(<DataCatalogueRow row={mockRow} />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText(mockRow.title)).toBeInTheDocument();
    expect(screen.getByText(mockRow.description)).toBeInTheDocument();
    expect(screen.getByText(`Updated ${mockRow.lastUpdated}`)).toBeInTheDocument();
    expect(screen.getByText(mockParent.title)).toBeInTheDocument();
  });

  it('should handle fetch error gracefully', async () => {
    server.use(
      http.get('*/parent', () => {
        return new HttpResponse('Not Found', { status: 404 });
      }),
    );

    render(<DataCatalogueRow row={mockRow} />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText(mockRow.title)).toBeInTheDocument();
    expect(screen.getByText(mockRow.description)).toBeInTheDocument();
    expect(screen.getByText(`Updated ${mockRow.lastUpdated}`)).toBeInTheDocument();
    expect(screen.queryByText(mockParent.title)).not.toBeInTheDocument();
  });
});
