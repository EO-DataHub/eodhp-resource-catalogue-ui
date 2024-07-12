import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import App from "./App.js";


ReactDOM.createRoot(document.getElementById('root')!).render(<>
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
</>
);
