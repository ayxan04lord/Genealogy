import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import PersonFormGraph, { EMPTY_FORM, formToGraph } from "../components/person/PersonFormGraph";
import {
  addNode, addEdge, removeEdge, generateId,
  exportGraphToJSON, exportGraphToGEDCOM, importGraphFromJSON,
  getParentsOf, getChildrenOf, getSpousesOf,
} from "../data/graphData";
import "./AddPage.css";

// ─── Əlaqə idarəsi panel ──────────────────────────────────────
function RelationsManager({ forest, onForestChange }) {
  const [tab, setTab]         = useState("add");    // "add" | "remove"
  const [type, setType]       = useState("parent"); // "parent" | "marriage"
  const [fromId, setFromId]   = useState("");
  const [toId, setToId]       = useState("");
  const [mDate, setMDate]     = useState("");
  const [mNote, setMNote]     = useState("");
  const [rmEdgeId, setRmEdgeId] = useState("");
  const [msg, setMsg]         = useState(null); // {text, ok}

  const flash = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  // Əlavə et
  const handleAdd = (e) => {
    e.preventDefault();
    if (!fromId || !toId || fromId === toId) {
      flash("İki fərqli şəxs seçin.", false); return;
    }
    // Duplikat yoxlaması
    const exists = forest.edges.some(ed =>
      ed.type === type &&
      ((ed.from === fromId && ed.to === toId) ||
       (type === "marriage" && ed.from === toId && ed.to === fromId))
    );
    if (exists) { flash("Bu əlaqə artıq mövcuddur.", false); return; }

    const edge = {
      id: generateId(), from: fromId, to: toId, type,
      ...(type === "marriage" ? { date: mDate, note: mNote } : {}),
    };
    onForestChange({ ...forest, edges: [...forest.edges, edge] });
    flash(type === "parent" ? "Valideyn əlaqəsi əlavə edildi." : "Nikah əlaqəsi əlavə edildi.");
    setFromId(""); setToId(""); setMDate(""); setMNote("");
  };

  // Sil
  const handleRemove = (e) => {
    e.preventDefault();
    if (!rmEdgeId) return;
    onForestChange({ ...forest, edges: forest.edges.filter(ed => ed.id !== rmEdgeId) });
    flash("Əlaqə silindi.");
    setRmEdgeId("");
  };

  // Seçilmiş şəxsin əlaqələrini göstər (silmək üçün)
  const [viewId, setViewId] = useState("");
  const viewNode = forest.nodes.find(n => n.id === viewId);
  const viewEdges = viewId ? forest.edges.filter(ed => ed.from === viewId || ed.to === viewId) : [];

  const edgeLabel = (ed) => {
    const other = forest.nodes.find(n => n.id === (ed.from === viewId ? ed.to : ed.from));
    if (ed.type === "marriage") return `♥ Nikah: ${other?.name || "?"}${ed.date ? " (" + ed.date + ")" : ""}`;
    if (ed.from === viewId)     return `→ Övlad: ${other?.name || "?"}`;
    return `← Valideyn: ${other?.name || "?"}`;
  };

  return (
    <div className="add-page__card">
      <h5 className="add-page__title">
        <i className="bi bi-diagram-3 me-2 text-success"></i>Əlaqə idarəsi
      </h5>

      {/* Tab */}
      <div className="add-page__tabs">
        {[["add","bi-plus-circle","Əlavə et"],["remove","bi-trash","Sil"]].map(([k,ic,lb]) => (
          <button key={k} type="button"
            className={"add-page__tab" + (tab === k ? " add-page__tab--active" : "")}
            onClick={() => setTab(k)}>
            <i className={`bi ${ic} me-1`}></i>{lb}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`alert py-1 px-2 small mb-2 ${msg.ok ? "alert-success" : "alert-danger"}`}>
          {msg.text}
        </div>
      )}

      {/* Əlavə et */}
      {tab === "add" && (
        <form onSubmit={handleAdd}>
          <div className="mb-2">
            <label className="add-page__label">Əlaqə növü</label>
            <div className="d-flex gap-2">
              {[["parent","bi-arrow-down","Valideyn → Övlad"],["marriage","bi-hearts","Nikah ♥"]].map(([v,ic,lb]) => (
                <button key={v} type="button"
                  className={"btn btn-sm flex-grow-1 " + (type === v ? (v === "marriage" ? "btn-danger" : "btn-success") : "btn-outline-secondary")}
                  onClick={() => setType(v)}>
                  <i className={`bi ${ic} me-1`}></i>{lb}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label className="add-page__label">
              {type === "parent" ? "Valideyn" : "1-ci şəxs"} *
            </label>
            <select className="form-select form-select-sm" value={fromId}
              onChange={e => setFromId(e.target.value)} required>
              <option value="">Seçin...</option>
              {forest.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          <div className="mb-2">
            <label className="add-page__label">
              {type === "parent" ? "Övlad" : "2-ci şəxs"} *
            </label>
            <select className="form-select form-select-sm" value={toId}
              onChange={e => setToId(e.target.value)} required>
              <option value="">Seçin...</option>
              {forest.nodes.filter(n => n.id !== fromId).map(n =>
                <option key={n.id} value={n.id}>{n.name}</option>
              )}
            </select>
          </div>

          {type === "marriage" && (
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="add-page__label">Nikah ili</label>
                <input className="form-control form-control-sm" placeholder="1950"
                  value={mDate} onChange={e => setMDate(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="add-page__label">Qeyd</label>
                <input className="form-control form-control-sm"
                  value={mNote} onChange={e => setMNote(e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className={"btn btn-sm w-100 " + (type === "marriage" ? "btn-danger" : "btn-success")}
            disabled={!fromId || !toId}>
            <i className="bi bi-plus-circle me-1"></i>Əlaqə əlavə et
          </button>
        </form>
      )}

      {/* Sil */}
      {tab === "remove" && (
        <div>
          <div className="mb-3">
            <label className="add-page__label">Şəxs seçin</label>
            <select className="form-select form-select-sm" value={viewId}
              onChange={e => { setViewId(e.target.value); setRmEdgeId(""); }}>
              <option value="">Seçin...</option>
              {forest.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          {viewId && viewEdges.length === 0 && (
            <p className="text-muted small">Bu şəxsin heç bir əlaqəsi yoxdur.</p>
          )}

          {viewEdges.length > 0 && (
            <form onSubmit={handleRemove}>
              <label className="add-page__label">Silinəcək əlaqə *</label>
              <div className="d-flex flex-column gap-1 mb-3">
                {viewEdges.map(ed => (
                  <label key={ed.id} className={"add-page__edge-option" + (rmEdgeId === ed.id ? " add-page__edge-option--selected" : "")}>
                    <input type="radio" name="rmEdge" value={ed.id}
                      checked={rmEdgeId === ed.id}
                      onChange={() => setRmEdgeId(ed.id)}
                      style={{ marginRight: 8 }} />
                    <span className={ed.type === "marriage" ? "text-danger" : ""}>
                      {edgeLabel(ed)}
                    </span>
                  </label>
                ))}
              </div>
              <button type="submit" className="btn btn-sm btn-outline-danger w-100" disabled={!rmEdgeId}>
                <i className="bi bi-trash me-1"></i>Seçilmiş əlaqəni sil
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Ana komponent ────────────────────────────────────────────
export default function AddPage({ forest, onForestChange, activeForestName, onOpenForests }) {
  const navigate = useNavigate();
  const [parentId,  setParentId]  = useState("");
  const [formData,  setFormData]  = useState(EMPTY_FORM);
  const [success,   setSuccess]   = useState(false);
  const [importErr, setImportErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id      = generateId();
    const newNode = { ...formToGraph(formData, id), id };
    let updated   = addNode(forest, newNode);
    if (parentId) {
      updated = addEdge(updated, { id: generateId(), from: parentId, to: id, type: "parent" });
    }
    onForestChange(updated);
    setSuccess(true);
    setFormData(EMPTY_FORM);
    setParentId("");
    setTimeout(() => setSuccess(false), 3500);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportErr("");
    importGraphFromJSON(file, (data) => {
      if (window.confirm("Aktiv ağac bu faylın məlumatları ilə əvəz edilsin?")) {
        onForestChange(data);
        navigate("/tree");
      }
    }, (err) => setImportErr(err));
    e.target.value = "";
  };

  return (
    <PageLayout activeForestName={activeForestName} onOpenForests={onOpenForests}>
      <div className="add-page">

        {/* Sol: Yeni şəxs */}
        <div className="add-page__card">
          <h4 className="add-page__title">
            <i className="bi bi-person-plus-fill me-2 text-success"></i>Yeni şəxs əlavə et
          </h4>

          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              Şəxs əlavə edildi!
              <button className="btn btn-sm btn-success ms-auto" onClick={() => navigate("/tree")}>
                Ağaca bax
              </button>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Valideyn (istəyə bağlı)</label>
            <select className="form-select" value={parentId} onChange={e => setParentId(e.target.value)}>
              <option value="">— Müstəqil şəxs —</option>
              {forest.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
            <div className="form-text">Boş buraxsanız şəxs müstəqil node kimi əlavə olunur.</div>
          </div>
          <hr />
          <PersonFormGraph
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            submitLabel="Əlavə et"
          />
        </div>

        {/* Sağ sütun */}
        <div className="add-page__side">

          {/* Əlaqə idarəsi */}
          <RelationsManager forest={forest} onForestChange={onForestChange} />

          {/* Export / Import */}
          <div className="add-page__card">
            <h5 className="add-page__title">
              <i className="bi bi-arrow-down-up me-2 text-success"></i>Export / Import
            </h5>
            <p className="text-muted small mb-3">Aktiv ağacı yükləyin və ya bərpa edin.</p>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-success" onClick={() => exportGraphToJSON(forest)}>
                <i className="bi bi-filetype-json me-2"></i>JSON kimi yüklə
              </button>
              <button className="btn btn-outline-success" onClick={() => exportGraphToGEDCOM(forest)}>
                <i className="bi bi-file-earmark-text me-2"></i>GEDCOM (.ged) yüklə
              </button>
              <hr className="my-1" />
              <label className="btn btn-outline-secondary mb-0" style={{ cursor: "pointer" }}>
                <i className="bi bi-upload me-2"></i>JSON fayldan idxal et
                <input type="file" accept=".json" hidden onChange={handleImport} />
              </label>
              {importErr && <div className="alert alert-danger py-1 px-2 small mb-0">{importErr}</div>}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
