
import React, { useContext } from 'react';
import './styles.scss'
import { FilterContext } from '../../../../context/FilterContext';
import { useCatalogue } from '@/hooks/useCatalogue';

const itemsPerPage = 6; // TODO: Move to context and make it configurable

const DataCatalogueTable: React.FC = () => {
  const { state: CatalogueState } = useCatalogue();
  const { collectionSearchResults, activePage } = CatalogueState;

  const { state: FilterState } = useContext(FilterContext);
  const { activeFilters } = FilterState;

  // Get the current page and the number of items per page and returns the items to be displayed
  const getItems = () => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    console.log('collectionSearchResults:', collectionSearchResults);
    return collectionSearchResults?.slice(start, end) || [];
  }

  return (
    <div className="data-catalogue-table">
      <div className="data-catalogue-table__query">
        {activeFilters.textQuery && <p>Search results of "{activeFilters.textQuery}"</p>}
      </div>
      {getItems().map(row => {
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