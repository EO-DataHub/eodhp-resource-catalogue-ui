import { Navigate, Route, Routes } from "react-router-dom";

import Main from "./pages/Main/Main";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/status" element={<h1>Status</h1>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
