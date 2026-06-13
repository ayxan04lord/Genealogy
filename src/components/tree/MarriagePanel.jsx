import { useState } from "react";
import { flattenTree, getMarriagesOf, getSpouseId, findNode } from "../../data/treeData";
import "./MarriagePanel.css";

export default function MarriagePanel({ node, treeData, marriages, onAdd, onRemove, onUpdate, onClose }) {
  const allNodes     = flattenTree(treeData);
  const myMarriages  = getMarriagesOf(marriages, node.id);

  const [selectedSpouseId, setSelectedSpouseId] = useState("");
  const [date, setDate]   = useState("");
  const [note, setNote]   = useState("");
  const [editId, setEditId]   = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  // Artıq nikahda olan node-ları çıxardaq + özü
  const usedIds = new Set([
    node.id,
    ...myMarriages.map(m => getSpouseId(m, node.id)),
  ]);
  const available = allNodes.filter(n => !usedIds.has(n.id));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedSpouseId) return;
    onAdd(node.id, selectedSpouseId, date, note);
    setSelectedSpouseId(""); setDate(""); setNote("");
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setEditDate(m.date || "");
    setEditNote(m.note || "");
  };

  const saveEdit = () => {
    onUpdate(editId, { date: editDate, note: editNote });
    setEditId(null);
  };

  return (
    <div className="mp">
      <div className="mp__header">
        <span><i className="bi bi-hearts me-2 text-danger"></i>Nikah əlaqələri</span>
        <button className="mp__close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
      </div>

      {/* Mövcud nikahlar */}
      {myMarriages.length > 0 && (
        <div className="mp__list">
          {myMarriages.map(m => {
            const spouseId   = getSpouseId(m, node.id);
            const spouseNode = findNode(treeData, spouseId);
            return (
              <div key={m.id} className="mp__item">
                {editId === m.id ? (
                  <div className="mp__edit">
                    <input className="form-control form-control-sm mb-1"
                      placeholder="Nikah tarixi (il)" value={editDate}
                      onChange={e => setEditDate(e.target.value)} />
                    <input className="form-control form-control-sm mb-2"
                      placeholder="Qeyd" value={editNote}
                      onChange={e => setEditNote(e.target.value)} />
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-success flex-grow-1" onClick={saveEdit}>Saxla</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditId(null)}>Ləğv</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mp__item-main">
                      {spouseNode?.photo
                        ? <img src={spouseNode.photo} alt="" className="mp__avatar" />
                        : <div className="mp__avatar mp__avatar--ph"><i className="bi bi-person-fill"></i></div>
                      }
                      <div>
                        <div className="mp__spouse-name">
                          ♥ {spouseNode?.name || spouseId}
                        </div>
                        {(m.date || m.note) && (
                          <div className="mp__spouse-meta">
                            {m.date && <span><i className="bi bi-calendar3 me-1"></i>{m.date}</span>}
                            {m.note && <span className="ms-2 text-muted">{m.note}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mp__item-actions">
                      <button className="btn btn-xs btn-outline-secondary" onClick={() => startEdit(m)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-xs btn-outline-danger"
                        onClick={() => { if (window.confirm("Bu nikah əlaqəsi silinsin?")) onRemove(m.id); }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {myMarriages.length === 0 && (
        <p className="mp__empty">Hələ heç bir nikah əlaqəsi yoxdur.</p>
      )}

      {/* Yeni nikah əlavə et */}
      <form className="mp__form" onSubmit={handleAdd}>
        <div className="mp__form-title">
          <i className="bi bi-plus-circle me-1 text-success"></i>Nikah əlaqəsi əlavə et
        </div>
        <label className="mp__label">Həyat yoldaşı *</label>
        <select className="form-select form-select-sm mb-2"
          value={selectedSpouseId}
          onChange={e => setSelectedSpouseId(e.target.value)}
          required>
          <option value="">Seçin...</option>
          {available.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>

        <div className="row g-2 mb-2">
          <div className="col-6">
            <label className="mp__label">Nikah tarixi (il)</label>
            <input className="form-control form-control-sm" placeholder="1945"
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="col-6">
            <label className="mp__label">Qeyd</label>
            <input className="form-control form-control-sm" placeholder="İxtiyari"
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        {available.length === 0 && (
          <div className="alert alert-warning py-1 px-2 small mb-2">
            Ağacda əlavə edilə biləcək şəxs yoxdur. Əvvəlcə yeni şəxs əlavə edin.
          </div>
        )}

        <button type="submit" className="btn btn-sm btn-danger w-100" disabled={!selectedSpouseId}>
          <i className="bi bi-hearts me-1"></i>Nikah əlaqəsi yarat
        </button>
      </form>
    </div>
  );
}
