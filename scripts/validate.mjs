export function validate(data) {
  if (!data.meta?.name || !/^\d{4}-\d{2}-\d{2}$/.test(data.meta.verifiedAt)) throw Error('Chybí název nebo datum ověření.');
  if (typeof data.meta.indexable !== 'boolean') throw Error('indexable musí být boolean.');
  const ids = new Set();
  for (const source of data.sources) {
    if (ids.has(source.id) || !/^[a-z0-9-]+$/.test(source.id)) throw Error(`Neplatné či duplicitní ID: ${source.id}`);
    ids.add(source.id);
    const url = new URL(source.url);
    if (url.protocol !== 'https:') throw Error(`Zdroj musí používat HTTPS: ${source.id}`);
    if (!source.title || !source.publisher || !source.supports) throw Error(`Neúplný zdroj: ${source.id}`);
  }
  for (const entry of [data.about, ...data.about.facets, ...data.projects, ...data.achievements, ...data.experience, ...data.timeline]) {
    if (!entry.sources?.length || entry.sources.some(id => !ids.has(id))) throw Error(`Chybějící zdroj u: ${entry.title || entry.text}`);
  }
  if (!['proposal', 'approved'].includes(data.copy.status)) throw Error('Status autorského copy musí být proposal nebo approved.');
  for (const asset of data.mediaAssets) {
    if (!ids.has(asset.source) || new URL(asset.url).protocol !== 'https:') throw Error('Neplatný mediální podklad.');
    // This template deliberately renders references only; approved assets can be added locally after rights review.
    if (asset.rights !== 'unconfirmed' || asset.approved !== false) throw Error('Schválené fotografie vložte jako místní soubor až po doložení práv podle README.');
  }
  if (new Set(data.projects.map(p => p.id)).size !== data.projects.length) throw Error('Duplicitní ID projektu.');
}
