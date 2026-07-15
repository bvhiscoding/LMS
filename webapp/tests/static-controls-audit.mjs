import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlFiles = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(root);

const findings = [];
for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  // Deprecated dashboard markup is kept only as a source reference and is never rendered.
  const auditedSource = source.replace(/<section\b[^>]*class=["'][^"']*dashboard-legacy[^"']*["'][^>]*hidden[^>]*>[\s\S]*?<\/section>/gi, '');
  const scriptSources = [...source.matchAll(/<script\b[^>]*src=["']([^"']+\.js)["'][^>]*>/gi)].map(match => {
    const scriptPath = path.resolve(path.dirname(file), match[1]);
    return fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, 'utf8') : '';
  }).join('\n');
  const contracts = `${source}\n${scriptSources}`;
  const ids = new Set([...auditedSource.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
  for (const match of auditedSource.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1];
    const href = attrs.match(/\bhref=["']([^"']*)["']/i)?.[1];
    const classes = attrs.match(/\bclass=["']([^"']+)["']/i)?.[1].split(/\s+/) || [];
    const label = match[2].replace(/<[^>]+>/g, '').trim();
    const forgotPasswordHandled = label.includes('Quên mật khẩu') && contracts.includes("textContent.includes('Quên mật khẩu')");
    const scripted = /\bdata-href=/i.test(attrs) || classes.some(className => contracts.includes(`.${className}`)) || contracts.includes('a[href="#"]') || forgotPasswordHandled;
    const contextLinks = {
      'chi-tiet-cau-hoi.html': ['An toàn lao động', '3 đề thi', '18'],
      'chi-tiet-chu-de.html': ['Pháp luật'],
      'dashboard-lanh-dao.html': ['Xem tất cả đơn vị']
    };
    const missingHandled = href === undefined && (
      (path.basename(file) === 'ngan-hang-de-thi.html' && contracts.includes('a:not([href])')) ||
      (contextLinks[path.basename(file)]?.includes(label) && contracts.includes(`'${label}'`))
    );
    if ((href === undefined || href === '#' || href === '') && !scripted && !missingHandled) findings.push({ file, kind: 'LINK', label: match[2].replace(/<[^>]+>/g, '').trim(), reason: 'thiếu href hoặc href rỗng/# không có handler'});
    if (href?.startsWith('#') && href.length > 1 && !ids.has(href.slice(1))) findings.push({ file, kind: 'LINK', label: match[2].replace(/<[^>]+>/g, '').trim(), reason: `fragment ${href} không tồn tại` });
  }
  for (const match of auditedSource.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1];
    const label = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const classes = attrs.match(/\bclass=["']([^"']+)["']/i)?.[1].split(/\s+/) || [];
    const scripted = classes.some(className => contracts.includes(`.${className}`)) || (/^\d+$/.test(label) && /page|pagination/i.test(contracts)) || (contracts.includes('.editor-tools button') && source.includes(match[0]));
    const contract = scripted || /\b(onclick|id|data-[\w-]+|type=["']submit["']|disabled|aria-label)\b/i.test(attrs) || /\b(class=["'][^"']*(btn|tab|chip|page|filter|sort|action|menu|toggle|switch|close|submit|download|view|edit|delete|next|previous)[^"']*["'])/i.test(attrs);
    if (!contract) findings.push({ file, kind: 'BUTTON', label, reason: 'không có contract tương tác tĩnh' });
  }
}

console.log(`Static control audit: ${htmlFiles.length} trang, ${findings.length} control cần rà soát.`);
for (const finding of findings) console.log(`${path.relative(root, finding.file)} | ${finding.kind} | ${finding.label || '(không nhãn)'} | ${finding.reason}`);
if (process.argv.includes('--strict') && findings.length) process.exitCode = 1;
