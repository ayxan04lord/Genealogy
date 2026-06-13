// ─────────────────────────────────────────────
//  Default nümunə ağac
// ─────────────────────────────────────────────
export const DEFAULT_TREE = {
  id: "root",
  name: "Alaş",
  photo: null,
  attributes: {
    doğum: "1800",
    vəfat: "1870",
    yer: "Şamaxı",
    lat: 40.6317,
    lng: 48.6518,
    qeyd: "Sülalənin banisi",
    cins: "kişi",
    peşə: "",
    təhsil: "",
    nikahTarixi: "",
    həyatYoldaşı: "",
  },
  children: [
    {
      id: "c1",
      name: "Ulu Soy",
      photo: null,
      attributes: {
        doğum: "1825", vəfat: "1895", yer: "Bakı",
        lat: 40.4093, lng: 49.8671,
        qeyd: "", cins: "kişi", peşə: "Tacir", təhsil: "",
        nikahTarixi: "", həyatYoldaşı: "Fatimə xanım",
      },
      children: [
        {
          id: "c1a",
          name: "Həsən",
          photo: null,
          attributes: {
            doğum: "1850", vəfat: "1920", yer: "Bakı",
            lat: 40.4093, lng: 49.8671,
            qeyd: "Tacir", cins: "kişi", peşə: "Tacir", təhsil: "Mədrəsə",
            nikahTarixi: "1875", həyatYoldaşı: "Xədicə xanım",
          },
          children: [],
        },
        {
          id: "c1b",
          name: "Hüseyn",
          photo: null,
          attributes: {
            doğum: "1855", vəfat: "1930", yer: "Gəncə",
            lat: 40.6828, lng: 46.3606,
            qeyd: "", cins: "kişi", peşə: "", təhsil: "",
            nikahTarixi: "", həyatYoldaşı: "",
          },
          children: [],
        },
      ],
    },
    {
      id: "c2",
      name: "Orta Soy",
      photo: null,
      attributes: {
        doğum: "1830", vəfat: "1900", yer: "Şəki",
        lat: 41.1977, lng: 47.1706,
        qeyd: "", cins: "kişi", peşə: "", təhsil: "",
        nikahTarixi: "", həyatYoldaşı: "",
      },
      children: [],
    },
    {
      id: "c3",
      name: "Kiçik Soy",
      photo: null,
      attributes: {
        doğum: "1835", vəfat: "1910", yer: "Naxçıvan",
        lat: 39.2092, lng: 45.4112,
        qeyd: "", cins: "qadın", peşə: "", təhsil: "",
        nikahTarixi: "", həyatYoldaşı: "",
      },
      children: [],
    },
  ],
};

// ─────────────────────────────────────────────
//  Çoxlu ağac idarəsi
// ─────────────────────────────────────────────
const FORESTS_KEY = "azgenealogy_forests";   // { id, name, createdAt, tree, marriages }[]
const ACTIVE_KEY  = "azgenealogy_active_id";

