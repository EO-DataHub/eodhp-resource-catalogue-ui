import { useCatalogue } from "@/hooks/useCatalogue";
import { useFilters } from "@/hooks/useFilters";
import { getStacCollections } from "@/services/stac";
import { FaMap } from "react-icons/fa";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import './styles.scss';
import { useApp } from "@/hooks/useApp";

const TopBar: React.FC = () => {
  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  const { state: CatalogueState, actions: CatalogueActions } = useCatalogue();
  const { collectionSearchResults, textQuery, activePage } = CatalogueState;
  const { setCollectionSearchResults, setTextQuery, setActivePage } = CatalogueActions;

  const { state: FilterState, actions: FilterActions } = useFilters();
  const { activeFilters } = FilterState;
  const { setActiveFilters } = FilterActions;

  const handleClick = async (): Promise<void> => {
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
          <FaMap 
            className="top-bar__actions-icon"
            onClick={() => setActiveContent('map')}
          />
        </div>
      </div>
      <div className="top-bar__pagination">
        <ResponsivePagination
          current={activePage}
          // for the total we need to divide the total number of collections by the number of items per page and then round up
          total={Math.ceil(collectionSearchResults?.length / 6) || 1}
          onPageChange={(e) => {
            setActivePage(e)
          }}
        />
      </div>
    </div>
  )

}

export default TopBar;