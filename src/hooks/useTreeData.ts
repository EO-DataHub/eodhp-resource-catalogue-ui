import { useEffect, useState } from 'react';

import { fetchData } from '@/utils/genericUtils';

const CATALOG_URL = `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs`;

export const useTreeData = () => {
  const [treeData, setTreeData] = useState<TreeCatalog[]>([]);

  useEffect(() => {
    const fetchRoots = async () => {
      try {
        const parsedRootCatalogUrl = `${CATALOG_URL}?limit=99999`;
        const rootsResponse = await fetchData(parsedRootCatalogUrl);

        setTreeData(rootsResponse.catalogs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoots();
  }, []);

  return treeData;
};
