import { Link } from "react-router-dom";
import "./Footer.css";

const LINKS = [
  { to: "/",        label: "Soy ağacı"   },
  { to: "/search",  label: "Axtarış"     },
  { to: "/add",     label: "Şəxs əlavə et"},
  { to: "/map",     label: "Xəritə"      },
  { to: "/relation",label: "Qohumluq"    },
  { to: "/stats",   label: "Statistika"  },
  { to: "/help",    label: "Kömək"       },
];

const SHARE_LINKS = [
  {
    label: "Facebook",
    icon: "bi-facebook",
    href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
  },
  {
    label: "Twitter / X",
    icon: "bi-twitter-x",
    href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent("AzGenealogy — Azərbaycan soy ağacı platforması")}&url=${encodeURIComponent(window.location.origin)}`,
  },
  {
    label: "WhatsApp",
    icon: "bi-whatsapp",
    href: () => `https://wa.me/?text=${encodeURIComponent("AzGenealogy — " + window.location.origin)}`,
  },
  {
    label: "Linki kopyala",
    icon: "bi-link-45deg",
    href: null,
  },
];

export default function Footer() {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      alert("Link kopyalandı!");
    });
  };

  return (
    <footer className="az-footer">
      <div className="az-footer__inner">

        {/* Brand */}
        <div className="az-footer__brand">
          <div className="az-footer__logo">
            <i className="bi bi-tree-fill me-2"></i>AzGenealogy
          </div>
          <p className="az-footer__tagline">
            Azərbaycan soy ağaclarını qoruyun,<br />nəsilləri birləşdirin.
          </p>
          <p className="az-footer__desc">
            Genealogiya — insanların öz köklərinə, əcdadlarına və nəsillərinə
            olan bağlılığını tədqiq edən elmdir. AzGenealogy bu elmi
            hər kəsə əlçatan etmək üçün yaradılmışdır.
          </p>
        </div>

        {/* Naviqasiya */}
        <div className="az-footer__nav">
          <h6 className="az-footer__heading">Bölmələr</h6>
          <ul>
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Paylaş */}
        <div className="az-footer__share">
          <h6 className="az-footer__heading">Paylaş</h6>
          <div className="az-footer__share-btns">
            {SHARE_LINKS.map(({ label, icon, href }) => (
              href === null ? (
                <button key={label} className="az-footer__share-btn" onClick={handleCopy} title={label}>
                  <i className={`bi ${icon}`}></i>
                  <span>{label}</span>
                </button>
              ) : (
                <a key={label} className="az-footer__share-btn"
                  href={href()} target="_blank" rel="noopener noreferrer" title={label}>
                  <i className={`bi ${icon}`}></i>
                  <span>{label}</span>
                </a>
              )
            ))}
          </div>

          {/* Haqqında qısa */}
          <div className="az-footer__info mt-3">
            <div className="az-footer__info-row">
              <i className="bi bi-shield-check text-success"></i>
              <span>Məlumatlar yalnız cihazınızda saxlanılır</span>
            </div>
            <div className="az-footer__info-row">
              <i className="bi bi-file-earmark-text text-success"></i>
              <span>GEDCOM 5.5.1 standartı dəstəklənir</span>
            </div>
            <div className="az-footer__info-row">
              <i className="bi bi-translate text-success"></i>
              <span>Azərbaycan dilində</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alt xətt */}
      <div className="az-footer__bottom">
        <span>© {new Date().getFullYear()} AzGenealogy. Bütün hüquqlar qorunur.</span>
        <span className="az-footer__bottom-right">
          <i className="bi bi-heart-fill text-danger me-1"></i>
          Azərbaycan xalqının tarixinə həsr olunmuşdur
        </span>
      </div>
    </footer>
  );
}
