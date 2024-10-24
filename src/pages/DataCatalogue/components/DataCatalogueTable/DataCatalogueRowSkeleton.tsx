import './DataCatalogueRowSkeleton.scss';

export const DataCatalogueRowSkeleton = () => {
  return (
    <output aria-busy="true" className="skeleton-row">
      <div className="skeleton-content">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>

      <div className="skeleton-thumbnail" />
      <div className="skeleton-type skeleton" />
    </output>
  );
};
