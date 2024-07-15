import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button";
import "./styles.scss";

const DataCatalogue = () => {
  const { state, actions } = useContext(AppContext);
  const { headerTitle } = state;
  const { setHeaderTitle } = actions;

  return (
    <div className="data-catalogue">
      Main Content (Data Catalogue)
    </div>
  );
};

export default DataCatalogue;
