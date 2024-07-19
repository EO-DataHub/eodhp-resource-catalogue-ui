import { FaMap } from "react-icons/fa";
import './styles.scss';
import { useCatalogue } from "@/hooks/useCatalogue";
import { useContext } from "react";
import { getStacCollections } from "../../../../services/stac";
import { FilterContext } from "../../../../context/FilterContext";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const TopBar: React.FC = () => {
  const { state: CatalogueState, actions: CatalogueActions } = useCatalogue();
  const { collectionSearchResults, textQuery, activePage } = CatalogueState;
  const { setCollectionSearchResults, setTextQuery, setActivePage } = CatalogueActions;

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
          }} />

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
          total={Math.ceil(collectionSearchResults?.length / 6)}
          onPageChange={(e) => {
            setActivePage(e)
          }}
        />
      </div>
    </div>
  )

}

export default TopBar;