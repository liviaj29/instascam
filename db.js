// db.js
const db = new Dexie("InstaScam");

db.version(1).stores({
  reports: "++id, url, dateReported"
});

export async function reportDomain(url) {
  const exists = await db.reports.where("url").equals(url).first();
  if (!exists) {
    await db.reports.add({
      url,
      dateReported: new Date().toISOString()
    });
  }
}

export async function isDomainReported(url) {
  const found = await db.reports.where("url").equals(url).first();
  return !!found;
}

export default db;
