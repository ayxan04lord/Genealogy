import { useEffect, useRef, useState, useCallback } from "react";
import { Network, DataSet } from "vis-network/standalone";
import {
  getParentsOf, getChildrenOf, getSpousesOf,
  addNode, updateNodeInForest, deleteNodeFromForest,
  addEdge, removeEdge, updateEdge,
  generateId,
} from "../../data/graphData";
import PersonFormGraph, { EMPTY_FORM, nodeToForm, formToGraph } from "../person/PersonFormGraph";
import NodePanel from "./NodePanel";
import EdgePanel from "./EdgePanel";
import "./FamilyGraph.css";

// ─── vis-network seçenekləri ─────────────────────────────────
function buildOptions(darkMode) {
  return {
    autoResize: true,
    layout: {
      hierarchical: {
        enabled: true,
        direction: "UD",          // yuxarıdan aşağı
        sortMethod: "directed",
        levelSeparation: 120,
        nodeSpacing: 180,
        treeSpacing: 220,
        parentCentralization: true,
        edgeMinimization: true,
        blockShifting: true,
      },
    },
    physics: { enabled: false },
    interaction: {
      dragNodes: true,
      zoomView: true,
      dragView: true,
      hover: true,
      tooltipDelay: 200,
    },
    nodes: {
      shape: "box",
      borderWidth: 2,
      borderWidthSelected: 3,
      font: { size: 13, face: "Segoe UI, sans-serif", color: "#1a1a1a" },
      margin: { top: 8, bottom: 8, left: 12, right: 12 },
      shadow: { enabled: true, color: "rgba(0,0,0,0.1)", size: 6, x: 2, y: 3 },
    },
    edges: {
      smooth: { type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 },
      arrows: { to: { enabled: true, scaleFactor: 0.6 } },
      width: 2,
      selectionWidth: 3,
    },
  };
}

// Node üçün vis data hazırla
function buildVisNode(node) {
  const a    = node.attributes || {};
  const cins = a.cins;
  const color = cins === "qadın"
    ? { background: "#fce7f3", border: "#e91e63", highlight: { background: "#f8bbd0", border: "#c2185b" } }
    : { background: "#e8f5e9", border: "#1e8449", highlight: { background: "#c8e6c9", border: "#145a32" } };

  const lines = [node.name];
  if (a.doğum) lines.push(a.doğum + (a.vəfat ? ` – ${a.vəfat}` : ""));
  if (a.yer)   lines.push(a.yer);
  if (a.peşə)  lines.push(a.peşə);

  return {
    id: node.id,
    label: lines.join("\n"),
    title: node.narativ
      ? `<div style="max-width:220px;font-size:12px">${node.narativ.slice(0, 150)}...</div>`
      : undefined,
    color,
    image: node.photo || undefined,
    shape: node.photo ? "circularImage" : "box",
    size: node.photo ? 36 : undefined,
    font: node.photo
      ? { size: 12, color: "#1a1a1a", vadjust: 48 }
      : { size: 13, color: "#1a1a1a" },
  };
}

// Edge üçün vis data hazırla
function buildVisEdge(edge) {
  if (edge.type === "marriage") {
    return {
      id: edge.id,
      from: edge.from,
      to: edge.to,
      color: { color: "#e91e63", highlight: "#c2185b" },
      dashes: [6, 4],
      arrows: { to: { enabled: false } },
      width: 2.5,
      label: edge.date ? `♥ ${edge.date}` : "♥",
      font: { size: 11, color: "#e91e63", align: "middle" },
      smooth: { type: "dynamic" },
    };
  }
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: { color: "#94a3b8", highlight: "#475569" },
    arrows: { to: { enabled: true, scaleFactor: 0.6 } },
  };
}

