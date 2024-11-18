import { useCallback, useEffect, useState } from 'react';

import { FaRegWindowMinimize } from 'react-icons/fa';

import { Tree } from '@/components/tree/Tree';
import { useToolbox } from '@/hooks/useToolbox';
import { Collection, Link } from '@/typings/stac';
import { getCatalogueFromURL } from '@/utils/urlHandler';

import { AssetsPanel } from './components/item-assets/AssetsPanel';
import { PurchaseFormPanel } from './components/purchases/PurchaseFormPanel';
import ToolboxCollections from './components/ToolboxCollections';
import ToolboxItems from './components/ToolboxItems';

import './styles.scss';

const CATALOG_URL = `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs`;

// Utility function to fetch data from a given URL
const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return response.json();
};

export type TreeCatalog = {
  id: string;
  title: string;
  type: 'Catalog';
  catalogs?: TreeCatalog[]; // sub-catalogs
  collections?: Collection[]; // collections
};

const Toolbox = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // TODO: Move to context
  const [treeData, setTreeData] = useState<TreeCatalog[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

  const catalogPath = getCatalogueFromURL();

  const catalogUrl = catalogPath ? `${CATALOG_URL}/${catalogPath}` : CATALOG_URL;

  const {
    state: { activePage },
  } = useToolbox();

  // Recursive function to fetch and build the tree structure
  const fetchCatalog = useCallback(async (url: string): Promise<TreeCatalog> => {
    try {
      const catalogData = await fetchData(url);

      // Check if the current catalog has sub-catalogs or collections
      const subCatalogs: TreeCatalog[] = await Promise.all(
        catalogData?.links
          ?.filter((link) => link.rel === 'child' && !link.href.includes('/collections'))
          .map((link: Link) => fetchCatalog(link.href)) || [],
      );

      const collectionUrl = catalogData?.links
        ?.filter((link) => link.rel === 'data')
        .filter((link) => link.href.includes('/collections'))
        .map((link) => link.href)[0];

      let collections: Collection[] = [];
      if (collectionUrl) {
        const collectionsResponse = await fetchData(collectionUrl);
        collections = collectionsResponse.collections;
      }

      // Return the catalog with its children (sub-catalogs and collections)
      return {
        ...catalogData,
        catalogs: subCatalogs,
        collections,
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Fetch the ROOTS array of URLs when the component mounts
  useEffect(() => {
    const fetchRoots = async () => {
      try {
        const rootsResponse = await fetchData(catalogUrl);

        const catalogs = rootsResponse.catalogs ? rootsResponse.catalogs : [rootsResponse];

        const rootCatalogUrls = catalogs?.reduce((acc, obj) => {
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
  }, [catalogUrl, fetchCatalog]);

  const renderContent = () => {
    switch (activePage) {
      case 'collections':
        return (
          <Tree
            expandedNodes={expandedNodes}
            setExpandedNodes={setExpandedNodes}
            treeData={treeData}
          />
        );
      case 'items':
        return <ToolboxItems />;
      case 'purchase':
        return <PurchaseFormPanel />;
      case 'assets':
        return <AssetsPanel />;
      default:
        return <ToolboxCollections />;
    }
  };

  return (
    <div className={`toolbox`} id="toolbox">
      <div className="handle toolbox__window-actions">
        <button
          aria-label="minimize toolbox dialog"
          className="minimize"
          onClick={() => setToolboxVisible((prev) => !prev)}
        >
          <FaRegWindowMinimize />
        </button>
      </div>

      {toolboxVisible ? <div className="toolbox__content">{renderContent()}</div> : null}
    </div>
  );
};

export default Toolbox;
