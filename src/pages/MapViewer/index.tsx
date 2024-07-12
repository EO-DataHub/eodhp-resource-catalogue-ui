import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button";
import "./styles.scss";

const Main = () => {
  const { state, actions } = useContext(AppContext);
  const { headerTitle } = state;
  const { setHeaderTitle } = actions;

  return (
    <div className="main">
      <h1 className="main__heading">{headerTitle}</h1>
      <Button
        className="main__button"
        onClick={() => setHeaderTitle("New Title")}
      >
        Change Title
      </Button>
    </div>
  );
};

export default Main;
