import { useRef, useState } from "react";
import "./PersonForm.css";

export const EMPTY_FORM = {
  name: "", photo: null,
  doğum: "", vəfat: "", yer: "", lat: "", lng: "",
  cins: "", peşə: "", təhsil: "",
  nikahTarixi: "", həyatYoldaşı: "",
  qeyd: "",
  narativ: "",
};

export function nodeToForm(node) {
  const a = node.attributes || {};
  return {
    name: node.name || "",
    photo: node.photo || null,
    doğum: a.doğum || "", vəfat: a.vəfat || "",
    yer: a.yer || "", lat: a.lat || "", lng: a.lng || "",
    cins: a.cins || "", peşə: a.peşə || "", təhsil: a.təhsil || "",
    nikahTarixi: a.nikahTarixi || "", həyatYoldaşı: a.həyatYoldaşı || "",
    qeyd: a.qeyd || "",
    narativ: node.narativ || "",
  };
}

export function formToNode(form, existingId) {
  return {
    id: existingId,
    name: form.name.trim(),
    photo: form.photo || null,
    narativ: form.narativ || "",
    attributes: {
      doğum: form.doğum, vəfat: form.vəfat,
      yer: form.yer,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      cins: form.cins, peşə: form.peşə, təhsil: form.təhsil,
      nikahTarixi: form.nikahTarixi, həyatYoldaşı: form.həyatYoldaşı,
      qeyd: form.qeyd,
    },
  };
}

