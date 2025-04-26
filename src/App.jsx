import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TreePage from "./pages/TreePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<TreePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;