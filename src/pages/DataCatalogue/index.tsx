import DataCatalogueTable from "./components/DataCatalogueTable";
import TopBar from "./components/TopBar";
import "./styles.scss";

const DataCatalogue = () => {
  return (
    <div className="data-catalogue">
      <TopBar />
      <DataCatalogueTable />
    </div>
  );
};

export default DataCatalogue;
