import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Main = () => {
  const { headerTitle, setHeaderTitle } = useContext(AppContext);

  return (
    <div className="main">
      <h1 className="main__heading">{headerTitle}</h1>
      <button className="main__button" onClick={() => setHeaderTitle("New Title")}>Change Title</button>
    </div>
  )
}

export default Main;
