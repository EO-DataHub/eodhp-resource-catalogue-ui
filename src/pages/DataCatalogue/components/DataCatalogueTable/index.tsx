import { useState } from 'react';
import { DataSet } from "./types"
import './styles.scss'


const loremText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised..."

const defaultData: DataSet[] = [
  {
    id: 1,
    title: 'Sea ice concentration daily gridded data from 1978 to present derived from observations',
    description: loremText,
    lastUpdated: '2022-07-01',
    thumbnailUrl: 'placeholders/terraclimate.png',
    dataType: 'Dataset',
  },
  {
    id: 2,
    title: 'Temperature and precipitation data for global land areas from 1950 to present',
    description: loremText,
    lastUpdated: '2022-07-02',
    thumbnailUrl: 'placeholders/landsat.png',
    dataType: 'Dataset',
  },
  {
    id: 3,
    title: 'Air quality index data for major cities around the world',
    description: loremText,
    lastUpdated: '2022-07-03',
    thumbnailUrl: 'placeholders/sentinel-2.png',
    dataType: 'Dataset',
  },
  {
    id: 4,
    title: 'Satellite imagery data for monitoring deforestation in the Amazon rainforest',
    description: loremText,
    lastUpdated: '2022-07-04',
    thumbnailUrl: 'placeholders/hgb.png',
    dataType: 'Dataset',
  },
];


const DataCatalogueTable = () => {
  const [data, setData] = useState(defaultData);

  return (
    <div className="data-catalogue-table">
      {defaultData.map(row => {
        return (
          <div key={row.id} className="data-catalogue-table__row">
            <div className="data-catalogue-table__row-content">
              <div className="data-catalogue-table__row-information">
                <h3>{row.title}</h3>
                <p>{row.description}</p>
                <p>Updated {row.lastUpdated}</p>
              </div>
              <div className="data-catalogue-table__row-thumnail">
                <img src={row.thumbnailUrl} alt="Thumbnail" />
              </div>
            </div>
            <div className="data-catalogue-table__row-type">
              <span>
                {row.dataType}
              </span>
            </div>
          </div>
        )
      }
      )}
    </div>
  );
}


export default DataCatalogueTable;