import { useState } from "react";
import "./ForestsModal.css";

export default function ForestsModal({ forests, activeId, onSelect, onCreate, onDelete, onRename, onClose }) {
  const [newName, setNewName]   = useState("");
  const [editId, setEditId]     = useState(null);
  const [editName, setEditName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName("");
  };

  const startEdit = (f) => { setEditId(f.id); setEditName(f.name); };
  const saveEdit  = (id) => { if (editName.trim()) onRename(id, editName.trim()); setEditId(null); };

  return (
    <div className="forests-overlay" onClick={onClose}>
      <div className="forests-modal" onClick={e => e.stopPropagation()}>
        <div className="forests-modal__header">
          <h5><i className="bi bi-collection me-2 text-success"></i>Soy ağaclarım</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="forests-modal__list">
          {forests.map(f => (
            <div key={f.id} className={"forests-item" + (f.id === activeId ? " forests-item--active" : "")}>
              {editId === f.id ? (
                <div className="d-flex gap-2 flex-grow-1">
                  <input
                    className="form-control form-control-sm"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveEdit(f.id)}
                    autoFocus
                  />
                  <button className="btn btn-sm btn-success" onClick={() => saveEdit(f.id)}>✓</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditId(null)}>✕</button>
                </div>
              ) : (
                <>
                  <button className="forests-item__name" onClick={() => onSelect(f.id)}>
                    <i className="bi bi-tree me-2 text-success"></i>
                    {f.name}
                    {f.id === activeId && <span className="forests-item__badge">aktiv</span>}
                  </button>
                  <div className="forests-item__actions">
                    <button className="btn btn-sm btn-outline-secondary" title="Adını dəyiş" onClick={() => startEdit(f)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Sil" onClick={() => {
                      if (window.confirm(`"${f.name}" silinsin?`)) onDelete(f.id);
                    }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <form className="forests-modal__create" onSubmit={handleCreate}>
          <input
            className="form-control form-control-sm"
            placeholder="Yeni ağacın adı..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button className="btn btn-success btn-sm" type="submit">
            <i className="bi bi-plus-lg me-1"></i>Yarat
          </button>
        </form>
      </div>
    </div>
  );
}
