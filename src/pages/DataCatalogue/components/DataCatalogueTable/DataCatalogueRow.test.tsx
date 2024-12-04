import React from 'react';

import { AppProvider } from '@/context/AppContext';
import { ToolboxProvider } from '@/context/ToolboxContext';
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
    render(
      <React.StrictMode>
        <ToolboxProvider>
          <AppProvider>
            <DataCatalogueRow row={mockRow} />
          </AppProvider>
        </ToolboxProvider>
      </React.StrictMode>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render row data after fetching parent data', async () => {
    server.use(
      http.get('*/parent', () => {
        return HttpResponse.json(mockParent);
      }),
    );

    render(
      <React.StrictMode>
        <ToolboxProvider>
          <AppProvider>
            <DataCatalogueRow row={mockRow} />
          </AppProvider>
        </ToolboxProvider>
      </React.StrictMode>,
    );

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

    render(
      <React.StrictMode>
        <ToolboxProvider>
          <AppProvider>
            <DataCatalogueRow row={mockRow} />
          </AppProvider>
        </ToolboxProvider>
      </React.StrictMode>,
    );

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText(mockRow.title)).toBeInTheDocument();
    expect(screen.getByText(mockRow.description)).toBeInTheDocument();
    expect(screen.getByText(`Updated ${mockRow.lastUpdated}`)).toBeInTheDocument();
    expect(screen.queryByText(mockParent.title)).not.toBeInTheDocument();
  });
});
