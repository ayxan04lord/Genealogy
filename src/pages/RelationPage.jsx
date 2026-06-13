import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { findGraphRelationship } from "../data/graphData";
import "./RelationPage.css";

export default function RelationPage({ forest, activeForestName, onOpenForests }) {
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");
  const [result, setResult] = useState(null);

  const handleCalc = (e) => {
    e.preventDefault();
    if (!idA || !idB) return;
    setResult(findGraphRelationship(forest, idA, idB));
  };

  const pathNodes = result?.path?.map(id => forest.nodes.find(n => n.id === id)?.name || id) || [];

  return (
    <PageLayout activeForestName={activeForestName} onOpenForests={onOpenForests}>
      <div className="relation-page">
        <div className="relation-card">
          <h4 className="relation-card__title">
            <i className="bi bi-share-fill me-2 text-success"></i>Qohumluq hesablayıcı
          </h4>
          <p className="text-muted small mb-4">
            İki şəxs seçin — sistem aralarındakı qohumluq əlaqəsini müəyyən edəcək.
          </p>

          <form onSubmit={handleCalc}>
            <div className="relation-selectors">
              <div className="relation-selector">
                <label className="form-label fw-semibold">1-ci şəxs</label>
                <select className="form-select" value={idA}
                  onChange={e => { setIdA(e.target.value); setResult(null); }} required>
                  <option value="">Seçin...</option>
                  {forest.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
              <div className="relation-versus">↔</div>
              <div className="relation-selector">
                <label className="form-label fw-semibold">2-ci şəxs</label>
                <select className="form-select" value={idB}
                  onChange={e => { setIdB(e.target.value); setResult(null); }} required>
                  <option value="">Seçin...</option>
                  {forest.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3" disabled={!idA || !idB}>
              <i className="bi bi-calculator me-2"></i>Qohumluğu müəyyən et
            </button>
          </form>

          {result && (
            <div className={"relation-result " + (result.steps !== null ? "relation-result--found" : "relation-result--none")}>
              <div className="relation-result__label">
                <i className={"bi me-2 " + (result.steps !== null ? "bi-check-circle-fill text-success" : "bi-x-circle text-muted")}></i>
                {result.label}
              </div>

              {result.steps !== null && pathNodes.length > 0 && (
                <div className="relation-result__details">
                  <div className="relation-result__path">
                    {pathNodes.map((name, i) => (
                      <span key={i}>
                        <span className={
                          i === 0 || i === pathNodes.length - 1
                            ? "relation-result__person"
                            : "relation-result__mid"
                        }>{name}</span>
                        {i < pathNodes.length - 1 && (
                          <span className="relation-result__arrow"> → </span>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="relation-result__meta">
                    Ümumi addım: <strong>{result.steps}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relation-info">
          <h6 className="fw-semibold mb-3">
            <i className="bi bi-info-circle me-1 text-success"></i>Necə işləyir?
          </h6>
          <ul className="text-muted small">
            <li>Sistem BFS alqoritmi ilə iki şəxs arasındakı ən qısa yolu tapır</li>
            <li>Valideyn, övlad bağlantıları üzərindən hesablanır</li>
            <li>Həm ata, həm ana xətti nəzərə alınır</li>
          </ul>
          <div className="relation-info__table">
            {[
              ["Valideyn / Övlad",        "1 addım"],
              ["Qardaş / Bacı",           "2 addım"],
              ["Əmi / Dayı / Xala",       "3 addım"],
              ["Əmioğlu (1-ci dərəcə)",   "4 addım"],
              ["Əmioğlu (2-ci dərəcə)",   "5 addım"],
            ].map(([label, dist]) => (
              <div key={label} className="relation-info__row">
                <span>{label}</span>
                <span className="text-muted">{dist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
