/* eslint-disable */

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zr = globalThis, da = zr.ShadowRoot && (zr.ShadyCSS === void 0 || zr.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lB = Symbol(), U5 = /* @__PURE__ */ new WeakMap();
let EI = class {
  constructor(r, t, n) {
    if (this._$cssResult$ = !0, n !== lB)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = r, this.t = t;
  }
  get styleSheet() {
    let r = this.o;
    const t = this.t;
    if (da && r === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (r = U5.get(t)), r === void 0 && ((this.o = r = new CSSStyleSheet()).replaceSync(this.cssText), n && U5.set(t, r));
    }
    return r;
  }
  toString() {
    return this.cssText;
  }
};
const SI = (e) => new EI(typeof e == "string" ? e : e + "", void 0, lB), CI = (e, r) => {
  if (da)
    e.adoptedStyleSheets = r.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else
    for (const t of r) {
      const n = document.createElement("style"), o = zr.litNonce;
      o !== void 0 && n.setAttribute("nonce", o), n.textContent = t.cssText, e.appendChild(n);
    }
}, j5 = da ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((r) => {
  let t = "";
  for (const n of r.cssRules)
    t += n.cssText;
  return SI(t);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _I, defineProperty: qI, getOwnPropertyDescriptor: TI, getOwnPropertyNames: $I, getOwnPropertySymbols: LI, getPrototypeOf: OI } = Object, Ne = globalThis, I5 = Ne.trustedTypes, RI = I5 ? I5.emptyScript : "", ot = Ne.reactiveElementPolyfillSupport, dr = (e, r) => e, Hr = { toAttribute(e, r) {
  switch (r) {
    case Boolean:
      e = e ? RI : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, r) {
  let t = e;
  switch (r) {
    case Boolean:
      t = e !== null;
      break;
    case Number:
      t = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(e);
      } catch {
        t = null;
      }
  }
  return t;
} }, va = (e, r) => !_I(e, r), M5 = { attribute: !0, type: String, converter: Hr, reflect: !1, hasChanged: va };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ne.litPropertyMetadata ?? (Ne.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class rr extends HTMLElement {
  static addInitializer(r) {
    this._$Ei(), (this.l ?? (this.l = [])).push(r);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(r, t = M5) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(r, t), !t.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(r, n, t);
      o !== void 0 && qI(this.prototype, r, o);
    }
  }
  static getPropertyDescriptor(r, t, n) {
    const { get: o, set: i } = TI(this.prototype, r) ?? { get() {
      return this[t];
    }, set(s) {
      this[t] = s;
    } };
    return { get() {
      return o == null ? void 0 : o.call(this);
    }, set(s) {
      const c = o == null ? void 0 : o.call(this);
      i.call(this, s), this.requestUpdate(r, c, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(r) {
    return this.elementProperties.get(r) ?? M5;
  }
  static _$Ei() {
    if (this.hasOwnProperty(dr("elementProperties")))
      return;
    const r = OI(this);
    r.finalize(), r.l !== void 0 && (this.l = [...r.l]), this.elementProperties = new Map(r.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(dr("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(dr("properties"))) {
      const t = this.properties, n = [...$I(t), ...LI(t)];
      for (const o of n)
        this.createProperty(o, t[o]);
    }
    const r = this[Symbol.metadata];
    if (r !== null) {
      const t = litPropertyMetadata.get(r);
      if (t !== void 0)
        for (const [n, o] of t)
          this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const o = this._$Eu(t, n);
      o !== void 0 && this._$Eh.set(o, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(r) {
    const t = [];
    if (Array.isArray(r)) {
      const n = new Set(r.flat(1 / 0).reverse());
      for (const o of n)
        t.unshift(j5(o));
    } else
      r !== void 0 && t.push(j5(r));
    return t;
  }
  static _$Eu(r, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof r == "string" ? r.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var r;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (r = this.constructor.l) == null || r.forEach((t) => t(this));
  }
  addController(r) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(r), this.renderRoot !== void 0 && this.isConnected && ((t = r.hostConnected) == null || t.call(r));
  }
  removeController(r) {
    var t;
    (t = this._$EO) == null || t.delete(r);
  }
  _$E_() {
    const r = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const n of t.keys())
      this.hasOwnProperty(n) && (r.set(n, this[n]), delete this[n]);
    r.size > 0 && (this._$Ep = r);
  }
  createRenderRoot() {
    const r = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return CI(r, this.constructor.elementStyles), r;
  }
  connectedCallback() {
    var r;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (r = this._$EO) == null || r.forEach((t) => {
      var n;
      return (n = t.hostConnected) == null ? void 0 : n.call(t);
    });
  }
  enableUpdating(r) {
  }
  disconnectedCallback() {
    var r;
    (r = this._$EO) == null || r.forEach((t) => {
      var n;
      return (n = t.hostDisconnected) == null ? void 0 : n.call(t);
    });
  }
  attributeChangedCallback(r, t, n) {
    this._$AK(r, n);
  }
  _$EC(r, t) {
    var i;
    const n = this.constructor.elementProperties.get(r), o = this.constructor._$Eu(r, n);
    if (o !== void 0 && n.reflect === !0) {
      const s = (((i = n.converter) == null ? void 0 : i.toAttribute) !== void 0 ? n.converter : Hr).toAttribute(t, n.type);
      this._$Em = r, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(r, t) {
    var i;
    const n = this.constructor, o = n._$Eh.get(r);
    if (o !== void 0 && this._$Em !== o) {
      const s = n.getPropertyOptions(o), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((i = s.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? s.converter : Hr;
      this._$Em = o, this[o] = c.fromAttribute(t, s.type), this._$Em = null;
    }
  }
  requestUpdate(r, t, n) {
    if (r !== void 0) {
      if (n ?? (n = this.constructor.getPropertyOptions(r)), !(n.hasChanged ?? va)(this[r], t))
        return;
      this.P(r, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(r, t, n) {
    this._$AL.has(r) || this._$AL.set(r, t), n.reflect === !0 && this._$Em !== r && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(r);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const r = this.scheduleUpdate();
    return r != null && await r, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, s] of this._$Ep)
          this[i] = s;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0)
        for (const [i, s] of o)
          s.wrapped !== !0 || this._$AL.has(i) || this[i] === void 0 || this.P(i, this[i], s);
    }
    let r = !1;
    const t = this._$AL;
    try {
      r = this.shouldUpdate(t), r ? (this.willUpdate(t), (n = this._$EO) == null || n.forEach((o) => {
        var i;
        return (i = o.hostUpdate) == null ? void 0 : i.call(o);
      }), this.update(t)) : this._$EU();
    } catch (o) {
      throw r = !1, this._$EU(), o;
    }
    r && this._$AE(t);
  }
  willUpdate(r) {
  }
  _$AE(r) {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var o;
      return (o = n.hostUpdated) == null ? void 0 : o.call(n);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(r)), this.updated(r);
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
  shouldUpdate(r) {
    return !0;
  }
  update(r) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(r) {
  }
  firstUpdated(r) {
  }
}
rr.elementStyles = [], rr.shadowRootOptions = { mode: "open" }, rr[dr("elementProperties")] = /* @__PURE__ */ new Map(), rr[dr("finalized")] = /* @__PURE__ */ new Map(), ot == null || ot({ ReactiveElement: rr }), (Ne.reactiveElementVersions ?? (Ne.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vr = globalThis, Gr = vr.trustedTypes, z5 = Gr ? Gr.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, uB = "$lit$", Re = `lit$${(Math.random() + "").slice(9)}$`, cB = "?" + Re, NI = `<${cB}>`, Ke = document, gr = () => Ke.createComment(""), br = (e) => e === null || typeof e != "object" && typeof e != "function", fB = Array.isArray, PI = (e) => fB(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", st = `[ 	
\f\r]`, sr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, H5 = /-->/g, G5 = />/g, Ge = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), V5 = /'/g, W5 = /"/g, pB = /^(?:script|style|textarea|title)$/i, FI = (e) => (r, ...t) => ({ _$litType$: e, strings: r, values: t }), ve = FI(1), Xe = Symbol.for("lit-noChange"), oe = Symbol.for("lit-nothing"), Z5 = /* @__PURE__ */ new WeakMap(), Ze = Ke.createTreeWalker(Ke, 129);
function dB(e, r) {
  if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return z5 !== void 0 ? z5.createHTML(r) : r;
}
const BI = (e, r) => {
  const t = e.length - 1, n = [];
  let o, i = r === 2 ? "<svg>" : "", s = sr;
  for (let c = 0; c < t; c++) {
    const u = e[c];
    let p, v, h = -1, y = 0;
    for (; y < u.length && (s.lastIndex = y, v = s.exec(u), v !== null); )
      y = s.lastIndex, s === sr ? v[1] === "!--" ? s = H5 : v[1] !== void 0 ? s = G5 : v[2] !== void 0 ? (pB.test(v[2]) && (o = RegExp("</" + v[2], "g")), s = Ge) : v[3] !== void 0 && (s = Ge) : s === Ge ? v[0] === ">" ? (s = o ?? sr, h = -1) : v[1] === void 0 ? h = -2 : (h = s.lastIndex - v[2].length, p = v[1], s = v[3] === void 0 ? Ge : v[3] === '"' ? W5 : V5) : s === W5 || s === V5 ? s = Ge : s === H5 || s === G5 ? s = sr : (s = Ge, o = void 0);
    const T = s === Ge && e[c + 1].startsWith("/>") ? " " : "";
    i += s === sr ? u + NI : h >= 0 ? (n.push(p), u.slice(0, h) + uB + u.slice(h) + Re + T) : u + Re + (h === -2 ? c : T);
  }
  return [dB(e, i + (e[t] || "<?>") + (r === 2 ? "</svg>" : "")), n];
};
class yr {
  constructor({ strings: r, _$litType$: t }, n) {
    let o;
    this.parts = [];
    let i = 0, s = 0;
    const c = r.length - 1, u = this.parts, [p, v] = BI(r, t);
    if (this.el = yr.createElement(p, n), Ze.currentNode = this.el.content, t === 2) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = Ze.nextNode()) !== null && u.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes())
          for (const h of o.getAttributeNames())
            if (h.endsWith(uB)) {
              const y = v[s++], T = o.getAttribute(h).split(Re), x = /([.?@])?(.*)/.exec(y);
              u.push({ type: 1, index: i, name: x[2], strings: T, ctor: x[1] === "." ? jI : x[1] === "?" ? II : x[1] === "@" ? MI : Zr }), o.removeAttribute(h);
            } else
              h.startsWith(Re) && (u.push({ type: 6, index: i }), o.removeAttribute(h));
        if (pB.test(o.tagName)) {
          const h = o.textContent.split(Re), y = h.length - 1;
          if (y > 0) {
            o.textContent = Gr ? Gr.emptyScript : "";
            for (let T = 0; T < y; T++)
              o.append(h[T], gr()), Ze.nextNode(), u.push({ type: 2, index: ++i });
            o.append(h[y], gr());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === cB)
          u.push({ type: 2, index: i });
        else {
          let h = -1;
          for (; (h = o.data.indexOf(Re, h + 1)) !== -1; )
            u.push({ type: 7, index: i }), h += Re.length - 1;
        }
      i++;
    }
  }
  static createElement(r, t) {
    const n = Ke.createElement("template");
    return n.innerHTML = r, n;
  }
}
function ar(e, r, t = e, n) {
  var s, c;
  if (r === Xe)
    return r;
  let o = n !== void 0 ? (s = t._$Co) == null ? void 0 : s[n] : t._$Cl;
  const i = br(r) ? void 0 : r._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== i && ((c = o == null ? void 0 : o._$AO) == null || c.call(o, !1), i === void 0 ? o = void 0 : (o = new i(e), o._$AT(e, t, n)), n !== void 0 ? (t._$Co ?? (t._$Co = []))[n] = o : t._$Cl = o), o !== void 0 && (r = ar(e, o._$AS(e, r.values), o, n)), r;
}
class UI {
  constructor(r, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = r, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(r) {
    const { el: { content: t }, parts: n } = this._$AD, o = ((r == null ? void 0 : r.creationScope) ?? Ke).importNode(t, !0);
    Ze.currentNode = o;
    let i = Ze.nextNode(), s = 0, c = 0, u = n[0];
    for (; u !== void 0; ) {
      if (s === u.index) {
        let p;
        u.type === 2 ? p = new kr(i, i.nextSibling, this, r) : u.type === 1 ? p = new u.ctor(i, u.name, u.strings, this, r) : u.type === 6 && (p = new zI(i, this, r)), this._$AV.push(p), u = n[++c];
      }
      s !== (u == null ? void 0 : u.index) && (i = Ze.nextNode(), s++);
    }
    return Ze.currentNode = Ke, o;
  }
  p(r) {
    let t = 0;
    for (const n of this._$AV)
      n !== void 0 && (n.strings !== void 0 ? (n._$AI(r, n, t), t += n.strings.length - 2) : n._$AI(r[t])), t++;
  }
}
class kr {
  get _$AU() {
    var r;
    return ((r = this._$AM) == null ? void 0 : r._$AU) ?? this._$Cv;
  }
  constructor(r, t, n, o) {
    this.type = 2, this._$AH = oe, this._$AN = void 0, this._$AA = r, this._$AB = t, this._$AM = n, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let r = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (r == null ? void 0 : r.nodeType) === 11 && (r = t.parentNode), r;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(r, t = this) {
    r = ar(this, r, t), br(r) ? r === oe || r == null || r === "" ? (this._$AH !== oe && this._$AR(), this._$AH = oe) : r !== this._$AH && r !== Xe && this._(r) : r._$litType$ !== void 0 ? this.$(r) : r.nodeType !== void 0 ? this.T(r) : PI(r) ? this.k(r) : this._(r);
  }
  S(r) {
    return this._$AA.parentNode.insertBefore(r, this._$AB);
  }
  T(r) {
    this._$AH !== r && (this._$AR(), this._$AH = this.S(r));
  }
  _(r) {
    this._$AH !== oe && br(this._$AH) ? this._$AA.nextSibling.data = r : this.T(Ke.createTextNode(r)), this._$AH = r;
  }
  $(r) {
    var i;
    const { values: t, _$litType$: n } = r, o = typeof n == "number" ? this._$AC(r) : (n.el === void 0 && (n.el = yr.createElement(dB(n.h, n.h[0]), this.options)), n);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === o)
      this._$AH.p(t);
    else {
      const s = new UI(o, this), c = s.u(this.options);
      s.p(t), this.T(c), this._$AH = s;
    }
  }
  _$AC(r) {
    let t = Z5.get(r.strings);
    return t === void 0 && Z5.set(r.strings, t = new yr(r)), t;
  }
  k(r) {
    fB(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, o = 0;
    for (const i of r)
      o === t.length ? t.push(n = new kr(this.S(gr()), this.S(gr()), this, this.options)) : n = t[o], n._$AI(i), o++;
    o < t.length && (this._$AR(n && n._$AB.nextSibling, o), t.length = o);
  }
  _$AR(r = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); r && r !== this._$AB; ) {
      const o = r.nextSibling;
      r.remove(), r = o;
    }
  }
  setConnected(r) {
    var t;
    this._$AM === void 0 && (this._$Cv = r, (t = this._$AP) == null || t.call(this, r));
  }
}
class Zr {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(r, t, n, o, i) {
    this.type = 1, this._$AH = oe, this._$AN = void 0, this.element = r, this.name = t, this._$AM = o, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = oe;
  }
  _$AI(r, t = this, n, o) {
    const i = this.strings;
    let s = !1;
    if (i === void 0)
      r = ar(this, r, t, 0), s = !br(r) || r !== this._$AH && r !== Xe, s && (this._$AH = r);
    else {
      const c = r;
      let u, p;
      for (r = i[0], u = 0; u < i.length - 1; u++)
        p = ar(this, c[n + u], t, u), p === Xe && (p = this._$AH[u]), s || (s = !br(p) || p !== this._$AH[u]), p === oe ? r = oe : r !== oe && (r += (p ?? "") + i[u + 1]), this._$AH[u] = p;
    }
    s && !o && this.j(r);
  }
  j(r) {
    r === oe ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, r ?? "");
  }
}
let jI = class extends Zr {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(r) {
    this.element[this.name] = r === oe ? void 0 : r;
  }
};
class II extends Zr {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(r) {
    this.element.toggleAttribute(this.name, !!r && r !== oe);
  }
}
class MI extends Zr {
  constructor(r, t, n, o, i) {
    super(r, t, n, o, i), this.type = 5;
  }
  _$AI(r, t = this) {
    if ((r = ar(this, r, t, 0) ?? oe) === Xe)
      return;
    const n = this._$AH, o = r === oe && n !== oe || r.capture !== n.capture || r.once !== n.once || r.passive !== n.passive, i = r !== oe && (n === oe || o);
    o && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, r), this._$AH = r;
  }
  handleEvent(r) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, r) : this._$AH.handleEvent(r);
  }
}
class zI {
  constructor(r, t, n) {
    this.element = r, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(r) {
    ar(this, r);
  }
}
const lt = vr.litHtmlPolyfillSupport;
lt == null || lt(yr, kr), (vr.litHtmlVersions ?? (vr.litHtmlVersions = [])).push("3.1.2");
const HI = (e, r, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? r;
  let o = n._$litPart$;
  if (o === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = o = new kr(r.insertBefore(gr(), i), i, void 0, t ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class tr extends rr {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const r = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = r.firstChild), r;
  }
  update(r) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(r), this._$Do = HI(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var r;
    super.connectedCallback(), (r = this._$Do) == null || r.setConnected(!0);
  }
  disconnectedCallback() {
    var r;
    super.disconnectedCallback(), (r = this._$Do) == null || r.setConnected(!1);
  }
  render() {
    return Xe;
  }
}
var sB;
tr._$litElement$ = !0, tr.finalized = !0, (sB = globalThis.litElementHydrateSupport) == null || sB.call(globalThis, { LitElement: tr });
const ut = globalThis.litElementPolyfillSupport;
ut == null || ut({ LitElement: tr });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vB = (e) => (r, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(e, r);
  }) : customElements.define(e, r);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const GI = { attribute: !0, type: String, converter: Hr, reflect: !1, hasChanged: va }, VI = (e = GI, r, t) => {
  const { kind: n, metadata: o } = t;
  let i = globalThis.litPropertyMetadata.get(o);
  if (i === void 0 && globalThis.litPropertyMetadata.set(o, i = /* @__PURE__ */ new Map()), i.set(t.name, e), n === "accessor") {
    const { name: s } = t;
    return { set(c) {
      const u = r.get.call(this);
      r.set.call(this, c), this.requestUpdate(s, u, e);
    }, init(c) {
      return c !== void 0 && this.P(s, void 0, e), c;
    } };
  }
  if (n === "setter") {
    const { name: s } = t;
    return function(c) {
      const u = this[s];
      r.call(this, c), this.requestUpdate(s, u, e);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function Ee(e) {
  return (r, t) => typeof t == "object" ? VI(e, r, t) : ((n, o, i) => {
    const s = o.hasOwnProperty(i);
    return o.constructor.createProperty(i, s ? { ...n, wrapped: !0 } : n), s ? Object.getOwnPropertyDescriptor(o, i) : void 0;
  })(e, r, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function hB(e) {
  return Ee({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* lr(e, r) {
  if (e !== void 0) {
    let t = 0;
    for (const n of e)
      yield r(n, t++);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ur(e, r, t) {
  return e ? r(e) : t == null ? void 0 : t(e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const WI = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, ZI = (e) => (...r) => ({ _$litDirective$: e, values: r });
let JI = class {
  constructor(r) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(r, t, n) {
    this._$Ct = r, this._$AM = t, this._$Ci = n;
  }
  _$AS(r, t) {
    return this.update(r, t);
  }
  update(r, t) {
    return this.render(...t);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ca = class extends JI {
  constructor(r) {
    if (super(r), this.it = oe, r.type !== WI.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r) {
    if (r === oe || r == null)
      return this._t = void 0, this.it = r;
    if (r === Xe)
      return r;
    if (typeof r != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r === this.it)
      return this._t;
    this.it = r;
    const t = [r];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
};
ca.directiveName = "unsafeHTML", ca.resultType = 1;
const qe = ZI(ca);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mB = Symbol.for(""), KI = (e) => {
  if ((e == null ? void 0 : e.r) === mB)
    return e == null ? void 0 : e._$litStatic$;
}, Or = (e) => ({ _$litStatic$: e, r: mB }), J5 = /* @__PURE__ */ new Map(), XI = (e) => (r, ...t) => {
  const n = t.length;
  let o, i;
  const s = [], c = [];
  let u, p = 0, v = !1;
  for (; p < n; ) {
    for (u = r[p]; p < n && (i = t[p], (o = KI(i)) !== void 0); )
      u += o + r[++p], v = !0;
    p !== n && c.push(i), s.push(u), p++;
  }
  if (p === n && s.push(r[n]), v) {
    const h = s.join("$$lit$$");
    (r = J5.get(h)) === void 0 && (s.raw = s, J5.set(h, r = s)), t = c;
  }
  return e(r, ...t);
}, K5 = XI(ve), YI = (e, r = "property") => e.map(([t, n]) => {
  var i, s;
  if (t === "extent" && ((s = (i = n.value) == null ? void 0 : i.temporal) == null ? void 0 : s.interval.length) > 0) {
    const c = n.value.temporal.interval[0];
    Array.isArray(c) && (typeof c[0] == "string" || typeof c[1] == "string") && (n.formatted = `${new Date(c[0]).toISOString().substring(0, 10)} - ${new Date(c[1]).toISOString().substring(0, 10)}`);
  }
  const o = (c) => Object.entries(c).filter(([u, p]) => {
    let v = !0;
    return p.roles && (v = p.roles.includes("metadata")), p.rel && (v = p.rel === "example"), v;
  });
  return (t === "assets" || t === "links" || t === "providers") && (r === "property" ? n.formatted = `<ul>${o(n.value).map(
    ([c, u]) => `<li>
                <a target="_blank" href="${u.href || u.url}"
                  >${u.name || u.title || c}</a
                >
              </li>`
  ).join("")}</ul>` : r === "featured" && (n.formatted = o(n.value).map(
    ([c, u]) => `<div class="button-container">
                ${u.description ? `<div><p>${u.description}</p></div>` : ""}
                <a class="button icon-text small block" target="_blank" href="${u.href || u.url}"
                  >${u.name || u.title || c}
                  </a>
              </div>`
  ).join(""))), ["providers", "assets", "links"].includes(t) && (n.length = o(n.value).length), [t, n];
}), QI = `
:host {
  display: block;
}
img,
video,
iframe {
  max-width: 100%;
}
`, eM = `
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

button.block,
.button.block {
  display: block;
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

button.icon-text.block,
.button.icon-text.block {
  text-indent: 20px;
}

button.icon:before, button.icon-text:before,
.button.icon:before, .button.icon-text:before {
  position: absolute;
  text-indent: 0;
  line-height: initial;
}

button.icon-text.block:before,
.button.icon-text.block:before {
  text-indent: -54px;
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
`, rM = `
${eM}

:host {
  --color-primary: #004170;
  --color-primary-lighter: color-mix(in srgb, var(--color-primary), #fff 95%);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto;
  line-height: 1.5;
  box-sizing: border-box;
}
img,
video,
iframe {
  max-width: 100%;
}
header,
main,
footer {
  padding: 5px 30px;
}
header {
  background: var(--color-primary-lighter);
}
header h1 {
  font-size: 24px;
  color: var(--color-primary);
}
header h2 {
  font-size: 22px;
  color: var(--color-primary);
}
section#tags ul {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
section#tags li {
  list-style: none;
}
main {
  padding-bottom: 50px;
  flex: 1;
  font-size: small;
}
section#properties ul {
  padding: 0;
}
section#properties > ul:not(.single-property) {
  columns: 2;
  -webkit-columns: 2;
  -moz-columns: 2;
}
section#properties slot > li {
  margin-bottom: 8px;
  break-inside: avoid;
}
section#properties slot:not([name=description]) ul li {
  list-style: none;
}
section#properties .colon {
  margin-right: 4px;
}
section#properties .label {
  font-weight: bold;
}
section#properties ul li,
section#properties ul li ul {
  display: flex;
  flex-wrap: wrap;
}
section#properties ul li ul li:not(:last-child):after {
  content: ",";
  margin-right: 4px;
}
section#featured details > div {
  padding: 10px 12px 20px;
}
section#featured .button-container {
  text-align: center;
  margin-bottom: 24px;
}
section#featured .button-container .button {
  /*height: 14px;*/
  padding: 8px;
  margin: 8px 0;
  height: auto;
  text-decoration: none;
  /*display: block;
  display: flex;
  align-items: center;
  justify-content: center;*/
}
section#featured .button-container .button:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 24 24'%3E%3Ctitle%3Eopen-in-new%3C/title%3E%3Cpath d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z' /%3E%3C/svg%3E");
}
section#featured .button-container > div {
  text-align: left;
}
section#featured .button-container > div > p {
  margin-bottom: 0;
}
footer {
  background: var(--color-primary);
  color: white;
  padding: 10px 30px 20px;
  position: relative;
}
footer a {
  color: white;
}
footer h1 {
  font-size: 14px;
}
footer h2 {
  font-size: 12px;
}
footer .copy {
  background: none;
  border: none;
  position: absolute;
  top: 15px;
  right: 30px;
}
footer .copy:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='-6 -6 36 36'%3E%3Ctitle%3Econtent-copy%3C/title%3E%3Cpath d='M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z' /%3E%3C/svg%3E");
}
dt {
  font-weight: bold;
  text-transform: uppercase;
}
dd dt {
  text-transform: unset;
}
dd, dt {
  margin: 0;
}
dt {
  margin-top: 20px;
}
dd dt {
  margin-top: 8px;
}

/* from eox-itemfilter
TODO harmonize/refactor */
details summary > * {
  display: inline;
}
details summary {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #0002;
  padding: .5rem 0;
}

details > summary::-webkit-details-marker {
  display: none;
}

.title {
  font-size: small;
  align-items: center;
}
details summary .title {
  display: flex;
  font-weight: 500;
}
details summary::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%230009' viewBox='0 0 24 24'%3E%3Ctitle%3Echevron-right%3C/title%3E%3Cpath d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' /%3E%3C/svg%3E");
  height: 24px;
  width: 24px;
}
details[open] summary::before {
  transform: rotate(90deg);
}
section#tags ul>li,
.count {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00417044;
  padding: 0 12px;
  height: 20px;
  border-radius: 10px;
  color: #004170;
  font-weight: 500;
  margin-left: 9px;
}
section#tags ul>li {
  padding: 2px 12px;
  margin: 0 4px 4px 0;
}
`;
var hr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function tM(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function gB(e) {
  if (e.__esModule)
    return e;
  var r = e.default;
  if (typeof r == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    t.prototype = r.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(t, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), t;
}
var ct, X5;
function nr() {
  return X5 || (X5 = 1, ct = {
    locales: [],
    translate: null,
    // function(value: string, vars: array|object = null) : string
    format(r, t = null) {
      if (t)
        for (let n in t)
          r = r.replaceAll(`{${n}}`, t[n]);
      return r;
    }
  }), ct;
}
var ft, Y5;
function Ar() {
  if (Y5)
    return ft;
  Y5 = 1;
  const e = nr(), r = {
    e(t) {
      return typeof t != "string" && (t = String(t)), t.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    },
    t(t, n = null) {
      return typeof e.translate == "function" ? e.translate(t, n) : e.format(t, n);
    },
    toNothing(t = null) {
      return t === null && (t = r.t("n/a")), `<i class="null">${t}</i>`;
    },
    toList(t, n = !1, o = null, i = null) {
      let s = i === !0 ? "ol" : "ul";
      return Array.isArray(t) || (t = [t]), n && (t = t.slice(0), typeof n == "function" ? t.sort(n) : t.sort(), i === null && (s = "ol")), typeof o == "function" && (t = t.map(o)), t.length === 0 ? r.toNothing() : t.length === 1 ? t[0] : `<${s}><li>${t.join("</li><li>")}</li></${s}>`;
    },
    toLink(t, n = "", o = "", i = "_blank") {
      return n || (t.length > 50 ? n = t.replace(/^\w+:\/\/([^\/]+)((\/[^\/\?]+)*\/([^\/\?]+)(\?.*)?)?$/i, function(...s) {
        return s[4] ? s[1] + "​/[…]/​" + s[4] : s[1];
      }) : n = t.replace(/^\w+:\/\//i, "")), `<a href="${r.e(t)}" rel="${r.e(o)}" target="${r.e(i)}">${r.e(n)}</a>`;
    },
    toObject(t, n = null, o = null, i = [], s = null, c = []) {
      let u = "<dl>", p = Array.isArray(i) && i.length >= 2 ? i : Object.keys(t);
      for (let v of p) {
        if (!(v in t) || typeof s == "function" && c.length > 0 && !s(c[0], c.concat([v])))
          continue;
        let h;
        typeof o == "function" ? h = o(v, t) : h = r.formatKey(v, !0);
        let y = t[v];
        typeof n == "function" && (y = n(y, v, t)), u += `<dt>${h}</dt><dd>${y}</dd>`;
      }
      return u += "</dl>", u;
    },
    abbrev(t, n) {
      return `<abbr title="${r.e(n)}">${r.e(t)}</abbr>`;
    },
    isObject(t) {
      return typeof t == "object" && t === Object(t) && !Array.isArray(t);
    },
    formatKey(t, n = !1) {
      if (t.includes("/"))
        return r.e(r.t(t));
      n === !1 && (t = t.replace(/^[\w-]+:/i, ""));
      let o = t.split(/[:_\-\s]/g).map((i) => i.substr(0, 1).toUpperCase() + i.substr(1)).join(" ");
      return r.e(r.t(o));
    },
    hexToUint8(t) {
      if (t.length === 0 || t.length % 2 !== 0)
        throw new Error(`The string "${t}" is not valid hex.`);
      return new Uint8Array(t.match(/.{1,2}/g).map((n) => parseInt(n, 16)));
    },
    uint8ToHex(t) {
      return t.reduce((n, o) => n + o.toString(16).padStart(2, "0"), "");
    },
    keysFromListOfObjects(t) {
      return t.reduce(
        (n, o) => Object.keys(o).reduce(
          (i, s) => (i.indexOf(s) == -1 && i.push(s), i),
          n
        ),
        []
      );
    },
    unit(t, n = "") {
      return typeof n == "string" && n.length > 0 ? (n = r.t(n), `${t}&nbsp;<span class="unit">${n}</unit>`) : t;
    }
  };
  return ft = r, ft;
}
const Rr = Ar(), aM = nr(), pr = {
  fields(e) {
    let r = ["extensions", "metadata", "links", "assets"];
    for (let t of r)
      for (let n in e[t])
        e[t][n] = pr.field(e[t][n], e[t], e);
    return e;
  },
  field(e, r = {}, t = {}) {
    if (typeof e == "string")
      return {
        label: e
      };
    if (typeof e.alias == "string") {
      let n = r[e.alias] || t.metadata[e.alias];
      if (!n)
        throw new Error("Alias is invalid: " + e.alias);
      return Object.assign(e, pr.field(n, r, t));
    }
    if (Rr.isObject(e.items)) {
      let n = [];
      for (let o in e.items)
        e.items[o] = pr.field(e.items[o], r, t), n.push(Object.assign({ key: o }, e.items[o]));
      e.itemOrder = n.sort((o, i) => o.id === !0 ? -1 : i.id === !0 ? 1 : typeof o.order == "number" && typeof i.order == "number" ? o.order - i.order : Rr.t(o.label).localeCompare(Rr.t(i.label), aM.locales)).map((o) => o.key);
    }
    if (Rr.isObject(e.properties))
      for (let n in e.properties)
        e.properties[n] = pr.field(e.properties[n], r, t);
    return e;
  }
};
var nM = pr;
const cr = nM, bB = {
  externalRenderer: !1,
  dependencies: {},
  fields: {
    assets: {},
    extensions: {},
    links: {},
    metadata: {}
  },
  exportFields() {
    return this.fields;
  },
  importFields(e) {
    e = cr.fields(e);
    for (let r in this.fields)
      Object.assign(this.fields[r], e[r]);
  },
  getDependency(e) {
    return this.dependencies[e] || console.warn(`Dependency '${e}' not registered.`), this.dependencies[e];
  },
  addDependency(e, r) {
    this.dependencies[e] = r;
  },
  addExtension(e, r) {
    this.fields.extensions[e] = cr.field(r, this.fields.extensions);
  },
  addMetadataField(e, r) {
    this.fields.metadata[e] = cr.field(r, this.fields.metadata);
  },
  addLinkField(e, r) {
    this.fields.links[e] = cr.field(r, this.fields.links);
  },
  addAssetField(e, r) {
    this.fields.assets[e] = cr.field(r, this.fields.assets);
  },
  addMetadataFields(e) {
    for (var r in e)
      bB.addMetadataField(r, e[r]);
  },
  getExtension(e) {
    return this.fields.extensions[e] ? this.fields.extensions[e] : {};
  },
  getSpecification(e, r = null) {
    let t = {};
    return r === "assets" && this.fields.assets[e] ? t = this.fields.assets[e] : r === "links" && this.fields.links[e] ? t = this.fields.links[e] : this.fields.metadata[e] && (t = this.fields.metadata[e]), t;
  }
};
var ha = bB;
const iM = {
  alternate: "Alternative Access Methods",
  anon: "Anonymized Location",
  card4l: {
    label: "CARD4L",
    explain: "CEOS Analysis Ready Data for Land"
  },
  classification: "Classification",
  contacts: "Contacts",
  cube: "Data Cube",
  esa_cci_lc: "ESA Climate Change Initiative - Land Cover",
  eo: "Electro-Optical",
  forecast: "Forecast",
  file: "File",
  grid: "Gridded Data",
  goes: {
    label: "NOAA GOES",
    explain: "NOAA Geostationary Operational Environmental Satellite"
  },
  label: "Labels / ML",
  language: "Internationalization / Localization",
  mgrs: {
    label: "MGRS",
    explain: "Military Grid Reference System"
  },
  noaa_mrms_qpe: {
    label: "NOAA MRMS QPE",
    explain: "NOAA Multi-Radar Multi-Sensor Quantitative Precipitation Estimation"
  },
  odc: "Open Data Cube",
  order: "Order",
  pc: "Point Cloud",
  processing: "Processing",
  proj: "Projection",
  raster: "Raster Imagery",
  sar: {
    label: "SAR",
    explain: "Synthetic Aperture Radar"
  },
  sat: "Satellite",
  sci: "Scientific",
  ssys: "Solar System",
  stats: "STAC Statistics",
  storage: "Cloud Storage",
  table: "Tabular Data",
  themes: "Themes",
  tiles: "Tiled Assets",
  view: "View Geometry",
  "web-map-links": "Web Maps",
  xarray: "xarray",
  gee: "Google Earth Engine",
  landsat: "Landsat",
  msft: "Microsoft",
  openeo: "openEO",
  pl: "Planet Labs PBC",
  s2: "Sentinel-2",
  sentinel: "Copernicus Sentinel",
  cbers: {
    label: "CBERS",
    explain: "China-Brazil Earth Resources Satellite Program"
  },
  geoadmin: {
    label: "swisstopo",
    explain: "Federal Office of Topography (Switzerland)"
  }
}, oM = {
  href: {
    label: "URL",
    format: "Url"
  },
  hreflang: {
    label: "Language",
    format: "LanguageCode"
  },
  rel: {
    label: "Relation",
    explain: "Based on IANA relation types",
    mapping: {
      self: "This document",
      root: "Root STAC Catalog",
      parent: "Parent STAC Catalog",
      collection: "STAC Collection",
      derived_from: "STAC Item for input data",
      about: "About this resource",
      alternate: "Alternative representation",
      via: "Source metadata",
      next: "Next page",
      prev: "Previous page",
      canonical: "Origin of this document",
      "processing-expression": "Processing inctructions/code",
      "latest-version": "Latest version",
      "predecessor-version": "Predecessor version",
      "successor-version": "Successor version",
      source: "Source data",
      "cite-as": "Citation information",
      related: "Related resource",
      describedby: "Description of the resource",
      "service-desc": "API definitions",
      "service-doc": "API user documentation",
      conformance: "API conformance declaration",
      order: "Order details",
      "3d-tiles": "3D Tiles",
      pmtiles: "PMTiles",
      tilejson: "TileJSON",
      wms: "OGC Web Map Service (WMS)",
      wmts: "OGC Web Map Tile Service (WMTS)",
      xyz: "XYZ Web Map"
    }
  },
  type: {
    label: "File Format",
    explain: "Based on the IANA media (MIME) types",
    format: "MediaType"
  }
}, sM = {
  href: {
    label: "URL",
    format: "Url"
  },
  hreflang: {
    label: "Language",
    format: "LanguageCode"
  },
  type: {
    label: "File Format",
    explain: "Based on the IANA media (MIME) types",
    format: "MediaType"
  },
  roles: {
    label: "Purpose",
    mapping: {
      thumbnail: "Preview",
      overview: "Overview",
      visual: "Visualization",
      data: "Data",
      metadata: "Metadata",
      graphic: "Illustration"
    }
  },
  alternate: {
    label: "Alternatives",
    listWithKeys: !0,
    items: {
      href: {
        label: "URL",
        format: "Url"
      },
      title: {
        alias: "title"
      },
      description: {
        alias: "description"
      }
    },
    summary: !1,
    ext: "alternate"
  },
  "pl:asset_type": "Asset Type",
  "pl:bundle_type": "Bundle Type",
  "table:storage_options": {
    alias: "xarray:storage_options"
  },
  "xarray:open_kwargs": {
    label: "Read Options",
    custom: !0,
    summary: !1
  },
  "xarray:storage_options": {
    label: "fsspec Options",
    custom: !0,
    summary: !1
  }
}, lM = {
  id: "Identifier",
  keywords: "Keywords",
  datetime: {
    label: "Time of Data",
    format: "Timestamp",
    summary: !1
  },
  title: {
    label: "Title",
    summary: !1
  },
  description: {
    label: "Description",
    format: "CommonMark",
    summary: !1
  },
  start_datetime: {
    label: "Time of Data begins",
    format: "Timestamp",
    summary: !1
  },
  end_datetime: {
    label: "Time of Data ends",
    format: "Timestamp",
    summary: !1
  },
  created: {
    label: "Created",
    format: "Timestamp",
    summary: "r"
  },
  updated: {
    label: "Updated",
    format: "Timestamp",
    summary: "r"
  },
  published: {
    label: "Published",
    format: "Timestamp",
    summary: "r"
  },
  expires: {
    label: "Expires",
    format: "Timestamp",
    summary: "r"
  },
  unpublished: {
    label: "Unpublished",
    format: "Timestamp",
    summary: "r"
  },
  license: {
    label: "License",
    format: "License",
    summary: !1
  },
  providers: {
    label: "Providers",
    format: "Providers",
    summary: !1
  },
  platform: "Platform",
  instruments: {
    label: "Instruments",
    format: "CSV"
  },
  constellation: "Constellation",
  mission: "Mission",
  gsd: {
    label: "GSD",
    explain: "Ground Sample Distance",
    unit: "m"
  },
  version: {
    label: "Data Version",
    summary: !1
  },
  deprecated: {
    label: "Deprecated",
    summary: !1
  },
  experimental: {
    label: "Experimental",
    summary: !1
  },
  language: {
    label: "Current Language",
    ext: "language",
    summary: "v",
    properties: {
      name: {
        label: "Name"
      },
      alternate: {
        label: "Alternate Name"
      },
      code: {
        label: "Code"
      },
      dir: {
        label: "Direction",
        explain: "Reading and writing direction",
        mapping: {
          ltr: "left-to-right",
          rtl: "right-to-left"
        },
        default: "ltr"
      }
    }
  },
  languages: {
    label: "Available Languages",
    ext: "language",
    summary: !1,
    items: {
      name: {
        label: "Name",
        sortable: !0,
        order: 0
      },
      alternate: {
        label: "Alternate Name",
        sortable: !0,
        order: 1
      },
      code: {
        label: "Code",
        sortable: !0,
        order: 2
      },
      dir: {
        label: "Direction",
        explain: "Reading and writing direction",
        sortable: !0,
        order: 3,
        mapping: {
          ltr: "left-to-right",
          rtl: "right-to-left"
        },
        default: "ltr"
      }
    }
  },
  contacts: {
    label: "Contacts",
    ext: "contacts",
    summary: "v",
    items: {
      name: {
        label: "Name"
      },
      identifier: {
        label: "Identifier"
      },
      position: {
        label: "Position"
      },
      organization: {
        label: "Organization"
      },
      logo: {
        label: "Logo",
        format: "Image"
      },
      phones: {
        label: "Phone",
        items: {
          value: {
            label: "Number",
            format: "Phone",
            order: 0
          },
          roles: {
            label: "Used For",
            order: 1,
            mapping: {
              work: "Work",
              home: "Personal",
              fax: "Fax"
            }
          }
        }
      },
      emails: {
        label: "Email",
        items: {
          value: {
            label: "Address",
            format: "Email",
            order: 0
          },
          roles: {
            label: "Used For",
            order: 1,
            mapping: {
              work: "Work",
              home: "Personal"
            }
          }
        }
      },
      addresses: {
        label: "Postal Addresses",
        format: "Address",
        items: {
          deliveryPoint: {
            label: "Street / House",
            order: 0
          },
          city: {
            label: "City",
            order: 1
          },
          administrativeArea: {
            label: "State / Province",
            order: 2
          },
          postalCode: {
            label: "Postal Code",
            order: 3
          },
          country: {
            label: "Country",
            order: 4
          }
        }
      },
      links: {
        label: "Additional Resources",
        format: "Link"
      },
      contactInstructions: "Further Instructions",
      roles: {
        label: "Types",
        format: "CSV"
      }
    }
  },
  themes: {
    label: "Themes",
    ext: "themes",
    summary: !1,
    items: {
      scheme: {
        label: "Vocabulary",
        order: 0,
        format: "Url"
      },
      concepts: {
        label: "Terms",
        order: 1,
        format: "Concepts",
        items: {
          id: {
            label: "Identifier",
            order: 0
          },
          title: {
            label: "Title",
            order: 1
          },
          description: {
            label: "Description",
            order: 2
          },
          url: {
            label: "URL",
            order: 3,
            format: "Url"
          }
        }
      }
    }
  },
  crs: {
    label: "CRS",
    format: "CRS",
    explain: "Coordinate Reference System"
  },
  "anon:size": {
    label: "Uncertainty",
    unit: "°",
    explain: "The size of one side of the anonymized bounding box"
  },
  "anon:warning": {
    label: "Warning",
    summary: !1
  },
  "classification:classes": {
    summary: !1,
    label: "Classes",
    items: {
      color_hint: {
        label: "Color",
        order: 0,
        format: "HexColor"
      },
      value: {
        label: "Value",
        order: 1
      },
      title: {
        label: "Title",
        order: 2
      },
      name: {
        label: "Identifier",
        order: 3
      },
      description: {
        label: "Description",
        order: 4,
        format: "CommonMark"
      },
      nodata: {
        label: "No-data value",
        order: 5,
        default: !1
      }
    }
  },
  "classification:bitfields": {
    summary: !1,
    label: "Bit Mask",
    items: {
      name: {
        label: "Name",
        order: 0
      },
      offset: {
        label: "Offset",
        explain: "Offset to the first bit",
        order: 1
      },
      length: {
        label: "Number of bits",
        order: 2
      },
      description: {
        label: "Description",
        order: 3,
        format: "CommonMark"
      },
      classes: {
        alias: "classification:classes"
      },
      roles: {
        label: "Purpose"
      }
    }
  },
  "cube:dimensions": {
    label: "Dimensions",
    summary: !1,
    listWithKeys: !0,
    items: {
      type: {
        label: "Type",
        order: 0
      },
      axis: {
        label: "Axis",
        order: 1
      },
      description: {
        label: "Description",
        format: "CommonMark",
        order: 2
      },
      extent: {
        label: "Extent",
        format: "Extent",
        order: 3
      },
      bbox: {
        alias: "proj:bbox",
        order: 3
      },
      values: {
        label: "Values",
        order: 4
      },
      step: {
        label: "Step",
        order: 5
      },
      unit: {
        alias: "file:unit",
        order: 5
      },
      geometry_types: {
        label: "Geometry Types",
        order: 5
      },
      reference_system: {
        label: "Reference System",
        explain: "Coordinate / Temporal / Other Reference System",
        order: 6
      }
    }
  },
  "cube:variables": {
    label: "Variables",
    summary: !1,
    listWithKeys: !0,
    items: {
      dimensions: {
        label: "Dimensions",
        order: 0
      },
      type: {
        label: "Type",
        order: 1,
        mapping: {
          data: "Measured values",
          auxiliary: "Coordinate data"
        }
      },
      description: {
        label: "Description",
        format: "CommonMark",
        order: 2
      },
      extent: {
        label: "Extent",
        format: "Extent",
        order: 3
      },
      values: {
        label: "Values",
        order: 4
      },
      step: {
        label: "Step",
        order: 5
      },
      unit: {
        alias: "file:unit",
        order: 6
      }
    }
  },
  "eo:bands": {
    label: "Spectral Bands",
    items: {
      name: {
        label: "Name",
        sortable: !0,
        id: !0,
        order: 0
      },
      common_name: {
        label: "Common Name",
        sortable: !0,
        order: 1
      },
      description: {
        label: "Description",
        format: "CommonMark",
        order: 2
      },
      center_wavelength: {
        label: "Wavelength",
        explain: "The center wavelength of the band",
        unit: "μm",
        sortable: !0,
        order: 5
      },
      full_width_half_max: {
        label: "FWHM",
        explain: "Full Width Half Max",
        unit: "μm",
        sortable: !0,
        order: 6
      },
      gsd: {
        alias: "gsd",
        sortable: !0,
        order: 3
      },
      cloud_cover: {
        alias: "eo:cloud_cover",
        sortable: !0,
        order: 4
      },
      solar_illumination: {
        label: "Solar Illumination",
        sortable: !0,
        order: 7,
        unit: "W/m²/μm"
      },
      "classification:classes": {
        alias: "classification:classes"
      },
      "classification:bitfields": {
        alias: "classification:bitfields"
      }
    }
  },
  "eo:cloud_cover": {
    label: "Cloud Cover",
    unit: "%"
  },
  "eo:snow_cover": {
    label: "Snow/Ice Cover",
    unit: "%"
  },
  "forecast:reference_datetime": {
    label: "Reference Time",
    format: "Timestamp",
    summary: "r"
  },
  "forecast:horizon": {
    label: "Forecast Horizon",
    explain: "The time between the reference time and the forecast time",
    format: "Duration",
    summary: "r"
  },
  "forecast:duration": {
    label: "Forecast Length",
    format: "Duration",
    summary: "r"
  },
  "file:bits_per_sample": "Bits per Sample",
  "file:byte_order": "Byte Order",
  "file:checksum": {
    label: "Checksum",
    format: "Checksum",
    summary: !1
  },
  "file:data_type": {
    label: "Data Type of Values",
    format: "FileDataType"
  },
  "file:header_size": {
    label: "Header Size",
    format: "FileSize",
    summary: !1
  },
  "file:nodata": {
    label: "No-Data Values",
    format: "CSV",
    summary: !1
  },
  "file:size": {
    label: "Size",
    format: "FileSize",
    summary: !1
  },
  "file:unit": "Unit of Values",
  "file:values": {
    label: "Map of Values",
    summary: !1,
    items: {
      values: {
        label: "Values",
        format: "CSV",
        order: 1
      },
      summary: {
        label: "Summary",
        order: 0
      }
    }
  },
  "file:local_path": {
    label: "Local Path",
    summary: !1
  },
  "goes:orbital_slot": "Orbital Slot",
  "goes:system_environment": {
    label: "System Environment",
    mapping: {
      OR: "Operational system, real-time data",
      OT: "Operational system, test data",
      IR: "Test system, real-time data",
      IT: "Test system, test data",
      IP: "Test system, playback data",
      IS: "Test system, simulated data"
    }
  },
  "goes:image_type": {
    label: "Area",
    mapping: {
      "FULL DISK": "The Americas (full disk)",
      CONUS: "North America (continental US)",
      MESOSCALE: "Central/South America (mesoscale)"
    }
  },
  "goes:mesoscale_image_number": {
    label: "Area in Central/South America",
    mapping: {
      1: "Region 1",
      2: "Region 2"
    }
  },
  "goes:mode": {
    label: "Capture Mode",
    mapping: {
      3: "3: 1x full disk, 3x continental US, 30x mesoscale region 1, 30x mesoscale region 2 (every 15 minutes)",
      4: "4: 1x full disk (every 5 minutes)",
      6: "6: 1x full disk, 2x continental US, 20x mesoscale region 1, 20x mesoscale region 2 (every 10 minutes)"
    }
  },
  "goes:group_time_threshold": {
    label: "Time Threshold in a Group",
    explain: "Lightning group maximum time difference among lightning events in a group",
    unit: "s"
  },
  "goes:flash_time_threshold": {
    label: "Time Threshold in a Flash",
    explain: "Lightning flash maximum time difference among lightning events in a flash",
    unit: "s"
  },
  "goes:lightning_wavelength": {
    label: "Central Wavelength",
    unit: "nm"
  },
  "goes:yaw_flip_flag": {
    label: "Yaw Flip Configuration",
    explain: "Flag indicating that the spacecraft is operating in yaw flip configuration.",
    mapping: {
      0: "Upright",
      1: "Neither",
      2: "Inverted"
    }
  },
  "goes:event_count": "Lightning Events",
  "goes:group_count": "Lightning Groups",
  "goes:flash_count": "Lightning Flashes",
  "goes:nominal_satellite_subpoint_lat": {
    label: "Satellite Subpoint Latitude",
    unit: "°N"
  },
  "goes:nominal_satellite_subpoint_lon": {
    label: "Satellite Subpoint Longitude",
    unit: "°E"
  },
  "goes:nominal_satellite_height": {
    label: "Satellite Height",
    explain: "Nominal satellite height above GRS 80 ellipsoid",
    unit: "km"
  },
  "goes:percent_navigated_L1b_events": {
    label: "Events navigated by Instrument",
    format: "Percent0to1",
    unit: "%"
  },
  "goes:percent_uncorrectable_L0_errors": {
    label: "Data Lost",
    format: "Percent0to1",
    unit: "%"
  },
  "grid:code": {
    label: "Grid",
    format: "GridCode"
  },
  "raster:bands": {
    label: "Bands",
    items: {
      nodata: {
        alias: "file:nodata"
      },
      sampling: {
        label: "Sampling",
        mapping: {
          area: "Area",
          point: "Point (at pixel center)"
        }
      },
      data_type: {
        alias: "file:data_type"
      },
      bits_per_sample: {
        alias: "file:bits_per_sample"
      },
      spatial_resolution: {
        label: "Resolution",
        explain: "Average spatial resolution",
        unit: "m"
      },
      statistics: {
        label: "Statistics",
        items: {
          mean: "Average",
          maximum: {
            label: "Max.",
            explain: "Maxmimum value"
          },
          minimum: {
            label: "Min.",
            explain: "Minimum value"
          },
          stdev: {
            label: "Std. Dev.",
            explain: "Standard Deviation"
          },
          valid_percent: {
            label: "Valid",
            explain: "Percentage of valid pixels",
            unit: "%"
          }
        }
      },
      unit: {
        alias: "file:unit"
      },
      scale: "Scale",
      offset: "Offset",
      histogram: {
        label: "Histogram",
        custom: !0
      },
      "classification:classes": {
        alias: "classification:classes"
      },
      "classification:bitfields": {
        alias: "classification:bitfields"
      }
    }
  },
  "label:properties": {
    label: "Properties",
    null: "raster data"
  },
  "label:classes": {
    label: "Classes",
    items: {
      name: {
        label: "Name",
        null: "raster-formatted",
        sortable: !0,
        id: !0
      },
      classes: "Classes"
    }
  },
  "label:description": {
    label: "Description",
    format: "CommonMark",
    summary: !1
  },
  "label:type": "Type",
  "label:tasks": "Tasks",
  "label:methods": "Methods",
  "label:overviews": {
    label: "Overviews",
    summary: !1,
    items: {
      property_key: {
        label: "Property Key",
        id: !0
      },
      counts: {
        label: "Counts",
        custom: !0
      },
      statistics: {
        label: "Statistics",
        custom: !0
      }
    }
  },
  "mgrs:latitude_band": "Latitude Band",
  "mgrs:grid_square": "Grid Square",
  "mgrs:utm_zone": "UTM Zone",
  "noaa_mrms_qpe:pass": {
    label: "Pass Number",
    mapping: {
      1: "1 (less latency / less gauges)",
      2: "2 (more latency / more gauges)"
    }
  },
  "noaa_mrms_qpe:period": {
    label: "Accumulation Period",
    unit: "h"
  },
  "noaa_mrms_qpe:region": {
    label: "Region",
    mapping: {
      CONUS: "Continental US",
      HAWAII: "Hawaii",
      GUAM: "Guam",
      ALASKA: "Alaska",
      CARIB: "Caribbean Islands"
    }
  },
  "openeo:status": "Processing Status",
  api_version: {
    label: "API Version",
    ext: "openeo"
  },
  backend_version: {
    label: "Back-End Version",
    ext: "openeo"
  },
  production: {
    label: "Production-Ready",
    ext: "openeo"
  },
  endpoints: {
    label: "Supported Endpoints",
    ext: "openeo",
    summary: !1,
    items: {
      path: {
        label: "Path Template",
        order: 0
      },
      methods: {
        label: "HTTP Methods",
        order: 1,
        format: "CSV"
      }
    }
  },
  billing: {
    label: "Billing",
    ext: "openeo",
    custom: !0,
    summary: !1
  },
  "order:status": {
    label: "Status",
    mapping: {
      orderable: "Orderable (data can be ordered)",
      ordered: "Ordered (preparing to deliver data)",
      pending: "Pending (waiting for activation)",
      shipping: "Shipping (data is getting processed)",
      succeeded: "Delivered (data is available)",
      failed: "Failed (unable to deliver)",
      canceled: "Canceled (delivery stopped)"
    }
  },
  "order:id": "Identifier",
  "order:date": {
    label: "Submitted",
    format: "Timestamp",
    summary: "r"
  },
  "order:expiration_date": {
    alias: "expires"
  },
  "pc:count": {
    label: "Points",
    explain: "Number of Points"
  },
  "pc:type": "Type",
  "pc:encoding": "Format",
  "pc:schemas": {
    label: "Schemas",
    summary: !1,
    items: {
      name: {
        label: "Name",
        sortable: !0,
        id: !0
      },
      size: {
        label: "Size",
        unit: "bytes",
        sortable: !0
      },
      type: {
        label: "Type",
        sortable: !0
      }
    }
  },
  "pc:density": "Density",
  "pc:statistics": {
    label: "Statistics",
    summary: "s",
    items: {
      name: {
        label: "Name",
        id: !0
      },
      position: "Position",
      average: "Average",
      count: "Count",
      maximum: {
        label: "Max.",
        explain: "Maxmimum value"
      },
      minimum: {
        label: "Min.",
        explain: "Minimum value"
      },
      stddev: {
        label: "Std. Dev.",
        explain: "Standard Deviation"
      },
      variance: "Variance"
    }
  },
  "processing:expression": {
    label: "Processing Instructions",
    summary: !1
  },
  "processing:lineage": {
    label: "Lineage",
    format: "CommonMark",
    summary: !1
  },
  "processing:level": "Level",
  "processing:facility": "Facility",
  "processing:software": {
    label: "Software",
    format: "Software",
    summary: !1
  },
  "proj:epsg": {
    label: "EPSG Code",
    format: "EPSG",
    summary: "v"
  },
  "proj:wkt2": {
    label: "WKT2",
    explain: "Well-Known Text, version 2",
    format: "WKT2",
    summary: !1
  },
  "proj:projjson": {
    label: "PROJJSON",
    explain: "JSON encoding of WKT2",
    format: "PROJJSON",
    summary: !1
  },
  "proj:geometry": {
    label: "Footprint",
    custom: !0,
    summary: !1
  },
  "proj:bbox": {
    label: "Bounding Box",
    custom: !0,
    summary: !1
  },
  "proj:centroid": {
    label: "Centroid",
    custom: !0,
    summary: !1
  },
  "proj:shape": {
    label: "Image Dimensions",
    format: "Shape",
    summary: !1
  },
  "proj:transform": {
    label: "Transformation Matrix",
    format: "Transform",
    summary: !1
  },
  "sar:instrument_mode": "Instrument Mode",
  "sar:frequency_band": "Frequency Band",
  "sar:center_frequency": {
    label: "Center Frequency",
    unit: "GHz"
  },
  "sar:polarizations": {
    label: "Polarizations",
    format: "CSV"
  },
  "sar:product_type": "Product Type",
  "sar:resolution_range": {
    label: "Range Resolution",
    unit: "m"
  },
  "sar:resolution_azimuth": {
    label: "Azimuth Resolution",
    unit: "m"
  },
  "sar:pixel_spacing_range": {
    label: "Range Pixel Spacing",
    unit: "m"
  },
  "sar:pixel_spacing_azimuth": {
    label: "Azimuth Pixel Spacing",
    unit: "m"
  },
  "sar:looks_range": "Range Looks",
  "sar:looks_azimuth": "Azimuth Looks",
  "sar:looks_equivalent_number": {
    label: "ENL",
    explain: "Equivalent Number of Looks"
  },
  "sar:observation_direction": "Observation Direction",
  "sat:platform_international_designator": {
    label: "Int. Designator",
    explain: "International designator for the platform, also known as COSPAR ID and NSSDCA ID."
  },
  "sat:orbit_state": "Orbit State",
  "sat:absolute_orbit": {
    label: "Abs. Orbit Number",
    explain: "Absolute Orbit Number"
  },
  "sat:relative_orbit": {
    label: "Rel. Orbit Number",
    explain: "Relative Orbit Number"
  },
  "sat:anx_datetime": {
    label: "ANX Time",
    explain: "Ascending Node Crossing time",
    summary: "r"
  },
  "sci:doi": {
    label: "DOI",
    format: "DOI"
  },
  "sci:citation": "Citation",
  "sci:publications": {
    label: "Publications",
    summary: !1,
    items: {
      citation: {
        label: "Publication",
        sortable: !0,
        order: 0
      },
      doi: {
        label: "DOI",
        format: "DOI",
        sortable: !0,
        order: 1
      }
    }
  },
  "ssys:targets": "Target Body",
  "storage:platform": {
    label: "Provider",
    mapping: {
      ALIBABA: "Alibaba Cloud",
      AWS: "Amazon AWS",
      AZURE: "Microsoft Azure",
      GCP: "Google Cloud Platform",
      IBM: "IBM Cloud",
      ORACLE: "Oracle Cloud"
    }
  },
  "storage:region": "Region",
  "storage:requester_pays": "Requester Pays",
  "storage:tier": "Tier Type",
  "table:columns": {
    label: "Columns",
    items: {
      name: {
        label: "Name",
        sortable: !0,
        id: !0,
        order: 0
      },
      type: {
        label: "Data Type",
        sortable: !0,
        order: 1
      },
      description: {
        label: "Description",
        format: "CommonMark",
        order: 2
      }
    }
  },
  "table:primary_geometry": "Primary Geometry Column",
  "table:row_count": "Rows",
  "table:tables": {
    label: "Tables",
    summary: !1,
    listWithKeys: !0,
    items: {
      name: {
        label: "Name",
        sortable: !0,
        id: !0,
        order: 0
      },
      description: {
        label: "Description",
        format: "CommonMark",
        order: 1
      }
    }
  },
  "tiles:tile_matrix_sets": {
    label: "Tile Matrix Sets",
    custom: !0,
    summary: !1
  },
  "tiles:tile_matrix_set_links": {
    label: "Tile Matrix Set Links",
    custom: !0,
    summary: !1
  },
  "view:off_nadir": {
    label: "Off-Nadir Angle",
    unit: "°"
  },
  "view:incidence_angle": {
    label: "Incidence Angle",
    unit: "°"
  },
  "view:azimuth": {
    label: "Viewing Azimuth",
    unit: "°"
  },
  "view:sun_azimuth": {
    label: "Sun Azimuth",
    unit: "°"
  },
  "view:sun_elevation": {
    label: "Sun Elevation",
    unit: "°"
  },
  "pl:black_fill": {
    label: "Unfilled Image Parts",
    unit: "%"
  },
  "pl:clear_percent": {
    label: "Clear Sky",
    unit: "%"
  },
  "pl:grid_cell": "Grid Cell",
  "pl:ground_control": "Positional Accuracy",
  "pl:ground_control_ratio": "Successful Rectification Ratio",
  "pl:item_type": "Type",
  "pl:pixel_resolution": {
    label: "Spatial Resolution",
    unit: "m"
  },
  "pl:publishing_stage": {
    label: "Publishing Stage",
    mapping: {
      preview: "Preview",
      standard: "Standard",
      finalized: "Finalized"
    }
  },
  "pl:quality_category": {
    label: "Quality Category",
    mapping: {
      standard: "Standard",
      test: "Test"
    }
  },
  "pl:strip_id": "Image Strip ID",
  "gee:type": {
    label: "Type",
    mapping: {
      image: "Single image",
      image_collection: "Image collection",
      table: "Table"
    }
  },
  "gee:cadence": "Cadence",
  "gee:schema": {
    label: "Variables",
    items: {
      name: "Name",
      description: "Description",
      type: "Data Type"
    },
    summary: !1
  },
  "gee:revisit_interval": "Revisit Interval",
  "gee:terms_of_use": {
    label: "Terms of Use",
    format: "CommonMark",
    summary: !1
  },
  "gee:visualizations": {
    label: "Visualizations",
    custom: !0,
    summary: !1
  },
  "landsat:scene_id": "Scene ID",
  "landsat:collection_category": "Collection Category",
  "landsat:collection_number": "Collection Number",
  "landsat:wrs_type": {
    label: "WRS Type",
    explain: "Worldwide Reference System Type"
  },
  "landsat:wrs_path": {
    label: "WRS Path",
    explain: "Worldwide Reference System Path"
  },
  "landsat:wrs_row": {
    label: "WRS Row",
    explain: "Worldwide Reference System Row"
  },
  "landsat:cloud_cover_land": {
    label: "Land Cloud Cover",
    unit: "%"
  },
  "msft:container": "Container",
  "msft:storage_account": "Storage Account",
  "msft:short_description": {
    label: "Summary",
    summary: !1
  },
  "sentinel:utm_zone": "UTM Zone",
  "sentinel:latitude_band": "Latitude Band",
  "sentinel:grid_square": "Grid Square",
  "sentinel:sequence": "Sequence",
  "sentinel:product_id": {
    label: "Product ID",
    summary: "s"
  },
  "sentinel:data_coverage": {
    label: "Data Coverage",
    unit: "%"
  },
  "sentinel:valid_cloud_cover": "Valid Cloud Cover",
  "cbers:data_type": {
    label: "Processing Level",
    explain: "Geolocation precision level",
    mapping: {
      L2: "Geolocation using only satellite telemetry",
      L3: "Control points used to geolocate image, no terrain correction",
      L4: "Control points used to geolocate image, orthorectified"
    },
    summary: "v"
  },
  "cbers:path": "Reference Grid Path",
  "cbers:row": "Reference Grid Row",
  "card4l:specification": {
    label: "Specification",
    mapping: {
      SR: "Surface Reflectance (Optical)",
      ST: "Surface Temperature (Optical)",
      NRB: "Normalized Radar Backscatter (SAR)",
      POL: "Polarimetric Radar (SAR)"
    }
  },
  "card4l:specification_version": "Specification Version",
  "card4l:orbit_mean_altitude": {
    label: "Platform Altitude",
    unit: "m"
  },
  "card4l:incidence_angle_near_range": {
    label: "Incidence Angle (near)",
    unit: "°"
  },
  "card4l:incidence_angle_far_range": {
    label: "Incidence Angle (far)",
    unit: "°"
  },
  "card4l:noise_equivalent_intensity": {
    label: "Noise Equivalent Intensity",
    unit: "dB"
  },
  "card4l:mean_faraday_rotation_angle": {
    label: "Mean Faraday Rotation",
    unit: "°"
  },
  "card4l:speckle_filtering": {
    label: "Speckle Filtering",
    custom: !0,
    summary: !1,
    null: "not applied"
  },
  "card4l:relative_rtc_accuracy": {
    label: "Rel. RTC Accuracy",
    explain: "Relative accuracy of the Radiometric Terrain Correction",
    unit: "dB"
  },
  "card4l:absolute_rtc_accuracy": {
    label: "Abs. RTC Accuracy",
    explain: "Absolute accuracy of the Radiometric Terrain Correction",
    unit: "dB"
  },
  "card4l:northern_geometric_accuracy": {
    label: "Northern Geometric Accuracy",
    unit: "m"
  },
  "card4l:eastern_geometric_accuracy": {
    label: "Eastern Geometric Accuracy",
    unit: "m"
  },
  "card4l:ellipsoidal_height": {
    label: "Ellipsoidal Height",
    unit: "m"
  },
  "geoadmin:variant": {
    label: "Product Variant",
    mapping: {
      krel: "RGB color with relief",
      komb: "RGB color without relief",
      kgrel: "Grayscale with relief",
      kgrs: "Grayscale without relief"
    }
  },
  "href:servers": {
    label: "Servers",
    ext: "web-map-links"
  },
  "pmtiles:layers": {
    label: "Layers",
    ext: "web-map-links"
  },
  "wms:layers": {
    label: "Layers",
    ext: "web-map-links"
  },
  "wms:styles": {
    label: "Styles",
    ext: "web-map-links"
  },
  "wms:dimensions": {
    label: "Dimensions",
    ext: "web-map-links"
  },
  "wms:transparent": {
    label: "Transparency",
    ext: "web-map-links"
  },
  "wmts:layer": {
    label: "Layers",
    ext: "web-map-links"
  },
  "wmts:dimensions": {
    label: "Dimensions",
    ext: "web-map-links"
  }
}, uM = {
  extensions: iM,
  links: oM,
  assets: sM,
  metadata: lM
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var $e = function() {
  return $e = Object.assign || function(r) {
    for (var t, n = 1, o = arguments.length; n < o; n++) {
      t = arguments[n];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (r[i] = t[i]);
    }
    return r;
  }, $e.apply(this, arguments);
}, Je = "\\d+(?:[\\.,]\\d+)?", cM = "(" + Je + "W)", fM = "(" + Je + "Y)?(" + Je + "M)?(" + Je + "D)?", pM = "T(" + Je + "H)?(" + Je + "M)?(" + Je + "S)?", dM = "^P(?:" + cM + "|" + fM + "(?:" + pM + ")?)$", vM = new RegExp(dM), yB = [
  "weeks",
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds"
], wB = {
  years: "Y",
  months: "M",
  days: "D",
  hours: "H",
  minutes: "M",
  seconds: "S",
  weeks: "W"
}, hM = Object.freeze({
  weeks: 0,
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
}), mM = function(e) {
  var r = e.match(vM);
  if (!r)
    throw new Error("Invalid duration string");
  var t = r.slice(1).reduce(function(n, o, i) {
    return n[yB[i]] = parseFloat(o) || 0, n;
  }, {});
  return t;
}, gM = function(e) {
  return e.weeks && e.weeks > 0 ? Object.assign({}, hM, { weeks: e.weeks }) : yB.reduce(function(r, t) {
    var n;
    return $e($e({}, r), (n = {}, n[t] = e[t] || 0, n));
  }, {});
}, ma = {
  locales: {},
  options: {},
  setLocales: function(e, r) {
    this.locales = $e($e({}, this.locales), e), r && (this.options = $e($e({}, this.options), r));
  },
  getLangConfig: function(e) {
    var r = this.locales[e];
    if (!r && this.options.fallbackLocale && (r = this.locales[this.options.fallbackLocale]), !r)
      throw new Error("isoDuration: Translations for language: " + e + " are not provided");
    return r;
  }
}, bM = function(e) {
  for (var r = ["years", "months", "days"], t = "", n = 0, o = r; n < o.length; n++) {
    var i = o[n];
    e[i] && (t += "" + e[i] + wB[i]);
  }
  return t;
}, yM = function(e) {
  for (var r = ["hours", "minutes", "seconds"], t = "", n = 0, o = r; n < o.length; n++) {
    var i = o[n];
    e[i] && (t += "" + e[i] + wB[i]);
  }
  return t;
}, wM = function(e) {
  if (e.weeks > 0)
    return "P" + e.weeks + "W";
  var r = "P", t = bM(e);
  t && (r += t);
  var n = yM(e);
  return n && (r += "T" + n), !t && !n && (r += "0D"), r;
}, DM = function(e, r) {
  var t = ma.getLangConfig(r);
  return e.weeks + " " + t.weeks(e.weeks);
}, xM = function(e, r, t) {
  for (var n = ma.getLangConfig(r), o = "", i = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds"
  ], s = 0, c = 0; c < i.length; c++) {
    var u = i[c], p = e[u];
    if (p && (o !== "" && (o += " "), o += p + " " + n[u](p), s++, t && t.largest && t.largest <= s))
      break;
  }
  return o;
}, kM = function(e, r, t) {
  return e.weeks > 0 ? DM(e, r) : xM(e, r, t);
}, pt = [
  "seconds",
  "minutes",
  "hours",
  "days",
  "months"
], Nr = function(e) {
  return function(r) {
    return {
      nextUnitValue: Math.floor(r / e),
      value: r % e
    };
  };
}, Q5 = function(e, r) {
  return new Date(r, e + 1, 0).getDate();
}, AM = {
  seconds: Nr(60),
  minutes: Nr(60),
  hours: Nr(24),
  days: function(e, r) {
    for (var t = r ? new Date(r.getTime()) : /* @__PURE__ */ new Date(), n = e, o = 0, i = Q5(t.getMonth(), t.getFullYear()); n > i; )
      n = n - i, o++, t.setMonth(t.getMonth() + 1), i = Q5(t.getMonth(), t.getFullYear());
    return {
      nextUnitValue: o,
      value: n
    };
  },
  months: Nr(12)
}, EM = function(e, r) {
  for (var t = $e({}, e), n = 0; n < pt.length; n++) {
    var o = pt[n], i = t[o];
    if (i > 0) {
      var s = AM[o](i, r);
      if (t[o] = s.value, s.nextUnitValue) {
        var c = o === "months" ? "years" : pt[n + 1];
        t[c] = t[c] + s.nextUnitValue;
      }
    }
  }
  return t;
}, eF = (
  /** @class */
  function() {
    function e(r) {
      this.durationObj = r;
    }
    return e.prototype.parse = function() {
      return this.durationObj;
    }, e.prototype.toString = function() {
      return wM(this.durationObj);
    }, e.prototype.humanize = function(r, t) {
      return kM(this.durationObj, r, t);
    }, e.prototype.normalize = function(r) {
      return this.durationObj = EM(this.durationObj, r), this;
    }, e.prototype.isEmpty = function() {
      var r = this;
      return Object.keys(this.durationObj).every(function(t) {
        return r.durationObj[t] === 0;
      });
    }, e;
  }()
);
function SM(e) {
  return e <= 2 ? 0 : e > 2 && e < 11 ? 1 : 0;
}
var CM = {
  years: function(e) {
    return e === 1 ? "سنة" : "سنوات";
  },
  months: function(e) {
    return e === 1 ? "شهر" : "أشهر";
  },
  weeks: function(e) {
    return e === 1 ? "أسبوع" : "أسابيع";
  },
  days: function(e) {
    return e === 1 ? "يوم" : "أيام";
  },
  hours: function(e) {
    return e === 1 ? "ساعة" : "ساعات";
  },
  minutes: function(e) {
    return ["دقيقة", "دقائق"][SM(e)];
  },
  seconds: function(e) {
    return e === 1 ? "ثانية" : "ثواني";
  },
  decimal: ","
};
function fe(e) {
  return Math.floor(e) !== e ? 2 : e % 100 >= 5 && e % 100 <= 20 || e % 10 >= 5 && e % 10 <= 9 || e % 10 === 0 ? 0 : e % 10 === 1 ? 1 : e > 1 ? 2 : 0;
}
var _M = {
  years: function(e) {
    return ["години", "година", "години"][fe(e)];
  },
  months: function(e) {
    return ["месеца", "месец", "месеца"][fe(e)];
  },
  weeks: function(e) {
    return ["седмици", "седмица", "седмици"][fe(e)];
  },
  days: function(e) {
    return ["дни", "ден", "дни"][fe(e)];
  },
  hours: function(e) {
    return ["часа", "час", "часа"][fe(e)];
  },
  minutes: function(e) {
    return ["минути", "минута", "минути"][fe(e)];
  },
  seconds: function(e) {
    return ["секунди", "секунда", "секунди"][fe(e)];
  },
  decimal: ","
}, qM = {
  years: function(e) {
    return "any" + (e === 1 ? "" : "s");
  },
  months: function(e) {
    return "mes" + (e === 1 ? "" : "os");
  },
  weeks: function(e) {
    return "setman" + (e === 1 ? "a" : "es");
  },
  days: function(e) {
    return "di" + (e === 1 ? "a" : "es");
  },
  hours: function(e) {
    return "hor" + (e === 1 ? "a" : "es");
  },
  minutes: function(e) {
    return "minut" + (e === 1 ? "" : "s");
  },
  seconds: function(e) {
    return "segon" + (e === 1 ? "" : "s");
  },
  decimal: ","
};
function De(e) {
  return e === 1 ? 0 : Math.floor(e) !== e ? 1 : e % 10 >= 2 && e % 10 <= 4 && e % 100 < 10 ? 2 : 3;
}
var TM = {
  years: function(e) {
    return ["rok", "roku", "roky", "let"][De(e)];
  },
  months: function(e) {
    return ["měsíc", "měsíce", "měsíce", "měsíců"][De(e)];
  },
  weeks: function(e) {
    return ["týden", "týdne", "týdny", "týdnů"][De(e)];
  },
  days: function(e) {
    return ["den", "dne", "dny", "dní"][De(e)];
  },
  hours: function(e) {
    return ["hodina", "hodiny", "hodiny", "hodin"][De(e)];
  },
  minutes: function(e) {
    return ["minuta", "minuty", "minuty", "minut"][De(e)];
  },
  seconds: function(e) {
    return ["sekunda", "sekundy", "sekundy", "sekund"][De(e)];
  },
  decimal: ","
}, $M = {
  years: function() {
    return "år";
  },
  months: function(e) {
    return "måned" + (e === 1 ? "" : "er");
  },
  weeks: function(e) {
    return "uge" + (e === 1 ? "" : "r");
  },
  days: function(e) {
    return "dag" + (e === 1 ? "" : "e");
  },
  hours: function(e) {
    return "time" + (e === 1 ? "" : "r");
  },
  minutes: function(e) {
    return "minut" + (e === 1 ? "" : "ter");
  },
  seconds: function(e) {
    return "sekund" + (e === 1 ? "" : "er");
  },
  decimal: ","
}, LM = {
  years: function(e) {
    return "Jahr" + (e === 1 ? "" : "e");
  },
  months: function(e) {
    return "Monat" + (e === 1 ? "" : "e");
  },
  weeks: function(e) {
    return "Woche" + (e === 1 ? "" : "n");
  },
  days: function(e) {
    return "Tag" + (e === 1 ? "" : "e");
  },
  hours: function(e) {
    return "Stunde" + (e === 1 ? "" : "n");
  },
  minutes: function(e) {
    return "Minute" + (e === 1 ? "" : "n");
  },
  seconds: function(e) {
    return "Sekunde" + (e === 1 ? "" : "n");
  },
  decimal: ","
}, OM = {
  years: function(e) {
    return "year" + (e === 1 ? "" : "s");
  },
  months: function(e) {
    return "month" + (e === 1 ? "" : "s");
  },
  weeks: function(e) {
    return "week" + (e === 1 ? "" : "s");
  },
  days: function(e) {
    return "day" + (e === 1 ? "" : "s");
  },
  hours: function(e) {
    return "hour" + (e === 1 ? "" : "s");
  },
  minutes: function(e) {
    return "minute" + (e === 1 ? "" : "s");
  },
  seconds: function(e) {
    return "second" + (e === 1 ? "" : "s");
  },
  decimal: "."
}, RM = {
  years: function(e) {
    return "año" + (e === 1 ? "" : "s");
  },
  months: function(e) {
    return "mes" + (e === 1 ? "" : "es");
  },
  weeks: function(e) {
    return "semana" + (e === 1 ? "" : "s");
  },
  days: function(e) {
    return "día" + (e === 1 ? "" : "s");
  },
  hours: function(e) {
    return "hora" + (e === 1 ? "" : "s");
  },
  minutes: function(e) {
    return "minuto" + (e === 1 ? "" : "s");
  },
  seconds: function(e) {
    return "segundo" + (e === 1 ? "" : "s");
  },
  decimal: ","
}, NM = {
  years: function(e) {
    return "aasta" + (e === 1 ? "" : "t");
  },
  months: function(e) {
    return "kuu" + (e === 1 ? "" : "d");
  },
  weeks: function(e) {
    return "nädal" + (e === 1 ? "" : "at");
  },
  days: function(e) {
    return "päev" + (e === 1 ? "" : "a");
  },
  hours: function(e) {
    return "tund" + (e === 1 ? "" : "i");
  },
  minutes: function(e) {
    return "minut" + (e === 1 ? "" : "it");
  },
  seconds: function(e) {
    return "sekund" + (e === 1 ? "" : "it");
  },
  decimal: ","
}, PM = {
  years: function() {
    return "سال";
  },
  months: function() {
    return "ماه";
  },
  weeks: function() {
    return "هفته";
  },
  days: function() {
    return "روز";
  },
  hours: function() {
    return "ساعت";
  },
  minutes: function() {
    return "دقیقه";
  },
  seconds: function() {
    return "ثانیه";
  },
  decimal: "."
}, FM = {
  years: function(e) {
    return e === 1 ? "vuosi" : "vuotta";
  },
  months: function(e) {
    return e === 1 ? "kuukausi" : "kuukautta";
  },
  weeks: function(e) {
    return "viikko" + (e === 1 ? "" : "a");
  },
  days: function(e) {
    return "päivä" + (e === 1 ? "" : "ä");
  },
  hours: function(e) {
    return "tunti" + (e === 1 ? "" : "a");
  },
  minutes: function(e) {
    return "minuutti" + (e === 1 ? "" : "a");
  },
  seconds: function(e) {
    return "sekunti" + (e === 1 ? "" : "a");
  },
  decimal: ","
}, BM = {
  years: function() {
    return "ár";
  },
  months: function(e) {
    return e === 1 ? "mánaður" : "mánaðir";
  },
  weeks: function(e) {
    return e === 1 ? "vika" : "vikur";
  },
  days: function(e) {
    return e === 1 ? "dagur" : "dagar";
  },
  hours: function(e) {
    return e === 1 ? "tími" : "tímar";
  },
  minutes: function(e) {
    return e === 1 ? "minuttur" : "minuttir";
  },
  seconds: function() {
    return "sekund";
  },
  decimal: ","
}, UM = {
  years: function(e) {
    return "an" + (e >= 2 ? "s" : "");
  },
  months: function() {
    return "mois";
  },
  weeks: function(e) {
    return "semaine" + (e >= 2 ? "s" : "");
  },
  days: function(e) {
    return "jour" + (e >= 2 ? "s" : "");
  },
  hours: function(e) {
    return "heure" + (e >= 2 ? "s" : "");
  },
  minutes: function(e) {
    return "minute" + (e >= 2 ? "s" : "");
  },
  seconds: function(e) {
    return "seconde" + (e >= 2 ? "s" : "");
  },
  decimal: ","
}, jM = {
  years: function(e) {
    return e === 1 ? "χρόνος" : "χρόνια";
  },
  months: function(e) {
    return e === 1 ? "μήνας" : "μήνες";
  },
  weeks: function(e) {
    return e === 1 ? "εβδομάδα" : "εβδομάδες";
  },
  days: function(e) {
    return e === 1 ? "μέρα" : "μέρες";
  },
  hours: function(e) {
    return e === 1 ? "ώρα" : "ώρες";
  },
  minutes: function(e) {
    return e === 1 ? "λεπτό" : "λεπτά";
  },
  seconds: function(e) {
    return e === 1 ? "δευτερόλεπτο" : "δευτερόλεπτα";
  },
  decimal: ","
}, IM = {
  years: function(e) {
    return e === 1 ? "שנה" : "שנים";
  },
  months: function(e) {
    return e === 1 ? "חודש" : "חודשים";
  },
  weeks: function(e) {
    return e === 1 ? "שבוע" : "שבועות";
  },
  days: function(e) {
    return e === 1 ? "יום" : "ימים";
  },
  hours: function(e) {
    return e === 1 ? "שעה" : "שעות";
  },
  minutes: function(e) {
    return e === 1 ? "דקה" : "דקות";
  },
  seconds: function(e) {
    return e === 1 ? "שניה" : "שניות";
  },
  decimal: "."
}, MM = {
  years: function(e) {
    return e % 10 === 2 || e % 10 === 3 || e % 10 === 4 ? "godine" : "godina";
  },
  months: function(e) {
    return e === 1 ? "mjesec" : e === 2 || e === 3 || e === 4 ? "mjeseca" : "mjeseci";
  },
  weeks: function(e) {
    return e % 10 === 1 && e !== 11 ? "tjedan" : "tjedna";
  },
  days: function(e) {
    return e === 1 ? "dan" : "dana";
  },
  hours: function(e) {
    return e === 1 ? "sat" : e === 2 || e === 3 || e === 4 ? "sata" : "sati";
  },
  minutes: function(e) {
    var r = e % 10;
    return (r === 2 || r === 3 || r === 4) && (e < 10 || e > 14) ? "minute" : "minuta";
  },
  seconds: function(e) {
    return e === 10 || e === 11 || e === 12 || e === 13 || e === 14 || e === 16 || e === 17 || e === 18 || e === 19 || e % 10 === 5 ? "sekundi" : e % 10 === 1 ? "sekunda" : e % 10 === 2 || e % 10 === 3 || e % 10 === 4 ? "sekunde" : "sekundi";
  },
  decimal: ","
}, zM = {
  years: function() {
    return "év";
  },
  months: function() {
    return "hónap";
  },
  weeks: function() {
    return "hét";
  },
  days: function() {
    return "nap";
  },
  hours: function() {
    return "óra";
  },
  minutes: function() {
    return "perc";
  },
  seconds: function() {
    return "másodperc";
  },
  decimal: ","
}, HM = {
  years: function() {
    return "ár";
  },
  months: function(e) {
    return "mánuð" + (e === 1 ? "ur" : "ir");
  },
  weeks: function(e) {
    return "vik" + (e === 1 ? "a" : "ur");
  },
  days: function(e) {
    return "dag" + (e === 1 ? "ur" : "ar");
  },
  hours: function(e) {
    return "klukkutím" + (e === 1 ? "i" : "ar");
  },
  minutes: function(e) {
    return "mínút" + (e === 1 ? "a" : "ur");
  },
  seconds: function(e) {
    return "sekúnd" + (e === 1 ? "a" : "ur");
  },
  decimal: "."
}, GM = {
  years: function(e) {
    return "ann" + (e === 1 ? "o" : "i");
  },
  months: function(e) {
    return "mes" + (e === 1 ? "e" : "i");
  },
  weeks: function(e) {
    return "settiman" + (e === 1 ? "a" : "e");
  },
  days: function(e) {
    return "giorn" + (e === 1 ? "o" : "i");
  },
  hours: function(e) {
    return "or" + (e === 1 ? "a" : "e");
  },
  minutes: function(e) {
    return "minut" + (e === 1 ? "o" : "i");
  },
  seconds: function(e) {
    return "second" + (e === 1 ? "o" : "i");
  },
  decimal: ","
}, VM = {
  years: function() {
    return "年";
  },
  months: function() {
    return "月";
  },
  weeks: function() {
    return "週";
  },
  days: function() {
    return "日";
  },
  hours: function() {
    return "時間";
  },
  minutes: function() {
    return "分";
  },
  seconds: function() {
    return "秒";
  },
  decimal: "."
}, WM = {
  years: function() {
    return "년";
  },
  months: function() {
    return "개월";
  },
  weeks: function() {
    return "주일";
  },
  days: function() {
    return "일";
  },
  hours: function() {
    return "시간";
  },
  minutes: function() {
    return "분";
  },
  seconds: function() {
    return "초";
  },
  decimal: "."
}, ZM = {
  years: function() {
    return "ປີ";
  },
  months: function() {
    return "ເດືອນ";
  },
  weeks: function() {
    return "ອາທິດ";
  },
  days: function() {
    return "ມື້";
  },
  hours: function() {
    return "ຊົ່ວໂມງ";
  },
  minutes: function() {
    return "ນາທີ";
  },
  seconds: function() {
    return "ວິນາທີ";
  },
  decimal: ","
};
function er(e) {
  return e === 1 || e % 10 === 1 && e % 100 > 20 ? 0 : Math.floor(e) !== e || e % 10 >= 2 && e % 100 > 20 || e % 10 >= 2 && e % 100 < 10 ? 1 : 2;
}
var JM = {
  years: function(e) {
    return e % 10 === 0 || e % 100 >= 10 && e % 100 <= 20 ? "metų" : "metai";
  },
  months: function(e) {
    return ["mėnuo", "mėnesiai", "mėnesių"][er(e)];
  },
  weeks: function(e) {
    return ["savaitė", "savaitės", "savaičių"][er(e)];
  },
  days: function(e) {
    return ["diena", "dienos", "dienų"][er(e)];
  },
  hours: function(e) {
    return ["valanda", "valandos", "valandų"][er(e)];
  },
  minutes: function(e) {
    return ["minutė", "minutės", "minučių"][er(e)];
  },
  seconds: function(e) {
    return ["sekundė", "sekundės", "sekundžių"][er(e)];
  },
  decimal: ","
};
function Ve(e) {
  return e === 1 || e % 10 === 1 && e % 100 !== 11 ? 0 : 1;
}
var KM = {
  years: function(e) {
    return ["gads", "gadi"][Ve(e)];
  },
  months: function(e) {
    return ["mēnesis", "mēneši"][Ve(e)];
  },
  weeks: function(e) {
    return ["nedēļa", "nedēļas"][Ve(e)];
  },
  days: function(e) {
    return ["diena", "dienas"][Ve(e)];
  },
  hours: function(e) {
    return ["stunda", "stundas"][Ve(e)];
  },
  minutes: function(e) {
    return ["minūte", "minūtes"][Ve(e)];
  },
  seconds: function(e) {
    return ["sekunde", "sekundes"][Ve(e)];
  },
  decimal: ","
}, XM = {
  years: function() {
    return "tahun";
  },
  months: function() {
    return "bulan";
  },
  weeks: function() {
    return "minggu";
  },
  days: function() {
    return "hari";
  },
  hours: function() {
    return "jam";
  },
  minutes: function() {
    return "minit";
  },
  seconds: function() {
    return "saat";
  },
  decimal: "."
}, YM = {
  years: function() {
    return "jaar";
  },
  months: function(e) {
    return e === 1 ? "maand" : "maanden";
  },
  weeks: function(e) {
    return e === 1 ? "week" : "weken";
  },
  days: function(e) {
    return e === 1 ? "dag" : "dagen";
  },
  hours: function() {
    return "uur";
  },
  minutes: function(e) {
    return e === 1 ? "minuut" : "minuten";
  },
  seconds: function(e) {
    return e === 1 ? "seconde" : "seconden";
  },
  decimal: ","
}, QM = {
  years: function() {
    return "år";
  },
  months: function(e) {
    return "måned" + (e === 1 ? "" : "er");
  },
  weeks: function(e) {
    return "uke" + (e === 1 ? "" : "r");
  },
  days: function(e) {
    return "dag" + (e === 1 ? "" : "er");
  },
  hours: function(e) {
    return "time" + (e === 1 ? "" : "r");
  },
  minutes: function(e) {
    return "minutt" + (e === 1 ? "" : "er");
  },
  seconds: function(e) {
    return "sekund" + (e === 1 ? "" : "er");
  },
  decimal: ","
};
function We(e) {
  return e === 1 ? 0 : Math.floor(e) !== e ? 1 : e % 10 >= 2 && e % 10 <= 4 && !(e % 100 > 10 && e % 100 < 20) ? 2 : 3;
}
var ez = {
  years: function(e) {
    return ["rok", "roku", "lata", "lat"][We(e)];
  },
  months: function(e) {
    return ["miesiąc", "miesiąca", "miesiące", "miesięcy"][We(e)];
  },
  weeks: function(e) {
    return ["tydzień", "tygodnia", "tygodnie", "tygodni"][We(e)];
  },
  days: function(e) {
    return ["dzień", "dnia", "dni", "dni"][We(e)];
  },
  hours: function(e) {
    return ["godzina", "godziny", "godziny", "godzin"][We(e)];
  },
  minutes: function(e) {
    return ["minuta", "minuty", "minuty", "minut"][We(e)];
  },
  seconds: function(e) {
    return ["sekunda", "sekundy", "sekundy", "sekund"][We(e)];
  },
  decimal: ","
}, rz = {
  years: function(e) {
    return "ano" + (e === 1 ? "" : "s");
  },
  months: function(e) {
    return e === 1 ? "mês" : "meses";
  },
  weeks: function(e) {
    return "semana" + (e === 1 ? "" : "s");
  },
  days: function(e) {
    return "dia" + (e === 1 ? "" : "s");
  },
  hours: function(e) {
    return "hora" + (e === 1 ? "" : "s");
  },
  minutes: function(e) {
    return "minuto" + (e === 1 ? "" : "s");
  },
  seconds: function(e) {
    return "segundo" + (e === 1 ? "" : "s");
  },
  decimal: ","
}, tz = {
  years: function(e) {
    return e === 1 ? "an" : "ani";
  },
  months: function(e) {
    return e === 1 ? "lună" : "luni";
  },
  weeks: function(e) {
    return e === 1 ? "săptămână" : "săptămâni";
  },
  days: function(e) {
    return e === 1 ? "zi" : "zile";
  },
  hours: function(e) {
    return e === 1 ? "oră" : "ore";
  },
  minutes: function(e) {
    return e === 1 ? "minut" : "minute";
  },
  seconds: function(e) {
    return e === 1 ? "secundă" : "secunde";
  },
  decimal: ","
}, az = {
  years: function(e) {
    return ["лет", "год", "года"][fe(e)];
  },
  months: function(e) {
    return ["месяцев", "месяц", "месяца"][fe(e)];
  },
  weeks: function(e) {
    return ["недель", "неделя", "недели"][fe(e)];
  },
  days: function(e) {
    return ["дней", "день", "дня"][fe(e)];
  },
  hours: function(e) {
    return ["часов", "час", "часа"][fe(e)];
  },
  minutes: function(e) {
    return ["минут", "минута", "минуты"][fe(e)];
  },
  seconds: function(e) {
    return ["секунд", "секунда", "секунды"][fe(e)];
  },
  decimal: ","
}, nz = {
  years: function(e) {
    return ["rok", "roky", "roky", "rokov"][De(e)];
  },
  months: function(e) {
    return ["mesiac", "mesiace", "mesiace", "mesiacov"][De(e)];
  },
  weeks: function(e) {
    return ["týždeň", "týždne", "týždne", "týždňov"][De(e)];
  },
  days: function(e) {
    return ["deň", "dni", "dni", "dní"][De(e)];
  },
  hours: function(e) {
    return ["hodina", "hodiny", "hodiny", "hodín"][De(e)];
  },
  minutes: function(e) {
    return ["minúta", "minúty", "minúty", "minút"][De(e)];
  },
  seconds: function(e) {
    return ["sekunda", "sekundy", "sekundy", "sekúnd"][De(e)];
  },
  decimal: ","
}, iz = {
  years: function() {
    return "år";
  },
  months: function(e) {
    return "månad" + (e === 1 ? "" : "er");
  },
  weeks: function(e) {
    return "veck" + (e === 1 ? "a" : "or");
  },
  days: function(e) {
    return "dag" + (e === 1 ? "" : "ar");
  },
  hours: function(e) {
    return "timm" + (e === 1 ? "e" : "ar");
  },
  minutes: function(e) {
    return "minut" + (e === 1 ? "" : "er");
  },
  seconds: function(e) {
    return "sekund" + (e === 1 ? "" : "er");
  },
  decimal: ","
}, oz = {
  years: function() {
    return "yıl";
  },
  months: function() {
    return "ay";
  },
  weeks: function() {
    return "hafta";
  },
  days: function() {
    return "gün";
  },
  hours: function() {
    return "saat";
  },
  minutes: function() {
    return "dakika";
  },
  seconds: function() {
    return "saniye";
  },
  decimal: ","
}, sz = {
  years: function(e) {
    return ["років", "рік", "роки"][fe(e)];
  },
  months: function(e) {
    return ["місяців", "місяць", "місяці"][fe(e)];
  },
  weeks: function(e) {
    return ["тижнів", "тиждень", "тижні"][fe(e)];
  },
  days: function(e) {
    return ["днів", "день", "дні"][fe(e)];
  },
  hours: function(e) {
    return ["годин", "година", "години"][fe(e)];
  },
  minutes: function(e) {
    return ["хвилин", "хвилина", "хвилини"][fe(e)];
  },
  seconds: function(e) {
    return ["секунд", "секунда", "секунди"][fe(e)];
  },
  decimal: ","
}, lz = {
  years: function() {
    return "سال";
  },
  months: function(e) {
    return e === 1 ? "مہینہ" : "مہینے";
  },
  weeks: function(e) {
    return e === 1 ? "ہفتہ" : "ہفتے";
  },
  days: function() {
    return "دن";
  },
  hours: function(e) {
    return e === 1 ? "گھنٹہ" : "گھنٹے";
  },
  minutes: function() {
    return "منٹ";
  },
  seconds: function() {
    return "سیکنڈ";
  },
  decimal: "."
}, uz = {
  years: function() {
    return "năm";
  },
  months: function() {
    return "tháng";
  },
  weeks: function() {
    return "tuần";
  },
  days: function() {
    return "ngày";
  },
  hours: function() {
    return "giờ";
  },
  minutes: function() {
    return "phút";
  },
  seconds: function() {
    return "giây";
  },
  decimal: ","
}, cz = {
  years: function() {
    return "年";
  },
  months: function() {
    return "个月";
  },
  weeks: function() {
    return "周";
  },
  days: function() {
    return "天";
  },
  hours: function() {
    return "小时";
  },
  minutes: function() {
    return "分钟";
  },
  seconds: function() {
    return "秒";
  },
  decimal: "."
}, fz = {
  years: function() {
    return "年";
  },
  months: function() {
    return "個月";
  },
  weeks: function() {
    return "周";
  },
  days: function() {
    return "天";
  },
  hours: function() {
    return "小時";
  },
  minutes: function() {
    return "分鐘";
  },
  seconds: function() {
    return "秒";
  },
  decimal: "."
};
function DB(e) {
  return typeof e == "string" ? new eF(mM(e)) : new eF(gM(e));
}
DB.setLocales = function(e, r) {
  ma.setLocales(e, r);
};
const pz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ar: CM,
  bg: _M,
  ca: qM,
  cs: TM,
  da: $M,
  de: LM,
  en: OM,
  es: RM,
  et: NM,
  fa: PM,
  fi: FM,
  fo: BM,
  fr: UM,
  gr: jM,
  he: IM,
  hr: MM,
  hu: zM,
  is: HM,
  isoDuration: DB,
  it: GM,
  ja: VM,
  ko: WM,
  lo: ZM,
  lt: JM,
  lv: KM,
  ms: XM,
  nl: YM,
  no: QM,
  pl: ez,
  pt: rz,
  ro: tz,
  ru: az,
  sk: nz,
  sv: iz,
  tr: oz,
  uk: sz,
  ur: lz,
  vi: uz,
  zhCN: cz,
  zhTW: fz
}, Symbol.toStringTag, { value: "Module" })), dz = /* @__PURE__ */ gB(pz);
var Pr = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var rF;
function vz() {
  if (rF)
    return Pr;
  rF = 1;
  var e = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, r = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, t = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, n = /\\([\u000b\u0020-\u00ff])/g, o = /([\\"])/g, i = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
  Pr.format = s, Pr.parse = c;
  function s(h) {
    if (!h || typeof h != "object")
      throw new TypeError("argument obj is required");
    var y = h.parameters, T = h.type;
    if (!T || !i.test(T))
      throw new TypeError("invalid type");
    var x = T;
    if (y && typeof y == "object")
      for (var $, b = Object.keys(y).sort(), A = 0; A < b.length; A++) {
        if ($ = b[A], !t.test($))
          throw new TypeError("invalid parameter name");
        x += "; " + $ + "=" + p(y[$]);
      }
    return x;
  }
  function c(h) {
    if (!h)
      throw new TypeError("argument string is required");
    var y = typeof h == "object" ? u(h) : h;
    if (typeof y != "string")
      throw new TypeError("argument string is required to be a string");
    var T = y.indexOf(";"), x = T !== -1 ? y.slice(0, T).trim() : y.trim();
    if (!i.test(x))
      throw new TypeError("invalid media type");
    var $ = new v(x.toLowerCase());
    if (T !== -1) {
      var b, A, g;
      for (e.lastIndex = T; A = e.exec(y); ) {
        if (A.index !== T)
          throw new TypeError("invalid parameter format");
        T += A[0].length, b = A[1].toLowerCase(), g = A[2], g.charCodeAt(0) === 34 && (g = g.slice(1, -1), g.indexOf("\\") !== -1 && (g = g.replace(n, "$1"))), $.parameters[b] = g;
      }
      if (T !== y.length)
        throw new TypeError("invalid parameter format");
    }
    return $;
  }
  function u(h) {
    var y;
    if (typeof h.getHeader == "function" ? y = h.getHeader("content-type") : typeof h.headers == "object" && (y = h.headers && h.headers["content-type"]), typeof y != "string")
      throw new TypeError("content-type header is missing from object");
    return y;
  }
  function p(h) {
    var y = String(h);
    if (t.test(y))
      return y;
    if (y.length > 0 && !r.test(y))
      throw new TypeError("invalid parameter value");
    return '"' + y.replace(o, "\\$1") + '"';
  }
  function v(h) {
    this.parameters = /* @__PURE__ */ Object.create(null), this.type = h;
  }
  return Pr;
}
var Fr = { exports: {} };
/* commonmark 0.29 https://github.com/commonmark/commonmark.js @license BSD3 */
var tF;
function hz() {
  return tF || (tF = 1, function(e, r) {
    (function(t, n) {
      n(r);
    })(hr, function(t) {
      function n(a) {
        switch (a._type) {
          case "document":
          case "block_quote":
          case "list":
          case "item":
          case "paragraph":
          case "heading":
          case "emph":
          case "strong":
          case "link":
          case "image":
          case "custom_inline":
          case "custom_block":
            return !0;
          default:
            return !1;
        }
      }
      var o = function(a, l) {
        this.current = a, this.entering = l === !0;
      }, i = function() {
        var a = this.current, l = this.entering;
        if (a === null)
          return null;
        var f = n(a);
        return l && f ? a._firstChild ? (this.current = a._firstChild, this.entering = !0) : this.entering = !1 : a === this.root ? this.current = null : a._next === null ? (this.current = a._parent, this.entering = !1) : (this.current = a._next, this.entering = !0), { entering: l, node: a };
      }, s = function(a) {
        return {
          current: a,
          root: a,
          entering: !0,
          next: i,
          resumeAt: o
        };
      }, c = function(a, l) {
        this._type = a, this._parent = null, this._firstChild = null, this._lastChild = null, this._prev = null, this._next = null, this._sourcepos = l, this._lastLineBlank = !1, this._lastLineChecked = !1, this._open = !0, this._string_content = null, this._literal = null, this._listData = {}, this._info = null, this._destination = null, this._title = null, this._isFenced = !1, this._fenceChar = null, this._fenceLength = 0, this._fenceOffset = null, this._level = null, this._onEnter = null, this._onExit = null;
      }, u = c.prototype;
      Object.defineProperty(u, "isContainer", {
        get: function() {
          return n(this);
        }
      }), Object.defineProperty(u, "type", {
        get: function() {
          return this._type;
        }
      }), Object.defineProperty(u, "firstChild", {
        get: function() {
          return this._firstChild;
        }
      }), Object.defineProperty(u, "lastChild", {
        get: function() {
          return this._lastChild;
        }
      }), Object.defineProperty(u, "next", {
        get: function() {
          return this._next;
        }
      }), Object.defineProperty(u, "prev", {
        get: function() {
          return this._prev;
        }
      }), Object.defineProperty(u, "parent", {
        get: function() {
          return this._parent;
        }
      }), Object.defineProperty(u, "sourcepos", {
        get: function() {
          return this._sourcepos;
        }
      }), Object.defineProperty(u, "literal", {
        get: function() {
          return this._literal;
        },
        set: function(a) {
          this._literal = a;
        }
      }), Object.defineProperty(u, "destination", {
        get: function() {
          return this._destination;
        },
        set: function(a) {
          this._destination = a;
        }
      }), Object.defineProperty(u, "title", {
        get: function() {
          return this._title;
        },
        set: function(a) {
          this._title = a;
        }
      }), Object.defineProperty(u, "info", {
        get: function() {
          return this._info;
        },
        set: function(a) {
          this._info = a;
        }
      }), Object.defineProperty(u, "level", {
        get: function() {
          return this._level;
        },
        set: function(a) {
          this._level = a;
        }
      }), Object.defineProperty(u, "listType", {
        get: function() {
          return this._listData.type;
        },
        set: function(a) {
          this._listData.type = a;
        }
      }), Object.defineProperty(u, "listTight", {
        get: function() {
          return this._listData.tight;
        },
        set: function(a) {
          this._listData.tight = a;
        }
      }), Object.defineProperty(u, "listStart", {
        get: function() {
          return this._listData.start;
        },
        set: function(a) {
          this._listData.start = a;
        }
      }), Object.defineProperty(u, "listDelimiter", {
        get: function() {
          return this._listData.delimiter;
        },
        set: function(a) {
          this._listData.delimiter = a;
        }
      }), Object.defineProperty(u, "onEnter", {
        get: function() {
          return this._onEnter;
        },
        set: function(a) {
          this._onEnter = a;
        }
      }), Object.defineProperty(u, "onExit", {
        get: function() {
          return this._onExit;
        },
        set: function(a) {
          this._onExit = a;
        }
      }), c.prototype.appendChild = function(a) {
        a.unlink(), a._parent = this, this._lastChild ? (this._lastChild._next = a, a._prev = this._lastChild, this._lastChild = a) : (this._firstChild = a, this._lastChild = a);
      }, c.prototype.prependChild = function(a) {
        a.unlink(), a._parent = this, this._firstChild ? (this._firstChild._prev = a, a._next = this._firstChild, this._firstChild = a) : (this._firstChild = a, this._lastChild = a);
      }, c.prototype.unlink = function() {
        this._prev ? this._prev._next = this._next : this._parent && (this._parent._firstChild = this._next), this._next ? this._next._prev = this._prev : this._parent && (this._parent._lastChild = this._prev), this._parent = null, this._next = null, this._prev = null;
      }, c.prototype.insertAfter = function(a) {
        a.unlink(), a._next = this._next, a._next && (a._next._prev = a), a._prev = this, this._next = a, a._parent = this._parent, a._next || (a._parent._lastChild = a);
      }, c.prototype.insertBefore = function(a) {
        a.unlink(), a._prev = this._prev, a._prev && (a._prev._next = a), a._next = this, this._prev = a, a._parent = this._parent, a._prev || (a._parent._firstChild = a);
      }, c.prototype.walker = function() {
        var a = new s(this);
        return a;
      };
      var p = {};
      function v(a) {
        var l, f, d = p[a];
        if (d)
          return d;
        for (d = p[a] = [], l = 0; l < 128; l++)
          f = String.fromCharCode(l), /^[0-9a-z]$/i.test(f) ? d.push(f) : d.push("%" + ("0" + l.toString(16).toUpperCase()).slice(-2));
        for (l = 0; l < a.length; l++)
          d[a.charCodeAt(l)] = a[l];
        return d;
      }
      function h(a, l, f) {
        var d, E, w, N, O, F = "";
        for (typeof l != "string" && (f = l, l = h.defaultChars), typeof f > "u" && (f = !0), O = v(l), d = 0, E = a.length; d < E; d++) {
          if (w = a.charCodeAt(d), f && w === 37 && d + 2 < E && /^[0-9a-f]{2}$/i.test(a.slice(d + 1, d + 3))) {
            F += a.slice(d, d + 3), d += 2;
            continue;
          }
          if (w < 128) {
            F += O[w];
            continue;
          }
          if (w >= 55296 && w <= 57343) {
            if (w >= 55296 && w <= 56319 && d + 1 < E && (N = a.charCodeAt(d + 1), N >= 56320 && N <= 57343)) {
              F += encodeURIComponent(a[d] + a[d + 1]), d++;
              continue;
            }
            F += "%EF%BF%BD";
            continue;
          }
          F += encodeURIComponent(a[d]);
        }
        return F;
      }
      h.defaultChars = ";/?:@&=+$,-_.!~*'()#", h.componentChars = "-_.!~*'()";
      var y = h, T = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof hr < "u" ? hr : typeof self < "u" ? self : {};
      function x(a) {
        return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
      }
      function $(a, l) {
        return l = { exports: {} }, a(l, l.exports), l.exports;
      }
      function b(a) {
        return a && a.default || a;
      }
      var A = "Á", g = "á", S = "Ă", q = "ă", P = "∾", R = "∿", L = "∾̳", U = "Â", j = "â", z = "´", ae = "А", ne = "а", ge = "Æ", se = "æ", ee = "⁡", ue = "𝔄", J = "𝔞", W = "À", te = "à", re = "ℵ", le = "ℵ", m = "Α", D = "α", _ = "Ā", B = "ā", H = "⨿", Z = "&", M = "&", I = "⩕", K = "⩓", ce = "∧", we = "⩜", Pe = "⩘", Ce = "⩚", Fe = "∠", ir = "⦤", Cr = "∠", _r = "⦨", C = "⦩", qr = "⦪", Yr = "⦫", Aa = "⦬", Ea = "⦭", Sa = "⦮", Ca = "⦯", _a = "∡", qa = "∟", Ta = "⊾", $a = "⦝", La = "∢", Oa = "Å", Ra = "⍼", Na = "Ą", Pa = "ą", Fa = "𝔸", Ba = "𝕒", Ua = "⩯", ja = "≈", Ia = "⩰", Ma = "≊", za = "≋", Ha = "'", Ga = "⁡", Va = "≈", Wa = "≊", Za = "Å", Ja = "å", Ka = "𝒜", Xa = "𝒶", Ya = "≔", Qa = "*", en = "≈", rn = "≍", tn = "Ã", an = "ã", nn = "Ä", on = "ä", sn = "∳", ln = "⨑", un = "≌", cn = "϶", fn = "‵", pn = "∽", dn = "⋍", vn = "∖", hn = "⫧", mn = "⊽", gn = "⌅", bn = "⌆", yn = "⌅", wn = "⎵", Dn = "⎶", xn = "≌", kn = "Б", An = "б", En = "„", Sn = "∵", Cn = "∵", _n = "∵", qn = "⦰", Tn = "϶", $n = "ℬ", Ln = "ℬ", On = "Β", Rn = "β", Nn = "ℶ", Pn = "≬", Fn = "𝔅", Bn = "𝔟", Un = "⋂", jn = "◯", In = "⋃", Mn = "⨀", zn = "⨁", Hn = "⨂", Gn = "⨆", Vn = "★", Wn = "▽", Zn = "△", Jn = "⨄", Kn = "⋁", Xn = "⋀", Yn = "⤍", Qn = "⧫", ei = "▪", ri = "▴", ti = "▾", ai = "◂", ni = "▸", ii = "␣", oi = "▒", si = "░", li = "▓", ui = "█", ci = "=⃥", fi = "≡⃥", pi = "⫭", di = "⌐", vi = "𝔹", hi = "𝕓", mi = "⊥", gi = "⊥", bi = "⋈", yi = "⧉", wi = "┐", Di = "╕", xi = "╖", ki = "╗", Ai = "┌", Ei = "╒", Si = "╓", Ci = "╔", _i = "─", qi = "═", Ti = "┬", $i = "╤", Li = "╥", Oi = "╦", Ri = "┴", Ni = "╧", Pi = "╨", Fi = "╩", Bi = "⊟", Ui = "⊞", ji = "⊠", Ii = "┘", Mi = "╛", zi = "╜", Hi = "╝", Gi = "└", Vi = "╘", Wi = "╙", Zi = "╚", Ji = "│", Ki = "║", Xi = "┼", Yi = "╪", Qi = "╫", eo = "╬", ro = "┤", to = "╡", ao = "╢", no = "╣", io = "├", oo = "╞", so = "╟", lo = "╠", uo = "‵", co = "˘", fo = "˘", po = "¦", vo = "𝒷", ho = "ℬ", mo = "⁏", go = "∽", bo = "⋍", yo = "⧅", wo = "\\", Do = "⟈", xo = "•", ko = "•", Ao = "≎", Eo = "⪮", So = "≏", Co = "≎", _o = "≏", qo = "Ć", To = "ć", $o = "⩄", Lo = "⩉", Oo = "⩋", Ro = "∩", No = "⋒", Po = "⩇", Fo = "⩀", Bo = "ⅅ", Uo = "∩︀", jo = "⁁", Io = "ˇ", Mo = "ℭ", zo = "⩍", Ho = "Č", Go = "č", Vo = "Ç", Wo = "ç", Zo = "Ĉ", Jo = "ĉ", Ko = "∰", Xo = "⩌", Yo = "⩐", Qo = "Ċ", es = "ċ", rs = "¸", ts = "¸", as = "⦲", ns = "¢", is = "·", os = "·", ss = "𝔠", ls = "ℭ", us = "Ч", cs = "ч", fs = "✓", ps = "✓", ds = "Χ", vs = "χ", hs = "ˆ", ms = "≗", gs = "↺", bs = "↻", ys = "⊛", ws = "⊚", Ds = "⊝", xs = "⊙", ks = "®", As = "Ⓢ", Es = "⊖", Ss = "⊕", Cs = "⊗", _s = "○", qs = "⧃", Ts = "≗", $s = "⨐", Ls = "⫯", Os = "⧂", Rs = "∲", Ns = "”", Ps = "’", Fs = "♣", Bs = "♣", Us = ":", js = "∷", Is = "⩴", Ms = "≔", zs = "≔", Hs = ",", Gs = "@", Vs = "∁", Ws = "∘", Zs = "∁", Js = "ℂ", Ks = "≅", Xs = "⩭", Ys = "≡", Qs = "∮", el = "∯", rl = "∮", tl = "𝕔", al = "ℂ", nl = "∐", il = "∐", ol = "©", sl = "©", ll = "℗", ul = "∳", cl = "↵", fl = "✗", pl = "⨯", dl = "𝒞", vl = "𝒸", hl = "⫏", ml = "⫑", gl = "⫐", bl = "⫒", yl = "⋯", wl = "⤸", Dl = "⤵", xl = "⋞", kl = "⋟", Al = "↶", El = "⤽", Sl = "⩈", Cl = "⩆", _l = "≍", ql = "∪", Tl = "⋓", $l = "⩊", Ll = "⊍", Ol = "⩅", Rl = "∪︀", Nl = "↷", Pl = "⤼", Fl = "⋞", Bl = "⋟", Ul = "⋎", jl = "⋏", Il = "¤", Ml = "↶", zl = "↷", Hl = "⋎", Gl = "⋏", Vl = "∲", Wl = "∱", Zl = "⌭", Jl = "†", Kl = "‡", Xl = "ℸ", Yl = "↓", Ql = "↡", eu = "⇓", ru = "‐", tu = "⫤", au = "⊣", nu = "⤏", iu = "˝", ou = "Ď", su = "ď", lu = "Д", uu = "д", cu = "‡", fu = "⇊", pu = "ⅅ", du = "ⅆ", vu = "⤑", hu = "⩷", mu = "°", gu = "∇", bu = "Δ", yu = "δ", wu = "⦱", Du = "⥿", xu = "𝔇", ku = "𝔡", Au = "⥥", Eu = "⇃", Su = "⇂", Cu = "´", _u = "˙", qu = "˝", Tu = "`", $u = "˜", Lu = "⋄", Ou = "⋄", Ru = "⋄", Nu = "♦", Pu = "♦", Fu = "¨", Bu = "ⅆ", Uu = "ϝ", ju = "⋲", Iu = "÷", Mu = "÷", zu = "⋇", Hu = "⋇", Gu = "Ђ", Vu = "ђ", Wu = "⌞", Zu = "⌍", Ju = "$", Ku = "𝔻", Xu = "𝕕", Yu = "¨", Qu = "˙", ec = "⃜", rc = "≐", tc = "≑", ac = "≐", nc = "∸", ic = "∔", oc = "⊡", sc = "⌆", lc = "∯", uc = "¨", cc = "⇓", fc = "⇐", pc = "⇔", dc = "⫤", vc = "⟸", hc = "⟺", mc = "⟹", gc = "⇒", bc = "⊨", yc = "⇑", wc = "⇕", Dc = "∥", xc = "⤓", kc = "↓", Ac = "↓", Ec = "⇓", Sc = "⇵", Cc = "̑", _c = "⇊", qc = "⇃", Tc = "⇂", $c = "⥐", Lc = "⥞", Oc = "⥖", Rc = "↽", Nc = "⥟", Pc = "⥗", Fc = "⇁", Bc = "↧", Uc = "⊤", jc = "⤐", Ic = "⌟", Mc = "⌌", zc = "𝒟", Hc = "𝒹", Gc = "Ѕ", Vc = "ѕ", Wc = "⧶", Zc = "Đ", Jc = "đ", Kc = "⋱", Xc = "▿", Yc = "▾", Qc = "⇵", ef = "⥯", rf = "⦦", tf = "Џ", af = "џ", nf = "⟿", of = "É", sf = "é", lf = "⩮", uf = "Ě", cf = "ě", ff = "Ê", pf = "ê", df = "≖", vf = "≕", hf = "Э", mf = "э", gf = "⩷", bf = "Ė", yf = "ė", wf = "≑", Df = "ⅇ", xf = "≒", kf = "𝔈", Af = "𝔢", Ef = "⪚", Sf = "È", Cf = "è", _f = "⪖", qf = "⪘", Tf = "⪙", $f = "∈", Lf = "⏧", Of = "ℓ", Rf = "⪕", Nf = "⪗", Pf = "Ē", Ff = "ē", Bf = "∅", Uf = "∅", jf = "◻", If = "∅", Mf = "▫", zf = " ", Hf = " ", Gf = " ", Vf = "Ŋ", Wf = "ŋ", Zf = " ", Jf = "Ę", Kf = "ę", Xf = "𝔼", Yf = "𝕖", Qf = "⋕", ep = "⧣", rp = "⩱", tp = "ε", ap = "Ε", np = "ε", ip = "ϵ", op = "≖", sp = "≕", lp = "≂", up = "⪖", cp = "⪕", fp = "⩵", pp = "=", dp = "≂", vp = "≟", hp = "⇌", mp = "≡", gp = "⩸", bp = "⧥", yp = "⥱", wp = "≓", Dp = "ℯ", xp = "ℰ", kp = "≐", Ap = "⩳", Ep = "≂", Sp = "Η", Cp = "η", _p = "Ð", qp = "ð", Tp = "Ë", $p = "ë", Lp = "€", Op = "!", Rp = "∃", Np = "∃", Pp = "ℰ", Fp = "ⅇ", Bp = "ⅇ", Up = "≒", jp = "Ф", Ip = "ф", Mp = "♀", zp = "ﬃ", Hp = "ﬀ", Gp = "ﬄ", Vp = "𝔉", Wp = "𝔣", Zp = "ﬁ", Jp = "◼", Kp = "▪", Xp = "fj", Yp = "♭", Qp = "ﬂ", ed = "▱", rd = "ƒ", td = "𝔽", ad = "𝕗", nd = "∀", id = "∀", od = "⋔", sd = "⫙", ld = "ℱ", ud = "⨍", cd = "½", fd = "⅓", pd = "¼", dd = "⅕", vd = "⅙", hd = "⅛", md = "⅔", gd = "⅖", bd = "¾", yd = "⅗", wd = "⅜", Dd = "⅘", xd = "⅚", kd = "⅝", Ad = "⅞", Ed = "⁄", Sd = "⌢", Cd = "𝒻", _d = "ℱ", qd = "ǵ", Td = "Γ", $d = "γ", Ld = "Ϝ", Od = "ϝ", Rd = "⪆", Nd = "Ğ", Pd = "ğ", Fd = "Ģ", Bd = "Ĝ", Ud = "ĝ", jd = "Г", Id = "г", Md = "Ġ", zd = "ġ", Hd = "≥", Gd = "≧", Vd = "⪌", Wd = "⋛", Zd = "≥", Jd = "≧", Kd = "⩾", Xd = "⪩", Yd = "⩾", Qd = "⪀", ev = "⪂", rv = "⪄", tv = "⋛︀", av = "⪔", nv = "𝔊", iv = "𝔤", ov = "≫", sv = "⋙", lv = "⋙", uv = "ℷ", cv = "Ѓ", fv = "ѓ", pv = "⪥", dv = "≷", vv = "⪒", hv = "⪤", mv = "⪊", gv = "⪊", bv = "⪈", yv = "≩", wv = "⪈", Dv = "≩", xv = "⋧", kv = "𝔾", Av = "𝕘", Ev = "`", Sv = "≥", Cv = "⋛", _v = "≧", qv = "⪢", Tv = "≷", $v = "⩾", Lv = "≳", Ov = "𝒢", Rv = "ℊ", Nv = "≳", Pv = "⪎", Fv = "⪐", Bv = "⪧", Uv = "⩺", jv = ">", Iv = ">", Mv = "≫", zv = "⋗", Hv = "⦕", Gv = "⩼", Vv = "⪆", Wv = "⥸", Zv = "⋗", Jv = "⋛", Kv = "⪌", Xv = "≷", Yv = "≳", Qv = "≩︀", eh = "≩︀", rh = "ˇ", th = " ", ah = "½", nh = "ℋ", ih = "Ъ", oh = "ъ", sh = "⥈", lh = "↔", uh = "⇔", ch = "↭", fh = "^", ph = "ℏ", dh = "Ĥ", vh = "ĥ", hh = "♥", mh = "♥", gh = "…", bh = "⊹", yh = "𝔥", wh = "ℌ", Dh = "ℋ", xh = "⤥", kh = "⤦", Ah = "⇿", Eh = "∻", Sh = "↩", Ch = "↪", _h = "𝕙", qh = "ℍ", Th = "―", $h = "─", Lh = "𝒽", Oh = "ℋ", Rh = "ℏ", Nh = "Ħ", Ph = "ħ", Fh = "≎", Bh = "≏", Uh = "⁃", jh = "‐", Ih = "Í", Mh = "í", zh = "⁣", Hh = "Î", Gh = "î", Vh = "И", Wh = "и", Zh = "İ", Jh = "Е", Kh = "е", Xh = "¡", Yh = "⇔", Qh = "𝔦", em = "ℑ", rm = "Ì", tm = "ì", am = "ⅈ", nm = "⨌", im = "∭", om = "⧜", sm = "℩", lm = "Ĳ", um = "ĳ", cm = "Ī", fm = "ī", pm = "ℑ", dm = "ⅈ", vm = "ℐ", hm = "ℑ", mm = "ı", gm = "ℑ", bm = "⊷", ym = "Ƶ", wm = "⇒", Dm = "℅", xm = "∞", km = "⧝", Am = "ı", Em = "⊺", Sm = "∫", Cm = "∬", _m = "ℤ", qm = "∫", Tm = "⊺", $m = "⋂", Lm = "⨗", Om = "⨼", Rm = "⁣", Nm = "⁢", Pm = "Ё", Fm = "ё", Bm = "Į", Um = "į", jm = "𝕀", Im = "𝕚", Mm = "Ι", zm = "ι", Hm = "⨼", Gm = "¿", Vm = "𝒾", Wm = "ℐ", Zm = "∈", Jm = "⋵", Km = "⋹", Xm = "⋴", Ym = "⋳", Qm = "∈", eg = "⁢", rg = "Ĩ", tg = "ĩ", ag = "І", ng = "і", ig = "Ï", og = "ï", sg = "Ĵ", lg = "ĵ", ug = "Й", cg = "й", fg = "𝔍", pg = "𝔧", dg = "ȷ", vg = "𝕁", hg = "𝕛", mg = "𝒥", gg = "𝒿", bg = "Ј", yg = "ј", wg = "Є", Dg = "є", xg = "Κ", kg = "κ", Ag = "ϰ", Eg = "Ķ", Sg = "ķ", Cg = "К", _g = "к", qg = "𝔎", Tg = "𝔨", $g = "ĸ", Lg = "Х", Og = "х", Rg = "Ќ", Ng = "ќ", Pg = "𝕂", Fg = "𝕜", Bg = "𝒦", Ug = "𝓀", jg = "⇚", Ig = "Ĺ", Mg = "ĺ", zg = "⦴", Hg = "ℒ", Gg = "Λ", Vg = "λ", Wg = "⟨", Zg = "⟪", Jg = "⦑", Kg = "⟨", Xg = "⪅", Yg = "ℒ", Qg = "«", eb = "⇤", rb = "⤟", tb = "←", ab = "↞", nb = "⇐", ib = "⤝", ob = "↩", sb = "↫", lb = "⤹", ub = "⥳", cb = "↢", fb = "⤙", pb = "⤛", db = "⪫", vb = "⪭", hb = "⪭︀", mb = "⤌", gb = "⤎", bb = "❲", yb = "{", wb = "[", Db = "⦋", xb = "⦏", kb = "⦍", Ab = "Ľ", Eb = "ľ", Sb = "Ļ", Cb = "ļ", _b = "⌈", qb = "{", Tb = "Л", $b = "л", Lb = "⤶", Ob = "“", Rb = "„", Nb = "⥧", Pb = "⥋", Fb = "↲", Bb = "≤", Ub = "≦", jb = "⟨", Ib = "⇤", Mb = "←", zb = "←", Hb = "⇐", Gb = "⇆", Vb = "↢", Wb = "⌈", Zb = "⟦", Jb = "⥡", Kb = "⥙", Xb = "⇃", Yb = "⌊", Qb = "↽", ey = "↼", ry = "⇇", ty = "↔", ay = "↔", ny = "⇔", iy = "⇆", oy = "⇋", sy = "↭", ly = "⥎", uy = "↤", cy = "⊣", fy = "⥚", py = "⋋", dy = "⧏", vy = "⊲", hy = "⊴", my = "⥑", gy = "⥠", by = "⥘", yy = "↿", wy = "⥒", Dy = "↼", xy = "⪋", ky = "⋚", Ay = "≤", Ey = "≦", Sy = "⩽", Cy = "⪨", _y = "⩽", qy = "⩿", Ty = "⪁", $y = "⪃", Ly = "⋚︀", Oy = "⪓", Ry = "⪅", Ny = "⋖", Py = "⋚", Fy = "⪋", By = "⋚", Uy = "≦", jy = "≶", Iy = "≶", My = "⪡", zy = "≲", Hy = "⩽", Gy = "≲", Vy = "⥼", Wy = "⌊", Zy = "𝔏", Jy = "𝔩", Ky = "≶", Xy = "⪑", Yy = "⥢", Qy = "↽", e0 = "↼", r0 = "⥪", t0 = "▄", a0 = "Љ", n0 = "љ", i0 = "⇇", o0 = "≪", s0 = "⋘", l0 = "⌞", u0 = "⇚", c0 = "⥫", f0 = "◺", p0 = "Ŀ", d0 = "ŀ", v0 = "⎰", h0 = "⎰", m0 = "⪉", g0 = "⪉", b0 = "⪇", y0 = "≨", w0 = "⪇", D0 = "≨", x0 = "⋦", k0 = "⟬", A0 = "⇽", E0 = "⟦", S0 = "⟵", C0 = "⟵", _0 = "⟸", q0 = "⟷", T0 = "⟷", $0 = "⟺", L0 = "⟼", O0 = "⟶", R0 = "⟶", N0 = "⟹", P0 = "↫", F0 = "↬", B0 = "⦅", U0 = "𝕃", j0 = "𝕝", I0 = "⨭", M0 = "⨴", z0 = "∗", H0 = "_", G0 = "↙", V0 = "↘", W0 = "◊", Z0 = "◊", J0 = "⧫", K0 = "(", X0 = "⦓", Y0 = "⇆", Q0 = "⌟", e1 = "⇋", r1 = "⥭", t1 = "‎", a1 = "⊿", n1 = "‹", i1 = "𝓁", o1 = "ℒ", s1 = "↰", l1 = "↰", u1 = "≲", c1 = "⪍", f1 = "⪏", p1 = "[", d1 = "‘", v1 = "‚", h1 = "Ł", m1 = "ł", g1 = "⪦", b1 = "⩹", y1 = "<", w1 = "<", D1 = "≪", x1 = "⋖", k1 = "⋋", A1 = "⋉", E1 = "⥶", S1 = "⩻", C1 = "◃", _1 = "⊴", q1 = "◂", T1 = "⦖", $1 = "⥊", L1 = "⥦", O1 = "≨︀", R1 = "≨︀", N1 = "¯", P1 = "♂", F1 = "✠", B1 = "✠", U1 = "↦", j1 = "↦", I1 = "↧", M1 = "↤", z1 = "↥", H1 = "▮", G1 = "⨩", V1 = "М", W1 = "м", Z1 = "—", J1 = "∺", K1 = "∡", X1 = " ", Y1 = "ℳ", Q1 = "𝔐", ew = "𝔪", rw = "℧", tw = "µ", aw = "*", nw = "⫰", iw = "∣", ow = "·", sw = "⊟", lw = "−", uw = "∸", cw = "⨪", fw = "∓", pw = "⫛", dw = "…", vw = "∓", hw = "⊧", mw = "𝕄", gw = "𝕞", bw = "∓", yw = "𝓂", ww = "ℳ", Dw = "∾", xw = "Μ", kw = "μ", Aw = "⊸", Ew = "⊸", Sw = "∇", Cw = "Ń", _w = "ń", qw = "∠⃒", Tw = "≉", $w = "⩰̸", Lw = "≋̸", Ow = "ŉ", Rw = "≉", Nw = "♮", Pw = "ℕ", Fw = "♮", Bw = " ", Uw = "≎̸", jw = "≏̸", Iw = "⩃", Mw = "Ň", zw = "ň", Hw = "Ņ", Gw = "ņ", Vw = "≇", Ww = "⩭̸", Zw = "⩂", Jw = "Н", Kw = "н", Xw = "–", Yw = "⤤", Qw = "↗", eD = "⇗", rD = "↗", tD = "≠", aD = "≐̸", nD = "​", iD = "​", oD = "​", sD = "​", lD = "≢", uD = "⤨", cD = "≂̸", fD = "≫", pD = "≪", dD = `
`, vD = "∄", hD = "∄", mD = "𝔑", gD = "𝔫", bD = "≧̸", yD = "≱", wD = "≱", DD = "≧̸", xD = "⩾̸", kD = "⩾̸", AD = "⋙̸", ED = "≵", SD = "≫⃒", CD = "≯", _D = "≯", qD = "≫̸", TD = "↮", $D = "⇎", LD = "⫲", OD = "∋", RD = "⋼", ND = "⋺", PD = "∋", FD = "Њ", BD = "њ", UD = "↚", jD = "⇍", ID = "‥", MD = "≦̸", zD = "≰", HD = "↚", GD = "⇍", VD = "↮", WD = "⇎", ZD = "≰", JD = "≦̸", KD = "⩽̸", XD = "⩽̸", YD = "≮", QD = "⋘̸", e2 = "≴", r2 = "≪⃒", t2 = "≮", a2 = "⋪", n2 = "⋬", i2 = "≪̸", o2 = "∤", s2 = "⁠", l2 = " ", u2 = "𝕟", c2 = "ℕ", f2 = "⫬", p2 = "¬", d2 = "≢", v2 = "≭", h2 = "∦", m2 = "∉", g2 = "≠", b2 = "≂̸", y2 = "∄", w2 = "≯", D2 = "≱", x2 = "≧̸", k2 = "≫̸", A2 = "≹", E2 = "⩾̸", S2 = "≵", C2 = "≎̸", _2 = "≏̸", q2 = "∉", T2 = "⋵̸", $2 = "⋹̸", L2 = "∉", O2 = "⋷", R2 = "⋶", N2 = "⧏̸", P2 = "⋪", F2 = "⋬", B2 = "≮", U2 = "≰", j2 = "≸", I2 = "≪̸", M2 = "⩽̸", z2 = "≴", H2 = "⪢̸", G2 = "⪡̸", V2 = "∌", W2 = "∌", Z2 = "⋾", J2 = "⋽", K2 = "⊀", X2 = "⪯̸", Y2 = "⋠", Q2 = "∌", ex = "⧐̸", rx = "⋫", tx = "⋭", ax = "⊏̸", nx = "⋢", ix = "⊐̸", ox = "⋣", sx = "⊂⃒", lx = "⊈", ux = "⊁", cx = "⪰̸", fx = "⋡", px = "≿̸", dx = "⊃⃒", vx = "⊉", hx = "≁", mx = "≄", gx = "≇", bx = "≉", yx = "∤", wx = "∦", Dx = "∦", xx = "⫽⃥", kx = "∂̸", Ax = "⨔", Ex = "⊀", Sx = "⋠", Cx = "⊀", _x = "⪯̸", qx = "⪯̸", Tx = "⤳̸", $x = "↛", Lx = "⇏", Ox = "↝̸", Rx = "↛", Nx = "⇏", Px = "⋫", Fx = "⋭", Bx = "⊁", Ux = "⋡", jx = "⪰̸", Ix = "𝒩", Mx = "𝓃", zx = "∤", Hx = "∦", Gx = "≁", Vx = "≄", Wx = "≄", Zx = "∤", Jx = "∦", Kx = "⋢", Xx = "⋣", Yx = "⊄", Qx = "⫅̸", ek = "⊈", rk = "⊂⃒", tk = "⊈", ak = "⫅̸", nk = "⊁", ik = "⪰̸", ok = "⊅", sk = "⫆̸", lk = "⊉", uk = "⊃⃒", ck = "⊉", fk = "⫆̸", pk = "≹", dk = "Ñ", vk = "ñ", hk = "≸", mk = "⋪", gk = "⋬", bk = "⋫", yk = "⋭", wk = "Ν", Dk = "ν", xk = "#", kk = "№", Ak = " ", Ek = "≍⃒", Sk = "⊬", Ck = "⊭", _k = "⊮", qk = "⊯", Tk = "≥⃒", $k = ">⃒", Lk = "⤄", Ok = "⧞", Rk = "⤂", Nk = "≤⃒", Pk = "<⃒", Fk = "⊴⃒", Bk = "⤃", Uk = "⊵⃒", jk = "∼⃒", Ik = "⤣", Mk = "↖", zk = "⇖", Hk = "↖", Gk = "⤧", Vk = "Ó", Wk = "ó", Zk = "⊛", Jk = "Ô", Kk = "ô", Xk = "⊚", Yk = "О", Qk = "о", eA = "⊝", rA = "Ő", tA = "ő", aA = "⨸", nA = "⊙", iA = "⦼", oA = "Œ", sA = "œ", lA = "⦿", uA = "𝔒", cA = "𝔬", fA = "˛", pA = "Ò", dA = "ò", vA = "⧁", hA = "⦵", mA = "Ω", gA = "∮", bA = "↺", yA = "⦾", wA = "⦻", DA = "‾", xA = "⧀", kA = "Ō", AA = "ō", EA = "Ω", SA = "ω", CA = "Ο", _A = "ο", qA = "⦶", TA = "⊖", $A = "𝕆", LA = "𝕠", OA = "⦷", RA = "“", NA = "‘", PA = "⦹", FA = "⊕", BA = "↻", UA = "⩔", jA = "∨", IA = "⩝", MA = "ℴ", zA = "ℴ", HA = "ª", GA = "º", VA = "⊶", WA = "⩖", ZA = "⩗", JA = "⩛", KA = "Ⓢ", XA = "𝒪", YA = "ℴ", QA = "Ø", eE = "ø", rE = "⊘", tE = "Õ", aE = "õ", nE = "⨶", iE = "⨷", oE = "⊗", sE = "Ö", lE = "ö", uE = "⌽", cE = "‾", fE = "⏞", pE = "⎴", dE = "⏜", vE = "¶", hE = "∥", mE = "∥", gE = "⫳", bE = "⫽", yE = "∂", wE = "∂", DE = "П", xE = "п", kE = "%", AE = ".", EE = "‰", SE = "⊥", CE = "‱", _E = "𝔓", qE = "𝔭", TE = "Φ", $E = "φ", LE = "ϕ", OE = "ℳ", RE = "☎", NE = "Π", PE = "π", FE = "⋔", BE = "ϖ", UE = "ℏ", jE = "ℎ", IE = "ℏ", ME = "⨣", zE = "⊞", HE = "⨢", GE = "+", VE = "∔", WE = "⨥", ZE = "⩲", JE = "±", KE = "±", XE = "⨦", YE = "⨧", QE = "±", eS = "ℌ", rS = "⨕", tS = "𝕡", aS = "ℙ", nS = "£", iS = "⪷", oS = "⪻", sS = "≺", lS = "≼", uS = "⪷", cS = "≺", fS = "≼", pS = "≺", dS = "⪯", vS = "≼", hS = "≾", mS = "⪯", gS = "⪹", bS = "⪵", yS = "⋨", wS = "⪯", DS = "⪳", xS = "≾", kS = "′", AS = "″", ES = "ℙ", SS = "⪹", CS = "⪵", _S = "⋨", qS = "∏", TS = "∏", $S = "⌮", LS = "⌒", OS = "⌓", RS = "∝", NS = "∝", PS = "∷", FS = "∝", BS = "≾", US = "⊰", jS = "𝒫", IS = "𝓅", MS = "Ψ", zS = "ψ", HS = " ", GS = "𝔔", VS = "𝔮", WS = "⨌", ZS = "𝕢", JS = "ℚ", KS = "⁗", XS = "𝒬", YS = "𝓆", QS = "ℍ", e3 = "⨖", r3 = "?", t3 = "≟", a3 = '"', n3 = '"', i3 = "⇛", o3 = "∽̱", s3 = "Ŕ", l3 = "ŕ", u3 = "√", c3 = "⦳", f3 = "⟩", p3 = "⟫", d3 = "⦒", v3 = "⦥", h3 = "⟩", m3 = "»", g3 = "⥵", b3 = "⇥", y3 = "⤠", w3 = "⤳", D3 = "→", x3 = "↠", k3 = "⇒", A3 = "⤞", E3 = "↪", S3 = "↬", C3 = "⥅", _3 = "⥴", q3 = "⤖", T3 = "↣", $3 = "↝", L3 = "⤚", O3 = "⤜", R3 = "∶", N3 = "ℚ", P3 = "⤍", F3 = "⤏", B3 = "⤐", U3 = "❳", j3 = "}", I3 = "]", M3 = "⦌", z3 = "⦎", H3 = "⦐", G3 = "Ř", V3 = "ř", W3 = "Ŗ", Z3 = "ŗ", J3 = "⌉", K3 = "}", X3 = "Р", Y3 = "р", Q3 = "⤷", eC = "⥩", rC = "”", tC = "”", aC = "↳", nC = "ℜ", iC = "ℛ", oC = "ℜ", sC = "ℝ", lC = "ℜ", uC = "▭", cC = "®", fC = "®", pC = "∋", dC = "⇋", vC = "⥯", hC = "⥽", mC = "⌋", gC = "𝔯", bC = "ℜ", yC = "⥤", wC = "⇁", DC = "⇀", xC = "⥬", kC = "Ρ", AC = "ρ", EC = "ϱ", SC = "⟩", CC = "⇥", _C = "→", qC = "→", TC = "⇒", $C = "⇄", LC = "↣", OC = "⌉", RC = "⟧", NC = "⥝", PC = "⥕", FC = "⇂", BC = "⌋", UC = "⇁", jC = "⇀", IC = "⇄", MC = "⇌", zC = "⇉", HC = "↝", GC = "↦", VC = "⊢", WC = "⥛", ZC = "⋌", JC = "⧐", KC = "⊳", XC = "⊵", YC = "⥏", QC = "⥜", e_ = "⥔", r_ = "↾", t_ = "⥓", a_ = "⇀", n_ = "˚", i_ = "≓", o_ = "⇄", s_ = "⇌", l_ = "‏", u_ = "⎱", c_ = "⎱", f_ = "⫮", p_ = "⟭", d_ = "⇾", v_ = "⟧", h_ = "⦆", m_ = "𝕣", g_ = "ℝ", b_ = "⨮", y_ = "⨵", w_ = "⥰", D_ = ")", x_ = "⦔", k_ = "⨒", A_ = "⇉", E_ = "⇛", S_ = "›", C_ = "𝓇", __ = "ℛ", q_ = "↱", T_ = "↱", $_ = "]", L_ = "’", O_ = "’", R_ = "⋌", N_ = "⋊", P_ = "▹", F_ = "⊵", B_ = "▸", U_ = "⧎", j_ = "⧴", I_ = "⥨", M_ = "℞", z_ = "Ś", H_ = "ś", G_ = "‚", V_ = "⪸", W_ = "Š", Z_ = "š", J_ = "⪼", K_ = "≻", X_ = "≽", Y_ = "⪰", Q_ = "⪴", eq = "Ş", rq = "ş", tq = "Ŝ", aq = "ŝ", nq = "⪺", iq = "⪶", oq = "⋩", sq = "⨓", lq = "≿", uq = "С", cq = "с", fq = "⊡", pq = "⋅", dq = "⩦", vq = "⤥", hq = "↘", mq = "⇘", gq = "↘", bq = "§", yq = ";", wq = "⤩", Dq = "∖", xq = "∖", kq = "✶", Aq = "𝔖", Eq = "𝔰", Sq = "⌢", Cq = "♯", _q = "Щ", qq = "щ", Tq = "Ш", $q = "ш", Lq = "↓", Oq = "←", Rq = "∣", Nq = "∥", Pq = "→", Fq = "↑", Bq = "­", Uq = "Σ", jq = "σ", Iq = "ς", Mq = "ς", zq = "∼", Hq = "⩪", Gq = "≃", Vq = "≃", Wq = "⪞", Zq = "⪠", Jq = "⪝", Kq = "⪟", Xq = "≆", Yq = "⨤", Qq = "⥲", eT = "←", rT = "∘", tT = "∖", aT = "⨳", nT = "⧤", iT = "∣", oT = "⌣", sT = "⪪", lT = "⪬", uT = "⪬︀", cT = "Ь", fT = "ь", pT = "⌿", dT = "⧄", vT = "/", hT = "𝕊", mT = "𝕤", gT = "♠", bT = "♠", yT = "∥", wT = "⊓", DT = "⊓︀", xT = "⊔", kT = "⊔︀", AT = "√", ET = "⊏", ST = "⊑", CT = "⊏", _T = "⊑", qT = "⊐", TT = "⊒", $T = "⊐", LT = "⊒", OT = "□", RT = "□", NT = "⊓", PT = "⊏", FT = "⊑", BT = "⊐", UT = "⊒", jT = "⊔", IT = "▪", MT = "□", zT = "▪", HT = "→", GT = "𝒮", VT = "𝓈", WT = "∖", ZT = "⌣", JT = "⋆", KT = "⋆", XT = "☆", YT = "★", QT = "ϵ", e$ = "ϕ", r$ = "¯", t$ = "⊂", a$ = "⋐", n$ = "⪽", i$ = "⫅", o$ = "⊆", s$ = "⫃", l$ = "⫁", u$ = "⫋", c$ = "⊊", f$ = "⪿", p$ = "⥹", d$ = "⊂", v$ = "⋐", h$ = "⊆", m$ = "⫅", g$ = "⊆", b$ = "⊊", y$ = "⫋", w$ = "⫇", D$ = "⫕", x$ = "⫓", k$ = "⪸", A$ = "≻", E$ = "≽", S$ = "≻", C$ = "⪰", _$ = "≽", q$ = "≿", T$ = "⪰", $$ = "⪺", L$ = "⪶", O$ = "⋩", R$ = "≿", N$ = "∋", P$ = "∑", F$ = "∑", B$ = "♪", U$ = "¹", j$ = "²", I$ = "³", M$ = "⊃", z$ = "⋑", H$ = "⪾", G$ = "⫘", V$ = "⫆", W$ = "⊇", Z$ = "⫄", J$ = "⊃", K$ = "⊇", X$ = "⟉", Y$ = "⫗", Q$ = "⥻", eL = "⫂", rL = "⫌", tL = "⊋", aL = "⫀", nL = "⊃", iL = "⋑", oL = "⊇", sL = "⫆", lL = "⊋", uL = "⫌", cL = "⫈", fL = "⫔", pL = "⫖", dL = "⤦", vL = "↙", hL = "⇙", mL = "↙", gL = "⤪", bL = "ß", yL = "	", wL = "⌖", DL = "Τ", xL = "τ", kL = "⎴", AL = "Ť", EL = "ť", SL = "Ţ", CL = "ţ", _L = "Т", qL = "т", TL = "⃛", $L = "⌕", LL = "𝔗", OL = "𝔱", RL = "∴", NL = "∴", PL = "∴", FL = "Θ", BL = "θ", UL = "ϑ", jL = "ϑ", IL = "≈", ML = "∼", zL = "  ", HL = " ", GL = " ", VL = "≈", WL = "∼", ZL = "Þ", JL = "þ", KL = "˜", XL = "∼", YL = "≃", QL = "≅", e8 = "≈", r8 = "⨱", t8 = "⊠", a8 = "×", n8 = "⨰", i8 = "∭", o8 = "⤨", s8 = "⌶", l8 = "⫱", u8 = "⊤", c8 = "𝕋", f8 = "𝕥", p8 = "⫚", d8 = "⤩", v8 = "‴", h8 = "™", m8 = "™", g8 = "▵", b8 = "▿", y8 = "◃", w8 = "⊴", D8 = "≜", x8 = "▹", k8 = "⊵", A8 = "◬", E8 = "≜", S8 = "⨺", C8 = "⃛", _8 = "⨹", q8 = "⧍", T8 = "⨻", $8 = "⏢", L8 = "𝒯", O8 = "𝓉", R8 = "Ц", N8 = "ц", P8 = "Ћ", F8 = "ћ", B8 = "Ŧ", U8 = "ŧ", j8 = "≬", I8 = "↞", M8 = "↠", z8 = "Ú", H8 = "ú", G8 = "↑", V8 = "↟", W8 = "⇑", Z8 = "⥉", J8 = "Ў", K8 = "ў", X8 = "Ŭ", Y8 = "ŭ", Q8 = "Û", e4 = "û", r4 = "У", t4 = "у", a4 = "⇅", n4 = "Ű", i4 = "ű", o4 = "⥮", s4 = "⥾", l4 = "𝔘", u4 = "𝔲", c4 = "Ù", f4 = "ù", p4 = "⥣", d4 = "↿", v4 = "↾", h4 = "▀", m4 = "⌜", g4 = "⌜", b4 = "⌏", y4 = "◸", w4 = "Ū", D4 = "ū", x4 = "¨", k4 = "_", A4 = "⏟", E4 = "⎵", S4 = "⏝", C4 = "⋃", _4 = "⊎", q4 = "Ų", T4 = "ų", $4 = "𝕌", L4 = "𝕦", O4 = "⤒", R4 = "↑", N4 = "↑", P4 = "⇑", F4 = "⇅", B4 = "↕", U4 = "↕", j4 = "⇕", I4 = "⥮", M4 = "↿", z4 = "↾", H4 = "⊎", G4 = "↖", V4 = "↗", W4 = "υ", Z4 = "ϒ", J4 = "ϒ", K4 = "Υ", X4 = "υ", Y4 = "↥", Q4 = "⊥", eO = "⇈", rO = "⌝", tO = "⌝", aO = "⌎", nO = "Ů", iO = "ů", oO = "◹", sO = "𝒰", lO = "𝓊", uO = "⋰", cO = "Ũ", fO = "ũ", pO = "▵", dO = "▴", vO = "⇈", hO = "Ü", mO = "ü", gO = "⦧", bO = "⦜", yO = "ϵ", wO = "ϰ", DO = "∅", xO = "ϕ", kO = "ϖ", AO = "∝", EO = "↕", SO = "⇕", CO = "ϱ", _O = "ς", qO = "⊊︀", TO = "⫋︀", $O = "⊋︀", LO = "⫌︀", OO = "ϑ", RO = "⊲", NO = "⊳", PO = "⫨", FO = "⫫", BO = "⫩", UO = "В", jO = "в", IO = "⊢", MO = "⊨", zO = "⊩", HO = "⊫", GO = "⫦", VO = "⊻", WO = "∨", ZO = "⋁", JO = "≚", KO = "⋮", XO = "|", YO = "‖", QO = "|", eR = "‖", rR = "∣", tR = "|", aR = "❘", nR = "≀", iR = " ", oR = "𝔙", sR = "𝔳", lR = "⊲", uR = "⊂⃒", cR = "⊃⃒", fR = "𝕍", pR = "𝕧", dR = "∝", vR = "⊳", hR = "𝒱", mR = "𝓋", gR = "⫋︀", bR = "⊊︀", yR = "⫌︀", wR = "⊋︀", DR = "⊪", xR = "⦚", kR = "Ŵ", AR = "ŵ", ER = "⩟", SR = "∧", CR = "⋀", _R = "≙", qR = "℘", TR = "𝔚", $R = "𝔴", LR = "𝕎", OR = "𝕨", RR = "℘", NR = "≀", PR = "≀", FR = "𝒲", BR = "𝓌", UR = "⋂", jR = "◯", IR = "⋃", MR = "▽", zR = "𝔛", HR = "𝔵", GR = "⟷", VR = "⟺", WR = "Ξ", ZR = "ξ", JR = "⟵", KR = "⟸", XR = "⟼", YR = "⋻", QR = "⨀", eN = "𝕏", rN = "𝕩", tN = "⨁", aN = "⨂", nN = "⟶", iN = "⟹", oN = "𝒳", sN = "𝓍", lN = "⨆", uN = "⨄", cN = "△", fN = "⋁", pN = "⋀", dN = "Ý", vN = "ý", hN = "Я", mN = "я", gN = "Ŷ", bN = "ŷ", yN = "Ы", wN = "ы", DN = "¥", xN = "𝔜", kN = "𝔶", AN = "Ї", EN = "ї", SN = "𝕐", CN = "𝕪", _N = "𝒴", qN = "𝓎", TN = "Ю", $N = "ю", LN = "ÿ", ON = "Ÿ", RN = "Ź", NN = "ź", PN = "Ž", FN = "ž", BN = "З", UN = "з", jN = "Ż", IN = "ż", MN = "ℨ", zN = "​", HN = "Ζ", GN = "ζ", VN = "𝔷", WN = "ℨ", ZN = "Ж", JN = "ж", KN = "⇝", XN = "𝕫", YN = "ℤ", QN = "𝒵", eP = "𝓏", rP = "‍", tP = "‌", zB = {
        Aacute: A,
        aacute: g,
        Abreve: S,
        abreve: q,
        ac: P,
        acd: R,
        acE: L,
        Acirc: U,
        acirc: j,
        acute: z,
        Acy: ae,
        acy: ne,
        AElig: ge,
        aelig: se,
        af: ee,
        Afr: ue,
        afr: J,
        Agrave: W,
        agrave: te,
        alefsym: re,
        aleph: le,
        Alpha: m,
        alpha: D,
        Amacr: _,
        amacr: B,
        amalg: H,
        amp: Z,
        AMP: M,
        andand: I,
        And: K,
        and: ce,
        andd: we,
        andslope: Pe,
        andv: Ce,
        ang: Fe,
        ange: ir,
        angle: Cr,
        angmsdaa: _r,
        angmsdab: C,
        angmsdac: qr,
        angmsdad: Yr,
        angmsdae: Aa,
        angmsdaf: Ea,
        angmsdag: Sa,
        angmsdah: Ca,
        angmsd: _a,
        angrt: qa,
        angrtvb: Ta,
        angrtvbd: $a,
        angsph: La,
        angst: Oa,
        angzarr: Ra,
        Aogon: Na,
        aogon: Pa,
        Aopf: Fa,
        aopf: Ba,
        apacir: Ua,
        ap: ja,
        apE: Ia,
        ape: Ma,
        apid: za,
        apos: Ha,
        ApplyFunction: Ga,
        approx: Va,
        approxeq: Wa,
        Aring: Za,
        aring: Ja,
        Ascr: Ka,
        ascr: Xa,
        Assign: Ya,
        ast: Qa,
        asymp: en,
        asympeq: rn,
        Atilde: tn,
        atilde: an,
        Auml: nn,
        auml: on,
        awconint: sn,
        awint: ln,
        backcong: un,
        backepsilon: cn,
        backprime: fn,
        backsim: pn,
        backsimeq: dn,
        Backslash: vn,
        Barv: hn,
        barvee: mn,
        barwed: gn,
        Barwed: bn,
        barwedge: yn,
        bbrk: wn,
        bbrktbrk: Dn,
        bcong: xn,
        Bcy: kn,
        bcy: An,
        bdquo: En,
        becaus: Sn,
        because: Cn,
        Because: _n,
        bemptyv: qn,
        bepsi: Tn,
        bernou: $n,
        Bernoullis: Ln,
        Beta: On,
        beta: Rn,
        beth: Nn,
        between: Pn,
        Bfr: Fn,
        bfr: Bn,
        bigcap: Un,
        bigcirc: jn,
        bigcup: In,
        bigodot: Mn,
        bigoplus: zn,
        bigotimes: Hn,
        bigsqcup: Gn,
        bigstar: Vn,
        bigtriangledown: Wn,
        bigtriangleup: Zn,
        biguplus: Jn,
        bigvee: Kn,
        bigwedge: Xn,
        bkarow: Yn,
        blacklozenge: Qn,
        blacksquare: ei,
        blacktriangle: ri,
        blacktriangledown: ti,
        blacktriangleleft: ai,
        blacktriangleright: ni,
        blank: ii,
        blk12: oi,
        blk14: si,
        blk34: li,
        block: ui,
        bne: ci,
        bnequiv: fi,
        bNot: pi,
        bnot: di,
        Bopf: vi,
        bopf: hi,
        bot: mi,
        bottom: gi,
        bowtie: bi,
        boxbox: yi,
        boxdl: wi,
        boxdL: Di,
        boxDl: xi,
        boxDL: ki,
        boxdr: Ai,
        boxdR: Ei,
        boxDr: Si,
        boxDR: Ci,
        boxh: _i,
        boxH: qi,
        boxhd: Ti,
        boxHd: $i,
        boxhD: Li,
        boxHD: Oi,
        boxhu: Ri,
        boxHu: Ni,
        boxhU: Pi,
        boxHU: Fi,
        boxminus: Bi,
        boxplus: Ui,
        boxtimes: ji,
        boxul: Ii,
        boxuL: Mi,
        boxUl: zi,
        boxUL: Hi,
        boxur: Gi,
        boxuR: Vi,
        boxUr: Wi,
        boxUR: Zi,
        boxv: Ji,
        boxV: Ki,
        boxvh: Xi,
        boxvH: Yi,
        boxVh: Qi,
        boxVH: eo,
        boxvl: ro,
        boxvL: to,
        boxVl: ao,
        boxVL: no,
        boxvr: io,
        boxvR: oo,
        boxVr: so,
        boxVR: lo,
        bprime: uo,
        breve: co,
        Breve: fo,
        brvbar: po,
        bscr: vo,
        Bscr: ho,
        bsemi: mo,
        bsim: go,
        bsime: bo,
        bsolb: yo,
        bsol: wo,
        bsolhsub: Do,
        bull: xo,
        bullet: ko,
        bump: Ao,
        bumpE: Eo,
        bumpe: So,
        Bumpeq: Co,
        bumpeq: _o,
        Cacute: qo,
        cacute: To,
        capand: $o,
        capbrcup: Lo,
        capcap: Oo,
        cap: Ro,
        Cap: No,
        capcup: Po,
        capdot: Fo,
        CapitalDifferentialD: Bo,
        caps: Uo,
        caret: jo,
        caron: Io,
        Cayleys: Mo,
        ccaps: zo,
        Ccaron: Ho,
        ccaron: Go,
        Ccedil: Vo,
        ccedil: Wo,
        Ccirc: Zo,
        ccirc: Jo,
        Cconint: Ko,
        ccups: Xo,
        ccupssm: Yo,
        Cdot: Qo,
        cdot: es,
        cedil: rs,
        Cedilla: ts,
        cemptyv: as,
        cent: ns,
        centerdot: is,
        CenterDot: os,
        cfr: ss,
        Cfr: ls,
        CHcy: us,
        chcy: cs,
        check: fs,
        checkmark: ps,
        Chi: ds,
        chi: vs,
        circ: hs,
        circeq: ms,
        circlearrowleft: gs,
        circlearrowright: bs,
        circledast: ys,
        circledcirc: ws,
        circleddash: Ds,
        CircleDot: xs,
        circledR: ks,
        circledS: As,
        CircleMinus: Es,
        CirclePlus: Ss,
        CircleTimes: Cs,
        cir: _s,
        cirE: qs,
        cire: Ts,
        cirfnint: $s,
        cirmid: Ls,
        cirscir: Os,
        ClockwiseContourIntegral: Rs,
        CloseCurlyDoubleQuote: Ns,
        CloseCurlyQuote: Ps,
        clubs: Fs,
        clubsuit: Bs,
        colon: Us,
        Colon: js,
        Colone: Is,
        colone: Ms,
        coloneq: zs,
        comma: Hs,
        commat: Gs,
        comp: Vs,
        compfn: Ws,
        complement: Zs,
        complexes: Js,
        cong: Ks,
        congdot: Xs,
        Congruent: Ys,
        conint: Qs,
        Conint: el,
        ContourIntegral: rl,
        copf: tl,
        Copf: al,
        coprod: nl,
        Coproduct: il,
        copy: ol,
        COPY: sl,
        copysr: ll,
        CounterClockwiseContourIntegral: ul,
        crarr: cl,
        cross: fl,
        Cross: pl,
        Cscr: dl,
        cscr: vl,
        csub: hl,
        csube: ml,
        csup: gl,
        csupe: bl,
        ctdot: yl,
        cudarrl: wl,
        cudarrr: Dl,
        cuepr: xl,
        cuesc: kl,
        cularr: Al,
        cularrp: El,
        cupbrcap: Sl,
        cupcap: Cl,
        CupCap: _l,
        cup: ql,
        Cup: Tl,
        cupcup: $l,
        cupdot: Ll,
        cupor: Ol,
        cups: Rl,
        curarr: Nl,
        curarrm: Pl,
        curlyeqprec: Fl,
        curlyeqsucc: Bl,
        curlyvee: Ul,
        curlywedge: jl,
        curren: Il,
        curvearrowleft: Ml,
        curvearrowright: zl,
        cuvee: Hl,
        cuwed: Gl,
        cwconint: Vl,
        cwint: Wl,
        cylcty: Zl,
        dagger: Jl,
        Dagger: Kl,
        daleth: Xl,
        darr: Yl,
        Darr: Ql,
        dArr: eu,
        dash: ru,
        Dashv: tu,
        dashv: au,
        dbkarow: nu,
        dblac: iu,
        Dcaron: ou,
        dcaron: su,
        Dcy: lu,
        dcy: uu,
        ddagger: cu,
        ddarr: fu,
        DD: pu,
        dd: du,
        DDotrahd: vu,
        ddotseq: hu,
        deg: mu,
        Del: gu,
        Delta: bu,
        delta: yu,
        demptyv: wu,
        dfisht: Du,
        Dfr: xu,
        dfr: ku,
        dHar: Au,
        dharl: Eu,
        dharr: Su,
        DiacriticalAcute: Cu,
        DiacriticalDot: _u,
        DiacriticalDoubleAcute: qu,
        DiacriticalGrave: Tu,
        DiacriticalTilde: $u,
        diam: Lu,
        diamond: Ou,
        Diamond: Ru,
        diamondsuit: Nu,
        diams: Pu,
        die: Fu,
        DifferentialD: Bu,
        digamma: Uu,
        disin: ju,
        div: Iu,
        divide: Mu,
        divideontimes: zu,
        divonx: Hu,
        DJcy: Gu,
        djcy: Vu,
        dlcorn: Wu,
        dlcrop: Zu,
        dollar: Ju,
        Dopf: Ku,
        dopf: Xu,
        Dot: Yu,
        dot: Qu,
        DotDot: ec,
        doteq: rc,
        doteqdot: tc,
        DotEqual: ac,
        dotminus: nc,
        dotplus: ic,
        dotsquare: oc,
        doublebarwedge: sc,
        DoubleContourIntegral: lc,
        DoubleDot: uc,
        DoubleDownArrow: cc,
        DoubleLeftArrow: fc,
        DoubleLeftRightArrow: pc,
        DoubleLeftTee: dc,
        DoubleLongLeftArrow: vc,
        DoubleLongLeftRightArrow: hc,
        DoubleLongRightArrow: mc,
        DoubleRightArrow: gc,
        DoubleRightTee: bc,
        DoubleUpArrow: yc,
        DoubleUpDownArrow: wc,
        DoubleVerticalBar: Dc,
        DownArrowBar: xc,
        downarrow: kc,
        DownArrow: Ac,
        Downarrow: Ec,
        DownArrowUpArrow: Sc,
        DownBreve: Cc,
        downdownarrows: _c,
        downharpoonleft: qc,
        downharpoonright: Tc,
        DownLeftRightVector: $c,
        DownLeftTeeVector: Lc,
        DownLeftVectorBar: Oc,
        DownLeftVector: Rc,
        DownRightTeeVector: Nc,
        DownRightVectorBar: Pc,
        DownRightVector: Fc,
        DownTeeArrow: Bc,
        DownTee: Uc,
        drbkarow: jc,
        drcorn: Ic,
        drcrop: Mc,
        Dscr: zc,
        dscr: Hc,
        DScy: Gc,
        dscy: Vc,
        dsol: Wc,
        Dstrok: Zc,
        dstrok: Jc,
        dtdot: Kc,
        dtri: Xc,
        dtrif: Yc,
        duarr: Qc,
        duhar: ef,
        dwangle: rf,
        DZcy: tf,
        dzcy: af,
        dzigrarr: nf,
        Eacute: of,
        eacute: sf,
        easter: lf,
        Ecaron: uf,
        ecaron: cf,
        Ecirc: ff,
        ecirc: pf,
        ecir: df,
        ecolon: vf,
        Ecy: hf,
        ecy: mf,
        eDDot: gf,
        Edot: bf,
        edot: yf,
        eDot: wf,
        ee: Df,
        efDot: xf,
        Efr: kf,
        efr: Af,
        eg: Ef,
        Egrave: Sf,
        egrave: Cf,
        egs: _f,
        egsdot: qf,
        el: Tf,
        Element: $f,
        elinters: Lf,
        ell: Of,
        els: Rf,
        elsdot: Nf,
        Emacr: Pf,
        emacr: Ff,
        empty: Bf,
        emptyset: Uf,
        EmptySmallSquare: jf,
        emptyv: If,
        EmptyVerySmallSquare: Mf,
        emsp13: zf,
        emsp14: Hf,
        emsp: Gf,
        ENG: Vf,
        eng: Wf,
        ensp: Zf,
        Eogon: Jf,
        eogon: Kf,
        Eopf: Xf,
        eopf: Yf,
        epar: Qf,
        eparsl: ep,
        eplus: rp,
        epsi: tp,
        Epsilon: ap,
        epsilon: np,
        epsiv: ip,
        eqcirc: op,
        eqcolon: sp,
        eqsim: lp,
        eqslantgtr: up,
        eqslantless: cp,
        Equal: fp,
        equals: pp,
        EqualTilde: dp,
        equest: vp,
        Equilibrium: hp,
        equiv: mp,
        equivDD: gp,
        eqvparsl: bp,
        erarr: yp,
        erDot: wp,
        escr: Dp,
        Escr: xp,
        esdot: kp,
        Esim: Ap,
        esim: Ep,
        Eta: Sp,
        eta: Cp,
        ETH: _p,
        eth: qp,
        Euml: Tp,
        euml: $p,
        euro: Lp,
        excl: Op,
        exist: Rp,
        Exists: Np,
        expectation: Pp,
        exponentiale: Fp,
        ExponentialE: Bp,
        fallingdotseq: Up,
        Fcy: jp,
        fcy: Ip,
        female: Mp,
        ffilig: zp,
        fflig: Hp,
        ffllig: Gp,
        Ffr: Vp,
        ffr: Wp,
        filig: Zp,
        FilledSmallSquare: Jp,
        FilledVerySmallSquare: Kp,
        fjlig: Xp,
        flat: Yp,
        fllig: Qp,
        fltns: ed,
        fnof: rd,
        Fopf: td,
        fopf: ad,
        forall: nd,
        ForAll: id,
        fork: od,
        forkv: sd,
        Fouriertrf: ld,
        fpartint: ud,
        frac12: cd,
        frac13: fd,
        frac14: pd,
        frac15: dd,
        frac16: vd,
        frac18: hd,
        frac23: md,
        frac25: gd,
        frac34: bd,
        frac35: yd,
        frac38: wd,
        frac45: Dd,
        frac56: xd,
        frac58: kd,
        frac78: Ad,
        frasl: Ed,
        frown: Sd,
        fscr: Cd,
        Fscr: _d,
        gacute: qd,
        Gamma: Td,
        gamma: $d,
        Gammad: Ld,
        gammad: Od,
        gap: Rd,
        Gbreve: Nd,
        gbreve: Pd,
        Gcedil: Fd,
        Gcirc: Bd,
        gcirc: Ud,
        Gcy: jd,
        gcy: Id,
        Gdot: Md,
        gdot: zd,
        ge: Hd,
        gE: Gd,
        gEl: Vd,
        gel: Wd,
        geq: Zd,
        geqq: Jd,
        geqslant: Kd,
        gescc: Xd,
        ges: Yd,
        gesdot: Qd,
        gesdoto: ev,
        gesdotol: rv,
        gesl: tv,
        gesles: av,
        Gfr: nv,
        gfr: iv,
        gg: ov,
        Gg: sv,
        ggg: lv,
        gimel: uv,
        GJcy: cv,
        gjcy: fv,
        gla: pv,
        gl: dv,
        glE: vv,
        glj: hv,
        gnap: mv,
        gnapprox: gv,
        gne: bv,
        gnE: yv,
        gneq: wv,
        gneqq: Dv,
        gnsim: xv,
        Gopf: kv,
        gopf: Av,
        grave: Ev,
        GreaterEqual: Sv,
        GreaterEqualLess: Cv,
        GreaterFullEqual: _v,
        GreaterGreater: qv,
        GreaterLess: Tv,
        GreaterSlantEqual: $v,
        GreaterTilde: Lv,
        Gscr: Ov,
        gscr: Rv,
        gsim: Nv,
        gsime: Pv,
        gsiml: Fv,
        gtcc: Bv,
        gtcir: Uv,
        gt: jv,
        GT: Iv,
        Gt: Mv,
        gtdot: zv,
        gtlPar: Hv,
        gtquest: Gv,
        gtrapprox: Vv,
        gtrarr: Wv,
        gtrdot: Zv,
        gtreqless: Jv,
        gtreqqless: Kv,
        gtrless: Xv,
        gtrsim: Yv,
        gvertneqq: Qv,
        gvnE: eh,
        Hacek: rh,
        hairsp: th,
        half: ah,
        hamilt: nh,
        HARDcy: ih,
        hardcy: oh,
        harrcir: sh,
        harr: lh,
        hArr: uh,
        harrw: ch,
        Hat: fh,
        hbar: ph,
        Hcirc: dh,
        hcirc: vh,
        hearts: hh,
        heartsuit: mh,
        hellip: gh,
        hercon: bh,
        hfr: yh,
        Hfr: wh,
        HilbertSpace: Dh,
        hksearow: xh,
        hkswarow: kh,
        hoarr: Ah,
        homtht: Eh,
        hookleftarrow: Sh,
        hookrightarrow: Ch,
        hopf: _h,
        Hopf: qh,
        horbar: Th,
        HorizontalLine: $h,
        hscr: Lh,
        Hscr: Oh,
        hslash: Rh,
        Hstrok: Nh,
        hstrok: Ph,
        HumpDownHump: Fh,
        HumpEqual: Bh,
        hybull: Uh,
        hyphen: jh,
        Iacute: Ih,
        iacute: Mh,
        ic: zh,
        Icirc: Hh,
        icirc: Gh,
        Icy: Vh,
        icy: Wh,
        Idot: Zh,
        IEcy: Jh,
        iecy: Kh,
        iexcl: Xh,
        iff: Yh,
        ifr: Qh,
        Ifr: em,
        Igrave: rm,
        igrave: tm,
        ii: am,
        iiiint: nm,
        iiint: im,
        iinfin: om,
        iiota: sm,
        IJlig: lm,
        ijlig: um,
        Imacr: cm,
        imacr: fm,
        image: pm,
        ImaginaryI: dm,
        imagline: vm,
        imagpart: hm,
        imath: mm,
        Im: gm,
        imof: bm,
        imped: ym,
        Implies: wm,
        incare: Dm,
        in: "∈",
        infin: xm,
        infintie: km,
        inodot: Am,
        intcal: Em,
        int: Sm,
        Int: Cm,
        integers: _m,
        Integral: qm,
        intercal: Tm,
        Intersection: $m,
        intlarhk: Lm,
        intprod: Om,
        InvisibleComma: Rm,
        InvisibleTimes: Nm,
        IOcy: Pm,
        iocy: Fm,
        Iogon: Bm,
        iogon: Um,
        Iopf: jm,
        iopf: Im,
        Iota: Mm,
        iota: zm,
        iprod: Hm,
        iquest: Gm,
        iscr: Vm,
        Iscr: Wm,
        isin: Zm,
        isindot: Jm,
        isinE: Km,
        isins: Xm,
        isinsv: Ym,
        isinv: Qm,
        it: eg,
        Itilde: rg,
        itilde: tg,
        Iukcy: ag,
        iukcy: ng,
        Iuml: ig,
        iuml: og,
        Jcirc: sg,
        jcirc: lg,
        Jcy: ug,
        jcy: cg,
        Jfr: fg,
        jfr: pg,
        jmath: dg,
        Jopf: vg,
        jopf: hg,
        Jscr: mg,
        jscr: gg,
        Jsercy: bg,
        jsercy: yg,
        Jukcy: wg,
        jukcy: Dg,
        Kappa: xg,
        kappa: kg,
        kappav: Ag,
        Kcedil: Eg,
        kcedil: Sg,
        Kcy: Cg,
        kcy: _g,
        Kfr: qg,
        kfr: Tg,
        kgreen: $g,
        KHcy: Lg,
        khcy: Og,
        KJcy: Rg,
        kjcy: Ng,
        Kopf: Pg,
        kopf: Fg,
        Kscr: Bg,
        kscr: Ug,
        lAarr: jg,
        Lacute: Ig,
        lacute: Mg,
        laemptyv: zg,
        lagran: Hg,
        Lambda: Gg,
        lambda: Vg,
        lang: Wg,
        Lang: Zg,
        langd: Jg,
        langle: Kg,
        lap: Xg,
        Laplacetrf: Yg,
        laquo: Qg,
        larrb: eb,
        larrbfs: rb,
        larr: tb,
        Larr: ab,
        lArr: nb,
        larrfs: ib,
        larrhk: ob,
        larrlp: sb,
        larrpl: lb,
        larrsim: ub,
        larrtl: cb,
        latail: fb,
        lAtail: pb,
        lat: db,
        late: vb,
        lates: hb,
        lbarr: mb,
        lBarr: gb,
        lbbrk: bb,
        lbrace: yb,
        lbrack: wb,
        lbrke: Db,
        lbrksld: xb,
        lbrkslu: kb,
        Lcaron: Ab,
        lcaron: Eb,
        Lcedil: Sb,
        lcedil: Cb,
        lceil: _b,
        lcub: qb,
        Lcy: Tb,
        lcy: $b,
        ldca: Lb,
        ldquo: Ob,
        ldquor: Rb,
        ldrdhar: Nb,
        ldrushar: Pb,
        ldsh: Fb,
        le: Bb,
        lE: Ub,
        LeftAngleBracket: jb,
        LeftArrowBar: Ib,
        leftarrow: Mb,
        LeftArrow: zb,
        Leftarrow: Hb,
        LeftArrowRightArrow: Gb,
        leftarrowtail: Vb,
        LeftCeiling: Wb,
        LeftDoubleBracket: Zb,
        LeftDownTeeVector: Jb,
        LeftDownVectorBar: Kb,
        LeftDownVector: Xb,
        LeftFloor: Yb,
        leftharpoondown: Qb,
        leftharpoonup: ey,
        leftleftarrows: ry,
        leftrightarrow: ty,
        LeftRightArrow: ay,
        Leftrightarrow: ny,
        leftrightarrows: iy,
        leftrightharpoons: oy,
        leftrightsquigarrow: sy,
        LeftRightVector: ly,
        LeftTeeArrow: uy,
        LeftTee: cy,
        LeftTeeVector: fy,
        leftthreetimes: py,
        LeftTriangleBar: dy,
        LeftTriangle: vy,
        LeftTriangleEqual: hy,
        LeftUpDownVector: my,
        LeftUpTeeVector: gy,
        LeftUpVectorBar: by,
        LeftUpVector: yy,
        LeftVectorBar: wy,
        LeftVector: Dy,
        lEg: xy,
        leg: ky,
        leq: Ay,
        leqq: Ey,
        leqslant: Sy,
        lescc: Cy,
        les: _y,
        lesdot: qy,
        lesdoto: Ty,
        lesdotor: $y,
        lesg: Ly,
        lesges: Oy,
        lessapprox: Ry,
        lessdot: Ny,
        lesseqgtr: Py,
        lesseqqgtr: Fy,
        LessEqualGreater: By,
        LessFullEqual: Uy,
        LessGreater: jy,
        lessgtr: Iy,
        LessLess: My,
        lesssim: zy,
        LessSlantEqual: Hy,
        LessTilde: Gy,
        lfisht: Vy,
        lfloor: Wy,
        Lfr: Zy,
        lfr: Jy,
        lg: Ky,
        lgE: Xy,
        lHar: Yy,
        lhard: Qy,
        lharu: e0,
        lharul: r0,
        lhblk: t0,
        LJcy: a0,
        ljcy: n0,
        llarr: i0,
        ll: o0,
        Ll: s0,
        llcorner: l0,
        Lleftarrow: u0,
        llhard: c0,
        lltri: f0,
        Lmidot: p0,
        lmidot: d0,
        lmoustache: v0,
        lmoust: h0,
        lnap: m0,
        lnapprox: g0,
        lne: b0,
        lnE: y0,
        lneq: w0,
        lneqq: D0,
        lnsim: x0,
        loang: k0,
        loarr: A0,
        lobrk: E0,
        longleftarrow: S0,
        LongLeftArrow: C0,
        Longleftarrow: _0,
        longleftrightarrow: q0,
        LongLeftRightArrow: T0,
        Longleftrightarrow: $0,
        longmapsto: L0,
        longrightarrow: O0,
        LongRightArrow: R0,
        Longrightarrow: N0,
        looparrowleft: P0,
        looparrowright: F0,
        lopar: B0,
        Lopf: U0,
        lopf: j0,
        loplus: I0,
        lotimes: M0,
        lowast: z0,
        lowbar: H0,
        LowerLeftArrow: G0,
        LowerRightArrow: V0,
        loz: W0,
        lozenge: Z0,
        lozf: J0,
        lpar: K0,
        lparlt: X0,
        lrarr: Y0,
        lrcorner: Q0,
        lrhar: e1,
        lrhard: r1,
        lrm: t1,
        lrtri: a1,
        lsaquo: n1,
        lscr: i1,
        Lscr: o1,
        lsh: s1,
        Lsh: l1,
        lsim: u1,
        lsime: c1,
        lsimg: f1,
        lsqb: p1,
        lsquo: d1,
        lsquor: v1,
        Lstrok: h1,
        lstrok: m1,
        ltcc: g1,
        ltcir: b1,
        lt: y1,
        LT: w1,
        Lt: D1,
        ltdot: x1,
        lthree: k1,
        ltimes: A1,
        ltlarr: E1,
        ltquest: S1,
        ltri: C1,
        ltrie: _1,
        ltrif: q1,
        ltrPar: T1,
        lurdshar: $1,
        luruhar: L1,
        lvertneqq: O1,
        lvnE: R1,
        macr: N1,
        male: P1,
        malt: F1,
        maltese: B1,
        Map: "⤅",
        map: U1,
        mapsto: j1,
        mapstodown: I1,
        mapstoleft: M1,
        mapstoup: z1,
        marker: H1,
        mcomma: G1,
        Mcy: V1,
        mcy: W1,
        mdash: Z1,
        mDDot: J1,
        measuredangle: K1,
        MediumSpace: X1,
        Mellintrf: Y1,
        Mfr: Q1,
        mfr: ew,
        mho: rw,
        micro: tw,
        midast: aw,
        midcir: nw,
        mid: iw,
        middot: ow,
        minusb: sw,
        minus: lw,
        minusd: uw,
        minusdu: cw,
        MinusPlus: fw,
        mlcp: pw,
        mldr: dw,
        mnplus: vw,
        models: hw,
        Mopf: mw,
        mopf: gw,
        mp: bw,
        mscr: yw,
        Mscr: ww,
        mstpos: Dw,
        Mu: xw,
        mu: kw,
        multimap: Aw,
        mumap: Ew,
        nabla: Sw,
        Nacute: Cw,
        nacute: _w,
        nang: qw,
        nap: Tw,
        napE: $w,
        napid: Lw,
        napos: Ow,
        napprox: Rw,
        natural: Nw,
        naturals: Pw,
        natur: Fw,
        nbsp: Bw,
        nbump: Uw,
        nbumpe: jw,
        ncap: Iw,
        Ncaron: Mw,
        ncaron: zw,
        Ncedil: Hw,
        ncedil: Gw,
        ncong: Vw,
        ncongdot: Ww,
        ncup: Zw,
        Ncy: Jw,
        ncy: Kw,
        ndash: Xw,
        nearhk: Yw,
        nearr: Qw,
        neArr: eD,
        nearrow: rD,
        ne: tD,
        nedot: aD,
        NegativeMediumSpace: nD,
        NegativeThickSpace: iD,
        NegativeThinSpace: oD,
        NegativeVeryThinSpace: sD,
        nequiv: lD,
        nesear: uD,
        nesim: cD,
        NestedGreaterGreater: fD,
        NestedLessLess: pD,
        NewLine: dD,
        nexist: vD,
        nexists: hD,
        Nfr: mD,
        nfr: gD,
        ngE: bD,
        nge: yD,
        ngeq: wD,
        ngeqq: DD,
        ngeqslant: xD,
        nges: kD,
        nGg: AD,
        ngsim: ED,
        nGt: SD,
        ngt: CD,
        ngtr: _D,
        nGtv: qD,
        nharr: TD,
        nhArr: $D,
        nhpar: LD,
        ni: OD,
        nis: RD,
        nisd: ND,
        niv: PD,
        NJcy: FD,
        njcy: BD,
        nlarr: UD,
        nlArr: jD,
        nldr: ID,
        nlE: MD,
        nle: zD,
        nleftarrow: HD,
        nLeftarrow: GD,
        nleftrightarrow: VD,
        nLeftrightarrow: WD,
        nleq: ZD,
        nleqq: JD,
        nleqslant: KD,
        nles: XD,
        nless: YD,
        nLl: QD,
        nlsim: e2,
        nLt: r2,
        nlt: t2,
        nltri: a2,
        nltrie: n2,
        nLtv: i2,
        nmid: o2,
        NoBreak: s2,
        NonBreakingSpace: l2,
        nopf: u2,
        Nopf: c2,
        Not: f2,
        not: p2,
        NotCongruent: d2,
        NotCupCap: v2,
        NotDoubleVerticalBar: h2,
        NotElement: m2,
        NotEqual: g2,
        NotEqualTilde: b2,
        NotExists: y2,
        NotGreater: w2,
        NotGreaterEqual: D2,
        NotGreaterFullEqual: x2,
        NotGreaterGreater: k2,
        NotGreaterLess: A2,
        NotGreaterSlantEqual: E2,
        NotGreaterTilde: S2,
        NotHumpDownHump: C2,
        NotHumpEqual: _2,
        notin: q2,
        notindot: T2,
        notinE: $2,
        notinva: L2,
        notinvb: O2,
        notinvc: R2,
        NotLeftTriangleBar: N2,
        NotLeftTriangle: P2,
        NotLeftTriangleEqual: F2,
        NotLess: B2,
        NotLessEqual: U2,
        NotLessGreater: j2,
        NotLessLess: I2,
        NotLessSlantEqual: M2,
        NotLessTilde: z2,
        NotNestedGreaterGreater: H2,
        NotNestedLessLess: G2,
        notni: V2,
        notniva: W2,
        notnivb: Z2,
        notnivc: J2,
        NotPrecedes: K2,
        NotPrecedesEqual: X2,
        NotPrecedesSlantEqual: Y2,
        NotReverseElement: Q2,
        NotRightTriangleBar: ex,
        NotRightTriangle: rx,
        NotRightTriangleEqual: tx,
        NotSquareSubset: ax,
        NotSquareSubsetEqual: nx,
        NotSquareSuperset: ix,
        NotSquareSupersetEqual: ox,
        NotSubset: sx,
        NotSubsetEqual: lx,
        NotSucceeds: ux,
        NotSucceedsEqual: cx,
        NotSucceedsSlantEqual: fx,
        NotSucceedsTilde: px,
        NotSuperset: dx,
        NotSupersetEqual: vx,
        NotTilde: hx,
        NotTildeEqual: mx,
        NotTildeFullEqual: gx,
        NotTildeTilde: bx,
        NotVerticalBar: yx,
        nparallel: wx,
        npar: Dx,
        nparsl: xx,
        npart: kx,
        npolint: Ax,
        npr: Ex,
        nprcue: Sx,
        nprec: Cx,
        npreceq: _x,
        npre: qx,
        nrarrc: Tx,
        nrarr: $x,
        nrArr: Lx,
        nrarrw: Ox,
        nrightarrow: Rx,
        nRightarrow: Nx,
        nrtri: Px,
        nrtrie: Fx,
        nsc: Bx,
        nsccue: Ux,
        nsce: jx,
        Nscr: Ix,
        nscr: Mx,
        nshortmid: zx,
        nshortparallel: Hx,
        nsim: Gx,
        nsime: Vx,
        nsimeq: Wx,
        nsmid: Zx,
        nspar: Jx,
        nsqsube: Kx,
        nsqsupe: Xx,
        nsub: Yx,
        nsubE: Qx,
        nsube: ek,
        nsubset: rk,
        nsubseteq: tk,
        nsubseteqq: ak,
        nsucc: nk,
        nsucceq: ik,
        nsup: ok,
        nsupE: sk,
        nsupe: lk,
        nsupset: uk,
        nsupseteq: ck,
        nsupseteqq: fk,
        ntgl: pk,
        Ntilde: dk,
        ntilde: vk,
        ntlg: hk,
        ntriangleleft: mk,
        ntrianglelefteq: gk,
        ntriangleright: bk,
        ntrianglerighteq: yk,
        Nu: wk,
        nu: Dk,
        num: xk,
        numero: kk,
        numsp: Ak,
        nvap: Ek,
        nvdash: Sk,
        nvDash: Ck,
        nVdash: _k,
        nVDash: qk,
        nvge: Tk,
        nvgt: $k,
        nvHarr: Lk,
        nvinfin: Ok,
        nvlArr: Rk,
        nvle: Nk,
        nvlt: Pk,
        nvltrie: Fk,
        nvrArr: Bk,
        nvrtrie: Uk,
        nvsim: jk,
        nwarhk: Ik,
        nwarr: Mk,
        nwArr: zk,
        nwarrow: Hk,
        nwnear: Gk,
        Oacute: Vk,
        oacute: Wk,
        oast: Zk,
        Ocirc: Jk,
        ocirc: Kk,
        ocir: Xk,
        Ocy: Yk,
        ocy: Qk,
        odash: eA,
        Odblac: rA,
        odblac: tA,
        odiv: aA,
        odot: nA,
        odsold: iA,
        OElig: oA,
        oelig: sA,
        ofcir: lA,
        Ofr: uA,
        ofr: cA,
        ogon: fA,
        Ograve: pA,
        ograve: dA,
        ogt: vA,
        ohbar: hA,
        ohm: mA,
        oint: gA,
        olarr: bA,
        olcir: yA,
        olcross: wA,
        oline: DA,
        olt: xA,
        Omacr: kA,
        omacr: AA,
        Omega: EA,
        omega: SA,
        Omicron: CA,
        omicron: _A,
        omid: qA,
        ominus: TA,
        Oopf: $A,
        oopf: LA,
        opar: OA,
        OpenCurlyDoubleQuote: RA,
        OpenCurlyQuote: NA,
        operp: PA,
        oplus: FA,
        orarr: BA,
        Or: UA,
        or: jA,
        ord: IA,
        order: MA,
        orderof: zA,
        ordf: HA,
        ordm: GA,
        origof: VA,
        oror: WA,
        orslope: ZA,
        orv: JA,
        oS: KA,
        Oscr: XA,
        oscr: YA,
        Oslash: QA,
        oslash: eE,
        osol: rE,
        Otilde: tE,
        otilde: aE,
        otimesas: nE,
        Otimes: iE,
        otimes: oE,
        Ouml: sE,
        ouml: lE,
        ovbar: uE,
        OverBar: cE,
        OverBrace: fE,
        OverBracket: pE,
        OverParenthesis: dE,
        para: vE,
        parallel: hE,
        par: mE,
        parsim: gE,
        parsl: bE,
        part: yE,
        PartialD: wE,
        Pcy: DE,
        pcy: xE,
        percnt: kE,
        period: AE,
        permil: EE,
        perp: SE,
        pertenk: CE,
        Pfr: _E,
        pfr: qE,
        Phi: TE,
        phi: $E,
        phiv: LE,
        phmmat: OE,
        phone: RE,
        Pi: NE,
        pi: PE,
        pitchfork: FE,
        piv: BE,
        planck: UE,
        planckh: jE,
        plankv: IE,
        plusacir: ME,
        plusb: zE,
        pluscir: HE,
        plus: GE,
        plusdo: VE,
        plusdu: WE,
        pluse: ZE,
        PlusMinus: JE,
        plusmn: KE,
        plussim: XE,
        plustwo: YE,
        pm: QE,
        Poincareplane: eS,
        pointint: rS,
        popf: tS,
        Popf: aS,
        pound: nS,
        prap: iS,
        Pr: oS,
        pr: sS,
        prcue: lS,
        precapprox: uS,
        prec: cS,
        preccurlyeq: fS,
        Precedes: pS,
        PrecedesEqual: dS,
        PrecedesSlantEqual: vS,
        PrecedesTilde: hS,
        preceq: mS,
        precnapprox: gS,
        precneqq: bS,
        precnsim: yS,
        pre: wS,
        prE: DS,
        precsim: xS,
        prime: kS,
        Prime: AS,
        primes: ES,
        prnap: SS,
        prnE: CS,
        prnsim: _S,
        prod: qS,
        Product: TS,
        profalar: $S,
        profline: LS,
        profsurf: OS,
        prop: RS,
        Proportional: NS,
        Proportion: PS,
        propto: FS,
        prsim: BS,
        prurel: US,
        Pscr: jS,
        pscr: IS,
        Psi: MS,
        psi: zS,
        puncsp: HS,
        Qfr: GS,
        qfr: VS,
        qint: WS,
        qopf: ZS,
        Qopf: JS,
        qprime: KS,
        Qscr: XS,
        qscr: YS,
        quaternions: QS,
        quatint: e3,
        quest: r3,
        questeq: t3,
        quot: a3,
        QUOT: n3,
        rAarr: i3,
        race: o3,
        Racute: s3,
        racute: l3,
        radic: u3,
        raemptyv: c3,
        rang: f3,
        Rang: p3,
        rangd: d3,
        range: v3,
        rangle: h3,
        raquo: m3,
        rarrap: g3,
        rarrb: b3,
        rarrbfs: y3,
        rarrc: w3,
        rarr: D3,
        Rarr: x3,
        rArr: k3,
        rarrfs: A3,
        rarrhk: E3,
        rarrlp: S3,
        rarrpl: C3,
        rarrsim: _3,
        Rarrtl: q3,
        rarrtl: T3,
        rarrw: $3,
        ratail: L3,
        rAtail: O3,
        ratio: R3,
        rationals: N3,
        rbarr: P3,
        rBarr: F3,
        RBarr: B3,
        rbbrk: U3,
        rbrace: j3,
        rbrack: I3,
        rbrke: M3,
        rbrksld: z3,
        rbrkslu: H3,
        Rcaron: G3,
        rcaron: V3,
        Rcedil: W3,
        rcedil: Z3,
        rceil: J3,
        rcub: K3,
        Rcy: X3,
        rcy: Y3,
        rdca: Q3,
        rdldhar: eC,
        rdquo: rC,
        rdquor: tC,
        rdsh: aC,
        real: nC,
        realine: iC,
        realpart: oC,
        reals: sC,
        Re: lC,
        rect: uC,
        reg: cC,
        REG: fC,
        ReverseElement: pC,
        ReverseEquilibrium: dC,
        ReverseUpEquilibrium: vC,
        rfisht: hC,
        rfloor: mC,
        rfr: gC,
        Rfr: bC,
        rHar: yC,
        rhard: wC,
        rharu: DC,
        rharul: xC,
        Rho: kC,
        rho: AC,
        rhov: EC,
        RightAngleBracket: SC,
        RightArrowBar: CC,
        rightarrow: _C,
        RightArrow: qC,
        Rightarrow: TC,
        RightArrowLeftArrow: $C,
        rightarrowtail: LC,
        RightCeiling: OC,
        RightDoubleBracket: RC,
        RightDownTeeVector: NC,
        RightDownVectorBar: PC,
        RightDownVector: FC,
        RightFloor: BC,
        rightharpoondown: UC,
        rightharpoonup: jC,
        rightleftarrows: IC,
        rightleftharpoons: MC,
        rightrightarrows: zC,
        rightsquigarrow: HC,
        RightTeeArrow: GC,
        RightTee: VC,
        RightTeeVector: WC,
        rightthreetimes: ZC,
        RightTriangleBar: JC,
        RightTriangle: KC,
        RightTriangleEqual: XC,
        RightUpDownVector: YC,
        RightUpTeeVector: QC,
        RightUpVectorBar: e_,
        RightUpVector: r_,
        RightVectorBar: t_,
        RightVector: a_,
        ring: n_,
        risingdotseq: i_,
        rlarr: o_,
        rlhar: s_,
        rlm: l_,
        rmoustache: u_,
        rmoust: c_,
        rnmid: f_,
        roang: p_,
        roarr: d_,
        robrk: v_,
        ropar: h_,
        ropf: m_,
        Ropf: g_,
        roplus: b_,
        rotimes: y_,
        RoundImplies: w_,
        rpar: D_,
        rpargt: x_,
        rppolint: k_,
        rrarr: A_,
        Rrightarrow: E_,
        rsaquo: S_,
        rscr: C_,
        Rscr: __,
        rsh: q_,
        Rsh: T_,
        rsqb: $_,
        rsquo: L_,
        rsquor: O_,
        rthree: R_,
        rtimes: N_,
        rtri: P_,
        rtrie: F_,
        rtrif: B_,
        rtriltri: U_,
        RuleDelayed: j_,
        ruluhar: I_,
        rx: M_,
        Sacute: z_,
        sacute: H_,
        sbquo: G_,
        scap: V_,
        Scaron: W_,
        scaron: Z_,
        Sc: J_,
        sc: K_,
        sccue: X_,
        sce: Y_,
        scE: Q_,
        Scedil: eq,
        scedil: rq,
        Scirc: tq,
        scirc: aq,
        scnap: nq,
        scnE: iq,
        scnsim: oq,
        scpolint: sq,
        scsim: lq,
        Scy: uq,
        scy: cq,
        sdotb: fq,
        sdot: pq,
        sdote: dq,
        searhk: vq,
        searr: hq,
        seArr: mq,
        searrow: gq,
        sect: bq,
        semi: yq,
        seswar: wq,
        setminus: Dq,
        setmn: xq,
        sext: kq,
        Sfr: Aq,
        sfr: Eq,
        sfrown: Sq,
        sharp: Cq,
        SHCHcy: _q,
        shchcy: qq,
        SHcy: Tq,
        shcy: $q,
        ShortDownArrow: Lq,
        ShortLeftArrow: Oq,
        shortmid: Rq,
        shortparallel: Nq,
        ShortRightArrow: Pq,
        ShortUpArrow: Fq,
        shy: Bq,
        Sigma: Uq,
        sigma: jq,
        sigmaf: Iq,
        sigmav: Mq,
        sim: zq,
        simdot: Hq,
        sime: Gq,
        simeq: Vq,
        simg: Wq,
        simgE: Zq,
        siml: Jq,
        simlE: Kq,
        simne: Xq,
        simplus: Yq,
        simrarr: Qq,
        slarr: eT,
        SmallCircle: rT,
        smallsetminus: tT,
        smashp: aT,
        smeparsl: nT,
        smid: iT,
        smile: oT,
        smt: sT,
        smte: lT,
        smtes: uT,
        SOFTcy: cT,
        softcy: fT,
        solbar: pT,
        solb: dT,
        sol: vT,
        Sopf: hT,
        sopf: mT,
        spades: gT,
        spadesuit: bT,
        spar: yT,
        sqcap: wT,
        sqcaps: DT,
        sqcup: xT,
        sqcups: kT,
        Sqrt: AT,
        sqsub: ET,
        sqsube: ST,
        sqsubset: CT,
        sqsubseteq: _T,
        sqsup: qT,
        sqsupe: TT,
        sqsupset: $T,
        sqsupseteq: LT,
        square: OT,
        Square: RT,
        SquareIntersection: NT,
        SquareSubset: PT,
        SquareSubsetEqual: FT,
        SquareSuperset: BT,
        SquareSupersetEqual: UT,
        SquareUnion: jT,
        squarf: IT,
        squ: MT,
        squf: zT,
        srarr: HT,
        Sscr: GT,
        sscr: VT,
        ssetmn: WT,
        ssmile: ZT,
        sstarf: JT,
        Star: KT,
        star: XT,
        starf: YT,
        straightepsilon: QT,
        straightphi: e$,
        strns: r$,
        sub: t$,
        Sub: a$,
        subdot: n$,
        subE: i$,
        sube: o$,
        subedot: s$,
        submult: l$,
        subnE: u$,
        subne: c$,
        subplus: f$,
        subrarr: p$,
        subset: d$,
        Subset: v$,
        subseteq: h$,
        subseteqq: m$,
        SubsetEqual: g$,
        subsetneq: b$,
        subsetneqq: y$,
        subsim: w$,
        subsub: D$,
        subsup: x$,
        succapprox: k$,
        succ: A$,
        succcurlyeq: E$,
        Succeeds: S$,
        SucceedsEqual: C$,
        SucceedsSlantEqual: _$,
        SucceedsTilde: q$,
        succeq: T$,
        succnapprox: $$,
        succneqq: L$,
        succnsim: O$,
        succsim: R$,
        SuchThat: N$,
        sum: P$,
        Sum: F$,
        sung: B$,
        sup1: U$,
        sup2: j$,
        sup3: I$,
        sup: M$,
        Sup: z$,
        supdot: H$,
        supdsub: G$,
        supE: V$,
        supe: W$,
        supedot: Z$,
        Superset: J$,
        SupersetEqual: K$,
        suphsol: X$,
        suphsub: Y$,
        suplarr: Q$,
        supmult: eL,
        supnE: rL,
        supne: tL,
        supplus: aL,
        supset: nL,
        Supset: iL,
        supseteq: oL,
        supseteqq: sL,
        supsetneq: lL,
        supsetneqq: uL,
        supsim: cL,
        supsub: fL,
        supsup: pL,
        swarhk: dL,
        swarr: vL,
        swArr: hL,
        swarrow: mL,
        swnwar: gL,
        szlig: bL,
        Tab: yL,
        target: wL,
        Tau: DL,
        tau: xL,
        tbrk: kL,
        Tcaron: AL,
        tcaron: EL,
        Tcedil: SL,
        tcedil: CL,
        Tcy: _L,
        tcy: qL,
        tdot: TL,
        telrec: $L,
        Tfr: LL,
        tfr: OL,
        there4: RL,
        therefore: NL,
        Therefore: PL,
        Theta: FL,
        theta: BL,
        thetasym: UL,
        thetav: jL,
        thickapprox: IL,
        thicksim: ML,
        ThickSpace: zL,
        ThinSpace: HL,
        thinsp: GL,
        thkap: VL,
        thksim: WL,
        THORN: ZL,
        thorn: JL,
        tilde: KL,
        Tilde: XL,
        TildeEqual: YL,
        TildeFullEqual: QL,
        TildeTilde: e8,
        timesbar: r8,
        timesb: t8,
        times: a8,
        timesd: n8,
        tint: i8,
        toea: o8,
        topbot: s8,
        topcir: l8,
        top: u8,
        Topf: c8,
        topf: f8,
        topfork: p8,
        tosa: d8,
        tprime: v8,
        trade: h8,
        TRADE: m8,
        triangle: g8,
        triangledown: b8,
        triangleleft: y8,
        trianglelefteq: w8,
        triangleq: D8,
        triangleright: x8,
        trianglerighteq: k8,
        tridot: A8,
        trie: E8,
        triminus: S8,
        TripleDot: C8,
        triplus: _8,
        trisb: q8,
        tritime: T8,
        trpezium: $8,
        Tscr: L8,
        tscr: O8,
        TScy: R8,
        tscy: N8,
        TSHcy: P8,
        tshcy: F8,
        Tstrok: B8,
        tstrok: U8,
        twixt: j8,
        twoheadleftarrow: I8,
        twoheadrightarrow: M8,
        Uacute: z8,
        uacute: H8,
        uarr: G8,
        Uarr: V8,
        uArr: W8,
        Uarrocir: Z8,
        Ubrcy: J8,
        ubrcy: K8,
        Ubreve: X8,
        ubreve: Y8,
        Ucirc: Q8,
        ucirc: e4,
        Ucy: r4,
        ucy: t4,
        udarr: a4,
        Udblac: n4,
        udblac: i4,
        udhar: o4,
        ufisht: s4,
        Ufr: l4,
        ufr: u4,
        Ugrave: c4,
        ugrave: f4,
        uHar: p4,
        uharl: d4,
        uharr: v4,
        uhblk: h4,
        ulcorn: m4,
        ulcorner: g4,
        ulcrop: b4,
        ultri: y4,
        Umacr: w4,
        umacr: D4,
        uml: x4,
        UnderBar: k4,
        UnderBrace: A4,
        UnderBracket: E4,
        UnderParenthesis: S4,
        Union: C4,
        UnionPlus: _4,
        Uogon: q4,
        uogon: T4,
        Uopf: $4,
        uopf: L4,
        UpArrowBar: O4,
        uparrow: R4,
        UpArrow: N4,
        Uparrow: P4,
        UpArrowDownArrow: F4,
        updownarrow: B4,
        UpDownArrow: U4,
        Updownarrow: j4,
        UpEquilibrium: I4,
        upharpoonleft: M4,
        upharpoonright: z4,
        uplus: H4,
        UpperLeftArrow: G4,
        UpperRightArrow: V4,
        upsi: W4,
        Upsi: Z4,
        upsih: J4,
        Upsilon: K4,
        upsilon: X4,
        UpTeeArrow: Y4,
        UpTee: Q4,
        upuparrows: eO,
        urcorn: rO,
        urcorner: tO,
        urcrop: aO,
        Uring: nO,
        uring: iO,
        urtri: oO,
        Uscr: sO,
        uscr: lO,
        utdot: uO,
        Utilde: cO,
        utilde: fO,
        utri: pO,
        utrif: dO,
        uuarr: vO,
        Uuml: hO,
        uuml: mO,
        uwangle: gO,
        vangrt: bO,
        varepsilon: yO,
        varkappa: wO,
        varnothing: DO,
        varphi: xO,
        varpi: kO,
        varpropto: AO,
        varr: EO,
        vArr: SO,
        varrho: CO,
        varsigma: _O,
        varsubsetneq: qO,
        varsubsetneqq: TO,
        varsupsetneq: $O,
        varsupsetneqq: LO,
        vartheta: OO,
        vartriangleleft: RO,
        vartriangleright: NO,
        vBar: PO,
        Vbar: FO,
        vBarv: BO,
        Vcy: UO,
        vcy: jO,
        vdash: IO,
        vDash: MO,
        Vdash: zO,
        VDash: HO,
        Vdashl: GO,
        veebar: VO,
        vee: WO,
        Vee: ZO,
        veeeq: JO,
        vellip: KO,
        verbar: XO,
        Verbar: YO,
        vert: QO,
        Vert: eR,
        VerticalBar: rR,
        VerticalLine: tR,
        VerticalSeparator: aR,
        VerticalTilde: nR,
        VeryThinSpace: iR,
        Vfr: oR,
        vfr: sR,
        vltri: lR,
        vnsub: uR,
        vnsup: cR,
        Vopf: fR,
        vopf: pR,
        vprop: dR,
        vrtri: vR,
        Vscr: hR,
        vscr: mR,
        vsubnE: gR,
        vsubne: bR,
        vsupnE: yR,
        vsupne: wR,
        Vvdash: DR,
        vzigzag: xR,
        Wcirc: kR,
        wcirc: AR,
        wedbar: ER,
        wedge: SR,
        Wedge: CR,
        wedgeq: _R,
        weierp: qR,
        Wfr: TR,
        wfr: $R,
        Wopf: LR,
        wopf: OR,
        wp: RR,
        wr: NR,
        wreath: PR,
        Wscr: FR,
        wscr: BR,
        xcap: UR,
        xcirc: jR,
        xcup: IR,
        xdtri: MR,
        Xfr: zR,
        xfr: HR,
        xharr: GR,
        xhArr: VR,
        Xi: WR,
        xi: ZR,
        xlarr: JR,
        xlArr: KR,
        xmap: XR,
        xnis: YR,
        xodot: QR,
        Xopf: eN,
        xopf: rN,
        xoplus: tN,
        xotime: aN,
        xrarr: nN,
        xrArr: iN,
        Xscr: oN,
        xscr: sN,
        xsqcup: lN,
        xuplus: uN,
        xutri: cN,
        xvee: fN,
        xwedge: pN,
        Yacute: dN,
        yacute: vN,
        YAcy: hN,
        yacy: mN,
        Ycirc: gN,
        ycirc: bN,
        Ycy: yN,
        ycy: wN,
        yen: DN,
        Yfr: xN,
        yfr: kN,
        YIcy: AN,
        yicy: EN,
        Yopf: SN,
        yopf: CN,
        Yscr: _N,
        yscr: qN,
        YUcy: TN,
        yucy: $N,
        yuml: LN,
        Yuml: ON,
        Zacute: RN,
        zacute: NN,
        Zcaron: PN,
        zcaron: FN,
        Zcy: BN,
        zcy: UN,
        Zdot: jN,
        zdot: IN,
        zeetrf: MN,
        ZeroWidthSpace: zN,
        Zeta: HN,
        zeta: GN,
        zfr: VN,
        Zfr: WN,
        ZHcy: ZN,
        zhcy: JN,
        zigrarr: KN,
        zopf: XN,
        Zopf: YN,
        Zscr: QN,
        zscr: eP,
        zwj: rP,
        zwnj: tP
      }, HB = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        Aacute: A,
        aacute: g,
        Abreve: S,
        abreve: q,
        ac: P,
        acd: R,
        acE: L,
        Acirc: U,
        acirc: j,
        acute: z,
        Acy: ae,
        acy: ne,
        AElig: ge,
        aelig: se,
        af: ee,
        Afr: ue,
        afr: J,
        Agrave: W,
        agrave: te,
        alefsym: re,
        aleph: le,
        Alpha: m,
        alpha: D,
        Amacr: _,
        amacr: B,
        amalg: H,
        amp: Z,
        AMP: M,
        andand: I,
        And: K,
        and: ce,
        andd: we,
        andslope: Pe,
        andv: Ce,
        ang: Fe,
        ange: ir,
        angle: Cr,
        angmsdaa: _r,
        angmsdab: C,
        angmsdac: qr,
        angmsdad: Yr,
        angmsdae: Aa,
        angmsdaf: Ea,
        angmsdag: Sa,
        angmsdah: Ca,
        angmsd: _a,
        angrt: qa,
        angrtvb: Ta,
        angrtvbd: $a,
        angsph: La,
        angst: Oa,
        angzarr: Ra,
        Aogon: Na,
        aogon: Pa,
        Aopf: Fa,
        aopf: Ba,
        apacir: Ua,
        ap: ja,
        apE: Ia,
        ape: Ma,
        apid: za,
        apos: Ha,
        ApplyFunction: Ga,
        approx: Va,
        approxeq: Wa,
        Aring: Za,
        aring: Ja,
        Ascr: Ka,
        ascr: Xa,
        Assign: Ya,
        ast: Qa,
        asymp: en,
        asympeq: rn,
        Atilde: tn,
        atilde: an,
        Auml: nn,
        auml: on,
        awconint: sn,
        awint: ln,
        backcong: un,
        backepsilon: cn,
        backprime: fn,
        backsim: pn,
        backsimeq: dn,
        Backslash: vn,
        Barv: hn,
        barvee: mn,
        barwed: gn,
        Barwed: bn,
        barwedge: yn,
        bbrk: wn,
        bbrktbrk: Dn,
        bcong: xn,
        Bcy: kn,
        bcy: An,
        bdquo: En,
        becaus: Sn,
        because: Cn,
        Because: _n,
        bemptyv: qn,
        bepsi: Tn,
        bernou: $n,
        Bernoullis: Ln,
        Beta: On,
        beta: Rn,
        beth: Nn,
        between: Pn,
        Bfr: Fn,
        bfr: Bn,
        bigcap: Un,
        bigcirc: jn,
        bigcup: In,
        bigodot: Mn,
        bigoplus: zn,
        bigotimes: Hn,
        bigsqcup: Gn,
        bigstar: Vn,
        bigtriangledown: Wn,
        bigtriangleup: Zn,
        biguplus: Jn,
        bigvee: Kn,
        bigwedge: Xn,
        bkarow: Yn,
        blacklozenge: Qn,
        blacksquare: ei,
        blacktriangle: ri,
        blacktriangledown: ti,
        blacktriangleleft: ai,
        blacktriangleright: ni,
        blank: ii,
        blk12: oi,
        blk14: si,
        blk34: li,
        block: ui,
        bne: ci,
        bnequiv: fi,
        bNot: pi,
        bnot: di,
        Bopf: vi,
        bopf: hi,
        bot: mi,
        bottom: gi,
        bowtie: bi,
        boxbox: yi,
        boxdl: wi,
        boxdL: Di,
        boxDl: xi,
        boxDL: ki,
        boxdr: Ai,
        boxdR: Ei,
        boxDr: Si,
        boxDR: Ci,
        boxh: _i,
        boxH: qi,
        boxhd: Ti,
        boxHd: $i,
        boxhD: Li,
        boxHD: Oi,
        boxhu: Ri,
        boxHu: Ni,
        boxhU: Pi,
        boxHU: Fi,
        boxminus: Bi,
        boxplus: Ui,
        boxtimes: ji,
        boxul: Ii,
        boxuL: Mi,
        boxUl: zi,
        boxUL: Hi,
        boxur: Gi,
        boxuR: Vi,
        boxUr: Wi,
        boxUR: Zi,
        boxv: Ji,
        boxV: Ki,
        boxvh: Xi,
        boxvH: Yi,
        boxVh: Qi,
        boxVH: eo,
        boxvl: ro,
        boxvL: to,
        boxVl: ao,
        boxVL: no,
        boxvr: io,
        boxvR: oo,
        boxVr: so,
        boxVR: lo,
        bprime: uo,
        breve: co,
        Breve: fo,
        brvbar: po,
        bscr: vo,
        Bscr: ho,
        bsemi: mo,
        bsim: go,
        bsime: bo,
        bsolb: yo,
        bsol: wo,
        bsolhsub: Do,
        bull: xo,
        bullet: ko,
        bump: Ao,
        bumpE: Eo,
        bumpe: So,
        Bumpeq: Co,
        bumpeq: _o,
        Cacute: qo,
        cacute: To,
        capand: $o,
        capbrcup: Lo,
        capcap: Oo,
        cap: Ro,
        Cap: No,
        capcup: Po,
        capdot: Fo,
        CapitalDifferentialD: Bo,
        caps: Uo,
        caret: jo,
        caron: Io,
        Cayleys: Mo,
        ccaps: zo,
        Ccaron: Ho,
        ccaron: Go,
        Ccedil: Vo,
        ccedil: Wo,
        Ccirc: Zo,
        ccirc: Jo,
        Cconint: Ko,
        ccups: Xo,
        ccupssm: Yo,
        Cdot: Qo,
        cdot: es,
        cedil: rs,
        Cedilla: ts,
        cemptyv: as,
        cent: ns,
        centerdot: is,
        CenterDot: os,
        cfr: ss,
        Cfr: ls,
        CHcy: us,
        chcy: cs,
        check: fs,
        checkmark: ps,
        Chi: ds,
        chi: vs,
        circ: hs,
        circeq: ms,
        circlearrowleft: gs,
        circlearrowright: bs,
        circledast: ys,
        circledcirc: ws,
        circleddash: Ds,
        CircleDot: xs,
        circledR: ks,
        circledS: As,
        CircleMinus: Es,
        CirclePlus: Ss,
        CircleTimes: Cs,
        cir: _s,
        cirE: qs,
        cire: Ts,
        cirfnint: $s,
        cirmid: Ls,
        cirscir: Os,
        ClockwiseContourIntegral: Rs,
        CloseCurlyDoubleQuote: Ns,
        CloseCurlyQuote: Ps,
        clubs: Fs,
        clubsuit: Bs,
        colon: Us,
        Colon: js,
        Colone: Is,
        colone: Ms,
        coloneq: zs,
        comma: Hs,
        commat: Gs,
        comp: Vs,
        compfn: Ws,
        complement: Zs,
        complexes: Js,
        cong: Ks,
        congdot: Xs,
        Congruent: Ys,
        conint: Qs,
        Conint: el,
        ContourIntegral: rl,
        copf: tl,
        Copf: al,
        coprod: nl,
        Coproduct: il,
        copy: ol,
        COPY: sl,
        copysr: ll,
        CounterClockwiseContourIntegral: ul,
        crarr: cl,
        cross: fl,
        Cross: pl,
        Cscr: dl,
        cscr: vl,
        csub: hl,
        csube: ml,
        csup: gl,
        csupe: bl,
        ctdot: yl,
        cudarrl: wl,
        cudarrr: Dl,
        cuepr: xl,
        cuesc: kl,
        cularr: Al,
        cularrp: El,
        cupbrcap: Sl,
        cupcap: Cl,
        CupCap: _l,
        cup: ql,
        Cup: Tl,
        cupcup: $l,
        cupdot: Ll,
        cupor: Ol,
        cups: Rl,
        curarr: Nl,
        curarrm: Pl,
        curlyeqprec: Fl,
        curlyeqsucc: Bl,
        curlyvee: Ul,
        curlywedge: jl,
        curren: Il,
        curvearrowleft: Ml,
        curvearrowright: zl,
        cuvee: Hl,
        cuwed: Gl,
        cwconint: Vl,
        cwint: Wl,
        cylcty: Zl,
        dagger: Jl,
        Dagger: Kl,
        daleth: Xl,
        darr: Yl,
        Darr: Ql,
        dArr: eu,
        dash: ru,
        Dashv: tu,
        dashv: au,
        dbkarow: nu,
        dblac: iu,
        Dcaron: ou,
        dcaron: su,
        Dcy: lu,
        dcy: uu,
        ddagger: cu,
        ddarr: fu,
        DD: pu,
        dd: du,
        DDotrahd: vu,
        ddotseq: hu,
        deg: mu,
        Del: gu,
        Delta: bu,
        delta: yu,
        demptyv: wu,
        dfisht: Du,
        Dfr: xu,
        dfr: ku,
        dHar: Au,
        dharl: Eu,
        dharr: Su,
        DiacriticalAcute: Cu,
        DiacriticalDot: _u,
        DiacriticalDoubleAcute: qu,
        DiacriticalGrave: Tu,
        DiacriticalTilde: $u,
        diam: Lu,
        diamond: Ou,
        Diamond: Ru,
        diamondsuit: Nu,
        diams: Pu,
        die: Fu,
        DifferentialD: Bu,
        digamma: Uu,
        disin: ju,
        div: Iu,
        divide: Mu,
        divideontimes: zu,
        divonx: Hu,
        DJcy: Gu,
        djcy: Vu,
        dlcorn: Wu,
        dlcrop: Zu,
        dollar: Ju,
        Dopf: Ku,
        dopf: Xu,
        Dot: Yu,
        dot: Qu,
        DotDot: ec,
        doteq: rc,
        doteqdot: tc,
        DotEqual: ac,
        dotminus: nc,
        dotplus: ic,
        dotsquare: oc,
        doublebarwedge: sc,
        DoubleContourIntegral: lc,
        DoubleDot: uc,
        DoubleDownArrow: cc,
        DoubleLeftArrow: fc,
        DoubleLeftRightArrow: pc,
        DoubleLeftTee: dc,
        DoubleLongLeftArrow: vc,
        DoubleLongLeftRightArrow: hc,
        DoubleLongRightArrow: mc,
        DoubleRightArrow: gc,
        DoubleRightTee: bc,
        DoubleUpArrow: yc,
        DoubleUpDownArrow: wc,
        DoubleVerticalBar: Dc,
        DownArrowBar: xc,
        downarrow: kc,
        DownArrow: Ac,
        Downarrow: Ec,
        DownArrowUpArrow: Sc,
        DownBreve: Cc,
        downdownarrows: _c,
        downharpoonleft: qc,
        downharpoonright: Tc,
        DownLeftRightVector: $c,
        DownLeftTeeVector: Lc,
        DownLeftVectorBar: Oc,
        DownLeftVector: Rc,
        DownRightTeeVector: Nc,
        DownRightVectorBar: Pc,
        DownRightVector: Fc,
        DownTeeArrow: Bc,
        DownTee: Uc,
        drbkarow: jc,
        drcorn: Ic,
        drcrop: Mc,
        Dscr: zc,
        dscr: Hc,
        DScy: Gc,
        dscy: Vc,
        dsol: Wc,
        Dstrok: Zc,
        dstrok: Jc,
        dtdot: Kc,
        dtri: Xc,
        dtrif: Yc,
        duarr: Qc,
        duhar: ef,
        dwangle: rf,
        DZcy: tf,
        dzcy: af,
        dzigrarr: nf,
        Eacute: of,
        eacute: sf,
        easter: lf,
        Ecaron: uf,
        ecaron: cf,
        Ecirc: ff,
        ecirc: pf,
        ecir: df,
        ecolon: vf,
        Ecy: hf,
        ecy: mf,
        eDDot: gf,
        Edot: bf,
        edot: yf,
        eDot: wf,
        ee: Df,
        efDot: xf,
        Efr: kf,
        efr: Af,
        eg: Ef,
        Egrave: Sf,
        egrave: Cf,
        egs: _f,
        egsdot: qf,
        el: Tf,
        Element: $f,
        elinters: Lf,
        ell: Of,
        els: Rf,
        elsdot: Nf,
        Emacr: Pf,
        emacr: Ff,
        empty: Bf,
        emptyset: Uf,
        EmptySmallSquare: jf,
        emptyv: If,
        EmptyVerySmallSquare: Mf,
        emsp13: zf,
        emsp14: Hf,
        emsp: Gf,
        ENG: Vf,
        eng: Wf,
        ensp: Zf,
        Eogon: Jf,
        eogon: Kf,
        Eopf: Xf,
        eopf: Yf,
        epar: Qf,
        eparsl: ep,
        eplus: rp,
        epsi: tp,
        Epsilon: ap,
        epsilon: np,
        epsiv: ip,
        eqcirc: op,
        eqcolon: sp,
        eqsim: lp,
        eqslantgtr: up,
        eqslantless: cp,
        Equal: fp,
        equals: pp,
        EqualTilde: dp,
        equest: vp,
        Equilibrium: hp,
        equiv: mp,
        equivDD: gp,
        eqvparsl: bp,
        erarr: yp,
        erDot: wp,
        escr: Dp,
        Escr: xp,
        esdot: kp,
        Esim: Ap,
        esim: Ep,
        Eta: Sp,
        eta: Cp,
        ETH: _p,
        eth: qp,
        Euml: Tp,
        euml: $p,
        euro: Lp,
        excl: Op,
        exist: Rp,
        Exists: Np,
        expectation: Pp,
        exponentiale: Fp,
        ExponentialE: Bp,
        fallingdotseq: Up,
        Fcy: jp,
        fcy: Ip,
        female: Mp,
        ffilig: zp,
        fflig: Hp,
        ffllig: Gp,
        Ffr: Vp,
        ffr: Wp,
        filig: Zp,
        FilledSmallSquare: Jp,
        FilledVerySmallSquare: Kp,
        fjlig: Xp,
        flat: Yp,
        fllig: Qp,
        fltns: ed,
        fnof: rd,
        Fopf: td,
        fopf: ad,
        forall: nd,
        ForAll: id,
        fork: od,
        forkv: sd,
        Fouriertrf: ld,
        fpartint: ud,
        frac12: cd,
        frac13: fd,
        frac14: pd,
        frac15: dd,
        frac16: vd,
        frac18: hd,
        frac23: md,
        frac25: gd,
        frac34: bd,
        frac35: yd,
        frac38: wd,
        frac45: Dd,
        frac56: xd,
        frac58: kd,
        frac78: Ad,
        frasl: Ed,
        frown: Sd,
        fscr: Cd,
        Fscr: _d,
        gacute: qd,
        Gamma: Td,
        gamma: $d,
        Gammad: Ld,
        gammad: Od,
        gap: Rd,
        Gbreve: Nd,
        gbreve: Pd,
        Gcedil: Fd,
        Gcirc: Bd,
        gcirc: Ud,
        Gcy: jd,
        gcy: Id,
        Gdot: Md,
        gdot: zd,
        ge: Hd,
        gE: Gd,
        gEl: Vd,
        gel: Wd,
        geq: Zd,
        geqq: Jd,
        geqslant: Kd,
        gescc: Xd,
        ges: Yd,
        gesdot: Qd,
        gesdoto: ev,
        gesdotol: rv,
        gesl: tv,
        gesles: av,
        Gfr: nv,
        gfr: iv,
        gg: ov,
        Gg: sv,
        ggg: lv,
        gimel: uv,
        GJcy: cv,
        gjcy: fv,
        gla: pv,
        gl: dv,
        glE: vv,
        glj: hv,
        gnap: mv,
        gnapprox: gv,
        gne: bv,
        gnE: yv,
        gneq: wv,
        gneqq: Dv,
        gnsim: xv,
        Gopf: kv,
        gopf: Av,
        grave: Ev,
        GreaterEqual: Sv,
        GreaterEqualLess: Cv,
        GreaterFullEqual: _v,
        GreaterGreater: qv,
        GreaterLess: Tv,
        GreaterSlantEqual: $v,
        GreaterTilde: Lv,
        Gscr: Ov,
        gscr: Rv,
        gsim: Nv,
        gsime: Pv,
        gsiml: Fv,
        gtcc: Bv,
        gtcir: Uv,
        gt: jv,
        GT: Iv,
        Gt: Mv,
        gtdot: zv,
        gtlPar: Hv,
        gtquest: Gv,
        gtrapprox: Vv,
        gtrarr: Wv,
        gtrdot: Zv,
        gtreqless: Jv,
        gtreqqless: Kv,
        gtrless: Xv,
        gtrsim: Yv,
        gvertneqq: Qv,
        gvnE: eh,
        Hacek: rh,
        hairsp: th,
        half: ah,
        hamilt: nh,
        HARDcy: ih,
        hardcy: oh,
        harrcir: sh,
        harr: lh,
        hArr: uh,
        harrw: ch,
        Hat: fh,
        hbar: ph,
        Hcirc: dh,
        hcirc: vh,
        hearts: hh,
        heartsuit: mh,
        hellip: gh,
        hercon: bh,
        hfr: yh,
        Hfr: wh,
        HilbertSpace: Dh,
        hksearow: xh,
        hkswarow: kh,
        hoarr: Ah,
        homtht: Eh,
        hookleftarrow: Sh,
        hookrightarrow: Ch,
        hopf: _h,
        Hopf: qh,
        horbar: Th,
        HorizontalLine: $h,
        hscr: Lh,
        Hscr: Oh,
        hslash: Rh,
        Hstrok: Nh,
        hstrok: Ph,
        HumpDownHump: Fh,
        HumpEqual: Bh,
        hybull: Uh,
        hyphen: jh,
        Iacute: Ih,
        iacute: Mh,
        ic: zh,
        Icirc: Hh,
        icirc: Gh,
        Icy: Vh,
        icy: Wh,
        Idot: Zh,
        IEcy: Jh,
        iecy: Kh,
        iexcl: Xh,
        iff: Yh,
        ifr: Qh,
        Ifr: em,
        Igrave: rm,
        igrave: tm,
        ii: am,
        iiiint: nm,
        iiint: im,
        iinfin: om,
        iiota: sm,
        IJlig: lm,
        ijlig: um,
        Imacr: cm,
        imacr: fm,
        image: pm,
        ImaginaryI: dm,
        imagline: vm,
        imagpart: hm,
        imath: mm,
        Im: gm,
        imof: bm,
        imped: ym,
        Implies: wm,
        incare: Dm,
        infin: xm,
        infintie: km,
        inodot: Am,
        intcal: Em,
        int: Sm,
        Int: Cm,
        integers: _m,
        Integral: qm,
        intercal: Tm,
        Intersection: $m,
        intlarhk: Lm,
        intprod: Om,
        InvisibleComma: Rm,
        InvisibleTimes: Nm,
        IOcy: Pm,
        iocy: Fm,
        Iogon: Bm,
        iogon: Um,
        Iopf: jm,
        iopf: Im,
        Iota: Mm,
        iota: zm,
        iprod: Hm,
        iquest: Gm,
        iscr: Vm,
        Iscr: Wm,
        isin: Zm,
        isindot: Jm,
        isinE: Km,
        isins: Xm,
        isinsv: Ym,
        isinv: Qm,
        it: eg,
        Itilde: rg,
        itilde: tg,
        Iukcy: ag,
        iukcy: ng,
        Iuml: ig,
        iuml: og,
        Jcirc: sg,
        jcirc: lg,
        Jcy: ug,
        jcy: cg,
        Jfr: fg,
        jfr: pg,
        jmath: dg,
        Jopf: vg,
        jopf: hg,
        Jscr: mg,
        jscr: gg,
        Jsercy: bg,
        jsercy: yg,
        Jukcy: wg,
        jukcy: Dg,
        Kappa: xg,
        kappa: kg,
        kappav: Ag,
        Kcedil: Eg,
        kcedil: Sg,
        Kcy: Cg,
        kcy: _g,
        Kfr: qg,
        kfr: Tg,
        kgreen: $g,
        KHcy: Lg,
        khcy: Og,
        KJcy: Rg,
        kjcy: Ng,
        Kopf: Pg,
        kopf: Fg,
        Kscr: Bg,
        kscr: Ug,
        lAarr: jg,
        Lacute: Ig,
        lacute: Mg,
        laemptyv: zg,
        lagran: Hg,
        Lambda: Gg,
        lambda: Vg,
        lang: Wg,
        Lang: Zg,
        langd: Jg,
        langle: Kg,
        lap: Xg,
        Laplacetrf: Yg,
        laquo: Qg,
        larrb: eb,
        larrbfs: rb,
        larr: tb,
        Larr: ab,
        lArr: nb,
        larrfs: ib,
        larrhk: ob,
        larrlp: sb,
        larrpl: lb,
        larrsim: ub,
        larrtl: cb,
        latail: fb,
        lAtail: pb,
        lat: db,
        late: vb,
        lates: hb,
        lbarr: mb,
        lBarr: gb,
        lbbrk: bb,
        lbrace: yb,
        lbrack: wb,
        lbrke: Db,
        lbrksld: xb,
        lbrkslu: kb,
        Lcaron: Ab,
        lcaron: Eb,
        Lcedil: Sb,
        lcedil: Cb,
        lceil: _b,
        lcub: qb,
        Lcy: Tb,
        lcy: $b,
        ldca: Lb,
        ldquo: Ob,
        ldquor: Rb,
        ldrdhar: Nb,
        ldrushar: Pb,
        ldsh: Fb,
        le: Bb,
        lE: Ub,
        LeftAngleBracket: jb,
        LeftArrowBar: Ib,
        leftarrow: Mb,
        LeftArrow: zb,
        Leftarrow: Hb,
        LeftArrowRightArrow: Gb,
        leftarrowtail: Vb,
        LeftCeiling: Wb,
        LeftDoubleBracket: Zb,
        LeftDownTeeVector: Jb,
        LeftDownVectorBar: Kb,
        LeftDownVector: Xb,
        LeftFloor: Yb,
        leftharpoondown: Qb,
        leftharpoonup: ey,
        leftleftarrows: ry,
        leftrightarrow: ty,
        LeftRightArrow: ay,
        Leftrightarrow: ny,
        leftrightarrows: iy,
        leftrightharpoons: oy,
        leftrightsquigarrow: sy,
        LeftRightVector: ly,
        LeftTeeArrow: uy,
        LeftTee: cy,
        LeftTeeVector: fy,
        leftthreetimes: py,
        LeftTriangleBar: dy,
        LeftTriangle: vy,
        LeftTriangleEqual: hy,
        LeftUpDownVector: my,
        LeftUpTeeVector: gy,
        LeftUpVectorBar: by,
        LeftUpVector: yy,
        LeftVectorBar: wy,
        LeftVector: Dy,
        lEg: xy,
        leg: ky,
        leq: Ay,
        leqq: Ey,
        leqslant: Sy,
        lescc: Cy,
        les: _y,
        lesdot: qy,
        lesdoto: Ty,
        lesdotor: $y,
        lesg: Ly,
        lesges: Oy,
        lessapprox: Ry,
        lessdot: Ny,
        lesseqgtr: Py,
        lesseqqgtr: Fy,
        LessEqualGreater: By,
        LessFullEqual: Uy,
        LessGreater: jy,
        lessgtr: Iy,
        LessLess: My,
        lesssim: zy,
        LessSlantEqual: Hy,
        LessTilde: Gy,
        lfisht: Vy,
        lfloor: Wy,
        Lfr: Zy,
        lfr: Jy,
        lg: Ky,
        lgE: Xy,
        lHar: Yy,
        lhard: Qy,
        lharu: e0,
        lharul: r0,
        lhblk: t0,
        LJcy: a0,
        ljcy: n0,
        llarr: i0,
        ll: o0,
        Ll: s0,
        llcorner: l0,
        Lleftarrow: u0,
        llhard: c0,
        lltri: f0,
        Lmidot: p0,
        lmidot: d0,
        lmoustache: v0,
        lmoust: h0,
        lnap: m0,
        lnapprox: g0,
        lne: b0,
        lnE: y0,
        lneq: w0,
        lneqq: D0,
        lnsim: x0,
        loang: k0,
        loarr: A0,
        lobrk: E0,
        longleftarrow: S0,
        LongLeftArrow: C0,
        Longleftarrow: _0,
        longleftrightarrow: q0,
        LongLeftRightArrow: T0,
        Longleftrightarrow: $0,
        longmapsto: L0,
        longrightarrow: O0,
        LongRightArrow: R0,
        Longrightarrow: N0,
        looparrowleft: P0,
        looparrowright: F0,
        lopar: B0,
        Lopf: U0,
        lopf: j0,
        loplus: I0,
        lotimes: M0,
        lowast: z0,
        lowbar: H0,
        LowerLeftArrow: G0,
        LowerRightArrow: V0,
        loz: W0,
        lozenge: Z0,
        lozf: J0,
        lpar: K0,
        lparlt: X0,
        lrarr: Y0,
        lrcorner: Q0,
        lrhar: e1,
        lrhard: r1,
        lrm: t1,
        lrtri: a1,
        lsaquo: n1,
        lscr: i1,
        Lscr: o1,
        lsh: s1,
        Lsh: l1,
        lsim: u1,
        lsime: c1,
        lsimg: f1,
        lsqb: p1,
        lsquo: d1,
        lsquor: v1,
        Lstrok: h1,
        lstrok: m1,
        ltcc: g1,
        ltcir: b1,
        lt: y1,
        LT: w1,
        Lt: D1,
        ltdot: x1,
        lthree: k1,
        ltimes: A1,
        ltlarr: E1,
        ltquest: S1,
        ltri: C1,
        ltrie: _1,
        ltrif: q1,
        ltrPar: T1,
        lurdshar: $1,
        luruhar: L1,
        lvertneqq: O1,
        lvnE: R1,
        macr: N1,
        male: P1,
        malt: F1,
        maltese: B1,
        map: U1,
        mapsto: j1,
        mapstodown: I1,
        mapstoleft: M1,
        mapstoup: z1,
        marker: H1,
        mcomma: G1,
        Mcy: V1,
        mcy: W1,
        mdash: Z1,
        mDDot: J1,
        measuredangle: K1,
        MediumSpace: X1,
        Mellintrf: Y1,
        Mfr: Q1,
        mfr: ew,
        mho: rw,
        micro: tw,
        midast: aw,
        midcir: nw,
        mid: iw,
        middot: ow,
        minusb: sw,
        minus: lw,
        minusd: uw,
        minusdu: cw,
        MinusPlus: fw,
        mlcp: pw,
        mldr: dw,
        mnplus: vw,
        models: hw,
        Mopf: mw,
        mopf: gw,
        mp: bw,
        mscr: yw,
        Mscr: ww,
        mstpos: Dw,
        Mu: xw,
        mu: kw,
        multimap: Aw,
        mumap: Ew,
        nabla: Sw,
        Nacute: Cw,
        nacute: _w,
        nang: qw,
        nap: Tw,
        napE: $w,
        napid: Lw,
        napos: Ow,
        napprox: Rw,
        natural: Nw,
        naturals: Pw,
        natur: Fw,
        nbsp: Bw,
        nbump: Uw,
        nbumpe: jw,
        ncap: Iw,
        Ncaron: Mw,
        ncaron: zw,
        Ncedil: Hw,
        ncedil: Gw,
        ncong: Vw,
        ncongdot: Ww,
        ncup: Zw,
        Ncy: Jw,
        ncy: Kw,
        ndash: Xw,
        nearhk: Yw,
        nearr: Qw,
        neArr: eD,
        nearrow: rD,
        ne: tD,
        nedot: aD,
        NegativeMediumSpace: nD,
        NegativeThickSpace: iD,
        NegativeThinSpace: oD,
        NegativeVeryThinSpace: sD,
        nequiv: lD,
        nesear: uD,
        nesim: cD,
        NestedGreaterGreater: fD,
        NestedLessLess: pD,
        NewLine: dD,
        nexist: vD,
        nexists: hD,
        Nfr: mD,
        nfr: gD,
        ngE: bD,
        nge: yD,
        ngeq: wD,
        ngeqq: DD,
        ngeqslant: xD,
        nges: kD,
        nGg: AD,
        ngsim: ED,
        nGt: SD,
        ngt: CD,
        ngtr: _D,
        nGtv: qD,
        nharr: TD,
        nhArr: $D,
        nhpar: LD,
        ni: OD,
        nis: RD,
        nisd: ND,
        niv: PD,
        NJcy: FD,
        njcy: BD,
        nlarr: UD,
        nlArr: jD,
        nldr: ID,
        nlE: MD,
        nle: zD,
        nleftarrow: HD,
        nLeftarrow: GD,
        nleftrightarrow: VD,
        nLeftrightarrow: WD,
        nleq: ZD,
        nleqq: JD,
        nleqslant: KD,
        nles: XD,
        nless: YD,
        nLl: QD,
        nlsim: e2,
        nLt: r2,
        nlt: t2,
        nltri: a2,
        nltrie: n2,
        nLtv: i2,
        nmid: o2,
        NoBreak: s2,
        NonBreakingSpace: l2,
        nopf: u2,
        Nopf: c2,
        Not: f2,
        not: p2,
        NotCongruent: d2,
        NotCupCap: v2,
        NotDoubleVerticalBar: h2,
        NotElement: m2,
        NotEqual: g2,
        NotEqualTilde: b2,
        NotExists: y2,
        NotGreater: w2,
        NotGreaterEqual: D2,
        NotGreaterFullEqual: x2,
        NotGreaterGreater: k2,
        NotGreaterLess: A2,
        NotGreaterSlantEqual: E2,
        NotGreaterTilde: S2,
        NotHumpDownHump: C2,
        NotHumpEqual: _2,
        notin: q2,
        notindot: T2,
        notinE: $2,
        notinva: L2,
        notinvb: O2,
        notinvc: R2,
        NotLeftTriangleBar: N2,
        NotLeftTriangle: P2,
        NotLeftTriangleEqual: F2,
        NotLess: B2,
        NotLessEqual: U2,
        NotLessGreater: j2,
        NotLessLess: I2,
        NotLessSlantEqual: M2,
        NotLessTilde: z2,
        NotNestedGreaterGreater: H2,
        NotNestedLessLess: G2,
        notni: V2,
        notniva: W2,
        notnivb: Z2,
        notnivc: J2,
        NotPrecedes: K2,
        NotPrecedesEqual: X2,
        NotPrecedesSlantEqual: Y2,
        NotReverseElement: Q2,
        NotRightTriangleBar: ex,
        NotRightTriangle: rx,
        NotRightTriangleEqual: tx,
        NotSquareSubset: ax,
        NotSquareSubsetEqual: nx,
        NotSquareSuperset: ix,
        NotSquareSupersetEqual: ox,
        NotSubset: sx,
        NotSubsetEqual: lx,
        NotSucceeds: ux,
        NotSucceedsEqual: cx,
        NotSucceedsSlantEqual: fx,
        NotSucceedsTilde: px,
        NotSuperset: dx,
        NotSupersetEqual: vx,
        NotTilde: hx,
        NotTildeEqual: mx,
        NotTildeFullEqual: gx,
        NotTildeTilde: bx,
        NotVerticalBar: yx,
        nparallel: wx,
        npar: Dx,
        nparsl: xx,
        npart: kx,
        npolint: Ax,
        npr: Ex,
        nprcue: Sx,
        nprec: Cx,
        npreceq: _x,
        npre: qx,
        nrarrc: Tx,
        nrarr: $x,
        nrArr: Lx,
        nrarrw: Ox,
        nrightarrow: Rx,
        nRightarrow: Nx,
        nrtri: Px,
        nrtrie: Fx,
        nsc: Bx,
        nsccue: Ux,
        nsce: jx,
        Nscr: Ix,
        nscr: Mx,
        nshortmid: zx,
        nshortparallel: Hx,
        nsim: Gx,
        nsime: Vx,
        nsimeq: Wx,
        nsmid: Zx,
        nspar: Jx,
        nsqsube: Kx,
        nsqsupe: Xx,
        nsub: Yx,
        nsubE: Qx,
        nsube: ek,
        nsubset: rk,
        nsubseteq: tk,
        nsubseteqq: ak,
        nsucc: nk,
        nsucceq: ik,
        nsup: ok,
        nsupE: sk,
        nsupe: lk,
        nsupset: uk,
        nsupseteq: ck,
        nsupseteqq: fk,
        ntgl: pk,
        Ntilde: dk,
        ntilde: vk,
        ntlg: hk,
        ntriangleleft: mk,
        ntrianglelefteq: gk,
        ntriangleright: bk,
        ntrianglerighteq: yk,
        Nu: wk,
        nu: Dk,
        num: xk,
        numero: kk,
        numsp: Ak,
        nvap: Ek,
        nvdash: Sk,
        nvDash: Ck,
        nVdash: _k,
        nVDash: qk,
        nvge: Tk,
        nvgt: $k,
        nvHarr: Lk,
        nvinfin: Ok,
        nvlArr: Rk,
        nvle: Nk,
        nvlt: Pk,
        nvltrie: Fk,
        nvrArr: Bk,
        nvrtrie: Uk,
        nvsim: jk,
        nwarhk: Ik,
        nwarr: Mk,
        nwArr: zk,
        nwarrow: Hk,
        nwnear: Gk,
        Oacute: Vk,
        oacute: Wk,
        oast: Zk,
        Ocirc: Jk,
        ocirc: Kk,
        ocir: Xk,
        Ocy: Yk,
        ocy: Qk,
        odash: eA,
        Odblac: rA,
        odblac: tA,
        odiv: aA,
        odot: nA,
        odsold: iA,
        OElig: oA,
        oelig: sA,
        ofcir: lA,
        Ofr: uA,
        ofr: cA,
        ogon: fA,
        Ograve: pA,
        ograve: dA,
        ogt: vA,
        ohbar: hA,
        ohm: mA,
        oint: gA,
        olarr: bA,
        olcir: yA,
        olcross: wA,
        oline: DA,
        olt: xA,
        Omacr: kA,
        omacr: AA,
        Omega: EA,
        omega: SA,
        Omicron: CA,
        omicron: _A,
        omid: qA,
        ominus: TA,
        Oopf: $A,
        oopf: LA,
        opar: OA,
        OpenCurlyDoubleQuote: RA,
        OpenCurlyQuote: NA,
        operp: PA,
        oplus: FA,
        orarr: BA,
        Or: UA,
        or: jA,
        ord: IA,
        order: MA,
        orderof: zA,
        ordf: HA,
        ordm: GA,
        origof: VA,
        oror: WA,
        orslope: ZA,
        orv: JA,
        oS: KA,
        Oscr: XA,
        oscr: YA,
        Oslash: QA,
        oslash: eE,
        osol: rE,
        Otilde: tE,
        otilde: aE,
        otimesas: nE,
        Otimes: iE,
        otimes: oE,
        Ouml: sE,
        ouml: lE,
        ovbar: uE,
        OverBar: cE,
        OverBrace: fE,
        OverBracket: pE,
        OverParenthesis: dE,
        para: vE,
        parallel: hE,
        par: mE,
        parsim: gE,
        parsl: bE,
        part: yE,
        PartialD: wE,
        Pcy: DE,
        pcy: xE,
        percnt: kE,
        period: AE,
        permil: EE,
        perp: SE,
        pertenk: CE,
        Pfr: _E,
        pfr: qE,
        Phi: TE,
        phi: $E,
        phiv: LE,
        phmmat: OE,
        phone: RE,
        Pi: NE,
        pi: PE,
        pitchfork: FE,
        piv: BE,
        planck: UE,
        planckh: jE,
        plankv: IE,
        plusacir: ME,
        plusb: zE,
        pluscir: HE,
        plus: GE,
        plusdo: VE,
        plusdu: WE,
        pluse: ZE,
        PlusMinus: JE,
        plusmn: KE,
        plussim: XE,
        plustwo: YE,
        pm: QE,
        Poincareplane: eS,
        pointint: rS,
        popf: tS,
        Popf: aS,
        pound: nS,
        prap: iS,
        Pr: oS,
        pr: sS,
        prcue: lS,
        precapprox: uS,
        prec: cS,
        preccurlyeq: fS,
        Precedes: pS,
        PrecedesEqual: dS,
        PrecedesSlantEqual: vS,
        PrecedesTilde: hS,
        preceq: mS,
        precnapprox: gS,
        precneqq: bS,
        precnsim: yS,
        pre: wS,
        prE: DS,
        precsim: xS,
        prime: kS,
        Prime: AS,
        primes: ES,
        prnap: SS,
        prnE: CS,
        prnsim: _S,
        prod: qS,
        Product: TS,
        profalar: $S,
        profline: LS,
        profsurf: OS,
        prop: RS,
        Proportional: NS,
        Proportion: PS,
        propto: FS,
        prsim: BS,
        prurel: US,
        Pscr: jS,
        pscr: IS,
        Psi: MS,
        psi: zS,
        puncsp: HS,
        Qfr: GS,
        qfr: VS,
        qint: WS,
        qopf: ZS,
        Qopf: JS,
        qprime: KS,
        Qscr: XS,
        qscr: YS,
        quaternions: QS,
        quatint: e3,
        quest: r3,
        questeq: t3,
        quot: a3,
        QUOT: n3,
        rAarr: i3,
        race: o3,
        Racute: s3,
        racute: l3,
        radic: u3,
        raemptyv: c3,
        rang: f3,
        Rang: p3,
        rangd: d3,
        range: v3,
        rangle: h3,
        raquo: m3,
        rarrap: g3,
        rarrb: b3,
        rarrbfs: y3,
        rarrc: w3,
        rarr: D3,
        Rarr: x3,
        rArr: k3,
        rarrfs: A3,
        rarrhk: E3,
        rarrlp: S3,
        rarrpl: C3,
        rarrsim: _3,
        Rarrtl: q3,
        rarrtl: T3,
        rarrw: $3,
        ratail: L3,
        rAtail: O3,
        ratio: R3,
        rationals: N3,
        rbarr: P3,
        rBarr: F3,
        RBarr: B3,
        rbbrk: U3,
        rbrace: j3,
        rbrack: I3,
        rbrke: M3,
        rbrksld: z3,
        rbrkslu: H3,
        Rcaron: G3,
        rcaron: V3,
        Rcedil: W3,
        rcedil: Z3,
        rceil: J3,
        rcub: K3,
        Rcy: X3,
        rcy: Y3,
        rdca: Q3,
        rdldhar: eC,
        rdquo: rC,
        rdquor: tC,
        rdsh: aC,
        real: nC,
        realine: iC,
        realpart: oC,
        reals: sC,
        Re: lC,
        rect: uC,
        reg: cC,
        REG: fC,
        ReverseElement: pC,
        ReverseEquilibrium: dC,
        ReverseUpEquilibrium: vC,
        rfisht: hC,
        rfloor: mC,
        rfr: gC,
        Rfr: bC,
        rHar: yC,
        rhard: wC,
        rharu: DC,
        rharul: xC,
        Rho: kC,
        rho: AC,
        rhov: EC,
        RightAngleBracket: SC,
        RightArrowBar: CC,
        rightarrow: _C,
        RightArrow: qC,
        Rightarrow: TC,
        RightArrowLeftArrow: $C,
        rightarrowtail: LC,
        RightCeiling: OC,
        RightDoubleBracket: RC,
        RightDownTeeVector: NC,
        RightDownVectorBar: PC,
        RightDownVector: FC,
        RightFloor: BC,
        rightharpoondown: UC,
        rightharpoonup: jC,
        rightleftarrows: IC,
        rightleftharpoons: MC,
        rightrightarrows: zC,
        rightsquigarrow: HC,
        RightTeeArrow: GC,
        RightTee: VC,
        RightTeeVector: WC,
        rightthreetimes: ZC,
        RightTriangleBar: JC,
        RightTriangle: KC,
        RightTriangleEqual: XC,
        RightUpDownVector: YC,
        RightUpTeeVector: QC,
        RightUpVectorBar: e_,
        RightUpVector: r_,
        RightVectorBar: t_,
        RightVector: a_,
        ring: n_,
        risingdotseq: i_,
        rlarr: o_,
        rlhar: s_,
        rlm: l_,
        rmoustache: u_,
        rmoust: c_,
        rnmid: f_,
        roang: p_,
        roarr: d_,
        robrk: v_,
        ropar: h_,
        ropf: m_,
        Ropf: g_,
        roplus: b_,
        rotimes: y_,
        RoundImplies: w_,
        rpar: D_,
        rpargt: x_,
        rppolint: k_,
        rrarr: A_,
        Rrightarrow: E_,
        rsaquo: S_,
        rscr: C_,
        Rscr: __,
        rsh: q_,
        Rsh: T_,
        rsqb: $_,
        rsquo: L_,
        rsquor: O_,
        rthree: R_,
        rtimes: N_,
        rtri: P_,
        rtrie: F_,
        rtrif: B_,
        rtriltri: U_,
        RuleDelayed: j_,
        ruluhar: I_,
        rx: M_,
        Sacute: z_,
        sacute: H_,
        sbquo: G_,
        scap: V_,
        Scaron: W_,
        scaron: Z_,
        Sc: J_,
        sc: K_,
        sccue: X_,
        sce: Y_,
        scE: Q_,
        Scedil: eq,
        scedil: rq,
        Scirc: tq,
        scirc: aq,
        scnap: nq,
        scnE: iq,
        scnsim: oq,
        scpolint: sq,
        scsim: lq,
        Scy: uq,
        scy: cq,
        sdotb: fq,
        sdot: pq,
        sdote: dq,
        searhk: vq,
        searr: hq,
        seArr: mq,
        searrow: gq,
        sect: bq,
        semi: yq,
        seswar: wq,
        setminus: Dq,
        setmn: xq,
        sext: kq,
        Sfr: Aq,
        sfr: Eq,
        sfrown: Sq,
        sharp: Cq,
        SHCHcy: _q,
        shchcy: qq,
        SHcy: Tq,
        shcy: $q,
        ShortDownArrow: Lq,
        ShortLeftArrow: Oq,
        shortmid: Rq,
        shortparallel: Nq,
        ShortRightArrow: Pq,
        ShortUpArrow: Fq,
        shy: Bq,
        Sigma: Uq,
        sigma: jq,
        sigmaf: Iq,
        sigmav: Mq,
        sim: zq,
        simdot: Hq,
        sime: Gq,
        simeq: Vq,
        simg: Wq,
        simgE: Zq,
        siml: Jq,
        simlE: Kq,
        simne: Xq,
        simplus: Yq,
        simrarr: Qq,
        slarr: eT,
        SmallCircle: rT,
        smallsetminus: tT,
        smashp: aT,
        smeparsl: nT,
        smid: iT,
        smile: oT,
        smt: sT,
        smte: lT,
        smtes: uT,
        SOFTcy: cT,
        softcy: fT,
        solbar: pT,
        solb: dT,
        sol: vT,
        Sopf: hT,
        sopf: mT,
        spades: gT,
        spadesuit: bT,
        spar: yT,
        sqcap: wT,
        sqcaps: DT,
        sqcup: xT,
        sqcups: kT,
        Sqrt: AT,
        sqsub: ET,
        sqsube: ST,
        sqsubset: CT,
        sqsubseteq: _T,
        sqsup: qT,
        sqsupe: TT,
        sqsupset: $T,
        sqsupseteq: LT,
        square: OT,
        Square: RT,
        SquareIntersection: NT,
        SquareSubset: PT,
        SquareSubsetEqual: FT,
        SquareSuperset: BT,
        SquareSupersetEqual: UT,
        SquareUnion: jT,
        squarf: IT,
        squ: MT,
        squf: zT,
        srarr: HT,
        Sscr: GT,
        sscr: VT,
        ssetmn: WT,
        ssmile: ZT,
        sstarf: JT,
        Star: KT,
        star: XT,
        starf: YT,
        straightepsilon: QT,
        straightphi: e$,
        strns: r$,
        sub: t$,
        Sub: a$,
        subdot: n$,
        subE: i$,
        sube: o$,
        subedot: s$,
        submult: l$,
        subnE: u$,
        subne: c$,
        subplus: f$,
        subrarr: p$,
        subset: d$,
        Subset: v$,
        subseteq: h$,
        subseteqq: m$,
        SubsetEqual: g$,
        subsetneq: b$,
        subsetneqq: y$,
        subsim: w$,
        subsub: D$,
        subsup: x$,
        succapprox: k$,
        succ: A$,
        succcurlyeq: E$,
        Succeeds: S$,
        SucceedsEqual: C$,
        SucceedsSlantEqual: _$,
        SucceedsTilde: q$,
        succeq: T$,
        succnapprox: $$,
        succneqq: L$,
        succnsim: O$,
        succsim: R$,
        SuchThat: N$,
        sum: P$,
        Sum: F$,
        sung: B$,
        sup1: U$,
        sup2: j$,
        sup3: I$,
        sup: M$,
        Sup: z$,
        supdot: H$,
        supdsub: G$,
        supE: V$,
        supe: W$,
        supedot: Z$,
        Superset: J$,
        SupersetEqual: K$,
        suphsol: X$,
        suphsub: Y$,
        suplarr: Q$,
        supmult: eL,
        supnE: rL,
        supne: tL,
        supplus: aL,
        supset: nL,
        Supset: iL,
        supseteq: oL,
        supseteqq: sL,
        supsetneq: lL,
        supsetneqq: uL,
        supsim: cL,
        supsub: fL,
        supsup: pL,
        swarhk: dL,
        swarr: vL,
        swArr: hL,
        swarrow: mL,
        swnwar: gL,
        szlig: bL,
        Tab: yL,
        target: wL,
        Tau: DL,
        tau: xL,
        tbrk: kL,
        Tcaron: AL,
        tcaron: EL,
        Tcedil: SL,
        tcedil: CL,
        Tcy: _L,
        tcy: qL,
        tdot: TL,
        telrec: $L,
        Tfr: LL,
        tfr: OL,
        there4: RL,
        therefore: NL,
        Therefore: PL,
        Theta: FL,
        theta: BL,
        thetasym: UL,
        thetav: jL,
        thickapprox: IL,
        thicksim: ML,
        ThickSpace: zL,
        ThinSpace: HL,
        thinsp: GL,
        thkap: VL,
        thksim: WL,
        THORN: ZL,
        thorn: JL,
        tilde: KL,
        Tilde: XL,
        TildeEqual: YL,
        TildeFullEqual: QL,
        TildeTilde: e8,
        timesbar: r8,
        timesb: t8,
        times: a8,
        timesd: n8,
        tint: i8,
        toea: o8,
        topbot: s8,
        topcir: l8,
        top: u8,
        Topf: c8,
        topf: f8,
        topfork: p8,
        tosa: d8,
        tprime: v8,
        trade: h8,
        TRADE: m8,
        triangle: g8,
        triangledown: b8,
        triangleleft: y8,
        trianglelefteq: w8,
        triangleq: D8,
        triangleright: x8,
        trianglerighteq: k8,
        tridot: A8,
        trie: E8,
        triminus: S8,
        TripleDot: C8,
        triplus: _8,
        trisb: q8,
        tritime: T8,
        trpezium: $8,
        Tscr: L8,
        tscr: O8,
        TScy: R8,
        tscy: N8,
        TSHcy: P8,
        tshcy: F8,
        Tstrok: B8,
        tstrok: U8,
        twixt: j8,
        twoheadleftarrow: I8,
        twoheadrightarrow: M8,
        Uacute: z8,
        uacute: H8,
        uarr: G8,
        Uarr: V8,
        uArr: W8,
        Uarrocir: Z8,
        Ubrcy: J8,
        ubrcy: K8,
        Ubreve: X8,
        ubreve: Y8,
        Ucirc: Q8,
        ucirc: e4,
        Ucy: r4,
        ucy: t4,
        udarr: a4,
        Udblac: n4,
        udblac: i4,
        udhar: o4,
        ufisht: s4,
        Ufr: l4,
        ufr: u4,
        Ugrave: c4,
        ugrave: f4,
        uHar: p4,
        uharl: d4,
        uharr: v4,
        uhblk: h4,
        ulcorn: m4,
        ulcorner: g4,
        ulcrop: b4,
        ultri: y4,
        Umacr: w4,
        umacr: D4,
        uml: x4,
        UnderBar: k4,
        UnderBrace: A4,
        UnderBracket: E4,
        UnderParenthesis: S4,
        Union: C4,
        UnionPlus: _4,
        Uogon: q4,
        uogon: T4,
        Uopf: $4,
        uopf: L4,
        UpArrowBar: O4,
        uparrow: R4,
        UpArrow: N4,
        Uparrow: P4,
        UpArrowDownArrow: F4,
        updownarrow: B4,
        UpDownArrow: U4,
        Updownarrow: j4,
        UpEquilibrium: I4,
        upharpoonleft: M4,
        upharpoonright: z4,
        uplus: H4,
        UpperLeftArrow: G4,
        UpperRightArrow: V4,
        upsi: W4,
        Upsi: Z4,
        upsih: J4,
        Upsilon: K4,
        upsilon: X4,
        UpTeeArrow: Y4,
        UpTee: Q4,
        upuparrows: eO,
        urcorn: rO,
        urcorner: tO,
        urcrop: aO,
        Uring: nO,
        uring: iO,
        urtri: oO,
        Uscr: sO,
        uscr: lO,
        utdot: uO,
        Utilde: cO,
        utilde: fO,
        utri: pO,
        utrif: dO,
        uuarr: vO,
        Uuml: hO,
        uuml: mO,
        uwangle: gO,
        vangrt: bO,
        varepsilon: yO,
        varkappa: wO,
        varnothing: DO,
        varphi: xO,
        varpi: kO,
        varpropto: AO,
        varr: EO,
        vArr: SO,
        varrho: CO,
        varsigma: _O,
        varsubsetneq: qO,
        varsubsetneqq: TO,
        varsupsetneq: $O,
        varsupsetneqq: LO,
        vartheta: OO,
        vartriangleleft: RO,
        vartriangleright: NO,
        vBar: PO,
        Vbar: FO,
        vBarv: BO,
        Vcy: UO,
        vcy: jO,
        vdash: IO,
        vDash: MO,
        Vdash: zO,
        VDash: HO,
        Vdashl: GO,
        veebar: VO,
        vee: WO,
        Vee: ZO,
        veeeq: JO,
        vellip: KO,
        verbar: XO,
        Verbar: YO,
        vert: QO,
        Vert: eR,
        VerticalBar: rR,
        VerticalLine: tR,
        VerticalSeparator: aR,
        VerticalTilde: nR,
        VeryThinSpace: iR,
        Vfr: oR,
        vfr: sR,
        vltri: lR,
        vnsub: uR,
        vnsup: cR,
        Vopf: fR,
        vopf: pR,
        vprop: dR,
        vrtri: vR,
        Vscr: hR,
        vscr: mR,
        vsubnE: gR,
        vsubne: bR,
        vsupnE: yR,
        vsupne: wR,
        Vvdash: DR,
        vzigzag: xR,
        Wcirc: kR,
        wcirc: AR,
        wedbar: ER,
        wedge: SR,
        Wedge: CR,
        wedgeq: _R,
        weierp: qR,
        Wfr: TR,
        wfr: $R,
        Wopf: LR,
        wopf: OR,
        wp: RR,
        wr: NR,
        wreath: PR,
        Wscr: FR,
        wscr: BR,
        xcap: UR,
        xcirc: jR,
        xcup: IR,
        xdtri: MR,
        Xfr: zR,
        xfr: HR,
        xharr: GR,
        xhArr: VR,
        Xi: WR,
        xi: ZR,
        xlarr: JR,
        xlArr: KR,
        xmap: XR,
        xnis: YR,
        xodot: QR,
        Xopf: eN,
        xopf: rN,
        xoplus: tN,
        xotime: aN,
        xrarr: nN,
        xrArr: iN,
        Xscr: oN,
        xscr: sN,
        xsqcup: lN,
        xuplus: uN,
        xutri: cN,
        xvee: fN,
        xwedge: pN,
        Yacute: dN,
        yacute: vN,
        YAcy: hN,
        yacy: mN,
        Ycirc: gN,
        ycirc: bN,
        Ycy: yN,
        ycy: wN,
        yen: DN,
        Yfr: xN,
        yfr: kN,
        YIcy: AN,
        yicy: EN,
        Yopf: SN,
        yopf: CN,
        Yscr: _N,
        yscr: qN,
        YUcy: TN,
        yucy: $N,
        yuml: LN,
        Yuml: ON,
        Zacute: RN,
        zacute: NN,
        Zcaron: PN,
        zcaron: FN,
        Zcy: BN,
        zcy: UN,
        Zdot: jN,
        zdot: IN,
        zeetrf: MN,
        ZeroWidthSpace: zN,
        Zeta: HN,
        zeta: GN,
        zfr: VN,
        Zfr: WN,
        ZHcy: ZN,
        zhcy: JN,
        zigrarr: KN,
        zopf: XN,
        Zopf: YN,
        Zscr: QN,
        zscr: eP,
        zwj: rP,
        zwnj: tP,
        default: zB
      }), aP = "Á", nP = "á", iP = "Â", oP = "â", sP = "´", lP = "Æ", uP = "æ", cP = "À", fP = "à", pP = "&", dP = "&", vP = "Å", hP = "å", mP = "Ã", gP = "ã", bP = "Ä", yP = "ä", wP = "¦", DP = "Ç", xP = "ç", kP = "¸", AP = "¢", EP = "©", SP = "©", CP = "¤", _P = "°", qP = "÷", TP = "É", $P = "é", LP = "Ê", OP = "ê", RP = "È", NP = "è", PP = "Ð", FP = "ð", BP = "Ë", UP = "ë", jP = "½", IP = "¼", MP = "¾", zP = ">", HP = ">", GP = "Í", VP = "í", WP = "Î", ZP = "î", JP = "¡", KP = "Ì", XP = "ì", YP = "¿", QP = "Ï", e6 = "ï", r6 = "«", t6 = "<", a6 = "<", n6 = "¯", i6 = "µ", o6 = "·", s6 = " ", l6 = "¬", u6 = "Ñ", c6 = "ñ", f6 = "Ó", p6 = "ó", d6 = "Ô", v6 = "ô", h6 = "Ò", m6 = "ò", g6 = "ª", b6 = "º", y6 = "Ø", w6 = "ø", D6 = "Õ", x6 = "õ", k6 = "Ö", A6 = "ö", E6 = "¶", S6 = "±", C6 = "£", _6 = '"', q6 = '"', T6 = "»", $6 = "®", L6 = "®", O6 = "§", R6 = "­", N6 = "¹", P6 = "²", F6 = "³", B6 = "ß", U6 = "Þ", j6 = "þ", I6 = "×", M6 = "Ú", z6 = "ú", H6 = "Û", G6 = "û", V6 = "Ù", W6 = "ù", Z6 = "¨", J6 = "Ü", K6 = "ü", X6 = "Ý", Y6 = "ý", Q6 = "¥", e5 = "ÿ", GB = {
        Aacute: aP,
        aacute: nP,
        Acirc: iP,
        acirc: oP,
        acute: sP,
        AElig: lP,
        aelig: uP,
        Agrave: cP,
        agrave: fP,
        amp: pP,
        AMP: dP,
        Aring: vP,
        aring: hP,
        Atilde: mP,
        atilde: gP,
        Auml: bP,
        auml: yP,
        brvbar: wP,
        Ccedil: DP,
        ccedil: xP,
        cedil: kP,
        cent: AP,
        copy: EP,
        COPY: SP,
        curren: CP,
        deg: _P,
        divide: qP,
        Eacute: TP,
        eacute: $P,
        Ecirc: LP,
        ecirc: OP,
        Egrave: RP,
        egrave: NP,
        ETH: PP,
        eth: FP,
        Euml: BP,
        euml: UP,
        frac12: jP,
        frac14: IP,
        frac34: MP,
        gt: zP,
        GT: HP,
        Iacute: GP,
        iacute: VP,
        Icirc: WP,
        icirc: ZP,
        iexcl: JP,
        Igrave: KP,
        igrave: XP,
        iquest: YP,
        Iuml: QP,
        iuml: e6,
        laquo: r6,
        lt: t6,
        LT: a6,
        macr: n6,
        micro: i6,
        middot: o6,
        nbsp: s6,
        not: l6,
        Ntilde: u6,
        ntilde: c6,
        Oacute: f6,
        oacute: p6,
        Ocirc: d6,
        ocirc: v6,
        Ograve: h6,
        ograve: m6,
        ordf: g6,
        ordm: b6,
        Oslash: y6,
        oslash: w6,
        Otilde: D6,
        otilde: x6,
        Ouml: k6,
        ouml: A6,
        para: E6,
        plusmn: S6,
        pound: C6,
        quot: _6,
        QUOT: q6,
        raquo: T6,
        reg: $6,
        REG: L6,
        sect: O6,
        shy: R6,
        sup1: N6,
        sup2: P6,
        sup3: F6,
        szlig: B6,
        THORN: U6,
        thorn: j6,
        times: I6,
        Uacute: M6,
        uacute: z6,
        Ucirc: H6,
        ucirc: G6,
        Ugrave: V6,
        ugrave: W6,
        uml: Z6,
        Uuml: J6,
        uuml: K6,
        Yacute: X6,
        yacute: Y6,
        yen: Q6,
        yuml: e5
      }, VB = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        Aacute: aP,
        aacute: nP,
        Acirc: iP,
        acirc: oP,
        acute: sP,
        AElig: lP,
        aelig: uP,
        Agrave: cP,
        agrave: fP,
        amp: pP,
        AMP: dP,
        Aring: vP,
        aring: hP,
        Atilde: mP,
        atilde: gP,
        Auml: bP,
        auml: yP,
        brvbar: wP,
        Ccedil: DP,
        ccedil: xP,
        cedil: kP,
        cent: AP,
        copy: EP,
        COPY: SP,
        curren: CP,
        deg: _P,
        divide: qP,
        Eacute: TP,
        eacute: $P,
        Ecirc: LP,
        ecirc: OP,
        Egrave: RP,
        egrave: NP,
        ETH: PP,
        eth: FP,
        Euml: BP,
        euml: UP,
        frac12: jP,
        frac14: IP,
        frac34: MP,
        gt: zP,
        GT: HP,
        Iacute: GP,
        iacute: VP,
        Icirc: WP,
        icirc: ZP,
        iexcl: JP,
        Igrave: KP,
        igrave: XP,
        iquest: YP,
        Iuml: QP,
        iuml: e6,
        laquo: r6,
        lt: t6,
        LT: a6,
        macr: n6,
        micro: i6,
        middot: o6,
        nbsp: s6,
        not: l6,
        Ntilde: u6,
        ntilde: c6,
        Oacute: f6,
        oacute: p6,
        Ocirc: d6,
        ocirc: v6,
        Ograve: h6,
        ograve: m6,
        ordf: g6,
        ordm: b6,
        Oslash: y6,
        oslash: w6,
        Otilde: D6,
        otilde: x6,
        Ouml: k6,
        ouml: A6,
        para: E6,
        plusmn: S6,
        pound: C6,
        quot: _6,
        QUOT: q6,
        raquo: T6,
        reg: $6,
        REG: L6,
        sect: O6,
        shy: R6,
        sup1: N6,
        sup2: P6,
        sup3: F6,
        szlig: B6,
        THORN: U6,
        thorn: j6,
        times: I6,
        Uacute: M6,
        uacute: z6,
        Ucirc: H6,
        ucirc: G6,
        Ugrave: V6,
        ugrave: W6,
        uml: Z6,
        Uuml: J6,
        uuml: K6,
        Yacute: X6,
        yacute: Y6,
        yen: Q6,
        yuml: e5,
        default: GB
      }), r5 = "&", t5 = "'", a5 = ">", n5 = "<", i5 = '"', WB = {
        amp: r5,
        apos: t5,
        gt: a5,
        lt: n5,
        quot: i5
      }, ZB = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        amp: r5,
        apos: t5,
        gt: a5,
        lt: n5,
        quot: i5,
        default: WB
      }), JB = {
        0: 65533,
        128: 8364,
        130: 8218,
        131: 402,
        132: 8222,
        133: 8230,
        134: 8224,
        135: 8225,
        136: 710,
        137: 8240,
        138: 352,
        139: 8249,
        140: 338,
        142: 381,
        145: 8216,
        146: 8217,
        147: 8220,
        148: 8221,
        149: 8226,
        150: 8211,
        151: 8212,
        152: 732,
        153: 8482,
        154: 353,
        155: 8250,
        156: 339,
        158: 382,
        159: 376
      }, KB = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        default: JB
      }), XB = b(KB), o5 = $(function(a, l) {
        var f = T && T.__importDefault || function(w) {
          return w && w.__esModule ? w : { default: w };
        };
        Object.defineProperty(l, "__esModule", { value: !0 });
        var d = f(XB);
        function E(w) {
          if (w >= 55296 && w <= 57343 || w > 1114111)
            return "�";
          w in d.default && (w = d.default[w]);
          var N = "";
          return w > 65535 && (w -= 65536, N += String.fromCharCode(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), N += String.fromCharCode(w), N;
        }
        l.default = E;
      });
      x(o5);
      var s5 = b(HB), YB = b(VB), l5 = b(ZB), _e = $(function(a, l) {
        var f = T && T.__importDefault || function(G) {
          return G && G.__esModule ? G : { default: G };
        };
        Object.defineProperty(l, "__esModule", { value: !0 });
        var d = f(s5), E = f(YB), w = f(l5), N = f(o5);
        l.decodeXML = O(w.default), l.decodeHTMLStrict = O(d.default);
        function O(G) {
          var V = Object.keys(G).join("|"), Y = X(G);
          V += "|#[xX][\\da-fA-F]+|#\\d+";
          var Q = new RegExp("&(?:" + V + ");", "g");
          return function(pe) {
            return String(pe).replace(Q, Y);
          };
        }
        var F = function(G, V) {
          return G < V ? 1 : -1;
        };
        l.decodeHTML = function() {
          for (var G = Object.keys(E.default).sort(F), V = Object.keys(d.default).sort(F), Y = 0, Q = 0; Y < V.length; Y++)
            G[Q] === V[Y] ? (V[Y] += ";?", Q++) : V[Y] += ";";
          var pe = new RegExp("&(?:" + V.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"), Me = X(d.default);
          function it(ze) {
            return ze.substr(-1) !== ";" && (ze += ";"), Me(ze);
          }
          return function(ze) {
            return String(ze).replace(pe, it);
          };
        }();
        function X(G) {
          return function(Y) {
            return Y.charAt(1) === "#" ? Y.charAt(2) === "X" || Y.charAt(2) === "x" ? N.default(parseInt(Y.substr(3), 16)) : N.default(parseInt(Y.substr(2), 10)) : G[Y.slice(1, -1)];
          };
        }
      });
      x(_e), _e.decodeXML, _e.decodeHTMLStrict, _e.decodeHTML;
      var Be = $(function(a, l) {
        var f = T && T.__importDefault || function(de) {
          return de && de.__esModule ? de : { default: de };
        };
        Object.defineProperty(l, "__esModule", { value: !0 });
        var d = f(l5), E = X(d.default), w = G(E);
        l.encodeXML = Me(E, w);
        var N = f(s5), O = X(N.default), F = G(O);
        l.encodeHTML = Me(O, F);
        function X(de) {
          return Object.keys(de).sort().reduce(function(Oe, Se) {
            return Oe[de[Se]] = "&" + Se + ";", Oe;
          }, {});
        }
        function G(de) {
          var Oe = [], Se = [];
          return Object.keys(de).forEach(function(He) {
            return He.length === 1 ? (
              // Add value to single array
              Oe.push("\\" + He)
            ) : (
              // Add value to multiple array
              Se.push(He)
            );
          }), Se.unshift("[" + Oe.join("") + "]"), new RegExp(Se.join("|"), "g");
        }
        var V = /[^\0-\x7F]/g, Y = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
        function Q(de) {
          return "&#x" + de.charCodeAt(0).toString(16).toUpperCase() + ";";
        }
        function pe(de, Oe) {
          var Se = de.charCodeAt(0), He = de.charCodeAt(1), AI = (Se - 55296) * 1024 + He - 56320 + 65536;
          return "&#x" + AI.toString(16).toUpperCase() + ";";
        }
        function Me(de, Oe) {
          return function(Se) {
            return Se.replace(Oe, function(He) {
              return de[He];
            }).replace(Y, pe).replace(V, Q);
          };
        }
        var it = G(E);
        function ze(de) {
          return de.replace(it, Q).replace(Y, pe).replace(V, Q);
        }
        l.escape = ze;
      });
      x(Be), Be.encodeXML, Be.encodeHTML, Be.escape;
      var he = $(function(a, l) {
        Object.defineProperty(l, "__esModule", { value: !0 });
        function f(O, F) {
          return (!F || F <= 0 ? _e.decodeXML : _e.decodeHTML)(O);
        }
        l.decode = f;
        function d(O, F) {
          return (!F || F <= 0 ? _e.decodeXML : _e.decodeHTMLStrict)(O);
        }
        l.decodeStrict = d;
        function E(O, F) {
          return (!F || F <= 0 ? Be.encodeXML : Be.encodeHTML)(O);
        }
        l.encode = E;
        var w = Be;
        l.encodeXML = w.encodeXML, l.encodeHTML = w.encodeHTML, l.escape = w.escape, l.encodeHTML4 = w.encodeHTML, l.encodeHTML5 = w.encodeHTML;
        var N = _e;
        l.decodeXML = N.decodeXML, l.decodeHTML = N.decodeHTML, l.decodeHTMLStrict = N.decodeHTMLStrict, l.decodeHTML4 = N.decodeHTML, l.decodeHTML5 = N.decodeHTML, l.decodeHTML4Strict = N.decodeHTMLStrict, l.decodeHTML5Strict = N.decodeHTMLStrict, l.decodeXMLStrict = N.decodeXML;
      });
      x(he), he.decode, he.decodeStrict, he.encode, he.encodeXML, he.encodeHTML, he.escape, he.encodeHTML4, he.encodeHTML5, he.decodeXML;
      var u5 = he.decodeHTML;
      he.decodeHTMLStrict, he.decodeHTML4, he.decodeHTML5, he.decodeHTML4Strict, he.decodeHTML5Strict, he.decodeXMLStrict;
      var QB = 92, c5 = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});", f5 = "[A-Za-z][A-Za-z0-9-]*", eU = "[a-zA-Z_:][a-zA-Z0-9:._-]*", rU = "[^\"'=<>`\\x00-\\x20]+", tU = "'[^']*'", aU = '"[^"]*"', nU = "(?:" + rU + "|" + tU + "|" + aU + ")", iU = "(?:\\s*=\\s*" + nU + ")", oU = "(?:\\s+" + eU + iU + "?)", p5 = "<" + f5 + oU + "*\\s*/?>", d5 = "</" + f5 + "\\s*[>]", sU = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", lU = "[<][?][\\s\\S]*?[?][>]", uU = "<![A-Z]+\\s+[^>]*>", cU = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", fU = "(?:" + p5 + "|" + d5 + "|" + sU + "|" + lU + "|" + uU + "|" + cU + ")", pU = new RegExp("^" + fU), dU = /[\\&]/, v5 = "[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]", vU = new RegExp("\\\\" + v5 + "|" + c5, "gi"), hU = '[&<>"]', h5 = new RegExp(hU, "g"), mU = function(a) {
        return a.charCodeAt(0) === QB ? a.charAt(1) : u5(a);
      }, m5 = function(a) {
        return dU.test(a) ? a.replace(vU, mU) : a;
      }, gU = function(a) {
        try {
          return y(a);
        } catch {
          return a;
        }
      }, bU = function(a) {
        switch (a) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          default:
            return a;
        }
      }, g5 = function(a) {
        return h5.test(a) ? a.replace(h5, bU) : a;
      };
      /*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
      var Qr;
      function et(a) {
        return Qr(a);
      }
      if (String.fromCodePoint)
        Qr = function(a) {
          try {
            return String.fromCodePoint(a);
          } catch (l) {
            if (l instanceof RangeError)
              return "�";
            throw l;
          }
        };
      else {
        var yU = String.fromCharCode, wU = Math.floor;
        Qr = function() {
          var a = 16384, l = [], f, d, E = -1, w = arguments.length;
          if (!w)
            return "";
          for (var N = ""; ++E < w; ) {
            var O = Number(arguments[E]);
            if (!isFinite(O) || // `NaN`, `+Infinity`, or `-Infinity`
            O < 0 || // not a valid Unicode code point
            O > 1114111 || // not a valid Unicode code point
            wU(O) !== O)
              return "�";
            O <= 65535 ? l.push(O) : (O -= 65536, f = (O >> 10) + 55296, d = O % 1024 + 56320, l.push(f, d)), (E + 1 === w || l.length > a) && (N += yU.apply(null, l), l.length = 0);
          }
          return N;
        };
      }
      /*! http://mths.be/repeat v0.2.0 by @mathias */
      String.prototype.repeat || function() {
        var a = function() {
          try {
            var f = {}, d = Object.defineProperty, E = d(f, f, f) && d;
          } catch {
          }
          return E;
        }(), l = function(f) {
          if (this == null)
            throw TypeError();
          var d = String(this), E = f ? Number(f) : 0;
          if (E != E && (E = 0), E < 0 || E == 1 / 0)
            throw RangeError();
          for (var w = ""; E; )
            E % 2 == 1 && (w += d), E > 1 && (d += d), E >>= 1;
          return w;
        };
        a ? a(String.prototype, "repeat", {
          value: l,
          configurable: !0,
          writable: !0
        }) : String.prototype.repeat = l;
      }();
      var Tr = gU, rt = m5, b5 = 10, tt = 42, $r = 95, DU = 96, y5 = 91, xU = 93, w5 = 60, kU = 33, D5 = 92, AU = 38, x5 = 40, at = 41, EU = 58, Ue = 39, je = 34, k5 = v5, nt = "\\\\" + k5, SU = c5, CU = pU, A5 = new RegExp(
        /[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/
      ), _U = new RegExp(
        '^(?:"(' + nt + `|[^"\\x00])*"|'(` + nt + "|[^'\\x00])*'|\\((" + nt + "|[^()\\x00])*\\))"
      ), qU = /^(?:<(?:[^<>\n\\\x00]|\\.)*>)/, E5 = new RegExp("^" + k5), TU = new RegExp("^" + SU, "i"), $U = /`+/, LU = /^`+/, OU = /\.\.\./g, RU = /--+/g, NU = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/, PU = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i, FU = /^ *(?:\n *)?/, S5 = /^[ \t\n\x0b\x0c\x0d]/, C5 = /^\s/, BU = / *$/, UU = /^ */, _5 = /^ *(?:\n|$)/, jU = /^\[(?:[^\\\[\]]|\\.){0,1000}\]/, IU = /^[^\n`\[\]\\!<&*_'"]+/m, be = function(a) {
        var l = new c("text");
        return l._literal = a, l;
      }, q5 = function(a) {
        return a.slice(1, a.length - 1).trim().replace(/[ \t\r\n]+/, " ").toLowerCase().toUpperCase();
      }, MU = function(a) {
        var l = a.exec(this.subject.slice(this.pos));
        return l === null ? null : (this.pos += l.index + l[0].length, l[0]);
      }, zU = function() {
        return this.pos < this.subject.length ? this.subject.charCodeAt(this.pos) : -1;
      }, HU = function() {
        return this.match(FU), !0;
      }, GU = function(a) {
        var l = this.match(LU);
        if (l === null)
          return !1;
        for (var f = this.pos, d, E, w; (d = this.match($U)) !== null; )
          if (d === l)
            return E = new c("code"), w = this.subject.slice(f, this.pos - l.length).replace(/\n/gm, " "), w.length > 0 && w.match(/[^ ]/) !== null && w[0] == " " && w[w.length - 1] == " " ? E._literal = w.slice(1, w.length - 1) : E._literal = w, a.appendChild(E), !0;
        return this.pos = f, a.appendChild(be(l)), !0;
      }, VU = function(a) {
        var l = this.subject, f;
        return this.pos += 1, this.peek() === b5 ? (this.pos += 1, f = new c("linebreak"), a.appendChild(f)) : E5.test(l.charAt(this.pos)) ? (a.appendChild(be(l.charAt(this.pos))), this.pos += 1) : a.appendChild(be("\\")), !0;
      }, WU = function(a) {
        var l, f, d;
        return (l = this.match(NU)) ? (f = l.slice(1, l.length - 1), d = new c("link"), d._destination = Tr("mailto:" + f), d._title = "", d.appendChild(be(f)), a.appendChild(d), !0) : (l = this.match(PU)) ? (f = l.slice(1, l.length - 1), d = new c("link"), d._destination = Tr(f), d._title = "", d.appendChild(be(f)), a.appendChild(d), !0) : !1;
      }, ZU = function(a) {
        var l = this.match(CU);
        if (l === null)
          return !1;
        var f = new c("html_inline");
        return f._literal = l, a.appendChild(f), !0;
      }, JU = function(a) {
        var l = 0, f, d, E, w = this.pos, N, O, F, X, G, V, Y, Q;
        if (a === Ue || a === je)
          l++, this.pos++;
        else
          for (; this.peek() === a; )
            l++, this.pos++;
        return l === 0 ? null : (f = w === 0 ? `
` : this.subject.charAt(w - 1), E = this.peek(), E === -1 ? d = `
` : d = et(E), G = C5.test(d), V = A5.test(d), Y = C5.test(f), Q = A5.test(f), N = !G && (!V || Y || Q), O = !Y && (!Q || G || V), a === $r ? (F = N && (!O || Q), X = O && (!N || V)) : a === Ue || a === je ? (F = N && !O, X = O) : (F = N, X = O), this.pos = w, { numdelims: l, can_open: F, can_close: X });
      }, KU = function(a, l) {
        var f = this.scanDelims(a);
        if (!f)
          return !1;
        var d = f.numdelims, E = this.pos, w;
        this.pos += d, a === Ue ? w = "’" : a === je ? w = "“" : w = this.subject.slice(E, this.pos);
        var N = be(w);
        return l.appendChild(N), (f.can_open || f.can_close) && (this.options.smart || a !== Ue && a !== je) && (this.delimiters = {
          cc: a,
          numdelims: d,
          origdelims: d,
          node: N,
          previous: this.delimiters,
          next: null,
          can_open: f.can_open,
          can_close: f.can_close
        }, this.delimiters.previous !== null && (this.delimiters.previous.next = this.delimiters)), !0;
      }, XU = function(a) {
        a.previous !== null && (a.previous.next = a.next), a.next === null ? this.delimiters = a.previous : a.next.previous = a.previous;
      }, YU = function(a, l) {
        a.next !== l && (a.next = l, l.previous = a);
      }, QU = function(a) {
        for (var l, f, d, E, w, N, O, F, X, G, V = [[], [], []], Y = !1, Q = 0; Q < 3; Q++)
          V[Q][$r] = a, V[Q][tt] = a, V[Q][Ue] = a, V[Q][je] = a;
        for (f = this.delimiters; f !== null && f.previous !== a; )
          f = f.previous;
        for (; f !== null; ) {
          var pe = f.cc;
          if (!f.can_close)
            f = f.next;
          else {
            for (l = f.previous, G = !1; l !== null && l !== a && l !== V[f.origdelims % 3][pe]; ) {
              if (Y = (f.can_open || l.can_close) && f.origdelims % 3 !== 0 && (l.origdelims + f.origdelims) % 3 === 0, l.cc === f.cc && l.can_open && !Y) {
                G = !0;
                break;
              }
              l = l.previous;
            }
            if (d = f, pe === tt || pe === $r)
              if (!G)
                f = f.next;
              else {
                O = f.numdelims >= 2 && l.numdelims >= 2 ? 2 : 1, E = l.node, w = f.node, l.numdelims -= O, f.numdelims -= O, E._literal = E._literal.slice(
                  0,
                  E._literal.length - O
                ), w._literal = w._literal.slice(
                  0,
                  w._literal.length - O
                );
                var Me = new c(O === 1 ? "emph" : "strong");
                for (F = E._next; F && F !== w; )
                  X = F._next, F.unlink(), Me.appendChild(F), F = X;
                E.insertAfter(Me), YU(l, f), l.numdelims === 0 && (E.unlink(), this.removeDelimiter(l)), f.numdelims === 0 && (w.unlink(), N = f.next, this.removeDelimiter(f), f = N);
              }
            else
              pe === Ue ? (f.node._literal = "’", G && (l.node._literal = "‘"), f = f.next) : pe === je && (f.node._literal = "”", G && (l.node.literal = "“"), f = f.next);
            G || (V[d.origdelims % 3][pe] = d.previous, d.can_open || this.removeDelimiter(d));
          }
        }
        for (; this.delimiters !== null && this.delimiters !== a; )
          this.removeDelimiter(this.delimiters);
      }, ej = function() {
        var a = this.match(_U);
        return a === null ? null : rt(a.substr(1, a.length - 2));
      }, rj = function() {
        var a = this.match(qU);
        if (a === null) {
          if (this.peek() === w5)
            return null;
          for (var l = this.pos, f = 0, d; (d = this.peek()) !== -1; )
            if (d === D5 && E5.test(this.subject.charAt(this.pos + 1)))
              this.pos += 1, this.peek() !== -1 && (this.pos += 1);
            else if (d === x5)
              this.pos += 1, f += 1;
            else if (d === at) {
              if (f < 1)
                break;
              this.pos += 1, f -= 1;
            } else {
              if (S5.exec(et(d)) !== null)
                break;
              this.pos += 1;
            }
          return this.pos === l && d !== at || f !== 0 ? null : (a = this.subject.substr(l, this.pos - l), Tr(rt(a)));
        } else
          return Tr(rt(a.substr(1, a.length - 2)));
      }, tj = function() {
        var a = this.match(jU);
        return a === null || a.length > 1001 ? 0 : a.length;
      }, aj = function(a) {
        var l = this.pos;
        this.pos += 1;
        var f = be("[");
        return a.appendChild(f), this.addBracket(f, l, !1), !0;
      }, nj = function(a) {
        var l = this.pos;
        if (this.pos += 1, this.peek() === y5) {
          this.pos += 1;
          var f = be("![");
          a.appendChild(f), this.addBracket(f, l + 1, !0);
        } else
          a.appendChild(be("!"));
        return !0;
      }, ij = function(a) {
        var l, f, d, E, w = !1, N, O;
        if (this.pos += 1, l = this.pos, O = this.brackets, O === null)
          return a.appendChild(be("]")), !0;
        if (!O.active)
          return a.appendChild(be("]")), this.removeBracket(), !0;
        f = O.image;
        var F = this.pos;
        if (this.peek() === x5 && (this.pos++, this.spnl() && (d = this.parseLinkDestination()) !== null && this.spnl() && // make sure there's a space before the title:
        (S5.test(this.subject.charAt(this.pos - 1)) && (E = this.parseLinkTitle()) || !0) && this.spnl() && this.peek() === at ? (this.pos += 1, w = !0) : this.pos = F), !w) {
          var X = this.pos, G = this.parseLinkLabel();
          if (G > 2 ? N = this.subject.slice(X, X + G) : O.bracketAfter || (N = this.subject.slice(O.index, l)), G === 0 && (this.pos = F), N) {
            var V = this.refmap[q5(N)];
            V && (d = V.destination, E = V.title, w = !0);
          }
        }
        if (w) {
          var Y = new c(f ? "image" : "link");
          Y._destination = d, Y._title = E || "";
          var Q, pe;
          for (Q = O.node._next; Q; )
            pe = Q._next, Q.unlink(), Y.appendChild(Q), Q = pe;
          if (a.appendChild(Y), this.processEmphasis(O.previousDelimiter), this.removeBracket(), O.node.unlink(), !f)
            for (O = this.brackets; O !== null; )
              O.image || (O.active = !1), O = O.previous;
          return !0;
        } else
          return this.removeBracket(), this.pos = l, a.appendChild(be("]")), !0;
      }, oj = function(a, l, f) {
        this.brackets !== null && (this.brackets.bracketAfter = !0), this.brackets = {
          node: a,
          previous: this.brackets,
          previousDelimiter: this.delimiters,
          index: l,
          image: f,
          active: !0
        };
      }, sj = function() {
        this.brackets = this.brackets.previous;
      }, lj = function(a) {
        var l;
        return (l = this.match(TU)) ? (a.appendChild(be(u5(l))), !0) : !1;
      }, uj = function(a) {
        var l;
        return (l = this.match(IU)) ? (this.options.smart ? a.appendChild(
          be(
            l.replace(OU, "…").replace(RU, function(f) {
              var d = 0, E = 0;
              return f.length % 3 === 0 ? E = f.length / 3 : f.length % 2 === 0 ? d = f.length / 2 : f.length % 3 === 2 ? (d = 1, E = (f.length - 2) / 3) : (d = 2, E = (f.length - 4) / 3), "—".repeat(E) + "–".repeat(d);
            })
          )
        ) : a.appendChild(be(l)), !0) : !1;
      }, cj = function(a) {
        this.pos += 1;
        var l = a._lastChild;
        if (l && l.type === "text" && l._literal[l._literal.length - 1] === " ") {
          var f = l._literal[l._literal.length - 2] === " ";
          l._literal = l._literal.replace(BU, ""), a.appendChild(new c(f ? "linebreak" : "softbreak"));
        } else
          a.appendChild(new c("softbreak"));
        return this.match(UU), !0;
      }, fj = function(a, l) {
        this.subject = a, this.pos = 0;
        var f, d, E, w, N = this.pos;
        if (w = this.parseLinkLabel(), w === 0)
          return 0;
        if (f = this.subject.substr(0, w), this.peek() === EU)
          this.pos++;
        else
          return this.pos = N, 0;
        if (this.spnl(), d = this.parseLinkDestination(), d === null)
          return this.pos = N, 0;
        var O = this.pos;
        this.spnl(), this.pos !== O && (E = this.parseLinkTitle()), E === null && (E = "", this.pos = O);
        var F = !0;
        if (this.match(_5) === null && (E === "" ? F = !1 : (E = "", this.pos = O, F = this.match(_5) !== null)), !F)
          return this.pos = N, 0;
        var X = q5(f);
        return X === "" ? (this.pos = N, 0) : (l[X] || (l[X] = { destination: d, title: E }), this.pos - N);
      }, pj = function(a) {
        var l = !1, f = this.peek();
        if (f === -1)
          return !1;
        switch (f) {
          case b5:
            l = this.parseNewline(a);
            break;
          case D5:
            l = this.parseBackslash(a);
            break;
          case DU:
            l = this.parseBackticks(a);
            break;
          case tt:
          case $r:
            l = this.handleDelim(f, a);
            break;
          case Ue:
          case je:
            l = this.options.smart && this.handleDelim(f, a);
            break;
          case y5:
            l = this.parseOpenBracket(a);
            break;
          case kU:
            l = this.parseBang(a);
            break;
          case xU:
            l = this.parseCloseBracket(a);
            break;
          case w5:
            l = this.parseAutolink(a) || this.parseHtmlTag(a);
            break;
          case AU:
            l = this.parseEntity(a);
            break;
          default:
            l = this.parseString(a);
            break;
        }
        return l || (this.pos += 1, a.appendChild(be(et(f)))), !0;
      }, dj = function(a) {
        for (this.subject = a._string_content.trim(), this.pos = 0, this.delimiters = null, this.brackets = null; this.parseInline(a); )
          ;
        a._string_content = null, this.processEmphasis(null);
      };
      function vj(a) {
        return {
          subject: "",
          delimiters: null,
          // used by handleDelim method
          brackets: null,
          pos: 0,
          refmap: {},
          match: MU,
          peek: zU,
          spnl: HU,
          parseBackticks: GU,
          parseBackslash: VU,
          parseAutolink: WU,
          parseHtmlTag: ZU,
          scanDelims: JU,
          handleDelim: KU,
          parseLinkTitle: ej,
          parseLinkDestination: rj,
          parseLinkLabel: tj,
          parseOpenBracket: aj,
          parseBang: nj,
          parseCloseBracket: ij,
          addBracket: oj,
          removeBracket: sj,
          parseEntity: lj,
          parseString: uj,
          parseNewline: cj,
          parseReference: fj,
          parseInline: pj,
          processEmphasis: QU,
          removeDelimiter: XU,
          options: a || {},
          parse: dj
        };
      }
      var Lr = 4, T5 = 9, hj = 10, $5 = 62, mj = 60, L5 = 32, O5 = 91, gj = [
        /./,
        // dummy for 0
        /^<(?:script|pre|textarea|style)(?:\s|>|$)/i,
        /^<!--/,
        /^<[?]/,
        /^<![A-Z]/,
        /^<!\[CDATA\[/,
        /^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,
        new RegExp("^(?:" + p5 + "|" + d5 + ")\\s*$", "i")
      ], bj = [
        /./,
        // dummy for 0
        /<\/(?:script|pre|textarea|style)>/i,
        /-->/,
        /\?>/,
        />/,
        /\]\]>/
      ], yj = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/, wj = /^[#`~*+_=<>0-9-]/, R5 = /[^ \t\f\v\r\n]/, Dj = /^[*+-]/, xj = /^(\d{1,9})([.)])/, kj = /^#{1,6}(?:[ \t]+|$)/, Aj = /^`{3,}(?!.*`)|^~{3,}/, Ej = /^(?:`{3,}|~{3,})(?= *$)/, Sj = /^(?:=+|-+)[ \t]*$/, Cj = /\r\n|\n|\r/, _j = function(a) {
        return !R5.test(a);
      }, or = function(a) {
        return a === L5 || a === T5;
      }, Ae = function(a, l) {
        return l < a.length ? a.charCodeAt(l) : -1;
      }, N5 = function(a) {
        for (; a; ) {
          if (a._lastLineBlank)
            return !0;
          var l = a.type;
          if (!a._lastLineChecked && (l === "list" || l === "item"))
            a._lastLineChecked = !0, a = a._lastChild;
          else {
            a._lastLineChecked = !0;
            break;
          }
        }
        return !1;
      }, qj = function() {
        if (this.partiallyConsumedTab) {
          this.offset += 1;
          var a = 4 - this.column % 4;
          this.tip._string_content += " ".repeat(a);
        }
        this.tip._string_content += this.currentLine.slice(this.offset) + `
`;
      }, Tj = function(a, l) {
        for (; !this.blocks[this.tip.type].canContain(a); )
          this.finalize(this.tip, this.lineNumber - 1);
        var f = l + 1, d = new c(a, [
          [this.lineNumber, f],
          [0, 0]
        ]);
        return d._string_content = "", this.tip.appendChild(d), this.tip = d, d;
      }, $j = function(a, l) {
        var f = a.currentLine.slice(a.nextNonspace), d, E, w, N, O = {
          type: null,
          tight: !0,
          // lists are tight by default
          bulletChar: null,
          start: null,
          delimiter: null,
          padding: null,
          markerOffset: a.indent
        };
        if (a.indent >= 4)
          return null;
        if (d = f.match(Dj))
          O.type = "bullet", O.bulletChar = d[0][0];
        else if ((d = f.match(xj)) && (l.type !== "paragraph" || d[1] === "1"))
          O.type = "ordered", O.start = parseInt(d[1]), O.delimiter = d[2];
        else
          return null;
        if (E = Ae(a.currentLine, a.nextNonspace + d[0].length), !(E === -1 || E === T5 || E === L5) || l.type === "paragraph" && !a.currentLine.slice(a.nextNonspace + d[0].length).match(R5))
          return null;
        a.advanceNextNonspace(), a.advanceOffset(d[0].length, !0), w = a.column, N = a.offset;
        do
          a.advanceOffset(1, !0), E = Ae(a.currentLine, a.offset);
        while (a.column - w < 5 && or(E));
        var F = Ae(a.currentLine, a.offset) === -1, X = a.column - w;
        return X >= 5 || X < 1 || F ? (O.padding = d[0].length + 1, a.column = w, a.offset = N, or(Ae(a.currentLine, a.offset)) && a.advanceOffset(1, !0)) : O.padding = d[0].length + X, O;
      }, Lj = function(a, l) {
        return a.type === l.type && a.delimiter === l.delimiter && a.bulletChar === l.bulletChar;
      }, Oj = function() {
        if (!this.allClosed) {
          for (; this.oldtip !== this.lastMatchedContainer; ) {
            var a = this.oldtip._parent;
            this.finalize(this.oldtip, this.lineNumber - 1), this.oldtip = a;
          }
          this.allClosed = !0;
        }
      }, P5 = {
        document: {
          continue: function() {
            return 0;
          },
          finalize: function() {
          },
          canContain: function(a) {
            return a !== "item";
          },
          acceptsLines: !1
        },
        list: {
          continue: function() {
            return 0;
          },
          finalize: function(a, l) {
            for (var f = l._firstChild; f; ) {
              if (N5(f) && f._next) {
                l._listData.tight = !1;
                break;
              }
              for (var d = f._firstChild; d; ) {
                if (N5(d) && (f._next || d._next)) {
                  l._listData.tight = !1;
                  break;
                }
                d = d._next;
              }
              f = f._next;
            }
          },
          canContain: function(a) {
            return a === "item";
          },
          acceptsLines: !1
        },
        block_quote: {
          continue: function(a) {
            var l = a.currentLine;
            if (!a.indented && Ae(l, a.nextNonspace) === $5)
              a.advanceNextNonspace(), a.advanceOffset(1, !1), or(Ae(l, a.offset)) && a.advanceOffset(1, !0);
            else
              return 1;
            return 0;
          },
          finalize: function() {
          },
          canContain: function(a) {
            return a !== "item";
          },
          acceptsLines: !1
        },
        item: {
          continue: function(a, l) {
            if (a.blank) {
              if (l._firstChild == null)
                return 1;
              a.advanceNextNonspace();
            } else if (a.indent >= l._listData.markerOffset + l._listData.padding)
              a.advanceOffset(
                l._listData.markerOffset + l._listData.padding,
                !0
              );
            else
              return 1;
            return 0;
          },
          finalize: function() {
          },
          canContain: function(a) {
            return a !== "item";
          },
          acceptsLines: !1
        },
        heading: {
          continue: function() {
            return 1;
          },
          finalize: function() {
          },
          canContain: function() {
            return !1;
          },
          acceptsLines: !1
        },
        thematic_break: {
          continue: function() {
            return 1;
          },
          finalize: function() {
          },
          canContain: function() {
            return !1;
          },
          acceptsLines: !1
        },
        code_block: {
          continue: function(a, l) {
            var f = a.currentLine, d = a.indent;
            if (l._isFenced) {
              var E = d <= 3 && f.charAt(a.nextNonspace) === l._fenceChar && f.slice(a.nextNonspace).match(Ej);
              if (E && E[0].length >= l._fenceLength)
                return a.lastLineLength = a.offset + d + E[0].length, a.finalize(l, a.lineNumber), 2;
              for (var w = l._fenceOffset; w > 0 && or(Ae(f, a.offset)); )
                a.advanceOffset(1, !0), w--;
            } else if (d >= Lr)
              a.advanceOffset(Lr, !0);
            else if (a.blank)
              a.advanceNextNonspace();
            else
              return 1;
            return 0;
          },
          finalize: function(a, l) {
            if (l._isFenced) {
              var f = l._string_content, d = f.indexOf(`
`), E = f.slice(0, d), w = f.slice(d + 1);
              l.info = m5(E.trim()), l._literal = w;
            } else
              l._literal = l._string_content.replace(
                /(\n *)+$/,
                `
`
              );
            l._string_content = null;
          },
          canContain: function() {
            return !1;
          },
          acceptsLines: !0
        },
        html_block: {
          continue: function(a, l) {
            return a.blank && (l._htmlBlockType === 6 || l._htmlBlockType === 7) ? 1 : 0;
          },
          finalize: function(a, l) {
            l._literal = l._string_content.replace(/(\n *)+$/, ""), l._string_content = null;
          },
          canContain: function() {
            return !1;
          },
          acceptsLines: !0
        },
        paragraph: {
          continue: function(a) {
            return a.blank ? 1 : 0;
          },
          finalize: function(a, l) {
            for (var f, d = !1; Ae(l._string_content, 0) === O5 && (f = a.inlineParser.parseReference(
              l._string_content,
              a.refmap
            )); )
              l._string_content = l._string_content.slice(f), d = !0;
            d && _j(l._string_content) && l.unlink();
          },
          canContain: function() {
            return !1;
          },
          acceptsLines: !0
        }
      }, Rj = [
        // block quote
        function(a) {
          return !a.indented && Ae(a.currentLine, a.nextNonspace) === $5 ? (a.advanceNextNonspace(), a.advanceOffset(1, !1), or(Ae(a.currentLine, a.offset)) && a.advanceOffset(1, !0), a.closeUnmatchedBlocks(), a.addChild("block_quote", a.nextNonspace), 1) : 0;
        },
        // ATX heading
        function(a) {
          var l;
          if (!a.indented && (l = a.currentLine.slice(a.nextNonspace).match(kj))) {
            a.advanceNextNonspace(), a.advanceOffset(l[0].length, !1), a.closeUnmatchedBlocks();
            var f = a.addChild("heading", a.nextNonspace);
            return f.level = l[0].trim().length, f._string_content = a.currentLine.slice(a.offset).replace(/^[ \t]*#+[ \t]*$/, "").replace(/[ \t]+#+[ \t]*$/, ""), a.advanceOffset(a.currentLine.length - a.offset), 2;
          } else
            return 0;
        },
        // Fenced code block
        function(a) {
          var l;
          if (!a.indented && (l = a.currentLine.slice(a.nextNonspace).match(Aj))) {
            var f = l[0].length;
            a.closeUnmatchedBlocks();
            var d = a.addChild("code_block", a.nextNonspace);
            return d._isFenced = !0, d._fenceLength = f, d._fenceChar = l[0][0], d._fenceOffset = a.indent, a.advanceNextNonspace(), a.advanceOffset(f, !1), 2;
          } else
            return 0;
        },
        // HTML block
        function(a, l) {
          if (!a.indented && Ae(a.currentLine, a.nextNonspace) === mj) {
            var f = a.currentLine.slice(a.nextNonspace), d;
            for (d = 1; d <= 7; d++)
              if (gj[d].test(f) && (d < 7 || l.type !== "paragraph")) {
                a.closeUnmatchedBlocks();
                var E = a.addChild("html_block", a.offset);
                return E._htmlBlockType = d, 2;
              }
          }
          return 0;
        },
        // Setext heading
        function(a, l) {
          var f;
          if (!a.indented && l.type === "paragraph" && (f = a.currentLine.slice(a.nextNonspace).match(Sj))) {
            a.closeUnmatchedBlocks();
            for (var d; Ae(l._string_content, 0) === O5 && (d = a.inlineParser.parseReference(
              l._string_content,
              a.refmap
            )); )
              l._string_content = l._string_content.slice(
                d
              );
            if (l._string_content.length > 0) {
              var E = new c("heading", l.sourcepos);
              return E.level = f[0][0] === "=" ? 1 : 2, E._string_content = l._string_content, l.insertAfter(E), l.unlink(), a.tip = E, a.advanceOffset(
                a.currentLine.length - a.offset,
                !1
              ), 2;
            } else
              return 0;
          } else
            return 0;
        },
        // thematic break
        function(a) {
          return !a.indented && yj.test(a.currentLine.slice(a.nextNonspace)) ? (a.closeUnmatchedBlocks(), a.addChild("thematic_break", a.nextNonspace), a.advanceOffset(
            a.currentLine.length - a.offset,
            !1
          ), 2) : 0;
        },
        // list item
        function(a, l) {
          var f;
          return (!a.indented || l.type === "list") && (f = $j(a, l)) ? (a.closeUnmatchedBlocks(), (a.tip.type !== "list" || !Lj(l._listData, f)) && (l = a.addChild("list", a.nextNonspace), l._listData = f), l = a.addChild("item", a.nextNonspace), l._listData = f, 1) : 0;
        },
        // indented code block
        function(a) {
          return a.indented && a.tip.type !== "paragraph" && !a.blank ? (a.advanceOffset(Lr, !0), a.closeUnmatchedBlocks(), a.addChild("code_block", a.offset), 2) : 0;
        }
      ], Nj = function(a, l) {
        for (var f = this.currentLine, d, E, w; a > 0 && (w = f[this.offset]); )
          w === "	" ? (d = 4 - this.column % 4, l ? (this.partiallyConsumedTab = d > a, E = d > a ? a : d, this.column += E, this.offset += this.partiallyConsumedTab ? 0 : 1, a -= E) : (this.partiallyConsumedTab = !1, this.column += d, this.offset += 1, a -= 1)) : (this.partiallyConsumedTab = !1, this.offset += 1, this.column += 1, a -= 1);
      }, Pj = function() {
        this.offset = this.nextNonspace, this.column = this.nextNonspaceColumn, this.partiallyConsumedTab = !1;
      }, Fj = function() {
        for (var a = this.currentLine, l = this.offset, f = this.column, d; (d = a.charAt(l)) !== ""; )
          if (d === " ")
            l++, f++;
          else if (d === "	")
            l++, f += 4 - f % 4;
          else
            break;
        this.blank = d === `
` || d === "\r" || d === "", this.nextNonspace = l, this.nextNonspaceColumn = f, this.indent = this.nextNonspaceColumn - this.column, this.indented = this.indent >= Lr;
      }, Bj = function(a) {
        var l = !0, f, d = this.doc;
        this.oldtip = this.tip, this.offset = 0, this.column = 0, this.blank = !1, this.partiallyConsumedTab = !1, this.lineNumber += 1, a.indexOf("\0") !== -1 && (a = a.replace(/\0/g, "�")), this.currentLine = a;
        for (var E; (E = d._lastChild) && E._open; ) {
          switch (d = E, this.findNextNonspace(), this.blocks[d.type].continue(this, d)) {
            case 0:
              break;
            case 1:
              l = !1;
              break;
            case 2:
              return;
            default:
              throw "continue returned illegal value, must be 0, 1, or 2";
          }
          if (!l) {
            d = d._parent;
            break;
          }
        }
        this.allClosed = d === this.oldtip, this.lastMatchedContainer = d;
        for (var w = d.type !== "paragraph" && P5[d.type].acceptsLines, N = this.blockStarts, O = N.length; !w; ) {
          if (this.findNextNonspace(), !this.indented && !wj.test(a.slice(this.nextNonspace))) {
            this.advanceNextNonspace();
            break;
          }
          for (var F = 0; F < O; ) {
            var X = N[F](this, d);
            if (X === 1) {
              d = this.tip;
              break;
            } else if (X === 2) {
              d = this.tip, w = !0;
              break;
            } else
              F++;
          }
          if (F === O) {
            this.advanceNextNonspace();
            break;
          }
        }
        if (!this.allClosed && !this.blank && this.tip.type === "paragraph")
          this.addLine();
        else {
          this.closeUnmatchedBlocks(), this.blank && d.lastChild && (d.lastChild._lastLineBlank = !0), f = d.type;
          for (var G = this.blank && !(f === "block_quote" || f === "code_block" && d._isFenced || f === "item" && !d._firstChild && d.sourcepos[0][0] === this.lineNumber), V = d; V; )
            V._lastLineBlank = G, V = V._parent;
          this.blocks[f].acceptsLines ? (this.addLine(), f === "html_block" && d._htmlBlockType >= 1 && d._htmlBlockType <= 5 && bj[d._htmlBlockType].test(
            this.currentLine.slice(this.offset)
          ) && (this.lastLineLength = a.length, this.finalize(d, this.lineNumber))) : this.offset < a.length && !this.blank && (d = this.addChild("paragraph", this.offset), this.advanceNextNonspace(), this.addLine());
        }
        this.lastLineLength = a.length;
      }, Uj = function(a, l) {
        var f = a._parent;
        a._open = !1, a.sourcepos[1] = [l, this.lastLineLength], this.blocks[a.type].finalize(this, a), this.tip = f;
      }, jj = function(a) {
        var l, f, d, E = a.walker();
        for (this.inlineParser.refmap = this.refmap, this.inlineParser.options = this.options; f = E.next(); )
          l = f.node, d = l.type, !f.entering && (d === "paragraph" || d === "heading") && this.inlineParser.parse(l);
      }, F5 = function() {
        var a = new c("document", [
          [1, 1],
          [0, 0]
        ]);
        return a;
      }, Ij = function(a) {
        this.doc = new F5(), this.tip = this.doc, this.refmap = {}, this.lineNumber = 0, this.lastLineLength = 0, this.offset = 0, this.column = 0, this.lastMatchedContainer = this.doc, this.currentLine = "", this.options.time && console.time("preparing input");
        var l = a.split(Cj), f = l.length;
        a.charCodeAt(a.length - 1) === hj && (f -= 1), this.options.time && console.timeEnd("preparing input"), this.options.time && console.time("block parsing");
        for (var d = 0; d < f; d++)
          this.incorporateLine(l[d]);
        for (; this.tip; )
          this.finalize(this.tip, f);
        return this.options.time && console.timeEnd("block parsing"), this.options.time && console.time("inline parsing"), this.processInlines(this.doc), this.options.time && console.timeEnd("inline parsing"), this.doc;
      };
      function Mj(a) {
        return {
          doc: new F5(),
          blocks: P5,
          blockStarts: Rj,
          tip: this.doc,
          oldtip: this.doc,
          currentLine: "",
          lineNumber: 0,
          offset: 0,
          column: 0,
          nextNonspace: 0,
          nextNonspaceColumn: 0,
          indent: 0,
          indented: !1,
          blank: !1,
          partiallyConsumedTab: !1,
          allClosed: !0,
          lastMatchedContainer: this.doc,
          refmap: {},
          lastLineLength: 0,
          inlineParser: new vj(a),
          findNextNonspace: Fj,
          advanceOffset: Nj,
          advanceNextNonspace: Pj,
          addLine: qj,
          addChild: Tj,
          incorporateLine: Bj,
          finalize: Uj,
          processInlines: jj,
          closeUnmatchedBlocks: Oj,
          parse: Ij,
          options: a || {}
        };
      }
      function Le() {
      }
      function zj(a) {
        var l = a.walker(), f, d;
        for (this.buffer = "", this.lastOut = `
`; f = l.next(); )
          d = f.node.type, this[d] && this[d](f.node, f.entering);
        return this.buffer;
      }
      function Hj(a) {
        this.buffer += a, this.lastOut = a;
      }
      function Gj() {
        this.lastOut !== `
` && this.lit(`
`);
      }
      function Vj(a) {
        this.lit(a);
      }
      function Wj(a) {
        return a;
      }
      Le.prototype.render = zj, Le.prototype.out = Vj, Le.prototype.lit = Hj, Le.prototype.cr = Gj, Le.prototype.esc = Wj;
      var Zj = /^javascript:|vbscript:|file:|data:/i, Jj = /^data:image\/(?:png|gif|jpeg|webp)/i, B5 = function(a) {
        return Zj.test(a) && !Jj.test(a);
      };
      function Kj(a, l, f) {
        if (!(this.disableTags > 0)) {
          if (this.buffer += "<" + a, l && l.length > 0)
            for (var d = 0, E; (E = l[d]) !== void 0; )
              this.buffer += " " + E[0] + '="' + E[1] + '"', d++;
          f && (this.buffer += " /"), this.buffer += ">", this.lastOut = ">";
        }
      }
      function ie(a) {
        a = a || {}, a.softbreak = a.softbreak || `
`, this.disableTags = 0, this.lastOut = `
`, this.options = a;
      }
      function Xj(a) {
        this.out(a.literal);
      }
      function Yj() {
        this.lit(this.options.softbreak);
      }
      function Qj() {
        this.tag("br", [], !0), this.cr();
      }
      function eI(a, l) {
        var f = this.attrs(a);
        l ? (this.options.safe && B5(a.destination) || f.push(["href", this.esc(a.destination)]), a.title && f.push(["title", this.esc(a.title)]), this.tag("a", f)) : this.tag("/a");
      }
      function rI(a, l) {
        l ? (this.disableTags === 0 && (this.options.safe && B5(a.destination) ? this.lit('<img src="" alt="') : this.lit('<img src="' + this.esc(a.destination) + '" alt="')), this.disableTags += 1) : (this.disableTags -= 1, this.disableTags === 0 && (a.title && this.lit('" title="' + this.esc(a.title)), this.lit('" />')));
      }
      function tI(a, l) {
        this.tag(l ? "em" : "/em");
      }
      function aI(a, l) {
        this.tag(l ? "strong" : "/strong");
      }
      function nI(a, l) {
        var f = a.parent.parent, d = this.attrs(a);
        f !== null && f.type === "list" && f.listTight || (l ? (this.cr(), this.tag("p", d)) : (this.tag("/p"), this.cr()));
      }
      function iI(a, l) {
        var f = "h" + a.level, d = this.attrs(a);
        l ? (this.cr(), this.tag(f, d)) : (this.tag("/" + f), this.cr());
      }
      function oI(a) {
        this.tag("code"), this.out(a.literal), this.tag("/code");
      }
      function sI(a) {
        var l = a.info ? a.info.split(/\s+/) : [], f = this.attrs(a);
        l.length > 0 && l[0].length > 0 && f.push(["class", "language-" + this.esc(l[0])]), this.cr(), this.tag("pre"), this.tag("code", f), this.out(a.literal), this.tag("/code"), this.tag("/pre"), this.cr();
      }
      function lI(a) {
        var l = this.attrs(a);
        this.cr(), this.tag("hr", l, !0), this.cr();
      }
      function uI(a, l) {
        var f = this.attrs(a);
        l ? (this.cr(), this.tag("blockquote", f), this.cr()) : (this.cr(), this.tag("/blockquote"), this.cr());
      }
      function cI(a, l) {
        var f = a.listType === "bullet" ? "ul" : "ol", d = this.attrs(a);
        if (l) {
          var E = a.listStart;
          E !== null && E !== 1 && d.push(["start", E.toString()]), this.cr(), this.tag(f, d), this.cr();
        } else
          this.cr(), this.tag("/" + f), this.cr();
      }
      function fI(a, l) {
        var f = this.attrs(a);
        l ? this.tag("li", f) : (this.tag("/li"), this.cr());
      }
      function pI(a) {
        this.options.safe ? this.lit("<!-- raw HTML omitted -->") : this.lit(a.literal);
      }
      function dI(a) {
        this.cr(), this.options.safe ? this.lit("<!-- raw HTML omitted -->") : this.lit(a.literal), this.cr();
      }
      function vI(a, l) {
        l && a.onEnter ? this.lit(a.onEnter) : !l && a.onExit && this.lit(a.onExit);
      }
      function hI(a, l) {
        this.cr(), l && a.onEnter ? this.lit(a.onEnter) : !l && a.onExit && this.lit(a.onExit), this.cr();
      }
      function mI(a) {
        this.lit(this.esc(a));
      }
      function gI(a) {
        var l = [];
        if (this.options.sourcepos) {
          var f = a.sourcepos;
          f && l.push([
            "data-sourcepos",
            String(f[0][0]) + ":" + String(f[0][1]) + "-" + String(f[1][0]) + ":" + String(f[1][1])
          ]);
        }
        return l;
      }
      ie.prototype = Object.create(Le.prototype), ie.prototype.text = Xj, ie.prototype.html_inline = pI, ie.prototype.html_block = dI, ie.prototype.softbreak = Yj, ie.prototype.linebreak = Qj, ie.prototype.link = eI, ie.prototype.image = rI, ie.prototype.emph = tI, ie.prototype.strong = aI, ie.prototype.paragraph = nI, ie.prototype.heading = iI, ie.prototype.code = oI, ie.prototype.code_block = sI, ie.prototype.thematic_break = lI, ie.prototype.block_quote = uI, ie.prototype.list = cI, ie.prototype.item = fI, ie.prototype.custom_inline = vI, ie.prototype.custom_block = hI, ie.prototype.esc = g5, ie.prototype.out = mI, ie.prototype.tag = Kj, ie.prototype.attrs = gI;
      var bI = /\<[^>]*\>/;
      function yI(a) {
        return a.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
      }
      function Ie(a) {
        a = a || {}, this.disableTags = 0, this.lastOut = `
`, this.indentLevel = 0, this.indent = "  ", this.options = a;
      }
      function wI(a) {
        this.buffer = "";
        var l, f, d = a.walker(), E, w, N, O, F, X, G = this.options;
        for (G.time && console.time("rendering"), this.buffer += `<?xml version="1.0" encoding="UTF-8"?>
`, this.buffer += `<!DOCTYPE document SYSTEM "CommonMark.dtd">
`; E = d.next(); )
          if (N = E.entering, w = E.node, X = w.type, O = w.isContainer, F = X === "thematic_break" || X === "linebreak" || X === "softbreak", f = yI(X), N) {
            switch (l = [], X) {
              case "document":
                l.push(["xmlns", "http://commonmark.org/xml/1.0"]);
                break;
              case "list":
                w.listType !== null && l.push(["type", w.listType.toLowerCase()]), w.listStart !== null && l.push(["start", String(w.listStart)]), w.listTight !== null && l.push([
                  "tight",
                  w.listTight ? "true" : "false"
                ]);
                var V = w.listDelimiter;
                if (V !== null) {
                  var Y = "";
                  V === "." ? Y = "period" : Y = "paren", l.push(["delimiter", Y]);
                }
                break;
              case "code_block":
                w.info && l.push(["info", w.info]);
                break;
              case "heading":
                l.push(["level", String(w.level)]);
                break;
              case "link":
              case "image":
                l.push(["destination", w.destination]), l.push(["title", w.title]);
                break;
              case "custom_inline":
              case "custom_block":
                l.push(["on_enter", w.onEnter]), l.push(["on_exit", w.onExit]);
                break;
            }
            if (G.sourcepos) {
              var Q = w.sourcepos;
              Q && l.push([
                "sourcepos",
                String(Q[0][0]) + ":" + String(Q[0][1]) + "-" + String(Q[1][0]) + ":" + String(Q[1][1])
              ]);
            }
            if (this.cr(), this.out(this.tag(f, l, F)), O)
              this.indentLevel += 1;
            else if (!O && !F) {
              var pe = w.literal;
              pe && this.out(this.esc(pe)), this.out(this.tag("/" + f));
            }
          } else
            this.indentLevel -= 1, this.cr(), this.out(this.tag("/" + f));
        return G.time && console.timeEnd("rendering"), this.buffer += `
`, this.buffer;
      }
      function DI(a) {
        this.disableTags > 0 ? this.buffer += a.replace(bI, "") : this.buffer += a, this.lastOut = a;
      }
      function xI() {
        if (this.lastOut !== `
`) {
          this.buffer += `
`, this.lastOut = `
`;
          for (var a = this.indentLevel; a > 0; a--)
            this.buffer += this.indent;
        }
      }
      function kI(a, l, f) {
        var d = "<" + a;
        if (l && l.length > 0)
          for (var E = 0, w; (w = l[E]) !== void 0; )
            d += " " + w[0] + '="' + this.esc(w[1]) + '"', E++;
        return f && (d += " /"), d += ">", d;
      }
      Ie.prototype = Object.create(Le.prototype), Ie.prototype.render = wI, Ie.prototype.out = DI, Ie.prototype.cr = xI, Ie.prototype.tag = kI, Ie.prototype.esc = g5, t.HtmlRenderer = ie, t.Node = c, t.Parser = Mj, t.Renderer = Le, t.XmlRenderer = Ie, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  }(Fr, Fr.exports)), Fr.exports;
}
var Br = { exports: {} }, dt, aF;
function mz() {
  if (aF)
    return dt;
  aF = 1;
  function e(r) {
    if (r.length >= 255)
      throw new TypeError("Alphabet too long");
    for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
      t[n] = 255;
    for (var o = 0; o < r.length; o++) {
      var i = r.charAt(o), s = i.charCodeAt(0);
      if (t[s] !== 255)
        throw new TypeError(i + " is ambiguous");
      t[s] = o;
    }
    var c = r.length, u = r.charAt(0), p = Math.log(c) / Math.log(256), v = Math.log(256) / Math.log(c);
    function h(x) {
      if (x instanceof Uint8Array || (ArrayBuffer.isView(x) ? x = new Uint8Array(x.buffer, x.byteOffset, x.byteLength) : Array.isArray(x) && (x = Uint8Array.from(x))), !(x instanceof Uint8Array))
        throw new TypeError("Expected Uint8Array");
      if (x.length === 0)
        return "";
      for (var $ = 0, b = 0, A = 0, g = x.length; A !== g && x[A] === 0; )
        A++, $++;
      for (var S = (g - A) * v + 1 >>> 0, q = new Uint8Array(S); A !== g; ) {
        for (var P = x[A], R = 0, L = S - 1; (P !== 0 || R < b) && L !== -1; L--, R++)
          P += 256 * q[L] >>> 0, q[L] = P % c >>> 0, P = P / c >>> 0;
        if (P !== 0)
          throw new Error("Non-zero carry");
        b = R, A++;
      }
      for (var U = S - b; U !== S && q[U] === 0; )
        U++;
      for (var j = u.repeat($); U < S; ++U)
        j += r.charAt(q[U]);
      return j;
    }
    function y(x) {
      if (typeof x != "string")
        throw new TypeError("Expected String");
      if (x.length === 0)
        return new Uint8Array();
      var $ = 0;
      if (x[$] !== " ") {
        for (var b = 0, A = 0; x[$] === u; )
          b++, $++;
        for (var g = (x.length - $) * p + 1 >>> 0, S = new Uint8Array(g); x[$]; ) {
          var q = t[x.charCodeAt($)];
          if (q === 255)
            return;
          for (var P = 0, R = g - 1; (q !== 0 || P < A) && R !== -1; R--, P++)
            q += c * S[R] >>> 0, S[R] = q % 256 >>> 0, q = q / 256 >>> 0;
          if (q !== 0)
            throw new Error("Non-zero carry");
          A = P, $++;
        }
        if (x[$] !== " ") {
          for (var L = g - A; L !== g && S[L] === 0; )
            L++;
          for (var U = new Uint8Array(b + (g - L)), j = b; L !== g; )
            U[j++] = S[L++];
          return U;
        }
      }
    }
    function T(x) {
      var $ = y(x);
      if ($)
        return $;
      throw new Error("Non-base" + c + " character");
    }
    return {
      encode: h,
      decodeUnsafe: y,
      decode: T
    };
  }
  return dt = e, dt;
}
var Ur = {}, vt = {}, ht = {}, mt, nF;
function xB() {
  return nF || (nF = 1, mt = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var r = {}, t = Symbol("test"), n = Object(t);
    if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
      return !1;
    var o = 42;
    r[t] = o;
    for (t in r)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(r).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(r).length !== 0)
      return !1;
    var i = Object.getOwnPropertySymbols(r);
    if (i.length !== 1 || i[0] !== t || !Object.prototype.propertyIsEnumerable.call(r, t))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var s = Object.getOwnPropertyDescriptor(r, t);
      if (s.value !== o || s.enumerable !== !0)
        return !1;
    }
    return !0;
  }), mt;
}
var gt, iF;
function ga() {
  if (iF)
    return gt;
  iF = 1;
  var e = xB();
  return gt = function() {
    return e() && !!Symbol.toStringTag;
  }, gt;
}
var bt, oF;
function gz() {
  return oF || (oF = 1, bt = Error), bt;
}
var yt, sF;
function bz() {
  return sF || (sF = 1, yt = EvalError), yt;
}
var wt, lF;
function yz() {
  return lF || (lF = 1, wt = RangeError), wt;
}
var Dt, uF;
function wz() {
  return uF || (uF = 1, Dt = ReferenceError), Dt;
}
var xt, cF;
function kB() {
  return cF || (cF = 1, xt = SyntaxError), xt;
}
var kt, fF;
function Jr() {
  return fF || (fF = 1, kt = TypeError), kt;
}
var At, pF;
function Dz() {
  return pF || (pF = 1, At = URIError), At;
}
var Et, dF;
function xz() {
  if (dF)
    return Et;
  dF = 1;
  var e = typeof Symbol < "u" && Symbol, r = xB();
  return Et = function() {
    return typeof e != "function" || typeof Symbol != "function" || typeof e("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : r();
  }, Et;
}
var St, vF;
function kz() {
  if (vF)
    return St;
  vF = 1;
  var e = {
    foo: {}
  }, r = Object;
  return St = function() {
    return { __proto__: e }.foo === e.foo && !({ __proto__: null } instanceof r);
  }, St;
}
var Ct, hF;
function Az() {
  if (hF)
    return Ct;
  hF = 1;
  var e = "Function.prototype.bind called on incompatible ", r = Object.prototype.toString, t = Math.max, n = "[object Function]", o = function(u, p) {
    for (var v = [], h = 0; h < u.length; h += 1)
      v[h] = u[h];
    for (var y = 0; y < p.length; y += 1)
      v[y + u.length] = p[y];
    return v;
  }, i = function(u, p) {
    for (var v = [], h = p || 0, y = 0; h < u.length; h += 1, y += 1)
      v[y] = u[h];
    return v;
  }, s = function(c, u) {
    for (var p = "", v = 0; v < c.length; v += 1)
      p += c[v], v + 1 < c.length && (p += u);
    return p;
  };
  return Ct = function(u) {
    var p = this;
    if (typeof p != "function" || r.apply(p) !== n)
      throw new TypeError(e + p);
    for (var v = i(arguments, 1), h, y = function() {
      if (this instanceof h) {
        var A = p.apply(
          this,
          o(v, arguments)
        );
        return Object(A) === A ? A : this;
      }
      return p.apply(
        u,
        o(v, arguments)
      );
    }, T = t(0, p.length - v.length), x = [], $ = 0; $ < T; $++)
      x[$] = "$" + $;
    if (h = Function("binder", "return function (" + s(x, ",") + "){ return binder.apply(this,arguments); }")(y), p.prototype) {
      var b = function() {
      };
      b.prototype = p.prototype, h.prototype = new b(), b.prototype = null;
    }
    return h;
  }, Ct;
}
var _t, mF;
function ba() {
  if (mF)
    return _t;
  mF = 1;
  var e = Az();
  return _t = Function.prototype.bind || e, _t;
}
var qt, gF;
function Ez() {
  if (gF)
    return qt;
  gF = 1;
  var e = Function.prototype.call, r = Object.prototype.hasOwnProperty, t = ba();
  return qt = t.call(e, r), qt;
}
var Tt, bF;
function Er() {
  if (bF)
    return Tt;
  bF = 1;
  var e, r = gz(), t = bz(), n = yz(), o = wz(), i = kB(), s = Jr(), c = Dz(), u = Function, p = function(J) {
    try {
      return u('"use strict"; return (' + J + ").constructor;")();
    } catch {
    }
  }, v = Object.getOwnPropertyDescriptor;
  if (v)
    try {
      v({}, "");
    } catch {
      v = null;
    }
  var h = function() {
    throw new s();
  }, y = v ? function() {
    try {
      return arguments.callee, h;
    } catch {
      try {
        return v(arguments, "callee").get;
      } catch {
        return h;
      }
    }
  }() : h, T = xz()(), x = kz()(), $ = Object.getPrototypeOf || (x ? function(J) {
    return J.__proto__;
  } : null), b = {}, A = typeof Uint8Array > "u" || !$ ? e : $(Uint8Array), g = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? e : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? e : ArrayBuffer,
    "%ArrayIteratorPrototype%": T && $ ? $([][Symbol.iterator]()) : e,
    "%AsyncFromSyncIteratorPrototype%": e,
    "%AsyncFunction%": b,
    "%AsyncGenerator%": b,
    "%AsyncGeneratorFunction%": b,
    "%AsyncIteratorPrototype%": b,
    "%Atomics%": typeof Atomics > "u" ? e : Atomics,
    "%BigInt%": typeof BigInt > "u" ? e : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? e : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? e : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? e : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": r,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": t,
    "%Float32Array%": typeof Float32Array > "u" ? e : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? e : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? e : FinalizationRegistry,
    "%Function%": u,
    "%GeneratorFunction%": b,
    "%Int8Array%": typeof Int8Array > "u" ? e : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? e : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? e : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": T && $ ? $($([][Symbol.iterator]())) : e,
    "%JSON%": typeof JSON == "object" ? JSON : e,
    "%Map%": typeof Map > "u" ? e : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !T || !$ ? e : $((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": Object,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? e : Promise,
    "%Proxy%": typeof Proxy > "u" ? e : Proxy,
    "%RangeError%": n,
    "%ReferenceError%": o,
    "%Reflect%": typeof Reflect > "u" ? e : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? e : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !T || !$ ? e : $((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? e : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": T && $ ? $(""[Symbol.iterator]()) : e,
    "%Symbol%": T ? Symbol : e,
    "%SyntaxError%": i,
    "%ThrowTypeError%": y,
    "%TypedArray%": A,
    "%TypeError%": s,
    "%Uint8Array%": typeof Uint8Array > "u" ? e : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? e : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? e : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? e : Uint32Array,
    "%URIError%": c,
    "%WeakMap%": typeof WeakMap > "u" ? e : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? e : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? e : WeakSet
  };
  if ($)
    try {
      null.error;
    } catch (J) {
      var S = $($(J));
      g["%Error.prototype%"] = S;
    }
  var q = function J(W) {
    var te;
    if (W === "%AsyncFunction%")
      te = p("async function () {}");
    else if (W === "%GeneratorFunction%")
      te = p("function* () {}");
    else if (W === "%AsyncGeneratorFunction%")
      te = p("async function* () {}");
    else if (W === "%AsyncGenerator%") {
      var re = J("%AsyncGeneratorFunction%");
      re && (te = re.prototype);
    } else if (W === "%AsyncIteratorPrototype%") {
      var le = J("%AsyncGenerator%");
      le && $ && (te = $(le.prototype));
    }
    return g[W] = te, te;
  }, P = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, R = ba(), L = Ez(), U = R.call(Function.call, Array.prototype.concat), j = R.call(Function.apply, Array.prototype.splice), z = R.call(Function.call, String.prototype.replace), ae = R.call(Function.call, String.prototype.slice), ne = R.call(Function.call, RegExp.prototype.exec), ge = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, se = /\\(\\)?/g, ee = function(W) {
    var te = ae(W, 0, 1), re = ae(W, -1);
    if (te === "%" && re !== "%")
      throw new i("invalid intrinsic syntax, expected closing `%`");
    if (re === "%" && te !== "%")
      throw new i("invalid intrinsic syntax, expected opening `%`");
    var le = [];
    return z(W, ge, function(m, D, _, B) {
      le[le.length] = _ ? z(B, se, "$1") : D || m;
    }), le;
  }, ue = function(W, te) {
    var re = W, le;
    if (L(P, re) && (le = P[re], re = "%" + le[0] + "%"), L(g, re)) {
      var m = g[re];
      if (m === b && (m = q(re)), typeof m > "u" && !te)
        throw new s("intrinsic " + W + " exists, but is not available. Please file an issue!");
      return {
        alias: le,
        name: re,
        value: m
      };
    }
    throw new i("intrinsic " + W + " does not exist!");
  };
  return Tt = function(W, te) {
    if (typeof W != "string" || W.length === 0)
      throw new s("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof te != "boolean")
      throw new s('"allowMissing" argument must be a boolean');
    if (ne(/^%?[^%]*%?$/, W) === null)
      throw new i("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var re = ee(W), le = re.length > 0 ? re[0] : "", m = ue("%" + le + "%", te), D = m.name, _ = m.value, B = !1, H = m.alias;
    H && (le = H[0], j(re, U([0, 1], H)));
    for (var Z = 1, M = !0; Z < re.length; Z += 1) {
      var I = re[Z], K = ae(I, 0, 1), ce = ae(I, -1);
      if ((K === '"' || K === "'" || K === "`" || ce === '"' || ce === "'" || ce === "`") && K !== ce)
        throw new i("property names with quotes must have matching quotes");
      if ((I === "constructor" || !M) && (B = !0), le += "." + I, D = "%" + le + "%", L(g, D))
        _ = g[D];
      else if (_ != null) {
        if (!(I in _)) {
          if (!te)
            throw new s("base intrinsic for " + W + " exists, but the property is not available.");
          return;
        }
        if (v && Z + 1 >= re.length) {
          var we = v(_, I);
          M = !!we, M && "get" in we && !("originalValue" in we.get) ? _ = we.get : _ = _[I];
        } else
          M = L(_, I), _ = _[I];
        M && !B && (g[D] = _);
      }
    }
    return _;
  }, Tt;
}
var $t = { exports: {} }, Lt, yF;
function ya() {
  if (yF)
    return Lt;
  yF = 1;
  var e = Er(), r = e("%Object.defineProperty%", !0) || !1;
  if (r)
    try {
      r({}, "a", { value: 1 });
    } catch {
      r = !1;
    }
  return Lt = r, Lt;
}
var Ot, wF;
function wa() {
  if (wF)
    return Ot;
  wF = 1;
  var e = Er(), r = e("%Object.getOwnPropertyDescriptor%", !0);
  if (r)
    try {
      r([], "length");
    } catch {
      r = null;
    }
  return Ot = r, Ot;
}
var Rt, DF;
function Sz() {
  if (DF)
    return Rt;
  DF = 1;
  var e = ya(), r = kB(), t = Jr(), n = wa();
  return Rt = function(i, s, c) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new t("`obj` must be an object or a function`");
    if (typeof s != "string" && typeof s != "symbol")
      throw new t("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new t("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new t("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new t("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new t("`loose`, if provided, must be a boolean");
    var u = arguments.length > 3 ? arguments[3] : null, p = arguments.length > 4 ? arguments[4] : null, v = arguments.length > 5 ? arguments[5] : null, h = arguments.length > 6 ? arguments[6] : !1, y = !!n && n(i, s);
    if (e)
      e(i, s, {
        configurable: v === null && y ? y.configurable : !v,
        enumerable: u === null && y ? y.enumerable : !u,
        value: c,
        writable: p === null && y ? y.writable : !p
      });
    else if (h || !u && !p && !v)
      i[s] = c;
    else
      throw new r("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, Rt;
}
var Nt, xF;
function Cz() {
  if (xF)
    return Nt;
  xF = 1;
  var e = ya(), r = function() {
    return !!e;
  };
  return r.hasArrayLengthDefineBug = function() {
    if (!e)
      return null;
    try {
      return e([], "length", { value: 1 }).length !== 1;
    } catch {
      return !0;
    }
  }, Nt = r, Nt;
}
var Pt, kF;
function _z() {
  if (kF)
    return Pt;
  kF = 1;
  var e = Er(), r = Sz(), t = Cz()(), n = wa(), o = Jr(), i = e("%Math.floor%");
  return Pt = function(c, u) {
    if (typeof c != "function")
      throw new o("`fn` is not a function");
    if (typeof u != "number" || u < 0 || u > 4294967295 || i(u) !== u)
      throw new o("`length` must be a positive 32-bit integer");
    var p = arguments.length > 2 && !!arguments[2], v = !0, h = !0;
    if ("length" in c && n) {
      var y = n(c, "length");
      y && !y.configurable && (v = !1), y && !y.writable && (h = !1);
    }
    return (v || h || !p) && (t ? r(
      /** @type {Parameters<define>[0]} */
      c,
      "length",
      u,
      !0,
      !0
    ) : r(
      /** @type {Parameters<define>[0]} */
      c,
      "length",
      u
    )), c;
  }, Pt;
}
var AF;
function AB() {
  return AF || (AF = 1, function(e) {
    var r = ba(), t = Er(), n = _z(), o = Jr(), i = t("%Function.prototype.apply%"), s = t("%Function.prototype.call%"), c = t("%Reflect.apply%", !0) || r.call(s, i), u = ya(), p = t("%Math.max%");
    e.exports = function(y) {
      if (typeof y != "function")
        throw new o("a function is required");
      var T = c(r, s, arguments);
      return n(
        T,
        1 + p(0, y.length - (arguments.length - 1)),
        !0
      );
    };
    var v = function() {
      return c(r, i, arguments);
    };
    u ? u(e.exports, "apply", { value: v }) : e.exports.apply = v;
  }($t)), $t.exports;
}
var Ft, EF;
function EB() {
  if (EF)
    return Ft;
  EF = 1;
  var e = Er(), r = AB(), t = r(e("String.prototype.indexOf"));
  return Ft = function(o, i) {
    var s = e(o, !!i);
    return typeof s == "function" && t(o, ".prototype.") > -1 ? r(s) : s;
  }, Ft;
}
var Bt, SF;
function qz() {
  if (SF)
    return Bt;
  SF = 1;
  var e = ga()(), r = EB(), t = r("Object.prototype.toString"), n = function(c) {
    return e && c && typeof c == "object" && Symbol.toStringTag in c ? !1 : t(c) === "[object Arguments]";
  }, o = function(c) {
    return n(c) ? !0 : c !== null && typeof c == "object" && typeof c.length == "number" && c.length >= 0 && t(c) !== "[object Array]" && t(c.callee) === "[object Function]";
  }, i = function() {
    return n(arguments);
  }();
  return n.isLegacyArguments = o, Bt = i ? n : o, Bt;
}
var Ut, CF;
function Tz() {
  if (CF)
    return Ut;
  CF = 1;
  var e = Object.prototype.toString, r = Function.prototype.toString, t = /^\s*(?:function)?\*/, n = ga()(), o = Object.getPrototypeOf, i = function() {
    if (!n)
      return !1;
    try {
      return Function("return function*() {}")();
    } catch {
    }
  }, s;
  return Ut = function(u) {
    if (typeof u != "function")
      return !1;
    if (t.test(r.call(u)))
      return !0;
    if (!n) {
      var p = e.call(u);
      return p === "[object GeneratorFunction]";
    }
    if (!o)
      return !1;
    if (typeof s > "u") {
      var v = i();
      s = v ? o(v) : !1;
    }
    return o(u) === s;
  }, Ut;
}
var jt, _F;
function $z() {
  if (_F)
    return jt;
  _F = 1;
  var e = Function.prototype.toString, r = typeof Reflect == "object" && Reflect !== null && Reflect.apply, t, n;
  if (typeof r == "function" && typeof Object.defineProperty == "function")
    try {
      t = Object.defineProperty({}, "length", {
        get: function() {
          throw n;
        }
      }), n = {}, r(function() {
        throw 42;
      }, null, t);
    } catch (g) {
      g !== n && (r = null);
    }
  else
    r = null;
  var o = /^\s*class\b/, i = function(S) {
    try {
      var q = e.call(S);
      return o.test(q);
    } catch {
      return !1;
    }
  }, s = function(S) {
    try {
      return i(S) ? !1 : (e.call(S), !0);
    } catch {
      return !1;
    }
  }, c = Object.prototype.toString, u = "[object Object]", p = "[object Function]", v = "[object GeneratorFunction]", h = "[object HTMLAllCollection]", y = "[object HTML document.all class]", T = "[object HTMLCollection]", x = typeof Symbol == "function" && !!Symbol.toStringTag, $ = !(0 in [,]), b = function() {
    return !1;
  };
  if (typeof document == "object") {
    var A = document.all;
    c.call(A) === c.call(document.all) && (b = function(S) {
      if (($ || !S) && (typeof S > "u" || typeof S == "object"))
        try {
          var q = c.call(S);
          return (q === h || q === y || q === T || q === u) && S("") == null;
        } catch {
        }
      return !1;
    });
  }
  return jt = r ? function(S) {
    if (b(S))
      return !0;
    if (!S || typeof S != "function" && typeof S != "object")
      return !1;
    try {
      r(S, null, t);
    } catch (q) {
      if (q !== n)
        return !1;
    }
    return !i(S) && s(S);
  } : function(S) {
    if (b(S))
      return !0;
    if (!S || typeof S != "function" && typeof S != "object")
      return !1;
    if (x)
      return s(S);
    if (i(S))
      return !1;
    var q = c.call(S);
    return q !== p && q !== v && !/^\[object HTML/.test(q) ? !1 : s(S);
  }, jt;
}
var It, qF;
function Lz() {
  if (qF)
    return It;
  qF = 1;
  var e = $z(), r = Object.prototype.toString, t = Object.prototype.hasOwnProperty, n = function(u, p, v) {
    for (var h = 0, y = u.length; h < y; h++)
      t.call(u, h) && (v == null ? p(u[h], h, u) : p.call(v, u[h], h, u));
  }, o = function(u, p, v) {
    for (var h = 0, y = u.length; h < y; h++)
      v == null ? p(u.charAt(h), h, u) : p.call(v, u.charAt(h), h, u);
  }, i = function(u, p, v) {
    for (var h in u)
      t.call(u, h) && (v == null ? p(u[h], h, u) : p.call(v, u[h], h, u));
  }, s = function(u, p, v) {
    if (!e(p))
      throw new TypeError("iterator must be a function");
    var h;
    arguments.length >= 3 && (h = v), r.call(u) === "[object Array]" ? n(u, p, h) : typeof u == "string" ? o(u, p, h) : i(u, p, h);
  };
  return It = s, It;
}
var Mt, TF;
function Oz() {
  if (TF)
    return Mt;
  TF = 1;
  var e = [
    "BigInt64Array",
    "BigUint64Array",
    "Float32Array",
    "Float64Array",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray"
  ], r = typeof globalThis > "u" ? hr : globalThis;
  return Mt = function() {
    for (var n = [], o = 0; o < e.length; o++)
      typeof r[e[o]] == "function" && (n[n.length] = e[o]);
    return n;
  }, Mt;
}
var zt, $F;
function SB() {
  if ($F)
    return zt;
  $F = 1;
  var e = Lz(), r = Oz(), t = AB(), n = EB(), o = wa(), i = n("Object.prototype.toString"), s = ga()(), c = typeof globalThis > "u" ? hr : globalThis, u = r(), p = n("String.prototype.slice"), v = Object.getPrototypeOf, h = n("Array.prototype.indexOf", !0) || function(b, A) {
    for (var g = 0; g < b.length; g += 1)
      if (b[g] === A)
        return g;
    return -1;
  }, y = { __proto__: null };
  s && o && v ? e(u, function($) {
    var b = new c[$]();
    if (Symbol.toStringTag in b) {
      var A = v(b), g = o(A, Symbol.toStringTag);
      if (!g) {
        var S = v(A);
        g = o(S, Symbol.toStringTag);
      }
      y["$" + $] = t(g.get);
    }
  }) : e(u, function($) {
    var b = new c[$](), A = b.slice || b.set;
    A && (y["$" + $] = t(A));
  });
  var T = function(b) {
    var A = !1;
    return e(y, function(g, S) {
      if (!A)
        try {
          "$" + g(b) === S && (A = p(S, 1));
        } catch {
        }
    }), A;
  }, x = function(b) {
    var A = !1;
    return e(y, function(g, S) {
      if (!A)
        try {
          g(b), A = p(S, 1);
        } catch {
        }
    }), A;
  };
  return zt = function(b) {
    if (!b || typeof b != "object")
      return !1;
    if (!s) {
      var A = p(i(b), 8, -1);
      return h(u, A) > -1 ? A : A !== "Object" ? !1 : x(b);
    }
    return o ? T(b) : null;
  }, zt;
}
var Ht, LF;
function Rz() {
  if (LF)
    return Ht;
  LF = 1;
  var e = SB();
  return Ht = function(t) {
    return !!e(t);
  }, Ht;
}
var OF;
function Nz() {
  return OF || (OF = 1, function(e) {
    var r = qz(), t = Tz(), n = SB(), o = Rz();
    function i(C) {
      return C.call.bind(C);
    }
    var s = typeof BigInt < "u", c = typeof Symbol < "u", u = i(Object.prototype.toString), p = i(Number.prototype.valueOf), v = i(String.prototype.valueOf), h = i(Boolean.prototype.valueOf);
    if (s)
      var y = i(BigInt.prototype.valueOf);
    if (c)
      var T = i(Symbol.prototype.valueOf);
    function x(C, qr) {
      if (typeof C != "object")
        return !1;
      try {
        return qr(C), !0;
      } catch {
        return !1;
      }
    }
    e.isArgumentsObject = r, e.isGeneratorFunction = t, e.isTypedArray = o;
    function $(C) {
      return typeof Promise < "u" && C instanceof Promise || C !== null && typeof C == "object" && typeof C.then == "function" && typeof C.catch == "function";
    }
    e.isPromise = $;
    function b(C) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(C) : o(C) || D(C);
    }
    e.isArrayBufferView = b;
    function A(C) {
      return n(C) === "Uint8Array";
    }
    e.isUint8Array = A;
    function g(C) {
      return n(C) === "Uint8ClampedArray";
    }
    e.isUint8ClampedArray = g;
    function S(C) {
      return n(C) === "Uint16Array";
    }
    e.isUint16Array = S;
    function q(C) {
      return n(C) === "Uint32Array";
    }
    e.isUint32Array = q;
    function P(C) {
      return n(C) === "Int8Array";
    }
    e.isInt8Array = P;
    function R(C) {
      return n(C) === "Int16Array";
    }
    e.isInt16Array = R;
    function L(C) {
      return n(C) === "Int32Array";
    }
    e.isInt32Array = L;
    function U(C) {
      return n(C) === "Float32Array";
    }
    e.isFloat32Array = U;
    function j(C) {
      return n(C) === "Float64Array";
    }
    e.isFloat64Array = j;
    function z(C) {
      return n(C) === "BigInt64Array";
    }
    e.isBigInt64Array = z;
    function ae(C) {
      return n(C) === "BigUint64Array";
    }
    e.isBigUint64Array = ae;
    function ne(C) {
      return u(C) === "[object Map]";
    }
    ne.working = typeof Map < "u" && ne(/* @__PURE__ */ new Map());
    function ge(C) {
      return typeof Map > "u" ? !1 : ne.working ? ne(C) : C instanceof Map;
    }
    e.isMap = ge;
    function se(C) {
      return u(C) === "[object Set]";
    }
    se.working = typeof Set < "u" && se(/* @__PURE__ */ new Set());
    function ee(C) {
      return typeof Set > "u" ? !1 : se.working ? se(C) : C instanceof Set;
    }
    e.isSet = ee;
    function ue(C) {
      return u(C) === "[object WeakMap]";
    }
    ue.working = typeof WeakMap < "u" && ue(/* @__PURE__ */ new WeakMap());
    function J(C) {
      return typeof WeakMap > "u" ? !1 : ue.working ? ue(C) : C instanceof WeakMap;
    }
    e.isWeakMap = J;
    function W(C) {
      return u(C) === "[object WeakSet]";
    }
    W.working = typeof WeakSet < "u" && W(/* @__PURE__ */ new WeakSet());
    function te(C) {
      return W(C);
    }
    e.isWeakSet = te;
    function re(C) {
      return u(C) === "[object ArrayBuffer]";
    }
    re.working = typeof ArrayBuffer < "u" && re(new ArrayBuffer());
    function le(C) {
      return typeof ArrayBuffer > "u" ? !1 : re.working ? re(C) : C instanceof ArrayBuffer;
    }
    e.isArrayBuffer = le;
    function m(C) {
      return u(C) === "[object DataView]";
    }
    m.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && m(new DataView(new ArrayBuffer(1), 0, 1));
    function D(C) {
      return typeof DataView > "u" ? !1 : m.working ? m(C) : C instanceof DataView;
    }
    e.isDataView = D;
    var _ = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function B(C) {
      return u(C) === "[object SharedArrayBuffer]";
    }
    function H(C) {
      return typeof _ > "u" ? !1 : (typeof B.working > "u" && (B.working = B(new _())), B.working ? B(C) : C instanceof _);
    }
    e.isSharedArrayBuffer = H;
    function Z(C) {
      return u(C) === "[object AsyncFunction]";
    }
    e.isAsyncFunction = Z;
    function M(C) {
      return u(C) === "[object Map Iterator]";
    }
    e.isMapIterator = M;
    function I(C) {
      return u(C) === "[object Set Iterator]";
    }
    e.isSetIterator = I;
    function K(C) {
      return u(C) === "[object Generator]";
    }
    e.isGeneratorObject = K;
    function ce(C) {
      return u(C) === "[object WebAssembly.Module]";
    }
    e.isWebAssemblyCompiledModule = ce;
    function we(C) {
      return x(C, p);
    }
    e.isNumberObject = we;
    function Pe(C) {
      return x(C, v);
    }
    e.isStringObject = Pe;
    function Ce(C) {
      return x(C, h);
    }
    e.isBooleanObject = Ce;
    function Fe(C) {
      return s && x(C, y);
    }
    e.isBigIntObject = Fe;
    function ir(C) {
      return c && x(C, T);
    }
    e.isSymbolObject = ir;
    function Cr(C) {
      return we(C) || Pe(C) || Ce(C) || Fe(C) || ir(C);
    }
    e.isBoxedPrimitive = Cr;
    function _r(C) {
      return typeof Uint8Array < "u" && (le(C) || H(C));
    }
    e.isAnyArrayBuffer = _r, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(C) {
      Object.defineProperty(e, C, {
        enumerable: !1,
        value: function() {
          throw new Error(C + " is not supported in userland");
        }
      });
    });
  }(ht)), ht;
}
var Gt, RF;
function Pz() {
  return RF || (RF = 1, Gt = function(r) {
    return r && typeof r == "object" && typeof r.copy == "function" && typeof r.fill == "function" && typeof r.readUInt8 == "function";
  }), Gt;
}
var jr = { exports: {} }, NF;
function Fz() {
  return NF || (NF = 1, typeof Object.create == "function" ? jr.exports = function(r, t) {
    t && (r.super_ = t, r.prototype = Object.create(t.prototype, {
      constructor: {
        value: r,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : jr.exports = function(r, t) {
    if (t) {
      r.super_ = t;
      var n = function() {
      };
      n.prototype = t.prototype, r.prototype = new n(), r.prototype.constructor = r;
    }
  }), jr.exports;
}
var PF;
function FF() {
  return PF || (PF = 1, function(e) {
    var r = Object.getOwnPropertyDescriptors || function(D) {
      for (var _ = Object.keys(D), B = {}, H = 0; H < _.length; H++)
        B[_[H]] = Object.getOwnPropertyDescriptor(D, _[H]);
      return B;
    }, t = /%[sdj%]/g;
    e.format = function(m) {
      if (!P(m)) {
        for (var D = [], _ = 0; _ < arguments.length; _++)
          D.push(s(arguments[_]));
        return D.join(" ");
      }
      for (var _ = 1, B = arguments, H = B.length, Z = String(m).replace(t, function(I) {
        if (I === "%%")
          return "%";
        if (_ >= H)
          return I;
        switch (I) {
          case "%s":
            return String(B[_++]);
          case "%d":
            return Number(B[_++]);
          case "%j":
            try {
              return JSON.stringify(B[_++]);
            } catch {
              return "[Circular]";
            }
          default:
            return I;
        }
      }), M = B[_]; _ < H; M = B[++_])
        g(M) || !j(M) ? Z += " " + M : Z += " " + s(M);
      return Z;
    }, e.deprecate = function(m, D) {
      if (typeof process < "u" && process.noDeprecation === !0)
        return m;
      if (typeof process > "u")
        return function() {
          return e.deprecate(m, D).apply(this, arguments);
        };
      var _ = !1;
      function B() {
        if (!_) {
          if (process.throwDeprecation)
            throw new Error(D);
          process.traceDeprecation ? console.trace(D) : console.error(D), _ = !0;
        }
        return m.apply(this, arguments);
      }
      return B;
    };
    var n = {}, o = /^$/;
    if (process.env.NODE_DEBUG) {
      var i = process.env.NODE_DEBUG;
      i = i.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), o = new RegExp("^" + i + "$", "i");
    }
    e.debuglog = function(m) {
      if (m = m.toUpperCase(), !n[m])
        if (o.test(m)) {
          var D = process.pid;
          n[m] = function() {
            var _ = e.format.apply(e, arguments);
            console.error("%s %d: %s", m, D, _);
          };
        } else
          n[m] = function() {
          };
      return n[m];
    };
    function s(m, D) {
      var _ = {
        seen: [],
        stylize: u
      };
      return arguments.length >= 3 && (_.depth = arguments[2]), arguments.length >= 4 && (_.colors = arguments[3]), A(D) ? _.showHidden = D : D && e._extend(_, D), L(_.showHidden) && (_.showHidden = !1), L(_.depth) && (_.depth = 2), L(_.colors) && (_.colors = !1), L(_.customInspect) && (_.customInspect = !0), _.colors && (_.stylize = c), v(_, m, _.depth);
    }
    e.inspect = s, s.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, s.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function c(m, D) {
      var _ = s.styles[D];
      return _ ? "\x1B[" + s.colors[_][0] + "m" + m + "\x1B[" + s.colors[_][1] + "m" : m;
    }
    function u(m, D) {
      return m;
    }
    function p(m) {
      var D = {};
      return m.forEach(function(_, B) {
        D[_] = !0;
      }), D;
    }
    function v(m, D, _) {
      if (m.customInspect && D && ne(D.inspect) && // Filter out the util module, it's inspect function is special
      D.inspect !== e.inspect && // Also filter out any prototype objects using the circular check.
      !(D.constructor && D.constructor.prototype === D)) {
        var B = D.inspect(_, m);
        return P(B) || (B = v(m, B, _)), B;
      }
      var H = h(m, D);
      if (H)
        return H;
      var Z = Object.keys(D), M = p(Z);
      if (m.showHidden && (Z = Object.getOwnPropertyNames(D)), ae(D) && (Z.indexOf("message") >= 0 || Z.indexOf("description") >= 0))
        return y(D);
      if (Z.length === 0) {
        if (ne(D)) {
          var I = D.name ? ": " + D.name : "";
          return m.stylize("[Function" + I + "]", "special");
        }
        if (U(D))
          return m.stylize(RegExp.prototype.toString.call(D), "regexp");
        if (z(D))
          return m.stylize(Date.prototype.toString.call(D), "date");
        if (ae(D))
          return y(D);
      }
      var K = "", ce = !1, we = ["{", "}"];
      if (b(D) && (ce = !0, we = ["[", "]"]), ne(D)) {
        var Pe = D.name ? ": " + D.name : "";
        K = " [Function" + Pe + "]";
      }
      if (U(D) && (K = " " + RegExp.prototype.toString.call(D)), z(D) && (K = " " + Date.prototype.toUTCString.call(D)), ae(D) && (K = " " + y(D)), Z.length === 0 && (!ce || D.length == 0))
        return we[0] + K + we[1];
      if (_ < 0)
        return U(D) ? m.stylize(RegExp.prototype.toString.call(D), "regexp") : m.stylize("[Object]", "special");
      m.seen.push(D);
      var Ce;
      return ce ? Ce = T(m, D, _, M, Z) : Ce = Z.map(function(Fe) {
        return x(m, D, _, M, Fe, ce);
      }), m.seen.pop(), $(Ce, K, we);
    }
    function h(m, D) {
      if (L(D))
        return m.stylize("undefined", "undefined");
      if (P(D)) {
        var _ = "'" + JSON.stringify(D).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return m.stylize(_, "string");
      }
      if (q(D))
        return m.stylize("" + D, "number");
      if (A(D))
        return m.stylize("" + D, "boolean");
      if (g(D))
        return m.stylize("null", "null");
    }
    function y(m) {
      return "[" + Error.prototype.toString.call(m) + "]";
    }
    function T(m, D, _, B, H) {
      for (var Z = [], M = 0, I = D.length; M < I; ++M)
        W(D, String(M)) ? Z.push(x(
          m,
          D,
          _,
          B,
          String(M),
          !0
        )) : Z.push("");
      return H.forEach(function(K) {
        K.match(/^\d+$/) || Z.push(x(
          m,
          D,
          _,
          B,
          K,
          !0
        ));
      }), Z;
    }
    function x(m, D, _, B, H, Z) {
      var M, I, K;
      if (K = Object.getOwnPropertyDescriptor(D, H) || { value: D[H] }, K.get ? K.set ? I = m.stylize("[Getter/Setter]", "special") : I = m.stylize("[Getter]", "special") : K.set && (I = m.stylize("[Setter]", "special")), W(B, H) || (M = "[" + H + "]"), I || (m.seen.indexOf(K.value) < 0 ? (g(_) ? I = v(m, K.value, null) : I = v(m, K.value, _ - 1), I.indexOf(`
`) > -1 && (Z ? I = I.split(`
`).map(function(ce) {
        return "  " + ce;
      }).join(`
`).slice(2) : I = `
` + I.split(`
`).map(function(ce) {
        return "   " + ce;
      }).join(`
`))) : I = m.stylize("[Circular]", "special")), L(M)) {
        if (Z && H.match(/^\d+$/))
          return I;
        M = JSON.stringify("" + H), M.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (M = M.slice(1, -1), M = m.stylize(M, "name")) : (M = M.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), M = m.stylize(M, "string"));
      }
      return M + ": " + I;
    }
    function $(m, D, _) {
      var B = m.reduce(function(H, Z) {
        return Z.indexOf(`
`) >= 0, H + Z.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return B > 60 ? _[0] + (D === "" ? "" : D + `
 `) + " " + m.join(`,
  `) + " " + _[1] : _[0] + D + " " + m.join(", ") + " " + _[1];
    }
    e.types = Nz();
    function b(m) {
      return Array.isArray(m);
    }
    e.isArray = b;
    function A(m) {
      return typeof m == "boolean";
    }
    e.isBoolean = A;
    function g(m) {
      return m === null;
    }
    e.isNull = g;
    function S(m) {
      return m == null;
    }
    e.isNullOrUndefined = S;
    function q(m) {
      return typeof m == "number";
    }
    e.isNumber = q;
    function P(m) {
      return typeof m == "string";
    }
    e.isString = P;
    function R(m) {
      return typeof m == "symbol";
    }
    e.isSymbol = R;
    function L(m) {
      return m === void 0;
    }
    e.isUndefined = L;
    function U(m) {
      return j(m) && se(m) === "[object RegExp]";
    }
    e.isRegExp = U, e.types.isRegExp = U;
    function j(m) {
      return typeof m == "object" && m !== null;
    }
    e.isObject = j;
    function z(m) {
      return j(m) && se(m) === "[object Date]";
    }
    e.isDate = z, e.types.isDate = z;
    function ae(m) {
      return j(m) && (se(m) === "[object Error]" || m instanceof Error);
    }
    e.isError = ae, e.types.isNativeError = ae;
    function ne(m) {
      return typeof m == "function";
    }
    e.isFunction = ne;
    function ge(m) {
      return m === null || typeof m == "boolean" || typeof m == "number" || typeof m == "string" || typeof m == "symbol" || // ES6 symbol
      typeof m > "u";
    }
    e.isPrimitive = ge, e.isBuffer = Pz();
    function se(m) {
      return Object.prototype.toString.call(m);
    }
    function ee(m) {
      return m < 10 ? "0" + m.toString(10) : m.toString(10);
    }
    var ue = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function J() {
      var m = /* @__PURE__ */ new Date(), D = [
        ee(m.getHours()),
        ee(m.getMinutes()),
        ee(m.getSeconds())
      ].join(":");
      return [m.getDate(), ue[m.getMonth()], D].join(" ");
    }
    e.log = function() {
      console.log("%s - %s", J(), e.format.apply(e, arguments));
    }, e.inherits = Fz(), e._extend = function(m, D) {
      if (!D || !j(D))
        return m;
      for (var _ = Object.keys(D), B = _.length; B--; )
        m[_[B]] = D[_[B]];
      return m;
    };
    function W(m, D) {
      return Object.prototype.hasOwnProperty.call(m, D);
    }
    var te = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    e.promisify = function(D) {
      if (typeof D != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (te && D[te]) {
        var _ = D[te];
        if (typeof _ != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(_, te, {
          value: _,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), _;
      }
      function _() {
        for (var B, H, Z = new Promise(function(K, ce) {
          B = K, H = ce;
        }), M = [], I = 0; I < arguments.length; I++)
          M.push(arguments[I]);
        M.push(function(K, ce) {
          K ? H(K) : B(ce);
        });
        try {
          D.apply(this, M);
        } catch (K) {
          H(K);
        }
        return Z;
      }
      return Object.setPrototypeOf(_, Object.getPrototypeOf(D)), te && Object.defineProperty(_, te, {
        value: _,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        _,
        r(D)
      );
    }, e.promisify.custom = te;
    function re(m, D) {
      if (!m) {
        var _ = new Error("Promise was rejected with a falsy value");
        _.reason = m, m = _;
      }
      return D(m);
    }
    function le(m) {
      if (typeof m != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function D() {
        for (var _ = [], B = 0; B < arguments.length; B++)
          _.push(arguments[B]);
        var H = _.pop();
        if (typeof H != "function")
          throw new TypeError("The last argument must be of type Function");
        var Z = this, M = function() {
          return H.apply(Z, arguments);
        };
        m.apply(this, _).then(
          function(I) {
            process.nextTick(M.bind(null, null, I));
          },
          function(I) {
            process.nextTick(re.bind(null, I, M));
          }
        );
      }
      return Object.setPrototypeOf(D, Object.getPrototypeOf(m)), Object.defineProperties(
        D,
        r(m)
      ), D;
    }
    e.callbackify = le;
  }(vt)), vt;
}
var BF;
function Bz() {
  return BF || (BF = 1, Ur.TextEncoder = typeof TextEncoder < "u" ? TextEncoder : FF().TextEncoder, Ur.TextDecoder = typeof TextDecoder < "u" ? TextDecoder : FF().TextDecoder), Ur;
}
var Vt, UF;
function Da() {
  if (UF)
    return Vt;
  UF = 1;
  const { TextEncoder: e, TextDecoder: r } = Bz(), t = new r(), n = (c) => t.decode(c), o = new e(), i = (c) => o.encode(c);
  function s(c, u) {
    const p = new Uint8Array(u);
    let v = 0;
    for (const h of c)
      p.set(h, v), v += h.length;
    return p;
  }
  return Vt = { decodeText: n, encodeText: i, concat: s }, Vt;
}
var Wt, jF;
function Uz() {
  if (jF)
    return Wt;
  jF = 1;
  const { encodeText: e } = Da();
  class r {
    /**
     * @param {BaseName} name
     * @param {BaseCode} code
     * @param {CodecFactory} factory
     * @param {string} alphabet
     */
    constructor(n, o, i, s) {
      this.name = n, this.code = o, this.codeBuf = e(this.code), this.alphabet = s, this.codec = i(s);
    }
    /**
     * @param {Uint8Array} buf
     * @returns {string}
     */
    encode(n) {
      return this.codec.encode(n);
    }
    /**
     * @param {string} string
     * @returns {Uint8Array}
     */
    decode(n) {
      for (const o of n)
        if (this.alphabet && this.alphabet.indexOf(o) < 0)
          throw new Error(`invalid character '${o}' in '${n}'`);
      return this.codec.decode(n);
    }
  }
  return Wt = r, Wt;
}
var Zt, IF;
function jz() {
  if (IF)
    return Zt;
  IF = 1;
  const e = (n, o, i) => {
    const s = {};
    for (let y = 0; y < o.length; ++y)
      s[o[y]] = y;
    let c = n.length;
    for (; n[c - 1] === "="; )
      --c;
    const u = new Uint8Array(c * i / 8 | 0);
    let p = 0, v = 0, h = 0;
    for (let y = 0; y < c; ++y) {
      const T = s[n[y]];
      if (T === void 0)
        throw new SyntaxError("Invalid character " + n[y]);
      v = v << i | T, p += i, p >= 8 && (p -= 8, u[h++] = 255 & v >> p);
    }
    if (p >= i || 255 & v << 8 - p)
      throw new SyntaxError("Unexpected end of data");
    return u;
  }, r = (n, o, i) => {
    const s = o[o.length - 1] === "=", c = (1 << i) - 1;
    let u = "", p = 0, v = 0;
    for (let h = 0; h < n.length; ++h)
      for (v = v << 8 | n[h], p += 8; p > i; )
        p -= i, u += o[c & v >> p];
    if (p && (u += o[c & v << i - p]), s)
      for (; u.length * i & 7; )
        u += "=";
    return u;
  };
  return Zt = { rfc4648: (n) => (o) => ({
    /**
     * @param {Uint8Array} input
     * @returns {string}
     */
    encode(i) {
      return r(i, o, n);
    },
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(i) {
      return e(i, o, n);
    }
  }) }, Zt;
}
var Jt, MF;
function Iz() {
  if (MF)
    return Jt;
  MF = 1;
  const e = mz(), r = Uz(), { rfc4648: t } = jz(), { decodeText: n, encodeText: o } = Da(), s = [
    ["identity", "\0", () => ({
      encode: n,
      decode: o
    }), ""],
    ["base2", "0", t(1), "01"],
    ["base8", "7", t(3), "01234567"],
    ["base10", "9", e, "0123456789"],
    ["base16", "f", t(4), "0123456789abcdef"],
    ["base16upper", "F", t(4), "0123456789ABCDEF"],
    ["base32hex", "v", t(5), "0123456789abcdefghijklmnopqrstuv"],
    ["base32hexupper", "V", t(5), "0123456789ABCDEFGHIJKLMNOPQRSTUV"],
    ["base32hexpad", "t", t(5), "0123456789abcdefghijklmnopqrstuv="],
    ["base32hexpadupper", "T", t(5), "0123456789ABCDEFGHIJKLMNOPQRSTUV="],
    ["base32", "b", t(5), "abcdefghijklmnopqrstuvwxyz234567"],
    ["base32upper", "B", t(5), "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"],
    ["base32pad", "c", t(5), "abcdefghijklmnopqrstuvwxyz234567="],
    ["base32padupper", "C", t(5), "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567="],
    ["base32z", "h", t(5), "ybndrfg8ejkmcpqxot1uwisza345h769"],
    ["base36", "k", e, "0123456789abcdefghijklmnopqrstuvwxyz"],
    ["base36upper", "K", e, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    ["base58btc", "z", e, "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"],
    ["base58flickr", "Z", e, "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"],
    ["base64", "m", t(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"],
    ["base64pad", "M", t(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],
    ["base64url", "u", t(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"],
    ["base64urlpad", "U", t(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="]
  ], c = s.reduce(
    (p, v) => (p[v[0]] = new r(v[0], v[1], v[2], v[3]), p),
    /** @type {Record<BaseName,Base>} */
    {}
  ), u = s.reduce(
    (p, v) => (p[v[1]] = c[v[0]], p),
    /** @type {Record<BaseCode,Base>} */
    {}
  );
  return Jt = {
    names: c,
    codes: u
  }, Jt;
}
var zF;
function Mz() {
  return zF || (zF = 1, function(e, r) {
    const t = Iz(), { encodeText: n, decodeText: o, concat: i } = Da();
    function s(T, x) {
      if (!x)
        throw new Error("requires an encoded Uint8Array");
      const { name: $, codeBuf: b } = h(T);
      return v($, x), i([b, x], b.length + x.length);
    }
    function c(T, x) {
      const $ = h(T), b = n($.encode(x));
      return i([$.codeBuf, b], $.codeBuf.length + b.length);
    }
    function u(T) {
      T instanceof Uint8Array && (T = o(T));
      const x = T[0];
      return ["f", "F", "v", "V", "t", "T", "b", "B", "c", "C", "h", "k", "K"].includes(x) && (T = T.toLowerCase()), h(
        /** @type {BaseCode} */
        T[0]
      ).decode(T.substring(1));
    }
    function p(T) {
      if (T instanceof Uint8Array && (T = o(T)), Object.prototype.toString.call(T) !== "[object String]")
        return !1;
      try {
        return h(
          /** @type {BaseCode} */
          T[0]
        ).name;
      } catch {
        return !1;
      }
    }
    function v(T, x) {
      h(T).decode(o(x));
    }
    function h(T) {
      if (Object.prototype.hasOwnProperty.call(
        t.names,
        /** @type {BaseName} */
        T
      ))
        return t.names[
          /** @type {BaseName} */
          T
        ];
      if (Object.prototype.hasOwnProperty.call(
        t.codes,
        /** @type {BaseCode} */
        T
      ))
        return t.codes[
          /** @type {BaseCode} */
          T
        ];
      throw new Error(`Unsupported encoding: ${T}`);
    }
    function y(T) {
      return T instanceof Uint8Array && (T = o(T)), h(
        /** @type {BaseCode} */
        T[0]
      );
    }
    r = e.exports = s, r.encode = c, r.decode = u, r.isEncoded = p, r.encoding = h, r.encodingFromData = y, r.names = Object.freeze(t.names), r.codes = Object.freeze(t.codes);
  }(Br, Br.exports)), Br.exports;
}
var Kt, HF;
function zz() {
  if (HF)
    return Kt;
  HF = 1, Kt = o;
  var e = 128, r = 127, t = ~r, n = Math.pow(2, 31);
  function o(i, s, c) {
    if (Number.MAX_SAFE_INTEGER && i > Number.MAX_SAFE_INTEGER)
      throw o.bytes = 0, new RangeError("Could not encode varint");
    s = s || [], c = c || 0;
    for (var u = c; i >= n; )
      s[c++] = i & 255 | e, i /= 128;
    for (; i & t; )
      s[c++] = i & 255 | e, i >>>= 7;
    return s[c] = i | 0, o.bytes = c - u + 1, s;
  }
  return Kt;
}
var Xt, GF;
function Hz() {
  if (GF)
    return Xt;
  GF = 1, Xt = t;
  var e = 128, r = 127;
  function t(n, s) {
    var i = 0, s = s || 0, c = 0, u = s, p, v = n.length;
    do {
      if (u >= v || c > 49)
        throw t.bytes = 0, new RangeError("Could not decode varint");
      p = n[u++], i += c < 28 ? (p & r) << c : (p & r) * Math.pow(2, c), c += 7;
    } while (p >= e);
    return t.bytes = u - s, i;
  }
  return Xt;
}
var Yt, VF;
function Gz() {
  if (VF)
    return Yt;
  VF = 1;
  var e = Math.pow(2, 7), r = Math.pow(2, 14), t = Math.pow(2, 21), n = Math.pow(2, 28), o = Math.pow(2, 35), i = Math.pow(2, 42), s = Math.pow(2, 49), c = Math.pow(2, 56), u = Math.pow(2, 63);
  return Yt = function(p) {
    return p < e ? 1 : p < r ? 2 : p < t ? 3 : p < n ? 4 : p < o ? 5 : p < i ? 6 : p < s ? 7 : p < c ? 8 : p < u ? 9 : 10;
  }, Yt;
}
var Qt, WF;
function Vz() {
  return WF || (WF = 1, Qt = {
    encode: zz(),
    decode: Hz(),
    encodingLength: Gz()
  }), Qt;
}
var ea, ZF;
function Wz() {
  return ZF || (ZF = 1, ea = { names: Object.freeze({
    identity: 0,
    sha1: 17,
    "sha2-256": 18,
    "sha2-512": 19,
    "sha3-512": 20,
    "sha3-384": 21,
    "sha3-256": 22,
    "sha3-224": 23,
    "shake-128": 24,
    "shake-256": 25,
    "keccak-224": 26,
    "keccak-256": 27,
    "keccak-384": 28,
    "keccak-512": 29,
    blake3: 30,
    "murmur3-128": 34,
    "murmur3-32": 35,
    "dbl-sha2-256": 86,
    md4: 212,
    md5: 213,
    bmt: 214,
    "sha2-256-trunc254-padded": 4114,
    "ripemd-128": 4178,
    "ripemd-160": 4179,
    "ripemd-256": 4180,
    "ripemd-320": 4181,
    x11: 4352,
    kangarootwelve: 7425,
    "sm3-256": 21325,
    "blake2b-8": 45569,
    "blake2b-16": 45570,
    "blake2b-24": 45571,
    "blake2b-32": 45572,
    "blake2b-40": 45573,
    "blake2b-48": 45574,
    "blake2b-56": 45575,
    "blake2b-64": 45576,
    "blake2b-72": 45577,
    "blake2b-80": 45578,
    "blake2b-88": 45579,
    "blake2b-96": 45580,
    "blake2b-104": 45581,
    "blake2b-112": 45582,
    "blake2b-120": 45583,
    "blake2b-128": 45584,
    "blake2b-136": 45585,
    "blake2b-144": 45586,
    "blake2b-152": 45587,
    "blake2b-160": 45588,
    "blake2b-168": 45589,
    "blake2b-176": 45590,
    "blake2b-184": 45591,
    "blake2b-192": 45592,
    "blake2b-200": 45593,
    "blake2b-208": 45594,
    "blake2b-216": 45595,
    "blake2b-224": 45596,
    "blake2b-232": 45597,
    "blake2b-240": 45598,
    "blake2b-248": 45599,
    "blake2b-256": 45600,
    "blake2b-264": 45601,
    "blake2b-272": 45602,
    "blake2b-280": 45603,
    "blake2b-288": 45604,
    "blake2b-296": 45605,
    "blake2b-304": 45606,
    "blake2b-312": 45607,
    "blake2b-320": 45608,
    "blake2b-328": 45609,
    "blake2b-336": 45610,
    "blake2b-344": 45611,
    "blake2b-352": 45612,
    "blake2b-360": 45613,
    "blake2b-368": 45614,
    "blake2b-376": 45615,
    "blake2b-384": 45616,
    "blake2b-392": 45617,
    "blake2b-400": 45618,
    "blake2b-408": 45619,
    "blake2b-416": 45620,
    "blake2b-424": 45621,
    "blake2b-432": 45622,
    "blake2b-440": 45623,
    "blake2b-448": 45624,
    "blake2b-456": 45625,
    "blake2b-464": 45626,
    "blake2b-472": 45627,
    "blake2b-480": 45628,
    "blake2b-488": 45629,
    "blake2b-496": 45630,
    "blake2b-504": 45631,
    "blake2b-512": 45632,
    "blake2s-8": 45633,
    "blake2s-16": 45634,
    "blake2s-24": 45635,
    "blake2s-32": 45636,
    "blake2s-40": 45637,
    "blake2s-48": 45638,
    "blake2s-56": 45639,
    "blake2s-64": 45640,
    "blake2s-72": 45641,
    "blake2s-80": 45642,
    "blake2s-88": 45643,
    "blake2s-96": 45644,
    "blake2s-104": 45645,
    "blake2s-112": 45646,
    "blake2s-120": 45647,
    "blake2s-128": 45648,
    "blake2s-136": 45649,
    "blake2s-144": 45650,
    "blake2s-152": 45651,
    "blake2s-160": 45652,
    "blake2s-168": 45653,
    "blake2s-176": 45654,
    "blake2s-184": 45655,
    "blake2s-192": 45656,
    "blake2s-200": 45657,
    "blake2s-208": 45658,
    "blake2s-216": 45659,
    "blake2s-224": 45660,
    "blake2s-232": 45661,
    "blake2s-240": 45662,
    "blake2s-248": 45663,
    "blake2s-256": 45664,
    "skein256-8": 45825,
    "skein256-16": 45826,
    "skein256-24": 45827,
    "skein256-32": 45828,
    "skein256-40": 45829,
    "skein256-48": 45830,
    "skein256-56": 45831,
    "skein256-64": 45832,
    "skein256-72": 45833,
    "skein256-80": 45834,
    "skein256-88": 45835,
    "skein256-96": 45836,
    "skein256-104": 45837,
    "skein256-112": 45838,
    "skein256-120": 45839,
    "skein256-128": 45840,
    "skein256-136": 45841,
    "skein256-144": 45842,
    "skein256-152": 45843,
    "skein256-160": 45844,
    "skein256-168": 45845,
    "skein256-176": 45846,
    "skein256-184": 45847,
    "skein256-192": 45848,
    "skein256-200": 45849,
    "skein256-208": 45850,
    "skein256-216": 45851,
    "skein256-224": 45852,
    "skein256-232": 45853,
    "skein256-240": 45854,
    "skein256-248": 45855,
    "skein256-256": 45856,
    "skein512-8": 45857,
    "skein512-16": 45858,
    "skein512-24": 45859,
    "skein512-32": 45860,
    "skein512-40": 45861,
    "skein512-48": 45862,
    "skein512-56": 45863,
    "skein512-64": 45864,
    "skein512-72": 45865,
    "skein512-80": 45866,
    "skein512-88": 45867,
    "skein512-96": 45868,
    "skein512-104": 45869,
    "skein512-112": 45870,
    "skein512-120": 45871,
    "skein512-128": 45872,
    "skein512-136": 45873,
    "skein512-144": 45874,
    "skein512-152": 45875,
    "skein512-160": 45876,
    "skein512-168": 45877,
    "skein512-176": 45878,
    "skein512-184": 45879,
    "skein512-192": 45880,
    "skein512-200": 45881,
    "skein512-208": 45882,
    "skein512-216": 45883,
    "skein512-224": 45884,
    "skein512-232": 45885,
    "skein512-240": 45886,
    "skein512-248": 45887,
    "skein512-256": 45888,
    "skein512-264": 45889,
    "skein512-272": 45890,
    "skein512-280": 45891,
    "skein512-288": 45892,
    "skein512-296": 45893,
    "skein512-304": 45894,
    "skein512-312": 45895,
    "skein512-320": 45896,
    "skein512-328": 45897,
    "skein512-336": 45898,
    "skein512-344": 45899,
    "skein512-352": 45900,
    "skein512-360": 45901,
    "skein512-368": 45902,
    "skein512-376": 45903,
    "skein512-384": 45904,
    "skein512-392": 45905,
    "skein512-400": 45906,
    "skein512-408": 45907,
    "skein512-416": 45908,
    "skein512-424": 45909,
    "skein512-432": 45910,
    "skein512-440": 45911,
    "skein512-448": 45912,
    "skein512-456": 45913,
    "skein512-464": 45914,
    "skein512-472": 45915,
    "skein512-480": 45916,
    "skein512-488": 45917,
    "skein512-496": 45918,
    "skein512-504": 45919,
    "skein512-512": 45920,
    "skein1024-8": 45921,
    "skein1024-16": 45922,
    "skein1024-24": 45923,
    "skein1024-32": 45924,
    "skein1024-40": 45925,
    "skein1024-48": 45926,
    "skein1024-56": 45927,
    "skein1024-64": 45928,
    "skein1024-72": 45929,
    "skein1024-80": 45930,
    "skein1024-88": 45931,
    "skein1024-96": 45932,
    "skein1024-104": 45933,
    "skein1024-112": 45934,
    "skein1024-120": 45935,
    "skein1024-128": 45936,
    "skein1024-136": 45937,
    "skein1024-144": 45938,
    "skein1024-152": 45939,
    "skein1024-160": 45940,
    "skein1024-168": 45941,
    "skein1024-176": 45942,
    "skein1024-184": 45943,
    "skein1024-192": 45944,
    "skein1024-200": 45945,
    "skein1024-208": 45946,
    "skein1024-216": 45947,
    "skein1024-224": 45948,
    "skein1024-232": 45949,
    "skein1024-240": 45950,
    "skein1024-248": 45951,
    "skein1024-256": 45952,
    "skein1024-264": 45953,
    "skein1024-272": 45954,
    "skein1024-280": 45955,
    "skein1024-288": 45956,
    "skein1024-296": 45957,
    "skein1024-304": 45958,
    "skein1024-312": 45959,
    "skein1024-320": 45960,
    "skein1024-328": 45961,
    "skein1024-336": 45962,
    "skein1024-344": 45963,
    "skein1024-352": 45964,
    "skein1024-360": 45965,
    "skein1024-368": 45966,
    "skein1024-376": 45967,
    "skein1024-384": 45968,
    "skein1024-392": 45969,
    "skein1024-400": 45970,
    "skein1024-408": 45971,
    "skein1024-416": 45972,
    "skein1024-424": 45973,
    "skein1024-432": 45974,
    "skein1024-440": 45975,
    "skein1024-448": 45976,
    "skein1024-456": 45977,
    "skein1024-464": 45978,
    "skein1024-472": 45979,
    "skein1024-480": 45980,
    "skein1024-488": 45981,
    "skein1024-496": 45982,
    "skein1024-504": 45983,
    "skein1024-512": 45984,
    "skein1024-520": 45985,
    "skein1024-528": 45986,
    "skein1024-536": 45987,
    "skein1024-544": 45988,
    "skein1024-552": 45989,
    "skein1024-560": 45990,
    "skein1024-568": 45991,
    "skein1024-576": 45992,
    "skein1024-584": 45993,
    "skein1024-592": 45994,
    "skein1024-600": 45995,
    "skein1024-608": 45996,
    "skein1024-616": 45997,
    "skein1024-624": 45998,
    "skein1024-632": 45999,
    "skein1024-640": 46e3,
    "skein1024-648": 46001,
    "skein1024-656": 46002,
    "skein1024-664": 46003,
    "skein1024-672": 46004,
    "skein1024-680": 46005,
    "skein1024-688": 46006,
    "skein1024-696": 46007,
    "skein1024-704": 46008,
    "skein1024-712": 46009,
    "skein1024-720": 46010,
    "skein1024-728": 46011,
    "skein1024-736": 46012,
    "skein1024-744": 46013,
    "skein1024-752": 46014,
    "skein1024-760": 46015,
    "skein1024-768": 46016,
    "skein1024-776": 46017,
    "skein1024-784": 46018,
    "skein1024-792": 46019,
    "skein1024-800": 46020,
    "skein1024-808": 46021,
    "skein1024-816": 46022,
    "skein1024-824": 46023,
    "skein1024-832": 46024,
    "skein1024-840": 46025,
    "skein1024-848": 46026,
    "skein1024-856": 46027,
    "skein1024-864": 46028,
    "skein1024-872": 46029,
    "skein1024-880": 46030,
    "skein1024-888": 46031,
    "skein1024-896": 46032,
    "skein1024-904": 46033,
    "skein1024-912": 46034,
    "skein1024-920": 46035,
    "skein1024-928": 46036,
    "skein1024-936": 46037,
    "skein1024-944": 46038,
    "skein1024-952": 46039,
    "skein1024-960": 46040,
    "skein1024-968": 46041,
    "skein1024-976": 46042,
    "skein1024-984": 46043,
    "skein1024-992": 46044,
    "skein1024-1000": 46045,
    "skein1024-1008": 46046,
    "skein1024-1016": 46047,
    "skein1024-1024": 46048,
    "poseidon-bls12_381-a2-fc1": 46081,
    "poseidon-bls12_381-a2-fc1-sc": 46082
  }) }), ea;
}
function Zz(e, r) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var o = 0; o < e.length; o++) {
    var i = e.charAt(o), s = i.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    t[s] = o;
  }
  var c = e.length, u = e.charAt(0), p = Math.log(c) / Math.log(256), v = Math.log(256) / Math.log(c);
  function h(x) {
    if (x instanceof Uint8Array || (ArrayBuffer.isView(x) ? x = new Uint8Array(x.buffer, x.byteOffset, x.byteLength) : Array.isArray(x) && (x = Uint8Array.from(x))), !(x instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (x.length === 0)
      return "";
    for (var $ = 0, b = 0, A = 0, g = x.length; A !== g && x[A] === 0; )
      A++, $++;
    for (var S = (g - A) * v + 1 >>> 0, q = new Uint8Array(S); A !== g; ) {
      for (var P = x[A], R = 0, L = S - 1; (P !== 0 || R < b) && L !== -1; L--, R++)
        P += 256 * q[L] >>> 0, q[L] = P % c >>> 0, P = P / c >>> 0;
      if (P !== 0)
        throw new Error("Non-zero carry");
      b = R, A++;
    }
    for (var U = S - b; U !== S && q[U] === 0; )
      U++;
    for (var j = u.repeat($); U < S; ++U)
      j += e.charAt(q[U]);
    return j;
  }
  function y(x) {
    if (typeof x != "string")
      throw new TypeError("Expected String");
    if (x.length === 0)
      return new Uint8Array();
    var $ = 0;
    if (x[$] !== " ") {
      for (var b = 0, A = 0; x[$] === u; )
        b++, $++;
      for (var g = (x.length - $) * p + 1 >>> 0, S = new Uint8Array(g); x[$]; ) {
        var q = t[x.charCodeAt($)];
        if (q === 255)
          return;
        for (var P = 0, R = g - 1; (q !== 0 || P < A) && R !== -1; R--, P++)
          q += c * S[R] >>> 0, S[R] = q % 256 >>> 0, q = q / 256 >>> 0;
        if (q !== 0)
          throw new Error("Non-zero carry");
        A = P, $++;
      }
      if (x[$] !== " ") {
        for (var L = g - A; L !== g && S[L] === 0; )
          L++;
        for (var U = new Uint8Array(b + (g - L)), j = b; L !== g; )
          U[j++] = S[L++];
        return U;
      }
    }
  }
  function T(x) {
    var $ = y(x);
    if ($)
      return $;
    throw new Error(`Non-${r} character`);
  }
  return {
    encode: h,
    decodeUnsafe: y,
    decode: T
  };
}
var Jz = Zz, Kz = Jz;
const CB = new Uint8Array(0), Xz = (e) => e.reduce((r, t) => r + t.toString(16).padStart(2, "0"), ""), Yz = (e) => {
  const r = e.match(/../g);
  return r ? new Uint8Array(r.map((t) => parseInt(t, 16))) : CB;
}, _B = (e, r) => {
  if (e === r)
    return !0;
  if (e.byteLength !== r.byteLength)
    return !1;
  for (let t = 0; t < e.byteLength; t++)
    if (e[t] !== r[t])
      return !1;
  return !0;
}, Qe = (e) => {
  if (e instanceof Uint8Array && e.constructor.name === "Uint8Array")
    return e;
  if (e instanceof ArrayBuffer)
    return new Uint8Array(e);
  if (ArrayBuffer.isView(e))
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  throw new Error("Unknown type, must be binary type");
}, Qz = (e) => e instanceof ArrayBuffer || ArrayBuffer.isView(e), qB = (e) => new TextEncoder().encode(e), TB = (e) => new TextDecoder().decode(e), eH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  coerce: Qe,
  empty: CB,
  equals: _B,
  fromHex: Yz,
  fromString: qB,
  isBinary: Qz,
  toHex: Xz,
  toString: TB
}, Symbol.toStringTag, { value: "Module" }));
class rH {
  constructor(r, t, n) {
    this.name = r, this.prefix = t, this.baseEncode = n;
  }
  encode(r) {
    if (r instanceof Uint8Array)
      return `${this.prefix}${this.baseEncode(r)}`;
    throw Error("Unknown type, must be binary type");
  }
}
class tH {
  constructor(r, t, n) {
    if (this.name = r, this.prefix = t, t.codePointAt(0) === void 0)
      throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = n;
  }
  decode(r) {
    if (typeof r == "string") {
      if (r.codePointAt(0) !== this.prefixCodePoint)
        throw Error(`Unable to decode multibase string ${JSON.stringify(r)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(r.slice(this.prefix.length));
    } else
      throw Error("Can only multibase decode strings");
  }
  or(r) {
    return $B(this, r);
  }
}
class aH {
  constructor(r) {
    this.decoders = r;
  }
  or(r) {
    return $B(this, r);
  }
  decode(r) {
    const t = r[0], n = this.decoders[t];
    if (n)
      return n.decode(r);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(r)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
}
const $B = (e, r) => new aH({
  ...e.decoders || { [e.prefix]: e },
  ...r.decoders || { [r.prefix]: r }
});
class nH {
  constructor(r, t, n, o) {
    this.name = r, this.prefix = t, this.baseEncode = n, this.baseDecode = o, this.encoder = new rH(r, t, n), this.decoder = new tH(r, t, o);
  }
  encode(r) {
    return this.encoder.encode(r);
  }
  decode(r) {
    return this.decoder.decode(r);
  }
}
const Kr = ({ name: e, prefix: r, encode: t, decode: n }) => new nH(e, r, t, n), Sr = ({ prefix: e, name: r, alphabet: t }) => {
  const { encode: n, decode: o } = Kz(t, r);
  return Kr({
    prefix: e,
    name: r,
    encode: n,
    decode: (i) => Qe(o(i))
  });
}, iH = (e, r, t, n) => {
  const o = {};
  for (let v = 0; v < r.length; ++v)
    o[r[v]] = v;
  let i = e.length;
  for (; e[i - 1] === "="; )
    --i;
  const s = new Uint8Array(i * t / 8 | 0);
  let c = 0, u = 0, p = 0;
  for (let v = 0; v < i; ++v) {
    const h = o[e[v]];
    if (h === void 0)
      throw new SyntaxError(`Non-${n} character`);
    u = u << t | h, c += t, c >= 8 && (c -= 8, s[p++] = 255 & u >> c);
  }
  if (c >= t || 255 & u << 8 - c)
    throw new SyntaxError("Unexpected end of data");
  return s;
}, oH = (e, r, t) => {
  const n = r[r.length - 1] === "=", o = (1 << t) - 1;
  let i = "", s = 0, c = 0;
  for (let u = 0; u < e.length; ++u)
    for (c = c << 8 | e[u], s += 8; s > t; )
      s -= t, i += r[o & c >> s];
  if (s && (i += r[o & c << t - s]), n)
    for (; i.length * t & 7; )
      i += "=";
  return i;
}, me = ({ name: e, prefix: r, bitsPerChar: t, alphabet: n }) => Kr({
  prefix: r,
  name: e,
  encode(o) {
    return oH(o, n, t);
  },
  decode(o) {
    return iH(o, n, t, e);
  }
}), sH = Kr({
  prefix: "\0",
  name: "identity",
  encode: (e) => TB(e),
  decode: (e) => qB(e)
}), lH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  identity: sH
}, Symbol.toStringTag, { value: "Module" })), uH = me({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
}), cH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base2: uH
}, Symbol.toStringTag, { value: "Module" })), fH = me({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
}), pH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base8: fH
}, Symbol.toStringTag, { value: "Module" })), dH = Sr({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
}), vH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base10: dH
}, Symbol.toStringTag, { value: "Module" })), hH = me({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
}), mH = me({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
}), gH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base16: hH,
  base16upper: mH
}, Symbol.toStringTag, { value: "Module" })), mr = me({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
}), bH = me({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
}), yH = me({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
}), wH = me({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
}), DH = me({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
}), xH = me({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
}), kH = me({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
}), AH = me({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
}), EH = me({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
}), SH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base32: mr,
  base32hex: DH,
  base32hexpad: kH,
  base32hexpadupper: AH,
  base32hexupper: xH,
  base32pad: yH,
  base32padupper: wH,
  base32upper: bH,
  base32z: EH
}, Symbol.toStringTag, { value: "Module" })), CH = Sr({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
}), _H = Sr({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
}), qH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base36: CH,
  base36upper: _H
}, Symbol.toStringTag, { value: "Module" })), Te = Sr({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), TH = Sr({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
}), $H = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base58btc: Te,
  base58flickr: TH
}, Symbol.toStringTag, { value: "Module" })), LH = me({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
}), OH = me({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
}), RH = me({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
}), NH = me({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
}), PH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base64: LH,
  base64pad: OH,
  base64url: RH,
  base64urlpad: NH
}, Symbol.toStringTag, { value: "Module" })), LB = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), FH = LB.reduce((e, r, t) => (e[t] = r, e), []), BH = LB.reduce((e, r, t) => (e[r.codePointAt(0)] = t, e), []);
function UH(e) {
  return e.reduce((r, t) => (r += FH[t], r), "");
}
function jH(e) {
  const r = [];
  for (const t of e) {
    const n = BH[t.codePointAt(0)];
    if (n === void 0)
      throw new Error(`Non-base256emoji character: ${t}`);
    r.push(n);
  }
  return new Uint8Array(r);
}
const IH = Kr({
  prefix: "🚀",
  name: "base256emoji",
  encode: UH,
  decode: jH
}), MH = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base256emoji: IH
}, Symbol.toStringTag, { value: "Module" }));
var zH = OB, JF = 128, HH = 127, GH = ~HH, VH = Math.pow(2, 31);
function OB(e, r, t) {
  r = r || [], t = t || 0;
  for (var n = t; e >= VH; )
    r[t++] = e & 255 | JF, e /= 128;
  for (; e & GH; )
    r[t++] = e & 255 | JF, e >>>= 7;
  return r[t] = e | 0, OB.bytes = t - n + 1, r;
}
var WH = fa, ZH = 128, KF = 127;
function fa(e, n) {
  var t = 0, n = n || 0, o = 0, i = n, s, c = e.length;
  do {
    if (i >= c)
      throw fa.bytes = 0, new RangeError("Could not decode varint");
    s = e[i++], t += o < 28 ? (s & KF) << o : (s & KF) * Math.pow(2, o), o += 7;
  } while (s >= ZH);
  return fa.bytes = i - n, t;
}
var JH = Math.pow(2, 7), KH = Math.pow(2, 14), XH = Math.pow(2, 21), YH = Math.pow(2, 28), QH = Math.pow(2, 35), eG = Math.pow(2, 42), rG = Math.pow(2, 49), tG = Math.pow(2, 56), aG = Math.pow(2, 63), nG = function(e) {
  return e < JH ? 1 : e < KH ? 2 : e < XH ? 3 : e < YH ? 4 : e < QH ? 5 : e < eG ? 6 : e < rG ? 7 : e < tG ? 8 : e < aG ? 9 : 10;
}, iG = {
  encode: zH,
  decode: WH,
  encodingLength: nG
}, Vr = iG;
const Wr = (e, r = 0) => [
  Vr.decode(e, r),
  Vr.decode.bytes
], wr = (e, r, t = 0) => (Vr.encode(e, r, t), r), Dr = (e) => Vr.encodingLength(e), oG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Wr,
  encodeTo: wr,
  encodingLength: Dr
}, Symbol.toStringTag, { value: "Module" })), xr = (e, r) => {
  const t = r.byteLength, n = Dr(e), o = n + Dr(t), i = new Uint8Array(o + t);
  return wr(e, i, 0), wr(t, i, n), i.set(r, o), new Xr(e, t, r, i);
}, RB = (e) => {
  const r = Qe(e), [t, n] = Wr(r), [o, i] = Wr(r.subarray(n)), s = r.subarray(n + i);
  if (s.byteLength !== o)
    throw new Error("Incorrect length");
  return new Xr(t, o, s, r);
}, NB = (e, r) => e === r ? !0 : e.code === r.code && e.size === r.size && _B(e.bytes, r.bytes);
class Xr {
  constructor(r, t, n, o) {
    this.code = r, this.size = t, this.digest = n, this.bytes = o;
  }
}
const sG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Digest: Xr,
  create: xr,
  decode: RB,
  equals: NB
}, Symbol.toStringTag, { value: "Module" })), xa = ({ name: e, code: r, encode: t }) => new PB(e, r, t);
class PB {
  constructor(r, t, n) {
    this.name = r, this.code = t, this.encode = n;
  }
  digest(r) {
    if (r instanceof Uint8Array) {
      const t = this.encode(r);
      return t instanceof Uint8Array ? xr(this.code, t) : t.then((n) => xr(this.code, n));
    } else
      throw Error("Unknown type, must be binary type");
  }
}
const lG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hasher: PB,
  from: xa
}, Symbol.toStringTag, { value: "Module" })), FB = (e) => async (r) => new Uint8Array(await crypto.subtle.digest(e, r)), uG = xa({
  name: "sha2-256",
  code: 18,
  encode: FB("SHA-256")
}), cG = xa({
  name: "sha2-512",
  code: 19,
  encode: FB("SHA-512")
}), fG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sha256: uG,
  sha512: cG
}, Symbol.toStringTag, { value: "Module" })), BB = 0, pG = "identity", UB = Qe, dG = (e) => xr(BB, UB(e)), vG = {
  code: BB,
  name: pG,
  encode: UB,
  digest: dG
}, hG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  identity: vG
}, Symbol.toStringTag, { value: "Module" })), mG = "raw", gG = 85, bG = (e) => Qe(e), yG = (e) => Qe(e), wG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  code: gG,
  decode: yG,
  encode: bG,
  name: mG
}, Symbol.toStringTag, { value: "Module" })), DG = new TextEncoder(), xG = new TextDecoder(), kG = "json", AG = 512, EG = (e) => DG.encode(JSON.stringify(e)), SG = (e) => JSON.parse(xG.decode(e)), CG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  code: AG,
  decode: SG,
  encode: EG,
  name: kG
}, Symbol.toStringTag, { value: "Module" }));
class ye {
  constructor(r, t, n, o) {
    this.code = t, this.version = r, this.multihash = n, this.bytes = o, this.byteOffset = o.byteOffset, this.byteLength = o.byteLength, this.asCID = this, this._baseCache = /* @__PURE__ */ new Map(), Object.defineProperties(this, {
      byteOffset: Mr,
      byteLength: Mr,
      code: Ir,
      version: Ir,
      multihash: Ir,
      bytes: Ir,
      _baseCache: Mr,
      asCID: Mr
    });
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      default: {
        const { code: r, multihash: t } = this;
        if (r !== fr)
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        if (t.code !== $G)
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        return ye.createV0(t);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: r, digest: t } = this.multihash, n = xr(r, t);
        return ye.createV1(this.code, n);
      }
      case 1:
        return this;
      default:
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
    }
  }
  equals(r) {
    return r && this.code === r.code && this.version === r.version && NB(this.multihash, r.multihash);
  }
  toString(r) {
    const { bytes: t, version: n, _baseCache: o } = this;
    switch (n) {
      case 0:
        return qG(t, o, r || Te.encoder);
      default:
        return TG(t, o, r || mr.encoder);
    }
  }
  toJSON() {
    return {
      code: this.code,
      version: this.version,
      hash: this.multihash.bytes
    };
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return "CID(" + this.toString() + ")";
  }
  static isCID(r) {
    return OG(/^0\.0/, RG), !!(r && (r[YF] || r.asCID === r));
  }
  get toBaseEncodedString() {
    throw new Error("Deprecated, use .toString()");
  }
  get codec() {
    throw new Error('"codec" property is deprecated, use integer "code" property instead');
  }
  get buffer() {
    throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
  }
  get multibaseName() {
    throw new Error('"multibaseName" property is deprecated');
  }
  get prefix() {
    throw new Error('"prefix" property is deprecated');
  }
  static asCID(r) {
    if (r instanceof ye)
      return r;
    if (r != null && r.asCID === r) {
      const { version: t, code: n, multihash: o, bytes: i } = r;
      return new ye(t, n, o, i || XF(t, n, o.bytes));
    } else if (r != null && r[YF] === !0) {
      const { version: t, multihash: n, code: o } = r, i = RB(n);
      return ye.create(t, o, i);
    } else
      return null;
  }
  static create(r, t, n) {
    if (typeof t != "number")
      throw new Error("String codecs are no longer supported");
    switch (r) {
      case 0: {
        if (t !== fr)
          throw new Error(`Version 0 CID must use dag-pb (code: ${fr}) block encoding`);
        return new ye(r, t, n, n.bytes);
      }
      case 1: {
        const o = XF(r, t, n.bytes);
        return new ye(r, t, n, o);
      }
      default:
        throw new Error("Invalid version");
    }
  }
  static createV0(r) {
    return ye.create(0, fr, r);
  }
  static createV1(r, t) {
    return ye.create(1, r, t);
  }
  static decode(r) {
    const [t, n] = ye.decodeFirst(r);
    if (n.length)
      throw new Error("Incorrect length");
    return t;
  }
  static decodeFirst(r) {
    const t = ye.inspectBytes(r), n = t.size - t.multihashSize, o = Qe(r.subarray(n, n + t.multihashSize));
    if (o.byteLength !== t.multihashSize)
      throw new Error("Incorrect length");
    const i = o.subarray(t.multihashSize - t.digestSize), s = new Xr(t.multihashCode, t.digestSize, i, o);
    return [
      t.version === 0 ? ye.createV0(s) : ye.createV1(t.codec, s),
      r.subarray(t.size)
    ];
  }
  static inspectBytes(r) {
    let t = 0;
    const n = () => {
      const [h, y] = Wr(r.subarray(t));
      return t += y, h;
    };
    let o = n(), i = fr;
    if (o === 18 ? (o = 0, t = 0) : o === 1 && (i = n()), o !== 0 && o !== 1)
      throw new RangeError(`Invalid CID version ${o}`);
    const s = t, c = n(), u = n(), p = t + u, v = p - s;
    return {
      version: o,
      codec: i,
      multihashCode: c,
      digestSize: u,
      multihashSize: v,
      size: p
    };
  }
  static parse(r, t) {
    const [n, o] = _G(r, t), i = ye.decode(o);
    return i._baseCache.set(n, r), i;
  }
}
const _G = (e, r) => {
  switch (e[0]) {
    case "Q": {
      const t = r || Te;
      return [
        Te.prefix,
        t.decode(`${Te.prefix}${e}`)
      ];
    }
    case Te.prefix: {
      const t = r || Te;
      return [
        Te.prefix,
        t.decode(e)
      ];
    }
    case mr.prefix: {
      const t = r || mr;
      return [
        mr.prefix,
        t.decode(e)
      ];
    }
    default: {
      if (r == null)
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      return [
        e[0],
        r.decode(e)
      ];
    }
  }
}, qG = (e, r, t) => {
  const { prefix: n } = t;
  if (n !== Te.prefix)
    throw Error(`Cannot string encode V0 in ${t.name} encoding`);
  const o = r.get(n);
  if (o == null) {
    const i = t.encode(e).slice(1);
    return r.set(n, i), i;
  } else
    return o;
}, TG = (e, r, t) => {
  const { prefix: n } = t, o = r.get(n);
  if (o == null) {
    const i = t.encode(e);
    return r.set(n, i), i;
  } else
    return o;
}, fr = 112, $G = 18, XF = (e, r, t) => {
  const n = Dr(e), o = n + Dr(r), i = new Uint8Array(o + t.byteLength);
  return wr(e, i, 0), wr(r, i, n), i.set(t, o), i;
}, YF = Symbol.for("@ipld/js-cid/CID"), Ir = {
  writable: !1,
  configurable: !1,
  enumerable: !0
}, Mr = {
  writable: !1,
  enumerable: !1,
  configurable: !1
}, LG = "0.0.0-dev", OG = (e, r) => {
  if (e.test(LG))
    console.warn(r);
  else
    throw new Error(r);
}, RG = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`, NG = {
  ...lH,
  ...cH,
  ...pH,
  ...vH,
  ...gH,
  ...SH,
  ...qH,
  ...$H,
  ...PH,
  ...MH
}, PG = {
  ...fG,
  ...hG
}, FG = {
  raw: wG,
  json: CG
}, BG = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CID: ye,
  bases: NG,
  bytes: eH,
  codecs: FG,
  digest: sG,
  hasher: lG,
  hashes: PG,
  varint: oG
}, Symbol.toStringTag, { value: "Module" })), UG = /* @__PURE__ */ gB(BG);
var ra, QF;
function jB() {
  if (QF)
    return ra;
  QF = 1;
  const { bases: e } = UG;
  function r(i, s, c, u) {
    return {
      name: i,
      prefix: s,
      encoder: {
        name: i,
        prefix: s,
        encode: c
      },
      decoder: {
        decode: u
      }
    };
  }
  const t = r("utf8", "u", (i) => "u" + new TextDecoder("utf8").decode(i), (i) => new TextEncoder().encode(i.substring(1))), n = r("ascii", "a", (i) => {
    let s = "a";
    for (let c = 0; c < i.length; c++)
      s += String.fromCharCode(i[c]);
    return s;
  }, (i) => {
    i = i.substring(1);
    const s = new Uint8Array(i.length);
    for (let c = 0; c < i.length; c++)
      s[c] = i.charCodeAt(c);
    return s;
  });
  return ra = {
    utf8: t,
    "utf-8": t,
    hex: e.base16,
    latin1: n,
    ascii: n,
    binary: n,
    ...e
  }, ra;
}
var ta, eB;
function jG() {
  if (eB)
    return ta;
  eB = 1;
  const e = jB();
  function r(t, n = "utf8") {
    const o = e[n];
    if (!o)
      throw new Error(`Unsupported encoding "${n}"`);
    return o.encoder.encode(t).substring(1);
  }
  return ta = r, ta;
}
var aa, rB;
function IG() {
  if (rB)
    return aa;
  rB = 1;
  const e = jB();
  function r(t, n = "utf8") {
    const o = e[n];
    if (!o)
      throw new Error(`Unsupported encoding "${n}"`);
    return o.decoder.decode(`${o.prefix}${t}`);
  }
  return aa = r, aa;
}
var na, tB;
function MG() {
  if (tB)
    return na;
  tB = 1;
  function e(r, t) {
    t || (t = r.reduce((i, s) => i + s.length, 0));
    const n = new Uint8Array(t);
    let o = 0;
    for (const i of r)
      n.set(i, o), o += i.length;
    return n;
  }
  return na = e, na;
}
var ia, aB;
function zG() {
  if (aB)
    return ia;
  aB = 1;
  const e = Mz(), r = Vz(), { names: t } = Wz(), n = jG(), o = IG(), i = MG(), s = (
    /** @type {import('./types').CodeNameMap} */
    {}
  );
  for (const g in t) {
    const S = (
      /** @type {HashName} */
      g
    );
    s[t[S]] = S;
  }
  function c(g) {
    if (!(g instanceof Uint8Array))
      throw new Error("must be passed a Uint8Array");
    return n(g, "base16");
  }
  function u(g) {
    return o(g, "base16");
  }
  function p(g) {
    if (!(g instanceof Uint8Array))
      throw new Error("must be passed a Uint8Array");
    return n(e.encode("base58btc", g)).slice(1);
  }
  function v(g) {
    const S = g instanceof Uint8Array ? n(g) : g;
    return e.decode("z" + S);
  }
  function h(g) {
    if (!(g instanceof Uint8Array))
      throw new Error("multihash must be a Uint8Array");
    if (g.length < 2)
      throw new Error("multihash too short. must be > 2 bytes.");
    const S = (
      /** @type {HashCode} */
      r.decode(g)
    );
    if (!$(S))
      throw new Error(`multihash unknown function code: 0x${S.toString(16)}`);
    g = g.slice(r.decode.bytes);
    const q = r.decode(g);
    if (q < 0)
      throw new Error(`multihash invalid length: ${q}`);
    if (g = g.slice(r.decode.bytes), g.length !== q)
      throw new Error(`multihash length inconsistent: 0x${n(g, "base16")}`);
    return {
      code: S,
      name: s[S],
      length: q,
      digest: g
    };
  }
  function y(g, S, q) {
    if (!g || S === void 0)
      throw new Error("multihash encode requires at least two args: digest, code");
    const P = T(S);
    if (!(g instanceof Uint8Array))
      throw new Error("digest should be a Uint8Array");
    if (q == null && (q = g.length), q && g.length !== q)
      throw new Error("digest length should be equal to specified length.");
    const R = r.encode(P), L = r.encode(q);
    return i([R, L, g], R.length + L.length + g.length);
  }
  function T(g) {
    let S = g;
    if (typeof g == "string") {
      if (t[g] === void 0)
        throw new Error(`Unrecognized hash function named: ${g}`);
      S = t[g];
    }
    if (typeof S != "number")
      throw new Error(`Hash function code should be a number. Got: ${S}`);
    if (s[S] === void 0 && !x(S))
      throw new Error(`Unrecognized function code: ${S}`);
    return S;
  }
  function x(g) {
    return g > 0 && g < 16;
  }
  function $(g) {
    return !!(x(g) || s[g]);
  }
  function b(g) {
    h(g);
  }
  function A(g) {
    return b(g), g.subarray(0, 2);
  }
  return ia = {
    names: t,
    codes: Object.freeze(s),
    toHexString: c,
    fromHexString: u,
    toB58String: p,
    fromB58String: v,
    decode: h,
    encode: y,
    coerceCode: T,
    isAppCode: x,
    validate: b,
    prefix: A,
    isValidCode: $
  }, ia;
}
var oa, nB;
function ka() {
  if (nB)
    return oa;
  nB = 1;
  const e = Ar(), r = nr(), t = {
    array(n, o = !1, i = "") {
      return e.toList(n, o, (s) => t.format(s, i));
    },
    object(n) {
      return e.toObject(n, (o) => t.format(o));
    },
    null(n = null) {
      return n === null && (n = e.t("n/a")), e.toNothing(n);
    },
    number(n, o = "") {
      return typeof n != "number" && (n = parseFloat(n)), e.unit(n.toLocaleString(r.locales, { maximumFractionDigits: 10 }), o);
    },
    string(n, o = "") {
      return e.unit(e.e(n).replace(/(\r\n|\r|\n){2,}/g, "<br>"), o);
    },
    boolean(n) {
      return n ? "✔️" : "❌";
    },
    format(n, o = "") {
      return typeof n == "boolean" ? t.boolean(n) : typeof n == "number" ? t.number(n, o) : typeof n == "string" ? t.string(n, o) : Array.isArray(n) ? t.array(n, o) : e.isObject(n) ? t.object(n) : t.null();
    }
  };
  return oa = t, oa;
}
const HG = "Afar", GG = "Abkhazian", VG = "Afrikaans", WG = "Akan", ZG = "Amharic", JG = "Aragonese", KG = "Arabic", XG = "Assamese", YG = "Avar", QG = "Aymara", eV = "Azerbaijani", rV = "Bashkir", tV = "Belarusian", aV = "Bulgarian", nV = "Bihari", iV = "Bislama", oV = "Bambara", sV = "Bengali", lV = "Tibetan", uV = "Breton", cV = "Bosnian", fV = "Catalan", pV = "Chechen", dV = "Chamorro", vV = "Corsican", hV = "Cree", mV = "Czech", gV = "Old Bulgarian", bV = "Chuvash", yV = "Welsh", wV = "Danish", DV = "German", xV = "Divehi", kV = "Dzongkha", AV = "Ewe", EV = "Greek", SV = "English", CV = "Esperanto", _V = "Spanish", qV = "Estonian", TV = "Basque", $V = "Persian", LV = "Peul", OV = "Finnish", RV = "Fijian", NV = "Faroese", PV = "French", FV = "West Frisian", BV = "Irish", UV = "Scottish Gaelic", jV = "Galician", IV = "Guarani", MV = "Gujarati", zV = "Manx", HV = "Hausa", GV = "Hebrew", VV = "Hindi", WV = "Hiri Motu", ZV = "Croatian", JV = "Haitian", KV = "Hungarian", XV = "Armenian", YV = "Herero", QV = "Interlingua", e9 = "Indonesian", r9 = "Interlingue", t9 = "Igbo", a9 = "Sichuan Yi", n9 = "Inupiak", i9 = "Ido", o9 = "Icelandic", s9 = "Italian", l9 = "Inuktitut", u9 = "Japanese", c9 = "Javanese", f9 = "Georgian", p9 = "Kongo", d9 = "Kikuyu", v9 = "Kuanyama", h9 = "Kazakh", m9 = "Greenlandic", g9 = "Cambodian", b9 = "Kannada", y9 = "Korean", w9 = "Kanuri", D9 = "Kashmiri", x9 = "Kurdish", k9 = "Komi", A9 = "Cornish", E9 = "Kirghiz", S9 = "Latin", C9 = "Luxembourgish", _9 = "Ganda", q9 = "Limburgian", T9 = "Lingala", $9 = "Laotian", L9 = "Lithuanian", O9 = "Latvian", R9 = "Malagasy", N9 = "Marshallese", P9 = "Maori", F9 = "Macedonian", B9 = "Malayalam", U9 = "Mongolian", j9 = "Moldovan", I9 = "Marathi", M9 = "Malay", z9 = "Maltese", H9 = "Burmese", G9 = "Nauruan", V9 = "North Ndebele", W9 = "Nepali", Z9 = "Ndonga", J9 = "Dutch", K9 = "Norwegian Nynorsk", X9 = "Norwegian", Y9 = "South Ndebele", Q9 = "Navajo", e7 = "Chichewa", r7 = "Occitan", t7 = "Ojibwa", a7 = "Oromo", n7 = "Oriya", i7 = "Ossetian", o7 = "Punjabi", s7 = "Pali", l7 = "Polish", u7 = "Pashto", c7 = "Portuguese", f7 = "Quechua", p7 = "Raeto Romance", d7 = "Kirundi", v7 = "Romanian", h7 = "Russian", m7 = "Rwandi", g7 = "Sanskrit", b7 = "Sardinian", y7 = "Sindhi", w7 = "Sango", D7 = "Serbo-Croatian", x7 = "Sinhalese", k7 = "Slovak", A7 = "Slovenian", E7 = "Samoan", S7 = "Shona", C7 = "Somalia", _7 = "Albanian", q7 = "Serbian", T7 = "Swati", $7 = "Southern Sotho", L7 = "Sundanese", O7 = "Swedish", R7 = "Swahili", N7 = "Tamil", P7 = "Telugu", F7 = "Tajik", B7 = "Thai", U7 = "Tigrinya", j7 = "Turkmen", I7 = "Tagalog", M7 = "Tswana", z7 = "Tonga", H7 = "Turkish", G7 = "Tsonga", V7 = "Tatar", W7 = "Twi", Z7 = "Tahitian", J7 = "Uyghur", K7 = "Ukrainian", X7 = "Urdu", Y7 = "Venda", Q7 = "Vietnamese", eW = "Volapük", rW = "Walloon", tW = "Wolof", aW = "Xhosa", nW = "Yiddish", iW = "Yoruba", oW = "Zhuang", sW = "Chinese", lW = "Zulu", uW = {
  aa: HG,
  ab: GG,
  af: VG,
  ak: WG,
  am: ZG,
  an: JG,
  ar: KG,
  as: XG,
  av: YG,
  ay: QG,
  az: eV,
  ba: rV,
  be: tV,
  bg: aV,
  bh: nV,
  bi: iV,
  bm: oV,
  bn: sV,
  bo: lV,
  br: uV,
  bs: cV,
  ca: fV,
  ce: pV,
  ch: dV,
  co: vV,
  cr: hV,
  cs: mV,
  cu: gV,
  cv: bV,
  cy: yV,
  da: wV,
  de: DV,
  dv: xV,
  dz: kV,
  ee: AV,
  el: EV,
  en: SV,
  eo: CV,
  es: _V,
  et: qV,
  eu: TV,
  fa: $V,
  ff: LV,
  fi: OV,
  fj: RV,
  fo: NV,
  fr: PV,
  fy: FV,
  ga: BV,
  gd: UV,
  gl: jV,
  gn: IV,
  gu: MV,
  gv: zV,
  ha: HV,
  he: GV,
  hi: VV,
  ho: WV,
  hr: ZV,
  ht: JV,
  hu: KV,
  hy: XV,
  hz: YV,
  ia: QV,
  id: e9,
  ie: r9,
  ig: t9,
  ii: a9,
  ik: n9,
  io: i9,
  is: o9,
  it: s9,
  iu: l9,
  ja: u9,
  jv: c9,
  ka: f9,
  kg: p9,
  ki: d9,
  kj: v9,
  kk: h9,
  kl: m9,
  km: g9,
  kn: b9,
  ko: y9,
  kr: w9,
  ks: D9,
  ku: x9,
  kv: k9,
  kw: A9,
  ky: E9,
  la: S9,
  lb: C9,
  lg: _9,
  li: q9,
  ln: T9,
  lo: $9,
  lt: L9,
  lv: O9,
  mg: R9,
  mh: N9,
  mi: P9,
  mk: F9,
  ml: B9,
  mn: U9,
  mo: j9,
  mr: I9,
  ms: M9,
  mt: z9,
  my: H9,
  na: G9,
  nd: V9,
  ne: W9,
  ng: Z9,
  nl: J9,
  nn: K9,
  no: X9,
  nr: Y9,
  nv: Q9,
  ny: e7,
  oc: r7,
  oj: t7,
  om: a7,
  or: n7,
  os: i7,
  pa: o7,
  pi: s7,
  pl: l7,
  ps: u7,
  pt: c7,
  qu: f7,
  rm: p7,
  rn: d7,
  ro: v7,
  ru: h7,
  rw: m7,
  sa: g7,
  sc: b7,
  sd: y7,
  sg: w7,
  sh: D7,
  si: x7,
  sk: k7,
  sl: A7,
  sm: E7,
  sn: S7,
  so: C7,
  sq: _7,
  sr: q7,
  ss: T7,
  st: $7,
  su: L7,
  sv: O7,
  sw: R7,
  ta: N7,
  te: P7,
  tg: F7,
  th: B7,
  ti: U7,
  tk: j7,
  tl: I7,
  tn: M7,
  to: z7,
  tr: H7,
  ts: G7,
  tt: V7,
  tw: W7,
  ty: Z7,
  ug: J7,
  uk: K7,
  ur: X7,
  ve: Y7,
  vi: Q7,
  vo: eW,
  wa: rW,
  wo: tW,
  xh: aW,
  yi: nW,
  yo: iW,
  za: oW,
  zh: sW,
  zu: lW
};
var sa, iB;
function IB() {
  if (iB)
    return sa;
  iB = 1;
  const e = Ar(), r = ka(), t = nr(), n = ha, o = {
    allowHtmlInCommonMark: !1,
    formatUrl(i, s, c = {}, u = null, p = null) {
      let v = e.isObject(p) && typeof p == "string" ? p.title : i;
      return e.toLink(i, v, p.rel || "");
    },
    formatLink(i) {
      return e.toList(i, !1, (s) => e.toLink(s.href, s.title, s.rel));
    },
    formatMediaType(i, s, c = {}) {
      return e.e(e.t(o._formatMediaType(i, s, c)));
    },
    _formatMediaType(i, s, c = {}) {
      let u = !!c.shorten;
      const p = n.getDependency("content-type");
      if (!p)
        return u ? "" : e.e(i);
      let v;
      try {
        v = p.parse(i);
      } catch (h) {
        return console.warn(h), u ? "" : e.e(i);
      }
      switch (v.type) {
        case "image/tiff":
          return v.parameters.application === "geotiff" ? v.parameters.profile === "cloud-optimized" ? u ? "COG" : "Cloud-Optimized GeoTIFF image" : u ? "GeoTiff" : "GeoTIFF image" : u ? "TIFF" : "TIFF image";
        case "image/jp2":
          return u ? "JPEG 2000" : "JPEG 2000 image";
        case "image/png":
        case "image/apng":
        case "image/vnd.mozilla.apng":
          return u ? "PNG" : "PNG image";
        case "image/gif":
          return u ? "GIF" : "GIF image";
        case "image/jpeg":
        case "image/jpg":
          return u ? "JPEG" : "JPEG image";
        case "image/webp":
          return u ? "WebP" : "WebP image";
        case "image/bmp":
        case "image/x-bmp":
        case "image/x-ms-bmp":
        case "image/wbmp":
          return u ? "Bitmap" : "Bitmap image";
        case "image/svg+xml":
          return u ? "SVG" : "SVG vector image";
        case "text/csv":
          return u ? "CSV" : "Comma-separated values (CSV)";
        case "text/xml":
        case "application/xml":
          return "XML";
        case "text/json":
        case "application/json":
          return "JSON";
        case "application/x-ndjson":
          return u ? "NDJSON" : "Newline Delimited JSON";
        case "text/yaml":
        case "text/vnd.yaml":
        case "text/x-yaml":
        case "application/x-yaml":
          return "YAML";
        case "application/geo+json":
          return "GeoJSON";
        case "application/gml+xml":
          return "GML";
        case "application/vnd.google-earth.kml+xml":
        case "application/vnd.google-earth.kmz":
          return "KML";
        case "application/geopackage+vnd.sqlite3":
        case "application/geopackage+sqlite3":
          return "GeoPackage";
        case "text/html":
        case "application/html":
        case "application/xhtml+xml":
          return u ? "HTML" : "HTML (Website)";
        case "text/plain":
          return u ? "Text" : "Text document";
        case "text/markdown":
          return u ? "Markdown" : "Markdown document";
        case "application/pdf":
          return u ? "PDF" : "PDF document";
        case "application/zip":
          return u ? "ZIP" : "ZIP archive";
        case "application/gzip":
          return u ? "GZIP" : "GZIP archive";
        case "application/x-hdf":
          return "HDF";
        case "application/netcdf":
        case "application/x-netcdf":
          return "NetCDF";
        case "application/x.mrf":
          return u ? "MRF" : "Meta Raster Format";
        case "application/wmo-GRIB2":
          return "GRIB2";
        case "application/octet-stream":
          return u ? "Binary" : "Binary file";
        case "application/vnd.laszip":
          return "LASzip";
        case "application/vnd.laszip+copc":
          return u ? "COPC" : "Cloud-Optimized Point Cloud (LASzip)";
        case "application/vnd+zarr":
          return "Zarr";
        case "application/x-parquet":
        case "application/vnd.apache.parquet":
          return "Parquet";
        case "application/vnd.pmtiles":
          return "PMTiles";
        case "application/vnd.cov+json":
          return "CoverageJSON";
        case "application/vnd.flatgeobuf":
          return "FlatGeobuf";
        default: {
          let [h, y] = v.type.split("/");
          if (y = e.formatKey(y.replace(/^(vnd|x)[.+-]/, "")), u)
            return y;
          switch (h) {
            case "audio":
              return `${y} audio`;
            case "image":
              return `${y} image`;
            case "font":
              return "Font";
            case "model":
              return `${y} 3D model`;
            case "video":
              return `${y} video`;
            case "text":
            case "application":
              return y;
            default:
              return i;
          }
        }
      }
    },
    formatTimestamp(i) {
      if (typeof i == "string")
        try {
          return new Date(i).toLocaleString(t.locales, {
            timeZone: "UTC",
            timeZoneName: "short"
          });
        } catch {
        }
      return r.null();
    },
    formatPercent0to1(i, s, c = {}) {
      return r.number(i * 100, c.unit);
    },
    formatDate(i) {
      if (typeof i == "string")
        try {
          return new Date(i).toLocaleString(t.locales, {
            day: "numeric",
            month: "numeric",
            year: "numeric"
          });
        } catch {
        }
      return r.null();
    },
    formatDuration(i) {
      if (typeof i == "string") {
        const s = n.getDependency("@musement/iso-duration");
        if (!s)
          return e.e(i);
        const { isoDuration: c, en: u } = s;
        c.setLocales({ en: u }, { fallbackLocale: "en" });
        let p = c(i).humanize("en");
        return p.length === 0 ? e.e(e.t("none")) : e.e(p);
      }
      return r.null();
    },
    formatLanguageCode(i) {
      if (Array.isArray(i))
        return e.toList(i, !0, o.formatLanguageCode, !1);
      if (typeof i != "string" || i.length < 2)
        return r.null();
      const s = uW, [c, ...u] = i.split("-");
      if (c in s) {
        const p = s[c];
        return u.length > 0 ? e.e(e.t(`${p} (${u.join(" ")})`)) : e.e(e.t(p));
      }
      return e.e(e.t(i));
    },
    formatLicense(i, s, c = {}, u = null) {
      if (typeof i != "string" || i.length === 0)
        return r.null();
      if (i !== "proprietary" && i !== "various" && i.match(/^[\w\.\-]+$/i))
        return e.toLink(`https://spdx.org/licenses/${i}.html`, i, "license");
      let p = Array.isArray(u.links) ? u.links.filter((v) => e.isObject(v) && typeof v.href == "string" && v.rel === "license") : [];
      return p.length > 0 ? e.toList(p, !1, (v) => e.toLink(v.href, v.title || i, "license")) : r.string(i);
    },
    formatProviders(i) {
      return e.toList(i, !1, (s) => {
        let c = s.name, u = "", p = "";
        return typeof s.url == "string" && s.url.length > 0 && (c = e.toLink(s.url, c)), Array.isArray(s.roles) && s.roles.length > 0 && (u = s.roles.map((v) => r.format(v)).join(", "), u = ` (<em>${u}</em>)`), typeof s.description == "string" && s.description.length > 0 && (p = o.formatCommonMark(s.description)), `${c}${u}${p}`;
      });
    },
    formatCommonMark(i) {
      if (typeof i != "string" || i.length === 0)
        return r.null();
      const s = n.getDependency("commonmark");
      let c;
      if (s) {
        let u = new s.Parser();
        c = new s.HtmlRenderer({ safe: !o.allowHtmlInCommonMark, smart: !0 }).render(u.parse(i));
      } else
        o.allowHtmlInCommonMark ? c = i : c = e.e(i);
      return `<div class="description">${c}</div>`;
    },
    formatSoftware(i) {
      if (!e.isObject(i))
        return r.null();
      let s = [];
      for (let c in i) {
        let u = i[c];
        typeof u == "string" && u.length > 0 || typeof u == "number" ? s.push(`${c} (${u})`) : s.push(c);
      }
      return e.toList(s, !0, null, !1);
    },
    formatDOI(i) {
      return i = r.format(i), e.toLink(`http://doi.org/${i}`, i);
    },
    formatCRS(i) {
      return e.toList(i, !1, (s) => {
        if (typeof s == "string") {
          let c = s.replace(/^https?:\/\/www\.opengis\.net\/def\/crs\//i, "").replace(/^urn:ogc:def:crs:/i, "");
          return e.toLink(s, c);
        }
        return r.format(s);
      });
    },
    formatEPSG(i) {
      return typeof i == "string" && (i = i.replace(/^epsg:/i, "")), i = parseInt(i, 10), i > 0 ? e.toLink(`http://epsg.io/${i}`, i) : r.null();
    },
    formatExtent(i, s, c = {}) {
      return !Array.isArray(i) || i.length < 2 ? r.null() : i[0] === i[1] ? r.format(i[0], c.unit) : i[0] === null ? `< ${r.format(i[1], c.unit)}` : i[1] === null ? `> ${r.format(i[0], c.unit)}` : i.map((u) => r.format(u, c.unit)).join(" – ");
    },
    formatHexColor(i) {
      return typeof i != "string" || !i.match(/^#?[\dA-F]{3,8}$/i) ? r.null() : (i.startsWith("#") && (i = i.substring(1)), `<div class="color" style="background-color: #${i}"><code class="color-code">#${i}</code></div>`);
    },
    formatPROJJSON(i) {
      return e.isObject(i) ? e.isObject(i.id) && i.id.authority === "EPSG" && typeof i.code == "number" && i.code > 0 ? "EPSG " + o.formatEPSG(i) : typeof i.name == "string" ? r.string(i.name) : r.object(i) : r.null();
    },
    formatTemporalExtent(i, s, c = {}) {
      let u = c.shorten ? o.formatDate : o.formatTimestamp;
      return !Array.isArray(i) || i.length < 2 || typeof i[0] != "string" && typeof i[1] != "string" ? r.null() : typeof i[0] != "string" ? e.t("Until {0}", [u(i[1])]) : typeof i[1] != "string" ? e.t("{0} until present", [u(i[0])]) : i[0] === i[1] ? o.formatTimestamp(i[0]) : i.map((p) => u(p)).join(" - ");
    },
    formatTemporalExtents(i, s, c = {}) {
      let u = (p, v) => p[0] === null ? -1 : p[0].localeCompare(v[0], t.locales);
      return e.toList(i, u, (p) => o.formatTemporalExtent(p, s, c));
    },
    formatWKT2(i) {
      if (typeof i != "string")
        return r.null();
      let s = -1, c;
      try {
        c = i.replace(/([A-Z]+)\[|\]/ig, (u, p) => u === "]" ? (s--, u) : (s++, `
${"  ".repeat(s)}${p}[`));
      } catch {
        c = i;
      }
      return `<pre>${c}</pre>`;
    },
    fileSizeUnits: ["B", "kB", "MB", "GB", "TB"],
    formatFileSize(i) {
      if (typeof i != "number")
        return r.format(i);
      var s = i == 0 ? 0 : Math.floor(Math.log(i) / Math.log(1024));
      return e.unit((i / Math.pow(1024, s)).toFixed(2) * 1, o.fileSizeUnits[s]);
    },
    formatChecksum(i) {
      if (typeof i != "string")
        return r.null();
      const s = n.getDependency("multihashes");
      if (!s)
        return e.e(i);
      try {
        const c = s.decode(e.hexToUint8(i)), u = e.e(c.name);
        return `<div class="checksum"><input class="checksum-input" size="32" value="${e.e(e.uint8ToHex(c.digest))}" readonly><br><span class="checksum-algo">${e.t("Hashing algorithm:")} <strong>${u}</strong></span></div>`;
      } catch {
        return r.null();
      }
    },
    fileDataTypes: {
      int8: "8-bit integer",
      int16: "16-bit integer",
      int32: "32-bit integer",
      int64: "64-bit integer",
      uint8: "unsigned 8-bit integer",
      uint16: "unsigned 16-bit integer",
      uint32: "unsigned 32-bit integer",
      uint64: "unsigned 64-bit integer",
      float16: "16-bit float",
      float32: "32-bit float",
      float64: "64-bit float",
      cint16: "16-bit complex integer",
      cint32: "32-bit complex integer",
      cfloat32: "32-bit complex float",
      cfloat64: "64-bit complex float"
    },
    formatFileDataType(i) {
      return i === "other" ? e.t("non-standard") : typeof i == "string" && i in o.fileDataTypes ? e.abbrev(e.t(i), e.t(o.fileDataTypes[i])) : r.null();
    },
    formatTransform(i) {
      if (Array.isArray(i) && i.length % 3 === 0) {
        let s = [];
        for (let c = 0; c < i.length; c = c + 3) {
          let u = i.slice(c, c + 3);
          s.push(`[${o.formatCSV(u)}]`);
        }
        return s.join("<br>");
      } else
        return o.formatCSV(i);
    },
    formatShape(i, s, c = {}) {
      return Array.isArray(i) ? i.map((u) => r.format(u, c.unit)).join(" × ") : r.format(i, c.unit);
    },
    formatCSV(i) {
      if (Array.isArray(i)) {
        let s = i.find((c) => typeof c == "number") !== void 0;
        return i.map(r.format).join(s ? "; " : ", ");
      } else
        return r.format(i);
    },
    formatImage(i, s) {
      let c = "", u = null;
      if (e.isObject(i))
        u = i.href, c = i.title || "";
      else if (typeof i == "string")
        u = i;
      else
        return r.format(u);
      return `<img src="${e.e(u)}" title="${e.e(c)}" class="${e.e(s.replace(":", "_"))}">`;
    },
    formatPhone(i) {
      return e.toLink(`tel:${i}`, i);
    },
    formatEmail(i) {
      return e.toLink(`mailto:${i}`, i);
    },
    formatConcepts(i) {
      return e.toList(i, !1, (s) => {
        if (!e.isObject(s))
          return r.format(s);
        let c = "";
        if (s.title) {
          let u = s.title;
          s.url && (u = e.toLink(s.url, s.title)), c += `<strong>${u}</strong> (<code>${e.e(s.id)}</code>)`;
        } else {
          let u = s.id;
          s.url && (u = e.toLink(s.url, s.id)), c += `<strong><code>${u}</code></strong>`;
        }
        return s.description && (c += `<br><small>${e.e(s.description)}</small>`), c;
      });
    },
    formatAddress(i) {
      return e.toList(i, !1, (s) => {
        if (!e.isObject(s))
          return r.format(s);
        let c = Array.isArray(s.deliveryPoint) ? s.deliveryPoint.slice(0) : [];
        if (s.postalCode && s.city) {
          let u = `${s.postalCode} ${s.city}`;
          s.administrativeArea && (u += ` (${s.administrativeArea})`), typeof s.country == "string" && s.country.length > 0 && (s.country.length === 2 && s.country.toUpperCase() === s.country ? (u = s.country + "-" + u, c.push(u)) : (c.push(u), c.push(s.country.toUpperCase())));
        } else
          s.city && c.push(s.city), s.administrativeArea && c.push(s.administrativeArea), s.postalCode && c.push(s.postalCode), typeof s.country == "string" && s.country.length > 0 && c.push(s.country.toUpperCase());
        return r.string(c.join(`

`));
      });
    },
    formatGridCode(i) {
      if (typeof i != "string")
        return r.format(i);
      let s = function(v, h, y, T) {
        let x = h.length;
        if (x % 2 === 1)
          v.push(`Code: ${h}`);
        else {
          let $ = x / 2, b = h.substring(0, $);
          v.push(`${y}: ${b}`);
          let A = h.substring($, x);
          v.push(`${T}: ${A}`);
        }
      }, [c, u] = i.split(/-(.*)/), p = [];
      switch (c) {
        case "MGRS":
          p.push(e.abbrev(e.t(c), e.t("Military Grid Reference System")));
          let [, v, h, y, T] = u.match(/^(\d{2})([C-X])([A-Z]{2})(\d*)$/);
          p.push(`${e.t("UTM Zone")}: ${v}`), p.push(`${e.t("Latitude Band")}: ${h}`), p.push(`${e.t("Square Identifier")}: ${y}`), T && s(p, T, e.t("Easting"), e.t("Northing"));
          break;
        case "MSIN":
          p.push(e.t("MODIS Sinusoidal Tile Grid")), s(p, u, e.t("Horizontal"), e.t("Vertical"));
          break;
        case "WRS1":
        case "WRS2":
          let x = c.substring(3, 4);
          p.push(e.abbrev(e.t("WRS-" + x), e.t("Worldwide Reference System " + x))), s(p, u, e.t("Path"), e.t("Row"));
          break;
        case "DOQ":
          p.push(_abbrev(e.t(c), e.t("Digital Orthophoto Quadrangle"))), p.push(`${e.t("Quadrangle")}: ${u}`);
          break;
        case "DOQQ":
          p.push(_abbrev(e.t(c), e.t("Digital Orthophoto Quarter Quadrangle")));
          let $ = u.substr(0, u.length - 2);
          p.push(`${e.t("Quadrangle")}: ${$}`);
          let b = u.substr(-2), A = b[0] === "N" ? e.t("North") : e.t("South"), g = b[1] === "E" ? e.t("East") : e.t("West");
          p.push(`${e.t("Quarter")}: ${A} ${g}`);
          break;
        case "MXRA":
          p.push(e.t("Maxar ARD Tile Grid"));
          let [S, q] = u.split(/-(.*)/);
          S.startsWith("Z") && (S = S.substring(1)), p.push(`${e.t("UTM Zone")}: ${S}`), p.push(`${e.t("Quadkey")}: ${q}`);
          break;
        case "EASE":
          let [P, R] = u.split("-");
          if (P === "DGGS") {
            p.push(e.t("EASE-DGGS"));
            let [j, z, ...ae] = R.split(".");
            if (p.push(`${e.t("Level")}: ${j}`), z.length === 6) {
              p.push(`${e.t("Level 0 row cell")}: ${z.substring(0, 3)}`), p.push(`${e.t("Level 0 column cell")}: ${z.substring(3, 6)}`);
              for (let ne in ae) {
                let ge = ae[ne];
                ge.length === 2 && (p.push(`${e.t("Fraction of level {i} row cell", { i: ne })}: ${ge[0]}`), p.push(`${e.t("Fraction of level {i} column cell", { i: ne })}: ${ge[1]}`));
              }
            }
            break;
          }
        case "CDEM":
          let [, L, U] = u.match(/^([A-Z]\d+)([A-Z]\d+)$/);
          p.push(e.t("Copernicus Digital Elevation Model Grid")), p.push(`${e.t("Easting")}: ${U}`), p.push(`${e.t("Northing")}: ${L}`);
        default:
          p.push(i);
      }
      return p.join("<br>");
    }
  };
  return sa = o, sa;
}
var la, oB;
function cW() {
  if (oB)
    return la;
  oB = 1;
  const e = ha, r = Ar(), t = nr(), n = ka(), o = IB();
  function i(b, A, g, S, q) {
    let P = {};
    for (let R in A) {
      let L;
      try {
        let U = R.split(/:(.*)/);
        U.length === 1 && U.unshift(q);
        let j = U[0];
        if (typeof S == "function" && !S(R, [R]))
          continue;
        L = A[R];
        let z = e.getSpecification(R, g);
        z.ext && (j = z.ext);
        let ae = !1;
        g === "summaries" && z.listWithKeys && Array.isArray(L) && L.length > 0 && (L = L[0], ae = !0);
        let ne = null, ge = [];
        if (r.isObject(z.items)) {
          let ee = L;
          z.listWithKeys && (ee = Object.values(ee));
          let ue = [];
          Array.isArray(ee) ? ue = r.keysFromListOfObjects(ee) : r.isObject(ee) && (ue = Object.keys(ee)), ne = {}, ge = z.itemOrder.filter((J) => ue.includes(J)), ue.forEach((J) => {
            typeof z.items[J] > "u" ? (ne[J] = {
              label: r.formatKey(J),
              explain: J
            }, ge.push(J)) : (ne[J] = Object.assign({}, z.items[J]), ne[J].label = x(J, z.items[J]));
          });
        }
        let se;
        if (g === "summaries")
          if (!ae && r.isObject(L))
            if (typeof L.minimum < "u" && typeof L.maximum < "u") {
              const ee = (ue) => T(ue, R, b, A, z, S, [R]);
              L.minimum === L.maximum ? se = ee(L.minimum) : L.minimum === null ? se = `< ${ee(L.maximum)}` : L.maximum === null ? se = `> ${ee(L.minimum)}` : se = `${ee(L.minimum)} – ${ee(L.maximum)}`;
            } else
              se = n.object(L);
          else if (e.externalRenderer && ne) {
            let ee = ae ? Object.assign({}, L) : L.slice(0);
            for (let ue in ee) {
              let J = r.isObject(ee[ue]) ? {} : [];
              for (let W in ne)
                J[W] = T(ee[ue][W], W, b, A, ne[W]);
              ee[ue] = J;
            }
          } else
            Array.isArray(L) ? se = r.toList(L, !z.custom && !z.items, (ee) => T(ee, R, b, A, z)) : console.warn(`Invalid summary value: ${L}`);
        typeof se > "u" && (se = T(L, R, b, A, z, S, [R])), r.isObject(P[j]) || (P[j] = {
          extension: j,
          label: $(j),
          properties: {}
        }), P[j].properties[R] = {
          label: x(R, z),
          value: L,
          formatted: se,
          items: ne,
          itemOrder: ge,
          spec: z
        };
      } catch (U) {
        console.error(`Field '${R}' with value '${L}' resulted in an error`, U);
      }
    }
    return Object.values(P).sort((R, L) => R.extension.localeCompare(L.extension, t.locales));
  }
  function s(b, A, g = null, S = "") {
    return i(A, b, "assets", g, S);
  }
  function c(b, A, g = null, S = "") {
    return i(A, b, "links", g, S);
  }
  function u(b, A, g = null, S = "") {
    return i(A, b, "providers", g, S);
  }
  function p(b, A = null, g = "") {
    return i(b, b.summaries, "summaries", A, g);
  }
  function v(b, A = null, g = "") {
    return i(b, b, "collection", A, g);
  }
  function h(b, A = null, g = "") {
    return i(b, b, "catalog", A, g);
  }
  function y(b, A = null, g = "") {
    return i(b, b.properties, "metadata", A, g);
  }
  function T(b, A, g = null, S = null, q = null, P = null, R = []) {
    if (r.isObject(q) || (q = e.getSpecification(A)), typeof q.format == "string") {
      let L = o[`format${q.format}`];
      return L || console.warn(`Formatter '${q.format}' not available.`), L(b, A, q, g, S);
    } else {
      if (typeof q.formatter == "function")
        return q.formatter(b, A, q, g, S);
      if (r.isObject(q.mapping)) {
        let L = String(b);
        return typeof q.mapping[L] < "u" ? b = q.mapping[L] : typeof q.mapping[L.toLowerCase()] < "u" ? b = q.mapping[L.toLowerCase()] : typeof q.mapping[L.toUpperCase()] < "u" && (b = q.mapping[L.toUpperCase()]), n.format(r.t(b), q.unit);
      } else {
        if (b === null && q.null)
          return n.null(q.null);
        if (Array.isArray(b)) {
          let L = (U, j) => T(U, A, g, S, q, P, R.concat([j]));
          return typeof P == "function" && R.length > 0 && (b = b.filter((U, j) => P(R[0], R.concat([j])))), e.externalRenderer && (q.custom || q.items) ? b.map(L) : r.toList(b, !1, L);
        } else if (r.isObject(b)) {
          let L = (j) => r.isObject(q.items) ? q.listWithKeys ? { items: q.items, itemOrder: q.itemOrder } : q.items[j] : r.isObject(q.properties) ? q.properties[j] : {}, U = (j, z, ae) => T(j, z, g, ae, L(z), P, R.concat([z]));
          if (e.externalRenderer && (q.custom || q.items || q.properties)) {
            let j = {};
            for (let z in b)
              typeof P == "function" && R.length > 0 && !P(R[0], R.concat([k])) || (j[z] = U(b[z], z, b));
            return j;
          } else {
            let j = (ae) => x(ae, L(ae)), z = q.listWithKeys ? [] : q.itemOrder;
            return r.toObject(b, U, j, z, P, R);
          }
        } else
          return n.format(b, q.unit);
      }
    }
  }
  function x(b, A = null) {
    if (r.isObject(A) || (A = e.getSpecification(b)), r.isObject(A) && typeof A.label == "string") {
      if (typeof A.explain == "string")
        return A.explain.match(/^https?:\/\//i) ? r.toLink(A.explain, r.t(A.label), "about") : r.abbrev(r.t(A.label), r.t(A.explain));
      if (typeof A.label == "string")
        return r.t(A.label);
    }
    return r.formatKey(b);
  }
  function $(b) {
    return x(b, e.getExtension(b));
  }
  return la = {
    format: T,
    label: x,
    extension: $,
    formatCatalog: h,
    formatCollection: v,
    formatSummaries: p,
    formatItemProperties: y,
    formatAsset: s,
    formatLink: c,
    formatProvider: u,
    formatGrouped: i
  }, la;
}
const Ye = ha;
Ye.importFields(uM);
Ye.addDependency("@musement/iso-duration", dz);
Ye.addDependency("content-type", vz());
Ye.addDependency("commonmark", hz());
Ye.addDependency("multihashes", zG());
var MB = {
  ...cW(),
  Fields: Ye.exportFields(),
  Registry: Ye,
  Helper: Ar(),
  DataTypes: ka(),
  Formatters: IB(),
  I18N: nr()
};
const ua = /* @__PURE__ */ tM(MB);
var fW = Object.defineProperty, pW = Object.getOwnPropertyDescriptor, xe = (e, r, t, n) => {
  for (var o = n > 1 ? void 0 : n ? pW(r, t) : r, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (o = (n ? s(r, t, o) : s(o)) || o);
  return n && o && fW(r, t, o), o;
};
let ke = class extends tr {
  constructor() {
    super(...arguments), this.header = [], this.tags = [], this.properties = [], this.featured = [], this.footer = [], this.styleOverride = "", this.stacInfo = [], this.fetchStac = async (e) => {
      const t = await (await fetch(`${e}?ts=${Date.now()}`)).json();
      this.stacInfo = await this.parseStac(t), this.dispatchEvent(new CustomEvent("loaded"));
    }, this.parseStac = async (e) => {
      if (e.type === "Catalog")
        return ua.formatCatalog(e);
      if (e.type === "Collection")
        return ua.formatCollection(e);
      if (e.type === "Feature")
        return ua.formatItemProperties(e);
    };
  }
  buildProperties(e) {
    MB.Formatters.allowHtmlInCommonMark = this.allowHtml !== void 0;
    const r = (t, n) => YI(
      Object.entries(this.stacProperties).filter(([o]) => t === this.properties && (!t || t.length < 1) ? !0 : t == null ? void 0 : t.includes(o)).reverse().sort(
        ([o], [i]) => (t == null ? void 0 : t.indexOf(o)) > (t == null ? void 0 : t.indexOf(i)) ? 1 : -1
      ),
      n
    );
    return e.length < 1 ? null : (this.stacProperties = e.reduce(
      (t, n) => ({
        ...t,
        ...n.properties
      }),
      {}
    ), ve`
      ${r(this.header).length > 0 ? ve`
            <header part="header">
              <slot name="header">
                ${lr(
      r(this.header),
      ([, t], n) => K5`
              <h${Or((n + 1).toString())}>${qe(
        t.formatted
      )}</h${Or((n + 1).toString())}>
              `
    )}
              </slot>
            </header>
          ` : oe}
      <main>
        ${r(this.tags).length + r(this.properties).length > 0 ? ve`
              <section id="tags" part="tags">
                <ul>
                  ${lr(
      r(this.tags),
      ([, t]) => ve`<slot name=${t.label.toLowerCase()}
                      ><li>
                        <span class="label"
                          >${qe(t.formatted)}</span
                        >
                      </li></slot
                    >`
    )}
                </ul>
              </section>
              <section id="properties" part="properties">
                <ul
                  class=${r(this.properties).length === 1 ? "single-property" : oe}
                >
                  ${lr(
      r(this.properties),
      ([, t]) => ve`
                      <slot name=${t.label.toLowerCase()}>
                        <li>
                          ${ur(
        r(this.properties).length > 1,
        () => ve` <span class="label">
                                ${// TODO
        // @ts-ignore
        t.label}</span
                              ><span class="colon">:</span>`
      )}
                          <span class="value">
                            ${ur(
        t.label.toLowerCase() === "description",
        () => ve`${qe(
          // TODO
          // @ts-ignore
          t.formatted
        )}`,
        () => ve`${qe(
          // TODO
          // @ts-ignore
          t.formatted
        )}`
      )}
                          </span>
                        </li>
                      </slot>
                    `
    )}
                </ul>
              </section>
            ` : oe}
        ${r(this.featured, "featured").length > 0 ? ve`
              <section id="featured" part="featured">
                ${lr(
      r(this.featured, "featured").filter(
        ([t, n]) => n.length !== void 0 ? n.length > 0 : !0
      ),
      ([, t]) => ve`
                    <details>
                      <summary>
                        <slot
                          name="featured-${t.label.toLowerCase()}-summary"
                          class="title"
                        >
                          ${// TODO
      // @ts-ignore
      t.label}
                          ${ur(
        t.length,
        () => ve`
                              <span class="count">${t.length}</span>
                            `
      )}
                        </slot>
                      </summary>
                      <div class="featured-container">
                        <slot name="featured-${t.label.toLowerCase()}">
                          ${ur(
        t.label.toLowerCase() === "description",
        () => ve`${qe(
          // TODO
          // @ts-ignore
          t.formatted
        )}`,
        () => ve`${qe(
          // TODO
          // @ts-ignore
          t.formatted
        )}`
      )}
                        </slot>
                      </div>
                    </details>
                  `
    )}
              </section>
            ` : oe}
      </main>
      ${r(this.footer).length > 0 ? ve`
            <footer part="footer">
              <slot name="footer">
                ${lr(
      r(this.footer),
      ([t, n], o) => K5`
                <div class="footer-container">
                  <h${Or((o + 1).toString())}>
                    ${qe(n.label)}
                  </h${Or((o + 1).toString())}>
                  <small>${qe(n.formatted)}</small>
                </div>
                ${ur(
        t === "sci:citation",
        () => ve`
                    <button
                      class="copy icon"
                      @click=${() => navigator.clipboard.writeText(n.formatted)}
                    >
                      copy
                    </button>
                  `
      )}
              `
    )}
              </slot>
            </footer>
          ` : oe}
    `);
  }
  render() {
    return ve`
      <style>
        ${QI}
        ${!this.unstyled && rM}
        ${this.styleOverride}
      </style>
      <slot></slot>
      ${this.buildProperties(this.stacInfo)}
    `;
  }
  updated(e) {
    e.has("for") && this.fetchStac(this.for);
  }
};
xe([
  Ee({ attribute: "allow-html" })
], ke.prototype, "allowHtml", 2);
xe([
  Ee({ type: Boolean })
], ke.prototype, "unstyled", 2);
xe([
  Ee()
], ke.prototype, "for", 2);
xe([
  Ee({ type: Array })
], ke.prototype, "header", 2);
xe([
  Ee({ type: Array })
], ke.prototype, "tags", 2);
xe([
  Ee({ type: Array })
], ke.prototype, "properties", 2);
xe([
  Ee({ type: Array })
], ke.prototype, "featured", 2);
xe([
  Ee({ type: Array })
], ke.prototype, "footer", 2);
xe([
  Ee({ attribute: "style-override" })
], ke.prototype, "styleOverride", 2);
xe([
  hB()
], ke.prototype, "stacInfo", 2);
xe([
  hB()
], ke.prototype, "stacProperties", 2);
ke = xe([
  vB("eox-stacinfo")
], ke);
let pa = class extends tr {
  render() {
    return ve`<div>${qe(this.content)}</div>`;
  }
};
xe([
  Ee()
], pa.prototype, "content", 2);
pa = xe([
  vB("eox-stacinfo-shadow")
], pa);
export {
  ke as EOxStacInfo,
  pa as EOxStacInfoShadow
};
