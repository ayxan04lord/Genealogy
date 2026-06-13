import { useRef } from "react";
import PageLayout from "../components/layout/PageLayout";
import { calcGraphStats } from "../data/graphData";
import "./StatsPage.css";

function topValues(forest, key, limit = 5) {
  const counts = {};
  forest.nodes.forEach(n => {
    const val = n.attributes?.[key];
    if (val) counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function decadeDistribution(forest) {
  const counts = {};
  forest.nodes.forEach(n => {
    const y = parseInt(n.attributes?.doğum);
    if (y) {
      const bracket = Math.floor(y / 50) * 50;
      counts[bracket] = (counts[bracket] || 0) + 1;
    }
  });
  return Object.entries(counts).sort((a, b) => a[0] - b[0]);
}

export default function StatsPage({ forest, activeForestName, onOpenForests }) {
  const printRef = useRef();
  const { total, maxDepth, withDates, withPhoto, kişi, qadın, marriages } = calcGraphStats(forest);
  const withDatesPercent = total > 0 ? Math.round((withDates / total) * 100) : 0;
  const withPhotoPercent = total > 0 ? Math.round((withPhoto / total) * 100) : 0;
  const kişiPercent      = total > 0 ? Math.round((kişi / total) * 100) : 0;

  const topYerlər  = topValues(forest, "yer");
  const topPeşələr = topValues(forest, "peşə");
  const decades    = decadeDistribution(forest);
  const maxDecade  = Math.max(...decades.map(([, c]) => c), 1);

  return (
    <PageLayout activeForestName={activeForestName} onOpenForests={onOpenForests}>
      <div className="stats-page" ref={printRef}>
        <div className="stats-page__topbar">
          <h4 className="stats-page__title">
            <i className="bi bi-bar-chart-fill me-2 text-success"></i>Statistika
          </h4>
          <button className="btn btn-outline-success btn-sm no-print" onClick={() => window.print()}>
            <i className="bi bi-printer me-1"></i>Çap et / PDF
          </button>
        </div>

        <div className="stats-grid">
          {[
            { icon: "bi-people-fill",    label: "Ümumi şəxs",      value: total,     color: "#145a32" },
            { icon: "bi-diagram-3",      label: "Nəsil dərinliyi", value: maxDepth,   color: "#1e8449" },
            { icon: "bi-hearts",         label: "Nikah sayı",      value: marriages,  color: "#e91e63" },
            { icon: "bi-calendar-check", label: "Tarixli qeydlər", value: withDates,  color: "#0891b2" },
            { icon: "bi-image",          label: "Fotosu olan",     value: withPhoto,  color: "#7c3aed" },
            { icon: "bi-gender-male",    label: "Kişi",            value: kişi,       color: "#1d4ed8" },
            { icon: "bi-gender-female",  label: "Qadın",           value: qadın,      color: "#9c27b0" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="stats-card">
              <i className={`bi ${icon} stats-card__icon`} style={{ color }}></i>
              <div className="stats-card__value" style={{ color }}>{value}</div>
              <div className="stats-card__label">{label}</div>
            </div>
          ))}
        </div>

        <div className="stats-row">
          <div className="stats-col">
            <div className="stats-page__card">
              <h6 className="stats-section-title">Məlumat tamamlanması</h6>
              {[
                { label: "Tarix məlumatı", pct: withDatesPercent, color: "#1e8449" },
                { label: "Foto",           pct: withPhotoPercent, color: "#7c3aed" },
              ].map(({ label, pct, color }) => (
                <div key={label} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small text-muted">{label}</span>
                    <span className="small fw-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="progress" style={{ height: "10px", borderRadius: "5px" }}>
                    <div className="progress-bar"
                      style={{ width: `${pct}%`, background: color, borderRadius: "5px" }} />
                  </div>
                </div>
              ))}

              <h6 className="stats-section-title mt-3">Cins paylanması</h6>
              <div className="stats-gender">
                <div className="stats-gender__bar">
                  <div className="stats-gender__male"   style={{ width: `${kişiPercent}%` }} />
                  <div className="stats-gender__female" style={{ width: `${100 - kişiPercent}%` }} />
                </div>
                <div className="stats-gender__legend">
                  <span><span className="stats-gender__dot stats-gender__dot--m"></span>♂ Kişi — {kişi} ({kişiPercent}%)</span>
                  <span><span className="stats-gender__dot stats-gender__dot--f"></span>♀ Qadın — {qadın} ({100 - kişiPercent}%)</span>
                </div>
              </div>
            </div>

            {decades.length > 0 && (
              <div className="stats-page__card mt-3">
                <h6 className="stats-section-title">Doğum dövrü paylanması</h6>
                <div className="stats-decade-chart">
                  {decades.map(([year, count]) => (
                    <div key={year} className="stats-decade-row">
                      <span className="stats-decade-label">{year}s</span>
                      <div className="stats-decade-bar-wrap">
                        <div className="stats-decade-bar"
                          style={{ width: `${Math.round((count / maxDecade) * 100)}%` }} />
                      </div>
                      <span className="stats-decade-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="stats-col">
            {topYerlər.length > 0 && (
              <div className="stats-page__card">
                <h6 className="stats-section-title">
                  <i className="bi bi-geo-alt me-1 text-success"></i>Ən çox rast gəlinən yerlər
                </h6>
                {topYerlər.map(([yer, count]) => (
                  <div key={yer} className="stats-top-row">
                    <span>{yer}</span>
                    <span className="stats-top-badge">{count}</span>
                  </div>
                ))}
              </div>
            )}

            {topPeşələr.length > 0 && (
              <div className="stats-page__card mt-3">
                <h6 className="stats-section-title">
                  <i className="bi bi-briefcase me-1 text-success"></i>Ən çox rast gəlinən peşələr
                </h6>
                {topPeşələr.map(([peşə, count]) => (
                  <div key={peşə} className="stats-top-row">
                    <span>{peşə}</span>
                    <span className="stats-top-badge">{count}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="stats-page__card mt-3 no-print">
              <h6 className="fw-semibold mb-1 text-danger">
                <i className="bi bi-exclamation-triangle me-1"></i>Aktiv ağacı sıfırla
              </h6>
              <p className="text-muted small mb-3">Bu əməliyyat geri qaytarıla bilməz.</p>
              <button className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  if (window.confirm("Aktiv ağac sıfırlansın?")) {
                    localStorage.removeItem("azgenealogy_graph_forests");
                    window.location.reload();
                  }
                }}>
                <i className="bi bi-trash me-1"></i>Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
