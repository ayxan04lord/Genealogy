import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { calcGraphStats } from "../data/graphData";
import "./LandingPage.css";

const FEATURES = [
  { icon: "bi-diagram-3-fill",   color: "#1e8449", title: "İnteraktiv Ağac",    desc: "Soy ağacınızı interaktiv vizualizasiya ilə kəşf edin. Node-lara klik edərək ətraflı məlumat əldə edin." },
  { icon: "bi-geo-alt-fill",     color: "#0891b2", title: "Coğrafi Xəritə",     desc: "Əcdadlarınızın yaşadığı yerləri Azərbaycan xəritəsində görün. Hər şəxs üçün coğrafi koordinat əlavə edin." },
  { icon: "bi-share-fill",       color: "#7c3aed", title: "Qohumluq Hesabı",    desc: "İki şəxs arasındakı qohumluq dərəcəsini avtomatik müəyyən edin — ümumi əcdad tapılır." },
  { icon: "bi-journal-text",     color: "#b45309", title: "Narrativlər",         desc: "Hər şəxs haqqında hekayə, xatirə və tarixi qeydlər yazın. Soy tarixini gələcək nəsillərə ötürün." },
  { icon: "bi-arrow-down-up",    color: "#dc2626", title: "Export / Import",     desc: "Ağacınızı JSON və ya GEDCOM formatında yükləyin. Başqa platformalardan məlumat idxal edin." },
  { icon: "bi-collection-fill",  color: "#0d9488", title: "Çoxlu Ağac",          desc: "Bir neçə ayrı soy ağacı saxlayın. Hər ailə qolu üçün ayrı ağac yarada bilərsiniz." },
];

const SCIENCE_ITEMS = [
  {
    icon: "bi-book-fill",
    title: "Genealogiya nədir?",
    text: "Genealogiya — insanların öz ailə tarixini, əcdadlarını və nəsil zəncirlərini tədqiq edən bir elmdir. Bu elm vasitəsilə insanlar öz köklərinə bağlılığı anlayır, ailə münasibətlərini kəşf edir.",
  },
  {
    icon: "bi-tree-fill",
    title: "Soy ağacı nədir?",
    text: "Soy ağacı — bir ailənin bütün üzvlərini nəsil-nəsil vizual formada göstərən diaqramdır. Kök node əsas əcdadı, budaqlar isə onun övlad, nəvə və nəslini təmsil edir.",
  },
  {
    icon: "bi-people-fill",
    title: "Niyə vacibdir?",
    text: "Soy ağacı mədəni kimliyimizin, dilimizin, adət-ənənələrimizin köklərini qoruyur. Gənc nəsillərin öz tarixini bilməsi milli özünüdərk baxımından son dərəcə əhəmiyyətlidir.",
  },
  {
    icon: "bi-shield-check",
    title: "Məlumatlarınız qorunur",
    text: "AzGenealogy-da bütün məlumatlar yalnız sizin cihazınızda (brauzer localStorage) saxlanılır. Heç bir məlumat xarici serverə göndərilmir.",
  },
];

