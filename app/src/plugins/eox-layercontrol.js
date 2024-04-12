/* eslint-disable */
var Ro = Object.defineProperty;
var Do = (e, t, n) => t in e ? Ro(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var H = (e, t, n) => (Do(e, typeof t != "symbol" ? t + "" : t, n), n), mn = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
};
var R = (e, t, n) => (mn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), $ = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, Jt = (e, t, n, i) => (mn(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n);
var U = (e, t, n) => (mn(e, t, "access private method"), n);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = globalThis, Fn = Te.ShadowRoot && (Te.ShadyCSS === void 0 || Te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, _i = Symbol(), ti = /* @__PURE__ */ new WeakMap();
let No = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== _i)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Fn && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = ti.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ti.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Mo = (e) => new No(typeof e == "string" ? e : e + "", void 0, _i), Io = (e, t) => {
  if (Fn)
    e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else
    for (const n of t) {
      const i = document.createElement("style"), o = Te.litNonce;
      o !== void 0 && i.setAttribute("nonce", o), i.textContent = n.cssText, e.appendChild(i);
    }
}, ei = Fn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules)
    n += i.cssText;
  return Mo(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ho, defineProperty: Bo, getOwnPropertyDescriptor: Vo, getOwnPropertyNames: Lo, getOwnPropertySymbols: Uo, getPrototypeOf: ko } = Object, $t = globalThis, ni = $t.trustedTypes, Fo = ni ? ni.emptyScript : "", yn = $t.reactiveElementPolyfillSupport, ie = (e, t) => e, Mn = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Fo : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let n = e;
  switch (t) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, Ai = (e, t) => !Ho(e, t), ii = { attribute: !0, type: String, converter: Mn, reflect: !1, hasChanged: Ai };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $t.litPropertyMetadata ?? ($t.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class Bt extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = ii) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(t, i, n);
      o !== void 0 && Bo(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: o, set: r } = Vo(this.prototype, t) ?? { get() {
      return this[n];
    }, set(s) {
      this[n] = s;
    } };
    return { get() {
      return o == null ? void 0 : o.call(this);
    }, set(s) {
      const a = o == null ? void 0 : o.call(this);
      r.call(this, s), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ii;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ie("elementProperties")))
      return;
    const t = ko(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ie("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ie("properties"))) {
      const n = this.properties, i = [...Lo(n), ...Uo(n)];
      for (const o of i)
        this.createProperty(o, n[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0)
        for (const [i, o] of n)
          this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const o = this._$Eu(n, i);
      o !== void 0 && this._$Eh.set(o, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i)
        n.unshift(ei(o));
    } else
      t !== void 0 && n.push(ei(t));
    return n;
  }
  static _$Eu(t, n) {
    const i = n.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((n) => n(this));
  }
  addController(t) {
    var n;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((n = t.hostConnected) == null || n.call(t));
  }
  removeController(t) {
    var n;
    (n = this._$EO) == null || n.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const i of n.keys())
      this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Io(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostConnected) == null ? void 0 : i.call(n);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostDisconnected) == null ? void 0 : i.call(n);
    });
  }
  attributeChangedCallback(t, n, i) {
    this._$AK(t, i);
  }
  _$EC(t, n) {
    var r;
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const s = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : Mn).toAttribute(n, i.type);
      this._$Em = t, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var r;
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const s = i.getPropertyOptions(o), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((r = s.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? s.converter : Mn;
      this._$Em = o, this[o] = a.fromAttribute(n, s.type), this._$Em = null;
    }
  }
  requestUpdate(t, n, i) {
    if (t !== void 0) {
      if (i ?? (i = this.constructor.getPropertyOptions(t)), !(i.hasChanged ?? Ai)(this[t], n))
        return;
      this.P(t, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, n, i) {
    this._$AL.has(t) || this._$AL.set(t, n), i.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, s] of this._$Ep)
          this[r] = s;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0)
        for (const [r, s] of o)
          s.wrapped !== !0 || this._$AL.has(r) || this[r] === void 0 || this.P(r, this[r], s);
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((o) => {
        var r;
        return (r = o.hostUpdate) == null ? void 0 : r.call(o);
      }), this.update(n)) : this._$EU();
    } catch (o) {
      throw t = !1, this._$EU(), o;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
      var o;
      return (o = i.hostUpdated) == null ? void 0 : o.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((n) => this._$EC(n, this[n]))), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
