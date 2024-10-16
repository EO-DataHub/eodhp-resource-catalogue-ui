import React, { useMemo } from 'react';

import { useCatalogue } from '@/hooks/useCatalogue';
import { useFilters } from '@/hooks/useFilters';

import './styles.scss';
import { DataCatalogueRow } from './DataCatalogueRow';

const itemsPerPage = 6; // TODO: Move to context and make it configurable

const DataCatalogueTable: React.FC = () => {
  const { state: CatalogueState } = useCatalogue();
  const { collectionSearchResults, activePage } = CatalogueState;

  const { state: FilterState } = useFilters();
  const { activeFilters } = FilterState;

  const items = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return collectionSearchResults?.slice(start, end) || [];
  }, [collectionSearchResults, activePage]);

  return (
    <div className="data-catalogue-table">
      <div className="data-catalogue-table__query">
        {activeFilters.textQuery ? (
          <span>Search results for &ldquo;{activeFilters.textQuery}&rdquo;</span>
        ) : null}
      </div>
      {items.map((row) => (
        <DataCatalogueRow key={row.id} row={row} />
      ))}

      {collectionSearchResults?.length === 0 && (
        <div className="data-catalogue-table__no-results">
          <span>No results found for &ldquo;{activeFilters.textQuery}&rdquo;</span>
        </div>
      )}
    </div>
  );
};

export default DataCatalogueTable;