export default function LandingPage({ forest, activeForestName, onOpenForests }) {
  const navigate = useNavigate();
  const stats    = calcGraphStats(forest);

  return (
    <div className="landing">
      <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />

      {/* ── Hero ── */}
      <section className="landing__hero">
        <div className="landing__hero-bg" aria-hidden="true">
          {/* Dekorativ SVG ağac */}
          <svg className="landing__hero-tree" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="40"  r="12" fill="rgba(255,255,255,0.15)"/>
            <line x1="100" y1="52"  x2="60"  y2="90"  stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <line x1="100" y1="52"  x2="140" y2="90"  stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="60"  cy="100" r="10" fill="rgba(255,255,255,0.12)"/>
            <circle cx="140" cy="100" r="10" fill="rgba(255,255,255,0.12)"/>
            <line x1="60"  y1="110" x2="40"  y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <line x1="60"  y1="110" x2="80"  y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <line x1="140" y1="110" x2="120" y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <line x1="140" y1="110" x2="160" y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <circle cx="40"  cy="155" r="8"  fill="rgba(255,255,255,0.1)"/>
            <circle cx="80"  cy="155" r="8"  fill="rgba(255,255,255,0.1)"/>
            <circle cx="120" cy="155" r="8"  fill="rgba(255,255,255,0.1)"/>
            <circle cx="160" cy="155" r="8"  fill="rgba(255,255,255,0.1)"/>
          </svg>
        </div>

        <div className="landing__hero-content">
          <div className="landing__hero-badge">
            <i className="bi bi-tree-fill me-2"></i>Azərbaycan Genealogiya Platforması
          </div>
          <h1 className="landing__hero-title">
            Köklərinizdən<br />
            <span className="landing__hero-accent">gələcəyinizə</span> körpü qurun
          </h1>
          <p className="landing__hero-sub">
            Soy ağacınızı yaradın, əcdadlarınızın hekayəsini qoruyun,
            nəsil tarixi üzrə tədqiqat aparın.
          </p>
          <div className="landing__hero-btns">
            <button className="landing__btn-primary" onClick={() => navigate("/tree")}>
              <i className="bi bi-diagram-3-fill me-2"></i>Ağacı aç
            </button>
            <button className="landing__btn-secondary" onClick={() => navigate("/add")}>
              <i className="bi bi-person-plus-fill me-2"></i>Şəxs əlavə et
            </button>
          </div>

          {/* Canlı statistika */}
          <div className="landing__hero-stats">
            {[
              { val: stats.total,    label: "Şəxs" },
              { val: stats.maxDepth, label: "Nəsil" },
              { val: stats.withDates,label: "Tarixli qeyd" },
            ].map(({ val, label }) => (
              <div key={label} className="landing__hero-stat">
                <span className="landing__hero-stat-val">{val}</span>
                <span className="landing__hero-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Genealogiya elmi ── */}
      <section className="landing__science">
        <div className="landing__section-inner">
          <h2 className="landing__section-title">
            <i className="bi bi-mortarboard-fill me-2 text-success"></i>
            Genealogiya elmi haqqında
          </h2>
          <p className="landing__section-sub">
            Öz köklərinizi tanımaq — özünüzü tanımaqdan başlayır
          </p>
          <div className="landing__science-grid">
            {SCIENCE_ITEMS.map(({ icon, title, text }) => (
              <div key={title} className="landing__science-card">
                <i className={`bi ${icon} landing__science-icon`}></i>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Necə işləyir ── */}
      <section className="landing__how">
        <div className="landing__section-inner">
          <h2 className="landing__section-title">Necə istifadə edilir?</h2>
          <div className="landing__how-steps">
            {[
              { n:"1", icon:"bi-person-plus-fill",   title:"Şəxs əlavə et",   desc:"İlk əcdadınızın adını, tarixini və şəhərini daxil edin." },
              { n:"2", icon:"bi-diagram-3",           title:"Nəsli genişləndir",desc:"Hər şəxsin altına övladlarını, nəvələrini əlavə edin." },
              { n:"3", icon:"bi-journal-text",        title:"Hekayə yaz",      desc:"Narativ bölməsindən hər şəxs üçün tarixi qeyd əlavə edin." },
              { n:"4", icon:"bi-arrow-down-up",       title:"Paylaş",          desc:"JSON və ya GEDCOM formatında ixrac edib saxlayın." },
            ].map(({ n, icon, title, desc }) => (
              <div key={n} className="landing__how-step">
                <div className="landing__how-num">{n}</div>
                <i className={`bi ${icon} landing__how-icon`}></i>
                <h6>{title}</h6>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Xüsusiyyətlər ── */}
      <section className="landing__features">
        <div className="landing__section-inner">
          <h2 className="landing__section-title landing__section-title--light">
            Platformanın imkanları
          </h2>
          <div className="landing__features-grid">
            {FEATURES.map(({ icon, color, title, desc }) => (
              <div key={title} className="landing__feature-card">
                <i className={`bi ${icon}`} style={{ color, fontSize: "1.8rem" }}></i>
                <h6>{title}</h6>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button className="landing__btn-primary" onClick={() => navigate("/tree")}>
              <i className="bi bi-arrow-right-circle me-2"></i>İndi başla
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