Bt.elementStyles = [], Bt.shadowRootOptions = { mode: "open" }, Bt[ie("elementProperties")] = /* @__PURE__ */ new Map(), Bt[ie("finalized")] = /* @__PURE__ */ new Map(), yn == null || yn({ ReactiveElement: Bt }), ($t.reactiveElementVersions ?? ($t.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, Be = oe.trustedTypes, oi = Be ? Be.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, jn = "$lit$", ht = `lit$${(Math.random() + "").slice(9)}$`, zn = "?" + ht, jo = `<${zn}>`, Nt = document, de = () => Nt.createComment(""), ce = (e) => e === null || typeof e != "object" && typeof e != "function", Ci = Array.isArray, Ti = (e) => Ci(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", bn = `[ 	
\f\r]`, Kt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ri = /-->/g, si = />/g, At = RegExp(`>|${bn}(?:([^\\s"'>=/]+)(${bn}*=${bn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ai = /'/g, li = /"/g, Pi = /^(?:script|style|textarea|title)$/i, zo = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), x = zo(1), it = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), ui = /* @__PURE__ */ new WeakMap(), Rt = Nt.createTreeWalker(Nt, 129);
function Oi(e, t) {
  if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return oi !== void 0 ? oi.createHTML(t) : t;
}
const Ri = (e, t) => {
  const n = e.length - 1, i = [];
  let o, r = t === 2 ? "<svg>" : "", s = Kt;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let u, c, d = -1, p = 0;
    for (; p < l.length && (s.lastIndex = p, c = s.exec(l), c !== null); )
      p = s.lastIndex, s === Kt ? c[1] === "!--" ? s = ri : c[1] !== void 0 ? s = si : c[2] !== void 0 ? (Pi.test(c[2]) && (o = RegExp("</" + c[2], "g")), s = At) : c[3] !== void 0 && (s = At) : s === At ? c[0] === ">" ? (s = o ?? Kt, d = -1) : c[1] === void 0 ? d = -2 : (d = s.lastIndex - c[2].length, u = c[1], s = c[3] === void 0 ? At : c[3] === '"' ? li : ai) : s === li || s === ai ? s = At : s === ri || s === si ? s = Kt : (s = At, o = void 0);
    const f = s === At && e[a + 1].startsWith("/>") ? " " : "";
    r += s === Kt ? l + jo : d >= 0 ? (i.push(u), l.slice(0, d) + jn + l.slice(d) + ht + f) : l + ht + (d === -2 ? a : f);
  }
  return [Oi(e, r + (e[n] || "<?>") + (t === 2 ? "</svg>" : "")), i];
};
class he {
  constructor({ strings: t, _$litType$: n }, i) {
    let o;
    this.parts = [];
    let r = 0, s = 0;
    const a = t.length - 1, l = this.parts, [u, c] = Ri(t, n);
    if (this.el = he.createElement(u, i), Rt.currentNode = this.el.content, n === 2) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = Rt.nextNode()) !== null && l.length < a; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes())
          for (const d of o.getAttributeNames())
            if (d.endsWith(jn)) {
              const p = c[s++], f = o.getAttribute(d).split(ht), g = /([.?@])?(.*)/.exec(p);
              l.push({ type: 1, index: r, name: g[2], strings: f, ctor: g[1] === "." ? Ni : g[1] === "?" ? Mi : g[1] === "@" ? Ii : ve }), o.removeAttribute(d);
            } else
              d.startsWith(ht) && (l.push({ type: 6, index: r }), o.removeAttribute(d));
        if (Pi.test(o.tagName)) {
          const d = o.textContent.split(ht), p = d.length - 1;
          if (p > 0) {
            o.textContent = Be ? Be.emptyScript : "";
            for (let f = 0; f < p; f++)
              o.append(d[f], de()), Rt.nextNode(), l.push({ type: 2, index: ++r });
            o.append(d[p], de());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === zn)
          l.push({ type: 2, index: r });
        else {
          let d = -1;
          for (; (d = o.data.indexOf(ht, d + 1)) !== -1; )
            l.push({ type: 7, index: r }), d += ht.length - 1;
        }
      r++;
    }
  }
  static createElement(t, n) {
    const i = Nt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Mt(e, t, n = e, i) {
  var s, a;
  if (t === it)
    return t;
  let o = i !== void 0 ? (s = n._$Co) == null ? void 0 : s[i] : n._$Cl;
  const r = ce(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== r && ((a = o == null ? void 0 : o._$AO) == null || a.call(o, !1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = o : n._$Cl = o), o !== void 0 && (t = Mt(e, o._$AS(e, t.values), o, i)), t;
}
class Di {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: i } = this._$AD, o = ((t == null ? void 0 : t.creationScope) ?? Nt).importNode(n, !0);
    Rt.currentNode = o;
    let r = Rt.nextNode(), s = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let u;
        l.type === 2 ? u = new Xt(r, r.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (u = new Hi(r, this, t)), this._$AV.push(u), l = i[++a];
      }
      s !== (l == null ? void 0 : l.index) && (r = Rt.nextNode(), s++);
    }
    return Rt.currentNode = Nt, o;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
class Xt {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, o) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = Mt(this, t, n), ce(t) ? t === T || t == null || t === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : t !== this._$AH && t !== it && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ti(t) ? this.k(t) : this._(t);
  }
  S(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  _(t) {
    this._$AH !== T && ce(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Nt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: n, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = he.createElement(Oi(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === o)
      this._$AH.p(n);
    else {
      const s = new Di(o, this), a = s.u(this.options);
      s.p(n), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let n = ui.get(t.strings);
    return n === void 0 && ui.set(t.strings, n = new he(t)), n;
  }
  k(t) {
    Ci(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, o = 0;
    for (const r of t)
      o === n.length ? n.push(i = new Xt(this.S(de()), this.S(de()), this, this.options)) : i = n[o], i._$AI(r), o++;
    o < n.length && (this._$AR(i && i._$AB.nextSibling, o), n.length = o);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t && t !== this._$AB; ) {
      const o = t.nextSibling;
      t.remove(), t = o;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
}
class ve {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, o, r) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t, this.name = n, this._$AM = o, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = T;
  }
  _$AI(t, n = this, i, o) {
    const r = this.strings;
    let s = !1;
    if (r === void 0)
      t = Mt(this, t, n, 0), s = !ce(t) || t !== this._$AH && t !== it, s && (this._$AH = t);
    else {
      const a = t;
      let l, u;
      for (t = r[0], l = 0; l < r.length - 1; l++)
        u = Mt(this, a[i + l], n, l), u === it && (u = this._$AH[l]), s || (s = !ce(u) || u !== this._$AH[l]), u === T ? t = T : t !== T && (t += (u ?? "") + r[l + 1]), this._$AH[l] = u;
    }
    s && !o && this.j(t);
  }
  j(t) {
    t === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ni extends ve {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === T ? void 0 : t;
  }
}
class Mi extends ve {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== T);
  }
}
class Ii extends ve {
  constructor(t, n, i, o, r) {
    super(t, n, i, o, r), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Mt(this, t, n, 0) ?? T) === it)
      return;
    const i = this._$AH, o = t === T && i !== T || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== T && (i === T || o);
    o && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Hi {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Mt(this, t);
  }
}
const Zo = { P: jn, A: ht, C: zn, M: 1, L: Ri, R: Di, D: Ti, V: Mt, I: Xt, H: ve, N: Mi, U: Ii, B: Ni, F: Hi }, vn = oe.litHtmlPolyfillSupport;
vn == null || vn(he, Xt), (oe.litHtmlVersions ?? (oe.litHtmlVersions = [])).push("3.1.2");
const Xo = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const r = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = o = new Xt(t.insertBefore(de(), r), r, void 0, n ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let et = class extends Bt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var n;
    const t = super.createRenderRoot();
    return (n = this.renderOptions).renderBefore ?? (n.renderBefore = t.firstChild), t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xo(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return it;
  }
};
var $i;
et._$litElement$ = !0, et.finalized = !0, ($i = globalThis.litElementHydrateSupport) == null || $i.call(globalThis, { LitElement: et });
const wn = globalThis.litElementPolyfillSupport;
wn == null || wn({ LitElement: et });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ot(e, t, n) {
  return e ? t(e) : n == null ? void 0 : n(e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Zn = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Xn {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, n, i) {
    this._$Ct = t, this._$AM = n, this._$Ci = i;
  }
  _$AS(t, n) {
    return this.update(t, n);
  }
  update(t, n) {
    return this.render(...n);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Yo } = Zo, qo = (e) => e.strings === void 0, di = () => document.createComment(""), Qt = (e, t, n) => {
  var r;
  const i = e._$AA.parentNode, o = t === void 0 ? e._$AB : t._$AA;
  if (n === void 0) {
    const s = i.insertBefore(di(), o), a = i.insertBefore(di(), o);
    n = new Yo(s, a, e, e.options);
  } else {
    const s = n._$AB.nextSibling, a = n._$AM, l = a !== e;
    if (l) {
      let u;
      (r = n._$AQ) == null || r.call(n, e), n._$AM = e, n._$AP !== void 0 && (u = e._$AU) !== a._$AU && n._$AP(u);
    }
    if (s !== o || l) {
      let u = n._$AA;
      for (; u !== s; ) {
        const c = u.nextSibling;
        i.insertBefore(u, o), u = c;
      }
    }
  }
  return n;
}, Ct = (e, t, n = e) => (e._$AI(t, n), e), Wo = {}, Bi = (e, t = Wo) => e._$AH = t, Go = (e) => e._$AH, En = (e) => {
  var i;
  (i = e._$AP) == null || i.call(e, !1, !0);
  let t = e._$AA;
  const n = e._$AB.nextSibling;
  for (; t !== n; ) {
    const o = t.nextSibling;
    t.remove(), t = o;
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ci = (e, t, n) => {
  const i = /* @__PURE__ */ new Map();
  for (let o = t; o <= n; o++)
    i.set(e[o], o);
  return i;
}, Jo = Zn(class extends Xn {
  constructor(e) {
    if (super(e), e.type !== wt.CHILD)
      throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, n) {
    let i;
    n === void 0 ? n = t : t !== void 0 && (i = t);
    const o = [], r = [];
    let s = 0;
    for (const a of e)
      o[s] = i ? i(a, s) : s, r[s] = n(a, s), s++;
    return { values: r, keys: o };
  }
  render(e, t, n) {
    return this.dt(e, t, n).values;
  }
  update(e, [t, n, i]) {
    const o = Go(e), { values: r, keys: s } = this.dt(t, n, i);
    if (!Array.isArray(o))
      return this.ut = s, r;
    const a = this.ut ?? (this.ut = []), l = [];
    let u, c, d = 0, p = o.length - 1, f = 0, g = r.length - 1;
    for (; d <= p && f <= g; )
      if (o[d] === null)
        d++;
      else if (o[p] === null)
        p--;
      else if (a[d] === s[f])
        l[f] = Ct(o[d], r[f]), d++, f++;
      else if (a[p] === s[g])
        l[g] = Ct(o[p], r[g]), p--, g--;
      else if (a[d] === s[g])
        l[g] = Ct(o[d], r[g]), Qt(e, l[g + 1], o[d]), d++, g--;
      else if (a[p] === s[f])
        l[f] = Ct(o[p], r[f]), Qt(e, o[d], o[p]), p--, f++;
      else if (u === void 0 && (u = ci(s, f, g), c = ci(a, d, p)), u.has(a[d]))
        if (u.has(a[p])) {
          const y = c.get(s[f]), P = y !== void 0 ? o[y] : null;
          if (P === null) {
            const L = Qt(e, o[d]);
            Ct(L, r[f]), l[f] = L;
          } else
            l[f] = Ct(P, r[f]), Qt(e, o[d], P), o[y] = null;
          f++;
        } else
          En(o[p]), p--;
      else
        En(o[d]), d++;
    for (; f <= g; ) {
      const y = Qt(e, l[g + 1]);
      Ct(y, r[f]), l[f++] = y;
    }
    for (; d <= p; ) {
      const y = o[d++];
      y !== null && En(y);
    }
    return this.ut = s, Bi(e, l), it;
  }
});
/**
 * wms-capabilities @0.6.0
 * @description WMS service Capabilities > JSON, based on openlayers 
 * @license BSD-2-Clause
 * @preserve
 */
var E = (e) => e !== void 0, Vi = (e, t, n) => t in e ? e[t] : e[t] = n;
const pe = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
};
class Ko {
  /**
   * XML DOM parser
   * @constructor
   * @param {DOMParser} DOMParser
   */
  constructor(t) {
    this._parser = new t();
  }
  /**
   * @param  {String} xmlstring
   * @return {Document}
   */
  toDocument(t) {
    return this._parser.parseFromString(t, "application/xml");
  }
  /**
   * Recursively grab all text content of child nodes into a single string.
   * @param {Node} node Node.
   * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
   * breaks.
   * @return {string} All text content.
   * @api
   */
  getAllTextContent(t, n) {
    return fn(t, n).join("");
  }
}
function fn(e, t) {
  return Li(e, t, []).join("");
}
function Li(e, t, n) {
  if (e.nodeType === pe.CDATA_SECTION || e.nodeType === pe.TEXT)
    t ? n.push(String(e.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : n.push(e.nodeValue);
  else {
    var i;
    for (i = e.firstChild; i; i = i.nextSibling)
      Li(i, t, n);
  }
  return n;
}
function Qo(e, t, n, i) {
  for (var o = tr(t); o; o = er(o)) {
    var r = o.namespaceURI || null, s = e[r];
    if (E(s)) {
      var a = s[o.localName];
      E(a) && a.call(i, o, n);
    }
  }
}
function tr(e) {
  let t = e.firstElementChild || e.firstChild;
  for (; t && t.nodeType !== pe.ELEMENT; )
    t = t.nextSibling;
  return t;
}
function er(e) {
  let t = e.nextElementSibling || e.nextSibling;
  for (; t && t.nodeType !== pe.ELEMENT; )
    t = t.nextSibling;
  return t;
}
function F(e, t, n) {
  return (
    /** @type {Object.<string, Object.<string, XMLParser.Parser>>} */
    nr(e, t, n)
  );
}
function nr(e, t, n) {
  var i = E(n) ? n : {}, o, r;
  for (o = 0, r = e.length; o < r; ++o)
    i[e[o]] = t;
  return i;
}
function Ui(e, t) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(n, i) {
      var o = e.call(
        E(t) ? t : this,
        n,
        i
      );
      if (E(o)) {
        var r = i[i.length - 1];
        r.push(o);
      }
    }
  );
}
function V(e, t, n, i, o) {
  return i.push(e), Qo(t, n, i, o), i.pop();
}
function m(e, t, n) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(i, o) {
      let r = e.call(
        E(n) ? n : this,
        i,
        o
      );
      if (E(r)) {
        var s = (
          /** @type {Object} */
          o[o.length - 1]
        ), a = E(t) ? t : i.localName;
        s[a] = r;
      }
    }
  );
}
function G(e, t, n) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(i, o) {
      var r = e.call(
        E(n) ? n : this,
        i,
        o
      );
      if (E(r)) {
        var s = (
          /** @type {Object} */
          o[o.length - 1]
        ), a = E(t) ? t : i.localName, l = Vi(s, a, []);
        l.push(r);
      }
    }
  );
}
const ir = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
function or(e) {
  return e.replace(ir, "");
}
function Dt(e) {
  const t = /^\s*(true|1)|(false|0)\s*$/.exec(e);
  if (t)
    return E(t[1]) || !1;
}
function Lt(e) {
  return pt(fn(e, !1));
}
function pt(e) {
  const t = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(e);
  if (t)
    return parseFloat(t[1]);
}
function xn(e) {
  return Ve(fn(e, !1));
}
function Ve(e) {
  const t = /^\s*(\d+)\s*$/.exec(e);
  if (t)
    return parseInt(t[1], 10);
}
function _(e) {
  return or(fn(e, !1));
}
const rr = "http://www.w3.org/1999/xlink";
function Yn(e) {
  return e.getAttributeNS(rr, "href");
}
function sr(e, t) {
  return V({}, Nr, e, t);
}
function ki(e) {
  return [
    pt(e.getAttribute("minx")),
    pt(e.getAttribute("miny")),
    pt(e.getAttribute("maxx")),
    pt(e.getAttribute("maxy"))
  ];
}
function ar(e, t) {
  const n = ki(e), i = [
    pt(e.getAttribute("resx")),
    pt(e.getAttribute("resy"))
  ];
  return {
    crs: e.getAttribute("CRS") || e.getAttribute("SRS"),
    extent: n,
    res: i
  };
}
function lr(e, t) {
  const n = ki(e);
  if (!(!E(n[0]) || !E(n[1]) || !E(n[2]) || !E(n[3])))
    return n;
}
function ur(e, t) {
  const n = parseFloat(e.getAttribute("min")), i = parseFloat(e.getAttribute("max"));
  return { min: n, max: i };
}
function dr(e, t) {
  const n = V(
    {},
    Mr,
    e,
    t
  );
  if (!E(n))
    return;
  const i = (
    /** @type {number|undefined} */
    n.westBoundLongitude
  ), o = (
    /** @type {number|undefined} */
    n.southBoundLatitude
  ), r = (
    /** @type {number|undefined} */
    n.eastBoundLongitude
  ), s = (
    /** @type {number|undefined} */
    n.northBoundLatitude
  );
  if (!(!E(i) || !E(o) || !E(r) || !E(s)))
    return [
      i,
      o,
      r,
      s
    ];
}
function cr(e, t) {
  return V({}, Cr, e, t);
}
function hr(e, t) {
  return V({}, Tr, e, t);
}
function pr(e, t) {
  return V(
    {},
    Pr,
    e,
    t
  );
}
function fr(e, t) {
  return V(
    {},
    Or,
    e,
    t
  );
}
function gr(e, t) {
  return V(
    {},
    Rr,
    e,
    t
  );
}
function mr(e, t) {
  return V(
    [],
    Dr,
    e,
    t
  );
}
function yr(e, t) {
  const n = Dt(e.getAttribute("queryable"));
  return V(
    {
      queryable: E(n) ? n : !1
    },
    zi,
    e,
    t
  );
}
function br(e, t) {
  var n = (
    /**  @type {Object.<string,*>} */
    t[t.length - 1]
  );
  const i = (
    /**  @type {Object.<string,*>} */
    V(
      {},
      zi,
      e,
      t
    )
  );
  if (!E(i))
    return;
  let o = Dt(e.getAttribute("queryable"));
  E(o) || (o = n.queryable), i.queryable = E(o) ? o : !1;
  let r = Ve(e.getAttribute("cascaded"));
  E(r) || (r = n.cascaded), i.cascaded = r;
  let s = Dt(e.getAttribute("opaque"));
  E(s) || (s = n.opaque), i.opaque = E(s) ? s : !1;
  let a = Dt(e.getAttribute("noSubsets"));
  E(a) || (a = n.noSubsets), i.noSubsets = E(a) ? a : !1;
  let l = pt(e.getAttribute("fixedWidth"));
  E(l) || (l = n.fixedWidth), i.fixedWidth = l;
  let u = pt(e.getAttribute("fixedHeight"));
  E(u) || (u = n.fixedHeight), i.fixedHeight = u;
  const c = ["Style", "CRS", "AuthorityURL"];
  for (let p = 0, f = c.length; p < f; p++) {
    const g = c[p], y = n[g];
    if (E(y)) {
      let P = Vi(i, g, []);
      P = P.concat(y), i[g] = P;
    }
  }
  const d = [
    "EX_GeographicBoundingBox",
    "BoundingBox",
    "Dimension",
    "Attribution",
    "MinScaleDenominator",
    "MaxScaleDenominator"
  ];
  for (let p = 0, f = d.length; p < f; p++) {
    const g = d[p], y = i[g];
    if (!E(y)) {
      const P = n[g];
      i[g] = P;
    }
  }
  return i;
}
function vr(e, t) {
  return {
    name: e.getAttribute("name"),
    units: e.getAttribute("units"),
    unitSymbol: e.getAttribute("unitSymbol"),
    default: e.getAttribute("default"),
    multipleValues: Dt(e.getAttribute("multipleValues")),
    nearestValue: Dt(e.getAttribute("nearestValue")),
    current: Dt(e.getAttribute("current")),
    values: _(e)
  };
}
function gt(e, t) {
  return V(
    {},
    Ur,
    e,
    t
  );
}
function wr(e, t) {
  return V({}, Ir, e, t);
}
function Er(e, t) {
  return V({}, Br, e, t);
}
function xr(e, t) {
  return V({}, Vr, e, t);
}
function Sn(e, t) {
  return V({}, Hr, e, t);
}
function Fi(e, t) {
  var n = gt(e, t);
  if (E(n)) {
    const i = [
      Ve(e.getAttribute("width")),
      Ve(e.getAttribute("height"))
    ];
    return n.size = i, n;
  }
}
function Sr(e, t) {
  var n = gt(e, t);
  if (E(n))
    return n.name = e.getAttribute("name"), n;
}
function $r(e, t) {
  var n = gt(e, t);
  if (E(n))
    return n.type = e.getAttribute("type"), n;
}
function _r(e, t) {
  return V({}, Lr, e, t);
}
function ji(e, t) {
  return V(
    [],
    kr,
    e,
    t
  );
}
const j = [
  null,
  "http://www.opengis.net/wms"
], Ar = F(
  j,
  {
    Service: m(hr),
    Capability: m(cr)
  }
), Cr = F(
  j,
  {
    Request: m(wr),
    Exception: m(mr),
    Layer: m(yr)
  }
), Tr = F(
  j,
  {
    Name: m(_),
    Title: m(_),
    Abstract: m(_),
    KeywordList: m(ji),
    OnlineResource: m(Yn),
    ContactInformation: m(pr),
    Fees: m(_),
    AccessConstraints: m(_),
    LayerLimit: m(xn),
    MaxWidth: m(xn),
    MaxHeight: m(xn)
  }
), Pr = F(
  j,
  {
    ContactPersonPrimary: m(fr),
    ContactPosition: m(_),
    ContactAddress: m(gr),
    ContactVoiceTelephone: m(_),
    ContactFacsimileTelephone: m(_),
    ContactElectronicMailAddress: m(_)
  }
), Or = F(
  j,
  {
    ContactPerson: m(_),
    ContactOrganization: m(_)
  }
), Rr = F(
  j,
  {
    AddressType: m(_),
    Address: m(_),
    City: m(_),
    StateOrProvince: m(_),
    PostCode: m(_),
    Country: m(_)
  }
), Dr = F(
  j,
  {
    Format: Ui(_)
  }
), zi = F(
  j,
  {
    Name: m(_),
    Title: m(_),
    Abstract: m(_),
    KeywordList: m(ji),
    CRS: G(_),
    SRS: G(_),
    EX_GeographicBoundingBox: m(dr),
    LatLonBoundingBox: m(lr),
    BoundingBox: G(ar),
    Dimension: G(vr),
    Attribution: m(sr),
    AuthorityURL: G(Sr),
    Identifier: G(_),
    MetadataURL: G($r),
    DataURL: G(gt),
    FeatureListURL: G(gt),
    Style: G(_r),
    MinScaleDenominator: m(Lt),
    MaxScaleDenominator: m(Lt),
    ScaleHint: m(ur),
    Layer: G(br)
  }
), Nr = F(
  j,
  {
    Title: m(_),
    OnlineResource: m(Yn),
    LogoURL: m(Fi)
  }
), Mr = F(j, {
  westBoundLongitude: m(Lt),
  eastBoundLongitude: m(Lt),
  southBoundLatitude: m(Lt),
  northBoundLatitude: m(Lt)
}), Ir = F(
  j,
  {
    GetCapabilities: m(
      Sn
    ),
    GetMap: m(
      Sn
    ),
    GetFeatureInfo: m(
      Sn
    )
  }
), Hr = F(
  j,
  {
    Format: G(_),
    DCPType: G(
      Er
    )
  }
), Br = F(
  j,
  {
    HTTP: m(
      xr
    )
  }
), Vr = F(
  j,
  {
    Get: m(
      gt
    ),
    Post: m(
      gt
    )
  }
), Lr = F(
  j,
  {
    Name: m(_),
    Title: m(_),
    Abstract: m(_),
    LegendURL: G(Fi),
    StyleSheetURL: m(gt),
    StyleURL: m(gt)
  }
), Ur = F(
  j,
  {
    Format: m(_),
    OnlineResource: m(Yn)
  }
), kr = F(
  j,
  {
    Keyword: Ui(_)
  }
);
class Fr {
  /**
   * WMS Capabilities parser
   *
   * @param {String=} xmlString
   * @constructor
   */
  constructor(t, n) {
    !n && typeof window < "u" && (n = window.DOMParser), this.version = void 0, this._parser = new Ko(n), this._data = t;
  }
  /**
   * @param {String} xmlString
   * @return {WMS}
   */
  data(t) {
    return this._data = t, this;
  }
  /**
   * @param  {String=} xmlString
   * @return {Object|null}
   */
  toJSON(t) {
    return t = t || this._data, this.parse(t);
  }
  /**
   * @return {String} xml
   * @return {Object|null}
   */
  parse(t) {
    return this.readFromDocument(this._parser.toDocument(t));
  }
  /**
   * @param  {Document} doc
   * @return {Object|null}
   */
  readFromDocument(t) {
    for (let n = t.firstChild; n; n = n.nextSibling)
      if (n.nodeType == pe.ELEMENT)
        return this.readFromNode(n);
    return null;
  }
  /**
   * @param  {DOMNode} node
   * @return {Object}
   */
  readFromNode(t) {
    return this.version = t.getAttribute("version"), V({
      version: this.version
    }, Ar, t, []) || null;
  }
}
async function jr(e) {
  let t = new URL(e), n = t.searchParams;
  n.set("SERVICE", "WMS"), n.set("REQUEST", "GetCapabilities");
  let i = t.toString();
  const o = await fetch(i);
  if (o.ok) {
    const r = await o.text();
    return new Fr(r).toJSON();
  } else
    throw new Error(`Error: ${o.status}`);
}
function qn(e) {
  const t = /\b(?:wms|ows)\b/i, n = /{(?:z|x|y-?)}\/{(?:z|x|y-?)}\/{(?:z|x|y-?)}/i;
  return t.test(e) ? "TileWMS" : n.test(e) ? "XYZ" : !1;
}
function zr(e) {
  const n = /^(?:(?:https?|ftp):\/\/|\/\/)?(?:localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|(?:\w+[\w-]*\.)+\w+)(?::\d+)?(?:\/\S*)?$/.test(e), i = qn(e);
  return !!(e && n && i);
}
function Zi(e) {
  return e.replace(
    /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
    '"$2": '
  ).replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/\s*(\{|}|\[|\]|,)\s*/g, "$1").replaceAll('": //', "://");
}
function Zr(e) {
  try {
    return JSON.parse(Zi(e)), !!e;
  } catch {
    return !1;
  }
}
function Xr(e, t) {
  const n = new URL(e).searchParams;
  Object.entries(t).forEach(([s, a]) => {
    typeof a == "object" && !Array.isArray(a) && a !== null ? Object.keys(a).forEach((l) => {
      n.set(l, a[l]);
    }) : n.set(s, a);
  });
  const i = e.split("?")[0], o = n.toString();
  return `${i}?${o}`;
}
/**!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function hi(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function dt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? hi(Object(n), !0).forEach(function(i) {
      Yr(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : hi(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Pe(e) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Pe = function(t) {
    return typeof t;
  } : Pe = function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pe(e);
}
function Yr(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function mt() {
  return mt = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, mt.apply(this, arguments);
}
function qr(e, t) {
  if (e == null)
    return {};
  var n = {}, i = Object.keys(e), o, r;
  for (r = 0; r < i.length; r++)
    o = i[r], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Wr(e, t) {
  if (e == null)
    return {};
  var n = qr(e, t), i, o;
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (o = 0; o < r.length; o++)
      i = r[o], !(t.indexOf(i) >= 0) && Object.prototype.propertyIsEnumerable.call(e, i) && (n[i] = e[i]);
  }
  return n;
}
var Gr = "1.15.2";
function ft(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var yt = ft(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), we = ft(/Edge/i), pi = ft(/firefox/i), re = ft(/safari/i) && !ft(/chrome/i) && !ft(/android/i), Xi = ft(/iP(ad|od|hone)/i), Yi = ft(/chrome/i) && ft(/android/i), qi = {
  capture: !1,
  passive: !1
};
function A(e, t, n) {
  e.addEventListener(t, n, !yt && qi);
}
function S(e, t, n) {
  e.removeEventListener(t, n, !yt && qi);
}
function Le(e, t) {
  if (t) {
    if (t[0] === ">" && (t = t.substring(1)), e)
      try {
        if (e.matches)
          return e.matches(t);
        if (e.msMatchesSelector)
          return e.msMatchesSelector(t);
        if (e.webkitMatchesSelector)
          return e.webkitMatchesSelector(t);
      } catch {
        return !1;
      }
    return !1;
  }
}
function Jr(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function lt(e, t, n, i) {
  if (e) {
    n = n || document;
    do {
      if (t != null && (t[0] === ">" ? e.parentNode === n && Le(e, t) : Le(e, t)) || i && e === n)
        return e;
      if (e === n)
        break;
    } while (e = Jr(e));
  }
  return null;
}
var fi = /\s+/g;
function K(e, t, n) {
  if (e && t)
    if (e.classList)
      e.classList[n ? "add" : "remove"](t);
    else {
      var i = (" " + e.className + " ").replace(fi, " ").replace(" " + t + " ", " ");
      e.className = (i + (n ? " " + t : "")).replace(fi, " ");
    }
}
function b(e, t, n) {
  var i = e && e.style;
  if (i) {
    if (n === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? n = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), t === void 0 ? n : n[t];
    !(t in i) && t.indexOf("webkit") === -1 && (t = "-webkit-" + t), i[t] = n + (typeof n == "string" ? "" : "px");
  }
}
function kt(e, t) {
  var n = "";
  if (typeof e == "string")
    n = e;
  else
    do {
      var i = b(e, "transform");
      i && i !== "none" && (n = i + " " + n);
    } while (!t && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(n);
}
function Wi(e, t, n) {
  if (e) {
    var i = e.getElementsByTagName(t), o = 0, r = i.length;
    if (n)
      for (; o < r; o++)
        n(i[o], o);
    return i;
  }
  return [];
}
function ut() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function I(e, t, n, i, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, s, a, l, u, c, d;
    if (e !== window && e.parentNode && e !== ut() ? (r = e.getBoundingClientRect(), s = r.top, a = r.left, l = r.bottom, u = r.right, c = r.height, d = r.width) : (s = 0, a = 0, l = window.innerHeight, u = window.innerWidth, c = window.innerHeight, d = window.innerWidth), (t || n) && e !== window && (o = o || e.parentNode, !yt))
      do
        if (o && o.getBoundingClientRect && (b(o, "transform") !== "none" || n && b(o, "position") !== "static")) {
          var p = o.getBoundingClientRect();
          s -= p.top + parseInt(b(o, "border-top-width")), a -= p.left + parseInt(b(o, "border-left-width")), l = s + r.height, u = a + r.width;
          break;
        }
      while (o = o.parentNode);
    if (i && e !== window) {
      var f = kt(o || e), g = f && f.a, y = f && f.d;
      f && (s /= y, a /= g, d /= g, c /= y, l = s + c, u = a + d);
    }
    return {
      top: s,
      left: a,
      bottom: l,
      right: u,
      width: d,
      height: c
    };
  }
}
function gi(e, t, n) {
  for (var i = St(e, !0), o = I(e)[t]; i; ) {
    var r = I(i)[n], s = void 0;
    if (n === "top" || n === "left" ? s = o >= r : s = o <= r, !s)
      return i;
    if (i === ut())
      break;
    i = St(i, !1);
  }
  return !1;
}
function Zt(e, t, n, i) {
  for (var o = 0, r = 0, s = e.children; r < s.length; ) {
    if (s[r].style.display !== "none" && s[r] !== v.ghost && (i || s[r] !== v.dragged) && lt(s[r], n.draggable, e, !1)) {
      if (o === t)
        return s[r];
      o++;
    }
    r++;
  }
  return null;
}
function Wn(e, t) {
  for (var n = e.lastElementChild; n && (n === v.ghost || b(n, "display") === "none" || t && !Le(n, t)); )
    n = n.previousElementSibling;
  return n || null;
}
function nt(e, t) {
  var n = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== v.clone && (!t || Le(e, t)) && n++;
  return n;
}
function mi(e) {
  var t = 0, n = 0, i = ut();
  if (e)
    do {
      var o = kt(e), r = o.a, s = o.d;
      t += e.scrollLeft * r, n += e.scrollTop * s;
    } while (e !== i && (e = e.parentNode));
  return [t, n];
}
function Kr(e, t) {
  for (var n in e)
    if (e.hasOwnProperty(n)) {
      for (var i in t)
        if (t.hasOwnProperty(i) && t[i] === e[n][i])
          return Number(n);
    }
  return -1;
}
function St(e, t) {
  if (!e || !e.getBoundingClientRect)
    return ut();
  var n = e, i = !1;
  do
    if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
      var o = b(n);
      if (n.clientWidth < n.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!n.getBoundingClientRect || n === document.body)
          return ut();
        if (i || t)
          return n;
        i = !0;
      }
    }
  while (n = n.parentNode);
  return ut();
}
function Qr(e, t) {
  if (e && t)
    for (var n in t)
      t.hasOwnProperty(n) && (e[n] = t[n]);
  return e;
}
function $n(e, t) {
  return Math.round(e.top) === Math.round(t.top) && Math.round(e.left) === Math.round(t.left) && Math.round(e.height) === Math.round(t.height) && Math.round(e.width) === Math.round(t.width);
}
var se;
function Gi(e, t) {
  return function() {
    if (!se) {
      var n = arguments, i = this;
      n.length === 1 ? e.call(i, n[0]) : e.apply(i, n), se = setTimeout(function() {
        se = void 0;
      }, t);
    }
  };
}
function ts() {
  clearTimeout(se), se = void 0;
}
function Ji(e, t, n) {
  e.scrollLeft += t, e.scrollTop += n;
}
function Ki(e) {
  var t = window.Polymer, n = window.jQuery || window.Zepto;
  return t && t.dom ? t.dom(e).cloneNode(!0) : n ? n(e).clone(!0)[0] : e.cloneNode(!0);
}
function Qi(e, t, n) {
  var i = {};
  return Array.from(e.children).forEach(function(o) {
    var r, s, a, l;
    if (!(!lt(o, t.draggable, e, !1) || o.animated || o === n)) {
      var u = I(o);
      i.left = Math.min((r = i.left) !== null && r !== void 0 ? r : 1 / 0, u.left), i.top = Math.min((s = i.top) !== null && s !== void 0 ? s : 1 / 0, u.top), i.right = Math.max((a = i.right) !== null && a !== void 0 ? a : -1 / 0, u.right), i.bottom = Math.max((l = i.bottom) !== null && l !== void 0 ? l : -1 / 0, u.bottom);
    }
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
var tt = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function es() {
  var e = [], t;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var i = [].slice.call(this.el.children);
        i.forEach(function(o) {
          if (!(b(o, "display") === "none" || o === v.ghost)) {
            e.push({
              target: o,
              rect: I(o)
            });
            var r = dt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var s = kt(o, !0);
              s && (r.top -= s.f, r.left -= s.e);
            }
            o.fromRect = r;
          }
        });
      }
    },
    addAnimationState: function(i) {
      e.push(i);
    },
    removeAnimationState: function(i) {
      e.splice(Kr(e, {
        target: i
      }), 1);
    },
    animateAll: function(i) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(t), typeof i == "function" && i();
        return;
      }
      var r = !1, s = 0;
      e.forEach(function(a) {
        var l = 0, u = a.target, c = u.fromRect, d = I(u), p = u.prevFromRect, f = u.prevToRect, g = a.rect, y = kt(u, !0);
        y && (d.top -= y.f, d.left -= y.e), u.toRect = d, u.thisAnimationDuration && $n(p, d) && !$n(c, d) && // Make sure animatingRect is on line between toRect & fromRect
        (g.top - d.top) / (g.left - d.left) === (c.top - d.top) / (c.left - d.left) && (l = is(g, p, f, o.options)), $n(d, c) || (u.prevFromRect = c, u.prevToRect = d, l || (l = o.options.animation), o.animate(u, g, d, l)), l && (r = !0, s = Math.max(s, l), clearTimeout(u.animationResetTimer), u.animationResetTimer = setTimeout(function() {
          u.animationTime = 0, u.prevFromRect = null, u.fromRect = null, u.prevToRect = null, u.thisAnimationDuration = null;
        }, l), u.thisAnimationDuration = l);
      }), clearTimeout(t), r ? t = setTimeout(function() {
        typeof i == "function" && i();
      }, s) : typeof i == "function" && i(), e = [];
    },
    animate: function(i, o, r, s) {
      if (s) {
        b(i, "transition", ""), b(i, "transform", "");
        var a = kt(this.el), l = a && a.a, u = a && a.d, c = (o.left - r.left) / (l || 1), d = (o.top - r.top) / (u || 1);
        i.animatingX = !!c, i.animatingY = !!d, b(i, "transform", "translate3d(" + c + "px," + d + "px,0)"), this.forRepaintDummy = ns(i), b(i, "transition", "transform " + s + "ms" + (this.options.easing ? " " + this.options.easing : "")), b(i, "transform", "translate3d(0,0,0)"), typeof i.animated == "number" && clearTimeout(i.animated), i.animated = setTimeout(function() {
          b(i, "transition", ""), b(i, "transform", ""), i.animated = !1, i.animatingX = !1, i.animatingY = !1;
        }, s);
      }
    }
  };
}
function ns(e) {
  return e.offsetWidth;
}
function is(e, t, n, i) {
  return Math.sqrt(Math.pow(t.top - e.top, 2) + Math.pow(t.left - e.left, 2)) / Math.sqrt(Math.pow(t.top - n.top, 2) + Math.pow(t.left - n.left, 2)) * i.animation;
}
var It = [], _n = {
  initializeByDefault: !0
}, Ee = {
  mount: function(t) {
    for (var n in _n)
      _n.hasOwnProperty(n) && !(n in t) && (t[n] = _n[n]);
    It.forEach(function(i) {
      if (i.pluginName === t.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(t.pluginName, " more than once");
    }), It.push(t);
  },
  pluginEvent: function(t, n, i) {
    var o = this;
    this.eventCanceled = !1, i.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = t + "Global";
    It.forEach(function(s) {
      n[s.pluginName] && (n[s.pluginName][r] && n[s.pluginName][r](dt({
        sortable: n
      }, i)), n.options[s.pluginName] && n[s.pluginName][t] && n[s.pluginName][t](dt({
        sortable: n
      }, i)));
    });
  },
  initializePlugins: function(t, n, i, o) {
    It.forEach(function(a) {
      var l = a.pluginName;
      if (!(!t.options[l] && !a.initializeByDefault)) {
        var u = new a(t, n, t.options);
        u.sortable = t, u.options = t.options, t[l] = u, mt(i, u.defaults);
      }
    });
    for (var r in t.options)
      if (t.options.hasOwnProperty(r)) {
        var s = this.modifyOption(t, r, t.options[r]);
        typeof s < "u" && (t.options[r] = s);
      }
  },
  getEventProperties: function(t, n) {
    var i = {};
    return It.forEach(function(o) {
      typeof o.eventProperties == "function" && mt(i, o.eventProperties.call(n[o.pluginName], t));
    }), i;
  },
  modifyOption: function(t, n, i) {
    var o;
    return It.forEach(function(r) {
      t[r.pluginName] && r.optionListeners && typeof r.optionListeners[n] == "function" && (o = r.optionListeners[n].call(t[r.pluginName], i));
    }), o;
  }
};
function os(e) {
  var t = e.sortable, n = e.rootEl, i = e.name, o = e.targetEl, r = e.cloneEl, s = e.toEl, a = e.fromEl, l = e.oldIndex, u = e.newIndex, c = e.oldDraggableIndex, d = e.newDraggableIndex, p = e.originalEvent, f = e.putSortable, g = e.extraEventProperties;
  if (t = t || n && n[tt], !!t) {
    var y, P = t.options, L = "on" + i.charAt(0).toUpperCase() + i.substr(1);
    window.CustomEvent && !yt && !we ? y = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0
    }) : (y = document.createEvent("Event"), y.initEvent(i, !0, !0)), y.to = s || n, y.from = a || n, y.item = o || n, y.clone = r, y.oldIndex = l, y.newIndex = u, y.oldDraggableIndex = c, y.newDraggableIndex = d, y.originalEvent = p, y.pullMode = f ? f.lastPutMode : void 0;
    var B = dt(dt({}, g), Ee.getEventProperties(i, t));
    for (var J in B)
      y[J] = B[J];
    n && n.dispatchEvent(y), P[L] && P[L].call(t, y);
  }
}
var rs = ["evt"], W = function(t, n) {
  var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = i.evt, r = Wr(i, rs);
  Ee.pluginEvent.bind(v)(t, n, dt({
    dragEl: h,
    parentEl: N,
    ghostEl: w,
    rootEl: O,
    nextEl: Ot,
    lastDownEl: Oe,
    cloneEl: D,
    cloneHidden: xt,
    dragStarted: te,
    putSortable: k,
    activeSortable: v.active,
    originalEvent: o,
    oldIndex: Ut,
    oldDraggableIndex: ae,
    newIndex: Q,
    newDraggableIndex: Et,
    hideGhostForTarget: io,
    unhideGhostForTarget: oo,
    cloneNowHidden: function() {
      xt = !0;
    },
    cloneNowShown: function() {
      xt = !1;
    },
    dispatchSortableEvent: function(a) {
      q({
        sortable: n,
        name: a,
        originalEvent: o
      });
    }
  }, r));
};
function q(e) {
  os(dt({
    putSortable: k,
    cloneEl: D,
    targetEl: h,
    rootEl: O,
    oldIndex: Ut,
    oldDraggableIndex: ae,
    newIndex: Q,
    newDraggableIndex: Et
  }, e));
}
var h, N, w, O, Ot, Oe, D, xt, Ut, Q, ae, Et, Se, k, Vt = !1, Ue = !1, ke = [], Tt, at, An, Cn, yi, bi, te, Ht, le, ue = !1, $e = !1, Re, X, Tn = [], In = !1, Fe = [], gn = typeof document < "u", _e = Xi, vi = we || yt ? "cssFloat" : "float", ss = gn && !Yi && !Xi && "draggable" in document.createElement("div"), to = function() {
  if (gn) {
    if (yt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
}(), eo = function(t, n) {
  var i = b(t), o = parseInt(i.width) - parseInt(i.paddingLeft) - parseInt(i.paddingRight) - parseInt(i.borderLeftWidth) - parseInt(i.borderRightWidth), r = Zt(t, 0, n), s = Zt(t, 1, n), a = r && b(r), l = s && b(s), u = a && parseInt(a.marginLeft) + parseInt(a.marginRight) + I(r).width, c = l && parseInt(l.marginLeft) + parseInt(l.marginRight) + I(s).width;
  if (i.display === "flex")
    return i.flexDirection === "column" || i.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (i.display === "grid")
    return i.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && a.float && a.float !== "none") {
    var d = a.float === "left" ? "left" : "right";
    return s && (l.clear === "both" || l.clear === d) ? "vertical" : "horizontal";
  }
  return r && (a.display === "block" || a.display === "flex" || a.display === "table" || a.display === "grid" || u >= o && i[vi] === "none" || s && i[vi] === "none" && u + c > o) ? "vertical" : "horizontal";
}, as = function(t, n, i) {
  var o = i ? t.left : t.top, r = i ? t.right : t.bottom, s = i ? t.width : t.height, a = i ? n.left : n.top, l = i ? n.right : n.bottom, u = i ? n.width : n.height;
  return o === a || r === l || o + s / 2 === a + u / 2;
}, ls = function(t, n) {
  var i;
  return ke.some(function(o) {
    var r = o[tt].options.emptyInsertThreshold;
    if (!(!r || Wn(o))) {
      var s = I(o), a = t >= s.left - r && t <= s.right + r, l = n >= s.top - r && n <= s.bottom + r;
      if (a && l)
        return i = o;
    }
  }), i;
}, no = function(t) {
  function n(r, s) {
    return function(a, l, u, c) {
      var d = a.options.group.name && l.options.group.name && a.options.group.name === l.options.group.name;
      if (r == null && (s || d))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (s && r === "clone")
        return r;
      if (typeof r == "function")
        return n(r(a, l, u, c), s)(a, l, u, c);
      var p = (s ? a : l).options.group.name;
      return r === !0 || typeof r == "string" && r === p || r.join && r.indexOf(p) > -1;
    };
  }
  var i = {}, o = t.group;
  (!o || Pe(o) != "object") && (o = {
    name: o
  }), i.name = o.name, i.checkPull = n(o.pull, !0), i.checkPut = n(o.put), i.revertClone = o.revertClone, t.group = i;
}, io = function() {
  !to && w && b(w, "display", "none");
}, oo = function() {
  !to && w && b(w, "display", "");
};
gn && !Yi && document.addEventListener("click", function(e) {
  if (Ue)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Ue = !1, !1;
}, !0);
var Pt = function(t) {
  if (h) {
    t = t.touches ? t.touches[0] : t;
    var n = ls(t.clientX, t.clientY);
    if (n) {
      var i = {};
      for (var o in t)
        t.hasOwnProperty(o) && (i[o] = t[o]);
      i.target = i.rootEl = n, i.preventDefault = void 0, i.stopPropagation = void 0, n[tt]._onDragOver(i);
    }
  }
}, us = function(t) {
  h && h.parentNode[tt]._isOutsideThisEl(t.target);
};
function v(e, t) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = t = mt({}, t), e[tt] = this;
  var n = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: !1,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: !0,
    direction: function() {
      return eo(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(s, a) {
      s.setData("Text", a.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: v.supportPointer !== !1 && "PointerEvent" in window && !re,
    emptyInsertThreshold: 5
  };
  Ee.initializePlugins(this, e, n);
  for (var i in n)
    !(i in t) && (t[i] = n[i]);
  no(t);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = t.forceFallback ? !1 : ss, this.nativeDraggable && (this.options.touchStartThreshold = 1), t.supportPointer ? A(e, "pointerdown", this._onTapStart) : (A(e, "mousedown", this._onTapStart), A(e, "touchstart", this._onTapStart)), this.nativeDraggable && (A(e, "dragover", this), A(e, "dragenter", this)), ke.push(this.el), t.store && t.store.get && this.sort(t.store.get(this) || []), mt(this, es());
}
v.prototype = /** @lends Sortable.prototype */
{
  constructor: v,
  _isOutsideThisEl: function(t) {
    !this.el.contains(t) && t !== this.el && (Ht = null);
  },
  _getDirection: function(t, n) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, t, n, h) : this.options.direction;
  },
  _onTapStart: function(t) {
    if (t.cancelable) {
      var n = this, i = this.el, o = this.options, r = o.preventOnFilter, s = t.type, a = t.touches && t.touches[0] || t.pointerType && t.pointerType === "touch" && t, l = (a || t).target, u = t.target.shadowRoot && (t.path && t.path[0] || t.composedPath && t.composedPath()[0]) || l, c = o.filter;
      if (ys(i), !h && !(/mousedown|pointerdown/.test(s) && t.button !== 0 || o.disabled) && !u.isContentEditable && !(!this.nativeDraggable && re && l && l.tagName.toUpperCase() === "SELECT") && (l = lt(l, o.draggable, i, !1), !(l && l.animated) && Oe !== l)) {
        if (Ut = nt(l), ae = nt(l, o.draggable), typeof c == "function") {
          if (c.call(this, t, l, this)) {
            q({
              sortable: n,
              rootEl: u,
              name: "filter",
              targetEl: l,
              toEl: i,
              fromEl: i
            }), W("filter", n, {
              evt: t
            }), r && t.cancelable && t.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(d) {
          if (d = lt(u, d.trim(), i, !1), d)
            return q({
              sortable: n,
              rootEl: d,
              name: "filter",
              targetEl: l,
              fromEl: i,
              toEl: i
            }), W("filter", n, {
              evt: t
            }), !0;
        }), c)) {
          r && t.cancelable && t.preventDefault();
          return;
        }
        o.handle && !lt(u, o.handle, i, !1) || this._prepareDragStart(t, a, l);
      }
    }
  },
  _prepareDragStart: function(t, n, i) {
    var o = this, r = o.el, s = o.options, a = r.ownerDocument, l;
    if (i && !h && i.parentNode === r) {
      var u = I(i);
      if (O = r, h = i, N = h.parentNode, Ot = h.nextSibling, Oe = i, Se = s.group, v.dragged = h, Tt = {
        target: h,
        clientX: (n || t).clientX,
        clientY: (n || t).clientY
      }, yi = Tt.clientX - u.left, bi = Tt.clientY - u.top, this._lastX = (n || t).clientX, this._lastY = (n || t).clientY, h.style["will-change"] = "all", l = function() {
        if (W("delayEnded", o, {
          evt: t
        }), v.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !pi && o.nativeDraggable && (h.draggable = !0), o._triggerDragStart(t, n), q({
          sortable: o,
          name: "choose",
          originalEvent: t
        }), K(h, s.chosenClass, !0);
      }, s.ignore.split(",").forEach(function(c) {
        Wi(h, c.trim(), Pn);
      }), A(a, "dragover", Pt), A(a, "mousemove", Pt), A(a, "touchmove", Pt), A(a, "mouseup", o._onDrop), A(a, "touchend", o._onDrop), A(a, "touchcancel", o._onDrop), pi && this.nativeDraggable && (this.options.touchStartThreshold = 4, h.draggable = !0), W("delayStart", this, {
        evt: t
      }), s.delay && (!s.delayOnTouchOnly || n) && (!this.nativeDraggable || !(we || yt))) {
        if (v.eventCanceled) {
          this._onDrop();
          return;
        }
        A(a, "mouseup", o._disableDelayedDrag), A(a, "touchend", o._disableDelayedDrag), A(a, "touchcancel", o._disableDelayedDrag), A(a, "mousemove", o._delayedDragTouchMoveHandler), A(a, "touchmove", o._delayedDragTouchMoveHandler), s.supportPointer && A(a, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(l, s.delay);
      } else
        l();
    }
  },
  _delayedDragTouchMoveHandler: function(t) {
    var n = t.touches ? t.touches[0] : t;
    Math.max(Math.abs(n.clientX - this._lastX), Math.abs(n.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    h && Pn(h), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var t = this.el.ownerDocument;
    S(t, "mouseup", this._disableDelayedDrag), S(t, "touchend", this._disableDelayedDrag), S(t, "touchcancel", this._disableDelayedDrag), S(t, "mousemove", this._delayedDragTouchMoveHandler), S(t, "touchmove", this._delayedDragTouchMoveHandler), S(t, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(t, n) {
    n = n || t.pointerType == "touch" && t, !this.nativeDraggable || n ? this.options.supportPointer ? A(document, "pointermove", this._onTouchMove) : n ? A(document, "touchmove", this._onTouchMove) : A(document, "mousemove", this._onTouchMove) : (A(h, "dragend", this), A(O, "dragstart", this._onDragStart));
    try {
      document.selection ? De(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(t, n) {
    if (Vt = !1, O && h) {
      W("dragStarted", this, {
        evt: n
      }), this.nativeDraggable && A(document, "dragover", us);
      var i = this.options;
      !t && K(h, i.dragClass, !1), K(h, i.ghostClass, !0), v.active = this, t && this._appendGhost(), q({
        sortable: this,
        name: "start",
        originalEvent: n
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (at) {
      this._lastX = at.clientX, this._lastY = at.clientY, io();
      for (var t = document.elementFromPoint(at.clientX, at.clientY), n = t; t && t.shadowRoot && (t = t.shadowRoot.elementFromPoint(at.clientX, at.clientY), t !== n); )
        n = t;
      if (h.parentNode[tt]._isOutsideThisEl(t), n)
        do {
          if (n[tt]) {
            var i = void 0;
            if (i = n[tt]._onDragOver({
              clientX: at.clientX,
              clientY: at.clientY,
              target: t,
              rootEl: n
            }), i && !this.options.dragoverBubble)
              break;
          }
          t = n;
        } while (n = n.parentNode);
      oo();
    }
  },
  _onTouchMove: function(t) {
    if (Tt) {
      var n = this.options, i = n.fallbackTolerance, o = n.fallbackOffset, r = t.touches ? t.touches[0] : t, s = w && kt(w, !0), a = w && s && s.a, l = w && s && s.d, u = _e && X && mi(X), c = (r.clientX - Tt.clientX + o.x) / (a || 1) + (u ? u[0] - Tn[0] : 0) / (a || 1), d = (r.clientY - Tt.clientY + o.y) / (l || 1) + (u ? u[1] - Tn[1] : 0) / (l || 1);
      if (!v.active && !Vt) {
        if (i && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < i)
          return;
        this._onDragStart(t, !0);
      }
      if (w) {
        s ? (s.e += c - (An || 0), s.f += d - (Cn || 0)) : s = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: d
        };
        var p = "matrix(".concat(s.a, ",").concat(s.b, ",").concat(s.c, ",").concat(s.d, ",").concat(s.e, ",").concat(s.f, ")");
        b(w, "webkitTransform", p), b(w, "mozTransform", p), b(w, "msTransform", p), b(w, "transform", p), An = c, Cn = d, at = r;
      }
      t.cancelable && t.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!w) {
      var t = this.options.fallbackOnBody ? document.body : O, n = I(h, !0, _e, !0, t), i = this.options;
      if (_e) {
        for (X = t; b(X, "position") === "static" && b(X, "transform") === "none" && X !== document; )
          X = X.parentNode;
        X !== document.body && X !== document.documentElement ? (X === document && (X = ut()), n.top += X.scrollTop, n.left += X.scrollLeft) : X = ut(), Tn = mi(X);
      }
      w = h.cloneNode(!0), K(w, i.ghostClass, !1), K(w, i.fallbackClass, !0), K(w, i.dragClass, !0), b(w, "transition", ""), b(w, "transform", ""), b(w, "box-sizing", "border-box"), b(w, "margin", 0), b(w, "top", n.top), b(w, "left", n.left), b(w, "width", n.width), b(w, "height", n.height), b(w, "opacity", "0.8"), b(w, "position", _e ? "absolute" : "fixed"), b(w, "zIndex", "100000"), b(w, "pointerEvents", "none"), v.ghost = w, t.appendChild(w), b(w, "transform-origin", yi / parseInt(w.style.width) * 100 + "% " + bi / parseInt(w.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(t, n) {
    var i = this, o = t.dataTransfer, r = i.options;
    if (W("dragStart", this, {
      evt: t
    }), v.eventCanceled) {
      this._onDrop();
      return;
    }
    W("setupClone", this), v.eventCanceled || (D = Ki(h), D.removeAttribute("id"), D.draggable = !1, D.style["will-change"] = "", this._hideClone(), K(D, this.options.chosenClass, !1), v.clone = D), i.cloneId = De(function() {
      W("clone", i), !v.eventCanceled && (i.options.removeCloneOnHide || O.insertBefore(D, h), i._hideClone(), q({
        sortable: i,
        name: "clone"
      }));
    }), !n && K(h, r.dragClass, !0), n ? (Ue = !0, i._loopId = setInterval(i._emulateDragOver, 50)) : (S(document, "mouseup", i._onDrop), S(document, "touchend", i._onDrop), S(document, "touchcancel", i._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(i, o, h)), A(document, "drop", i), b(h, "transform", "translateZ(0)")), Vt = !0, i._dragStartId = De(i._dragStarted.bind(i, n, t)), A(document, "selectstart", i), te = !0, re && b(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(t) {
    var n = this.el, i = t.target, o, r, s, a = this.options, l = a.group, u = v.active, c = Se === l, d = a.sort, p = k || u, f, g = this, y = !1;
    if (In)
      return;
    function P(Gt, Po) {
      W(Gt, g, dt({
        evt: t,
        isOwner: c,
        axis: f ? "vertical" : "horizontal",
        revert: s,
        dragRect: o,
        targetRect: r,
        canSort: d,
        fromSortable: p,
        target: i,
        completed: B,
        onMove: function(Qn, Oo) {
          return Ae(O, n, h, o, Qn, I(Qn), t, Oo);
        },
        changed: J
      }, Po));
    }
    function L() {
      P("dragOverAnimationCapture"), g.captureAnimationState(), g !== p && p.captureAnimationState();
    }
    function B(Gt) {
      return P("dragOverCompleted", {
        insertion: Gt
      }), Gt && (c ? u._hideClone() : u._showClone(g), g !== p && (K(h, k ? k.options.ghostClass : u.options.ghostClass, !1), K(h, a.ghostClass, !0)), k !== g && g !== v.active ? k = g : g === v.active && k && (k = null), p === g && (g._ignoreWhileAnimating = i), g.animateAll(function() {
        P("dragOverAnimationComplete"), g._ignoreWhileAnimating = null;
      }), g !== p && (p.animateAll(), p._ignoreWhileAnimating = null)), (i === h && !h.animated || i === n && !i.animated) && (Ht = null), !a.dragoverBubble && !t.rootEl && i !== document && (h.parentNode[tt]._isOutsideThisEl(t.target), !Gt && Pt(t)), !a.dragoverBubble && t.stopPropagation && t.stopPropagation(), y = !0;
    }
    function J() {
      Q = nt(h), Et = nt(h, a.draggable), q({
        sortable: g,
        name: "change",
        toEl: n,
        newIndex: Q,
        newDraggableIndex: Et,
        originalEvent: t
      });
    }
    if (t.preventDefault !== void 0 && t.cancelable && t.preventDefault(), i = lt(i, a.draggable, n, !0), P("dragOver"), v.eventCanceled)
      return y;
    if (h.contains(t.target) || i.animated && i.animatingX && i.animatingY || g._ignoreWhileAnimating === i)
      return B(!1);
    if (Ue = !1, u && !a.disabled && (c ? d || (s = N !== O) : k === this || (this.lastPutMode = Se.checkPull(this, u, h, t)) && l.checkPut(this, u, h, t))) {
      if (f = this._getDirection(t, i) === "vertical", o = I(h), P("dragOverValid"), v.eventCanceled)
        return y;
      if (s)
        return N = O, L(), this._hideClone(), P("revert"), v.eventCanceled || (Ot ? O.insertBefore(h, Ot) : O.appendChild(h)), B(!0);
      var Y = Wn(n, a.draggable);
      if (!Y || ps(t, f, this) && !Y.animated) {
        if (Y === h)
          return B(!1);
        if (Y && n === t.target && (i = Y), i && (r = I(i)), Ae(O, n, h, o, i, r, t, !!i) !== !1)
          return L(), Y && Y.nextSibling ? n.insertBefore(h, Y.nextSibling) : n.appendChild(h), N = n, J(), B(!0);
      } else if (Y && hs(t, f, this)) {
        var rt = Zt(n, 0, a, !0);
        if (rt === h)
          return B(!1);
        if (i = rt, r = I(i), Ae(O, n, h, o, i, r, t, !1) !== !1)
          return L(), n.insertBefore(h, rt), N = n, J(), B(!0);
      } else if (i.parentNode === n) {
        r = I(i);
        var C = 0, z, st = h.parentNode !== n, Z = !as(h.animated && h.toRect || o, i.animated && i.toRect || r, f), Yt = f ? "top" : "left", bt = gi(i, "top", "top") || gi(h, "top", "top"), qt = bt ? bt.scrollTop : void 0;
        Ht !== i && (z = r[Yt], ue = !1, $e = !Z && a.invertSwap || st), C = fs(t, i, r, f, Z ? 1 : a.swapThreshold, a.invertedSwapThreshold == null ? a.swapThreshold : a.invertedSwapThreshold, $e, Ht === i);
        var ct;
        if (C !== 0) {
          var _t = nt(h);
          do
            _t -= C, ct = N.children[_t];
          while (ct && (b(ct, "display") === "none" || ct === w));
        }
        if (C === 0 || ct === i)
          return B(!1);
        Ht = i, le = C;
        var Wt = i.nextElementSibling, vt = !1;
        vt = C === 1;
        var xe = Ae(O, n, h, o, i, r, t, vt);
        if (xe !== !1)
          return (xe === 1 || xe === -1) && (vt = xe === 1), In = !0, setTimeout(cs, 30), L(), vt && !Wt ? n.appendChild(h) : i.parentNode.insertBefore(h, vt ? Wt : i), bt && Ji(bt, 0, qt - bt.scrollTop), N = h.parentNode, z !== void 0 && !$e && (Re = Math.abs(z - I(i)[Yt])), J(), B(!0);
      }
      if (n.contains(h))
        return B(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    S(document, "mousemove", this._onTouchMove), S(document, "touchmove", this._onTouchMove), S(document, "pointermove", this._onTouchMove), S(document, "dragover", Pt), S(document, "mousemove", Pt), S(document, "touchmove", Pt);
  },
  _offUpEvents: function() {
    var t = this.el.ownerDocument;
    S(t, "mouseup", this._onDrop), S(t, "touchend", this._onDrop), S(t, "pointerup", this._onDrop), S(t, "touchcancel", this._onDrop), S(document, "selectstart", this);
  },
  _onDrop: function(t) {
    var n = this.el, i = this.options;
    if (Q = nt(h), Et = nt(h, i.draggable), W("drop", this, {
      evt: t
    }), N = h && h.parentNode, Q = nt(h), Et = nt(h, i.draggable), v.eventCanceled) {
      this._nulling();
      return;
    }
    Vt = !1, $e = !1, ue = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Hn(this.cloneId), Hn(this._dragStartId), this.nativeDraggable && (S(document, "drop", this), S(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), re && b(document.body, "user-select", ""), b(h, "transform", ""), t && (te && (t.cancelable && t.preventDefault(), !i.dropBubble && t.stopPropagation()), w && w.parentNode && w.parentNode.removeChild(w), (O === N || k && k.lastPutMode !== "clone") && D && D.parentNode && D.parentNode.removeChild(D), h && (this.nativeDraggable && S(h, "dragend", this), Pn(h), h.style["will-change"] = "", te && !Vt && K(h, k ? k.options.ghostClass : this.options.ghostClass, !1), K(h, this.options.chosenClass, !1), q({
      sortable: this,
      name: "unchoose",
      toEl: N,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: t
    }), O !== N ? (Q >= 0 && (q({
      rootEl: N,
      name: "add",
      toEl: N,
      fromEl: O,
      originalEvent: t
    }), q({
      sortable: this,
      name: "remove",
      toEl: N,
      originalEvent: t
    }), q({
      rootEl: N,
      name: "sort",
      toEl: N,
      fromEl: O,
      originalEvent: t
    }), q({
      sortable: this,
      name: "sort",
      toEl: N,
      originalEvent: t
    })), k && k.save()) : Q !== Ut && Q >= 0 && (q({
      sortable: this,
      name: "update",
      toEl: N,
      originalEvent: t
    }), q({
      sortable: this,
      name: "sort",
      toEl: N,
      originalEvent: t
    })), v.active && ((Q == null || Q === -1) && (Q = Ut, Et = ae), q({
      sortable: this,
      name: "end",
      toEl: N,
      originalEvent: t
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    W("nulling", this), O = h = N = w = Ot = D = Oe = xt = Tt = at = te = Q = Et = Ut = ae = Ht = le = k = Se = v.dragged = v.ghost = v.clone = v.active = null, Fe.forEach(function(t) {
      t.checked = !0;
    }), Fe.length = An = Cn = 0;
  },
  handleEvent: function(t) {
    switch (t.type) {
      case "drop":
      case "dragend":
        this._onDrop(t);
        break;
      case "dragenter":
      case "dragover":
        h && (this._onDragOver(t), ds(t));
        break;
      case "selectstart":
        t.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    for (var t = [], n, i = this.el.children, o = 0, r = i.length, s = this.options; o < r; o++)
      n = i[o], lt(n, s.draggable, this.el, !1) && t.push(n.getAttribute(s.dataIdAttr) || ms(n));
    return t;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(t, n) {
    var i = {}, o = this.el;
    this.toArray().forEach(function(r, s) {
      var a = o.children[s];
      lt(a, this.options.draggable, o, !1) && (i[r] = a);
    }, this), n && this.captureAnimationState(), t.forEach(function(r) {
      i[r] && (o.removeChild(i[r]), o.appendChild(i[r]));
    }), n && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    var t = this.options.store;
    t && t.set && t.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(t, n) {
    return lt(t, n || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(t, n) {
    var i = this.options;
    if (n === void 0)
      return i[t];
    var o = Ee.modifyOption(this, t, n);
    typeof o < "u" ? i[t] = o : i[t] = n, t === "group" && no(i);
  },
  /**
   * Destroy
   */
  destroy: function() {
    W("destroy", this);
    var t = this.el;
    t[tt] = null, S(t, "mousedown", this._onTapStart), S(t, "touchstart", this._onTapStart), S(t, "pointerdown", this._onTapStart), this.nativeDraggable && (S(t, "dragover", this), S(t, "dragenter", this)), Array.prototype.forEach.call(t.querySelectorAll("[draggable]"), function(n) {
      n.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), ke.splice(ke.indexOf(this.el), 1), this.el = t = null;
  },
  _hideClone: function() {
    if (!xt) {
      if (W("hideClone", this), v.eventCanceled)
        return;
      b(D, "display", "none"), this.options.removeCloneOnHide && D.parentNode && D.parentNode.removeChild(D), xt = !0;
    }
  },
  _showClone: function(t) {
    if (t.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (xt) {
      if (W("showClone", this), v.eventCanceled)
        return;
      h.parentNode == O && !this.options.group.revertClone ? O.insertBefore(D, h) : Ot ? O.insertBefore(D, Ot) : O.appendChild(D), this.options.group.revertClone && this.animate(h, D), b(D, "display", ""), xt = !1;
    }
  }
};
function ds(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ae(e, t, n, i, o, r, s, a) {
  var l, u = e[tt], c = u.options.onMove, d;
  return window.CustomEvent && !yt && !we ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = t, l.from = e, l.dragged = n, l.draggedRect = i, l.related = o || t, l.relatedRect = r || I(t), l.willInsertAfter = a, l.originalEvent = s, e.dispatchEvent(l), c && (d = c.call(u, l, s)), d;
}
function Pn(e) {
  e.draggable = !1;
}
function cs() {
  In = !1;
}
function hs(e, t, n) {
  var i = I(Zt(n.el, 0, n.options, !0)), o = Qi(n.el, n.options, w), r = 10;
  return t ? e.clientX < o.left - r || e.clientY < i.top && e.clientX < i.right : e.clientY < o.top - r || e.clientY < i.bottom && e.clientX < i.left;
}
function ps(e, t, n) {
  var i = I(Wn(n.el, n.options.draggable)), o = Qi(n.el, n.options, w), r = 10;
  return t ? e.clientX > o.right + r || e.clientY > i.bottom && e.clientX > i.left : e.clientY > o.bottom + r || e.clientX > i.right && e.clientY > i.top;
}
function fs(e, t, n, i, o, r, s, a) {
  var l = i ? e.clientY : e.clientX, u = i ? n.height : n.width, c = i ? n.top : n.left, d = i ? n.bottom : n.right, p = !1;
  if (!s) {
    if (a && Re < u * o) {
      if (!ue && (le === 1 ? l > c + u * r / 2 : l < d - u * r / 2) && (ue = !0), ue)
        p = !0;
      else if (le === 1 ? l < c + Re : l > d - Re)
        return -le;
    } else if (l > c + u * (1 - o) / 2 && l < d - u * (1 - o) / 2)
      return gs(t);
  }
  return p = p || s, p && (l < c + u * r / 2 || l > d - u * r / 2) ? l > c + u / 2 ? 1 : -1 : 0;
}
function gs(e) {
  return nt(h) < nt(e) ? 1 : -1;
}
function ms(e) {
  for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, i = 0; n--; )
    i += t.charCodeAt(n);
  return i.toString(36);
}
function ys(e) {
  Fe.length = 0;
  for (var t = e.getElementsByTagName("input"), n = t.length; n--; ) {
    var i = t[n];
    i.checked && Fe.push(i);
  }
}
function De(e) {
  return setTimeout(e, 0);
}
function Hn(e) {
  return clearTimeout(e);
}
gn && A(document, "touchmove", function(e) {
  (v.active || Vt) && e.cancelable && e.preventDefault();
});
v.utils = {
  on: A,
  off: S,
  css: b,
  find: Wi,
  is: function(t, n) {
    return !!lt(t, n, t, !1);
  },
  extend: Qr,
  throttle: Gi,
  closest: lt,
  toggleClass: K,
  clone: Ki,
  index: nt,
  nextTick: De,
  cancelNextTick: Hn,
  detectDirection: eo,
  getChild: Zt
};
v.get = function(e) {
  return e[tt];
};
v.mount = function() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  t[0].constructor === Array && (t = t[0]), t.forEach(function(i) {
    if (!i.prototype || !i.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(i));
    i.utils && (v.utils = dt(dt({}, v.utils), i.utils)), Ee.mount(i);
  });
};
v.create = function(e, t) {
  return new v(e, t);
};
v.version = Gr;
var M = [], ee, Bn, Vn = !1, On, Rn, je, ne;
function bs() {
  function e() {
    this.defaults = {
      scroll: !0,
      forceAutoScrollFallback: !1,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: !0
    };
    for (var t in this)
      t.charAt(0) === "_" && typeof this[t] == "function" && (this[t] = this[t].bind(this));
  }
  return e.prototype = {
    dragStarted: function(n) {
      var i = n.originalEvent;
      this.sortable.nativeDraggable ? A(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? A(document, "pointermove", this._handleFallbackAutoScroll) : i.touches ? A(document, "touchmove", this._handleFallbackAutoScroll) : A(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(n) {
      var i = n.originalEvent;
      !this.options.dragOverBubble && !i.rootEl && this._handleAutoScroll(i);
    },
    drop: function() {
      this.sortable.nativeDraggable ? S(document, "dragover", this._handleAutoScroll) : (S(document, "pointermove", this._handleFallbackAutoScroll), S(document, "touchmove", this._handleFallbackAutoScroll), S(document, "mousemove", this._handleFallbackAutoScroll)), wi(), Ne(), ts();
    },
    nulling: function() {
      je = Bn = ee = Vn = ne = On = Rn = null, M.length = 0;
    },
    _handleFallbackAutoScroll: function(n) {
      this._handleAutoScroll(n, !0);
    },
    _handleAutoScroll: function(n, i) {
      var o = this, r = (n.touches ? n.touches[0] : n).clientX, s = (n.touches ? n.touches[0] : n).clientY, a = document.elementFromPoint(r, s);
      if (je = n, i || this.options.forceAutoScrollFallback || we || yt || re) {
        Dn(n, this.options, a, i);
        var l = St(a, !0);
        Vn && (!ne || r !== On || s !== Rn) && (ne && wi(), ne = setInterval(function() {
          var u = St(document.elementFromPoint(r, s), !0);
          u !== l && (l = u, Ne()), Dn(n, o.options, u, i);
        }, 10), On = r, Rn = s);
      } else {
        if (!this.options.bubbleScroll || St(a, !0) === ut()) {
          Ne();
          return;
        }
        Dn(n, this.options, St(a, !1), !1);
      }
    }
  }, mt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ne() {
  M.forEach(function(e) {
    clearInterval(e.pid);
  }), M = [];
}
function wi() {
  clearInterval(ne);
}
var Dn = Gi(function(e, t, n, i) {
  if (t.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, s = t.scrollSensitivity, a = t.scrollSpeed, l = ut(), u = !1, c;
    Bn !== n && (Bn = n, Ne(), ee = t.scroll, c = t.scrollFn, ee === !0 && (ee = St(n, !0)));
    var d = 0, p = ee;
    do {
      var f = p, g = I(f), y = g.top, P = g.bottom, L = g.left, B = g.right, J = g.width, Y = g.height, rt = void 0, C = void 0, z = f.scrollWidth, st = f.scrollHeight, Z = b(f), Yt = f.scrollLeft, bt = f.scrollTop;
      f === l ? (rt = J < z && (Z.overflowX === "auto" || Z.overflowX === "scroll" || Z.overflowX === "visible"), C = Y < st && (Z.overflowY === "auto" || Z.overflowY === "scroll" || Z.overflowY === "visible")) : (rt = J < z && (Z.overflowX === "auto" || Z.overflowX === "scroll"), C = Y < st && (Z.overflowY === "auto" || Z.overflowY === "scroll"));
      var qt = rt && (Math.abs(B - o) <= s && Yt + J < z) - (Math.abs(L - o) <= s && !!Yt), ct = C && (Math.abs(P - r) <= s && bt + Y < st) - (Math.abs(y - r) <= s && !!bt);
      if (!M[d])
        for (var _t = 0; _t <= d; _t++)
          M[_t] || (M[_t] = {});
      (M[d].vx != qt || M[d].vy != ct || M[d].el !== f) && (M[d].el = f, M[d].vx = qt, M[d].vy = ct, clearInterval(M[d].pid), (qt != 0 || ct != 0) && (u = !0, M[d].pid = setInterval((function() {
        i && this.layer === 0 && v.active._onTouchMove(je);
        var Wt = M[this.layer].vy ? M[this.layer].vy * a : 0, vt = M[this.layer].vx ? M[this.layer].vx * a : 0;
        typeof c == "function" && c.call(v.dragged.parentNode[tt], vt, Wt, e, je, M[this.layer].el) !== "continue" || Ji(M[this.layer].el, vt, Wt);
      }).bind({
        layer: d
      }), 24))), d++;
    } while (t.bubbleScroll && p !== l && (p = St(p, !1)));
    Vn = u;
  }
}, 30), ro = function(t) {
  var n = t.originalEvent, i = t.putSortable, o = t.dragEl, r = t.activeSortable, s = t.dispatchSortableEvent, a = t.hideGhostForTarget, l = t.unhideGhostForTarget;
  if (n) {
    var u = i || r;
    a();
    var c = n.changedTouches && n.changedTouches.length ? n.changedTouches[0] : n, d = document.elementFromPoint(c.clientX, c.clientY);
    l(), u && !u.el.contains(d) && (s("spill"), this.onSpill({
      dragEl: o,
      putSortable: i
    }));
  }
};
function Gn() {
}
Gn.prototype = {
  startIndex: null,
  dragStart: function(t) {
    var n = t.oldDraggableIndex;
    this.startIndex = n;
  },
  onSpill: function(t) {
    var n = t.dragEl, i = t.putSortable;
    this.sortable.captureAnimationState(), i && i.captureAnimationState();
    var o = Zt(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(n, o) : this.sortable.el.appendChild(n), this.sortable.animateAll(), i && i.animateAll();
  },
  drop: ro
};
mt(Gn, {
  pluginName: "revertOnSpill"
});
function Jn() {
}
Jn.prototype = {
  onSpill: function(t) {
    var n = t.dragEl, i = t.putSortable, o = i || this.sortable;
    o.captureAnimationState(), n.parentNode && n.parentNode.removeChild(n), o.animateAll();
  },
  drop: ro
};
mt(Jn, {
  pluginName: "removeOnSpill"
});
v.mount(new bs());
v.mount(Jn, Gn);
const vs = (e) => {
  const t = e.item;
  let n = Array.prototype.slice.call(t.parentNode.childNodes);
  return n = n.filter(
    (i) => i.nodeType != Node.ELEMENT_NODE || !i.classList.contains("sortable-fallback")
  ), n;
}, ws = (e, t, n, i, o, r) => {
  const a = e.item.parentNode;
  for (const y of n)
    a.appendChild(y);
  if (e.oldIndex == e.newIndex)
    return;
  const l = i.getArray(), u = (
    /** @type {Element & {layer: import("ol/layer").Layer}} */
    e.item.querySelector("eox-layercontrol-layer").layer.get(o)
  ), c = l.find((y) => y.get(o) === u), d = r.dataset.layer, p = l.find(
    (y) => y.get(o) == d
  );
  let f, g;
  for (f = 0; f < l.length; f++)
    if (l[f] == c) {
      i.removeAt(f);
      break;
    }
  for (g = 0; g < l.length; g++)
    if (l[g] === p) {
      f > g ? i.insertAt(g, c) : i.insertAt(g + 1, c);
      break;
    }
  t.requestUpdate();
};
function Es(e, t, n, i) {
  let o = [], r = null;
  e._sortable = v.create(e, {
    handle: ".drag-handle",
    filter: ".drag-handle.disabled",
    swapThreshold: 0.5,
    animation: 150,
    easing: "cubic-bezier(1, 0, 0, 1)",
    onStart: (s) => o = vs(s),
    onMove: (s) => {
      r = s.related;
    },
    onEnd: (s) => ws(s, i, o, t, n, r)
  });
}
function xs(e, t, n, i) {
  const o = e.getArray();
  let r = !1;
  o.forEach((s) => {
    const a = s.ol_uid;
    s.get(t) || (s.set(t, a), r = !0), s.get(n) || (s.set(n, `layer ${a}`), r = !0), r && i.requestUpdate();
  });
}
function Kn(e, t, n) {
  let i = [];
  const o = (r, s, a) => {
    i = [
      ...i,
      ...r.filter((u) => u.get(s) === a)
    ];
    const l = r.filter(
      (u) => (
        /** @type {import("ol/layer").Group} */
        u.getLayers
      )
    );
    return l.length > 0 && l.forEach(
      (u) => (
        // @ts-ignore
        o(u.getLayers().getArray(), s, a)
      )
    ), i;
  };
  return o(e, t, n), i;
}
function Ss(e, t, n) {
  if (!e || !t)
    return !1;
  if (!so(e, n))
    return !0;
  const i = e.get("minZoom"), o = e.get("maxZoom"), r = t.getView().getZoom();
  return r > i && r < o;
}
function so(e, t) {
  const n = e.get("minZoom"), i = e.get("maxZoom");
  return !!(t && (n !== -1 / 0 || i !== 1 / 0));
}
function $s(e, t) {
  var o, r, s;
  return !e || !t ? void 0 : e.getLayers ? "group" : ((s = (o = t.getInteractions().getArray().filter((a) => a.freehand_ !== void 0).map((a) => a.source_)) == null ? void 0 : o.ol_uid) == null ? void 0 : s.includes(
    // @ts-ignore
    e.getSource ? (r = e.getSource()) == null ? void 0 : r.ol_uid : void 0
  )) ? "draw" : e.declutter_ !== void 0 ? "vector" : "raster";
}
function ao(e, t) {
  var i;
  let n = {};
  for (const o in e) {
    const r = e[o].type;
    if (r && r !== "object")
      n[o] = r === "number" ? Number(t[o]) : t[o];
    else if (typeof e[o] == "object" && ((i = e[o]) != null && i.properties)) {
      const s = ao(
        e[o].properties,
        t
      );
      Object.keys(s).length > 0 && (n[o] = s);
    }
  }
  return n;
}
function _s(e, t) {
  var r;
  if (!t || !e.getSource().getTileUrlFunction())
    return null;
  const n = new URL(e.getSource().getTileUrlFunction()([0, 0, 0])), i = Object.fromEntries(n.searchParams.entries()), o = ao(
    ((r = t.schema) == null ? void 0 : r.properties) || t.schema,
    i
  );
  return Object.keys(o).length ? o : null;
}
const As = (e, t) => e == null ? void 0 : e.filter(
  (n) => ["remove", "sort"].filter((i) => t != null && t.get("layerControlDisable") ? i !== "sort" : !0).includes(n)
), Cs = (e, t) => e == null ? void 0 : e.filter((n) => {
  let i = !0;
  return ["remove", "sort"].includes(n) && (i = !1), n === "info" && (i = t.get("description")), n === "config" && (i = t.get("layerConfig")), i;
}), Ts = (e, t) => x`
  <button slot="${e}-icon" class="icon">${t ? e : T}</button>
`, Ps = (e) => x`
  <button
    class="remove-icon icon"
    @click=${() => {
  const { layer: t } = e;
  t == null || t.set("layerControlOptional", !0), t == null || t.setVisible(!1), e.dispatchEvent(
    new CustomEvent("changed", {
      detail: t,
      bubbles: !0
    })
  );
}}
  >
    ${e.unstyled ? "x" : T}
  </button>
`, Os = (e) => x`
  <span class="button sort-icon icon drag-handle">
    ${e ? "═" : T}
  </span>
`, lo = (e) => {
  var n;
  const t = ["layerControlHide", "layerControlOptional"];
  return (n = e == null ? void 0 : e.getArray()) == null ? void 0 : n.filter((i) => t.every((o) => !i.get(o)));
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const uo = Zn(class extends Xn {
  constructor(e) {
    if (super(e), e.type !== wt.PROPERTY && e.type !== wt.ATTRIBUTE && e.type !== wt.BOOLEAN_ATTRIBUTE)
      throw Error("The `live` directive is not allowed on child or event bindings");
    if (!qo(e))
      throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === it || t === T)
      return t;
    const n = e.element, i = e.name;
    if (e.type === wt.PROPERTY) {
      if (t === n[i])
        return it;
    } else if (e.type === wt.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i))
        return it;
    } else if (e.type === wt.ATTRIBUTE && n.getAttribute(i) === t + "")
      return it;
    return Bi(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Ln extends Xn {
  constructor(t) {
    if (super(t), this.it = T, t.type !== wt.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === T || t == null)
      return this._t = void 0, this.it = t;
    if (t === it)
      return t;
    if (typeof t != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it)
      return this._t;
    this.it = t;
    const n = [t];
    return n.raw = n, this._t = { _$litType$: this.constructor.resultType, strings: n, values: [] };
  }
}
Ln.directiveName = "unsafeHTML", Ln.resultType = 1;
const Rs = Zn(Ln);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* Me(e, t) {
  if (e !== void 0) {
    let n = 0;
    for (const i of e)
      yield t(i, n++);
  }
}
const Ds = (e, t, n) => {
  let i = t;
  return n.layer.getSource().getTileUrlFunction() && (i || (i = n.layer.getSource().getTileUrlFunction()), n.layer.getSource().setTileUrlFunction(
    (...o) => Xr(i(...o), e)
  ), n.layer.getSource().setKey(/* @__PURE__ */ new Date())), i;
};
var Ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ns(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ms = "Expected a function", Ei = NaN, Is = "[object Symbol]", Hs = /^\s+|\s+$/g, Bs = /^[-+]0x[0-9a-f]+$/i, Vs = /^0b[01]+$/i, Ls = /^0o[0-7]+$/i, Us = parseInt, ks = typeof Ce == "object" && Ce && Ce.Object === Object && Ce, Fs = typeof self == "object" && self && self.Object === Object && self, js = ks || Fs || Function("return this")(), zs = Object.prototype, Zs = zs.toString, Xs = Math.max, Ys = Math.min, Nn = function() {
  return js.Date.now();
};
function qs(e, t, n) {
  var i, o, r, s, a, l, u = 0, c = !1, d = !1, p = !0;
  if (typeof e != "function")
    throw new TypeError(Ms);
  t = xi(t) || 0, Un(n) && (c = !!n.leading, d = "maxWait" in n, r = d ? Xs(xi(n.maxWait) || 0, t) : r, p = "trailing" in n ? !!n.trailing : p);
  function f(C) {
    var z = i, st = o;
    return i = o = void 0, u = C, s = e.apply(st, z), s;
  }
  function g(C) {
    return u = C, a = setTimeout(L, t), c ? f(C) : s;
  }
  function y(C) {
    var z = C - l, st = C - u, Z = t - z;
    return d ? Ys(Z, r - st) : Z;
  }
  function P(C) {
    var z = C - l, st = C - u;
    return l === void 0 || z >= t || z < 0 || d && st >= r;
  }
  function L() {
    var C = Nn();
    if (P(C))
      return B(C);
    a = setTimeout(L, y(C));
  }
  function B(C) {
    return a = void 0, p && i ? f(C) : (i = o = void 0, s);
  }
  function J() {
    a !== void 0 && clearTimeout(a), u = 0, i = l = o = a = void 0;
  }
  function Y() {
    return a === void 0 ? s : B(Nn());
  }
  function rt() {
    var C = Nn(), z = P(C);
    if (i = arguments, o = this, l = C, z) {
      if (a === void 0)
        return g(l);
      if (d)
        return a = setTimeout(L, t), f(l);
    }
    return a === void 0 && (a = setTimeout(L, t)), s;
  }
  return rt.cancel = J, rt.flush = Y, rt;
}
function Un(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Ws(e) {
  return !!e && typeof e == "object";
}
function Gs(e) {
  return typeof e == "symbol" || Ws(e) && Zs.call(e) == Is;
}
function xi(e) {
  if (typeof e == "number")
    return e;
  if (Gs(e))
    return Ei;
  if (Un(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Un(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = e.replace(Hs, "");
  var n = Vs.test(e);
  return n || Ls.test(e) ? Us(e.slice(2), n ? 2 : 8) : Bs.test(e) ? Ei : +e;
}
var Js = qs;
const Ks = /* @__PURE__ */ Ns(Js);
var fe, ge, me, ze, ho, Ze, Xe;
class co extends et {
  constructor() {
    super();
    /**
     * Handles changes in eox-jsonform values.
     *
     *  @param  {{ detail: { value: string; }; }} e
     */
    $(this, ze);
    /**
     * data input by the user
     *
     * @type {{[key: string]: any}}
     */
    $(this, fe, {});
    /**
     * data input by the user
     *
     * @type {{[key: string]: any}}
     */
    $(this, ge, null);
    /**
     * Original tile url function, if it exist
     *
     * @type {Function}
     */
    $(this, me, void 0);
    $(this, Ze, "");
    $(this, Xe, "");
    this.layer = null, this.unstyled = !1, this.noShadow = !1, this.layerConfig = null, this.debouncedDataChange = Ks(U(this, ze, ho), 1e3, {
      leading: !0
    });
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders a JSON form for configuration options of a layer.
   */
  render() {
    Jt(this, ge, _s(this.layer, this.layerConfig)), customElements.get("eox-jsonform") || console.error("Please import @eox/jsonform in order to use layerconfig");
    const n = {
      disable_edit_json: !0,
      disable_collapse: !0,
      disable_properties: !0
    };
    return x`
      <style>
        ${R(this, Ze)}
        ${!this.unstyled && R(this, Xe)}
      </style>
      ${ot(
      this.layerConfig,
      () => x`
          <!-- Render a JSON form for layer configuration -->
          <eox-jsonform
            .schema=${this.layerConfig.schema}
            .value=${R(this, ge)}
            .options=${n}
            @change=${this.debouncedDataChange}
          ></eox-jsonform>
        `
    )}
    `;
  }
}
fe = new WeakMap(), ge = new WeakMap(), me = new WeakMap(), ze = new WeakSet(), ho = function(n) {
  Jt(this, fe, n.detail), Jt(this, me, Ds(
    R(this, fe),
    R(this, me),
    this
  )), this.requestUpdate();
}, Ze = new WeakMap(), Xe = new WeakMap(), // Define static properties for the component
H(co, "properties", {
  layer: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean },
  layerConfig: { attribute: !1 }
});
customElements.define(
  "eox-layercontrol-layerconfig",
  co
);
var ye, Ye, qe;
class po extends et {
  constructor() {
    super();
    /** @param {number} index */
    $(this, ye, (n) => this.selectedTab === n && "highlighted");
    $(this, Ye, `
    .tabbed figure {
      margin: 0;
    }
    .tabbed nav {
      display: flex;
      justify-content: space-between;
    }
    .tabbed nav div {
      display: flex;
    }
    .tabbed .tab {
      display: none;
    }
    .tabbed .tab.highlighted {
      display: block;
    }
    .tabbed label.highlighted {
      background: lightgrey;
    }
  `);
    $(this, qe, `
    .tabbed {
      font-size: small;
    }
    .tabbed label.highlighted {
      background: #00417011;
      pointer-events: none;
    }
    nav div label,
    nav div span {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    figure {
      background: #00417011;
      border-top: 1px solid #0041701a;
    }
  `);
    this.actions = [], this.selectedTab = 0, this.tabs = [], this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders a tabbed interface that displays tabs and corresponding content areas based on the provided 'tabs' and 'actions'.
   * It sets up navigation for switching between tabs and offers customizable icons for tabs and actions.
   */
  render() {
    const n = this.tabs, i = this.actions, o = i.length + n.length > 1;
    return x`
      <style>
        ${R(this, Ye)}
        ${!this.unstyled && R(this, qe)}
      </style>
      <div class="tabbed">
        <!-- Navigation for tabs and actions -->
        ${ot(
      o,
      () => x`
            <nav>
              <div>
                <!-- Labels for tabs -->
                ${Me(
        n,
        (r, s) => x`
                      <label
                        class=${R(this, ye).call(this, s)}
                        @click=${() => this.selectedTab = s}
                      >
                        <!-- Customizable icon for each tab -->
                        <slot name=${`${r}-icon`}>${r}</slot>
                      </label>
                    `
      )}
              </div>
              <div>
                <!-- Icons for actions -->
                ${Me(
        i,
        (r) => x`
                      <span>
                        <!-- Customizable icon for each action -->
                        <slot name=${`${r}-icon`}>${r}</slot>
                      </span>
                    `
      )}
              </div>
            </nav>
          `
    )}
        <figure>
          <!-- Content for each tab -->
          ${Me(
      n,
      (r, s) => x`
              <div class="tab ${R(this, ye).call(this, s)}">
                <!-- Content slot for each tab -->
                <slot name=${`${r}-content`}>${r}</slot>
              </div>
            `
    )}
        </figure>
      </div>
    `;
  }
}
ye = new WeakMap(), Ye = new WeakMap(), qe = new WeakMap(), // Define static properties for the component
H(po, "properties", {
  actions: { attribute: !1 },
  selectedTab: { state: !0 },
  tabs: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define("eox-layercontrol-tabs", po);
const Qs = `
button,
.button {
  /* TODO: why does this only work here and not from :root? */
  --primary-color: #004170;
  --primary-color-hover: #004170CC;
  --error-color: #FF5252;

  display: inline-flex;
  position: relative;
  align-items: center;
  color: #fff;
  border-width: 0;
  outline: none;
  border-radius: 4px;
  padding: 16px;
  height: 36px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1.25px;                           
  font-weight: 500;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  transition-property: box-shadow, transform, opacity, background;
  transition-duration: 0.28s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover:not([disabled]):not(.icon),
.button:hover:not([disabled]):not(.icon) {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  background: var(--primary-color-hover);
}

button, button:active,
.button, .button:active {
  background: var(--primary-color);
}

button[disabled],
.button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

button.outline,
.button.outline {
  background: transparent;
  box-shadow: none;
  color: var(--primary-color);
  outline: 1px solid var(--primary-color);
}

button.outline:hover,
.button.outline:hover {
  background: transparent;
}

button.icon,
.button.icon {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-indent: -9999px;
}

button.icon-text,
.button.icon-text {
  text-indent: 26px;
}

button.icon:before, button.icon-text:before,
.button.icon:before, .button.icon-text:before {
  position: absolute;
  text-indent: 0;
  line-height: initial;
}

button.icon:before,
.button.icon:before {
  width: 24px;
  height: 24px;
  margin-right: 0;
}

button.icon-text:before,
.button.icon-text:before {
  width: 18px;
  height: 18px;
}

button.small,
.button.small {
  height: 28px;
  padding: 12.4px;
  font-size: .75rem;
}

button.smallest.icon, 
button.smallest.icon::before {
  height: 16px;
  width: 16px;
  padding: 0px;
}
`, ta = `
input[type=radio] {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 24px;
  height: 24px;
}

label span {
  font-size: small;
}

input[type=radio]:after {
  display: block;
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Eradiobox-blank%3C/title%3E%3Cpath d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' /%3E%3C/svg%3E");
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
input[type=radio]:checked:after {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Eradiobox-marked%3C/title%3E%3Cpath d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z' /%3E%3C/svg%3E");

}
`, fo = `
input[type=checkbox] {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 24px;
  height: 24px;
}
input[type=checkbox]:after {
  display: block;
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Echeckbox-blank-outline%3C/title%3E%3Cpath d='M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z' /%3E%3C/svg%3E");
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
input[type=checkbox]:checked:after {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Echeckbox-marked%3C/title%3E%3Cpath d='M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z' /%3E%3C/svg%3E");

}
`, ea = `
input[type="range"] {
  -webkit-appearance: none;
  width: 90%;
  margin-left: 5%;
  height: 6px;
  border-radius: 5px;
  background: #d7dcdf;
  outline: none;
  padding: 0;
}
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}
.range-slider {
  margin: 60px 0 0 0;
}
.range-slider {
  width: 100%;
}
input[type="range"]::-webkit-slider-thumb:hover {
  background: #00416F;
}
input[type="range"]:active::-webkit-slider-thumb {
  background: #00416F;
}
input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border: 0;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}
input[type="range"]::-moz-range-thumb:hover {
  background: #00416F;
}
input[type="range"]:active::-moz-range-thumb {
  background: #00416F;
}
input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px #fff0, 0 0 0 6px #00416F00;
}
.range-slider__value {
  display: inline-block;
  position: relative;
  width: 60px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: #2c3e50;
  padding: 5px 10px;
  margin-left: 8px;
}
.range-slider__value:after {
  position: absolute;
  top: 8px;
  left: -7px;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-right: 7px solid #2c3e50;
  border-bottom: 7px solid transparent;
  content: '';
}

input::-moz-focus-inner, input::-moz-focus-outer {
  border: 0;
}
`;
var We, Ge;
class go extends et {
  constructor() {
    super();
    // Initializes '_removeButton' invoking 'removeButton' function with 'this' context.
    H(this, "_removeButton", () => Ps(this));
    // Initializes '_sortButton' invoking 'sortButton' function with 'unstyled' property as a parameter.
    H(this, "_sortButton", () => Os(this.unstyled));
    /**
     * Initializes '_button' as a function accepting 'tool' parameter to generate a Button.
     * Uses 'this.unstyled' as a context parameter for Button generation.
     *
     * @param {string} tool - Tool parameter for Button generation.
     * @returns {import("lit").HTMLTemplateResult} - The generated Button element.
     */
    H(this, "_button", (n) => Ts(n, this.unstyled));
    $(this, We, "");
    $(this, Ge, `
    ${Qs}  
    ${ta}
    ${fo}
    ${ea}
    .drag-handle {
      cursor: n-resize;
    }
    .single-action-container,
    details.tools {
      position: relative;
    }
    eox-layercontrol-layer details summary::before {
      content: "";
    }
    details.tools[open] {
      /*border-top: 1px solid #0041703a;*/
    }
    .single-action {
      position: relative;
    }
    details.tools summary .icon {
      pointer-events: none;
    }
    .single-action,
    details.tools summary {
      position: absolute;
      right: 0;
      top: -24px;
      display: flex;
      border-radius: 4px;
      cursor: pointer;
    }
    .single-action .icon::before,
    details.tools summary .icon::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Edots-vertical%3C/title%3E%3Cpath d='M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z' /%3E%3C/svg%3E");
    }
    .single-action,
    details.tools summary,
    eox-layercontrol-tabs button.icon {
      transition: opacity .2s;
    }
    .single-action,
    details.tools summary {
      opacity: .5;
    }
    eox-layercontrol-tabs button.icon {
      opacity: .7;
    }
    .single-action:hover,
    details.tools summary:hover,
    eox-layercontrol-tabs button.icon:hover {
      opacity: 1;
    }
    .tools-placeholder,
    .single-action .icon,
    .single-action .icon::before,
    details.tools summary .icon,
    details.tools summary .icon::before {
      height: 16px;
      width: 16px;
    }
    eox-layercontrol-tabs button.icon,
    eox-layercontrol-tabs .button.icon {
      display: flex;
      justify-content: center;
    }
    eox-layercontrol-tabs button.icon::before,
    eox-layercontrol-tabs .button.icon::before {
      width: 16px;
      height: 16px;
    }
    details.tools summary .info-icon,
    button.icon[slot=info-icon]::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Einformation-outline%3C/title%3E%3Cpath d='M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z' /%3E%3C/svg%3E");
    }
    details.tools summary .opacity-icon,
    button.icon[slot=opacity-icon]::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Eopacity%3C/title%3E%3Cpath d='M17.66,8L12,2.35L6.34,8C4.78,9.56 4,11.64 4,13.64C4,15.64 4.78,17.75 6.34,19.31C7.9,20.87 9.95,21.66 12,21.66C14.05,21.66 16.1,20.87 17.66,19.31C19.22,17.75 20,15.64 20,13.64C20,11.64 19.22,9.56 17.66,8M6,14C6,12 6.62,10.73 7.76,9.6L12,5.27L16.24,9.65C17.38,10.77 18,12 18,14H6Z' /%3E%3C/svg%3E");
    }
    details.tools summary .config-icon,
    button.icon[slot=config-icon]::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Etune%3C/title%3E%3Cpath d='M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z' /%3E%3C/svg%3E");
    }
    .single-action .remove-icon::before,
    [slot=remove-icon] button.icon::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ff0000' viewBox='0 0 24 24'%3E%3Ctitle%3Edelete-outline%3C/title%3E%3Cpath d='M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z' /%3E%3C/svg%3E");
    }
    .single-action .sort-icon::before,
    [slot=sort-icon] .button.icon::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Edrag-horizontal-variant%3C/title%3E%3Cpath d='M21 11H3V9H21V11M21 13H3V15H21V13Z' /%3E%3C/svg%3E");
    }
    [slot=info-content],
    [slot=opacity-content] {
      padding: 12px 6px;
    }
  `);
    this.layer = null, this.tools = [], this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  render() {
    var l;
    const n = As(this.tools, this.layer), i = Cs(this.tools, this.layer), o = this[`_${n == null ? void 0 : n[0]}Button`] ? (
      // @ts-ignore
      this[`_${n == null ? void 0 : n[0]}Button`]()
    ) : T, r = ((l = this.tools) == null ? void 0 : l.length) === 1 ? `${this.tools[0]}-icon` : "", s = n == null ? void 0 : n.length, a = i == null ? void 0 : i.length;
    return x`
      <style>
        ${R(this, We)}
        ${!this.unstyled && R(this, Ge)}
      </style>
      ${ot(
      s + a > 0,
      () => x`
          ${ot(
        s === 1 && a === 0,
        () => x`
              <div class="single-action-container">
                <div class="single-action">${o}</div>
              </div>
            `,
        () => {
          var u;
          return x`
              <details
                class="tools"
                open=${this.layer.get("layerControlToolsExpand") || T}
              >
                <summary>
                  <button class="icon ${r}">Tools</button>
                </summary>
                <eox-layercontrol-tabs
                  .noShadow=${!1}
                  .actions=${n}
                  .tabs=${i}
                  .unstyled=${this.unstyled}
                >
                  <!-- Rendering tabs and content -->
                  ${Me(i, (c) => this._button(c))}

                  <div slot="info-content">
                    ${Rs(this.layer.get("description"))}
                  </div>
                  <div slot="opacity-content">
                    <!-- Input for opacity -->
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value=${uo((u = this.layer) == null ? void 0 : u.getOpacity())}
                      @input=${(c) => this.layer.setOpacity(parseFloat(c.target.value))}
                    />
                  </div>
                  <div slot="config-content">
                    <!-- Layer configuration -->
                    ${ot(
            this.layer.get("layerConfig"),
            () => x`
                        <eox-layercontrol-layerconfig
                          slot="config-content"
                          .layer=${this.layer}
                          .noShadow=${!0}
                          .layerConfig=${this.layer.get("layerConfig")}
                          .unstyled=${this.unstyled}
                          @changed=${() => this.requestUpdate()}
                        ></eox-layercontrol-layerconfig>
                      `
          )}
                  </div>
                  <div slot="remove-icon">${this._removeButton()}</div>
                  <div slot="sort-icon">${this._sortButton()}</div>
                </eox-layercontrol-tabs>
              </details>
            `;
        }
      )}
        `
    )}
    `;
  }
}
We = new WeakMap(), Ge = new WeakMap(), // Define static properties for the component
H(go, "properties", {
  layer: { attribute: !1 },
  tools: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define(
  "eox-layercontrol-layer-tools",
  go
);
const na = (e) => {
  const t = () => {
    const n = Ss(
      e.layer,
      e.map,
      e.showLayerZoomState
    );
    let i = !1;
    !n && e.currLayerVisibilityBasedOnZoom ? (e.currLayerVisibilityBasedOnZoom = !1, i = !0) : n && !e.currLayerVisibilityBasedOnZoom && (e.currLayerVisibilityBasedOnZoom = !0, i = !0), i && (e.requestUpdate(), e.dispatchEvent(
      new CustomEvent("change:resolution", { bubbles: !0 })
    ));
  };
  so(
    e.layer,
    e.showLayerZoomState
  ) && (t(), e.map.getView().on("change:resolution", () => t()));
}, ia = (e, t) => {
  const n = t.layer;
  n.setVisible(e.target.checked), e.target.checked && n.get("layerControlExclusive") && t.parentNode.parentNode.querySelectorAll(
    "li > eox-layercontrol-layer"
  ).forEach((o) => {
    var r;
    o.layer !== n && ((r = o.layer) != null && r.get("layerControlExclusive")) && (o.layer.setVisible(!1), o.requestUpdate());
  }), t.dispatchEvent(
    new CustomEvent("changed", { bubbles: !0, detail: n })
  ), t.requestUpdate();
};
var Ft, Ie, Je, yo, Ke, Qe;
class mo extends et {
  constructor() {
    super();
    /**
     * Private method to get layer property by key if available.
     *
     * @param {string} key - The key for the layer property.
     * @returns {any} - The value of the layer property if exists, otherwise undefined.
     */
    $(this, Ft);
    /**
     * Handles the click event on the input element triggering the method.
     *
     * @param {{target: { checked: boolean }}} evt - The input change event.
     */
    $(this, Je);
    /**
     * Represents the current layer visibility based on zoom level.
     *
     * @type {Boolean}
     */
    H(this, "currLayerVisibilityBasedOnZoom", !0);
    $(this, Ke, "");
    $(this, Qe, `
    ${fo}
    eox-layercontrol-layer {
      width: 100%;
    }
    .layer.zoom-state-invisible {
      background: #d2e2ee;
      opacity: 0.3;
    }
    .layer {
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
    }
    label, span {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    [data-type] .title::before {
      width: 20px;
      min-width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    [data-type=group] .title::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230041703a' viewBox='0 0 24 24'%3E%3Ctitle%3Efolder-outline%3C/title%3E%3Cpath d='M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z' /%3E%3C/svg%3E");
    }
    [data-type=group] > eox-layercontrol-layer-group > details[open] > summary > eox-layercontrol-layer > .layer > label > .title::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230041703a' viewBox='0 0 24 24'%3E%3Ctitle%3Efolder-open-outline%3C/title%3E%3Cpath d='M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z' /%3E%3C/svg%3E");
    }
    [data-type=raster] .title::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230041703a' viewBox='0 0 24 24'%3E%3Ctitle%3Echeckerboard%3C/title%3E%3Cpath d='M2 2V22H22V2H2M20 12H16V16H20V20H16V16H12V20H8V16H4V12H8V8H4V4H8V8H12V4H16V8H20V12M16 8V12H12V8H16M12 12V16H8V12H12Z' /%3E%3C/svg%3E");
    }
    [data-type=vector] .title::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230041703a' viewBox='0 0 24 24'%3E%3Ctitle%3Eshape-outline%3C/title%3E%3Cpath d='M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z' /%3E%3C/svg%3E");
    }
    [data-type=draw] .title::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230041703a' viewBox='0 0 24 24'%3E%3Ctitle%3Evector-square-edit%3C/title%3E%3Cpath d='M22.7 14.4L21.7 15.4L19.6 13.3L20.6 12.3C20.8 12.1 21.2 12.1 21.4 12.3L22.7 13.6C22.9 13.8 22.9 14.1 22.7 14.4M13 19.9L19.1 13.8L21.2 15.9L15.1 22H13V19.9M11 19.9V19.1L11.6 18.5L12.1 18H8V16H6V8H8V6H16V8H18V12.1L19.1 11L19.3 10.8C19.5 10.6 19.8 10.4 20.1 10.3V8H22.1V2H16.1V4H8V2H2V8H4V16H2V22H8V20L11 19.9M18 4H20V6H18V4M4 4H6V6H4V4M6 20H4V18H6V20Z' /%3E%3C/svg%3E");
    }
  `);
    this.layer = null, this.map = null, this.titleProperty = "title", this.showLayerZoomState = !1, this.tools = [], this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Check and update layer zoom visibility at beginning
   * and register "change:resolution" ones at the beginning if `showLayerZoomState` is present
   */
  firstUpdated() {
    na(this);
  }
  /**
   * Renders layer controls and tools with conditional display based on certain properties.
   * Conditionally renders layer visibility controls, title, and tools for the layer based on availability and settings.
   * Styles are applied conditionally based on the 'unstyled' property.
   */
  render() {
    var l;
    const n = this.layer.getVisible(), i = n ? "visible" : "", o = this.currLayerVisibilityBasedOnZoom ? "" : "zoom-state-invisible", r = U(this, Ft, Ie).call(this, "layerControlDisable") ? "disabled" : "", s = U(this, Ft, Ie).call(this, "layerControlExclusive") ? "radio" : "checkbox", a = ((l = this.tools) == null ? void 0 : l.length) > 0;
    return x`
      <style>
        ${R(this, Ke)}
        ${!this.unstyled && R(this, Qe)}
      </style>
      ${ot(
      this.layer,
      () => x`
          <!-- Render the layer -->
          <div class="layer ${i} ${o}">
            <label class="drag-handle ${r}">
              <!-- Input element for layer visibility -->
              <input
                type=${s}
                .checked=${uo(n)}
                @click=${U(this, Je, yo)}
              />

              <!-- Layer title -->
              <span class="title">${U(this, Ft, Ie).call(this, this.titleProperty)}</span>
              ${ot(
        a,
        () => x`<span class="tools-placeholder"></span>`
      )}
            </label>
          </div>

          <!-- Render layer tools -->
          <eox-layercontrol-layer-tools
            .noShadow=${!0}
            .layer=${this.layer}
            .tools=${this.tools}
            .unstyled=${this.unstyled}
          ></eox-layercontrol-layer-tools>
        `
    )}
    `;
  }
}
Ft = new WeakSet(), Ie = function(n) {
  var i;
  return (i = this.layer) == null ? void 0 : i.get(n);
}, Je = new WeakSet(), yo = function(n) {
  ia(n, this);
}, Ke = new WeakMap(), Qe = new WeakMap(), // Define static properties for the component
H(mo, "properties", {
  layer: { attribute: !1 },
  map: { attribute: !1, state: !0 },
  titleProperty: { attribute: "title-property", type: String },
  showLayerZoomState: { attribute: "show-layer-zoom-state", type: Boolean },
  tools: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define("eox-layercontrol-layer", mo);
var tn, en;
class bo extends et {
  constructor() {
    super();
    $(this, tn, "");
    $(this, en, `
    details summary {
      cursor: pointer;
      display: flex;
    }
    details summary { list-style-type: none; } /* Firefox */
    details summary::-webkit-details-marker { display: none; } /* Chrome */
    details summary::marker { display: none; }
    details summary::before {
      display: block;
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23004170' viewBox='0 0 24 24'%3E%3Ctitle%3Echevron-right%3C/title%3E%3Cpath d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' /%3E%3C/svg%3E");
      font-size: 13px;
      width: 24px;
      height: 24px;
      margin: 4px 0;
      transform-origin: center;
      transition: transform 0.1s ease-in-out;
    }
    details[open] > summary:before {
      transform: rotate(90deg);
    }
    details[data-children-length="0"] summary::before {
      display: none;
    }
  `);
    this.group = null, this.idProperty = "id", this.map = null, this.titleProperty = "title", this.showLayerZoomState = !1, this.tools = [], this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides the default behavior of creating the render root element.
   * If 'noShadow' is set to true, returns 'this'; otherwise, falls back to the default behavior
   * of creating a shadow root using 'super.createRenderRoot()'.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders a layer control group with expandable details containing layers.
   */
  render() {
    var o, r;
    const n = !!((o = this.group) != null && o.get("layerControlExpand")), i = (r = lo(
      this.group.getLayers()
    )) == null ? void 0 : r.length;
    return x`
      <style>
        ${R(this, tn)}
        ${!this.unstyled && R(this, en)}
      </style>
      ${ot(
      this.group,
      () => x`
          <!-- Render the details element with the layer control -->
          <details
            open=${n || T}
            data-children-length=${i}
          >
            <summary>
              <!-- Render the layer control within the summary -->
              <eox-layercontrol-layer
                .noShadow=${!0}
                .layer=${this.group}
                .map=${this.map}
                .titleProperty=${this.titleProperty}
                .showLayerZoomState=${this.showLayerZoomState}
                .tools=${this.tools}
                .unstyled=${this.unstyled}
                @changed=${() => this.requestUpdate()}
              ></eox-layercontrol-layer>
            </summary>

            <!-- Render the list of layers within the details -->
            <eox-layercontrol-layer-list
              .noShadow=${!0}
              .idProperty=${this.idProperty}
              .layers=${this.group.getLayers()}
              .map=${this.map}
              .titleProperty=${this.titleProperty}
              .showLayerZoomState=${this.showLayerZoomState}
              .tools=${this.tools}
              .unstyled=${this.unstyled}
              @changed=${() => this.requestUpdate()}
            ></eox-layercontrol-layer-list>
          </details>
        `
    )}
    `;
  }
}
tn = new WeakMap(), en = new WeakMap(), // Define static properties for the component
H(bo, "properties", {
  group: { attribute: !1 },
  idProperty: { attribute: "id-property" },
  map: { attribute: !1, state: !0 },
  titleProperty: { attribute: "title-property", type: String },
  showLayerZoomState: { attribute: "show-layer-zoom-state", type: Boolean },
  tools: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define(
  "eox-layercontrol-layer-group",
  bo
);
const oa = (e) => {
  const { layers: t, idProperty: n, titleProperty: i, renderRoot: o } = e;
  if (t) {
    const r = o.querySelector("ul");
    xs(
      t,
      n,
      i,
      e
    ), Es(r, t, n, e);
  }
};
var nn, on;
class vo extends et {
  constructor() {
    super();
    $(this, nn, "");
    $(this, on, `
    ul {
      padding: 0;
      margin: 0;
    }
    ul ul {
      padding-left: 48px;
    }
    li {
      list-style: none;
    }
    li {
      border-bottom: 1px solid #0041703a;
    }
    li:first-child {
      border-top: 1px solid #0041703a;
    }
    li:last-child {
      border: none;
    }
    li.sortable-chosen {
      background: #eeea;
    }
    li.sortable-drag {
      opacity: 0;
    }
    li.sortable-ghost {
    }
  `);
    this.idProperty = "id", this.layers = null, this.map = null, this.tools = void 0, this.titleProperty = "title", this.showLayerZoomState = !1, this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Executes specific logic after the initial render of the component.
   */
  firstUpdated() {
    oa(this);
  }
  /**
   * Executes logic after subsequent updates of the component.
   */
  updated() {
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders a list of layers for the EOx Layer Control component. Filters layers based on control properties and renders either
   * layer groups or individual layers accordingly. Utilizes conditional rendering and iterates through available layers.
   */
  render() {
    const n = lo(this.layers).reverse();
    return x`
      <style>
        ${R(this, nn)}
        ${!this.unstyled && R(this, on)}
      </style>
      <ul>
        ${ot(
      this.layers,
      () => x`
            ${Jo(
        n,
        (i) => i,
        (i) => x`
                <li
                  data-layer="${i.get(this.idProperty)}"
                  data-type="${$s(i, this.map)}"
                >
                  ${/** Checks if the layer is a group or individual layer and renders accordingly */
        /** @type {import("ol/layer").Group} */
        i.getLayers ? x`
                          <eox-layercontrol-layer-group
                            .noShadow=${!0}
                            .group=${i}
                            .idProperty=${this.idProperty}
                            .map=${this.map}
                            .titleProperty=${this.titleProperty}
                            .showLayerZoomState=${this.showLayerZoomState}
                            .tools=${this.tools}
                            .unstyled=${this.unstyled}
                            @changed=${() => this.requestUpdate()}
                          >
                          </eox-layercontrol-layer-group>
                        ` : x`
                          <eox-layercontrol-layer
                            .noShadow=${!0}
                            .layer=${i}
                            .map=${this.map}
                            .titleProperty=${this.titleProperty}
                            .showLayerZoomState=${this.showLayerZoomState}
                            .tools=${this.tools}
                            .unstyled=${this.unstyled}
                            @changed=${() => this.requestUpdate()}
                          ></eox-layercontrol-layer>
                        `}
                </li>
              `
      )}
          `
    )}
      </ul>
    `;
  }
}
nn = new WeakMap(), on = new WeakMap(), // Define static properties for the component
H(vo, "properties", {
  idProperty: { attribute: "id-property" },
  layers: { attribute: !1 },
  map: { attribute: !1, state: !0 },
  titleProperty: { attribute: "title-property", type: String },
  showLayerZoomState: { attribute: "show-layer-zoom-state", type: Boolean },
  tools: { attribute: !1 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define("eox-layercontrol-layer-list", vo);
const ra = (e) => {
  const t = e.querySelector(
    "select[name=optional]"
  ), n = t ? t.value : null, i = Kn(
    e.layers.getArray(),
    "layerControlOptional",
    !0
  ).find(
    (o) => (
      // @ts-ignore
      (o.get(e.idProperty) || o.ol_uid) === n
    )
  );
  i == null || i.set("layerControlOptional", !1), i == null || i.setVisible(!0), e.dispatchEvent(
    new CustomEvent("changed", { bubbles: !0 })
  ), e.renderRoot.parentNode.querySelectorAll("eox-layercontrol-layer-list").forEach(
    (o) => (
      /** @type {import("lit").LitElement} */
      o.requestUpdate()
    )
  ), e.requestUpdate();
};
var rn, Eo;
class wo extends et {
  constructor() {
    super();
    /**
     * Handles the addition of selected layers to a list.
     * Invokes the 'addToListMethod' with the current context.
     */
    $(this, rn);
    this.idProperty = "id", this.layers = null, this.titleProperty = "title", this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides createRenderRoot to handle shadow DOM creation based on the noShadow property.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders a dropdown menu to select optional layers. Filters the layers list based on the 'layerControlOptional' property,
   * generates a dropdown list of filtered layers, and provides a button to add selected layers. Utilizes 'filterLayers' to obtain a filtered list and extracts necessary data for each layer.
   * Generates dropdown options based on the extracted layer information.
   */
  render() {
    const n = Kn(
      this.layers.getArray(),
      "layerControlOptional",
      !0
    );
    return x`
      <!-- Label for the dropdown -->
      <label for="optional">Optional layers</label>

      <!-- Dropdown select element -->
      <select name="optional" data-cy="optionalLayers">
        <!-- Default placeholder option -->
        <option disabled selected value>
          -- select an optional layer to add --
        </option>

        <!-- Mapping through filtered layers list to generate dropdown options -->
        ${n.map((i) => {
      const o = i.get(this.idProperty) || i.ol_uid, r = i.get(this.titleProperty), s = `layer ${i.get(this.idProperty)}`;
      return x` <option value="${o}">${r || s}</option> `;
    })}
      </select>

      <!-- Button to handle adding layers -->
      <button @click="${U(this, rn, Eo)}">add</button>
    `;
  }
}
rn = new WeakSet(), Eo = function() {
  ra(this);
}, // Define static properties for the component
H(wo, "properties", {
  idProperty: { attribute: "id-property" },
  layers: { attribute: !1 },
  titleProperty: { attribute: "title-property", type: String },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define(
  "eox-layercontrol-optional-list",
  wo
);
const sa = (e, t) => {
  t.jsonInput = e.target.value, t.requestUpdate();
}, Si = (e) => {
  const t = JSON.parse(
    `{"data":${Zi(e.jsonInput)}}`
  );
  Array.isArray(t.data) ? t.data.forEach((n) => {
    e.eoxMap.addOrUpdateLayer(n);
  }) : e.eoxMap.addOrUpdateLayer(t.data), e.jsonInput = null, e.requestUpdate();
}, aa = (e, t) => {
  t.urlInput = e.target.value, t.requestUpdate();
};
async function la(e) {
  const t = e.urlInput;
  if (e.wmsCapabilities = null, e.searchLoad = !0, e.requestUpdate(), !t)
    return !1;
  if (qn(t) === "XYZ")
    return { Name: t };
  try {
    const n = await jr(t);
    e.wmsCapabilities = n;
  } catch {
  } finally {
    e.searchLoad = !1, e.requestUpdate();
  }
  return !1;
}
const ua = (e, t) => {
  const { Name: n } = e, i = qn(t.urlInput) || "XYZ", o = {
    type: "Tile",
    properties: {
      id: n,
      title: n
      // Set the title property to the same as id
    },
    source: {
      type: i,
      url: t.urlInput,
      // Set the URL from the instance
      params: {
        LAYERS: n
        // Set the 'LAYERS' parameter to the provided layer 'Name'
      }
    }
  };
  t.jsonInput = JSON.stringify(o);
}, da = (e, t) => {
  t.open = e || null, t.urlInput = null, t.jsonInput = null, t.wmsCapabilities = null, t.requestUpdate();
};
var sn, So, an, $o, be, kn, ln, _o, un, Ao, jt, He, dn, cn;
class xo extends et {
  constructor() {
    super();
    /**
     * Handles changes in the input field by invoking the 'urlInputChangeMethod'.
     * This method is triggered upon an @input change event.
     *
     * @param {Event} evt - The input change event triggering the method.
     */
    $(this, sn);
    /**
     * Asynchronously handles WMS URL search, invokes further processing if data is available.
     */
    $(this, an);
    /**
     * Handles input field changes by triggering layer processing and adding layers.
     *
     * @param {{"Name": string}} layer - The layer information triggering the method.
     */
    $(this, be);
    /**
     * Initiates the addition of layers, triggering the handleAddLayerMethod.
     */
    $(this, ln);
    /**
     * Handles input field changes by invoking the 'handleJsonInputChangeMethod'.
     *
     * @param {{target: { value: string }}} evt - The input change event triggering the method.
     */
    $(this, un);
    /**
     * Handles tab changes by invoking the 'openCloseTabMethod'.
     *
     * @param {"url" | "json" | null} tab - The tab identifier triggering the method.
     */
    $(this, jt);
    /**
     * State for URL Input for WMS/XYZ URLs
     *
     * @type {String}
     */
    H(this, "urlInput", null);
    /**
     * State for JSON Textarea - For EOxMap JSON
     *
     * @type {String}
     */
    H(this, "jsonInput", null);
    /**
     * State for add layer - consist of url/json
     *
     * @type {"url" | "json" | null}
     */
    H(this, "open", null);
    /**
     * Loader state when search is triggered
     *
     * @type {Boolean}
     */
    H(this, "searchLoad", !1);
    /**
     * State for `WMS Capabilities JSON`
     *
     * @type {import("wms-capabilities").WMSCapabilitiesJSON}
     */
    H(this, "wmsCapabilities", null);
    $(this, dn, `
    .eox-add-layer-main .open {
      position: relative;
    }
    .eox-add-layer-main .close {
      display: none;
    }
  `);
    $(this, cn, `
    .eox-add {
      background: #f0f2f5;
      border-top: 1px solid #0041701a;
      padding: 0.5rem;
      font-size: small;
    }
    .eox-add-layer-col, .eox-add-layer-tab {
      display: flex;
      width: 100%;
    }
    .eox-add-layer-main .close {
      display: none;
    }
    .eox-add-layer-main .open {
      position: relative;
    }
    button.icon.add-icon {
      flex-grow: 1;
    }
    .eox-add-layer-tab li {
      border: 0 !important;
      font-size: smaller;
      padding: 0.2rem 0.7rem;
      background: #f0f2f5;
      border-radius: 4px 4px 0px 0px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
    }
    .eox-add-layer-tab li.active {
      background: #204270;
      color: white;
      font-weight: 700;
    }
    .relative {
      position: relative
    }
    .eox-add-layer-col.justify-end {
      justify-content: end;
    }
    .eox-add ul {
      max-height: 120px;
      overflow: scroll;
    }
    .eox-add ul li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.1rem 0.2rem;
    }
    button.icon {
      justify-content: end;
      transition: opacity .2s;
      opacity: .7;
    }
    button.icon:hover {
      opacity: 1;
    }
    button.icon.add-layer-icon::before {
      width: 16px;
      min-width: 16px;
      height: 16px;
    }
    button.icon.add-icon::before {
      width: 18px;
      min-width: 18px;
      height: 18px;
    }
    .add-icon.icon::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath xmlns='http://www.w3.org/2000/svg' d='M17,14H19V17H22V19H19V22H17V19H14V17H17V14M11,16L2,9L11,2L20,9L11,16M11,18.54L12,17.75V18C12,18.71 12.12,19.39 12.35,20L11,21.07L2,14.07L3.62,12.81L11,18.54Z' fill='%23004270'/%3E%3C/svg%3E");
    }
    .add-layer-icon::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Eplus-thick%3C/title%3E%3Cpath fill='%23004270' d='M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z' /%3E%3C/svg%3E");
    }
    .json-add-layer {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Eplus-thick%3C/title%3E%3Cpath fill='white' d='M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z' /%3E%3C/svg%3E");
    }
    .search-icon::after {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Emagnify%3C/title%3E%3Cpath d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' fill='white' /%3E%3C/svg%3E");
    }
    .search-icon::after, .json-add-layer::before {
      width: 14px;
      min-width: 14px;
      height: 14px;
      display:flex
      margin-right: 6px;
      color: white;
    }
    .search-icon, .json-add-layer {
      padding: 4px 6px;
      height: 28px;
      border-radius: 0px 4px 4px 0px;
      box-shadow: none;
    }
    .json-add-layer {
      position: absolute;
      bottom: 16px;
      right: 14px;
      border-radius: 4px;
      height: 24px;
      padding: 4px;
    }
    input.add-url, textarea.add-layer-input {
      box-sizing: border-box !important;
      width: 100%;
      height: 28px;
      padding: 5px 7px !important;
      border: 1px solid #0004 !important;
      font-size: smaller;
      border-radius: 4px 0px 0px 4px;
    }
    textarea.add-layer-input {
      height: 90px;
      resize: none;
      border-radius: 4px;
    }
    .divider {
      margin: 1rem 0px;
      height: 1px;
      border-top: 1.5px solid #00417059;
      text-align: center;
      position: relative;
    }
    .divider span {
      position: relative;
      top: -.6em;
      padding: 0px 0.5rem;
      background: #f0f2f5;
      color: #00417059;
      font-weight: bold;
      display: inline-block;
    }
  `);
    this.eoxMap = null, this.unstyled = !1, this.noShadow = !1;
  }
  /**
   * Overrides the default behavior of creating the render root element.
   * If 'noShadow' is set to true, returns 'this'; otherwise, falls back to the default behavior
   * of creating a shadow root using 'super.createRenderRoot()'.
   */
  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }
  /**
   * Renders the EOx Layer Control component with tabbed interface for URL and JSON.
   * Handles input fields, search, and addition of layers.
   */
  render() {
    const n = this.open ? "open" : "close", i = this.open === "url", o = this.open === "json", r = !zr(this.urlInput) || this.searchLoad ? !0 : T;
    return x`
      <style>
        ${R(this, dn)}
        ${!this.unstyled && R(this, cn)}
      </style>
      <div class="eox-add-layer-main">
        <div class="eox-add-layer-col">
          <!-- Tabbed interface for URL and JSON -->
          <ul class="eox-add-layer-tab ${n}">
            <li
              @click=${() => U(this, jt, He).call(this, "url")}
              class="${i ? "active" : ""}"
            >
              URL
            </li>
            <li
              @click=${() => U(this, jt, He).call(this, "json")}
              class="${o ? "active" : ""}"
            >
              JSON
            </li>
          </ul>

          <!-- Button to toggle tabs -->
          <button
            class="add-icon icon"
            @click=${() => U(this, jt, He).call(this, this.open ? null : "url")}
          >
            ${this.unstyled ? "Add Layer" : ""}
          </button>
        </div>
        <div class="eox-add ${n}">
          ${i ? x`
              <!-- Input field for URL -->
              <div class="eox-add-layer-col">
                <input 
                  type="text" 
                  class="add-url" 
                  placeholder="Add URL (WMS/XYZ)" 
                  .value="${this.urlInput}" 
                  @input=${U(this, sn, So)}
                >
                </input>
                <!-- Search button for URL -->
                <button 
                  class="search-icon" 
                  disabled=${r} 
                  @click=${U(this, an, $o)}
                >
                  ${this.unstyled ? "Search" : ""}
                </button>
              </div>

              <!-- Display layers for WMS capabilities -->
              ${this.wmsCapabilities ? x`<ul class="search-lists">
                      ${this.wmsCapabilities.Capability.Layer.Layer.map(
      (s) => {
        const a = s.Name;
        return x`
                            <li class="search-list">
                              ${a}
                              <!-- Button to add layer -->
                              <button
                                class="add-layer-icon icon"
                                @click=${() => (
          //@ts-ignore
          U(this, be, kn).call(this, s)
        )}
                              >
                                ${this.unstyled ? "+" : ""}
                              </button>
                            </li>
                          `;
      }
    )}
                    </ul>` : T}
            ` : x`
                <!-- Textarea for JSON input -->
                <textarea
                  class="add-layer-input"
                  placeholder="Please put a valid eox-map layer JSON."
                  @input=${U(this, un, Ao)}
                  .value=${this.jsonInput}
                ></textarea>

                <!-- Button to add JSON layer -->
                <button
                  class="add-layer-icon json-add-layer"
                  disabled=${Zr(this.jsonInput) ? T : !0}
                  @click=${U(this, ln, _o)}
                >
                  ${this.unstyled ? "Add JSON" : ""}
                </button>
              `}
        </div>
      </div>
    `;
  }
}
sn = new WeakSet(), So = function(n) {
  aa(n, this);
}, an = new WeakSet(), $o = async function() {
  const n = await la(this);
  n && U(this, be, kn).call(this, n);
}, be = new WeakSet(), kn = function(n) {
  ua(n, this), Si(this);
}, ln = new WeakSet(), _o = function() {
  Si(this);
}, un = new WeakSet(), Ao = function(n) {
  sa(n, this);
}, jt = new WeakSet(), He = function(n) {
  da(n, this);
}, dn = new WeakMap(), cn = new WeakMap(), // Define static properties for the component
H(xo, "properties", {
  eoxMap: { attribute: !1, state: !0 },
  unstyled: { type: Boolean },
  noShadow: { type: Boolean }
});
customElements.define("eox-layercontrol-add-layers", xo);
const ca = (e, t) => {
  if (t.requestUpdate(), e.target.tagName === "EOX-LAYERCONTROL-LAYER-TOOLS") {
    const n = t.renderRoot.querySelector(
      "eox-layercontrol-optional-list"
    );
    n == null || n.requestUpdate();
  }
}, ha = (e) => {
  const t = e.for;
  return document.querySelector(t);
}, pa = (e) => {
  const t = document.querySelector(e.for);
  t && t.map !== e.map && (e.map = t.map);
};
var zt, hn, To, pn;
class Co extends et {
  // Constructor to set default values for properties
  constructor() {
    super();
    /**
     * Event handler for changes in the layer list
     *
     * @param {CustomEvent & {target: Element}} evt
     */
    $(this, hn);
    /**
     * Instance of `eox-map` which is a wrapper for the OL
     *
     * @type {import("../../map/main").EOxMap}
     */
    $(this, zt, void 0);
    $(this, pn, "* { font-family: Roboto, sans-serif; }");
    this.for = "eox-map", this.idProperty = "id", this.map = null, this.titleProperty = "title", this.showLayerZoomState = !1, this.tools = ["info", "opacity", "config", "remove", "sort"], this.addExternalLayers = !1, this.unstyled = !1, this.styleOverride = "";
  }
  /**
   * Called when the component is updated
   */
  updated() {
    pa(this);
  }
  /**
   * Called when the component is first updated
   * Updated #eoxMap after first update.
   */
  firstUpdated() {
    Jt(this, zt, ha(this));
  }
  render() {
    var o, r, s;
    const n = (o = this.map) == null ? void 0 : o.getLayers().getArray(), i = n && ((r = Kn(n, "layerControlOptional", !0)) == null ? void 0 : r.length) > 0;
    return x`
      <style>
        ${!this.unstyled && R(this, pn)}
        ${this.styleOverride}
      </style>

      <!-- Conditional rendering of add layers component -->
      ${ot(
      this.addExternalLayers && ((s = R(this, zt)) == null ? void 0 : s.addOrUpdateLayer),
      () => x`
          <eox-layercontrol-add-layers
            .noShadow=${!0}
            .eoxMap=${R(this, zt)}
            .unstyled=${this.unstyled}
          ></eox-layercontrol-add-layers>
        `
    )}

      <!-- Conditional rendering of layer list component -->
      ${ot(
      this.map,
      () => x`
          <eox-layercontrol-layer-list
            .noShadow=${!0}
            class="layers"
            .idProperty=${this.idProperty}
            .layers=${this.map.getLayers()}
            .map=${this.map}
            .titleProperty=${this.titleProperty}
            .showLayerZoomState=${this.showLayerZoomState}
            .tools=${this.tools}
            .unstyled=${this.unstyled}
            @changed=${U(this, hn, To)}
          ></eox-layercontrol-layer-list>
        `
    )}

      <!-- Conditional rendering of optional list component -->
      ${ot(
      i,
      () => x`
          <eox-layercontrol-optional-list
            .noShadow=${!0}
            .idProperty=${this.idProperty}
            .layers=${this.map.getLayers()}
            .titleProperty=${this.titleProperty}
            @changed=${() => this.requestUpdate()}
          ></eox-layercontrol-optional-list>
        `
    )}
    `;
  }
}
zt = new WeakMap(), hn = new WeakSet(), To = function(n) {
  ca(n, this), this.dispatchEvent(new CustomEvent("layerchange", { detail: n.detail }));
}, pn = new WeakMap(), // Define static properties for the component
H(Co, "properties", {
  for: { type: String },
  idProperty: { attribute: "id-property" },
  map: { attribute: !1, state: !0 },
  titleProperty: { attribute: "title-property", type: String },
  showLayerZoomState: { attribute: "show-layer-zoom-state", type: Boolean },
  tools: { attribute: !1 },
  addExternalLayers: { attribute: !1 },
  unstyled: { type: Boolean },
  styleOverride: { type: String }
});
customElements.define("eox-layercontrol", Co);
export {
  Co as EOxLayerControl
};
