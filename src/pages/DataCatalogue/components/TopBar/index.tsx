import { AiOutlineFullscreen } from "react-icons/ai";
import ReactPaginate from 'react-paginate';
import './styles.scss';

const TopBar: React.FC = () => {

  return (
    <div className="top-bar">

      <div className="top-bar__controls">
        <div className="top-bar__searchbox-container">
          <input type="text" placeholder="Search" />
          <button className="top-bar__searchbox-button">
            Search
          </button>

        </div>
        <div className="top-bar__actions-container">
          <AiOutlineFullscreen />
        </div>
      </div>

      <div className="top-bar__pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          previousLabel="< Previous"
          pageCount={400}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          className="pagination"
          renderOnZeroPageCount={null}
          onPageChange={(e) => {
            console.log('User requested page number', e.selected)
          }}
        />
      </div>
    </div>
  )

}

export default TopBar;