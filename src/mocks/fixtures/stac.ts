const COLLECTIONS = {
  collections: [
    {
      type: 'Collection',
      stac_version: '1.0.0',
      id: 'another_example_collection',
      title: 'Result Collection',
      description: 'Some other example collection',
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/another_example_collection',
        },
        {
          rel: 'parent',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
        {
          rel: 'items',
          type: 'application/geo+json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/another_example_collection/items',
        },
        {
          rel: 'root',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
      ],
      keywords: ['eoepca'],
      license: 'proprietary',
      extent: {
        spatial: {
          bbox: [[-180, -90, 180, 90]],
        },
        temporal: {
          interval: [['2024-08-21T14:17:40.213000Z', '2024-08-21T14:17:40.213000Z']],
        },
      },
      stac_extensions: [],
      providers: [],
      summaries: {},
      assets: {},
    },
    {
      type: 'Collection',
      stac_version: '1.0.0',
      id: 'another_example_collection_2',
      title: 'Result Collection',
      description: 'Some other example collection',
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/another_example_collection_2',
        },
        {
          rel: 'parent',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
        {
          rel: 'items',
          type: 'application/geo+json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/another_example_collection_2/items',
        },
        {
          rel: 'root',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
      ],
      keywords: ['eoepca'],
      license: 'proprietary',
      extent: {
        spatial: {
          bbox: [[-180, -90, 180, 90]],
        },
        temporal: {
          interval: [['2024-08-21T14:17:40.213000Z', '2024-08-21T14:17:40.213000Z']],
        },
      },
      stac_extensions: [],
      providers: [],
      summaries: {},
      assets: {},
    },
    {
      type: 'Collection',
      stac_version: '1.0.0',
      id: 'example_collection',
      title: 'Result Collection',
      description: 'Some example collection',
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/example_collection',
        },
        {
          rel: 'parent',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
        {
          rel: 'items',
          type: 'application/geo+json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections/example_collection/items',
        },
        {
          rel: 'root',
          type: 'application/json',
          href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall',
        },
      ],
      keywords: ['eoepca'],
      license: 'proprietary',
      extent: {
        spatial: {
          bbox: [[-180, -90, 180, 90]],
        },
        temporal: {
          interval: [['2024-08-21T14:17:40.213000Z', '2024-08-21T14:17:40.213000Z']],
        },
      },
      stac_extensions: [],
      providers: [],
      summaries: {},
      assets: {},
    },
  ],
  links: [
    {
      rel: 'root',
      type: 'application/json',
      href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/',
    },
    {
      rel: 'parent',
      type: 'application/json',
      href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/',
    },
    {
      rel: 'self',
      type: 'application/json',
      href: 'https://dev.eodatahub.org.uk/api/catalogue/stac/catalogs/user-datasets/marksmall/collections',
    },
  ],
};

export const getCollections = () => COLLECTIONS;
