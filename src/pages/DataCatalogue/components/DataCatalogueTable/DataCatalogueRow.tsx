import { useEffect, useState } from 'react';

import { Collection } from '@/typings/stac';

import { DataCatalogueRowSkeleton } from './DataCatalogueRowSkeleton';

type DataCatalogueRowProps = {
  row: Collection;
};

type ParentData = {
  id: string;
  title: string;
  links?: { rel: string; href: string }[];
};

export const DataCatalogueRow = ({ row }: DataCatalogueRowProps) => {
  const [breadcrumb, setBreadcrumb] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentData = async (url: string): Promise<ParentData | null> => {
      try {
        const response = await fetch(url);
        const parentData = await response.json();
        return parentData;
      } catch (error) {
        console.error('Error fetching parent data:', error);
        return null;
      }
    };

    const buildBreadcrumbTrail = async () => {
      const trail: ParentData[] = [];
      let currentUrl = row.links?.find((link) => link.rel === 'parent')?.href;

      while (currentUrl) {
        const parentData = await fetchParentData(currentUrl);
        if (parentData) {
          trail.push(parentData);
          currentUrl = parentData.links?.find((link) => link.rel === 'parent')?.href || null;
        } else {
          currentUrl = null;
        }
      }

      setBreadcrumb(trail.reverse());
      setLoading(false);
    };

    buildBreadcrumbTrail();
  }, [row]);

  if (loading) {
    return <DataCatalogueRowSkeleton />;
  }

  return (
    <button
      key={row.id}
      className="data-catalogue-table__row"
      onClick={() => window.open(row.stacUrl, '_blank')}
    >
      <div className="data-catalogue-table__row-content">
        <div className="data-catalogue-table__row-information">
          <span>{row.title || row.id}</span>
          <span>{row.description}</span>
          <span>Updated {row.lastUpdated}</span>
          {breadcrumb.length > 0 && (
            <span>
              Parent Catalogue:{' '}
              {breadcrumb.map((parent, index) => (
                <span key={`${parent.id}-${row.id}`}>
                  {parent.title !== '' ? parent.title : parent.id}
                  {index < breadcrumb.length - 1 && ' > '}
                </span>
              ))}
            </span>
          )}
        </div>

        <div className="data-catalogue-table__row-thumbnail">
          <img alt="Thumbnail" src={row.thumbnailUrl} />
        </div>
      </div>

      <div className="data-catalogue-table__row-type">
        <span>{row.type}</span>
      </div>
    </button>
  );
};
