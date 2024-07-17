import { FaMap } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import './styles.scss';
import { CatalogueContext } from "../../../../context/CatalogueContext";
import { useContext, useEffect } from "react";
import { getStacCollections } from "../../../../services/stac";
import { FilterContext } from "../../../../context/FilterContext";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const TopBar: React.FC = () => {
  const { state, actions } = useContext(CatalogueContext);
  const { collectionSearchResults, textQuery, activePage } = state;
  const { setCollectionSearchResults, setTextQuery, setActivePage } = actions;

  const { state: FilterState, actions: FilterActions } = useContext(FilterContext);
  const { activeFilters } = FilterState;
  const { setActiveFilters } = FilterActions;

  const handleClick = async () => {
    try {
      const data = await getStacCollections(textQuery);
      setActiveFilters({
        ...activeFilters,
        textQuery
      });
      setCollectionSearchResults(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  }

  return (
    <div className="top-bar">

      <div className="top-bar__controls">
        <div className="top-bar__searchbox-container">
          <input type="text" placeholder="Search" value={textQuery} onChange={(e) => setTextQuery(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleClick();
            }
          }
          } />

          <button className="top-bar__searchbox-button" onClick={() => handleClick()}>
            Search
          </button>

        </div>
        <div className="top-bar__actions-container">
          <FaMap />
        </div>
      </div>

      <div className="top-bar__pagination">
        <ResponsivePagination
          current={activePage}
          // for the total we need to divide the total number of collections by the number of items per page and then round up
          total={Math.ceil(collectionSearchResults?.collections?.length / 6)}
          onPageChange={(e) => {
            console.log('Page ::', e)
            setActivePage(e)
          }
          }

        />
      </div>
    </div>
  )

}

export default TopBar;