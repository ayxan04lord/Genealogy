import { useEffect, useState, useRef } from "react";

/**
 * react-d3-tree-nin render etdiyi SVG node-larının ekran mövqeyini tapıb
 * aralarına nikah xətti çəkən overlay komponenti.
 *
 * react-d3-tree hər node üçün <g class="rd3t-node"> elementi yaradır.
 * Biz data-id atributunu CustomNode-da əlavə edirik, bura g elementləri
 * tapılır, BoundingClientRect alınır, nikah cütləri arasına xətt çəkilir.
 */
export default function SpouseOverlay({ marriages, containerRef, treeKey }) {
  const [lines, setLines] = useState([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!containerRef?.current || !marriages?.length) {
      setLines([]);
      return;
    }

    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const newLines = [];
      for (const m of marriages) {
        const elA = container.querySelector(`[data-spouse-id="${m.personAId}"]`);
        const elB = container.querySelector(`[data-spouse-id="${m.personBId}"]`);
        if (!elA || !elB) continue;

        const rA = elA.getBoundingClientRect();
        const rB = elB.getBoundingClientRect();

        // Node mərkəzlərini hesabla (container-ə görə)
        const ax = rA.left + rA.width / 2  - containerRect.left;
        const ay = rA.top  + rA.height / 2 - containerRect.top;
        const bx = rB.left + rB.width / 2  - containerRect.left;
        const by = rB.top  + rB.height / 2 - containerRect.top;

        // Orta nöqtə — nikah tarixi labeli üçün
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;

        newLines.push({ id: m.id, ax, ay, bx, by, mx, my, date: m.date, note: m.note,
                        personAId: m.personAId, personBId: m.personBId });
      }
      setLines(newLines);
    };

    // Bir az gözləyirik ki D3 render tamamlansın
    const timer = setTimeout(calculate, 120);

    // Resize-da yenidən hesabla
    const observer = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculate);
    });
    observer.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [marriages, containerRef, treeKey]);

  if (!lines.length) return null;

  return (
    <svg
      className="spouse-overlay"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <defs>
        {/* Nikah xətti üçün gradient */}
        <marker id="heart-marker" markerWidth="10" markerHeight="10"
          refX="5" refY="5" orient="auto">
          <text x="0" y="8" fontSize="10" fill="#e91e63">♥</text>
        </marker>
      </defs>

      {lines.map(line => {
        // Xətti node dairəsinin kənarında başlat (r=15 px)
        const dx = line.bx - line.ax;
        const dy = line.by - line.ay;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const r = 18;
        const x1 = line.ax + (dx / dist) * r;
        const y1 = line.ay + (dy / dist) * r;
        const x2 = line.bx - (dx / dist) * r;
        const y2 = line.by - (dy / dist) * r;

        return (
          <g key={line.id}>
            {/* Kölgə effekti üçün arxafon xətti */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(233,30,99,0.15)" strokeWidth={6}
              strokeLinecap="round" />
            {/* Əsas nikah xətti — qırmızımtıl, dash */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#e91e63"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            {/* Orta nöqtədə ürək ikonu */}
            <text x={line.mx} y={line.my - 6}
              textAnchor="middle" fontSize="13" style={{ userSelect: "none" }}>
              ♥
            </text>
            {/* Nikah tarixi */}
            {line.date && (
              <text x={line.mx} y={line.my + 14}
                textAnchor="middle" fontSize="10"
                fill="#880e4f"
                style={{ userSelect: "none" }}>
                {line.date}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
