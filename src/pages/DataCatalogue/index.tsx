import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./styles.scss";
import TopBar from "./components/TopBar";
import DataCatalogueTable from "./components/DataCatalogueTable";


const DataCatalogue = () => {
  const { state, actions } = useContext(AppContext);
  const { headerTitle } = state;
  const { setHeaderTitle } = actions;

  return (
    <div className="data-catalogue">
      <TopBar />
      <DataCatalogueTable />
    </div>
  );
};

export default DataCatalogue;
