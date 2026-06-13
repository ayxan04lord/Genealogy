import Tree from "react-d3-tree";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  generateId, addChild, deleteNode, updateNode, prependRoot,
  addMarriage, removeMarriage, updateMarriage, getMarriagesOf, getSpouseId, findNode,
} from "../../data/treeData";
import PersonForm, { EMPTY_FORM, nodeToForm, formToNode } from "../person/PersonForm";
import SpouseOverlay from "./SpouseOverlay";
import MarriagePanel from "./MarriagePanel";
import "./Tree.css";

// ─── Əcdad + nəvə id-lərini topla ───────────────────────────
function getAncestorIds(tree, targetId, path = []) {
  if (tree.id === targetId) return path;
  for (const child of tree.children || []) {
    const found = getAncestorIds(child, targetId, [...path, tree.id]);
    if (found) return found;
  }
  return null;
}

function getDescendantIds(node) {
  const ids = [];
  function traverse(n) {
    ids.push(n.id);
    for (const c of n.children || []) traverse(c);
  }
  for (const c of node.children || []) traverse(c);
  return ids;
}

// ─── Custom node SVG ─────────────────────────────────────────
function CustomNode({ nodeDatum, onNodeClick, highlightIds, hasSpouse }) {
  const isRoot       = (nodeDatum.__rd3t?.depth || 0) === 0;
  const r            = isRoot ? 20 : 15;
  const hasPhoto     = !!nodeDatum.photo;
  const isAncestor   = highlightIds?.get?.(nodeDatum.id) === "ancestor";
  const isDescendant = highlightIds?.get?.(nodeDatum.id) === "descendant";
  const isSelf       = highlightIds?.get?.(nodeDatum.id) === "self";

  const circleFill = isSelf       ? "#f59e0b"
                   : isAncestor   ? "#0ea5e9"
                   : isDescendant ? "#a855f7"
                   : isRoot       ? "#145a32"
                   : nodeDatum.attributes?.cins === "qadın" ? "#9c27b0"
                   : "#1e8449";

  return (
    // data-spouse-id — SpouseOverlay bu atributla elementi tapır
    <g
      onClick={() => onNodeClick(nodeDatum)}
      style={{ cursor: "pointer" }}
      data-spouse-id={nodeDatum.id}
    >
      {hasPhoto && (
        <defs>
          <clipPath id={`clip_${nodeDatum.id}`}>
            <circle r={r} />
          </clipPath>
        </defs>
      )}

      {(isSelf || isAncestor || isDescendant) && (
        <circle r={r + 5} fill="none"
          stroke={isSelf ? "#f59e0b" : isAncestor ? "#0ea5e9" : "#a855f7"}
          strokeWidth={2} strokeDasharray={isSelf ? "none" : "4 3"} opacity={0.7} />
      )}

      {hasPhoto
        ? <image href={nodeDatum.photo} x={-r} y={-r} width={r * 2} height={r * 2}
            clipPath={`url(#clip_${nodeDatum.id})`} />
        : <circle r={r} fill={circleFill} stroke="#fff" strokeWidth={2} />
      }

      {/* Nikah indikatoru — sol üst küncə kiçik ürək */}
      {hasSpouse && (
        <text x={-r - 2} y={-r + 4} fontSize="10" textAnchor="middle"
          style={{ userSelect: "none" }}>♥</text>
      )}

      <text dy="0.35em" x={r + 8} textAnchor="start"
        style={{
          fontSize: isRoot ? "15px" : "13px",
          fontWeight: (isRoot || isSelf) ? "700" : "500",
          fill: isSelf ? "#92400e" : "#1a1a1a",
          userSelect: "none",
        }}>
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.doğum && (
        <text dy="1.6em" x={r + 8} textAnchor="start"
          style={{ fontSize: "11px", fill: "#6b7280" }}>
          {nodeDatum.attributes.doğum}{nodeDatum.attributes.vəfat ? ` – ${nodeDatum.attributes.vəfat}` : ""}
        </text>
      )}
      {nodeDatum.attributes?.peşə && (
        <text dy="3em" x={r + 8} textAnchor="start"
          style={{ fontSize: "10px", fill: "#9ca3af" }}>
          {nodeDatum.attributes.peşə}
        </text>
      )}
    </g>
  );
}