// ─── Ana komponent ────────────────────────────────────────────
export default function FamilyGraph({ forest, onForestChange }) {
  const containerRef = useRef(null);
  const networkRef   = useRef(null);
  const nodesDS      = useRef(null);
  const edgesDS      = useRef(null);
  const forestRef    = useRef(forest); // həmişə son forest-ə istinad

  // forestRef-i hər render-də yenilə
  useEffect(() => { forestRef.current = forest; }, [forest]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [panel, setPanel] = useState(null); // null|"node"|"edge"|"addChild"|"addParent"|"addSpouse"|"editNode"
  const [formData, setFormData] = useState(EMPTY_FORM);

  const selectedNode = selectedNodeId ? forest.nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? forest.edges.find(e => e.id === selectedEdgeId) : null;

  // Network qur
  useEffect(() => {
    if (!containerRef.current) return;

    // vis-network ResizeObserver xəbərdarlığını sustur
    const origErr = window.onerror;
    window.onerror = (msg, ...a) => {
      if (typeof msg === "string" && msg.includes("ResizeObserver")) return true;
      return origErr ? origErr(msg, ...a) : false;
    };

    nodesDS.current = new DataSet(forest.nodes.map(buildVisNode));
    edgesDS.current = new DataSet(forest.edges.map(buildVisEdge));

    const network = new Network(
      containerRef.current,
      { nodes: nodesDS.current, edges: edgesDS.current },
      buildOptions()
    );
    networkRef.current = network;

    // Container ölçüləndikdən sonra fit et
    const fitTimer = setTimeout(() => {
      network.fit({ animation: false });
    }, 150);

    network.on("selectNode",   ({ nodes })  => { setSelectedNodeId(nodes[0] || null); setSelectedEdgeId(null); setPanel("node"); });
    network.on("selectEdge",   ({ edges })  => { if (!edges.length) return; setSelectedEdgeId(edges[0]); setSelectedNodeId(null); setPanel("edge"); });
    network.on("deselectNode", ()           => { setSelectedNodeId(null); setPanel(null); });
    network.on("deselectEdge", ()           => { setSelectedEdgeId(null); setPanel(null); });
    network.on("doubleClick",  ({ nodes })  => {
      if (!nodes[0]) return;
      // forest-ə ref vasitəsilə müraciət edirik ki closure-da köhnə dəyər olmasın
      const node = forestRef.current.nodes.find(n => n.id === nodes[0]);
      if (!node) return;
      setSelectedNodeId(nodes[0]);
      setSelectedEdgeId(null);
      setFormData(nodeToForm(node));
      setPanel("editNode");
    });

    return () => {
      clearTimeout(fitTimer);
      network.destroy();
      networkRef.current = null;
      window.onerror = origErr;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // yalnız mount-da qurulur

  // Forest dəyişdikdə DataSet-i yenilə (network-ü yenidən qurmadan)
  useEffect(() => {
    if (!nodesDS.current || !edgesDS.current || !networkRef.current) return;
    const visNodes = forest.nodes.map(buildVisNode);
    const visEdges = forest.edges.map(buildVisEdge);
    nodesDS.current.clear();
    edgesDS.current.clear();
    nodesDS.current.add(visNodes);
    edgesDS.current.add(visEdges);
    // Yeni node əlavə olunduqda görünsün
    setTimeout(() => networkRef.current?.fit({ animation: { duration: 300 } }), 80);
  }, [forest]);

  // ── Əməliyyat handlerlər ──────────────────────────────────
  const handleAddChild = useCallback((e) => {
    e.preventDefault();
    const newNode = { ...formToGraph(formData, generateId()), id: generateId() };
    const parentId = selectedNodeId;
    let updated = addNode(forest, newNode);
    // Seçilmiş valideyndən edge
    updated = addEdge(updated, { id: generateId(), from: parentId, to: newNode.id, type: "parent" });
    // Əgər nikah əlaqəsi varsa — həyat yoldaşından da avtomatik parent edge əlavə et
    const spouses = getSpousesOf(forest, parentId);
    if (spouses.length === 1) {
      updated = addEdge(updated, {
        id: generateId(), from: spouses[0].spouse.id, to: newNode.id, type: "parent",
      });
    }
    onForestChange(updated);
    setPanel("node");
    setFormData(EMPTY_FORM);
  }, [forest, formData, selectedNodeId, onForestChange]);

  const handleAddParent = useCallback((e) => {
    e.preventDefault();
    const newNode = { ...formToGraph(formData, generateId()), id: generateId() };
    let updated = addNode(forest, newNode);
    updated = addEdge(updated, { id: generateId(), from: newNode.id, to: selectedNodeId, type: "parent" });
    onForestChange(updated);
    setPanel("node");
    setFormData(EMPTY_FORM);
  }, [forest, formData, selectedNodeId, onForestChange]);

  const handleAddSpouse = useCallback((spouseId, date, note) => {
    const updated = addEdge(forest, {
      id: generateId(), from: selectedNodeId, to: spouseId,
      type: "marriage", date, note,
    });
    onForestChange(updated);
    setPanel("node");
  }, [forest, selectedNodeId, onForestChange]);

  const handleAddChildBothParents = useCallback((e) => {
    e.preventDefault();
    const newNode = { ...formToGraph(formData, generateId()), id: generateId() };
    const parentId = selectedNodeId;
    const spouses = getSpousesOf(forest, parentId);
    let updated = addNode(forest, newNode);
    updated = addEdge(updated, { id: generateId(), from: parentId, to: newNode.id, type: "parent" });
    if (spouses.length === 1) {
      updated = addEdge(updated, { id: generateId(), from: spouses[0].spouse.id, to: newNode.id, type: "parent" });
    }
    onForestChange(updated);
    setPanel("node");
    setFormData(EMPTY_FORM);
  }, [forest, formData, selectedNodeId, onForestChange]);

  const handleEditNode = useCallback((e) => {
    e.preventDefault();
    const changes = formToGraph(formData, selectedNodeId);
    onForestChange(updateNodeInForest(forest, selectedNodeId, changes));
    setPanel("node");
  }, [forest, formData, selectedNodeId, onForestChange]);

  const handleDeleteNode = useCallback(() => {
    if (!window.confirm(`"${selectedNode?.name}" silinsin? Bağlı bütün əlaqələr də silinəcək.`)) return;
    onForestChange(deleteNodeFromForest(forest, selectedNodeId));
    setSelectedNodeId(null);
    setPanel(null);
  }, [forest, selectedNodeId, selectedNode, onForestChange]);

  const handleDeleteEdge = useCallback(() => {
    if (!window.confirm("Bu əlaqə silinsin?")) return;
    onForestChange(removeEdge(forest, selectedEdgeId));
    setSelectedEdgeId(null);
    setPanel(null);
  }, [forest, selectedEdgeId, onForestChange]);

  const handleUpdateEdge = useCallback((changes) => {
    onForestChange(updateEdge(forest, selectedEdgeId, changes));
  }, [forest, selectedEdgeId, onForestChange]);

  const openPanel = (p, nodeId) => {
    const nid  = nodeId ?? selectedNodeId;
    const node = nid ? forest.nodes.find(n => n.id === nid) : null;
    setFormData(p === "editNode" && node ? nodeToForm(node) : EMPTY_FORM);
    setPanel(p);
  };

  // Yeni ayrı node (kök) əlavə et
  const handleAddRoot = () => {
    setFormData(EMPTY_FORM);
    setPanel("addRoot");
  };

  const handleAddRootSubmit = (e) => {
    e.preventDefault();
    const newNode = { ...formToGraph(formData, generateId()), id: generateId() };
    onForestChange(addNode(forest, newNode));
    setPanel(null);
    setFormData(EMPTY_FORM);
  };

  const fitNetwork = () => networkRef.current?.fit({ animation: { duration: 500 } });

  const hasSpouse = selectedNode ? getSpousesOf(forest, selectedNodeId).length > 0 : false;

  return (
    <div className="fg-wrapper">
      {/* Toolbar */}
      <div className="fg-toolbar">
        <button className="fg-btn" onClick={handleAddRoot} title="Yeni müstəqil şəxs əlavə et">
          <i className="bi bi-person-plus-fill me-1"></i>Yeni şəxs
        </button>
        <div className="fg-sep" />
        <button className="fg-btn" onClick={fitNetwork} title="Hamısını göstər">
          <i className="bi bi-fullscreen-exit me-1"></i>Fit
        </button>
        <div className="fg-sep" />
        <div className="fg-legend">
          <span className="fg-legend__item fg-legend__item--m">■ Kişi</span>
          <span className="fg-legend__item fg-legend__item--f">■ Qadın</span>
          <span className="fg-legend__item fg-legend__item--m2">— Valideyn/Övlad</span>
          <span className="fg-legend__item fg-legend__item--sp">♥ Nikah</span>
        </div>
      </div>

      {/* Qraf canvas */}
      <div ref={containerRef} className="fg-canvas" />

      {/* Sağ panel */}
      {panel && (
        <div className="fg-panel">
          <button className="fg-panel__close" onClick={() => setPanel(null)}>
            <i className="bi bi-x-lg"></i>
          </button>

          {/* Node məlumatları */}
          {panel === "node" && selectedNode && (
            <NodePanel
              node={selectedNode}
              forest={forest}
              hasSpouse={hasSpouse}
              onAddChild={() => openPanel("addChild")}
              onAddChildBoth={() => openPanel("addChildBoth")}
              onAddParent={() => openPanel("addParent")}
              onAddSpouse={handleAddSpouse}
              onEdit={() => openPanel("editNode", selectedNodeId)}
              onDelete={handleDeleteNode}
            />
          )}

          {/* Edge məlumatları */}
          {panel === "edge" && selectedEdge && (
            <EdgePanel
              edge={selectedEdge}
              forest={forest}
              onUpdate={handleUpdateEdge}
              onDelete={handleDeleteEdge}
            />
          )}

          {/* Uşaq əlavə et (yalnız seçilmiş valideyndən) */}
          {panel === "addChild" && (
            <PersonFormGraph
              title={`"${selectedNode?.name}" altına uşaq əlavə et`}
              formData={formData}
              onChange={setFormData}
              onSubmit={handleAddChild}
              onCancel={() => setPanel("node")}
              submitLabel="Uşaq əlavə et"
            />
          )}

          {/* Uşaq əlavə et (hər iki valideyndən) */}
          {panel === "addChildBoth" && (
            <PersonFormGraph
              title={`"${selectedNode?.name}" + həyat yoldaşının uşağı`}
              formData={formData}
              onChange={setFormData}
              onSubmit={handleAddChildBothParents}
              onCancel={() => setPanel("node")}
              submitLabel="Hər iki valideyndən əlavə et"
            />
          )}

          {/* Valideyn əlavə et */}
          {panel === "addParent" && (
            <PersonFormGraph
              title={`"${selectedNode?.name}" üçün valideyn əlavə et`}
              formData={formData}
              onChange={setFormData}
              onSubmit={handleAddParent}
              onCancel={() => setPanel("node")}
              submitLabel="Valideyn kimi əlavə et"
            />
          )}

          {/* Redaktə */}
          {panel === "editNode" && (
            <PersonFormGraph
              title="Şəxsi redaktə et"
              formData={formData}
              onChange={setFormData}
              onSubmit={handleEditNode}
              onCancel={() => setPanel("node")}
              submitLabel="Yadda saxla"
            />
          )}

          {/* Yeni kök şəxs */}
          {panel === "addRoot" && (
            <PersonFormGraph
              title="Yeni müstəqil şəxs əlavə et"
              formData={formData}
              onChange={setFormData}
              onSubmit={handleAddRootSubmit}
              onCancel={() => setPanel(null)}
              submitLabel="Əlavə et"
            />
          )}
        </div>
      )}

      <div className="fg-hint">
        <i className="bi bi-info-circle me-1"></i>
        Node-a klik — detallar · Cüt klik — redaktə · Sürüşdür — naviqasiya
      </div>
    </div>
  );
}
