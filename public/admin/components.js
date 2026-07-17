// Custom content blocks for Sveltia CMS (Buy Box, Table, Callout, Centered text).
// Loaded after the CMS core script — see admin/index.html.
// Each block encodes its field data as an encoded JSON string inside an HTML
// comment (invisible on the live site) so it round-trips cleanly when you
// reopen the entry to edit it, then renders plain HTML that Astro's Markdown
// pipeline passes through untouched.

function encode(data) {
  return encodeURIComponent(JSON.stringify(data));
}
function decode(str) {
  return JSON.parse(decodeURIComponent(str));
}
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

CMS.registerEditorComponent({
  id: 'buybox',
  label: 'Buy Box',
  icon: 'shopping_cart',
  fields: [
    { name: 'name', label: 'Product Name', widget: 'string' },
    { name: 'url', label: 'Buy Link (affiliate URL or /go/slug)', widget: 'string' },
    { name: 'buttonText', label: 'Button Text', widget: 'string', default: 'Check Price' },
  ],
  pattern: /<!--buybox:(?<data>[^>]*?)-->[\s\S]*?<\/div>\s*<!--\/buybox-->/,
  fromBlock: (match) => decode(match.groups.data),
  toBlock: (data) => {
    const name = escapeHtml(data.name);
    const buttonText = escapeHtml(data.buttonText || 'Check Price');
    const url = escapeHtml(data.url || '');
    return `<!--buybox:${encode(data)}-->
<div class="buy-box">
  <span class="buy-box-name">${name}</span>
  <a href="${url}" class="buy-box-btn" rel="sponsored nofollow noopener" target="_blank">${buttonText}</a>
</div>
<!--/buybox-->`;
  },
  toPreview: (data) => `
    <div class="buy-box">
      <span class="buy-box-name">${escapeHtml(data.name)}</span>
      <a href="${escapeHtml(data.url || '')}" class="buy-box-btn">${escapeHtml(data.buttonText || 'Check Price')}</a>
    </div>
  `,
});

CMS.registerEditorComponent({
  id: 'table',
  label: 'Table',
  icon: 'table',
  fields: [
    { name: 'headers', label: 'Column headers', widget: 'list', field: { label: 'Header', name: 'value', widget: 'string' } },
    {
      name: 'rows',
      label: 'Rows',
      widget: 'list',
      fields: [
        { name: 'cells', label: 'Cells', widget: 'list', field: { label: 'Cell', name: 'value', widget: 'string' } },
      ],
    },
  ],
  pattern: /<!--table:(?<data>[^>]*?)-->[\s\S]*?<\/table>\s*<!--\/table-->/,
  fromBlock: (match) => decode(match.groups.data),
  toBlock: (data) => {
    const headers = data.headers || [];
    const rows = data.rows || [];
    const theadHtml = headers.length
      ? `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`
      : '';
    const tbodyHtml = `<tbody>${rows
      .map((r) => `<tr>${(r.cells || []).map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody>`;
    return `<!--table:${encode(data)}-->
<table class="content-table">${theadHtml}${tbodyHtml}</table>
<!--/table-->`;
  },
  toPreview: (data) => {
    const headers = data.headers || [];
    const rows = data.rows || [];
    const theadHtml = headers.length
      ? `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`
      : '';
    const tbodyHtml = `<tbody>${rows
      .map((r) => `<tr>${(r.cells || []).map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody>`;
    return `<table class="content-table">${theadHtml}${tbodyHtml}</table>`;
  },
});

CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout Box',
  icon: 'lightbulb',
  fields: [
    { name: 'heading', label: 'Heading (e.g. "Quick verdict")', widget: 'string', required: false },
    { name: 'text', label: 'Text', widget: 'text' },
    {
      name: 'theme',
      label: 'Color',
      widget: 'select',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Neutral', value: 'neutral' },
      ],
      default: 'orange',
    },
  ],
  pattern: /<!--callout:(?<data>[^>]*?)-->[\s\S]*?<\/div>\s*<!--\/callout-->/,
  fromBlock: (match) => decode(match.groups.data),
  toBlock: (data) => {
    const heading = data.heading ? `<strong class="callout-heading">${escapeHtml(data.heading)}:</strong> ` : '';
    return `<!--callout:${encode(data)}-->
<div class="callout-box callout-${data.theme || 'orange'}">${heading}${escapeHtml(data.text)}</div>
<!--/callout-->`;
  },
  toPreview: (data) => {
    const heading = data.heading ? `<strong class="callout-heading">${escapeHtml(data.heading)}:</strong> ` : '';
    return `<div class="callout-box callout-${data.theme || 'orange'}">${heading}${escapeHtml(data.text)}</div>`;
  },
});

CMS.registerEditorComponent({
  id: 'centered',
  label: 'Centered Text',
  icon: 'format_align_center',
  fields: [{ name: 'text', label: 'Text', widget: 'text' }],
  pattern: /<!--centered:(?<data>[^>]*?)-->[\s\S]*?<\/p>\s*<!--\/centered-->/,
  fromBlock: (match) => decode(match.groups.data),
  toBlock: (data) => `<!--centered:${encode(data)}-->
<p class="text-centered">${escapeHtml(data.text)}</p>
<!--/centered-->`,
  toPreview: (data) => `<p class="text-centered">${escapeHtml(data.text)}</p>`,
});