// ─── Detail panel ────────────────────────────────────────────
function DetailPanel({ node, treeData, marriages, onAdd, onPrepend, onEdit, onDelete,
                       onHighlight, highlighted, onOpenMarriage }) {
  const a = node.attributes || {};
  const [showNarativ, setShowNarativ] = useState(false);
  const myMarriages = getMarriagesOf(marriages, node.id);

  const rows = [
    { icon: "bi-calendar3",      val: a.doğum && (a.doğum + (a.vəfat ? ` – ${a.vəfat}` : "")) },
    { icon: "bi-geo-alt",        val: a.yer },
    { icon: "bi-briefcase",      val: a.peşə },
    { icon: "bi-mortarboard",    val: a.təhsil },
    { icon: "bi-chat-left-text", val: a.qeyd },
  ].filter(r => r.val);

  return (
    <>
      <div className="tree-panel__persona">
        {node.photo
          ? <img src={node.photo} alt={node.name} className="tree-panel__photo" />
          : <div className="tree-panel__avatar-placeholder"><i className="bi bi-person-fill"></i></div>
        }
        <div>
          <h5 className="tree-panel__name">{node.name}</h5>
          <div className="d-flex gap-1 flex-wrap">
            {a.cins && (
              <span className={"tree-panel__badge " + (a.cins === "qadın" ? "tree-panel__badge--f" : "tree-panel__badge--m")}>
                {a.cins === "qadın" ? "♀" : "♂"} {a.cins}
              </span>
            )}
            {myMarriages.length > 0 && (
              <span className="tree-panel__badge tree-panel__badge--marriage">
                ♥ {myMarriages.length} nikah
              </span>
            )}
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="tree-panel__attrs">
          {rows.map(({ icon, val }, i) => (
            <div key={i} className="tree-panel__attr-row">
              <i className={`bi ${icon}`}></i><span>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Nikah siyahısı — qısa göstəriş */}
      {myMarriages.length > 0 && (
        <div className="tree-panel__marriages">
          {myMarriages.map(m => {
            const spouseId   = getSpouseId(m, node.id);
            const spouseNode = findNode(treeData, spouseId);
            return (
              <div key={m.id} className="tree-panel__marriage-row">
                <span className="text-danger me-1">♥</span>
                <span>{spouseNode?.name || spouseId}</span>
                {m.date && <span className="text-muted ms-1 small">({m.date})</span>}
              </div>
            );
          })}
        </div>
      )}

      {node.narativ && (
        <div className="tree-panel__narativ">
          <button className="tree-panel__narativ-toggle" onClick={() => setShowNarativ(s => !s)}>
            <i className={"bi me-1 " + (showNarativ ? "bi-chevron-up" : "bi-journal-text")}></i>
            {showNarativ ? "Narativı gizlə" : "Narativə bax"}
          </button>
          {showNarativ && (
            <div className="tree-panel__narativ-text">{node.narativ}</div>
          )}
        </div>
      )}

      <div className="tree-panel__actions">
        <button
          className={"btn btn-sm " + (highlighted ? "btn-warning" : "btn-outline-warning")}
          onClick={onHighlight}>
          <i className={"bi me-1 " + (highlighted ? "bi-eye-slash" : "bi-diagram-2")}></i>
          {highlighted ? "Vurğulamı ləğv et" : "Nəsil xəttini göstər"}
        </button>
        {/* Nikah əlaqəsi düyməsi */}
        <button className="btn btn-sm btn-outline-danger" onClick={onOpenMarriage}>
          <i className="bi bi-hearts me-1"></i>
          Nikah əlaqəsi
          {myMarriages.length > 0 && (
            <span className="badge bg-danger ms-1">{myMarriages.length}</span>
          )}
        </button>
        {node.id === treeData.id && (
          <button className="btn btn-sm btn-outline-success" onClick={onPrepend}>
            <i className="bi bi-person-up me-1"></i>Valideyn əlavə et
          </button>
        )}
        <button className="btn btn-sm btn-success" onClick={onAdd}>
          <i className="bi bi-person-plus-fill me-1"></i>Uşaq əlavə et
        </button>
        <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>
          <i className="bi bi-pencil me-1"></i>Redaktə
        </button>
        {node.id !== treeData.id && (
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
            <i className="bi bi-trash me-1"></i>Sil
          </button>
        )}
      </div>
    </>
  );
}

// ─── Ana komponent ────────────────────────────────────────────
export default function TreePage({ treeData, onTreeChange, marriages, onMarriagesChange }) {
  const [dimensions,  setDimensions]  = useState({ width: 0, height: 0 });
  const [selected,    setSelected]    = useState(null);
  const [mode,        setMode]        = useState(null); // null|"add"|"edit"|"prepend"|"marriage"
  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [orientation, setOrientation] = useState("horizontal");
  const [highlightId, setHighlightId] = useState(null);
  const [translate,   setTranslate]   = useState({ x: 0, y: 0 });
  const [zoom,        setZoom]        = useState(0.8);
  const [treeKey,     setTreeKey]     = useState(0); // overlay-i yenidən hesablamaq üçün
  const containerRef = useRef();

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { offsetWidth: w, offsetHeight: h } = containerRef.current;
      setDimensions({ width: w, height: h });
      setTranslate(orientation === "horizontal" ? { x: w / 4, y: h / 2 } : { x: w / 2, y: 80 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [orientation]);

  // Ağac dəyişdikdə overlay-i yenilə
  useEffect(() => {
    const t = setTimeout(() => setTreeKey(k => k + 1), 200);
    return () => clearTimeout(t);
  }, [treeData, marriages, orientation, zoom]);

  // Nikahı olan node id-ləri — indikatoru göstərmək üçün
  const nodesWithSpouse = useMemo(() => {
    const s = new Set();
    (marriages || []).forEach(m => { s.add(m.personAId); s.add(m.personBId); });
    return s;
  }, [marriages]);

  const highlightMap = useMemo(() => {
    if (!highlightId) return null;
    const map = new Map();
    map.set(highlightId, "self");
    (getAncestorIds(treeData, highlightId) || []).forEach(id => map.set(id, "ancestor"));
    const target = findNodeInTree(treeData, highlightId);
    if (target) getDescendantIds(target).forEach(id => map.set(id, "descendant"));
    return map;
  }, [highlightId, treeData]);

  const handleNodeClick = useCallback((n) => { setSelected(n); setMode(null); }, []);
  const toggleHighlight = () => setHighlightId(id => id === selected?.id ? null : selected?.id);

  const openAdd      = () => { setFormData(EMPTY_FORM);           setMode("add"); };
  const openPrepend  = () => { setFormData(EMPTY_FORM);           setMode("prepend"); };
  const openEdit     = () => { setFormData(nodeToForm(selected)); setMode("edit"); };
  const openMarriage = () => setMode("marriage");

  const handleAdd = (e) => {
    e.preventDefault();
    onTreeChange(addChild(treeData, selected.id, { ...formToNode(formData, generateId()), children: [] }));
    setMode(null);
  };

  const handlePrepend = (e) => {
    e.preventDefault();
    onTreeChange(prependRoot(treeData, { ...formToNode(formData, generateId()), children: [] }));
    setSelected(null); setMode(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onTreeChange(updateNode(treeData, selected.id, formToNode(formData, selected.id)));
    setSelected(null); setMode(null);
  };

  const handleDelete = () => {
    if (selected.id === treeData.id) { alert("Kök node silinə bilməz."); return; }
    if (window.confirm(`"${selected.name}" silinsin?`)) {
      // Nikahları da sil
      const cleaned = (marriages || []).filter(
        m => m.personAId !== selected.id && m.personBId !== selected.id
      );
      onMarriagesChange(cleaned);
      onTreeChange(deleteNode(treeData, selected.id));
      setSelected(null);
      if (highlightId === selected.id) setHighlightId(null);
    }
  };

  const handleMarriageAdd = (aId, bId, date, note) => {
    onMarriagesChange(addMarriage(marriages || [], aId, bId, date, note));
  };

  const handleMarriageRemove = (id) => {
    onMarriagesChange(removeMarriage(marriages || [], id));
  };

  const handleMarriageUpdate = (id, changes) => {
    onMarriagesChange(updateMarriage(marriages || [], id, changes));
  };

  const closePanel = () => { setSelected(null); setMode(null); };

  const resetView = () => {
    const { width: w, height: h } = dimensions;
    setTranslate(orientation === "horizontal" ? { x: w / 4, y: h / 2 } : { x: w / 2, y: 80 });
    setZoom(0.8);
  };

  const toggleOrientation = () => {
    setOrientation(o => o === "horizontal" ? "vertical" : "horizontal");
    setSelected(null);
  };

  return (
    <div className="tree-wrapper" ref={containerRef}>

      {/* Nikah xətti overlay */}
      <SpouseOverlay
        marriages={marriages || []}
        containerRef={containerRef}
        treeKey={treeKey}
      />

      {/* Toolbar */}
      <div className="tree-toolbar">
        <button className="tree-toolbar__btn" onClick={toggleOrientation}>
          <i className={"bi " + (orientation === "horizontal" ? "bi-arrow-down" : "bi-arrow-right")}></i>
          <span>{orientation === "horizontal" ? "Şaquli" : "Üfüqi"}</span>
        </button>
        <div className="tree-toolbar__sep" />
        <button className="tree-toolbar__btn" onClick={() => setZoom(z => Math.min(z + 0.15, 2))}>
          <i className="bi bi-zoom-in"></i>
        </button>
        <button className="tree-toolbar__btn" onClick={() => setZoom(z => Math.max(z - 0.15, 0.2))}>
          <i className="bi bi-zoom-out"></i>
        </button>
        <button className="tree-toolbar__btn" onClick={resetView}>
          <i className="bi bi-fullscreen-exit"></i>
        </button>
        {highlightId && (
          <>
            <div className="tree-toolbar__sep" />
            <button className="tree-toolbar__btn tree-toolbar__btn--warn" onClick={() => setHighlightId(null)}>
              <i className="bi bi-eye-slash me-1"></i>Vurğulamı sil
            </button>
          </>
        )}
      </div>

      {highlightId && (
        <div className="tree-legend">
          <span className="tree-legend__item tree-legend__item--self">● Seçilmiş</span>
          <span className="tree-legend__item tree-legend__item--ancestor">● Əcdad</span>
          <span className="tree-legend__item tree-legend__item--descendant">● Nəsil</span>
        </div>
      )}

      {/* Nikah izahatı */}
      {(marriages || []).length > 0 && !highlightId && (
        <div className="tree-legend">
          <span className="tree-legend__item" style={{ color: "#e91e63" }}>♥ — nikah əlaqəsi</span>
        </div>
      )}

      {dimensions.width > 0 && (
        <Tree
          data={treeData}
          orientation={orientation}
          pathFunc="elbow"
          collapsible={true}
          translate={translate}
          zoom={zoom}
          separation={{ siblings: 1.8, nonSiblings: 2.2 }}
          nodeSize={{ x: 220, y: 70 }}
          renderCustomNodeElement={(rd3tProps) => (
            <CustomNode
              {...rd3tProps}
              onNodeClick={handleNodeClick}
              highlightIds={highlightMap}
              hasSpouse={nodesWithSpouse.has(rd3tProps.nodeDatum.id)}
            />
          )}
          styles={{ links: { stroke: "#94a3b8", strokeWidth: 1.5 } }}
          onUpdate={({ translate: t, zoom: z }) => { setTranslate(t); setZoom(z); }}
        />
      )}

      {/* Sağ panel */}
      {selected && (
        <div className="tree-panel">
          <button className="tree-panel__close" onClick={closePanel} title="Bağla">
            <i className="bi bi-x-lg"></i>
          </button>

          {mode === null && (
            <DetailPanel
              node={selected}
              treeData={treeData}
              marriages={marriages || []}
              onAdd={openAdd}
              onPrepend={openPrepend}
              onEdit={openEdit}
              onDelete={handleDelete}
              onHighlight={toggleHighlight}
              highlighted={highlightId === selected.id}
              onOpenMarriage={openMarriage}
            />
          )}
          {mode === "add" && (
            <PersonForm
              title={`"${selected.name}" altına şəxs əlavə et`}
              formData={formData} onChange={setFormData}
              onSubmit={handleAdd} onCancel={() => setMode(null)}
              submitLabel="Əlavə et"
            />
          )}
          {mode === "prepend" && (
            <PersonForm
              title={`"${selected.name}" üçün valideyn əlavə et`}
              formData={formData} onChange={setFormData}
              onSubmit={handlePrepend} onCancel={() => setMode(null)}
              submitLabel="Valideyn kimi əlavə et"
            />
          )}
          {mode === "edit" && (
            <PersonForm
              title="Şəxsi redaktə et"
              formData={formData} onChange={setFormData}
              onSubmit={handleEdit} onCancel={() => setMode(null)}
              submitLabel="Yadda saxla"
            />
          )}
          {mode === "marriage" && (
            <MarriagePanel
              node={selected}
              treeData={treeData}
              marriages={marriages || []}
              onAdd={handleMarriageAdd}
              onRemove={handleMarriageRemove}
              onUpdate={handleMarriageUpdate}
              onClose={() => setMode(null)}
            />
          )}
        </div>
      )}

      <div className="tree-hint">
        <i className="bi bi-info-circle me-1"></i>
        Node-a klik edin · Sürüşdürün · Scroll ilə zoom
      </div>
    </div>
  );
}

function findNodeInTree(tree, id) {
  if (tree.id === id) return tree;
  for (const c of tree.children || []) {
    const found = findNodeInTree(c, id);
    if (found) return found;
  }
  return null;
}
