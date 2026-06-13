// ─────────────────────────────────────────────────────────────
//  Qraf data strukturu
//
//  forest: { id, name, createdAt, nodes: Node[], edges: Edge[] }
//
//  Node: { id, name, photo, narativ, attributes: { doğum, vəfat,
//          yer, lat, lng, cins, peşə, təhsil, nikahTarixi,
//          həyatYoldaşı, qeyd } }
//
//  Edge: { id, from, to, type }
//    type = "parent"   → from is parent of to
//    type = "marriage" → from and to are spouses (undirected)
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "azgenealogy_graph_forests";
const ACTIVE_KEY  = "azgenealogy_active_id";

export function generateId() {
  return "n_" + Math.random().toString(36).slice(2, 9);
}

// ─── Default nümunə data ─────────────────────────────────────
export function makeDefaultForest() {
  const rootId  = "root";
  const spouseId = "root_spouse";
  const child1  = "child1";
  const child2  = "child2";
  const marriageEdgeId = "m_root";

  return {
    id: "forest_1",
    name: "Ailə ağacım",
    createdAt: Date.now(),
    nodes: [
      {
        id: rootId,
        name: "Alaş",
        photo: null,
        narativ: "",
        attributes: {
          doğum: "1800", vəfat: "1870", yer: "Şamaxı",
          lat: 40.6317, lng: 48.6518,
          cins: "kişi", peşə: "", təhsil: "",
          nikahTarixi: "1820", qeyd: "Sülalənin banisi",
        },
      },
      {
        id: spouseId,
        name: "Güllü xanım",
        photo: null,
        narativ: "",
        attributes: {
          doğum: "1805", vəfat: "1875", yer: "Şamaxı",
          lat: 40.6317, lng: 48.6518,
          cins: "qadın", peşə: "", təhsil: "",
          nikahTarixi: "1820", qeyd: "",
        },
      },
      {
        id: child1,
        name: "Həsən",
        photo: null,
        narativ: "",
        attributes: {
          doğum: "1825", vəfat: "1895", yer: "Bakı",
          lat: 40.4093, lng: 49.8671,
          cins: "kişi", peşə: "Tacir", təhsil: "",
          nikahTarixi: "", qeyd: "",
        },
      },
      {
        id: child2,
        name: "Fatimə",
        photo: null,
        narativ: "",
        attributes: {
          doğum: "1828", vəfat: "1900", yer: "Bakı",
          lat: 40.4093, lng: 49.8671,
          cins: "qadın", peşə: "", təhsil: "",
          nikahTarixi: "", qeyd: "",
        },
      },
    ],
    edges: [
      // Nikah əlaqəsi
      { id: marriageEdgeId, from: rootId, to: spouseId, type: "marriage", date: "1820", note: "" },
      // Övladlar — həm atadan, həm anadan
      { id: "e1", from: rootId,    to: child1, type: "parent" },
      { id: "e2", from: spouseId, to: child1, type: "parent" },
      { id: "e3", from: rootId,    to: child2, type: "parent" },
      { id: "e4", from: spouseId, to: child2, type: "parent" },
    ],
  };
}

// ─── LocalStorage ────────────────────────────────────────────
export function loadGraphForests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length && parsed[0].nodes) return parsed; // yeni format
    }
  } catch { /* ignore */ }
  const initial = [makeDefaultForest()];
  saveGraphForests(initial);
  return initial;
}

export function saveGraphForests(forests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forests));
}

export function loadActiveGraphId() {
  return localStorage.getItem(ACTIVE_KEY) || "forest_1";
}

export function saveActiveGraphId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

// ─── Node əməliyyatları ───────────────────────────────────────
export function addNode(forest, node) {
  return { ...forest, nodes: [...forest.nodes, node] };
}

export function updateNodeInForest(forest, id, changes) {
  return {
    ...forest,
    nodes: forest.nodes.map(n => n.id === id ? { ...n, ...changes } : n),
  };
}

export function deleteNodeFromForest(forest, id) {
  return {
    ...forest,
    nodes: forest.nodes.filter(n => n.id !== id),
    edges: forest.edges.filter(e => e.from !== id && e.to !== id),
  };
}

