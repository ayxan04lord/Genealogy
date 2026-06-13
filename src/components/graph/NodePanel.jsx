import { useState } from "react";
import { getSpousesOf, getParentsOf, getChildrenOf } from "../../data/graphData";
import "./NodePanel.css";

export default function NodePanel({ node, forest, hasSpouse, onAddChild, onAddChildBoth, onAddParent, onAddSpouse, onEdit, onDelete }) {
  const a        = node.attributes || {};
  const spouses  = getSpousesOf(forest, node.id);
  const parents  = getParentsOf(forest, node.id);
  const children = getChildrenOf(forest, node.id);
  const [showNarativ, setShowNarativ] = useState(false);
  const [showSpouseForm, setShowSpouseForm] = useState(false);
  const [spouseId, setSpouseId] = useState("");
  const [spouseDate, setSpouseDate] = useState("");
  const [spouseNote, setSpouseNote] = useState("");

  // Nikahda olmayan node-lar
  const usedIds = new Set([node.id, ...spouses.map(s => s.spouse.id)]);
  const available = forest.nodes.filter(n => !usedIds.has(n.id));

  const handleSpouseSubmit = (e) => {
    e.preventDefault();
    if (!spouseId) return;
    onAddSpouse(spouseId, spouseDate, spouseNote);
    setShowSpouseForm(false);
    setSpouseId(""); setSpouseDate(""); setSpouseNote("");
  };

  const rows = [
    { icon: "bi-calendar3",   val: a.doğum && (a.doğum + (a.vəfat ? ` – ${a.vəfat}` : "")) },
    { icon: "bi-geo-alt",     val: a.yer },
    { icon: "bi-briefcase",   val: a.peşə },
    { icon: "bi-mortarboard", val: a.təhsil },
    { icon: "bi-chat-left-text", val: a.qeyd },
  ].filter(r => r.val);

  return (
    <div className="np">
      {/* Persona */}
      <div className="np__persona">
        {node.photo
          ? <img src={node.photo} alt={node.name} className="np__photo" />
          : <div className="np__avatar"><i className="bi bi-person-fill"></i></div>
        }
        <div>
          <h5 className="np__name">{node.name}</h5>
          {a.cins && (
            <span className={"np__badge " + (a.cins === "qadın" ? "np__badge--f" : "np__badge--m")}>
              {a.cins === "qadın" ? "♀" : "♂"} {a.cins}
            </span>
          )}
        </div>
      </div>

      {/* Atributlar */}
      {rows.length > 0 && (
        <div className="np__attrs">
          {rows.map(({ icon, val }, i) => (
            <div key={i} className="np__attr-row">
              <i className={`bi ${icon}`}></i><span>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ailə əlaqələri xülasəsi */}
      <div className="np__family">
        {parents.length > 0 && (
          <div className="np__family-group">
            <span className="np__family-label">Valideyn:</span>
            {parents.map(p => <span key={p.id} className="np__family-name">{p.name}</span>)}
          </div>
        )}
        {spouses.length > 0 && (
          <div className="np__family-group">
            <span className="np__family-label">♥ Nikah:</span>
            {spouses.map(s => (
              <span key={s.id} className="np__family-name np__family-name--spouse">
                {s.spouse.name}{s.date ? ` (${s.date})` : ""}
              </span>
            ))}
          </div>
        )}
        {children.length > 0 && (
          <div className="np__family-group">
            <span className="np__family-label">Övladlar ({children.length}):</span>
            {children.map(c => <span key={c.id} className="np__family-name">{c.name}</span>)}
          </div>
        )}
      </div>

      {/* Narativ */}
      {node.narativ && (
        <div className="np__narativ">
          <button className="np__narativ-toggle" onClick={() => setShowNarativ(s => !s)}>
            <i className={"bi me-1 " + (showNarativ ? "bi-chevron-up" : "bi-journal-text")}></i>
            {showNarativ ? "Gizlə" : "Narativə bax"}
          </button>
          {showNarativ && <div className="np__narativ-text">{node.narativ}</div>}
        </div>
      )}

      {/* Nikah əlavə et formu */}
      {showSpouseForm && (
        <form className="np__spouse-form" onSubmit={handleSpouseSubmit}>
          <div className="np__spouse-title">
            <i className="bi bi-hearts me-1 text-danger"></i>Nikah əlaqəsi əlavə et
          </div>
          <select className="form-select form-select-sm mb-2"
            value={spouseId} onChange={e => setSpouseId(e.target.value)} required>
            <option value="">Həyat yoldaşını seçin...</option>
            {available.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <input className="form-control form-control-sm" placeholder="Nikah ili"
                value={spouseDate} onChange={e => setSpouseDate(e.target.value)} />
            </div>
            <div className="col-6">
              <input className="form-control form-control-sm" placeholder="Qeyd"
                value={spouseNote} onChange={e => setSpouseNote(e.target.value)} />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-sm btn-danger flex-grow-1"
              disabled={!spouseId}>
              <i className="bi bi-hearts me-1"></i>Yarat
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowSpouseForm(false)}>Ləğv</button>
          </div>
        </form>
      )}

      {/* Əməliyyat düymələri */}
      <div className="np__actions">
        {!hasSpouse ? (
          <button className="btn btn-sm btn-success" onClick={onAddChild}>
            <i className="bi bi-person-plus-fill me-1"></i>Uşaq əlavə et
          </button>
        ) : (
          <button className="btn btn-sm btn-success" onClick={onAddChild}>
            <i className="bi bi-people-fill me-1"></i>Uşaq əlavə et
            <span className="badge bg-light text-success ms-1" style={{fontSize:".65rem"}}>hər iki valideyndən</span>
          </button>
        )}

        <button className="btn btn-sm btn-outline-success" onClick={onAddParent}>
          <i className="bi bi-person-up me-1"></i>Valideyn əlavə et
        </button>

        <button className="btn btn-sm btn-outline-danger"
          onClick={() => setShowSpouseForm(s => !s)}>
          <i className="bi bi-hearts me-1"></i>
          {showSpouseForm ? "Ləğv et" : "Nikah əlaqəsi əlavə et"}
        </button>

        <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>
          <i className="bi bi-pencil me-1"></i>Redaktə
        </button>

        <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
          <i className="bi bi-trash me-1"></i>Sil
        </button>
      </div>
    </div>
  );
}
