import "./styles.scss";
import TopBar from "./components/TopBar";
import DataCatalogueTable from "./components/DataCatalogueTable";


const DataCatalogue = () => {
  return (
    <div className="data-catalogue">
      <TopBar />
      <DataCatalogueTable />
    </div>
  );
};

export default DataCatalogue;
