import { useCatalogue } from '@/hooks/useCatalogue';
import { useFilters } from '@/hooks/useFilters';
import React, { useMemo } from 'react';
import './styles.scss';

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
  }
    , [collectionSearchResults, activePage]);

  return (
    <div className="data-catalogue-table">
      <div className="data-catalogue-table__query">
        {activeFilters.textQuery && <p>Search results for "{activeFilters.textQuery}"</p>}
      </div>
      {items.map(row => {
        return (
          <div key={row.id} className="data-catalogue-table__row">
            <div className="data-catalogue-table__row-content">
              <div className="data-catalogue-table__row-information">
                <h3>{row.title || row.id}</h3>
                <p>{row.description}</p>
                <p>Updated {row.lastUpdated}</p>
              </div>
              <div className="data-catalogue-table__row-thumbnail">
                <img src={row.thumbnailUrl} alt="Thumbnail" />
              </div>
            </div>
            <div className="data-catalogue-table__row-type">
              <span>
                {row.type}
              </span>
            </div>
          </div>
        )
      }
      )}
      {collectionSearchResults?.length === 0 && (
        <div className="data-catalogue-table__no-results">
          <p>No results found for "{activeFilters.textQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default DataCatalogueTable;