export function loadForests() {
  try {
    const raw = localStorage.getItem(FORESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const initial = [{
    id: "forest_1",
    name: "Ailə ağacım",
    createdAt: Date.now(),
    tree: DEFAULT_TREE,
    marriages: [],   // [{ id, personAId, personBId, date?, note? }]
  }];
  localStorage.setItem(FORESTS_KEY, JSON.stringify(initial));
  return initial;
}

export function saveForests(forests) {
  localStorage.setItem(FORESTS_KEY, JSON.stringify(forests));
}

export function loadActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || "forest_1";
}

export function saveActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

// ─────────────────────────────────────────────
//  Köhnə uyğunluq — tək ağac əməliyyatları
// ─────────────────────────────────────────────
export function loadTree() {
  const forests = loadForests();
  const activeId = loadActiveId();
  const found = forests.find(f => f.id === activeId);
  return found ? found.tree : forests[0].tree;
}

export function saveTree(tree) {
  const forests = loadForests();
  const activeId = loadActiveId();
  const updated = forests.map(f => f.id === activeId ? { ...f, tree } : f);
  saveForests(updated);
}

// ─────────────────────────────────────────────
//  Ağac əməliyyatları
// ─────────────────────────────────────────────
export function findNode(tree, id) {
  if (tree.id === id) return tree;
  for (const child of tree.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function addChild(tree, parentId, newNode) {
  if (tree.id === parentId) {
    return { ...tree, children: [...(tree.children || []), newNode] };
  }
  return { ...tree, children: (tree.children || []).map(c => addChild(c, parentId, newNode)) };
}

export function updateNode(tree, id, updated) {
  if (tree.id === id) return { ...tree, ...updated };
  return { ...tree, children: (tree.children || []).map(c => updateNode(c, id, updated)) };
}

export function deleteNode(tree, id) {
  return {
    ...tree,
    children: (tree.children || [])
      .filter(c => c.id !== id)
      .map(c => deleteNode(c, id)),
  };
}

export function generateId() {
  return "n_" + Math.random().toString(36).slice(2, 9);
}

// ─────────────────────────────────────────────
//  Axtarış
// ─────────────────────────────────────────────
export function searchTree(tree, query) {
  const results = [];
  const q = query.toLowerCase();
  function traverse(node, path) {
    const inName = node.name.toLowerCase().includes(q);
    const inYer  = (node.attributes?.yer || "").toLowerCase().includes(q);
    const inPeşə = (node.attributes?.peşə || "").toLowerCase().includes(q);
    if (inName || inYer || inPeşə) results.push({ node, path });
    for (const child of node.children || []) traverse(child, [...path, node.name]);
  }
  traverse(tree, []);
  return results;
}

// ─────────────────────────────────────────────
//  Statistika
// ─────────────────────────────────────────────
export function calcStats(tree) {
  let total = 0, maxDepth = 0, withDates = 0, withPhoto = 0;
  let kişi = 0, qadın = 0;
  function traverse(node, depth) {
    total++;
    if (depth > maxDepth) maxDepth = depth;
    if (node.attributes?.doğum) withDates++;
    if (node.photo) withPhoto++;
    if (node.attributes?.cins === "kişi") kişi++;
    else if (node.attributes?.cins === "qadın") qadın++;
    for (const child of node.children || []) traverse(child, depth + 1);
  }
  traverse(tree, 0);
  return { total, maxDepth, withDates, withPhoto, kişi, qadın };
}

// ─────────────────────────────────────────────
//  Coğrafi məlumatlar — xəritə üçün
// ─────────────────────────────────────────────
export function collectLocations(tree) {
  const locs = [];
  function traverse(node) {
    const { lat, lng, yer } = node.attributes || {};
    if (lat && lng) {
      locs.push({ id: node.id, name: node.name, lat, lng, yer, photo: node.photo,
                  doğum: node.attributes?.doğum, vəfat: node.attributes?.vəfat });
    }
    for (const child of node.children || []) traverse(child);
  }
  traverse(tree);
  return locs;
}

// ─────────────────────────────────────────────
//  Qohumluq hesablayıcı
// ─────────────────────────────────────────────
// Hər node-un əcdadlarına gedən yolu tapır
function getPath(tree, targetId) {
  if (tree.id === targetId) return [tree.id];
  for (const child of tree.children || []) {
    const path = getPath(child, targetId);
    if (path) return [tree.id, ...path];
  }
  return null;
}

export function findRelationship(tree, idA, idB) {
  const pathA = getPath(tree, idA);
  const pathB = getPath(tree, idB);
  if (!pathA || !pathB) return null;

  // Ümumi əcdad tap
  let lca = null, depthA = 0, depthB = 0;
  for (let i = 0; i < pathA.length; i++) {
    const j = pathB.indexOf(pathA[i]);
    if (j !== -1) { lca = pathA[i]; depthA = pathA.length - 1 - i; depthB = pathB.length - 1 - j; break; }
  }
  if (!lca) return { label: "Qohumluq əlaqəsi yoxdur", depthA: null, depthB: null, lca: null };

  const lcaNode = findNode(tree, lca);
  return { lca, lcaName: lcaNode?.name, depthA, depthB, label: relationLabel(depthA, depthB) };
}

function relationLabel(a, b) {
  if (a === 0 && b === 0) return "Eyni şəxs";
  if (a === 0) return b === 1 ? "Valideyn" : b === 2 ? "Baba/Nənə" : `${b}-ci dərəcə əcdad`;
  if (b === 0) return a === 1 ? "Övlad" : a === 2 ? "Nəvə" : `${a}-ci dərəcə nəvə`;
  if (a === 1 && b === 1) return "Qardaş / Bacı";
  if (a === 1 && b === 2) return "Əmi / Dayı / Xala / Bibi";
  if (a === 2 && b === 1) return "Qardaşoğlu / Bacıoğlu";
  if (a === 2 && b === 2) return "Əmioğlu / Xalaoğlu (1-ci dərəcə)";
  if (a === 3 && b === 3) return "2-ci dərəcə əmioğlu";
  return `Uzaq qohum (${a}+${b} addım)`;
}

// ─────────────────────────────────────────────
//  Export / Import
// ─────────────────────────────────────────────
export function exportToJSON(tree) {
  const blob = new Blob([JSON.stringify(tree, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "azgenealogy_export.json";
  a.click(); URL.revokeObjectURL(url);
}

export function exportToGEDCOM(tree) {
  const lines = ["0 HEAD", "1 GEDC", "2 VERS 5.5.1", "1 CHAR UTF-8"];
  let indi = 1;
  const idMap = {};

  function traverse(node) {
    const ref = `I${indi++}`;
    idMap[node.id] = ref;
    const a = node.attributes || {};
    lines.push(`0 @${ref}@ INDI`);
    lines.push(`1 NAME ${node.name}`);
    if (a.cins === "kişi")   lines.push("1 SEX M");
    if (a.cins === "qadın")  lines.push("1 SEX F");
    if (a.doğum || a.yer) {
      lines.push("1 BIRT");
      if (a.doğum) lines.push(`2 DATE ${a.doğum}`);
      if (a.yer)   lines.push(`2 PLAC ${a.yer}`);
    }
    if (a.vəfat) { lines.push("1 DEAT"); lines.push(`2 DATE ${a.vəfat}`); }
    if (a.peşə)  lines.push(`1 OCCU ${a.peşə}`);
    if (a.qeyd)  lines.push(`1 NOTE ${a.qeyd}`);
    for (const child of node.children || []) traverse(child);
  }

  traverse(tree);
  lines.push("0 TRLR");
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "azgenealogy_export.ged";
  a.click(); URL.revokeObjectURL(url);
}

export function importFromJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.id || !data.name) throw new Error("Yanlış format");
      onSuccess(data);
    } catch {
      onError("JSON faylı yanlış formatdadır");
    }
  };
  reader.readAsText(file);
}

// Ağacın əvvəlinə yeni kök əlavə et — köhnə kök yeni kökün uşağı olur
export function prependRoot(tree, newRoot) {
  return {
    ...newRoot,
    children: [tree],
  };
}

// ─────────────────────────────────────────────
//  Nikah / Həyat yoldaşı əməliyyatları
// ─────────────────────────────────────────────

// Nikah əlavə et — iki mövcud node arasında
export function addMarriage(marriages, personAId, personBId, date = "", note = "") {
  // Artıq var mı?
  const exists = marriages.some(
    m => (m.personAId === personAId && m.personBId === personBId) ||
         (m.personAId === personBId && m.personBId === personAId)
  );
  if (exists) return marriages;
  return [...marriages, { id: generateId(), personAId, personBId, date, note }];
}

// Nikah sil
export function removeMarriage(marriages, marriageId) {
  return marriages.filter(m => m.id !== marriageId);
}

// Nikahı yenilə
export function updateMarriage(marriages, marriageId, changes) {
  return marriages.map(m => m.id === marriageId ? { ...m, ...changes } : m);
}

// Bir şəxsin bütün nikahlarını tap
export function getMarriagesOf(marriages, personId) {
  return marriages.filter(
    m => m.personAId === personId || m.personBId === personId
  );
}

// Nikahda partner id-sini tap
export function getSpouseId(marriage, personId) {
  return marriage.personAId === personId ? marriage.personBId : marriage.personAId;
}

// Ağacı flatten et (siyahı üçün)
export function flattenTree(node, depth = 0) {
  const indent = "— ".repeat(depth);
  const items  = [{ id: node.id, label: indent + node.name, name: node.name }];
  for (const child of node.children || []) items.push(...flattenTree(child, depth + 1));
  return items;
}