export function getNodeById(forest, id) {
  return forest.nodes.find(n => n.id === id) || null;
}

// ─── Edge əməliyyatları ───────────────────────────────────────
export function addEdge(forest, edge) {
  // Duplikat yoxlaması
  const exists = forest.edges.some(
    e => e.type === edge.type &&
         ((e.from === edge.from && e.to === edge.to) ||
          (e.type === "marriage" && e.from === edge.to && e.to === edge.from))
  );
  if (exists) return forest;
  return { ...forest, edges: [...forest.edges, edge] };
}

export function removeEdge(forest, edgeId) {
  return { ...forest, edges: forest.edges.filter(e => e.id !== edgeId) };
}

export function updateEdge(forest, edgeId, changes) {
  return {
    ...forest,
    edges: forest.edges.map(e => e.id === edgeId ? { ...e, ...changes } : e),
  };
}

// Bir node-un valideynlərini tap
export function getParentsOf(forest, nodeId) {
  return forest.edges
    .filter(e => e.type === "parent" && e.to === nodeId)
    .map(e => forest.nodes.find(n => n.id === e.from))
    .filter(Boolean);
}

// Bir node-un övladlarını tap
export function getChildrenOf(forest, nodeId) {
  return forest.edges
    .filter(e => e.type === "parent" && e.from === nodeId)
    .map(e => forest.nodes.find(n => n.id === e.to))
    .filter(Boolean);
}

// Bir node-un həyat yoldaşlarını tap
export function getSpousesOf(forest, nodeId) {
  return forest.edges
    .filter(e => e.type === "marriage" && (e.from === nodeId || e.to === nodeId))
    .map(e => {
      const spouseId = e.from === nodeId ? e.to : e.from;
      const spouse = forest.nodes.find(n => n.id === spouseId);
      return spouse ? { ...e, spouse } : null;
    })
    .filter(Boolean);
}

// ─── Statistika ───────────────────────────────────────────────
export function calcGraphStats(forest) {
  const total    = forest.nodes.length;
  const kişi    = forest.nodes.filter(n => n.attributes?.cins === "kişi").length;
  const qadın   = forest.nodes.filter(n => n.attributes?.cins === "qadın").length;
  const withDates = forest.nodes.filter(n => n.attributes?.doğum).length;
  const withPhoto = forest.nodes.filter(n => n.photo).length;
  const marriages = forest.edges.filter(e => e.type === "marriage").length;

  // Max dərinlik — BFS ilə kök node-lardan hesabla
  const childIds = new Set(forest.edges.filter(e => e.type === "parent").map(e => e.to));
  const roots    = forest.nodes.filter(n => !childIds.has(n.id));
  let maxDepth = 0;
  function bfs(nodeId, depth) {
    if (depth > maxDepth) maxDepth = depth;
    getChildrenOf(forest, nodeId).forEach(c => bfs(c.id, depth + 1));
  }
  roots.forEach(r => bfs(r.id, 0));

  return { total, kişi, qadın, withDates, withPhoto, marriages, maxDepth };
}

// ─── Axtarış ─────────────────────────────────────────────────
export function searchGraph(forest, query) {
  const q = query.toLowerCase();
  return forest.nodes.filter(n =>
    n.name.toLowerCase().includes(q) ||
    (n.attributes?.yer  || "").toLowerCase().includes(q) ||
    (n.attributes?.peşə || "").toLowerCase().includes(q)
  );
}

