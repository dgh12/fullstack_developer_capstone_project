import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import RegisterPanal from "./components/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />,
      <Route path="/register" element={<RegisterPanal />} />
    </Routes>
  );
}
export default App;
