import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { searchGraph } from "../data/graphData";
import "./SearchPage.css";

function collectOptions(forest) {
  const yerlər  = new Set();
  const peşələr = new Set();
  forest.nodes.forEach(n => {
    if (n.attributes?.yer)  yerlər.add(n.attributes.yer);
    if (n.attributes?.peşə) peşələr.add(n.attributes.peşə);
  });
  return { yerlər: [...yerlər].sort(), peşələr: [...peşələr].sort() };
}

export default function SearchPage({ forest, activeForestName, onOpenForests }) {
  const navigate = useNavigate();
  const [query,           setQuery]           = useState("");
  const [filterYer,       setFilterYer]       = useState("");
  const [filterPeşə,      setFilterPeşə]      = useState("");
  const [filterCins,      setFilterCins]      = useState("");
  const [filterDövrStart, setFilterDövrStart] = useState("");
  const [filterDövrEnd,   setFilterDövrEnd]   = useState("");
  const [showFilters,     setShowFilters]     = useState(false);

  const { yerlər, peşələr } = useMemo(() => collectOptions(forest), [forest]);

  const activeFilterCount = [filterYer, filterPeşə, filterCins, filterDövrStart, filterDövrEnd]
    .filter(Boolean).length;

  const clearFilters = () => {
    setFilterYer(""); setFilterPeşə(""); setFilterCins("");
    setFilterDövrStart(""); setFilterDövrEnd("");
  };

  const results = useMemo(() => {
    const base = query.trim()
      ? searchGraph(forest, query.trim())
      : [...forest.nodes];

    return base.filter(node => {
      const a = node.attributes || {};
      if (filterYer  && a.yer  !== filterYer)  return false;
      if (filterPeşə && a.peşə !== filterPeşə) return false;
      if (filterCins && a.cins !== filterCins) return false;
      const doğum = parseInt(a.doğum);
      if (filterDövrStart && doğum && doğum < parseInt(filterDövrStart)) return false;
      if (filterDövrEnd   && doğum && doğum > parseInt(filterDövrEnd))   return false;
      return true;
    });
  }, [query, forest, filterYer, filterPeşə, filterCins, filterDövrStart, filterDövrEnd]);

  const isFiltering = query.trim() || activeFilterCount > 0;

  return (
    <PageLayout activeForestName={activeForestName} onOpenForests={onOpenForests}>
      <div className="search-page">
        <div className="search-page__card">
          <h4 className="search-page__title">
            <i className="bi bi-search me-2 text-success"></i>Axtarış &amp; Filtr
          </h4>

          <div className="input-group mb-2">
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input type="text" className="form-control"
              placeholder="Ad, şəhər, peşə..."
              value={query} onChange={e => setQuery(e.target.value)} autoFocus />
            {query && (
              <button className="btn btn-outline-secondary" onClick={() => setQuery("")}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className={"btn btn-sm " + (showFilters ? "btn-success" : "btn-outline-success")}
              onClick={() => setShowFilters(s => !s)}>
              <i className="bi bi-funnel me-1"></i>Filtrlər
              {activeFilterCount > 0 && (
                <span className="badge bg-warning text-dark ms-1">{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
                <i className="bi bi-x-circle me-1"></i>Filtrləri sil
              </button>
            )}
          </div>

          {showFilters && (
            <div className="search-filters">
              <div className="row g-2">
                <div className="col-6">
                  <label className="search-filters__label">Şəhər / Kənd</label>
                  <select className="form-select form-select-sm"
                    value={filterYer} onChange={e => setFilterYer(e.target.value)}>
                    <option value="">Hamısı</option>
                    {yerlər.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="search-filters__label">Peşə</label>
                  <select className="form-select form-select-sm"
                    value={filterPeşə} onChange={e => setFilterPeşə(e.target.value)}>
                    <option value="">Hamısı</option>
                    {peşələr.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="search-filters__label">Cins</label>
                  <div className="d-flex gap-2">
                    {["", "kişi", "qadın"].map(c => (
                      <button key={c}
                        className={"btn btn-sm " + (filterCins === c ? "btn-success" : "btn-outline-secondary")}
                        onClick={() => setFilterCins(c)}>
                        {c === "" ? "Hamısı" : c === "kişi" ? "♂ Kişi" : "♀ Qadın"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-6">
                  <label className="search-filters__label">Doğum — başlanğıc</label>
                  <input type="number" className="form-control form-control-sm"
                    placeholder="1800" value={filterDövrStart}
                    onChange={e => setFilterDövrStart(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="search-filters__label">Doğum — son il</label>
                  <input type="number" className="form-control form-control-sm"
                    placeholder="1950" value={filterDövrEnd}
                    onChange={e => setFilterDövrEnd(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {isFiltering && results.length === 0 && (
            <div className="search-page__empty">
              <i className="bi bi-person-x display-6 d-block mb-2 text-muted"></i>
              Nəticə tapılmadı
            </div>
          )}

          {results.length > 0 && (
            <div className="search-page__results">
              <p className="text-muted small mb-2">{results.length} nəticə</p>
              {results.map((node, i) => {
                const a = node.attributes || {};
                return (
                  <div key={node.id} className="search-page__result-item">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {node.photo
                        ? <img src={node.photo} alt="" className="search-result__avatar" />
                        : <div className="search-result__avatar search-result__avatar--placeholder">
                            <i className="bi bi-person-fill"></i>
                          </div>
                      }
                      <div>
                        <div className="search-page__result-name">{node.name}</div>
                      </div>
                    </div>
                    <div className="search-page__result-attrs">
                      {a.doğum && (
                        <span><i className="bi bi-calendar3 me-1"></i>
                          {a.doğum}{a.vəfat ? ` – ${a.vəfat}` : ""}
                        </span>
                      )}
                      {a.yer  && <span><i className="bi bi-geo-alt me-1"></i>{a.yer}</span>}
                      {a.peşə && <span><i className="bi bi-briefcase me-1"></i>{a.peşə}</span>}
                      {a.cins && <span>{a.cins === "qadın" ? "♀" : "♂"} {a.cins}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isFiltering && (
            <div className="search-page__placeholder">
              <i className="bi bi-people display-5 d-block mb-3 text-success opacity-50"></i>
              <p className="text-muted">Ad yazın və ya filtr seçin</p>
              <button className="btn btn-outline-success btn-sm mt-1" onClick={() => navigate("/tree")}>
                <i className="bi bi-diagram-3 me-1"></i>Ağaca qayıt
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
