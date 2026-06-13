import { useRef, useState } from "react";

export const EMPTY_FORM = {
  name: "", photo: null, narativ: "",
  doğum: "", vəfat: "", yer: "", lat: "", lng: "",
  cins: "", peşə: "", təhsil: "", nikahTarixi: "", qeyd: "",
};

export function nodeToForm(node) {
  const a = node.attributes || {};
  return {
    name: node.name || "", photo: node.photo || null, narativ: node.narativ || "",
    doğum: a.doğum || "", vəfat: a.vəfat || "",
    yer: a.yer || "", lat: a.lat || "", lng: a.lng || "",
    cins: a.cins || "", peşə: a.peşə || "", təhsil: a.təhsil || "",
    nikahTarixi: a.nikahTarixi || "", qeyd: a.qeyd || "",
  };
}

export function formToGraph(form, id) {
  return {
    id,
    name: form.name.trim(),
    photo: form.photo || null,
    narativ: form.narativ || "",
    attributes: {
      doğum: form.doğum, vəfat: form.vəfat,
      yer: form.yer,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      cins: form.cins, peşə: form.peşə, təhsil: form.təhsil,
      nikahTarixi: form.nikahTarixi, qeyd: form.qeyd,
    },
  };
}

export default function PersonFormGraph({ title, formData, onChange, onSubmit, onCancel, submitLabel = "Yadda saxla" }) {
  const fileRef = useRef();
  const [tab, setTab] = useState("info");

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Şəkil 2MB-dan böyük olmamalıdır."); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange({ ...formData, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={onSubmit}>
      {title && <h6 style={{ fontSize: ".88rem", fontWeight: 700, color: "#145a32", marginBottom: 10 }}>{title}</h6>}

      {/* Tablar */}
      <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", marginBottom: 12, gap: 2 }}>
        {[["info", "bi-person", "Məlumatlar"], ["narativ", "bi-journal-text", "Narativ"]].map(([key, icon, label]) => (
          <button key={key} type="button"
            onClick={() => setTab(key)}
            style={{
              background: "none", border: "none", padding: "5px 10px",
              fontWeight: tab === key ? 700 : 500,
              color: tab === key ? "#145a32" : "#6b7280",
              borderBottom: tab === key ? "2px solid #145a32" : "2px solid transparent",
              marginBottom: -2, cursor: "pointer", fontSize: ".8rem",
            }}>
            <i className={`bi ${icon} me-1`}></i>{label}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <>
          {/* Foto */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div onClick={() => fileRef.current.click()}
              style={{ width: 52, height: 52, borderRadius: "50%", border: "2px dashed #d1d5db",
                       display: "flex", alignItems: "center", justifyContent: "center",
                       cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
              {formData.photo
                ? <img src={formData.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <i className="bi bi-person-circle" style={{ fontSize: "1.8rem", color: "#d1d5db" }}></i>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
            {formData.photo && (
              <button type="button" className="btn btn-sm btn-outline-danger"
                onClick={() => onChange({ ...formData, photo: null })}>
                <i className="bi bi-x"></i> Sil
              </button>
            )}
          </div>

          <div className="row g-2 mb-2">
            <div className="col-8">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Ad, Soyad *</label>
              <input className="form-control form-control-sm" placeholder="Əli Məmmədov"
                value={formData.name} onChange={e => onChange({ ...formData, name: e.target.value })} required />
            </div>
            <div className="col-4">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Cins</label>
              <select className="form-select form-select-sm"
                value={formData.cins} onChange={e => onChange({ ...formData, cins: e.target.value })}>
                <option value="">—</option>
                <option value="kişi">Kişi</option>
                <option value="qadın">Qadın</option>
              </select>
            </div>
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Doğum ili</label>
              <input className="form-control form-control-sm" placeholder="1920"
                value={formData.doğum} onChange={e => onChange({ ...formData, doğum: e.target.value })} />
            </div>
            <div className="col-6">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Vəfat ili</label>
              <input className="form-control form-control-sm" placeholder="1990"
                value={formData.vəfat} onChange={e => onChange({ ...formData, vəfat: e.target.value })} />
            </div>
          </div>
          <div className="mb-2">
            <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Şəhər / Kənd</label>
            <input className="form-control form-control-sm" placeholder="Bakı"
              value={formData.yer} onChange={e => onChange({ ...formData, yer: e.target.value })} />
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Peşə</label>
              <input className="form-control form-control-sm"
                value={formData.peşə} onChange={e => onChange({ ...formData, peşə: e.target.value })} />
            </div>
            <div className="col-6">
              <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Təhsil</label>
              <input className="form-control form-control-sm"
                value={formData.təhsil} onChange={e => onChange({ ...formData, təhsil: e.target.value })} />
            </div>
          </div>
          <div className="mb-3">
            <label style={{ fontSize: ".75rem", color: "#6b7280", display: "block", marginBottom: 2 }}>Qeyd</label>
            <textarea className="form-control form-control-sm" rows={2}
              value={formData.qeyd} onChange={e => onChange({ ...formData, qeyd: e.target.value })} />
          </div>
        </>
      )}

      {tab === "narativ" && (
        <div className="mb-3">
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8,
                        padding: "7px 10px", fontSize: ".75rem", color: "#92400e", marginBottom: 8 }}>
            <i className="bi bi-lightbulb me-1"></i>
            Bu şəxs haqqında hekayə, xatirə, tarixi qeyd yaza bilərsiniz.
          </div>
          <textarea className="form-control form-control-sm" rows={10}
            placeholder="Hekayə, xatirə..."
            value={formData.narativ}
            onChange={e => onChange({ ...formData, narativ: e.target.value })} />
          <div style={{ fontSize: ".7rem", color: "#9ca3af", textAlign: "right", marginTop: 3 }}>
            {formData.narativ.length} simvol
          </div>
        </div>
      )}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-sm btn-success flex-grow-1">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Ləğv et</button>
        )}
      </div>
    </form>
  );
}
