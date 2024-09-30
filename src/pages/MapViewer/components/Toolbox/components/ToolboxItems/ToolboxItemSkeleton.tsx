import './ToolboxItemSkeleton.scss';

export const ToolboxItemSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="toolbox-row skeleton">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-content">
            <div className="skeleton-title skeleton-text"></div>
            <div className="skeleton-data-points skeleton-text"></div>
            <div className="button-wrapper">
              <div className="skeleton-button skeleton-text"></div>
              <div className="skeleton-button skeleton-text"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
