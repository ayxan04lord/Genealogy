import { useState } from "react";

export default function EdgePanel({ edge, forest, onUpdate, onDelete }) {
  const nodeA = forest.nodes.find(n => n.id === edge.from);
  const nodeB = forest.nodes.find(n => n.id === edge.to);
  const [date, setDate] = useState(edge.date || "");
  const [note, setNote] = useState(edge.note || "");

  const isMarriage = edge.type === "marriage";

  return (
    <div style={{ padding: "4px 0" }}>
      <h6 style={{ fontWeight: 700, color: isMarriage ? "#e91e63" : "#145a32", marginBottom: 12 }}>
        <i className={"bi me-2 " + (isMarriage ? "bi-hearts" : "bi-diagram-3")}></i>
        {isMarriage ? "Nikah əlaqəsi" : "Valideyn/Övlad əlaqəsi"}
      </h6>

      <div style={{ fontSize: ".88rem", color: "#374151", marginBottom: 12 }}>
        <strong>{nodeA?.name}</strong>
        <span style={{ margin: "0 8px", color: "#9ca3af" }}>
          {isMarriage ? "♥" : "→"}
        </span>
        <strong>{nodeB?.name}</strong>
      </div>

      {isMarriage && (
        <>
          <div className="mb-2">
            <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 3 }}>
              Nikah tarixi
            </label>
            <input className="form-control form-control-sm"
              value={date} onChange={e => setDate(e.target.value)}
              placeholder="Məs: 1945" />
          </div>
          <div className="mb-3">
            <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 3 }}>
              Qeyd
            </label>
            <input className="form-control form-control-sm"
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="İxtiyari" />
          </div>
          <button className="btn btn-sm btn-outline-success w-100 mb-2"
            onClick={() => onUpdate({ date, note })}>
            <i className="bi bi-check me-1"></i>Yadda saxla
          </button>
        </>
      )}

      <button className="btn btn-sm btn-outline-danger w-100" onClick={onDelete}>
        <i className="bi bi-trash me-1"></i>
        {isMarriage ? "Nikah əlaqəsini sil" : "Valideyn əlaqəsini sil"}
      </button>
    </div>
  );
}
