import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import {
  loadGraphForests, saveGraphForests,
  loadActiveGraphId, saveActiveGraphId,
  generateId, makeDefaultForest,
} from "./data/graphData";
import LandingPage  from "./pages/LandingPage";
import GraphHome    from "./pages/GraphHome";
import SearchPage   from "./pages/SearchPage";
import AddPage      from "./pages/AddPage";
import StatsPage    from "./pages/StatsPage";
import HelpPage     from "./pages/HelpPage";
import MapPage      from "./pages/MapPage";
import RelationPage from "./pages/RelationPage";
import ForestsModal from "./components/forests/ForestsModal";

function App() {
  const [forests,     setForests]     = useState(() => loadGraphForests());
  const [activeId,    setActiveId]    = useState(() => loadActiveGraphId());
  const [showForests, setShowForests] = useState(false);

  const activeForest = forests.find(f => f.id === activeId) || forests[0];

  const handleForestChange = useCallback((newForest) => {
    setForests(prev => {
      const updated = prev.map(f => f.id === activeId ? newForest : f);
      saveGraphForests(updated);
      return updated;
    });
  }, [activeId]);

  const handleSelectForest = useCallback((id) => {
    setActiveId(id);
    saveActiveGraphId(id);
    setShowForests(false);
  }, []);

  const handleCreateForest = useCallback((name) => {
    const nf = { ...makeDefaultForest(), id: "forest_" + generateId(), name, createdAt: Date.now() };
    setForests(prev => {
      const updated = [...prev, nf];
      saveGraphForests(updated);
      return updated;
    });
    handleSelectForest(nf.id);
  }, [handleSelectForest]);

  const handleDeleteForest = useCallback((id) => {
    setForests(prev => {
      if (prev.length === 1) { alert("Ən azı bir ağac olmalıdır."); return prev; }
      const updated = prev.filter(f => f.id !== id);
      saveGraphForests(updated);
      if (activeId === id) { setActiveId(updated[0].id); saveActiveGraphId(updated[0].id); }
      return updated;
    });
  }, [activeId]);

  const handleRenameForest = useCallback((id, name) => {
    setForests(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, name } : f);
      saveGraphForests(updated);
      return updated;
    });
  }, []);

  const activeForestName = activeForest?.name || "";
  const openForests      = () => setShowForests(true);

  const shared = {
    forest: activeForest,
    onForestChange: handleForestChange,
    activeForestName,
    onOpenForests: openForests,
  };

  return (
    <BrowserRouter>
      {showForests && (
        <ForestsModal
          forests={forests}
          activeId={activeId}
          onSelect={handleSelectForest}
          onCreate={handleCreateForest}
          onDelete={handleDeleteForest}
          onRename={handleRenameForest}
          onClose={() => setShowForests(false)}
        />
      )}
      <Routes>
        <Route path="/"         element={<LandingPage   {...shared} />} />
        <Route path="/tree"     element={<GraphHome     {...shared} />} />
        <Route path="/search"   element={<SearchPage    {...shared} />} />
        <Route path="/add"      element={<AddPage       {...shared} />} />
        <Route path="/stats"    element={<StatsPage     {...shared} />} />
        <Route path="/map"      element={<MapPage       {...shared} />} />
        <Route path="/relation" element={<RelationPage  {...shared} />} />
        <Route path="/help"     element={<HelpPage      {...shared} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
