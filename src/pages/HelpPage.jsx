import PageLayout from "../components/layout/PageLayout";
import "./HelpPage.css";

const FAQ = [
  {
    q: "Necə yeni şəxs əlavə edə bilərəm?",
    a: 'İki üsul var: 1) Ağacda istənilən node-a klik edin → "Uşaq əlavə et". 2) "Şəxs əlavə et" səhifəsindən valideyn seçib formu doldurun.',
  },
  {
    q: "Nəsil xəttini necə vurğulaya bilərəm?",
    a: 'Node-a klik edin → "Nəsil xəttini göstər" düyməsini basın. Sarı = seçilmiş, mavi = əcdadlar, bənövşəyi = nəsil. Toolbar-dan "Vurğulamı sil" ilə ləğv edin.',
  },
  {
    q: "Ağac yönünü necə dəyişim?",
    a: 'Ağac ekranının yuxarı sol küncündəki toolbar-dan "Şaquli" / "Üfüqi" düyməsini basın. Zoom +/- düymələri və sıfırlama da oradadır.',
  },
  {
    q: "Çoxlu soy ağacı necə istifadə edirəm?",
    a: 'Header-də ağac adının yanındakı düyməyə klik edin. Açılan modala yeni ağac yarada, adını dəyişə və ya silə bilərsiniz.',
  },
  {
    q: "Ağacı necə export/import edə bilərəm?",
    a: '"Şəxs əlavə et" səhifəsinin sağ tərəfindəki Export/Import panelindən JSON yükləyə, GEDCOM (.ged) formatında ixrac edə və ya JSON fayldan bərpa edə bilərsiniz.',
  },
  {
    q: "Xəritə işləmir, şəxslər görünmür.",
    a: 'Xəritədə görünmək üçün şəxsin "Enlik (lat)" və "Uzunluq (lng)" sahələri doldurulmalıdır. Redaktə modunda bu sahələri əlavə edin.',
  },
  {
    q: "Qohumluq hesablayıcısı nə edir?",
    a: 'İki şəxs seçilir, sistem onların ümumi əcdadını (LCA alqoritmi) tapır və əcdada olan məsafəyə görə qohumluq adını müəyyən edir.',
  },
  {
    q: "Narativ nədir, necə əlavə edilir?",
    a: 'Şəxsin redaktə formasında "Narativ" tabına keçin. Həmin şəxs haqqında istənilən uzunluqda hekayə, xatirə, tarixi qeyd yaza bilərsiniz. Ağacda node-a klik etdikdə narativ "Narativə bax" düyməsi ilə oxunur.',
  },
  {
    q: "Axtarışda filtr necə işləyir?",
    a: '"Filtrlər" düyməsi ilə şəhər, peşə, cins və doğum ili aralığına görə filtrləyə bilərsiniz. Filtrlər axtarışla birlikdə işləyir.',
  },
  {
    q: "Məlumatları sıfırlamaq istəyirəm.",
    a: 'Statistika səhifəsinin altında "Sıfırla" düyməsi var. Bu yalnız aktiv ağacı silib başlanğıca qaytarır.',
  },
];

export default function HelpPage({ activeForestName, onOpenForests }) {
  return (
    <PageLayout activeForestName={activeForestName} onOpenForests={onOpenForests}>
      <div className="help-page">
        <h4 className="help-page__title">
          <i className="bi bi-question-circle-fill me-2 text-success"></i>Kömək
        </h4>

        <div className="help-page__card mb-4">
          <h6 className="fw-semibold mb-3">
            <i className="bi bi-info-circle me-2 text-success"></i>AzGenealogy haqqında
          </h6>
          <p className="text-muted small mb-0">
            AzGenealogy — Azərbaycan soy ağaclarını qorumaq və vizuallaşdırmaq üçün hazırlanmış
            veb tətbiqidir. Ailənizdəki nəsilləri, doğum–vəfat tarixlərini, coğrafi məlumatları
            və tarixi narrativləri interaktiv ağac şəklində saxlaya bilərsiniz.
          </p>
        </div>

        <h6 className="fw-semibold mb-3">Tez-tez soruşulan suallar</h6>
        <div className="accordion" id="faqAccordion">
          {FAQ.map(({ q, a }, i) => (
            <div className="accordion-item help-accordion-item" key={i}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${i}`}
                >
                  {q}
                </button>
              </h2>
              <div id={`#faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-muted small">{a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
