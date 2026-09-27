(function exposeSaveManager(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProxySaves = api;
})(typeof globalThis !== "undefined" ? globalThis : this, (root) => {
  const DATABASE_NAME = "proxy-league-franchises";
  const STORE_NAME = "saves";
  const SCHEMA_VERSION = 1;
  const memoryStore = new Map();

  function checksum(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function createEnvelope(save) {
    const payload = { ...save, schemaVersion: SCHEMA_VERSION };
    const serialized = JSON.stringify(payload);
    return { format: "proxy-league-save", schemaVersion: SCHEMA_VERSION, checksum: checksum(serialized), payload };
  }

  function validateEnvelope(envelope) {
    if (!envelope || envelope.format !== "proxy-league-save" || !envelope.payload) throw new Error("This is not a Proxy League save file.");
    if (envelope.schemaVersion > SCHEMA_VERSION) throw new Error("This save was created by a newer game version.");
    if (checksum(JSON.stringify(envelope.payload)) !== envelope.checksum) throw new Error("Save checksum failed. The file may be damaged.");
    return envelope.payload;
  }

  function openDatabase() {
    if (!root.indexedDB) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const request = root.indexedDB.open(DATABASE_NAME, SCHEMA_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function writeRecord(record) {
    const database = await openDatabase();
    if (!database) { memoryStore.set(record.id, record); return record; }
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async function save(id, name, gameState, type = "manual") {
    return writeRecord({ id, name, type, updatedAt: new Date().toISOString(), envelope: createEnvelope(gameState) });
  }

  async function list() {
    const database = await openDatabase();
    if (!database) return [...memoryStore.values()].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result.sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)));
      request.onerror = () => reject(request.error);
    });
  }

  async function load(id) {
    const database = await openDatabase();
    const record = database ? await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }) : memoryStore.get(id);
    if (!record) throw new Error("Save slot was not found.");
    return validateEnvelope(record.envelope);
  }

  async function remove(id) {
    const database = await openDatabase();
    if (!database) { memoryStore.delete(id); return; }
    await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  function downloadJson(contents, filename) {
    const blob = new Blob([JSON.stringify(contents, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function exportSave(id) {
    const records = await list();
    const record = records.find((item) => item.id === id);
    if (!record) throw new Error("Save slot was not found.");
    downloadJson(record.envelope, `${record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.proxy-save`);
  }

  async function exportAll() {
    const records = await list();
    downloadJson({ format: "proxy-league-backup", schemaVersion: SCHEMA_VERSION, saves: records.map((record) => record.envelope) }, `proxy-league-backup-${new Date().toISOString().slice(0, 10)}.json`);
  }

  async function importText(text) {
    const parsed = JSON.parse(text);
    const envelopes = parsed.format === "proxy-league-backup" ? parsed.saves : [parsed];
    const imported = [];
    for (const envelope of envelopes) {
      const payload = validateEnvelope(envelope);
      const id = `imported-${payload.franchise?.teamId ?? "league"}-${Date.now()}-${imported.length}`;
      imported.push(await writeRecord({ id, name: payload.franchise?.teamName || "Imported Franchise", type: "imported", updatedAt: new Date().toISOString(), envelope }));
    }
    return imported;
  }

  return { save, list, load, remove, exportSave, exportAll, importText, createEnvelope, validateEnvelope, checksum, SCHEMA_VERSION };
});