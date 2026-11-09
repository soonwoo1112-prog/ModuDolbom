// Runs Claude Design canvas boards (template + DCLogic class) with Preact,
// so the phone preview shows exactly what the canvas shows.
import { h, Component } from 'preact';
import { boards, images } from './boards.gen.js';

class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(patch) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    if (this.__update) this.__update();
  }
}

const parsed = {};
function templateOf(name) {
  if (!parsed[name]) {
    const doc = new DOMParser().parseFromString('<body>' + boards[name].template + '</body>', 'text/html');
    parsed[name] = doc.body;
  }
  return parsed[name];
}

function lookup(scope, path) {
  path = path.trim();
  if (path === 'true') return true;
  if (path === 'false') return false;
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
}
const WHOLE = /^\{\{([^{}]*)\}\}$/;
function interp(str, scope) {
  const m = str.match(WHOLE);
  if (m) return lookup(scope, m[1]);
  if (str.indexOf('{{') < 0) return str;
  return str.replace(/\{\{([^{}]*)\}\}/g, (_, p) => { const v = lookup(scope, p); return v == null ? '' : String(v); });
}
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function attrsOf(el, scope) {
  const tag = el.localName;
  const props = {};
  for (const a of el.attributes) {
    const n = a.name;
    if (n.startsWith('hint-') || n.startsWith('sc-')) continue;
    let v = interp(a.value, scope);
    if (n.startsWith('on')) {
      if (typeof v !== 'function') continue;
      // The canvas follows React: onChange on a text field fires on every keystroke.
      const textField = n === 'onchange' && (tag === 'textarea' || (tag === 'input' && !/checkbox|radio/.test(el.getAttribute('type') || '')));
      props[textField ? 'oninput' : n] = v;
      continue;
    }
    if (n === 'src' && typeof v === 'string' && images[v]) v = images[v];
    if ((n === 'checked' || n === 'disabled' || n === 'selected') && typeof v === 'string') v = v !== 'false';
    props[n] = v;
  }
  return props;
}

function renderNodes(parent, scope, out = []) {
  for (const node of parent.childNodes) {
    if (node.nodeType === 3) { const t = interp(node.textContent, scope); if (t !== '' && t != null) out.push(String(t)); continue; }
    if (node.nodeType !== 1) continue;
    const tag = node.localName;
    if (tag === 'helmet' || tag === 'script') continue;
    if (tag === 'sc-if') {
      if (interp(node.getAttribute('value') || '', scope)) renderNodes(node, scope, out);
      continue;
    }
    if (tag === 'sc-for') {
      const list = interp(node.getAttribute('list') || '', scope) || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => renderNodes(node, Object.assign(Object.create(scope), { [as]: item, $index: i }), out));
      continue;
    }
    if (tag === 'dc-import') {
      const props = {};
      for (const a of node.attributes) if (a.name !== 'name' && !a.name.startsWith('hint-')) props[camel(a.name)] = interp(a.value, scope);
      out.push(h(Board, { name: node.getAttribute('name'), props }));
      continue;
    }
    out.push(h(tag, attrsOf(node, scope), ...renderNodes(node, scope)));
  }
  return out;
}

export class Board extends Component {
  constructor(p) {
    super(p);
    const def = boards[p.name];
    this.def = def;
    if (def && def.make) {
      const props = {};
      for (const [k, v] of Object.entries(def.props || {})) if (k[0] !== '$' && v && 'default' in v) props[k] = v.default;
      Object.assign(props, p.props);
      const C = def.make(DCLogic);
      this.logic = new C(props);
    }
  }
  componentDidMount() { if (this.logic) this.logic.__update = () => this.forceUpdate(); }
  componentWillUnmount() {
    const l = this.logic;
    if (!l) return;
    l.__update = null;
    for (const k of ['tick', 'timer']) if (l[k]) { clearInterval(l[k]); clearTimeout(l[k]); }
  }
  render() {
    if (!this.def) return h('p', { style: 'padding: 24px;' }, `${this.props.name} 화면이 없어요`);
    const vals = this.logic ? this.logic.renderVals() : {};
    const kids = renderNodes(templateOf(this.props.name), vals).filter((k) => typeof k !== 'string' || k.trim());
    return kids.length === 1 ? kids[0] : h('div', { style: 'display: contents;' }, ...kids);
  }
}