// ─── Qohumluq ────────────────────────────────────────────────
// BFS ilə iki node arasında ən qısa yol (yalnız parent edge-lər)
export function findGraphRelationship(forest, idA, idB) {
  if (idA === idB) return { label: "Eyni şəxs", steps: 0, path: [idA] };

  // İki tərəfdən BFS
  const visitedA = new Map([[idA, null]]);
  const visitedB = new Map([[idB, null]]);
  const qA = [idA], qB = [idB];

  const getNeighbors = (id) => {
    const parents  = forest.edges.filter(e => e.type === "parent" && e.to   === id).map(e => e.from);
    const children = forest.edges.filter(e => e.type === "parent" && e.from === id).map(e => e.to);
    return [...parents, ...children];
  };

  const buildPath = (meeting, vA, vB) => {
    const pathA = [];
    let cur = meeting;
    while (cur !== null) { pathA.push(cur); cur = vA.get(cur); }
    const pathB = [];
    cur = vB.get(meeting);
    while (cur !== null) { pathB.push(cur); cur = vB.get(cur); }
    return [...pathA.reverse(), ...pathB];
  };

  for (let step = 0; step < 20; step++) {
    // A tərəfindən bir addım
    const nextA = [];
    for (const node of qA) {
      for (const nb of getNeighbors(node)) {
        if (!visitedA.has(nb)) {
          visitedA.set(nb, node);
          nextA.push(nb);
          if (visitedB.has(nb)) {
            const path = buildPath(nb, visitedA, visitedB);
            return { label: stepLabel(path.length - 1), steps: path.length - 1, path };
          }
        }
      }
    }
    qA.splice(0, qA.length, ...nextA);

    // B tərəfindən bir addım
    const nextB = [];
    for (const node of qB) {
      for (const nb of getNeighbors(node)) {
        if (!visitedB.has(nb)) {
          visitedB.set(nb, node);
          nextB.push(nb);
          if (visitedA.has(nb)) {
            const path = buildPath(nb, visitedA, visitedB);
            return { label: stepLabel(path.length - 1), steps: path.length - 1, path };
          }
        }
      }
    }
    qB.splice(0, qB.length, ...nextB);

    if (!qA.length && !qB.length) break;
  }
  return { label: "Qohumluq əlaqəsi tapılmadı", steps: null, path: [] };
}

function stepLabel(steps) {
  if (steps === 1) return "Birbaşa valideyn/övlad";
  if (steps === 2) return "Qardaş/Bacı və ya Baba/Nənə";
  if (steps === 3) return "Əmi/Dayı/Xala/Bibi";
  if (steps === 4) return "Əmioğlu (1-ci dərəcə)";
  if (steps === 5) return "Əmioğlu (2-ci dərəcə)";
  return `Uzaq qohum (${steps} addım)`;
}

// ─── Export ──────────────────────────────────────────────────
export function exportGraphToJSON(forest) {
  const blob = new Blob([JSON.stringify(forest, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "azgenealogy_graph.json";
  a.click(); URL.revokeObjectURL(url);
}

export function exportGraphToGEDCOM(forest) {
  const lines = ["0 HEAD", "1 GEDC", "2 VERS 5.5.1", "1 CHAR UTF-8"];
  forest.nodes.forEach((n, i) => {
    const a = n.attributes || {};
    lines.push(`0 @I${i + 1}@ INDI`);
    lines.push(`1 NAME ${n.name}`);
    if (a.cins === "kişi")  lines.push("1 SEX M");
    if (a.cins === "qadın") lines.push("1 SEX F");
    if (a.doğum) { lines.push("1 BIRT"); lines.push(`2 DATE ${a.doğum}`); if (a.yer) lines.push(`2 PLAC ${a.yer}`); }
    if (a.vəfat) { lines.push("1 DEAT"); lines.push(`2 DATE ${a.vəfat}`); }
    if (a.peşə)  lines.push(`1 OCCU ${a.peşə}`);
    if (n.narativ) lines.push(`1 NOTE ${n.narativ.slice(0, 200)}`);
  });
  lines.push("0 TRLR");
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "azgenealogy_graph.ged";
  a.click(); URL.revokeObjectURL(url);
}

export function importGraphFromJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.nodes || !data.edges) throw new Error("Yanlış format");
      onSuccess(data);
    } catch {
      onError("JSON faylı yanlış formatdadır");
    }
  };
  reader.readAsText(file);
}

// ─── Coğrafi məlumatlar ───────────────────────────────────────
export function collectGraphLocations(forest) {
  return forest.nodes
    .filter(n => n.attributes?.lat && n.attributes?.lng)
    .map(n => ({
      id: n.id, name: n.name,
      lat: n.attributes.lat, lng: n.attributes.lng,
      yer: n.attributes.yer, photo: n.photo,
      doğum: n.attributes.doğum, vəfat: n.attributes.vəfat,
    }));
}