export default function PersonForm({ title, formData, onChange, onSubmit, onCancel, submitLabel = "Yadda saxla" }) {
  const fileRef = useRef();
  const [tab, setTab] = useState("info"); // "info" | "narativ"

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Şəkil 2MB-dan böyük olmamalıdır."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ ...formData, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={onSubmit} className="pf">
      {title && <h6 className="pf__title">{title}</h6>}

      {/* Tab keçid */}
      <div className="pf__tabs">
        <button type="button"
          className={"pf__tab" + (tab === "info" ? " pf__tab--active" : "")}
          onClick={() => setTab("info")}>
          <i className="bi bi-person me-1"></i>Məlumatlar
        </button>
        <button type="button"
          className={"pf__tab" + (tab === "narativ" ? " pf__tab--active" : "")}
          onClick={() => setTab("narativ")}>
          <i className="bi bi-journal-text me-1"></i>Narativ
          {formData.narativ && <span className="pf__tab-dot"></span>}
        </button>
      </div>

      {/* ── Məlumatlar tab ── */}
      {tab === "info" && (
        <>
          {/* Foto */}
          <div className="pf__photo-row">
            <div className="pf__avatar" onClick={() => fileRef.current.click()} title="Şəkil seç">
              {formData.photo
                ? <img src={formData.photo} alt="foto" />
                : <i className="bi bi-person-circle"></i>}
              <span className="pf__avatar-hint">Şəkil seç</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
            {formData.photo && (
              <button type="button" className="btn btn-sm btn-outline-danger pf__rm-photo"
                onClick={() => onChange({ ...formData, photo: null })}>
                <i className="bi bi-x"></i> Sil
              </button>
            )}
          </div>

          {/* Ad + cins */}
          <div className="row g-2 mb-2">
            <div className="col-8">
              <label className="pf__label">Ad, Soyad *</label>
              <input className="form-control form-control-sm" placeholder="Əli Məmmədov"
                value={formData.name} onChange={e => onChange({ ...formData, name: e.target.value })} required />
            </div>
            <div className="col-4">
              <label className="pf__label">Cins</label>
              <select className="form-select form-select-sm"
                value={formData.cins} onChange={e => onChange({ ...formData, cins: e.target.value })}>
                <option value="">—</option>
                <option value="kişi">Kişi</option>
                <option value="qadın">Qadın</option>
              </select>
            </div>
          </div>

          {/* Tarixlər */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="pf__label">Doğum ili</label>
              <input className="form-control form-control-sm" placeholder="1920"
                value={formData.doğum} onChange={e => onChange({ ...formData, doğum: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="pf__label">Vəfat ili</label>
              <input className="form-control form-control-sm" placeholder="1990"
                value={formData.vəfat} onChange={e => onChange({ ...formData, vəfat: e.target.value })} />
            </div>
          </div>

          {/* Yer */}
          <div className="mb-2">
            <label className="pf__label">Şəhər / Kənd</label>
            <input className="form-control form-control-sm" placeholder="Bakı"
              value={formData.yer} onChange={e => onChange({ ...formData, yer: e.target.value })} />
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="pf__label">Enlik (lat)</label>
              <input className="form-control form-control-sm" placeholder="40.4093" type="number" step="any"
                value={formData.lat} onChange={e => onChange({ ...formData, lat: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="pf__label">Uzunluq (lng)</label>
              <input className="form-control form-control-sm" placeholder="49.8671" type="number" step="any"
                value={formData.lng} onChange={e => onChange({ ...formData, lng: e.target.value })} />
            </div>
          </div>

          {/* Peşə + Təhsil */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="pf__label">Peşə</label>
              <input className="form-control form-control-sm" placeholder="Həkim, Müəllim..."
                value={formData.peşə} onChange={e => onChange({ ...formData, peşə: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="pf__label">Təhsil</label>
              <input className="form-control form-control-sm" placeholder="Ali, Orta..."
                value={formData.təhsil} onChange={e => onChange({ ...formData, təhsil: e.target.value })} />
            </div>
          </div>

          {/* Nikah */}
          <div className="row g-2 mb-2">
            <div className="col-5">
              <label className="pf__label">Nikah tarixi</label>
              <input className="form-control form-control-sm" placeholder="1945"
                value={formData.nikahTarixi} onChange={e => onChange({ ...formData, nikahTarixi: e.target.value })} />
            </div>
            <div className="col-7">
              <label className="pf__label">Həyat yoldaşı</label>
              <input className="form-control form-control-sm" placeholder="Adı, Soyadı"
                value={formData.həyatYoldaşı} onChange={e => onChange({ ...formData, həyatYoldaşı: e.target.value })} />
            </div>
          </div>

          {/* Qeyd */}
          <div className="mb-3">
            <label className="pf__label">Qısa qeyd</label>
            <textarea className="form-control form-control-sm" rows={2} placeholder="Əlavə qısa məlumat..."
              value={formData.qeyd} onChange={e => onChange({ ...formData, qeyd: e.target.value })} />
          </div>
        </>
      )}

      {/* ── Narativ tab ── */}
      {tab === "narativ" && (
        <div className="pf__narativ">
          <div className="pf__narativ-hint">
            <i className="bi bi-lightbulb text-warning me-1"></i>
            Bu şəxs haqqında hekayə, xatirə, tarixi qeyd və ya istənilən mətn yaza bilərsiniz.
          </div>
          <label className="pf__label">Narativ / Hekayə</label>
          <textarea
            className="form-control form-control-sm pf__narativ-textarea"
            rows={10}
            placeholder={`Məs:\n"Həsən əfəndi 1850-ci ildə Bakıda anadan olmuşdur. Gənc yaşlarında ticarətlə məşğul olmuş, şəhərin inkişafına böyük töhfə vermişdir. O, dövrünün tanınmış tacirləri arasında yer almış..."`}
            value={formData.narativ}
            onChange={e => onChange({ ...formData, narativ: e.target.value })}
          />
          <div className="pf__narativ-count">
            {formData.narativ.length} simvol
            {formData.narativ.length > 0 && (
              <button type="button" className="btn btn-link btn-sm p-0 ms-2 text-muted"
                onClick={() => onChange({ ...formData, narativ: "" })}>
                Təmizlə
              </button>
            )}
          </div>
        </div>
      )}

      <div className="d-flex gap-2 mt-2">
        <button type="submit" className="btn btn-sm btn-success flex-grow-1">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Ləğv et</button>
        )}
      </div>
    </form>
  );
}
