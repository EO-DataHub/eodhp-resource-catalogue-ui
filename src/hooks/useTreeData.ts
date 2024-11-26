import { useEffect, useState } from 'react';

import { Collection, Link } from '@/typings/stac';
import { fetchData } from '@/utils/genericUtils';

const CATALOG_URL = `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs`;

const fetchCatalog = async (url: string): Promise<TreeCatalog> => {
  try {
    const catalogData = await fetchData(url);

    const subCatalogs: TreeCatalog[] = await Promise.all(
      catalogData?.links
        ?.filter((link: Link) => link.rel === 'child' && !link.href.includes('/collections'))
        .map((link: Link) => fetchCatalog(link.href)) || [],
    );

    const collectionUrl = catalogData?.links
      ?.filter((link: Link) => link.rel === 'data' && link.href.includes('/collections'))
      .map((link: Link) => link.href)[0];

    let collections: Collection[] = [];
    if (collectionUrl) {
      const collectionsResponse = await fetchData(collectionUrl);
      collections = collectionsResponse.collections;
    }

    return {
      ...catalogData,
      catalogs: subCatalogs,
      collections,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const useTreeData = () => {
  const [treeData, setTreeData] = useState<TreeCatalog[]>([]);

  useEffect(() => {
    const fetchRoots = async () => {
      try {
        const parsedRootCatalogUrl = `${CATALOG_URL}?limit=99999`;
        const rootsResponse = await fetchData(parsedRootCatalogUrl);

        const catalogs = rootsResponse.catalogs ? rootsResponse.catalogs : [rootsResponse];

        const rootCatalogUrls = catalogs.reduce((acc, obj) => {
          const selfLink = obj.links.find((link: Link) => link.rel === 'self');
          if (selfLink) {
            acc.push(selfLink.href);
          }
          return acc;
        }, []);

        const topLevelCatalogs = await Promise.all(
          rootCatalogUrls.map((url: string) => fetchCatalog(url)),
        );

        setTreeData(topLevelCatalogs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoots();
  }, []);

  return treeData;
};
