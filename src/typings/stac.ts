import type { StacAsset, StacExtensions, StacLink, StacRoles, StacVersion } from './common';

/**
 * This object represents Collections in a SpatioTemporal Asset Catalog.
 */

type Keywords = string[];

// type OrganizationRoles = ('producer' | 'licensor' | 'processor' | 'host')[];
type SpatialExtents = [SpatialExtent, ...SpatialExtent[]];
type SpatialExtent = number[];

type TemporalExtents = [TemporalExtent, ...TemporalExtent[]];
type TemporalExtent = [string | null, string | null];

/**
 * These are the fields specific to a STAC Collection.
 *
 * All other fields are inherited from STAC Catalog.
 */
export interface Collection {
  /**
   * The STAC version the Collection implements.
   */
  stac_version: StacVersion;
  /**
   * 	A list of extension identifiers the Collection implements.
   */
  stac_extensions?: StacExtensions;
  /**
   * Must be set to Collection to be a valid Collection.
   */
  type: 'Collection';
  /**
   * Identifier for the Collection that is unique across the provider.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#id
   */
  id: string;
  /**
   * A short descriptive one-line title for the Collection.
   */
  title?: string;
  /**
   * Detailed multi-line description to fully explain the Catalog.
   *
   * [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation.
   */
  description: string;
  /**
   * List of keywords describing the Collection.
   */
  keywords?: Keywords;
  /**
   * Collection's license(s), either a SPDX License identifier, `various` if multiple licenses apply or `proprietary` for all other cases.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#license
   */
  license: 'various' | 'proprietary' | string;
  /**
   * A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#provider-object
   */
  providers?: {
    /**
     * The name of the organization or the individual.
     */
    name: string;
    /**
     * Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. CommonMark 0.29 syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * Roles of the provider. Any of licensor, producer, processor or host.
     */
    roles?: StacRoles[];
    /**
     * Homepage on which the provider describes the dataset and publishes contact information.
     */
    url?: string;
    [k: string]: unknown;
  }[];
  /**
   * Spatial and temporal extents.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#extent-object
   */
  extent: Extents;
  /**
   * Dictionary of asset objects that can be downloaded, each with a unique key.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#assets
   */
  assets?: { [k: string]: StacAsset };
  /**
   * A list of references to other documents.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#link-object
   */
  links: StacLink[];
  /**
   * A map of property summaries, either a set of values, a range of values or a JSON Schema.
   *
   * https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#summaries
   */
  summaries?: Summaries;
  thumbnailUrl?: string; // This not part of the spec, but is added for convenience.
  stacUrl?: string; // This not part of the spec, but is added for convenience.
  lastUpdated?: string; // This not part of the spec, but is added for convenience.
  [k: string]: unknown;
}

interface Extents {
  spatial: SpatialExtentObject;
  temporal: TemporalExtentObject;
  [k: string]: unknown;
}
interface SpatialExtentObject {
  bbox: SpatialExtents;
  [k: string]: unknown;
}
interface TemporalExtentObject {
  interval: TemporalExtents;
  [k: string]: unknown;
}

interface Summaries {
  [k: string]: Range | unknown;
}
interface Range {
  minimum: number | string;
  maximum: number | string;
  [k: string]: unknown;
}