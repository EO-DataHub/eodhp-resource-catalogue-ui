import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './FavouriteButton.scss';
import { Tooltip } from 'react-tooltip';

import { useCatalogue } from '@/hooks/useCatalogue';
import { favouriteItem, getStacItemUrl, unFavouriteItem } from '@/services/stac';
import { StacItem } from '@/typings/stac';

type FavouriteButtonProps = {
  isFavourite: boolean;
  item: StacItem;
};

export const FavouriteButton = ({ isFavourite, item }: FavouriteButtonProps) => {
  const {
    state: { favouritedItems },
    actions: { setFavouritedItems },
  } = useCatalogue();

  const handleClick = () => {
    const selfUrl = getStacItemUrl(item);

    console.log('Item ::', item);

    // If not favourited
    if (!isFavourite) {
      setFavouritedItems(item.collection, [...(favouritedItems[item.collection] ?? []), item.id]);
      favouriteItem(selfUrl);
    } else {
      const favItemsInCollection = favouritedItems[item.collection];
      const newFavouritedItems = new Set([...favItemsInCollection].filter((id) => id !== item.id));
      setFavouritedItems(item.collection, Array.from(newFavouritedItems));
      unFavouriteItem(selfUrl);
    }
  };

  return (
    <div className="favourite">
      <Tooltip id="favourite-button" />
      <button
        className="btn"
        data-tooltip-content="Favourite"
        data-tooltip-id="favourite-button"
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};
