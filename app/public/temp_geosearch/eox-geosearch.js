var Ti = (t) => {
  throw TypeError(t);
};
var Li = (t, i, s) => i.has(t) || Ti("Cannot " + s);
var ui = (t, i, s) => (Li(t, i, "read from private field"), s ? s.call(t) : i.get(t)), qi = (t, i, s) => i.has(t) ? Ti("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(t) : i.set(t, s), ki = (t, i, s, e) => (Li(t, i, "write to private field"), e ? e.call(t, s) : i.set(t, s), s);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = globalThis, Si = Jt.ShadowRoot && (Jt.ShadyCSS === void 0 || Jt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wi = Symbol(), Gi = /* @__PURE__ */ new WeakMap();
let Ms = class {
  constructor(i, s, e) {
    if (this._$cssResult$ = !0, e !== wi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = s;
  }
  get styleSheet() {
    let i = this.o;
    const s = this.t;
    if (Si && i === void 0) {
      const e = s !== void 0 && s.length === 1;
      e && (i = Gi.get(s)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), e && Gi.set(s, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const Ks = (t) => new Ms(typeof t == "string" ? t : t + "", void 0, wi), Js = (t, ...i) => {
  const s = t.length === 1 ? t[0] : i.reduce((e, a, r) => e + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[r + 1], t[0]);
  return new Ms(s, t, wi);
}, Zs = (t, i) => {
  if (Si) t.adoptedStyleSheets = i.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of i) {
    const e = document.createElement("style"), a = Jt.litNonce;
    a !== void 0 && e.setAttribute("nonce", a), e.textContent = s.cssText, t.appendChild(e);
  }
}, zi = Si ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((i) => {
  let s = "";
  for (const e of i.cssRules) s += e.cssText;
  return Ks(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ys, defineProperty: ta, getOwnPropertyDescriptor: ia, getOwnPropertyNames: sa, getOwnPropertySymbols: aa, getPrototypeOf: ea } = Object, Z = globalThis, Ui = Z.trustedTypes, ra = Ui ? Ui.emptyScript : "", fi = Z.reactiveElementPolyfillSupport, Pt = (t, i) => t, _i = { toAttribute(t, i) {
  switch (i) {
    case Boolean:
      t = t ? ra : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, i) {
  let s = t;
  switch (i) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, ms = (t, i) => !Ys(t, i), Di = { attribute: !0, type: String, converter: _i, reflect: !1, hasChanged: ms };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Z.litPropertyMetadata ?? (Z.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class lt extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ?? (this.l = [])).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, s = Di) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.elementProperties.set(i, s), !s.noAccessor) {
      const e = Symbol(), a = this.getPropertyDescriptor(i, e, s);
      a !== void 0 && ta(this.prototype, i, a);
    }
  }
  static getPropertyDescriptor(i, s, e) {
    const { get: a, set: r } = ia(this.prototype, i) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get() {
      return a == null ? void 0 : a.call(this);
    }, set(n) {
      const h = a == null ? void 0 : a.call(this);
      r.call(this, n), this.requestUpdate(i, h, e);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? Di;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Pt("elementProperties"))) return;
    const i = ea(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Pt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Pt("properties"))) {
      const s = this.properties, e = [...sa(s), ...aa(s)];
      for (const a of e) this.createProperty(a, s[a]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const s = litPropertyMetadata.get(i);
      if (s !== void 0) for (const [e, a] of s) this.elementProperties.set(e, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, e] of this.elementProperties) {
      const a = this._$Eu(s, e);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const s = [];
    if (Array.isArray(i)) {
      const e = new Set(i.flat(1 / 0).reverse());
      for (const a of e) s.unshift(zi(a));
    } else i !== void 0 && s.push(zi(i));
    return s;
  }
  static _$Eu(i, s) {
    const e = s.attribute;
    return e === !1 ? void 0 : typeof e == "string" ? e : typeof i == "string" ? i.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var i;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (i = this.constructor.l) == null || i.forEach((s) => s(this));
  }
  addController(i) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(i), this.renderRoot !== void 0 && this.isConnected && ((s = i.hostConnected) == null || s.call(i));
  }
  removeController(i) {
    var s;
    (s = this._$EO) == null || s.delete(i);
  }
  _$E_() {
    const i = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const e of s.keys()) this.hasOwnProperty(e) && (i.set(e, this[e]), delete this[e]);
    i.size > 0 && (this._$Ep = i);
  }
  createRenderRoot() {
    const i = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Zs(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    var i;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (i = this._$EO) == null || i.forEach((s) => {
      var e;
      return (e = s.hostConnected) == null ? void 0 : e.call(s);
    });
  }
  enableUpdating(i) {
  }
  disconnectedCallback() {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var e;
      return (e = s.hostDisconnected) == null ? void 0 : e.call(s);
    });
  }
  attributeChangedCallback(i, s, e) {
    this._$AK(i, e);
  }
  _$EC(i, s) {
    var r;
    const e = this.constructor.elementProperties.get(i), a = this.constructor._$Eu(i, e);
    if (a !== void 0 && e.reflect === !0) {
      const n = (((r = e.converter) == null ? void 0 : r.toAttribute) !== void 0 ? e.converter : _i).toAttribute(s, e.type);
      this._$Em = i, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(i, s) {
    var r;
    const e = this.constructor, a = e._$Eh.get(i);
    if (a !== void 0 && this._$Em !== a) {
      const n = e.getPropertyOptions(a), h = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((r = n.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? n.converter : _i;
      this._$Em = a, this[a] = h.fromAttribute(s, n.type), this._$Em = null;
    }
  }
  requestUpdate(i, s, e) {
    if (i !== void 0) {
      if (e ?? (e = this.constructor.getPropertyOptions(i)), !(e.hasChanged ?? ms)(this[i], s)) return;
      this.P(i, s, e);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(i, s, e) {
    this._$AL.has(i) || this._$AL.set(i, s), e.reflect === !0 && this._$Em !== i && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(i);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const i = this.scheduleUpdate();
    return i != null && await i, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, n] of a) n.wrapped !== !0 || this._$AL.has(r) || this[r] === void 0 || this.P(r, this[r], n);
    }
    let i = !1;
    const s = this._$AL;
    try {
      i = this.shouldUpdate(s), i ? (this.willUpdate(s), (e = this._$EO) == null || e.forEach((a) => {
        var r;
        return (r = a.hostUpdate) == null ? void 0 : r.call(a);
      }), this.update(s)) : this._$EU();
    } catch (a) {
      throw i = !1, this._$EU(), a;
    }
    i && this._$AE(s);
  }
  willUpdate(i) {
  }
  _$AE(i) {
    var s;
    (s = this._$EO) == null || s.forEach((e) => {
      var a;
      return (a = e.hostUpdated) == null ? void 0 : a.call(e);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(i)), this.updated(i);
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
  shouldUpdate(i) {
    return !0;
  }
  update(i) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((s) => this._$EC(s, this[s]))), this._$EU();
  }
  updated(i) {
  }
  firstUpdated(i) {
  }
}
lt.elementStyles = [], lt.shadowRootOptions = { mode: "open" }, lt[Pt("elementProperties")] = /* @__PURE__ */ new Map(), lt[Pt("finalized")] = /* @__PURE__ */ new Map(), fi == null || fi({ ReactiveElement: lt }), (Z.reactiveElementVersions ?? (Z.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = globalThis, ii = It.trustedTypes, Bi = ii ? ii.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ys = "$lit$", J = `lit$${(Math.random() + "").slice(9)}$`, gs = "?" + J, ha = `<${gs}>`, ht = document, kt = () => ht.createComment(""), Gt = (t) => t === null || typeof t != "object" && typeof t != "function", _s = Array.isArray, na = (t) => _s(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", di = `[ 	
\f\r]`, Et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ji = /-->/g, Fi = />/g, et = RegExp(`>|${di}(?:([^\\s"'>=/]+)(${di}*=${di}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Hi = /'/g, Wi = /"/g, xs = /^(?:script|style|textarea|title)$/i, oa = (t) => (i, ...s) => ({ _$litType$: t, strings: i, values: s }), ct = oa(1), xt = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), Qi = /* @__PURE__ */ new WeakMap(), rt = ht.createTreeWalker(ht, 129);
function bs(t, i) {
  if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Bi !== void 0 ? Bi.createHTML(i) : i;
}
const la = (t, i) => {
  const s = t.length - 1, e = [];
  let a, r = i === 2 ? "<svg>" : "", n = Et;
  for (let h = 0; h < s; h++) {
    const o = t[h];
    let l, u, c = -1, f = 0;
    for (; f < o.length && (n.lastIndex = f, u = n.exec(o), u !== null); ) f = n.lastIndex, n === Et ? u[1] === "!--" ? n = ji : u[1] !== void 0 ? n = Fi : u[2] !== void 0 ? (xs.test(u[2]) && (a = RegExp("</" + u[2], "g")), n = et) : u[3] !== void 0 && (n = et) : n === et ? u[0] === ">" ? (n = a ?? Et, c = -1) : u[1] === void 0 ? c = -2 : (c = n.lastIndex - u[2].length, l = u[1], n = u[3] === void 0 ? et : u[3] === '"' ? Wi : Hi) : n === Wi || n === Hi ? n = et : n === ji || n === Fi ? n = Et : (n = et, a = void 0);
    const d = n === et && t[h + 1].startsWith("/>") ? " " : "";
    r += n === Et ? o + ha : c >= 0 ? (e.push(l), o.slice(0, c) + ys + o.slice(c) + J + d) : o + J + (c === -2 ? h : d);
  }
  return [bs(t, r + (t[s] || "<?>") + (i === 2 ? "</svg>" : "")), e];
};
let xi = class ps {
  constructor({ strings: i, _$litType$: s }, e) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const h = i.length - 1, o = this.parts, [l, u] = la(i, s);
    if (this.el = ps.createElement(l, e), rt.currentNode = this.el.content, s === 2) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (a = rt.nextNode()) !== null && o.length < h; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const c of a.getAttributeNames()) if (c.endsWith(ys)) {
          const f = u[n++], d = a.getAttribute(c).split(J), v = /([.?@])?(.*)/.exec(f);
          o.push({ type: 1, index: r, name: v[2], strings: d, ctor: v[1] === "." ? ua : v[1] === "?" ? fa : v[1] === "@" ? da : oi }), a.removeAttribute(c);
        } else c.startsWith(J) && (o.push({ type: 6, index: r }), a.removeAttribute(c));
        if (xs.test(a.tagName)) {
          const c = a.textContent.split(J), f = c.length - 1;
          if (f > 0) {
            a.textContent = ii ? ii.emptyScript : "";
            for (let d = 0; d < f; d++) a.append(c[d], kt()), rt.nextNode(), o.push({ type: 2, index: ++r });
            a.append(c[f], kt());
          }
        }
      } else if (a.nodeType === 8) if (a.data === gs) o.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = a.data.indexOf(J, c + 1)) !== -1; ) o.push({ type: 7, index: r }), c += J.length - 1;
      }
      r++;
    }
  }
  static createElement(i, s) {
    const e = ht.createElement("template");
    return e.innerHTML = i, e;
  }
};
function bt(t, i, s = t, e) {
  var n, h;
  if (i === xt) return i;
  let a = e !== void 0 ? (n = s._$Co) == null ? void 0 : n[e] : s._$Cl;
  const r = Gt(i) ? void 0 : i._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== r && ((h = a == null ? void 0 : a._$AO) == null || h.call(a, !1), r === void 0 ? a = void 0 : (a = new r(t), a._$AT(t, s, e)), e !== void 0 ? (s._$Co ?? (s._$Co = []))[e] = a : s._$Cl = a), a !== void 0 && (i = bt(t, a._$AS(t, i.values), a, e)), i;
}
class ca {
  constructor(i, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = i, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(i) {
    const { el: { content: s }, parts: e } = this._$AD, a = ((i == null ? void 0 : i.creationScope) ?? ht).importNode(s, !0);
    rt.currentNode = a;
    let r = rt.nextNode(), n = 0, h = 0, o = e[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let l;
        o.type === 2 ? l = new Ci(r, r.nextSibling, this, i) : o.type === 1 ? l = new o.ctor(r, o.name, o.strings, this, i) : o.type === 6 && (l = new va(r, this, i)), this._$AV.push(l), o = e[++h];
      }
      n !== (o == null ? void 0 : o.index) && (r = rt.nextNode(), n++);
    }
    return rt.currentNode = ht, a;
  }
  p(i) {
    let s = 0;
    for (const e of this._$AV) e !== void 0 && (e.strings !== void 0 ? (e._$AI(i, e, s), s += e.strings.length - 2) : e._$AI(i[s])), s++;
  }
}
let Ci = class As {
  get _$AU() {
    var i;
    return ((i = this._$AM) == null ? void 0 : i._$AU) ?? this._$Cv;
  }
  constructor(i, s, e, a) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = i, this._$AB = s, this._$AM = e, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
  }
  get parentNode() {
    let i = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (i == null ? void 0 : i.nodeType) === 11 && (i = s.parentNode), i;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(i, s = this) {
    i = bt(this, i, s), Gt(i) ? i === T || i == null || i === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : i !== this._$AH && i !== xt && this._(i) : i._$litType$ !== void 0 ? this.$(i) : i.nodeType !== void 0 ? this.T(i) : na(i) ? this.k(i) : this._(i);
  }
  S(i) {
    return this._$AA.parentNode.insertBefore(i, this._$AB);
  }
  T(i) {
    this._$AH !== i && (this._$AR(), this._$AH = this.S(i));
  }
  _(i) {
    this._$AH !== T && Gt(this._$AH) ? this._$AA.nextSibling.data = i : this.T(ht.createTextNode(i)), this._$AH = i;
  }
  $(i) {
    var r;
    const { values: s, _$litType$: e } = i, a = typeof e == "number" ? this._$AC(i) : (e.el === void 0 && (e.el = xi.createElement(bs(e.h, e.h[0]), this.options)), e);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === a) this._$AH.p(s);
    else {
      const n = new ca(a, this), h = n.u(this.options);
      n.p(s), this.T(h), this._$AH = n;
    }
  }
  _$AC(i) {
    let s = Qi.get(i.strings);
    return s === void 0 && Qi.set(i.strings, s = new xi(i)), s;
  }
  k(i) {
    _s(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let e, a = 0;
    for (const r of i) a === s.length ? s.push(e = new As(this.S(kt()), this.S(kt()), this, this.options)) : e = s[a], e._$AI(r), a++;
    a < s.length && (this._$AR(e && e._$AB.nextSibling, a), s.length = a);
  }
  _$AR(i = this._$AA.nextSibling, s) {
    var e;
    for ((e = this._$AP) == null ? void 0 : e.call(this, !1, !0, s); i && i !== this._$AB; ) {
      const a = i.nextSibling;
      i.remove(), i = a;
    }
  }
  setConnected(i) {
    var s;
    this._$AM === void 0 && (this._$Cv = i, (s = this._$AP) == null || s.call(this, i));
  }
};
class oi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(i, s, e, a, r) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = i, this.name = s, this._$AM = a, this.options = r, e.length > 2 || e[0] !== "" || e[1] !== "" ? (this._$AH = Array(e.length - 1).fill(new String()), this.strings = e) : this._$AH = T;
  }
  _$AI(i, s = this, e, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) i = bt(this, i, s, 0), n = !Gt(i) || i !== this._$AH && i !== xt, n && (this._$AH = i);
    else {
      const h = i;
      let o, l;
      for (i = r[0], o = 0; o < r.length - 1; o++) l = bt(this, h[e + o], s, o), l === xt && (l = this._$AH[o]), n || (n = !Gt(l) || l !== this._$AH[o]), l === T ? i = T : i !== T && (i += (l ?? "") + r[o + 1]), this._$AH[o] = l;
    }
    n && !a && this.j(i);
  }
  j(i) {
    i === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, i ?? "");
  }
}
class ua extends oi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(i) {
    this.element[this.name] = i === T ? void 0 : i;
  }
}
class fa extends oi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(i) {
    this.element.toggleAttribute(this.name, !!i && i !== T);
  }
}
let da = class extends oi {
  constructor(i, s, e, a, r) {
    super(i, s, e, a, r), this.type = 5;
  }
  _$AI(i, s = this) {
    if ((i = bt(this, i, s, 0) ?? T) === xt) return;
    const e = this._$AH, a = i === T && e !== T || i.capture !== e.capture || i.once !== e.once || i.passive !== e.passive, r = i !== T && (e === T || a);
    a && this.element.removeEventListener(this.name, this, e), r && this.element.addEventListener(this.name, this, i), this._$AH = i;
  }
  handleEvent(i) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, i) : this._$AH.handleEvent(i);
  }
};
class va {
  constructor(i, s, e) {
    this.element = i, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = e;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(i) {
    bt(this, i);
  }
}
const vi = It.litHtmlPolyfillSupport;
vi == null || vi(xi, Ci), (It.litHtmlVersions ?? (It.litHtmlVersions = [])).push("3.1.2");
const Ma = (t, i, s) => {
  const e = (s == null ? void 0 : s.renderBefore) ?? i;
  let a = e._$litPart$;
  if (a === void 0) {
    const r = (s == null ? void 0 : s.renderBefore) ?? null;
    e._$litPart$ = a = new Ci(i.insertBefore(kt(), r), r, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class mt extends lt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const i = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = i.firstChild), i;
  }
  update(i) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(i), this._$Do = Ma(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var i;
    super.connectedCallback(), (i = this._$Do) == null || i.setConnected(!0);
  }
  disconnectedCallback() {
    var i;
    super.disconnectedCallback(), (i = this._$Do) == null || i.setConnected(!1);
  }
  render() {
    return xt;
  }
}
var vs;
mt._$litElement$ = !0, mt.finalized = !0, (vs = globalThis.litElementHydrateSupport) == null || vs.call(globalThis, { LitElement: mt });
const Mi = globalThis.litElementPolyfillSupport;
Mi == null || Mi({ LitElement: mt });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
function ma(t) {
  t("EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"), t("EPSG:4269", "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"), t("EPSG:3857", "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"), t.WGS84 = t["EPSG:4326"], t["EPSG:3785"] = t["EPSG:3857"], t.GOOGLE = t["EPSG:3857"], t["EPSG:900913"] = t["EPSG:3857"], t["EPSG:102113"] = t["EPSG:3857"];
}
var nt = 1, ot = 2, yt = 3, ya = 4, bi = 5, Vi = 6378137, ga = 6356752314e-3, Xi = 0.0066943799901413165, Ot = 484813681109536e-20, M = Math.PI / 2, _a = 0.16666666666666666, xa = 0.04722222222222222, ba = 0.022156084656084655, g = 1e-10, L = 0.017453292519943295, Q = 57.29577951308232, S = Math.PI / 4, zt = Math.PI * 2, O = 3.14159265359, D = {};
D.greenwich = 0;
D.lisbon = -9.131906111111;
D.paris = 2.337229166667;
D.bogota = -74.080916666667;
D.madrid = -3.687938888889;
D.rome = 12.452333333333;
D.bern = 7.439583333333;
D.jakarta = 106.807719444444;
D.ferro = -17.666666666667;
D.brussels = 4.367975;
D.stockholm = 18.058277777778;
D.athens = 23.7163375;
D.oslo = 10.722916666667;
const pa = {
  ft: { to_meter: 0.3048 },
  "us-ft": { to_meter: 1200 / 3937 }
};
var Ki = /[\s_\-\/\(\)]/g;
function tt(t, i) {
  if (t[i])
    return t[i];
  for (var s = Object.keys(t), e = i.toLowerCase().replace(Ki, ""), a = -1, r, n; ++a < s.length; )
    if (r = s[a], n = r.toLowerCase().replace(Ki, ""), n === e)
      return t[r];
}
function pi(t) {
  var i = {}, s = t.split("+").map(function(h) {
    return h.trim();
  }).filter(function(h) {
    return h;
  }).reduce(function(h, o) {
    var l = o.split("=");
    return l.push(!0), h[l[0].toLowerCase()] = l[1], h;
  }, {}), e, a, r, n = {
    proj: "projName",
    datum: "datumCode",
    rf: function(h) {
      i.rf = parseFloat(h);
    },
    lat_0: function(h) {
      i.lat0 = h * L;
    },
    lat_1: function(h) {
      i.lat1 = h * L;
    },
    lat_2: function(h) {
      i.lat2 = h * L;
    },
    lat_ts: function(h) {
      i.lat_ts = h * L;
    },
    lon_0: function(h) {
      i.long0 = h * L;
    },
    lon_1: function(h) {
      i.long1 = h * L;
    },
    lon_2: function(h) {
      i.long2 = h * L;
    },
    alpha: function(h) {
      i.alpha = parseFloat(h) * L;
    },
    gamma: function(h) {
      i.rectified_grid_angle = parseFloat(h);
    },
    lonc: function(h) {
      i.longc = h * L;
    },
    x_0: function(h) {
      i.x0 = parseFloat(h);
    },
    y_0: function(h) {
      i.y0 = parseFloat(h);
    },
    k_0: function(h) {
      i.k0 = parseFloat(h);
    },
    k: function(h) {
      i.k0 = parseFloat(h);
    },
    a: function(h) {
      i.a = parseFloat(h);
    },
    b: function(h) {
      i.b = parseFloat(h);
    },
    r: function(h) {
      i.a = i.b = parseFloat(h);
    },
    r_a: function() {
      i.R_A = !0;
    },
    zone: function(h) {
      i.zone = parseInt(h, 10);
    },
    south: function() {
      i.utmSouth = !0;
    },
    towgs84: function(h) {
      i.datum_params = h.split(",").map(function(o) {
        return parseFloat(o);
      });
    },
    to_meter: function(h) {
      i.to_meter = parseFloat(h);
    },
    units: function(h) {
      i.units = h;
      var o = tt(pa, h);
      o && (i.to_meter = o.to_meter);
    },
    from_greenwich: function(h) {
      i.from_greenwich = h * L;
    },
    pm: function(h) {
      var o = tt(D, h);
      i.from_greenwich = (o || parseFloat(h)) * L;
    },
    nadgrids: function(h) {
      h === "@null" ? i.datumCode = "none" : i.nadgrids = h;
    },
    axis: function(h) {
      var o = "ewnsud";
      h.length === 3 && o.indexOf(h.substr(0, 1)) !== -1 && o.indexOf(h.substr(1, 1)) !== -1 && o.indexOf(h.substr(2, 1)) !== -1 && (i.axis = h);
    },
    approx: function() {
      i.approx = !0;
    }
  };
  for (e in s)
    a = s[e], e in n ? (r = n[e], typeof r == "function" ? r(a) : i[r] = a) : i[e] = a;
  return typeof i.datumCode == "string" && i.datumCode !== "WGS84" && (i.datumCode = i.datumCode.toLowerCase()), i;
}
var Ut = 1, $s = 2, Es = 3, si = 4, Ss = 5, Ni = -1, Aa = /\s/, $a = /[A-Za-z]/, Ea = /[A-Za-z84_]/, li = /[,\]]/, ws = /[\d\.E\-\+]/;
function K(t) {
  if (typeof t != "string")
    throw new Error("not a string");
  this.text = t.trim(), this.level = 0, this.place = 0, this.root = null, this.stack = [], this.currentObject = null, this.state = Ut;
}
K.prototype.readCharicter = function() {
  var t = this.text[this.place++];
  if (this.state !== si)
    for (; Aa.test(t); ) {
      if (this.place >= this.text.length)
        return;
      t = this.text[this.place++];
    }
  switch (this.state) {
    case Ut:
      return this.neutral(t);
    case $s:
      return this.keyword(t);
    case si:
      return this.quoted(t);
    case Ss:
      return this.afterquote(t);
    case Es:
      return this.number(t);
    case Ni:
      return;
  }
};
K.prototype.afterquote = function(t) {
  if (t === '"') {
    this.word += '"', this.state = si;
    return;
  }
  if (li.test(t)) {
    this.word = this.word.trim(), this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in afterquote yet, index ' + this.place);
};
K.prototype.afterItem = function(t) {
  if (t === ",") {
    this.word !== null && this.currentObject.push(this.word), this.word = null, this.state = Ut;
    return;
  }
  if (t === "]") {
    this.level--, this.word !== null && (this.currentObject.push(this.word), this.word = null), this.state = Ut, this.currentObject = this.stack.pop(), this.currentObject || (this.state = Ni);
    return;
  }
};
K.prototype.number = function(t) {
  if (ws.test(t)) {
    this.word += t;
    return;
  }
  if (li.test(t)) {
    this.word = parseFloat(this.word), this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in number yet, index ' + this.place);
};
K.prototype.quoted = function(t) {
  if (t === '"') {
    this.state = Ss;
    return;
  }
  this.word += t;
};
K.prototype.keyword = function(t) {
  if (Ea.test(t)) {
    this.word += t;
    return;
  }
  if (t === "[") {
    var i = [];
    i.push(this.word), this.level++, this.root === null ? this.root = i : this.currentObject.push(i), this.stack.push(this.currentObject), this.currentObject = i, this.state = Ut;
    return;
  }
  if (li.test(t)) {
    this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in keyword yet, index ' + this.place);
};
K.prototype.neutral = function(t) {
  if ($a.test(t)) {
    this.word = t, this.state = $s;
    return;
  }
  if (t === '"') {
    this.word = "", this.state = si;
    return;
  }
  if (ws.test(t)) {
    this.word = t, this.state = Es;
    return;
  }
  if (li.test(t)) {
    this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in neutral yet, index ' + this.place);
};
K.prototype.output = function() {
  for (; this.place < this.text.length; )
    this.readCharicter();
  if (this.state === Ni)
    return this.root;
  throw new Error('unable to parse string "' + this.text + '". State is ' + this.state);
};
function Sa(t) {
  var i = new K(t);
  return i.output();
}
function Ji(t, i, s) {
  Array.isArray(i) && (s.unshift(i), i = null);
  var e = i ? {} : t, a = s.reduce(function(r, n) {
    return ft(n, r), r;
  }, e);
  i && (t[i] = a);
}
function ft(t, i) {
  if (!Array.isArray(t)) {
    i[t] = !0;
    return;
  }
  var s = t.shift();
  if (s === "PARAMETER" && (s = t.shift()), t.length === 1) {
    if (Array.isArray(t[0])) {
      i[s] = {}, ft(t[0], i[s]);
      return;
    }
    i[s] = t[0];
    return;
  }
  if (!t.length) {
    i[s] = !0;
    return;
  }
  if (s === "TOWGS84") {
    i[s] = t;
    return;
  }
  if (s === "AXIS") {
    s in i || (i[s] = []), i[s].push(t);
    return;
  }
  Array.isArray(s) || (i[s] = {});
  var e;
  switch (s) {
    case "UNIT":
    case "PRIMEM":
    case "VERT_DATUM":
      i[s] = {
        name: t[0].toLowerCase(),
        convert: t[1]
      }, t.length === 3 && ft(t[2], i[s]);
      return;
    case "SPHEROID":
    case "ELLIPSOID":
      i[s] = {
        name: t[0],
        a: t[1],
        rf: t[2]
      }, t.length === 4 && ft(t[3], i[s]);
      return;
    case "PROJECTEDCRS":
    case "PROJCRS":
    case "GEOGCS":
    case "GEOCCS":
    case "PROJCS":
    case "LOCAL_CS":
    case "GEODCRS":
    case "GEODETICCRS":
    case "GEODETICDATUM":
    case "EDATUM":
    case "ENGINEERINGDATUM":
    case "VERT_CS":
    case "VERTCRS":
    case "VERTICALCRS":
    case "COMPD_CS":
    case "COMPOUNDCRS":
    case "ENGINEERINGCRS":
    case "ENGCRS":
    case "FITTED_CS":
    case "LOCAL_DATUM":
    case "DATUM":
      t[0] = ["name", t[0]], Ji(i, s, t);
      return;
    default:
      for (e = -1; ++e < t.length; )
        if (!Array.isArray(t[e]))
          return ft(t, i[s]);
      return Ji(i, s, t);
  }
}
var wa = 0.017453292519943295;
function Ca(t, i) {
  var s = i[0], e = i[1];
  !(s in t) && e in t && (t[s] = t[e], i.length === 3 && (t[s] = i[2](t[s])));
}
function W(t) {
  return t * wa;
}
function Na(t) {
  if (t.type === "GEOGCS" ? t.projName = "longlat" : t.type === "LOCAL_CS" ? (t.projName = "identity", t.local = !0) : typeof t.PROJECTION == "object" ? t.projName = Object.keys(t.PROJECTION)[0] : t.projName = t.PROJECTION, t.AXIS) {
    for (var i = "", s = 0, e = t.AXIS.length; s < e; ++s) {
      var a = [t.AXIS[s][0].toLowerCase(), t.AXIS[s][1].toLowerCase()];
      a[0].indexOf("north") !== -1 || (a[0] === "y" || a[0] === "lat") && a[1] === "north" ? i += "n" : a[0].indexOf("south") !== -1 || (a[0] === "y" || a[0] === "lat") && a[1] === "south" ? i += "s" : a[0].indexOf("east") !== -1 || (a[0] === "x" || a[0] === "lon") && a[1] === "east" ? i += "e" : (a[0].indexOf("west") !== -1 || (a[0] === "x" || a[0] === "lon") && a[1] === "west") && (i += "w");
    }
    i.length === 2 && (i += "u"), i.length === 3 && (t.axis = i);
  }
  t.UNIT && (t.units = t.UNIT.name.toLowerCase(), t.units === "metre" && (t.units = "meter"), t.UNIT.convert && (t.type === "GEOGCS" ? t.DATUM && t.DATUM.SPHEROID && (t.to_meter = t.UNIT.convert * t.DATUM.SPHEROID.a) : t.to_meter = t.UNIT.convert));
  var r = t.GEOGCS;
  t.type === "GEOGCS" && (r = t), r && (r.DATUM ? t.datumCode = r.DATUM.name.toLowerCase() : t.datumCode = r.name.toLowerCase(), t.datumCode.slice(0, 2) === "d_" && (t.datumCode = t.datumCode.slice(2)), (t.datumCode === "new_zealand_geodetic_datum_1949" || t.datumCode === "new_zealand_1949") && (t.datumCode = "nzgd49"), (t.datumCode === "wgs_1984" || t.datumCode === "world_geodetic_system_1984") && (t.PROJECTION === "Mercator_Auxiliary_Sphere" && (t.sphere = !0), t.datumCode = "wgs84"), t.datumCode.slice(-6) === "_ferro" && (t.datumCode = t.datumCode.slice(0, -6)), t.datumCode.slice(-8) === "_jakarta" && (t.datumCode = t.datumCode.slice(0, -8)), ~t.datumCode.indexOf("belge") && (t.datumCode = "rnb72"), r.DATUM && r.DATUM.SPHEROID && (t.ellps = r.DATUM.SPHEROID.name.replace("_19", "").replace(/[Cc]larke\_18/, "clrk"), t.ellps.toLowerCase().slice(0, 13) === "international" && (t.ellps = "intl"), t.a = r.DATUM.SPHEROID.a, t.rf = parseFloat(r.DATUM.SPHEROID.rf, 10)), r.DATUM && r.DATUM.TOWGS84 && (t.datum_params = r.DATUM.TOWGS84), ~t.datumCode.indexOf("osgb_1936") && (t.datumCode = "osgb36"), ~t.datumCode.indexOf("osni_1952") && (t.datumCode = "osni52"), (~t.datumCode.indexOf("tm65") || ~t.datumCode.indexOf("geodetic_datum_of_1965")) && (t.datumCode = "ire65"), t.datumCode === "ch1903+" && (t.datumCode = "ch1903"), ~t.datumCode.indexOf("israel") && (t.datumCode = "isr93")), t.b && !isFinite(t.b) && (t.b = t.a);
  function n(l) {
    var u = t.to_meter || 1;
    return l * u;
  }
  var h = function(l) {
    return Ca(t, l);
  }, o = [
    ["standard_parallel_1", "Standard_Parallel_1"],
    ["standard_parallel_1", "Latitude of 1st standard parallel"],
    ["standard_parallel_2", "Standard_Parallel_2"],
    ["standard_parallel_2", "Latitude of 2nd standard parallel"],
    ["false_easting", "False_Easting"],
    ["false_easting", "False easting"],
    ["false-easting", "Easting at false origin"],
    ["false_northing", "False_Northing"],
    ["false_northing", "False northing"],
    ["false_northing", "Northing at false origin"],
    ["central_meridian", "Central_Meridian"],
    ["central_meridian", "Longitude of natural origin"],
    ["central_meridian", "Longitude of false origin"],
    ["latitude_of_origin", "Latitude_Of_Origin"],
    ["latitude_of_origin", "Central_Parallel"],
    ["latitude_of_origin", "Latitude of natural origin"],
    ["latitude_of_origin", "Latitude of false origin"],
    ["scale_factor", "Scale_Factor"],
    ["k0", "scale_factor"],
    ["latitude_of_center", "Latitude_Of_Center"],
    ["latitude_of_center", "Latitude_of_center"],
    ["lat0", "latitude_of_center", W],
    ["longitude_of_center", "Longitude_Of_Center"],
    ["longitude_of_center", "Longitude_of_center"],
    ["longc", "longitude_of_center", W],
    ["x0", "false_easting", n],
    ["y0", "false_northing", n],
    ["long0", "central_meridian", W],
    ["lat0", "latitude_of_origin", W],
    ["lat0", "standard_parallel_1", W],
    ["lat1", "standard_parallel_1", W],
    ["lat2", "standard_parallel_2", W],
    ["azimuth", "Azimuth"],
    ["alpha", "azimuth", W],
    ["srsCode", "name"]
  ];
  o.forEach(h), !t.long0 && t.longc && (t.projName === "Albers_Conic_Equal_Area" || t.projName === "Lambert_Azimuthal_Equal_Area") && (t.long0 = t.longc), !t.lat_ts && t.lat1 && (t.projName === "Stereographic_South_Pole" || t.projName === "Polar Stereographic (variant B)") ? (t.lat0 = W(t.lat1 > 0 ? 90 : -90), t.lat_ts = t.lat1) : !t.lat_ts && t.lat0 && t.projName === "Polar_Stereographic" && (t.lat_ts = t.lat0, t.lat0 = W(t.lat0 > 0 ? 90 : -90));
}
function Cs(t) {
  var i = Sa(t), s = i.shift(), e = i.shift();
  i.unshift(["name", e]), i.unshift(["type", s]);
  var a = {};
  return ft(i, a), Na(a), a;
}
function k(t) {
  var i = this;
  if (arguments.length === 2) {
    var s = arguments[1];
    typeof s == "string" ? s.charAt(0) === "+" ? k[t] = pi(arguments[1]) : k[t] = Cs(arguments[1]) : k[t] = s;
  } else if (arguments.length === 1) {
    if (Array.isArray(t))
      return t.map(function(e) {
        Array.isArray(e) ? k.apply(i, e) : k(e);
      });
    if (typeof t == "string") {
      if (t in k)
        return k[t];
    } else "EPSG" in t ? k["EPSG:" + t.EPSG] = t : "ESRI" in t ? k["ESRI:" + t.ESRI] = t : "IAU2000" in t ? k["IAU2000:" + t.IAU2000] = t : console.log(t);
    return;
  }
}
ma(k);
function Pa(t) {
  return typeof t == "string";
}
function Ia(t) {
  return t in k;
}
var Oa = ["PROJECTEDCRS", "PROJCRS", "GEOGCS", "GEOCCS", "PROJCS", "LOCAL_CS", "GEODCRS", "GEODETICCRS", "GEODETICDATUM", "ENGCRS", "ENGINEERINGCRS"];
function Ra(t) {
  return Oa.some(function(i) {
    return t.indexOf(i) > -1;
  });
}
var Ta = ["3857", "900913", "3785", "102113"];
function La(t) {
  var i = tt(t, "authority");
  if (i) {
    var s = tt(i, "epsg");
    return s && Ta.indexOf(s) > -1;
  }
}
function qa(t) {
  var i = tt(t, "extension");
  if (i)
    return tt(i, "proj4");
}
function ka(t) {
  return t[0] === "+";
}
function Ga(t) {
  if (Pa(t)) {
    if (Ia(t))
      return k[t];
    if (Ra(t)) {
      var i = Cs(t);
      if (La(i))
        return k["EPSG:3857"];
      var s = qa(i);
      return s ? pi(s) : i;
    }
    if (ka(t))
      return pi(t);
  } else
    return t;
}
function Zi(t, i) {
  t = t || {};
  var s, e;
  if (!i)
    return t;
  for (e in i)
    s = i[e], s !== void 0 && (t[e] = s);
  return t;
}
function X(t, i, s) {
  var e = t * i;
  return s / Math.sqrt(1 - e * e);
}
function Bt(t) {
  return t < 0 ? -1 : 1;
}
function _(t) {
  return Math.abs(t) <= O ? t : t - Bt(t) * zt;
}
function H(t, i, s) {
  var e = t * s, a = 0.5 * t;
  return e = Math.pow((1 - e) / (1 + e), a), Math.tan(0.5 * (M - i)) / e;
}
function Dt(t, i) {
  for (var s = 0.5 * t, e, a, r = M - 2 * Math.atan(i), n = 0; n <= 15; n++)
    if (e = t * Math.sin(r), a = M - 2 * Math.atan(i * Math.pow((1 - e) / (1 + e), s)) - r, r += a, Math.abs(a) <= 1e-10)
      return r;
  return -9999;
}
function za() {
  var t = this.b / this.a;
  this.es = 1 - t * t, "x0" in this || (this.x0 = 0), "y0" in this || (this.y0 = 0), this.e = Math.sqrt(this.es), this.lat_ts ? this.sphere ? this.k0 = Math.cos(this.lat_ts) : this.k0 = X(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) : this.k0 || (this.k ? this.k0 = this.k : this.k0 = 1);
}
function Ua(t) {
  var i = t.x, s = t.y;
  if (s * Q > 90 && s * Q < -90 && i * Q > 180 && i * Q < -180)
    return null;
  var e, a;
  if (Math.abs(Math.abs(s) - M) <= g)
    return null;
  if (this.sphere)
    e = this.x0 + this.a * this.k0 * _(i - this.long0), a = this.y0 + this.a * this.k0 * Math.log(Math.tan(S + 0.5 * s));
  else {
    var r = Math.sin(s), n = H(this.e, s, r);
    e = this.x0 + this.a * this.k0 * _(i - this.long0), a = this.y0 - this.a * this.k0 * Math.log(n);
  }
  return t.x = e, t.y = a, t;
}
function Da(t) {
  var i = t.x - this.x0, s = t.y - this.y0, e, a;
  if (this.sphere)
    a = M - 2 * Math.atan(Math.exp(-s / (this.a * this.k0)));
  else {
    var r = Math.exp(-s / (this.a * this.k0));
    if (a = Dt(this.e, r), a === -9999)
      return null;
  }
  return e = _(this.long0 + i / (this.a * this.k0)), t.x = e, t.y = a, t;
}
var Ba = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
const ja = {
  init: za,
  forward: Ua,
  inverse: Da,
  names: Ba
};
function Fa() {
}
function Yi(t) {
  return t;
}
var Ha = ["longlat", "identity"];
const Wa = {
  init: Fa,
  forward: Yi,
  inverse: Yi,
  names: Ha
};
var Qa = [ja, Wa], Zt = {}, ai = [];
function Ns(t, i) {
  var s = ai.length;
  return t.names ? (ai[s] = t, t.names.forEach(function(e) {
    Zt[e.toLowerCase()] = s;
  }), this) : (console.log(i), !0);
}
function Va(t) {
  if (!t)
    return !1;
  var i = t.toLowerCase();
  if (typeof Zt[i] < "u" && ai[Zt[i]])
    return ai[Zt[i]];
}
function Xa() {
  Qa.forEach(Ns);
}
const Ka = {
  start: Xa,
  add: Ns,
  get: Va
};
var A = {};
A.MERIT = {
  a: 6378137,
  rf: 298.257,
  ellipseName: "MERIT 1983"
};
A.SGS85 = {
  a: 6378136,
  rf: 298.257,
  ellipseName: "Soviet Geodetic System 85"
};
A.GRS80 = {
  a: 6378137,
  rf: 298.257222101,
  ellipseName: "GRS 1980(IUGG, 1980)"
};
A.IAU76 = {
  a: 6378140,
  rf: 298.257,
  ellipseName: "IAU 1976"
};
A.airy = {
  a: 6377563396e-3,
  b: 635625691e-2,
  ellipseName: "Airy 1830"
};
A.APL4 = {
  a: 6378137,
  rf: 298.25,
  ellipseName: "Appl. Physics. 1965"
};
A.NWL9D = {
  a: 6378145,
  rf: 298.25,
  ellipseName: "Naval Weapons Lab., 1965"
};
A.mod_airy = {
  a: 6377340189e-3,
  b: 6356034446e-3,
  ellipseName: "Modified Airy"
};
A.andrae = {
  a: 637710443e-2,
  rf: 300,
  ellipseName: "Andrae 1876 (Den., Iclnd.)"
};
A.aust_SA = {
  a: 6378160,
  rf: 298.25,
  ellipseName: "Australian Natl & S. Amer. 1969"
};
A.GRS67 = {
  a: 6378160,
  rf: 298.247167427,
  ellipseName: "GRS 67(IUGG 1967)"
};
A.bessel = {
  a: 6377397155e-3,
  rf: 299.1528128,
  ellipseName: "Bessel 1841"
};
A.bess_nam = {
  a: 6377483865e-3,
  rf: 299.1528128,
  ellipseName: "Bessel 1841 (Namibia)"
};
A.clrk66 = {
  a: 63782064e-1,
  b: 63565838e-1,
  ellipseName: "Clarke 1866"
};
A.clrk80 = {
  a: 6378249145e-3,
  rf: 293.4663,
  ellipseName: "Clarke 1880 mod."
};
A.clrk80ign = {
  a: 63782492e-1,
  b: 6356515,
  rf: 293.4660213,
  ellipseName: "Clarke 1880 (IGN)"
};
A.clrk58 = {
  a: 6378293645208759e-9,
  rf: 294.2606763692654,
  ellipseName: "Clarke 1858"
};
A.CPM = {
  a: 63757387e-1,
  rf: 334.29,
  ellipseName: "Comm. des Poids et Mesures 1799"
};
A.delmbr = {
  a: 6376428,
  rf: 311.5,
  ellipseName: "Delambre 1810 (Belgium)"
};
A.engelis = {
  a: 637813605e-2,
  rf: 298.2566,
  ellipseName: "Engelis 1985"
};
A.evrst30 = {
  a: 6377276345e-3,
  rf: 300.8017,
  ellipseName: "Everest 1830"
};
A.evrst48 = {
  a: 6377304063e-3,
  rf: 300.8017,
  ellipseName: "Everest 1948"
};
A.evrst56 = {
  a: 6377301243e-3,
  rf: 300.8017,
  ellipseName: "Everest 1956"
};
A.evrst69 = {
  a: 6377295664e-3,
  rf: 300.8017,
  ellipseName: "Everest 1969"
};
A.evrstSS = {
  a: 6377298556e-3,
  rf: 300.8017,
  ellipseName: "Everest (Sabah & Sarawak)"
};
A.fschr60 = {
  a: 6378166,
  rf: 298.3,
  ellipseName: "Fischer (Mercury Datum) 1960"
};
A.fschr60m = {
  a: 6378155,
  rf: 298.3,
  ellipseName: "Fischer 1960"
};
A.fschr68 = {
  a: 6378150,
  rf: 298.3,
  ellipseName: "Fischer 1968"
};
A.helmert = {
  a: 6378200,
  rf: 298.3,
  ellipseName: "Helmert 1906"
};
A.hough = {
  a: 6378270,
  rf: 297,
  ellipseName: "Hough"
};
A.intl = {
  a: 6378388,
  rf: 297,
  ellipseName: "International 1909 (Hayford)"
};
A.kaula = {
  a: 6378163,
  rf: 298.24,
  ellipseName: "Kaula 1961"
};
A.lerch = {
  a: 6378139,
  rf: 298.257,
  ellipseName: "Lerch 1979"
};
A.mprts = {
  a: 6397300,
  rf: 191,
  ellipseName: "Maupertius 1738"
};
A.new_intl = {
  a: 63781575e-1,
  b: 63567722e-1,
  ellipseName: "New International 1967"
};
A.plessis = {
  a: 6376523,
  rf: 6355863,
  ellipseName: "Plessis 1817 (France)"
};
A.krass = {
  a: 6378245,
  rf: 298.3,
  ellipseName: "Krassovsky, 1942"
};
A.SEasia = {
  a: 6378155,
  b: 63567733205e-4,
  ellipseName: "Southeast Asia"
};
A.walbeck = {
  a: 6376896,
  b: 63558348467e-4,
  ellipseName: "Walbeck"
};
A.WGS60 = {
  a: 6378165,
  rf: 298.3,
  ellipseName: "WGS 60"
};
A.WGS66 = {
  a: 6378145,
  rf: 298.25,
  ellipseName: "WGS 66"
};
A.WGS7 = {
  a: 6378135,
  rf: 298.26,
  ellipseName: "WGS 72"
};
var Ja = A.WGS84 = {
  a: 6378137,
  rf: 298.257223563,
  ellipseName: "WGS 84"
};
A.sphere = {
  a: 6370997,
  b: 6370997,
  ellipseName: "Normal Sphere (r=6370997)"
};
function Za(t, i, s, e) {
  var a = t * t, r = i * i, n = (a - r) / a, h = 0;
  e ? (t *= 1 - n * (_a + n * (xa + n * ba)), a = t * t, n = 0) : h = Math.sqrt(n);
  var o = (a - r) / r;
  return {
    es: n,
    e: h,
    ep2: o
  };
}
function Ya(t, i, s, e, a) {
  if (!t) {
    var r = tt(A, e);
    r || (r = Ja), t = r.a, i = r.b, s = r.rf;
  }
  return s && !i && (i = (1 - 1 / s) * t), (s === 0 || Math.abs(t - i) < g) && (a = !0, i = t), {
    a: t,
    b: i,
    rf: s,
    sphere: a
  };
}
var R = {};
R.wgs84 = {
  towgs84: "0,0,0",
  ellipse: "WGS84",
  datumName: "WGS84"
};
R.ch1903 = {
  towgs84: "674.374,15.056,405.346",
  ellipse: "bessel",
  datumName: "swiss"
};
R.ggrs87 = {
  towgs84: "-199.87,74.79,246.62",
  ellipse: "GRS80",
  datumName: "Greek_Geodetic_Reference_System_1987"
};
R.nad83 = {
  towgs84: "0,0,0",
  ellipse: "GRS80",
  datumName: "North_American_Datum_1983"
};
R.nad27 = {
  nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
  ellipse: "clrk66",
  datumName: "North_American_Datum_1927"
};
R.potsdam = {
  towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
  ellipse: "bessel",
  datumName: "Potsdam Rauenberg 1950 DHDN"
};
R.carthage = {
  towgs84: "-263.0,6.0,431.0",
  ellipse: "clark80",
  datumName: "Carthage 1934 Tunisia"
};
R.hermannskogel = {
  towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
  ellipse: "bessel",
  datumName: "Hermannskogel"
};
R.militargeographische_institut = {
  towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
  ellipse: "bessel",
  datumName: "Militar-Geographische Institut"
};
R.osni52 = {
  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
  ellipse: "airy",
  datumName: "Irish National"
};
R.ire65 = {
  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
  ellipse: "mod_airy",
  datumName: "Ireland 1965"
};
R.rassadiran = {
  towgs84: "-133.63,-157.5,-158.62",
  ellipse: "intl",
  datumName: "Rassadiran"
};
R.nzgd49 = {
  towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
  ellipse: "intl",
  datumName: "New Zealand Geodetic Datum 1949"
};
R.osgb36 = {
  towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
  ellipse: "airy",
  datumName: "Airy 1830"
};
R.s_jtsk = {
  towgs84: "589,76,480",
  ellipse: "bessel",
  datumName: "S-JTSK (Ferro)"
};
R.beduaram = {
  towgs84: "-106,-87,188",
  ellipse: "clrk80",
  datumName: "Beduaram"
};
R.gunung_segara = {
  towgs84: "-403,684,41",
  ellipse: "bessel",
  datumName: "Gunung Segara Jakarta"
};
R.rnb72 = {
  towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
  ellipse: "intl",
  datumName: "Reseau National Belge 1972"
};
function te(t, i, s, e, a, r, n) {
  var h = {};
  return t === void 0 || t === "none" ? h.datum_type = bi : h.datum_type = ya, i && (h.datum_params = i.map(parseFloat), (h.datum_params[0] !== 0 || h.datum_params[1] !== 0 || h.datum_params[2] !== 0) && (h.datum_type = nt), h.datum_params.length > 3 && (h.datum_params[3] !== 0 || h.datum_params[4] !== 0 || h.datum_params[5] !== 0 || h.datum_params[6] !== 0) && (h.datum_type = ot, h.datum_params[3] *= Ot, h.datum_params[4] *= Ot, h.datum_params[5] *= Ot, h.datum_params[6] = h.datum_params[6] / 1e6 + 1)), n && (h.datum_type = yt, h.grids = n), h.a = s, h.b = e, h.es = a, h.ep2 = r, h;
}
var Ps = {};
function ie(t, i) {
  var s = new DataView(i), e = ee(s), a = re(s, e), r = he(s, a, e), n = { header: a, subgrids: r };
  return Ps[t] = n, n;
}
function se(t) {
  if (t === void 0)
    return null;
  var i = t.split(",");
  return i.map(ae);
}
function ae(t) {
  if (t.length === 0)
    return null;
  var i = t[0] === "@";
  return i && (t = t.slice(1)), t === "null" ? { name: "null", mandatory: !i, grid: null, isNull: !0 } : {
    name: t,
    mandatory: !i,
    grid: Ps[t] || null,
    isNull: !1
  };
}
function dt(t) {
  return t / 3600 * Math.PI / 180;
}
function ee(t) {
  var i = t.getInt32(8, !1);
  return i === 11 ? !1 : (i = t.getInt32(8, !0), i !== 11 && console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"), !0);
}
function re(t, i) {
  return {
    nFields: t.getInt32(8, i),
    nSubgridFields: t.getInt32(24, i),
    nSubgrids: t.getInt32(40, i),
    shiftType: Ai(t, 56, 64).trim(),
    fromSemiMajorAxis: t.getFloat64(120, i),
    fromSemiMinorAxis: t.getFloat64(136, i),
    toSemiMajorAxis: t.getFloat64(152, i),
    toSemiMinorAxis: t.getFloat64(168, i)
  };
}
function Ai(t, i, s) {
  return String.fromCharCode.apply(null, new Uint8Array(t.buffer.slice(i, s)));
}
function he(t, i, s) {
  for (var e = 176, a = [], r = 0; r < i.nSubgrids; r++) {
    var n = oe(t, e, s), h = le(t, e, n, s), o = Math.round(
      1 + (n.upperLongitude - n.lowerLongitude) / n.longitudeInterval
    ), l = Math.round(
      1 + (n.upperLatitude - n.lowerLatitude) / n.latitudeInterval
    );
    a.push({
      ll: [dt(n.lowerLongitude), dt(n.lowerLatitude)],
      del: [dt(n.longitudeInterval), dt(n.latitudeInterval)],
      lim: [o, l],
      count: n.gridNodeCount,
      cvs: ne(h)
    }), e += 176 + n.gridNodeCount * 16;
  }
  return a;
}
function ne(t) {
  return t.map(function(i) {
    return [dt(i.longitudeShift), dt(i.latitudeShift)];
  });
}
function oe(t, i, s) {
  return {
    name: Ai(t, i + 8, i + 16).trim(),
    parent: Ai(t, i + 24, i + 24 + 8).trim(),
    lowerLatitude: t.getFloat64(i + 72, s),
    upperLatitude: t.getFloat64(i + 88, s),
    lowerLongitude: t.getFloat64(i + 104, s),
    upperLongitude: t.getFloat64(i + 120, s),
    latitudeInterval: t.getFloat64(i + 136, s),
    longitudeInterval: t.getFloat64(i + 152, s),
    gridNodeCount: t.getInt32(i + 168, s)
  };
}
function le(t, i, s, e) {
  for (var a = i + 176, r = 16, n = [], h = 0; h < s.gridNodeCount; h++) {
    var o = {
      latitudeShift: t.getFloat32(a + h * r, e),
      longitudeShift: t.getFloat32(a + h * r + 4, e),
      latitudeAccuracy: t.getFloat32(a + h * r + 8, e),
      longitudeAccuracy: t.getFloat32(a + h * r + 12, e)
    };
    n.push(o);
  }
  return n;
}
function V(t, i) {
  if (!(this instanceof V))
    return new V(t);
  i = i || function(l) {
    if (l)
      throw l;
  };
  var s = Ga(t);
  if (typeof s != "object") {
    i(t);
    return;
  }
  var e = V.projections.get(s.projName);
  if (!e) {
    i(t);
    return;
  }
  if (s.datumCode && s.datumCode !== "none") {
    var a = tt(R, s.datumCode);
    a && (s.datum_params = s.datum_params || (a.towgs84 ? a.towgs84.split(",") : null), s.ellps = a.ellipse, s.datumName = a.datumName ? a.datumName : s.datumCode);
  }
  s.k0 = s.k0 || 1, s.axis = s.axis || "enu", s.ellps = s.ellps || "wgs84", s.lat1 = s.lat1 || s.lat0;
  var r = Ya(s.a, s.b, s.rf, s.ellps, s.sphere), n = Za(r.a, r.b, r.rf, s.R_A), h = se(s.nadgrids), o = s.datum || te(
    s.datumCode,
    s.datum_params,
    r.a,
    r.b,
    n.es,
    n.ep2,
    h
  );
  Zi(this, s), Zi(this, e), this.a = r.a, this.b = r.b, this.rf = r.rf, this.sphere = r.sphere, this.es = n.es, this.e = n.e, this.ep2 = n.ep2, this.datum = o, this.init(), i(null, this);
}
V.projections = Ka;
V.projections.start();
function ce(t, i) {
  return t.datum_type !== i.datum_type || t.a !== i.a || Math.abs(t.es - i.es) > 5e-11 ? !1 : t.datum_type === nt ? t.datum_params[0] === i.datum_params[0] && t.datum_params[1] === i.datum_params[1] && t.datum_params[2] === i.datum_params[2] : t.datum_type === ot ? t.datum_params[0] === i.datum_params[0] && t.datum_params[1] === i.datum_params[1] && t.datum_params[2] === i.datum_params[2] && t.datum_params[3] === i.datum_params[3] && t.datum_params[4] === i.datum_params[4] && t.datum_params[5] === i.datum_params[5] && t.datum_params[6] === i.datum_params[6] : !0;
}
function Is(t, i, s) {
  var e = t.x, a = t.y, r = t.z ? t.z : 0, n, h, o, l;
  if (a < -M && a > -1.001 * M)
    a = -M;
  else if (a > M && a < 1.001 * M)
    a = M;
  else {
    if (a < -M)
      return { x: -1 / 0, y: -1 / 0, z: t.z };
    if (a > M)
      return { x: 1 / 0, y: 1 / 0, z: t.z };
  }
  return e > Math.PI && (e -= 2 * Math.PI), h = Math.sin(a), l = Math.cos(a), o = h * h, n = s / Math.sqrt(1 - i * o), {
    x: (n + r) * l * Math.cos(e),
    y: (n + r) * l * Math.sin(e),
    z: (n * (1 - i) + r) * h
  };
}
function Os(t, i, s, e) {
  var a = 1e-12, r = a * a, n = 30, h, o, l, u, c, f, d, v, m, y, x, p, $, C = t.x, E = t.y, b = t.z ? t.z : 0, P, N, B;
  if (h = Math.sqrt(C * C + E * E), o = Math.sqrt(C * C + E * E + b * b), h / s < a) {
    if (P = 0, o / s < a)
      return N = M, B = -e, {
        x: t.x,
        y: t.y,
        z: t.z
      };
  } else
    P = Math.atan2(E, C);
  l = b / o, u = h / o, c = 1 / Math.sqrt(1 - i * (2 - i) * u * u), v = u * (1 - i) * c, m = l * c, $ = 0;
  do
    $++, d = s / Math.sqrt(1 - i * m * m), B = h * v + b * m - d * (1 - i * m * m), f = i * d / (d + B), c = 1 / Math.sqrt(1 - f * (2 - f) * u * u), y = u * (1 - f) * c, x = l * c, p = x * v - y * m, v = y, m = x;
  while (p * p > r && $ < n);
  return N = Math.atan(x / Math.abs(y)), {
    x: P,
    y: N,
    z: B
  };
}
function ue(t, i, s) {
  if (i === nt)
    return {
      x: t.x + s[0],
      y: t.y + s[1],
      z: t.z + s[2]
    };
  if (i === ot) {
    var e = s[0], a = s[1], r = s[2], n = s[3], h = s[4], o = s[5], l = s[6];
    return {
      x: l * (t.x - o * t.y + h * t.z) + e,
      y: l * (o * t.x + t.y - n * t.z) + a,
      z: l * (-h * t.x + n * t.y + t.z) + r
    };
  }
}
function fe(t, i, s) {
  if (i === nt)
    return {
      x: t.x - s[0],
      y: t.y - s[1],
      z: t.z - s[2]
    };
  if (i === ot) {
    var e = s[0], a = s[1], r = s[2], n = s[3], h = s[4], o = s[5], l = s[6], u = (t.x - e) / l, c = (t.y - a) / l, f = (t.z - r) / l;
    return {
      x: u + o * c - h * f,
      y: -o * u + c + n * f,
      z: h * u - n * c + f
    };
  }
}
function Vt(t) {
  return t === nt || t === ot;
}
function de(t, i, s) {
  if (ce(t, i) || t.datum_type === bi || i.datum_type === bi)
    return s;
  var e = t.a, a = t.es;
  if (t.datum_type === yt) {
    var r = ts(t, !1, s);
    if (r !== 0)
      return;
    e = Vi, a = Xi;
  }
  var n = i.a, h = i.b, o = i.es;
  if (i.datum_type === yt && (n = Vi, h = ga, o = Xi), a === o && e === n && !Vt(t.datum_type) && !Vt(i.datum_type))
    return s;
  if (s = Is(s, a, e), Vt(t.datum_type) && (s = ue(s, t.datum_type, t.datum_params)), Vt(i.datum_type) && (s = fe(s, i.datum_type, i.datum_params)), s = Os(s, o, n, h), i.datum_type === yt) {
    var l = ts(i, !0, s);
    if (l !== 0)
      return;
  }
  return s;
}
function ts(t, i, s) {
  if (t.grids === null || t.grids.length === 0)
    return console.log("Grid shift grids not found"), -1;
  var e = { x: -s.x, y: s.y }, a = { x: Number.NaN, y: Number.NaN }, r = [];
  t:
    for (var n = 0; n < t.grids.length; n++) {
      var h = t.grids[n];
      if (r.push(h.name), h.isNull) {
        a = e;
        break;
      }
      if (h.mandatory, h.grid === null) {
        if (h.mandatory)
          return console.log("Unable to find mandatory grid '" + h.name + "'"), -1;
        continue;
      }
      for (var o = h.grid.subgrids, l = 0, u = o.length; l < u; l++) {
        var c = o[l], f = (Math.abs(c.del[1]) + Math.abs(c.del[0])) / 1e4, d = c.ll[0] - f, v = c.ll[1] - f, m = c.ll[0] + (c.lim[0] - 1) * c.del[0] + f, y = c.ll[1] + (c.lim[1] - 1) * c.del[1] + f;
        if (!(v > e.y || d > e.x || y < e.y || m < e.x) && (a = ve(e, i, c), !isNaN(a.x)))
          break t;
      }
    }
  return isNaN(a.x) ? (console.log("Failed to find a grid shift table for location '" + -e.x * Q + " " + e.y * Q + " tried: '" + r + "'"), -1) : (s.x = -a.x, s.y = a.y, 0);
}
function ve(t, i, s) {
  var e = { x: Number.NaN, y: Number.NaN };
  if (isNaN(t.x))
    return e;
  var a = { x: t.x, y: t.y };
  a.x -= s.ll[0], a.y -= s.ll[1], a.x = _(a.x - Math.PI) + Math.PI;
  var r = is(a, s);
  if (i) {
    if (isNaN(r.x))
      return e;
    r.x = a.x - r.x, r.y = a.y - r.y;
    var n = 9, h = 1e-12, o, l;
    do {
      if (l = is(r, s), isNaN(l.x)) {
        console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
        break;
      }
      o = { x: a.x - (l.x + r.x), y: a.y - (l.y + r.y) }, r.x += o.x, r.y += o.y;
    } while (n-- && Math.abs(o.x) > h && Math.abs(o.y) > h);
    if (n < 0)
      return console.log("Inverse grid shift iterator failed to converge."), e;
    e.x = _(r.x + s.ll[0]), e.y = r.y + s.ll[1];
  } else
    isNaN(r.x) || (e.x = t.x + r.x, e.y = t.y + r.y);
  return e;
}
function is(t, i) {
  var s = { x: t.x / i.del[0], y: t.y / i.del[1] }, e = { x: Math.floor(s.x), y: Math.floor(s.y) }, a = { x: s.x - 1 * e.x, y: s.y - 1 * e.y }, r = { x: Number.NaN, y: Number.NaN }, n;
  if (e.x < 0 || e.x >= i.lim[0] || e.y < 0 || e.y >= i.lim[1])
    return r;
  n = e.y * i.lim[0] + e.x;
  var h = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n++;
  var o = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n += i.lim[0];
  var l = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n--;
  var u = { x: i.cvs[n][0], y: i.cvs[n][1] }, c = a.x * a.y, f = a.x * (1 - a.y), d = (1 - a.x) * (1 - a.y), v = (1 - a.x) * a.y;
  return r.x = d * h.x + f * o.x + v * u.x + c * l.x, r.y = d * h.y + f * o.y + v * u.y + c * l.y, r;
}
function ss(t, i, s) {
  var e = s.x, a = s.y, r = s.z || 0, n, h, o, l = {};
  for (o = 0; o < 3; o++)
    if (!(i && o === 2 && s.z === void 0))
      switch (o === 0 ? (n = e, "ew".indexOf(t.axis[o]) !== -1 ? h = "x" : h = "y") : o === 1 ? (n = a, "ns".indexOf(t.axis[o]) !== -1 ? h = "y" : h = "x") : (n = r, h = "z"), t.axis[o]) {
        case "e":
          l[h] = n;
          break;
        case "w":
          l[h] = -n;
          break;
        case "n":
          l[h] = n;
          break;
        case "s":
          l[h] = -n;
          break;
        case "u":
          s[h] !== void 0 && (l.z = n);
          break;
        case "d":
          s[h] !== void 0 && (l.z = -n);
          break;
        default:
          return null;
      }
  return l;
}
function Rs(t) {
  var i = {
    x: t[0],
    y: t[1]
  };
  return t.length > 2 && (i.z = t[2]), t.length > 3 && (i.m = t[3]), i;
}
function Me(t) {
  as(t.x), as(t.y);
}
function as(t) {
  if (typeof Number.isFinite == "function") {
    if (Number.isFinite(t))
      return;
    throw new TypeError("coordinates must be finite numbers");
  }
  if (typeof t != "number" || t !== t || !isFinite(t))
    throw new TypeError("coordinates must be finite numbers");
}
function me(t, i) {
  return (t.datum.datum_type === nt || t.datum.datum_type === ot || t.datum.datum_type === yt) && i.datumCode !== "WGS84" || (i.datum.datum_type === nt || i.datum.datum_type === ot || i.datum.datum_type === yt) && t.datumCode !== "WGS84";
}
function ei(t, i, s, e) {
  var a;
  Array.isArray(s) ? s = Rs(s) : s = {
    x: s.x,
    y: s.y,
    z: s.z,
    m: s.m
  };
  var r = s.z !== void 0;
  if (Me(s), t.datum && i.datum && me(t, i) && (a = new V("WGS84"), s = ei(t, a, s, e), t = a), e && t.axis !== "enu" && (s = ss(t, !1, s)), t.projName === "longlat")
    s = {
      x: s.x * L,
      y: s.y * L,
      z: s.z || 0
    };
  else if (t.to_meter && (s = {
    x: s.x * t.to_meter,
    y: s.y * t.to_meter,
    z: s.z || 0
  }), s = t.inverse(s), !s)
    return;
  if (t.from_greenwich && (s.x += t.from_greenwich), s = de(t.datum, i.datum, s), !!s)
    return i.from_greenwich && (s = {
      x: s.x - i.from_greenwich,
      y: s.y,
      z: s.z || 0
    }), i.projName === "longlat" ? s = {
      x: s.x * Q,
      y: s.y * Q,
      z: s.z || 0
    } : (s = i.forward(s), i.to_meter && (s = {
      x: s.x / i.to_meter,
      y: s.y / i.to_meter,
      z: s.z || 0
    })), e && i.axis !== "enu" ? ss(i, !0, s) : (s && !r && delete s.z, s);
}
var es = V("WGS84");
function mi(t, i, s, e) {
  var a, r, n;
  return Array.isArray(s) ? (a = ei(t, i, s, e) || { x: NaN, y: NaN }, s.length > 2 ? typeof t.name < "u" && t.name === "geocent" || typeof i.name < "u" && i.name === "geocent" ? typeof a.z == "number" ? [a.x, a.y, a.z].concat(s.splice(3)) : [a.x, a.y, s[2]].concat(s.splice(3)) : [a.x, a.y].concat(s.splice(2)) : [a.x, a.y]) : (r = ei(t, i, s, e), n = Object.keys(s), n.length === 2 || n.forEach(function(h) {
    if (typeof t.name < "u" && t.name === "geocent" || typeof i.name < "u" && i.name === "geocent") {
      if (h === "x" || h === "y" || h === "z")
        return;
    } else if (h === "x" || h === "y")
      return;
    r[h] = s[h];
  }), r);
}
function rs(t) {
  return t instanceof V ? t : t.oProj ? t.oProj : V(t);
}
function U(t, i, s) {
  t = rs(t);
  var e = !1, a;
  return typeof i > "u" ? (i = t, t = es, e = !0) : (typeof i.x < "u" || Array.isArray(i)) && (s = i, i = t, t = es, e = !0), i = rs(i), s ? mi(t, i, s) : (a = {
    forward: function(r, n) {
      return mi(t, i, r, n);
    },
    inverse: function(r, n) {
      return mi(i, t, r, n);
    }
  }, e && (a.oProj = i), a);
}
var hs = 6, Ts = "AJSAJS", Ls = "AFAFAF", vt = 65, z = 73, j = 79, wt = 86, Ct = 90;
const ye = {
  forward: qs,
  inverse: ge,
  toPoint: ks
};
function qs(t, i) {
  return i = i || 5, be(_e({
    lat: t[1],
    lon: t[0]
  }), i);
}
function ge(t) {
  var i = Pi(zs(t.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat, i.lon, i.lat] : [i.left, i.bottom, i.right, i.top];
}
function ks(t) {
  var i = Pi(zs(t.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat] : [(i.left + i.right) / 2, (i.top + i.bottom) / 2];
}
function yi(t) {
  return t * (Math.PI / 180);
}
function ns(t) {
  return 180 * (t / Math.PI);
}
function _e(t) {
  var i = t.lat, s = t.lon, e = 6378137, a = 669438e-8, r = 0.9996, n, h, o, l, u, c, f, d = yi(i), v = yi(s), m, y;
  y = Math.floor((s + 180) / 6) + 1, s === 180 && (y = 60), i >= 56 && i < 64 && s >= 3 && s < 12 && (y = 32), i >= 72 && i < 84 && (s >= 0 && s < 9 ? y = 31 : s >= 9 && s < 21 ? y = 33 : s >= 21 && s < 33 ? y = 35 : s >= 33 && s < 42 && (y = 37)), n = (y - 1) * 6 - 180 + 3, m = yi(n), h = a / (1 - a), o = e / Math.sqrt(1 - a * Math.sin(d) * Math.sin(d)), l = Math.tan(d) * Math.tan(d), u = h * Math.cos(d) * Math.cos(d), c = Math.cos(d) * (v - m), f = e * ((1 - a / 4 - 3 * a * a / 64 - 5 * a * a * a / 256) * d - (3 * a / 8 + 3 * a * a / 32 + 45 * a * a * a / 1024) * Math.sin(2 * d) + (15 * a * a / 256 + 45 * a * a * a / 1024) * Math.sin(4 * d) - 35 * a * a * a / 3072 * Math.sin(6 * d));
  var x = r * o * (c + (1 - l + u) * c * c * c / 6 + (5 - 18 * l + l * l + 72 * u - 58 * h) * c * c * c * c * c / 120) + 5e5, p = r * (f + o * Math.tan(d) * (c * c / 2 + (5 - l + 9 * u + 4 * u * u) * c * c * c * c / 24 + (61 - 58 * l + l * l + 600 * u - 330 * h) * c * c * c * c * c * c / 720));
  return i < 0 && (p += 1e7), {
    northing: Math.round(p),
    easting: Math.round(x),
    zoneNumber: y,
    zoneLetter: xe(i)
  };
}
function Pi(t) {
  var i = t.northing, s = t.easting, e = t.zoneLetter, a = t.zoneNumber;
  if (a < 0 || a > 60)
    return null;
  var r = 0.9996, n = 6378137, h = 669438e-8, o, l = (1 - Math.sqrt(1 - h)) / (1 + Math.sqrt(1 - h)), u, c, f, d, v, m, y, x, p, $ = s - 5e5, C = i;
  e < "N" && (C -= 1e7), y = (a - 1) * 6 - 180 + 3, o = h / (1 - h), m = C / r, x = m / (n * (1 - h / 4 - 3 * h * h / 64 - 5 * h * h * h / 256)), p = x + (3 * l / 2 - 27 * l * l * l / 32) * Math.sin(2 * x) + (21 * l * l / 16 - 55 * l * l * l * l / 32) * Math.sin(4 * x) + 151 * l * l * l / 96 * Math.sin(6 * x), u = n / Math.sqrt(1 - h * Math.sin(p) * Math.sin(p)), c = Math.tan(p) * Math.tan(p), f = o * Math.cos(p) * Math.cos(p), d = n * (1 - h) / Math.pow(1 - h * Math.sin(p) * Math.sin(p), 1.5), v = $ / (u * r);
  var E = p - u * Math.tan(p) / d * (v * v / 2 - (5 + 3 * c + 10 * f - 4 * f * f - 9 * o) * v * v * v * v / 24 + (61 + 90 * c + 298 * f + 45 * c * c - 252 * o - 3 * f * f) * v * v * v * v * v * v / 720);
  E = ns(E);
  var b = (v - (1 + 2 * c + f) * v * v * v / 6 + (5 - 2 * f + 28 * c - 3 * f * f + 8 * o + 24 * c * c) * v * v * v * v * v / 120) / Math.cos(p);
  b = y + ns(b);
  var P;
  if (t.accuracy) {
    var N = Pi({
      northing: t.northing + t.accuracy,
      easting: t.easting + t.accuracy,
      zoneLetter: t.zoneLetter,
      zoneNumber: t.zoneNumber
    });
    P = {
      top: N.lat,
      right: N.lon,
      bottom: E,
      left: b
    };
  } else
    P = {
      lat: E,
      lon: b
    };
  return P;
}
function xe(t) {
  var i = "Z";
  return 84 >= t && t >= 72 ? i = "X" : 72 > t && t >= 64 ? i = "W" : 64 > t && t >= 56 ? i = "V" : 56 > t && t >= 48 ? i = "U" : 48 > t && t >= 40 ? i = "T" : 40 > t && t >= 32 ? i = "S" : 32 > t && t >= 24 ? i = "R" : 24 > t && t >= 16 ? i = "Q" : 16 > t && t >= 8 ? i = "P" : 8 > t && t >= 0 ? i = "N" : 0 > t && t >= -8 ? i = "M" : -8 > t && t >= -16 ? i = "L" : -16 > t && t >= -24 ? i = "K" : -24 > t && t >= -32 ? i = "J" : -32 > t && t >= -40 ? i = "H" : -40 > t && t >= -48 ? i = "G" : -48 > t && t >= -56 ? i = "F" : -56 > t && t >= -64 ? i = "E" : -64 > t && t >= -72 ? i = "D" : -72 > t && t >= -80 && (i = "C"), i;
}
function be(t, i) {
  var s = "00000" + t.easting, e = "00000" + t.northing;
  return t.zoneNumber + t.zoneLetter + pe(t.easting, t.northing, t.zoneNumber) + s.substr(s.length - 5, i) + e.substr(e.length - 5, i);
}
function pe(t, i, s) {
  var e = Gs(s), a = Math.floor(t / 1e5), r = Math.floor(i / 1e5) % 20;
  return Ae(a, r, e);
}
function Gs(t) {
  var i = t % hs;
  return i === 0 && (i = hs), i;
}
function Ae(t, i, s) {
  var e = s - 1, a = Ts.charCodeAt(e), r = Ls.charCodeAt(e), n = a + t - 1, h = r + i, o = !1;
  n > Ct && (n = n - Ct + vt - 1, o = !0), (n === z || a < z && n > z || (n > z || a < z) && o) && n++, (n === j || a < j && n > j || (n > j || a < j) && o) && (n++, n === z && n++), n > Ct && (n = n - Ct + vt - 1), h > wt ? (h = h - wt + vt - 1, o = !0) : o = !1, (h === z || r < z && h > z || (h > z || r < z) && o) && h++, (h === j || r < j && h > j || (h > j || r < j) && o) && (h++, h === z && h++), h > wt && (h = h - wt + vt - 1);
  var l = String.fromCharCode(n) + String.fromCharCode(h);
  return l;
}
function zs(t) {
  if (t && t.length === 0)
    throw "MGRSPoint coverting from nothing";
  for (var i = t.length, s = null, e = "", a, r = 0; !/[A-Z]/.test(a = t.charAt(r)); ) {
    if (r >= 2)
      throw "MGRSPoint bad conversion from: " + t;
    e += a, r++;
  }
  var n = parseInt(e, 10);
  if (r === 0 || r + 3 > i)
    throw "MGRSPoint bad conversion from: " + t;
  var h = t.charAt(r++);
  if (h <= "A" || h === "B" || h === "Y" || h >= "Z" || h === "I" || h === "O")
    throw "MGRSPoint zone letter " + h + " not handled: " + t;
  s = t.substring(r, r += 2);
  for (var o = Gs(n), l = $e(s.charAt(0), o), u = Ee(s.charAt(1), o); u < Se(h); )
    u += 2e6;
  var c = i - r;
  if (c % 2 !== 0)
    throw `MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters` + t;
  var f = c / 2, d = 0, v = 0, m, y, x, p, $;
  return f > 0 && (m = 1e5 / Math.pow(10, f), y = t.substring(r, r + f), d = parseFloat(y) * m, x = t.substring(r + f), v = parseFloat(x) * m), p = d + l, $ = v + u, {
    easting: p,
    northing: $,
    zoneLetter: h,
    zoneNumber: n,
    accuracy: m
  };
}
function $e(t, i) {
  for (var s = Ts.charCodeAt(i - 1), e = 1e5, a = !1; s !== t.charCodeAt(0); ) {
    if (s++, s === z && s++, s === j && s++, s > Ct) {
      if (a)
        throw "Bad character: " + t;
      s = vt, a = !0;
    }
    e += 1e5;
  }
  return e;
}
function Ee(t, i) {
  if (t > "V")
    throw "MGRSPoint given invalid Northing " + t;
  for (var s = Ls.charCodeAt(i - 1), e = 0, a = !1; s !== t.charCodeAt(0); ) {
    if (s++, s === z && s++, s === j && s++, s > wt) {
      if (a)
        throw "Bad character: " + t;
      s = vt, a = !0;
    }
    e += 1e5;
  }
  return e;
}
function Se(t) {
  var i;
  switch (t) {
    case "C":
      i = 11e5;
      break;
    case "D":
      i = 2e6;
      break;
    case "E":
      i = 28e5;
      break;
    case "F":
      i = 37e5;
      break;
    case "G":
      i = 46e5;
      break;
    case "H":
      i = 55e5;
      break;
    case "J":
      i = 64e5;
      break;
    case "K":
      i = 73e5;
      break;
    case "L":
      i = 82e5;
      break;
    case "M":
      i = 91e5;
      break;
    case "N":
      i = 0;
      break;
    case "P":
      i = 8e5;
      break;
    case "Q":
      i = 17e5;
      break;
    case "R":
      i = 26e5;
      break;
    case "S":
      i = 35e5;
      break;
    case "T":
      i = 44e5;
      break;
    case "U":
      i = 53e5;
      break;
    case "V":
      i = 62e5;
      break;
    case "W":
      i = 7e6;
      break;
    case "X":
      i = 79e5;
      break;
    default:
      i = -1;
  }
  if (i >= 0)
    return i;
  throw "Invalid zone letter: " + t;
}
function pt(t, i, s) {
  if (!(this instanceof pt))
    return new pt(t, i, s);
  if (Array.isArray(t))
    this.x = t[0], this.y = t[1], this.z = t[2] || 0;
  else if (typeof t == "object")
    this.x = t.x, this.y = t.y, this.z = t.z || 0;
  else if (typeof t == "string" && typeof i > "u") {
    var e = t.split(",");
    this.x = parseFloat(e[0], 10), this.y = parseFloat(e[1], 10), this.z = parseFloat(e[2], 10) || 0;
  } else
    this.x = t, this.y = i, this.z = s || 0;
  console.warn("proj4.Point will be removed in version 3, use proj4.toPoint");
}
pt.fromMGRS = function(t) {
  return new pt(ks(t));
};
pt.prototype.toMGRS = function(t) {
  return qs([this.x, this.y], t);
};
var we = 1, Ce = 0.25, os = 0.046875, ls = 0.01953125, cs = 0.01068115234375, Ne = 0.75, Pe = 0.46875, Ie = 0.013020833333333334, Oe = 0.007120768229166667, Re = 0.3645833333333333, Te = 0.005696614583333333, Le = 0.3076171875;
function Us(t) {
  var i = [];
  i[0] = we - t * (Ce + t * (os + t * (ls + t * cs))), i[1] = t * (Ne - t * (os + t * (ls + t * cs)));
  var s = t * t;
  return i[2] = s * (Pe - t * (Ie + t * Oe)), s *= t, i[3] = s * (Re - t * Te), i[4] = s * t * Le, i;
}
function ci(t, i, s, e) {
  return s *= i, i *= i, e[0] * t - s * (e[1] + i * (e[2] + i * (e[3] + i * e[4])));
}
var qe = 20;
function Ds(t, i, s) {
  for (var e = 1 / (1 - i), a = t, r = qe; r; --r) {
    var n = Math.sin(a), h = 1 - i * n * n;
    if (h = (ci(a, n, Math.cos(a), s) - t) * (h * Math.sqrt(h)) * e, a -= h, Math.abs(h) < g)
      return a;
  }
  return a;
}
function ke() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.es && (this.en = Us(this.es), this.ml0 = ci(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en));
}
function Ge(t) {
  var i = t.x, s = t.y, e = _(i - this.long0), a, r, n, h = Math.sin(s), o = Math.cos(s);
  if (this.es) {
    var u = o * e, c = Math.pow(u, 2), f = this.ep2 * Math.pow(o, 2), d = Math.pow(f, 2), v = Math.abs(o) > g ? Math.tan(s) : 0, m = Math.pow(v, 2), y = Math.pow(m, 2);
    a = 1 - this.es * Math.pow(h, 2), u = u / Math.sqrt(a);
    var x = ci(s, h, o, this.en);
    r = this.a * (this.k0 * u * (1 + c / 6 * (1 - m + f + c / 20 * (5 - 18 * m + y + 14 * f - 58 * m * f + c / 42 * (61 + 179 * y - y * m - 479 * m))))) + this.x0, n = this.a * (this.k0 * (x - this.ml0 + h * e * u / 2 * (1 + c / 12 * (5 - m + 9 * f + 4 * d + c / 30 * (61 + y - 58 * m + 270 * f - 330 * m * f + c / 56 * (1385 + 543 * y - y * m - 3111 * m)))))) + this.y0;
  } else {
    var l = o * Math.sin(e);
    if (Math.abs(Math.abs(l) - 1) < g)
      return 93;
    if (r = 0.5 * this.a * this.k0 * Math.log((1 + l) / (1 - l)) + this.x0, n = o * Math.cos(e) / Math.sqrt(1 - Math.pow(l, 2)), l = Math.abs(n), l >= 1) {
      if (l - 1 > g)
        return 93;
      n = 0;
    } else
      n = Math.acos(n);
    s < 0 && (n = -n), n = this.a * this.k0 * (n - this.lat0) + this.y0;
  }
  return t.x = r, t.y = n, t;
}
function ze(t) {
  var i, s, e, a, r = (t.x - this.x0) * (1 / this.a), n = (t.y - this.y0) * (1 / this.a);
  if (this.es)
    if (i = this.ml0 + n / this.k0, s = Ds(i, this.es, this.en), Math.abs(s) < M) {
      var c = Math.sin(s), f = Math.cos(s), d = Math.abs(f) > g ? Math.tan(s) : 0, v = this.ep2 * Math.pow(f, 2), m = Math.pow(v, 2), y = Math.pow(d, 2), x = Math.pow(y, 2);
      i = 1 - this.es * Math.pow(c, 2);
      var p = r * Math.sqrt(i) / this.k0, $ = Math.pow(p, 2);
      i = i * d, e = s - i * $ / (1 - this.es) * 0.5 * (1 - $ / 12 * (5 + 3 * y - 9 * v * y + v - 4 * m - $ / 30 * (61 + 90 * y - 252 * v * y + 45 * x + 46 * v - $ / 56 * (1385 + 3633 * y + 4095 * x + 1574 * x * y)))), a = _(this.long0 + p * (1 - $ / 6 * (1 + 2 * y + v - $ / 20 * (5 + 28 * y + 24 * x + 8 * v * y + 6 * v - $ / 42 * (61 + 662 * y + 1320 * x + 720 * x * y)))) / f);
    } else
      e = M * Bt(n), a = 0;
  else {
    var h = Math.exp(r / this.k0), o = 0.5 * (h - 1 / h), l = this.lat0 + n / this.k0, u = Math.cos(l);
    i = Math.sqrt((1 - Math.pow(u, 2)) / (1 + Math.pow(o, 2))), e = Math.asin(i), n < 0 && (e = -e), o === 0 && u === 0 ? a = 0 : a = _(Math.atan2(o, u) + this.long0);
  }
  return t.x = a, t.y = e, t;
}
var Ue = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
const Yt = {
  init: ke,
  forward: Ge,
  inverse: ze,
  names: Ue
};
function Bs(t) {
  var i = Math.exp(t);
  return i = (i - 1 / i) / 2, i;
}
function F(t, i) {
  t = Math.abs(t), i = Math.abs(i);
  var s = Math.max(t, i), e = Math.min(t, i) / (s || 1);
  return s * Math.sqrt(1 + Math.pow(e, 2));
}
function De(t) {
  var i = 1 + t, s = i - 1;
  return s === 0 ? t : t * Math.log(i) / s;
}
function Be(t) {
  var i = Math.abs(t);
  return i = De(i * (1 + i / (F(1, i) + 1))), t < 0 ? -i : i;
}
function Ii(t, i) {
  for (var s = 2 * Math.cos(2 * i), e = t.length - 1, a = t[e], r = 0, n; --e >= 0; )
    n = -r + s * a + t[e], r = a, a = n;
  return i + n * Math.sin(2 * i);
}
function je(t, i) {
  for (var s = 2 * Math.cos(i), e = t.length - 1, a = t[e], r = 0, n; --e >= 0; )
    n = -r + s * a + t[e], r = a, a = n;
  return Math.sin(i) * n;
}
function Fe(t) {
  var i = Math.exp(t);
  return i = (i + 1 / i) / 2, i;
}
function js(t, i, s) {
  for (var e = Math.sin(i), a = Math.cos(i), r = Bs(s), n = Fe(s), h = 2 * a * n, o = -2 * e * r, l = t.length - 1, u = t[l], c = 0, f = 0, d = 0, v, m; --l >= 0; )
    v = f, m = c, f = u, c = d, u = -v + h * f - o * c + t[l], d = -m + o * f + h * c;
  return h = e * n, o = a * r, [h * u - o * d, h * d + o * u];
}
function He() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0))
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  this.approx && (Yt.init.apply(this), this.forward = Yt.forward, this.inverse = Yt.inverse), this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.cgb = [], this.cbg = [], this.utg = [], this.gtu = [];
  var t = this.es / (1 + Math.sqrt(1 - this.es)), i = t / (2 - t), s = i;
  this.cgb[0] = i * (2 + i * (-2 / 3 + i * (-2 + i * (116 / 45 + i * (26 / 45 + i * (-2854 / 675)))))), this.cbg[0] = i * (-2 + i * (2 / 3 + i * (4 / 3 + i * (-82 / 45 + i * (32 / 45 + i * (4642 / 4725)))))), s = s * i, this.cgb[1] = s * (7 / 3 + i * (-8 / 5 + i * (-227 / 45 + i * (2704 / 315 + i * (2323 / 945))))), this.cbg[1] = s * (5 / 3 + i * (-16 / 15 + i * (-13 / 9 + i * (904 / 315 + i * (-1522 / 945))))), s = s * i, this.cgb[2] = s * (56 / 15 + i * (-136 / 35 + i * (-1262 / 105 + i * (73814 / 2835)))), this.cbg[2] = s * (-26 / 15 + i * (34 / 21 + i * (8 / 5 + i * (-12686 / 2835)))), s = s * i, this.cgb[3] = s * (4279 / 630 + i * (-332 / 35 + i * (-399572 / 14175))), this.cbg[3] = s * (1237 / 630 + i * (-12 / 5 + i * (-24832 / 14175))), s = s * i, this.cgb[4] = s * (4174 / 315 + i * (-144838 / 6237)), this.cbg[4] = s * (-734 / 315 + i * (109598 / 31185)), s = s * i, this.cgb[5] = s * (601676 / 22275), this.cbg[5] = s * (444337 / 155925), s = Math.pow(i, 2), this.Qn = this.k0 / (1 + i) * (1 + s * (1 / 4 + s * (1 / 64 + s / 256))), this.utg[0] = i * (-0.5 + i * (2 / 3 + i * (-37 / 96 + i * (1 / 360 + i * (81 / 512 + i * (-96199 / 604800)))))), this.gtu[0] = i * (0.5 + i * (-2 / 3 + i * (5 / 16 + i * (41 / 180 + i * (-127 / 288 + i * (7891 / 37800)))))), this.utg[1] = s * (-1 / 48 + i * (-1 / 15 + i * (437 / 1440 + i * (-46 / 105 + i * (1118711 / 3870720))))), this.gtu[1] = s * (13 / 48 + i * (-3 / 5 + i * (557 / 1440 + i * (281 / 630 + i * (-1983433 / 1935360))))), s = s * i, this.utg[2] = s * (-17 / 480 + i * (37 / 840 + i * (209 / 4480 + i * (-5569 / 90720)))), this.gtu[2] = s * (61 / 240 + i * (-103 / 140 + i * (15061 / 26880 + i * (167603 / 181440)))), s = s * i, this.utg[3] = s * (-4397 / 161280 + i * (11 / 504 + i * (830251 / 7257600))), this.gtu[3] = s * (49561 / 161280 + i * (-179 / 168 + i * (6601661 / 7257600))), s = s * i, this.utg[4] = s * (-4583 / 161280 + i * (108847 / 3991680)), this.gtu[4] = s * (34729 / 80640 + i * (-3418889 / 1995840)), s = s * i, this.utg[5] = s * (-20648693 / 638668800), this.gtu[5] = s * (212378941 / 319334400);
  var e = Ii(this.cbg, this.lat0);
  this.Zb = -this.Qn * (e + je(this.gtu, 2 * e));
}
function We(t) {
  var i = _(t.x - this.long0), s = t.y;
  s = Ii(this.cbg, s);
  var e = Math.sin(s), a = Math.cos(s), r = Math.sin(i), n = Math.cos(i);
  s = Math.atan2(e, n * a), i = Math.atan2(r * a, F(e, a * n)), i = Be(Math.tan(i));
  var h = js(this.gtu, 2 * s, 2 * i);
  s = s + h[0], i = i + h[1];
  var o, l;
  return Math.abs(i) <= 2.623395162778 ? (o = this.a * (this.Qn * i) + this.x0, l = this.a * (this.Qn * s + this.Zb) + this.y0) : (o = 1 / 0, l = 1 / 0), t.x = o, t.y = l, t;
}
function Qe(t) {
  var i = (t.x - this.x0) * (1 / this.a), s = (t.y - this.y0) * (1 / this.a);
  s = (s - this.Zb) / this.Qn, i = i / this.Qn;
  var e, a;
  if (Math.abs(i) <= 2.623395162778) {
    var r = js(this.utg, 2 * s, 2 * i);
    s = s + r[0], i = i + r[1], i = Math.atan(Bs(i));
    var n = Math.sin(s), h = Math.cos(s), o = Math.sin(i), l = Math.cos(i);
    s = Math.atan2(n * l, F(o, l * h)), i = Math.atan2(o, l * h), e = _(i + this.long0), a = Ii(this.cgb, s);
  } else
    e = 1 / 0, a = 1 / 0;
  return t.x = e, t.y = a, t;
}
var Ve = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "Gauss Kruger", "Gauss_Kruger", "tmerc"];
const ti = {
  init: He,
  forward: We,
  inverse: Qe,
  names: Ve
};
function Xe(t, i) {
  if (t === void 0) {
    if (t = Math.floor((_(i) + Math.PI) * 30 / Math.PI) + 1, t < 0)
      return 0;
    if (t > 60)
      return 60;
  }
  return t;
}
var Ke = "etmerc";
function Je() {
  var t = Xe(this.zone, this.long0);
  if (t === void 0)
    throw new Error("unknown utm zone");
  this.lat0 = 0, this.long0 = (6 * Math.abs(t) - 183) * L, this.x0 = 5e5, this.y0 = this.utmSouth ? 1e7 : 0, this.k0 = 0.9996, ti.init.apply(this), this.forward = ti.forward, this.inverse = ti.inverse;
}
var Ze = ["Universal Transverse Mercator System", "utm"];
const Ye = {
  init: Je,
  names: Ze,
  dependsOn: Ke
};
function Oi(t, i) {
  return Math.pow((1 - t) / (1 + t), i);
}
var tr = 20;
function ir() {
  var t = Math.sin(this.lat0), i = Math.cos(this.lat0);
  i *= i, this.rc = Math.sqrt(1 - this.es) / (1 - this.es * t * t), this.C = Math.sqrt(1 + this.es * i * i / (1 - this.es)), this.phic0 = Math.asin(t / this.C), this.ratexp = 0.5 * this.C * this.e, this.K = Math.tan(0.5 * this.phic0 + S) / (Math.pow(Math.tan(0.5 * this.lat0 + S), this.C) * Oi(this.e * t, this.ratexp));
}
function sr(t) {
  var i = t.x, s = t.y;
  return t.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * s + S), this.C) * Oi(this.e * Math.sin(s), this.ratexp)) - M, t.x = this.C * i, t;
}
function ar(t) {
  for (var i = 1e-14, s = t.x / this.C, e = t.y, a = Math.pow(Math.tan(0.5 * e + S) / this.K, 1 / this.C), r = tr; r > 0 && (e = 2 * Math.atan(a * Oi(this.e * Math.sin(t.y), -0.5 * this.e)) - M, !(Math.abs(e - t.y) < i)); --r)
    t.y = e;
  return r ? (t.x = s, t.y = e, t) : null;
}
var er = ["gauss"];
const Ri = {
  init: ir,
  forward: sr,
  inverse: ar,
  names: er
};
function rr() {
  Ri.init.apply(this), this.rc && (this.sinc0 = Math.sin(this.phic0), this.cosc0 = Math.cos(this.phic0), this.R2 = 2 * this.rc, this.title || (this.title = "Oblique Stereographic Alternative"));
}
function hr(t) {
  var i, s, e, a;
  return t.x = _(t.x - this.long0), Ri.forward.apply(this, [t]), i = Math.sin(t.y), s = Math.cos(t.y), e = Math.cos(t.x), a = this.k0 * this.R2 / (1 + this.sinc0 * i + this.cosc0 * s * e), t.x = a * s * Math.sin(t.x), t.y = a * (this.cosc0 * i - this.sinc0 * s * e), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t;
}
function nr(t) {
  var i, s, e, a, r;
  if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, r = F(t.x, t.y)) {
    var n = 2 * Math.atan2(r, this.R2);
    i = Math.sin(n), s = Math.cos(n), a = Math.asin(s * this.sinc0 + t.y * i * this.cosc0 / r), e = Math.atan2(t.x * i, r * this.cosc0 * s - t.y * this.sinc0 * i);
  } else
    a = this.phic0, e = 0;
  return t.x = e, t.y = a, Ri.inverse.apply(this, [t]), t.x = _(t.x + this.long0), t;
}
var or = ["Stereographic_North_Pole", "Oblique_Stereographic", "sterea", "Oblique Stereographic Alternative", "Double_Stereographic"];
const lr = {
  init: rr,
  forward: hr,
  inverse: nr,
  names: or
};
function cr(t, i, s) {
  return i *= s, Math.tan(0.5 * (M + t)) * Math.pow((1 - i) / (1 + i), 0.5 * s);
}
function ur() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.coslat0 = Math.cos(this.lat0), this.sinlat0 = Math.sin(this.lat0), this.sphere ? this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= g && (this.k0 = 0.5 * (1 + Bt(this.lat0) * Math.sin(this.lat_ts))) : (Math.abs(this.coslat0) <= g && (this.lat0 > 0 ? this.con = 1 : this.con = -1), this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)), this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= g && Math.abs(Math.cos(this.lat_ts)) > g && (this.k0 = 0.5 * this.cons * X(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / H(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts))), this.ms1 = X(this.e, this.sinlat0, this.coslat0), this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - M, this.cosX0 = Math.cos(this.X0), this.sinX0 = Math.sin(this.X0));
}
function fr(t) {
  var i = t.x, s = t.y, e = Math.sin(s), a = Math.cos(s), r, n, h, o, l, u, c = _(i - this.long0);
  return Math.abs(Math.abs(i - this.long0) - Math.PI) <= g && Math.abs(s + this.lat0) <= g ? (t.x = NaN, t.y = NaN, t) : this.sphere ? (r = 2 * this.k0 / (1 + this.sinlat0 * e + this.coslat0 * a * Math.cos(c)), t.x = this.a * r * a * Math.sin(c) + this.x0, t.y = this.a * r * (this.coslat0 * e - this.sinlat0 * a * Math.cos(c)) + this.y0, t) : (n = 2 * Math.atan(this.ssfn_(s, e, this.e)) - M, o = Math.cos(n), h = Math.sin(n), Math.abs(this.coslat0) <= g ? (l = H(this.e, s * this.con, this.con * e), u = 2 * this.a * this.k0 * l / this.cons, t.x = this.x0 + u * Math.sin(i - this.long0), t.y = this.y0 - this.con * u * Math.cos(i - this.long0), t) : (Math.abs(this.sinlat0) < g ? (r = 2 * this.a * this.k0 / (1 + o * Math.cos(c)), t.y = r * h) : (r = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * h + this.cosX0 * o * Math.cos(c))), t.y = r * (this.cosX0 * h - this.sinX0 * o * Math.cos(c)) + this.y0), t.x = r * o * Math.sin(c) + this.x0, t));
}
function dr(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, s, e, a, r, n = Math.sqrt(t.x * t.x + t.y * t.y);
  if (this.sphere) {
    var h = 2 * Math.atan(n / (2 * this.a * this.k0));
    return i = this.long0, s = this.lat0, n <= g ? (t.x = i, t.y = s, t) : (s = Math.asin(Math.cos(h) * this.sinlat0 + t.y * Math.sin(h) * this.coslat0 / n), Math.abs(this.coslat0) < g ? this.lat0 > 0 ? i = _(this.long0 + Math.atan2(t.x, -1 * t.y)) : i = _(this.long0 + Math.atan2(t.x, t.y)) : i = _(this.long0 + Math.atan2(t.x * Math.sin(h), n * this.coslat0 * Math.cos(h) - t.y * this.sinlat0 * Math.sin(h))), t.x = i, t.y = s, t);
  } else if (Math.abs(this.coslat0) <= g) {
    if (n <= g)
      return s = this.lat0, i = this.long0, t.x = i, t.y = s, t;
    t.x *= this.con, t.y *= this.con, e = n * this.cons / (2 * this.a * this.k0), s = this.con * Dt(this.e, e), i = this.con * _(this.con * this.long0 + Math.atan2(t.x, -1 * t.y));
  } else
    a = 2 * Math.atan(n * this.cosX0 / (2 * this.a * this.k0 * this.ms1)), i = this.long0, n <= g ? r = this.X0 : (r = Math.asin(Math.cos(a) * this.sinX0 + t.y * Math.sin(a) * this.cosX0 / n), i = _(this.long0 + Math.atan2(t.x * Math.sin(a), n * this.cosX0 * Math.cos(a) - t.y * this.sinX0 * Math.sin(a)))), s = -1 * Dt(this.e, Math.tan(0.5 * (M + r)));
  return t.x = i, t.y = s, t;
}
var vr = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)", "Polar_Stereographic"];
const Mr = {
  init: ur,
  forward: fr,
  inverse: dr,
  names: vr,
  ssfn_: cr
};
function mr() {
  var t = this.lat0;
  this.lambda0 = this.long0;
  var i = Math.sin(t), s = this.a, e = this.rf, a = 1 / e, r = 2 * a - Math.pow(a, 2), n = this.e = Math.sqrt(r);
  this.R = this.k0 * s * Math.sqrt(1 - r) / (1 - r * Math.pow(i, 2)), this.alpha = Math.sqrt(1 + r / (1 - r) * Math.pow(Math.cos(t), 4)), this.b0 = Math.asin(i / this.alpha);
  var h = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)), o = Math.log(Math.tan(Math.PI / 4 + t / 2)), l = Math.log((1 + n * i) / (1 - n * i));
  this.K = h - this.alpha * o + this.alpha * n / 2 * l;
}
function yr(t) {
  var i = Math.log(Math.tan(Math.PI / 4 - t.y / 2)), s = this.e / 2 * Math.log((1 + this.e * Math.sin(t.y)) / (1 - this.e * Math.sin(t.y))), e = -this.alpha * (i + s) + this.K, a = 2 * (Math.atan(Math.exp(e)) - Math.PI / 4), r = this.alpha * (t.x - this.lambda0), n = Math.atan(Math.sin(r) / (Math.sin(this.b0) * Math.tan(a) + Math.cos(this.b0) * Math.cos(r))), h = Math.asin(Math.cos(this.b0) * Math.sin(a) - Math.sin(this.b0) * Math.cos(a) * Math.cos(r));
  return t.y = this.R / 2 * Math.log((1 + Math.sin(h)) / (1 - Math.sin(h))) + this.y0, t.x = this.R * n + this.x0, t;
}
function gr(t) {
  for (var i = t.x - this.x0, s = t.y - this.y0, e = i / this.R, a = 2 * (Math.atan(Math.exp(s / this.R)) - Math.PI / 4), r = Math.asin(Math.cos(this.b0) * Math.sin(a) + Math.sin(this.b0) * Math.cos(a) * Math.cos(e)), n = Math.atan(Math.sin(e) / (Math.cos(this.b0) * Math.cos(e) - Math.sin(this.b0) * Math.tan(a))), h = this.lambda0 + n / this.alpha, o = 0, l = r, u = -1e3, c = 0; Math.abs(l - u) > 1e-7; ) {
    if (++c > 20)
      return;
    o = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + r / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(l)) / 2)), u = l, l = 2 * Math.atan(Math.exp(o)) - Math.PI / 2;
  }
  return t.x = h, t.y = l, t;
}
var _r = ["somerc"];
const xr = {
  init: mr,
  forward: yr,
  inverse: gr,
  names: _r
};
var ut = 1e-7;
function br(t) {
  var i = ["Hotine_Oblique_Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin"], s = typeof t.PROJECTION == "object" ? Object.keys(t.PROJECTION)[0] : t.PROJECTION;
  return "no_uoff" in t || "no_off" in t || i.indexOf(s) !== -1;
}
function pr() {
  var t, i, s, e, a, r, n, h, o, l, u = 0, c, f = 0, d = 0, v = 0, m = 0, y = 0, x = 0;
  this.no_off = br(this), this.no_rot = "no_rot" in this;
  var p = !1;
  "alpha" in this && (p = !0);
  var $ = !1;
  if ("rectified_grid_angle" in this && ($ = !0), p && (x = this.alpha), $ && (u = this.rectified_grid_angle * L), p || $)
    f = this.longc;
  else if (d = this.long1, m = this.lat1, v = this.long2, y = this.lat2, Math.abs(m - y) <= ut || (t = Math.abs(m)) <= ut || Math.abs(t - M) <= ut || Math.abs(Math.abs(this.lat0) - M) <= ut || Math.abs(Math.abs(y) - M) <= ut)
    throw new Error();
  var C = 1 - this.es;
  i = Math.sqrt(C), Math.abs(this.lat0) > g ? (h = Math.sin(this.lat0), s = Math.cos(this.lat0), t = 1 - this.es * h * h, this.B = s * s, this.B = Math.sqrt(1 + this.es * this.B * this.B / C), this.A = this.B * this.k0 * i / t, e = this.B * i / (s * Math.sqrt(t)), a = e * e - 1, a <= 0 ? a = 0 : (a = Math.sqrt(a), this.lat0 < 0 && (a = -a)), this.E = a += e, this.E *= Math.pow(H(this.e, this.lat0, h), this.B)) : (this.B = 1 / i, this.A = this.k0, this.E = e = a = 1), p || $ ? (p ? (c = Math.asin(Math.sin(x) / e), $ || (u = x)) : (c = u, x = Math.asin(e * Math.sin(c))), this.lam0 = f - Math.asin(0.5 * (a - 1 / a) * Math.tan(c)) / this.B) : (r = Math.pow(H(this.e, m, Math.sin(m)), this.B), n = Math.pow(H(this.e, y, Math.sin(y)), this.B), a = this.E / r, o = (n - r) / (n + r), l = this.E * this.E, l = (l - n * r) / (l + n * r), t = d - v, t < -Math.pi ? v -= zt : t > Math.pi && (v += zt), this.lam0 = _(0.5 * (d + v) - Math.atan(l * Math.tan(0.5 * this.B * (d - v)) / o) / this.B), c = Math.atan(2 * Math.sin(this.B * _(d - this.lam0)) / (a - 1 / a)), u = x = Math.asin(e * Math.sin(c))), this.singam = Math.sin(c), this.cosgam = Math.cos(c), this.sinrot = Math.sin(u), this.cosrot = Math.cos(u), this.rB = 1 / this.B, this.ArB = this.A * this.rB, this.BrA = 1 / this.ArB, this.A * this.B, this.no_off ? this.u_0 = 0 : (this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(e * e - 1) / Math.cos(x))), this.lat0 < 0 && (this.u_0 = -this.u_0)), a = 0.5 * c, this.v_pole_n = this.ArB * Math.log(Math.tan(S - a)), this.v_pole_s = this.ArB * Math.log(Math.tan(S + a));
}
function Ar(t) {
  var i = {}, s, e, a, r, n, h, o, l;
  if (t.x = t.x - this.lam0, Math.abs(Math.abs(t.y) - M) > g) {
    if (n = this.E / Math.pow(H(this.e, t.y, Math.sin(t.y)), this.B), h = 1 / n, s = 0.5 * (n - h), e = 0.5 * (n + h), r = Math.sin(this.B * t.x), a = (s * this.singam - r * this.cosgam) / e, Math.abs(Math.abs(a) - 1) < g)
      throw new Error();
    l = 0.5 * this.ArB * Math.log((1 - a) / (1 + a)), h = Math.cos(this.B * t.x), Math.abs(h) < ut ? o = this.A * t.x : o = this.ArB * Math.atan2(s * this.cosgam + r * this.singam, h);
  } else
    l = t.y > 0 ? this.v_pole_n : this.v_pole_s, o = this.ArB * t.y;
  return this.no_rot ? (i.x = o, i.y = l) : (o -= this.u_0, i.x = l * this.cosrot + o * this.sinrot, i.y = o * this.cosrot - l * this.sinrot), i.x = this.a * i.x + this.x0, i.y = this.a * i.y + this.y0, i;
}
function $r(t) {
  var i, s, e, a, r, n, h, o = {};
  if (t.x = (t.x - this.x0) * (1 / this.a), t.y = (t.y - this.y0) * (1 / this.a), this.no_rot ? (s = t.y, i = t.x) : (s = t.x * this.cosrot - t.y * this.sinrot, i = t.y * this.cosrot + t.x * this.sinrot + this.u_0), e = Math.exp(-this.BrA * s), a = 0.5 * (e - 1 / e), r = 0.5 * (e + 1 / e), n = Math.sin(this.BrA * i), h = (n * this.cosgam + a * this.singam) / r, Math.abs(Math.abs(h) - 1) < g)
    o.x = 0, o.y = h < 0 ? -M : M;
  else {
    if (o.y = this.E / Math.sqrt((1 + h) / (1 - h)), o.y = Dt(this.e, Math.pow(o.y, 1 / this.B)), o.y === 1 / 0)
      throw new Error();
    o.x = -this.rB * Math.atan2(a * this.cosgam - n * this.singam, Math.cos(this.BrA * i));
  }
  return o.x += this.lam0, o;
}
var Er = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
const Sr = {
  init: pr,
  forward: Ar,
  inverse: $r,
  names: Er
};
function wr() {
  if (this.lat2 || (this.lat2 = this.lat1), this.k0 || (this.k0 = 1), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, !(Math.abs(this.lat1 + this.lat2) < g)) {
    var t = this.b / this.a;
    this.e = Math.sqrt(1 - t * t);
    var i = Math.sin(this.lat1), s = Math.cos(this.lat1), e = X(this.e, i, s), a = H(this.e, this.lat1, i), r = Math.sin(this.lat2), n = Math.cos(this.lat2), h = X(this.e, r, n), o = H(this.e, this.lat2, r), l = H(this.e, this.lat0, Math.sin(this.lat0));
    Math.abs(this.lat1 - this.lat2) > g ? this.ns = Math.log(e / h) / Math.log(a / o) : this.ns = i, isNaN(this.ns) && (this.ns = i), this.f0 = e / (this.ns * Math.pow(a, this.ns)), this.rh = this.a * this.f0 * Math.pow(l, this.ns), this.title || (this.title = "Lambert Conformal Conic");
  }
}
function Cr(t) {
  var i = t.x, s = t.y;
  Math.abs(2 * Math.abs(s) - Math.PI) <= g && (s = Bt(s) * (M - 2 * g));
  var e = Math.abs(Math.abs(s) - M), a, r;
  if (e > g)
    a = H(this.e, s, Math.sin(s)), r = this.a * this.f0 * Math.pow(a, this.ns);
  else {
    if (e = s * this.ns, e <= 0)
      return null;
    r = 0;
  }
  var n = this.ns * _(i - this.long0);
  return t.x = this.k0 * (r * Math.sin(n)) + this.x0, t.y = this.k0 * (this.rh - r * Math.cos(n)) + this.y0, t;
}
function Nr(t) {
  var i, s, e, a, r, n = (t.x - this.x0) / this.k0, h = this.rh - (t.y - this.y0) / this.k0;
  this.ns > 0 ? (i = Math.sqrt(n * n + h * h), s = 1) : (i = -Math.sqrt(n * n + h * h), s = -1);
  var o = 0;
  if (i !== 0 && (o = Math.atan2(s * n, s * h)), i !== 0 || this.ns > 0) {
    if (s = 1 / this.ns, e = Math.pow(i / (this.a * this.f0), s), a = Dt(this.e, e), a === -9999)
      return null;
  } else
    a = -M;
  return r = _(o / this.ns + this.long0), t.x = r, t.y = a, t;
}
var Pr = [
  "Lambert Tangential Conformal Conic Projection",
  "Lambert_Conformal_Conic",
  "Lambert_Conformal_Conic_1SP",
  "Lambert_Conformal_Conic_2SP",
  "lcc",
  "Lambert Conic Conformal (1SP)",
  "Lambert Conic Conformal (2SP)"
];
const Ir = {
  init: wr,
  forward: Cr,
  inverse: Nr,
  names: Pr
};
function Or() {
  this.a = 6377397155e-3, this.es = 0.006674372230614, this.e = Math.sqrt(this.es), this.lat0 || (this.lat0 = 0.863937979737193), this.long0 || (this.long0 = 0.7417649320975901 - 0.308341501185665), this.k0 || (this.k0 = 0.9999), this.s45 = 0.785398163397448, this.s90 = 2 * this.s45, this.fi0 = this.lat0, this.e2 = this.es, this.e = Math.sqrt(this.e2), this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)), this.uq = 1.04216856380474, this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa), this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2), this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g, this.k1 = this.k0, this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)), this.s0 = 1.37008346281555, this.n = Math.sin(this.s0), this.ro0 = this.k1 * this.n0 / Math.tan(this.s0), this.ad = this.s90 - this.uq;
}
function Rr(t) {
  var i, s, e, a, r, n, h, o = t.x, l = t.y, u = _(o - this.long0);
  return i = Math.pow((1 + this.e * Math.sin(l)) / (1 - this.e * Math.sin(l)), this.alfa * this.e / 2), s = 2 * (Math.atan(this.k * Math.pow(Math.tan(l / 2 + this.s45), this.alfa) / i) - this.s45), e = -u * this.alfa, a = Math.asin(Math.cos(this.ad) * Math.sin(s) + Math.sin(this.ad) * Math.cos(s) * Math.cos(e)), r = Math.asin(Math.cos(s) * Math.sin(e) / Math.cos(a)), n = this.n * r, h = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(a / 2 + this.s45), this.n), t.y = h * Math.cos(n) / 1, t.x = h * Math.sin(n) / 1, this.czech || (t.y *= -1, t.x *= -1), t;
}
function Tr(t) {
  var i, s, e, a, r, n, h, o, l = t.x;
  t.x = t.y, t.y = l, this.czech || (t.y *= -1, t.x *= -1), n = Math.sqrt(t.x * t.x + t.y * t.y), r = Math.atan2(t.y, t.x), a = r / Math.sin(this.s0), e = 2 * (Math.atan(Math.pow(this.ro0 / n, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45), i = Math.asin(Math.cos(this.ad) * Math.sin(e) - Math.sin(this.ad) * Math.cos(e) * Math.cos(a)), s = Math.asin(Math.cos(e) * Math.sin(a) / Math.cos(i)), t.x = this.long0 - s / this.alfa, h = i, o = 0;
  var u = 0;
  do
    t.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(i / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(h)) / (1 - this.e * Math.sin(h)), this.e / 2)) - this.s45), Math.abs(h - t.y) < 1e-10 && (o = 1), h = t.y, u += 1;
  while (o === 0 && u < 15);
  return u >= 15 ? null : t;
}
var Lr = ["Krovak", "krovak"];
const qr = {
  init: Or,
  forward: Rr,
  inverse: Tr,
  names: Lr
};
function G(t, i, s, e, a) {
  return t * a - i * Math.sin(2 * a) + s * Math.sin(4 * a) - e * Math.sin(6 * a);
}
function jt(t) {
  return 1 - 0.25 * t * (1 + t / 16 * (3 + 1.25 * t));
}
function Ft(t) {
  return 0.375 * t * (1 + 0.25 * t * (1 + 0.46875 * t));
}
function Ht(t) {
  return 0.05859375 * t * t * (1 + 0.75 * t);
}
function Wt(t) {
  return t * t * t * (35 / 3072);
}
function At(t, i, s) {
  var e = i * s;
  return t / Math.sqrt(1 - e * e);
}
function $t(t) {
  return Math.abs(t) < M ? t : t - Bt(t) * Math.PI;
}
function ri(t, i, s, e, a) {
  var r, n;
  r = t / i;
  for (var h = 0; h < 15; h++)
    if (n = (t - (i * r - s * Math.sin(2 * r) + e * Math.sin(4 * r) - a * Math.sin(6 * r))) / (i - 2 * s * Math.cos(2 * r) + 4 * e * Math.cos(4 * r) - 6 * a * Math.cos(6 * r)), r += n, Math.abs(n) <= 1e-10)
      return r;
  return NaN;
}
function kr() {
  this.sphere || (this.e0 = jt(this.es), this.e1 = Ft(this.es), this.e2 = Ht(this.es), this.e3 = Wt(this.es), this.ml0 = this.a * G(this.e0, this.e1, this.e2, this.e3, this.lat0));
}
function Gr(t) {
  var i, s, e = t.x, a = t.y;
  if (e = _(e - this.long0), this.sphere)
    i = this.a * Math.asin(Math.cos(a) * Math.sin(e)), s = this.a * (Math.atan2(Math.tan(a), Math.cos(e)) - this.lat0);
  else {
    var r = Math.sin(a), n = Math.cos(a), h = At(this.a, this.e, r), o = Math.tan(a) * Math.tan(a), l = e * Math.cos(a), u = l * l, c = this.es * n * n / (1 - this.es), f = this.a * G(this.e0, this.e1, this.e2, this.e3, a);
    i = h * l * (1 - u * o * (1 / 6 - (8 - o + 8 * c) * u / 120)), s = f - this.ml0 + h * r / n * u * (0.5 + (5 - o + 6 * c) * u / 24);
  }
  return t.x = i + this.x0, t.y = s + this.y0, t;
}
function zr(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = t.x / this.a, s = t.y / this.a, e, a;
  if (this.sphere) {
    var r = s + this.lat0;
    e = Math.asin(Math.sin(r) * Math.cos(i)), a = Math.atan2(Math.tan(i), Math.cos(r));
  } else {
    var n = this.ml0 / this.a + s, h = ri(n, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(h) - M) <= g)
      return t.x = this.long0, t.y = M, s < 0 && (t.y *= -1), t;
    var o = At(this.a, this.e, Math.sin(h)), l = o * o * o / this.a / this.a * (1 - this.es), u = Math.pow(Math.tan(h), 2), c = i * this.a / o, f = c * c;
    e = h - o * Math.tan(h) / l * c * c * (0.5 - (1 + 3 * u) * c * c / 24), a = c * (1 - f * (u / 3 + (1 + 3 * u) * u * f / 15)) / Math.cos(h);
  }
  return t.x = _(a + this.long0), t.y = $t(e), t;
}
var Ur = ["Cassini", "Cassini_Soldner", "cass"];
const Dr = {
  init: kr,
  forward: Gr,
  inverse: zr,
  names: Ur
};
function Y(t, i) {
  var s;
  return t > 1e-7 ? (s = t * i, (1 - t * t) * (i / (1 - s * s) - 0.5 / t * Math.log((1 - s) / (1 + s)))) : 2 * i;
}
var Br = 1, jr = 2, Fr = 3, Hr = 4;
function Wr() {
  var t = Math.abs(this.lat0);
  if (Math.abs(t - M) < g ? this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE : Math.abs(t) < g ? this.mode = this.EQUIT : this.mode = this.OBLIQ, this.es > 0) {
    var i;
    switch (this.qp = Y(this.e, 1), this.mmf = 0.5 / (1 - this.es), this.apa = ih(this.es), this.mode) {
      case this.N_POLE:
        this.dd = 1;
        break;
      case this.S_POLE:
        this.dd = 1;
        break;
      case this.EQUIT:
        this.rq = Math.sqrt(0.5 * this.qp), this.dd = 1 / this.rq, this.xmf = 1, this.ymf = 0.5 * this.qp;
        break;
      case this.OBLIQ:
        this.rq = Math.sqrt(0.5 * this.qp), i = Math.sin(this.lat0), this.sinb1 = Y(this.e, i) / this.qp, this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1), this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * i * i) * this.rq * this.cosb1), this.ymf = (this.xmf = this.rq) / this.dd, this.xmf *= this.dd;
        break;
    }
  } else
    this.mode === this.OBLIQ && (this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0));
}
function Qr(t) {
  var i, s, e, a, r, n, h, o, l, u, c = t.x, f = t.y;
  if (c = _(c - this.long0), this.sphere) {
    if (r = Math.sin(f), u = Math.cos(f), e = Math.cos(c), this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (s = this.mode === this.EQUIT ? 1 + u * e : 1 + this.sinph0 * r + this.cosph0 * u * e, s <= g)
        return null;
      s = Math.sqrt(2 / s), i = s * u * Math.sin(c), s *= this.mode === this.EQUIT ? r : this.cosph0 * r - this.sinph0 * u * e;
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (e = -e), Math.abs(f + this.lat0) < g)
        return null;
      s = S - f * 0.5, s = 2 * (this.mode === this.S_POLE ? Math.cos(s) : Math.sin(s)), i = s * Math.sin(c), s *= e;
    }
  } else {
    switch (h = 0, o = 0, l = 0, e = Math.cos(c), a = Math.sin(c), r = Math.sin(f), n = Y(this.e, r), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (h = n / this.qp, o = Math.sqrt(1 - h * h)), this.mode) {
      case this.OBLIQ:
        l = 1 + this.sinb1 * h + this.cosb1 * o * e;
        break;
      case this.EQUIT:
        l = 1 + o * e;
        break;
      case this.N_POLE:
        l = M + f, n = this.qp - n;
        break;
      case this.S_POLE:
        l = f - M, n = this.qp + n;
        break;
    }
    if (Math.abs(l) < g)
      return null;
    switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        l = Math.sqrt(2 / l), this.mode === this.OBLIQ ? s = this.ymf * l * (this.cosb1 * h - this.sinb1 * o * e) : s = (l = Math.sqrt(2 / (1 + o * e))) * h * this.ymf, i = this.xmf * l * o * a;
        break;
      case this.N_POLE:
      case this.S_POLE:
        n >= 0 ? (i = (l = Math.sqrt(n)) * a, s = e * (this.mode === this.S_POLE ? l : -l)) : i = s = 0;
        break;
    }
  }
  return t.x = this.a * i + this.x0, t.y = this.a * s + this.y0, t;
}
function Vr(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = t.x / this.a, s = t.y / this.a, e, a, r, n, h, o, l;
  if (this.sphere) {
    var u = 0, c, f = 0;
    if (c = Math.sqrt(i * i + s * s), a = c * 0.5, a > 1)
      return null;
    switch (a = 2 * Math.asin(a), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (f = Math.sin(a), u = Math.cos(a)), this.mode) {
      case this.EQUIT:
        a = Math.abs(c) <= g ? 0 : Math.asin(s * f / c), i *= f, s = u * c;
        break;
      case this.OBLIQ:
        a = Math.abs(c) <= g ? this.lat0 : Math.asin(u * this.sinph0 + s * f * this.cosph0 / c), i *= f * this.cosph0, s = (u - Math.sin(a) * this.sinph0) * c;
        break;
      case this.N_POLE:
        s = -s, a = M - a;
        break;
      case this.S_POLE:
        a -= M;
        break;
    }
    e = s === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ) ? 0 : Math.atan2(i, s);
  } else {
    if (l = 0, this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (i /= this.dd, s *= this.dd, o = Math.sqrt(i * i + s * s), o < g)
        return t.x = this.long0, t.y = this.lat0, t;
      n = 2 * Math.asin(0.5 * o / this.rq), r = Math.cos(n), i *= n = Math.sin(n), this.mode === this.OBLIQ ? (l = r * this.sinb1 + s * n * this.cosb1 / o, h = this.qp * l, s = o * this.cosb1 * r - s * this.sinb1 * n) : (l = s * n / o, h = this.qp * l, s = o * r);
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (s = -s), h = i * i + s * s, !h)
        return t.x = this.long0, t.y = this.lat0, t;
      l = 1 - h / this.qp, this.mode === this.S_POLE && (l = -l);
    }
    e = Math.atan2(i, s), a = sh(Math.asin(l), this.apa);
  }
  return t.x = _(this.long0 + e), t.y = a, t;
}
var Xr = 0.3333333333333333, Kr = 0.17222222222222222, Jr = 0.10257936507936508, Zr = 0.06388888888888888, Yr = 0.0664021164021164, th = 0.016415012942191543;
function ih(t) {
  var i, s = [];
  return s[0] = t * Xr, i = t * t, s[0] += i * Kr, s[1] = i * Zr, i *= t, s[0] += i * Jr, s[1] += i * Yr, s[2] = i * th, s;
}
function sh(t, i) {
  var s = t + t;
  return t + i[0] * Math.sin(s) + i[1] * Math.sin(s + s) + i[2] * Math.sin(s + s + s);
}
var ah = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
const eh = {
  init: Wr,
  forward: Qr,
  inverse: Vr,
  names: ah,
  S_POLE: Br,
  N_POLE: jr,
  EQUIT: Fr,
  OBLIQ: Hr
};
function it(t) {
  return Math.abs(t) > 1 && (t = t > 1 ? 1 : -1), Math.asin(t);
}
function rh() {
  Math.abs(this.lat1 + this.lat2) < g || (this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e3 = Math.sqrt(this.es), this.sin_po = Math.sin(this.lat1), this.cos_po = Math.cos(this.lat1), this.t1 = this.sin_po, this.con = this.sin_po, this.ms1 = X(this.e3, this.sin_po, this.cos_po), this.qs1 = Y(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat2), this.cos_po = Math.cos(this.lat2), this.t2 = this.sin_po, this.ms2 = X(this.e3, this.sin_po, this.cos_po), this.qs2 = Y(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat0), this.cos_po = Math.cos(this.lat0), this.t3 = this.sin_po, this.qs0 = Y(this.e3, this.sin_po), Math.abs(this.lat1 - this.lat2) > g ? this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.ns0 = this.con, this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1, this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0);
}
function hh(t) {
  var i = t.x, s = t.y;
  this.sin_phi = Math.sin(s), this.cos_phi = Math.cos(s);
  var e = Y(this.e3, this.sin_phi), a = this.a * Math.sqrt(this.c - this.ns0 * e) / this.ns0, r = this.ns0 * _(i - this.long0), n = a * Math.sin(r) + this.x0, h = this.rh - a * Math.cos(r) + this.y0;
  return t.x = n, t.y = h, t;
}
function nh(t) {
  var i, s, e, a, r, n;
  return t.x -= this.x0, t.y = this.rh - t.y + this.y0, this.ns0 >= 0 ? (i = Math.sqrt(t.x * t.x + t.y * t.y), e = 1) : (i = -Math.sqrt(t.x * t.x + t.y * t.y), e = -1), a = 0, i !== 0 && (a = Math.atan2(e * t.x, e * t.y)), e = i * this.ns0 / this.a, this.sphere ? n = Math.asin((this.c - e * e) / (2 * this.ns0)) : (s = (this.c - e * e) / this.ns0, n = this.phi1z(this.e3, s)), r = _(a / this.ns0 + this.long0), t.x = r, t.y = n, t;
}
function oh(t, i) {
  var s, e, a, r, n, h = it(0.5 * i);
  if (t < g)
    return h;
  for (var o = t * t, l = 1; l <= 25; l++)
    if (s = Math.sin(h), e = Math.cos(h), a = t * s, r = 1 - a * a, n = 0.5 * r * r / e * (i / (1 - o) - s / r + 0.5 / t * Math.log((1 - a) / (1 + a))), h = h + n, Math.abs(n) <= 1e-7)
      return h;
  return null;
}
var lh = ["Albers_Conic_Equal_Area", "Albers", "aea"];
const ch = {
  init: rh,
  forward: hh,
  inverse: nh,
  names: lh,
  phi1z: oh
};
function uh() {
  this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0), this.infinity_dist = 1e3 * this.a, this.rc = 1;
}
function fh(t) {
  var i, s, e, a, r, n, h, o, l = t.x, u = t.y;
  return e = _(l - this.long0), i = Math.sin(u), s = Math.cos(u), a = Math.cos(e), n = this.sin_p14 * i + this.cos_p14 * s * a, r = 1, n > 0 || Math.abs(n) <= g ? (h = this.x0 + this.a * r * s * Math.sin(e) / n, o = this.y0 + this.a * r * (this.cos_p14 * i - this.sin_p14 * s * a) / n) : (h = this.x0 + this.infinity_dist * s * Math.sin(e), o = this.y0 + this.infinity_dist * (this.cos_p14 * i - this.sin_p14 * s * a)), t.x = h, t.y = o, t;
}
function dh(t) {
  var i, s, e, a, r, n;
  return t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, (i = Math.sqrt(t.x * t.x + t.y * t.y)) ? (a = Math.atan2(i, this.rc), s = Math.sin(a), e = Math.cos(a), n = it(e * this.sin_p14 + t.y * s * this.cos_p14 / i), r = Math.atan2(t.x * s, i * this.cos_p14 * e - t.y * this.sin_p14 * s), r = _(this.long0 + r)) : (n = this.phic0, r = 0), t.x = r, t.y = n, t;
}
var vh = ["gnom"];
const Mh = {
  init: uh,
  forward: fh,
  inverse: dh,
  names: vh
};
function mh(t, i) {
  var s = 1 - (1 - t * t) / (2 * t) * Math.log((1 - t) / (1 + t));
  if (Math.abs(Math.abs(i) - s) < 1e-6)
    return i < 0 ? -1 * M : M;
  for (var e = Math.asin(0.5 * i), a, r, n, h, o = 0; o < 30; o++)
    if (r = Math.sin(e), n = Math.cos(e), h = t * r, a = Math.pow(1 - h * h, 2) / (2 * n) * (i / (1 - t * t) - r / (1 - h * h) + 0.5 / t * Math.log((1 - h) / (1 + h))), e += a, Math.abs(a) <= 1e-10)
      return e;
  return NaN;
}
function yh() {
  this.sphere || (this.k0 = X(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)));
}
function gh(t) {
  var i = t.x, s = t.y, e, a, r = _(i - this.long0);
  if (this.sphere)
    e = this.x0 + this.a * r * Math.cos(this.lat_ts), a = this.y0 + this.a * Math.sin(s) / Math.cos(this.lat_ts);
  else {
    var n = Y(this.e, Math.sin(s));
    e = this.x0 + this.a * this.k0 * r, a = this.y0 + this.a * n * 0.5 / this.k0;
  }
  return t.x = e, t.y = a, t;
}
function _h(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, s;
  return this.sphere ? (i = _(this.long0 + t.x / this.a / Math.cos(this.lat_ts)), s = Math.asin(t.y / this.a * Math.cos(this.lat_ts))) : (s = mh(this.e, 2 * t.y * this.k0 / this.a), i = _(this.long0 + t.x / (this.a * this.k0))), t.x = i, t.y = s, t;
}
var xh = ["cea"];
const bh = {
  init: yh,
  forward: gh,
  inverse: _h,
  names: xh
};
function ph() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Equidistant Cylindrical (Plate Carre)", this.rc = Math.cos(this.lat_ts);
}
function Ah(t) {
  var i = t.x, s = t.y, e = _(i - this.long0), a = $t(s - this.lat0);
  return t.x = this.x0 + this.a * e * this.rc, t.y = this.y0 + this.a * a, t;
}
function $h(t) {
  var i = t.x, s = t.y;
  return t.x = _(this.long0 + (i - this.x0) / (this.a * this.rc)), t.y = $t(this.lat0 + (s - this.y0) / this.a), t;
}
var Eh = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
const Sh = {
  init: ph,
  forward: Ah,
  inverse: $h,
  names: Eh
};
var us = 20;
function wh() {
  this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = jt(this.es), this.e1 = Ft(this.es), this.e2 = Ht(this.es), this.e3 = Wt(this.es), this.ml0 = this.a * G(this.e0, this.e1, this.e2, this.e3, this.lat0);
}
function Ch(t) {
  var i = t.x, s = t.y, e, a, r, n = _(i - this.long0);
  if (r = n * Math.sin(s), this.sphere)
    Math.abs(s) <= g ? (e = this.a * n, a = -1 * this.a * this.lat0) : (e = this.a * Math.sin(r) / Math.tan(s), a = this.a * ($t(s - this.lat0) + (1 - Math.cos(r)) / Math.tan(s)));
  else if (Math.abs(s) <= g)
    e = this.a * n, a = -1 * this.ml0;
  else {
    var h = At(this.a, this.e, Math.sin(s)) / Math.tan(s);
    e = h * Math.sin(r), a = this.a * G(this.e0, this.e1, this.e2, this.e3, s) - this.ml0 + h * (1 - Math.cos(r));
  }
  return t.x = e + this.x0, t.y = a + this.y0, t;
}
function Nh(t) {
  var i, s, e, a, r, n, h, o, l;
  if (e = t.x - this.x0, a = t.y - this.y0, this.sphere)
    if (Math.abs(a + this.a * this.lat0) <= g)
      i = _(e / this.a + this.long0), s = 0;
    else {
      n = this.lat0 + a / this.a, h = e * e / this.a / this.a + n * n, o = n;
      var u;
      for (r = us; r; --r)
        if (u = Math.tan(o), l = -1 * (n * (o * u + 1) - o - 0.5 * (o * o + h) * u) / ((o - n) / u - 1), o += l, Math.abs(l) <= g) {
          s = o;
          break;
        }
      i = _(this.long0 + Math.asin(e * Math.tan(o) / this.a) / Math.sin(s));
    }
  else if (Math.abs(a + this.ml0) <= g)
    s = 0, i = _(this.long0 + e / this.a);
  else {
    n = (this.ml0 + a) / this.a, h = e * e / this.a / this.a + n * n, o = n;
    var c, f, d, v, m;
    for (r = us; r; --r)
      if (m = this.e * Math.sin(o), c = Math.sqrt(1 - m * m) * Math.tan(o), f = this.a * G(this.e0, this.e1, this.e2, this.e3, o), d = this.e0 - 2 * this.e1 * Math.cos(2 * o) + 4 * this.e2 * Math.cos(4 * o) - 6 * this.e3 * Math.cos(6 * o), v = f / this.a, l = (n * (c * v + 1) - v - 0.5 * c * (v * v + h)) / (this.es * Math.sin(2 * o) * (v * v + h - 2 * n * v) / (4 * c) + (n - v) * (c * d - 2 / Math.sin(2 * o)) - d), o -= l, Math.abs(l) <= g) {
        s = o;
        break;
      }
    c = Math.sqrt(1 - this.es * Math.pow(Math.sin(s), 2)) * Math.tan(s), i = _(this.long0 + Math.asin(e * c / this.a) / Math.sin(s));
  }
  return t.x = i, t.y = s, t;
}
var Ph = ["Polyconic", "poly"];
const Ih = {
  init: wh,
  forward: Ch,
  inverse: Nh,
  names: Ph
};
function Oh() {
  this.A = [], this.A[1] = 0.6399175073, this.A[2] = -0.1358797613, this.A[3] = 0.063294409, this.A[4] = -0.02526853, this.A[5] = 0.0117879, this.A[6] = -55161e-7, this.A[7] = 26906e-7, this.A[8] = -1333e-6, this.A[9] = 67e-5, this.A[10] = -34e-5, this.B_re = [], this.B_im = [], this.B_re[1] = 0.7557853228, this.B_im[1] = 0, this.B_re[2] = 0.249204646, this.B_im[2] = 3371507e-9, this.B_re[3] = -1541739e-9, this.B_im[3] = 0.04105856, this.B_re[4] = -0.10162907, this.B_im[4] = 0.01727609, this.B_re[5] = -0.26623489, this.B_im[5] = -0.36249218, this.B_re[6] = -0.6870983, this.B_im[6] = -1.1651967, this.C_re = [], this.C_im = [], this.C_re[1] = 1.3231270439, this.C_im[1] = 0, this.C_re[2] = -0.577245789, this.C_im[2] = -7809598e-9, this.C_re[3] = 0.508307513, this.C_im[3] = -0.112208952, this.C_re[4] = -0.15094762, this.C_im[4] = 0.18200602, this.C_re[5] = 1.01418179, this.C_im[5] = 1.64497696, this.C_re[6] = 1.9660549, this.C_im[6] = 2.5127645, this.D = [], this.D[1] = 1.5627014243, this.D[2] = 0.5185406398, this.D[3] = -0.03333098, this.D[4] = -0.1052906, this.D[5] = -0.0368594, this.D[6] = 7317e-6, this.D[7] = 0.0122, this.D[8] = 394e-5, this.D[9] = -13e-4;
}
function Rh(t) {
  var i, s = t.x, e = t.y, a = e - this.lat0, r = s - this.long0, n = a / Ot * 1e-5, h = r, o = 1, l = 0;
  for (i = 1; i <= 10; i++)
    o = o * n, l = l + this.A[i] * o;
  var u = l, c = h, f = 1, d = 0, v, m, y = 0, x = 0;
  for (i = 1; i <= 6; i++)
    v = f * u - d * c, m = d * u + f * c, f = v, d = m, y = y + this.B_re[i] * f - this.B_im[i] * d, x = x + this.B_im[i] * f + this.B_re[i] * d;
  return t.x = x * this.a + this.x0, t.y = y * this.a + this.y0, t;
}
function Th(t) {
  var i, s = t.x, e = t.y, a = s - this.x0, r = e - this.y0, n = r / this.a, h = a / this.a, o = 1, l = 0, u, c, f = 0, d = 0;
  for (i = 1; i <= 6; i++)
    u = o * n - l * h, c = l * n + o * h, o = u, l = c, f = f + this.C_re[i] * o - this.C_im[i] * l, d = d + this.C_im[i] * o + this.C_re[i] * l;
  for (var v = 0; v < this.iterations; v++) {
    var m = f, y = d, x, p, $ = n, C = h;
    for (i = 2; i <= 6; i++)
      x = m * f - y * d, p = y * f + m * d, m = x, y = p, $ = $ + (i - 1) * (this.B_re[i] * m - this.B_im[i] * y), C = C + (i - 1) * (this.B_im[i] * m + this.B_re[i] * y);
    m = 1, y = 0;
    var E = this.B_re[1], b = this.B_im[1];
    for (i = 2; i <= 6; i++)
      x = m * f - y * d, p = y * f + m * d, m = x, y = p, E = E + i * (this.B_re[i] * m - this.B_im[i] * y), b = b + i * (this.B_im[i] * m + this.B_re[i] * y);
    var P = E * E + b * b;
    f = ($ * E + C * b) / P, d = (C * E - $ * b) / P;
  }
  var N = f, B = d, st = 1, at = 0;
  for (i = 1; i <= 9; i++)
    st = st * N, at = at + this.D[i] * st;
  var Qt = this.lat0 + at * Ot * 1e5, Xs = this.long0 + B;
  return t.x = Xs, t.y = Qt, t;
}
var Lh = ["New_Zealand_Map_Grid", "nzmg"];
const qh = {
  init: Oh,
  forward: Rh,
  inverse: Th,
  names: Lh
};
function kh() {
}
function Gh(t) {
  var i = t.x, s = t.y, e = _(i - this.long0), a = this.x0 + this.a * e, r = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + s / 2.5)) * 1.25;
  return t.x = a, t.y = r, t;
}
function zh(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = _(this.long0 + t.x / this.a), s = 2.5 * (Math.atan(Math.exp(0.8 * t.y / this.a)) - Math.PI / 4);
  return t.x = i, t.y = s, t;
}
var Uh = ["Miller_Cylindrical", "mill"];
const Dh = {
  init: kh,
  forward: Gh,
  inverse: zh,
  names: Uh
};
var Bh = 20;
function jh() {
  this.sphere ? (this.n = 1, this.m = 0, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1)) : this.en = Us(this.es);
}
function Fh(t) {
  var i, s, e = t.x, a = t.y;
  if (e = _(e - this.long0), this.sphere) {
    if (!this.m)
      a = this.n !== 1 ? Math.asin(this.n * Math.sin(a)) : a;
    else
      for (var r = this.n * Math.sin(a), n = Bh; n; --n) {
        var h = (this.m * a + Math.sin(a) - r) / (this.m + Math.cos(a));
        if (a -= h, Math.abs(h) < g)
          break;
      }
    i = this.a * this.C_x * e * (this.m + Math.cos(a)), s = this.a * this.C_y * a;
  } else {
    var o = Math.sin(a), l = Math.cos(a);
    s = this.a * ci(a, o, l, this.en), i = this.a * e * l / Math.sqrt(1 - this.es * o * o);
  }
  return t.x = i, t.y = s, t;
}
function Hh(t) {
  var i, s, e, a;
  return t.x -= this.x0, e = t.x / this.a, t.y -= this.y0, i = t.y / this.a, this.sphere ? (i /= this.C_y, e = e / (this.C_x * (this.m + Math.cos(i))), this.m ? i = it((this.m * i + Math.sin(i)) / this.n) : this.n !== 1 && (i = it(Math.sin(i) / this.n)), e = _(e + this.long0), i = $t(i)) : (i = Ds(t.y / this.a, this.es, this.en), a = Math.abs(i), a < M ? (a = Math.sin(i), s = this.long0 + t.x * Math.sqrt(1 - this.es * a * a) / (this.a * Math.cos(i)), e = _(s)) : a - g < M && (e = this.long0)), t.x = e, t.y = i, t;
}
var Wh = ["Sinusoidal", "sinu"];
const Qh = {
  init: jh,
  forward: Fh,
  inverse: Hh,
  names: Wh
};
function Vh() {
}
function Xh(t) {
  for (var i = t.x, s = t.y, e = _(i - this.long0), a = s, r = Math.PI * Math.sin(s); ; ) {
    var n = -(a + Math.sin(a) - r) / (1 + Math.cos(a));
    if (a += n, Math.abs(n) < g)
      break;
  }
  a /= 2, Math.PI / 2 - Math.abs(s) < g && (e = 0);
  var h = 0.900316316158 * this.a * e * Math.cos(a) + this.x0, o = 1.4142135623731 * this.a * Math.sin(a) + this.y0;
  return t.x = h, t.y = o, t;
}
function Kh(t) {
  var i, s;
  t.x -= this.x0, t.y -= this.y0, s = t.y / (1.4142135623731 * this.a), Math.abs(s) > 0.999999999999 && (s = 0.999999999999), i = Math.asin(s);
  var e = _(this.long0 + t.x / (0.900316316158 * this.a * Math.cos(i)));
  e < -Math.PI && (e = -Math.PI), e > Math.PI && (e = Math.PI), s = (2 * i + Math.sin(2 * i)) / Math.PI, Math.abs(s) > 1 && (s = 1);
  var a = Math.asin(s);
  return t.x = e, t.y = a, t;
}
var Jh = ["Mollweide", "moll"];
const Zh = {
  init: Vh,
  forward: Xh,
  inverse: Kh,
  names: Jh
};
function Yh() {
  Math.abs(this.lat1 + this.lat2) < g || (this.lat2 = this.lat2 || this.lat1, this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = jt(this.es), this.e1 = Ft(this.es), this.e2 = Ht(this.es), this.e3 = Wt(this.es), this.sinphi = Math.sin(this.lat1), this.cosphi = Math.cos(this.lat1), this.ms1 = X(this.e, this.sinphi, this.cosphi), this.ml1 = G(this.e0, this.e1, this.e2, this.e3, this.lat1), Math.abs(this.lat1 - this.lat2) < g ? this.ns = this.sinphi : (this.sinphi = Math.sin(this.lat2), this.cosphi = Math.cos(this.lat2), this.ms2 = X(this.e, this.sinphi, this.cosphi), this.ml2 = G(this.e0, this.e1, this.e2, this.e3, this.lat2), this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1)), this.g = this.ml1 + this.ms1 / this.ns, this.ml0 = G(this.e0, this.e1, this.e2, this.e3, this.lat0), this.rh = this.a * (this.g - this.ml0));
}
function tn(t) {
  var i = t.x, s = t.y, e;
  if (this.sphere)
    e = this.a * (this.g - s);
  else {
    var a = G(this.e0, this.e1, this.e2, this.e3, s);
    e = this.a * (this.g - a);
  }
  var r = this.ns * _(i - this.long0), n = this.x0 + e * Math.sin(r), h = this.y0 + this.rh - e * Math.cos(r);
  return t.x = n, t.y = h, t;
}
function sn(t) {
  t.x -= this.x0, t.y = this.rh - t.y + this.y0;
  var i, s, e, a;
  this.ns >= 0 ? (s = Math.sqrt(t.x * t.x + t.y * t.y), i = 1) : (s = -Math.sqrt(t.x * t.x + t.y * t.y), i = -1);
  var r = 0;
  if (s !== 0 && (r = Math.atan2(i * t.x, i * t.y)), this.sphere)
    return a = _(this.long0 + r / this.ns), e = $t(this.g - s / this.a), t.x = a, t.y = e, t;
  var n = this.g - s / this.a;
  return e = ri(n, this.e0, this.e1, this.e2, this.e3), a = _(this.long0 + r / this.ns), t.x = a, t.y = e, t;
}
var an = ["Equidistant_Conic", "eqdc"];
const en = {
  init: Yh,
  forward: tn,
  inverse: sn,
  names: an
};
function rn() {
  this.R = this.a;
}
function hn(t) {
  var i = t.x, s = t.y, e = _(i - this.long0), a, r;
  Math.abs(s) <= g && (a = this.x0 + this.R * e, r = this.y0);
  var n = it(2 * Math.abs(s / Math.PI));
  (Math.abs(e) <= g || Math.abs(Math.abs(s) - M) <= g) && (a = this.x0, s >= 0 ? r = this.y0 + Math.PI * this.R * Math.tan(0.5 * n) : r = this.y0 + Math.PI * this.R * -Math.tan(0.5 * n));
  var h = 0.5 * Math.abs(Math.PI / e - e / Math.PI), o = h * h, l = Math.sin(n), u = Math.cos(n), c = u / (l + u - 1), f = c * c, d = c * (2 / l - 1), v = d * d, m = Math.PI * this.R * (h * (c - v) + Math.sqrt(o * (c - v) * (c - v) - (v + o) * (f - v))) / (v + o);
  e < 0 && (m = -m), a = this.x0 + m;
  var y = o + c;
  return m = Math.PI * this.R * (d * y - h * Math.sqrt((v + o) * (o + 1) - y * y)) / (v + o), s >= 0 ? r = this.y0 + m : r = this.y0 - m, t.x = a, t.y = r, t;
}
function nn(t) {
  var i, s, e, a, r, n, h, o, l, u, c, f, d;
  return t.x -= this.x0, t.y -= this.y0, c = Math.PI * this.R, e = t.x / c, a = t.y / c, r = e * e + a * a, n = -Math.abs(a) * (1 + r), h = n - 2 * a * a + e * e, o = -2 * n + 1 + 2 * a * a + r * r, d = a * a / o + (2 * h * h * h / o / o / o - 9 * n * h / o / o) / 27, l = (n - h * h / 3 / o) / o, u = 2 * Math.sqrt(-l / 3), c = 3 * d / l / u, Math.abs(c) > 1 && (c >= 0 ? c = 1 : c = -1), f = Math.acos(c) / 3, t.y >= 0 ? s = (-u * Math.cos(f + Math.PI / 3) - h / 3 / o) * Math.PI : s = -(-u * Math.cos(f + Math.PI / 3) - h / 3 / o) * Math.PI, Math.abs(e) < g ? i = this.long0 : i = _(this.long0 + Math.PI * (r - 1 + Math.sqrt(1 + 2 * (e * e - a * a) + r * r)) / 2 / e), t.x = i, t.y = s, t;
}
var on = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
const ln = {
  init: rn,
  forward: hn,
  inverse: nn,
  names: on
};
function cn() {
  this.sin_p12 = Math.sin(this.lat0), this.cos_p12 = Math.cos(this.lat0);
}
function un(t) {
  var i = t.x, s = t.y, e = Math.sin(t.y), a = Math.cos(t.y), r = _(i - this.long0), n, h, o, l, u, c, f, d, v, m, y, x, p, $, C, E, b, P, N, B, st, at, Qt;
  return this.sphere ? Math.abs(this.sin_p12 - 1) <= g ? (t.x = this.x0 + this.a * (M - s) * Math.sin(r), t.y = this.y0 - this.a * (M - s) * Math.cos(r), t) : Math.abs(this.sin_p12 + 1) <= g ? (t.x = this.x0 + this.a * (M + s) * Math.sin(r), t.y = this.y0 + this.a * (M + s) * Math.cos(r), t) : (P = this.sin_p12 * e + this.cos_p12 * a * Math.cos(r), E = Math.acos(P), b = E ? E / Math.sin(E) : 1, t.x = this.x0 + this.a * b * a * Math.sin(r), t.y = this.y0 + this.a * b * (this.cos_p12 * e - this.sin_p12 * a * Math.cos(r)), t) : (n = jt(this.es), h = Ft(this.es), o = Ht(this.es), l = Wt(this.es), Math.abs(this.sin_p12 - 1) <= g ? (u = this.a * G(n, h, o, l, M), c = this.a * G(n, h, o, l, s), t.x = this.x0 + (u - c) * Math.sin(r), t.y = this.y0 - (u - c) * Math.cos(r), t) : Math.abs(this.sin_p12 + 1) <= g ? (u = this.a * G(n, h, o, l, M), c = this.a * G(n, h, o, l, s), t.x = this.x0 + (u + c) * Math.sin(r), t.y = this.y0 + (u + c) * Math.cos(r), t) : (f = e / a, d = At(this.a, this.e, this.sin_p12), v = At(this.a, this.e, e), m = Math.atan((1 - this.es) * f + this.es * d * this.sin_p12 / (v * a)), y = Math.atan2(Math.sin(r), this.cos_p12 * Math.tan(m) - this.sin_p12 * Math.cos(r)), y === 0 ? N = Math.asin(this.cos_p12 * Math.sin(m) - this.sin_p12 * Math.cos(m)) : Math.abs(Math.abs(y) - Math.PI) <= g ? N = -Math.asin(this.cos_p12 * Math.sin(m) - this.sin_p12 * Math.cos(m)) : N = Math.asin(Math.sin(r) * Math.cos(m) / Math.sin(y)), x = this.e * this.sin_p12 / Math.sqrt(1 - this.es), p = this.e * this.cos_p12 * Math.cos(y) / Math.sqrt(1 - this.es), $ = x * p, C = p * p, B = N * N, st = B * N, at = st * N, Qt = at * N, E = d * N * (1 - B * C * (1 - C) / 6 + st / 8 * $ * (1 - 2 * C) + at / 120 * (C * (4 - 7 * C) - 3 * x * x * (1 - 7 * C)) - Qt / 48 * $), t.x = this.x0 + E * Math.sin(y), t.y = this.y0 + E * Math.cos(y), t));
}
function fn(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, s, e, a, r, n, h, o, l, u, c, f, d, v, m, y, x, p, $, C, E, b, P, N;
  return this.sphere ? (i = Math.sqrt(t.x * t.x + t.y * t.y), i > 2 * M * this.a ? void 0 : (s = i / this.a, e = Math.sin(s), a = Math.cos(s), r = this.long0, Math.abs(i) <= g ? n = this.lat0 : (n = it(a * this.sin_p12 + t.y * e * this.cos_p12 / i), h = Math.abs(this.lat0) - M, Math.abs(h) <= g ? this.lat0 >= 0 ? r = _(this.long0 + Math.atan2(t.x, -t.y)) : r = _(this.long0 - Math.atan2(-t.x, t.y)) : r = _(this.long0 + Math.atan2(t.x * e, i * this.cos_p12 * a - t.y * this.sin_p12 * e))), t.x = r, t.y = n, t)) : (o = jt(this.es), l = Ft(this.es), u = Ht(this.es), c = Wt(this.es), Math.abs(this.sin_p12 - 1) <= g ? (f = this.a * G(o, l, u, c, M), i = Math.sqrt(t.x * t.x + t.y * t.y), d = f - i, n = ri(d / this.a, o, l, u, c), r = _(this.long0 + Math.atan2(t.x, -1 * t.y)), t.x = r, t.y = n, t) : Math.abs(this.sin_p12 + 1) <= g ? (f = this.a * G(o, l, u, c, M), i = Math.sqrt(t.x * t.x + t.y * t.y), d = i - f, n = ri(d / this.a, o, l, u, c), r = _(this.long0 + Math.atan2(t.x, t.y)), t.x = r, t.y = n, t) : (i = Math.sqrt(t.x * t.x + t.y * t.y), y = Math.atan2(t.x, t.y), v = At(this.a, this.e, this.sin_p12), x = Math.cos(y), p = this.e * this.cos_p12 * x, $ = -p * p / (1 - this.es), C = 3 * this.es * (1 - $) * this.sin_p12 * this.cos_p12 * x / (1 - this.es), E = i / v, b = E - $ * (1 + $) * Math.pow(E, 3) / 6 - C * (1 + 3 * $) * Math.pow(E, 4) / 24, P = 1 - $ * b * b / 2 - E * b * b * b / 6, m = Math.asin(this.sin_p12 * Math.cos(b) + this.cos_p12 * Math.sin(b) * x), r = _(this.long0 + Math.asin(Math.sin(y) * Math.sin(b) / Math.cos(m))), N = Math.sin(m), n = Math.atan2((N - this.es * P * this.sin_p12) * Math.tan(m), N * (1 - this.es)), t.x = r, t.y = n, t));
}
var dn = ["Azimuthal_Equidistant", "aeqd"];
const vn = {
  init: cn,
  forward: un,
  inverse: fn,
  names: dn
};
function Mn() {
  this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0);
}
function mn(t) {
  var i, s, e, a, r, n, h, o, l = t.x, u = t.y;
  return e = _(l - this.long0), i = Math.sin(u), s = Math.cos(u), a = Math.cos(e), n = this.sin_p14 * i + this.cos_p14 * s * a, r = 1, (n > 0 || Math.abs(n) <= g) && (h = this.a * r * s * Math.sin(e), o = this.y0 + this.a * r * (this.cos_p14 * i - this.sin_p14 * s * a)), t.x = h, t.y = o, t;
}
function yn(t) {
  var i, s, e, a, r, n, h;
  return t.x -= this.x0, t.y -= this.y0, i = Math.sqrt(t.x * t.x + t.y * t.y), s = it(i / this.a), e = Math.sin(s), a = Math.cos(s), n = this.long0, Math.abs(i) <= g ? (h = this.lat0, t.x = n, t.y = h, t) : (h = it(a * this.sin_p14 + t.y * e * this.cos_p14 / i), r = Math.abs(this.lat0) - M, Math.abs(r) <= g ? (this.lat0 >= 0 ? n = _(this.long0 + Math.atan2(t.x, -t.y)) : n = _(this.long0 - Math.atan2(-t.x, t.y)), t.x = n, t.y = h, t) : (n = _(this.long0 + Math.atan2(t.x * e, i * this.cos_p14 * a - t.y * this.sin_p14 * e)), t.x = n, t.y = h, t));
}
var gn = ["ortho"];
const _n = {
  init: Mn,
  forward: mn,
  inverse: yn,
  names: gn
};
var I = {
  FRONT: 1,
  RIGHT: 2,
  BACK: 3,
  LEFT: 4,
  TOP: 5,
  BOTTOM: 6
}, w = {
  AREA_0: 1,
  AREA_1: 2,
  AREA_2: 3,
  AREA_3: 4
};
function xn() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Quadrilateralized Spherical Cube", this.lat0 >= M - S / 2 ? this.face = I.TOP : this.lat0 <= -(M - S / 2) ? this.face = I.BOTTOM : Math.abs(this.long0) <= S ? this.face = I.FRONT : Math.abs(this.long0) <= M + S ? this.face = this.long0 > 0 ? I.RIGHT : I.LEFT : this.face = I.BACK, this.es !== 0 && (this.one_minus_f = 1 - (this.a - this.b) / this.a, this.one_minus_f_squared = this.one_minus_f * this.one_minus_f);
}
function bn(t) {
  var i = { x: 0, y: 0 }, s, e, a, r, n, h, o = { value: 0 };
  if (t.x -= this.long0, this.es !== 0 ? s = Math.atan(this.one_minus_f_squared * Math.tan(t.y)) : s = t.y, e = t.x, this.face === I.TOP)
    r = M - s, e >= S && e <= M + S ? (o.value = w.AREA_0, a = e - M) : e > M + S || e <= -(M + S) ? (o.value = w.AREA_1, a = e > 0 ? e - O : e + O) : e > -(M + S) && e <= -S ? (o.value = w.AREA_2, a = e + M) : (o.value = w.AREA_3, a = e);
  else if (this.face === I.BOTTOM)
    r = M + s, e >= S && e <= M + S ? (o.value = w.AREA_0, a = -e + M) : e < S && e >= -S ? (o.value = w.AREA_1, a = -e) : e < -S && e >= -(M + S) ? (o.value = w.AREA_2, a = -e - M) : (o.value = w.AREA_3, a = e > 0 ? -e + O : -e - O);
  else {
    var l, u, c, f, d, v, m;
    this.face === I.RIGHT ? e = gt(e, +M) : this.face === I.BACK ? e = gt(e, +O) : this.face === I.LEFT && (e = gt(e, -M)), f = Math.sin(s), d = Math.cos(s), v = Math.sin(e), m = Math.cos(e), l = d * m, u = d * v, c = f, this.face === I.FRONT ? (r = Math.acos(l), a = Xt(r, c, u, o)) : this.face === I.RIGHT ? (r = Math.acos(u), a = Xt(r, c, -l, o)) : this.face === I.BACK ? (r = Math.acos(-l), a = Xt(r, c, -u, o)) : this.face === I.LEFT ? (r = Math.acos(-u), a = Xt(r, c, l, o)) : (r = a = 0, o.value = w.AREA_0);
  }
  return h = Math.atan(12 / O * (a + Math.acos(Math.sin(a) * Math.cos(S)) - M)), n = Math.sqrt((1 - Math.cos(r)) / (Math.cos(h) * Math.cos(h)) / (1 - Math.cos(Math.atan(1 / Math.cos(a))))), o.value === w.AREA_1 ? h += M : o.value === w.AREA_2 ? h += O : o.value === w.AREA_3 && (h += 1.5 * O), i.x = n * Math.cos(h), i.y = n * Math.sin(h), i.x = i.x * this.a + this.x0, i.y = i.y * this.a + this.y0, t.x = i.x, t.y = i.y, t;
}
function pn(t) {
  var i = { lam: 0, phi: 0 }, s, e, a, r, n, h, o, l, u, c = { value: 0 };
  if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, e = Math.atan(Math.sqrt(t.x * t.x + t.y * t.y)), s = Math.atan2(t.y, t.x), t.x >= 0 && t.x >= Math.abs(t.y) ? c.value = w.AREA_0 : t.y >= 0 && t.y >= Math.abs(t.x) ? (c.value = w.AREA_1, s -= M) : t.x < 0 && -t.x >= Math.abs(t.y) ? (c.value = w.AREA_2, s = s < 0 ? s + O : s - O) : (c.value = w.AREA_3, s += M), u = O / 12 * Math.tan(s), n = Math.sin(u) / (Math.cos(u) - 1 / Math.sqrt(2)), h = Math.atan(n), a = Math.cos(s), r = Math.tan(e), o = 1 - a * a * r * r * (1 - Math.cos(Math.atan(1 / Math.cos(h)))), o < -1 ? o = -1 : o > 1 && (o = 1), this.face === I.TOP)
    l = Math.acos(o), i.phi = M - l, c.value === w.AREA_0 ? i.lam = h + M : c.value === w.AREA_1 ? i.lam = h < 0 ? h + O : h - O : c.value === w.AREA_2 ? i.lam = h - M : i.lam = h;
  else if (this.face === I.BOTTOM)
    l = Math.acos(o), i.phi = l - M, c.value === w.AREA_0 ? i.lam = -h + M : c.value === w.AREA_1 ? i.lam = -h : c.value === w.AREA_2 ? i.lam = -h - M : i.lam = h < 0 ? -h - O : -h + O;
  else {
    var f, d, v;
    f = o, u = f * f, u >= 1 ? v = 0 : v = Math.sqrt(1 - u) * Math.sin(h), u += v * v, u >= 1 ? d = 0 : d = Math.sqrt(1 - u), c.value === w.AREA_1 ? (u = d, d = -v, v = u) : c.value === w.AREA_2 ? (d = -d, v = -v) : c.value === w.AREA_3 && (u = d, d = v, v = -u), this.face === I.RIGHT ? (u = f, f = -d, d = u) : this.face === I.BACK ? (f = -f, d = -d) : this.face === I.LEFT && (u = f, f = d, d = -u), i.phi = Math.acos(-v) - M, i.lam = Math.atan2(d, f), this.face === I.RIGHT ? i.lam = gt(i.lam, -M) : this.face === I.BACK ? i.lam = gt(i.lam, -O) : this.face === I.LEFT && (i.lam = gt(i.lam, +M));
  }
  if (this.es !== 0) {
    var m, y, x;
    m = i.phi < 0 ? 1 : 0, y = Math.tan(i.phi), x = this.b / Math.sqrt(y * y + this.one_minus_f_squared), i.phi = Math.atan(Math.sqrt(this.a * this.a - x * x) / (this.one_minus_f * x)), m && (i.phi = -i.phi);
  }
  return i.lam += this.long0, t.x = i.lam, t.y = i.phi, t;
}
function Xt(t, i, s, e) {
  var a;
  return t < g ? (e.value = w.AREA_0, a = 0) : (a = Math.atan2(i, s), Math.abs(a) <= S ? e.value = w.AREA_0 : a > S && a <= M + S ? (e.value = w.AREA_1, a -= M) : a > M + S || a <= -(M + S) ? (e.value = w.AREA_2, a = a >= 0 ? a - O : a + O) : (e.value = w.AREA_3, a += M)), a;
}
function gt(t, i) {
  var s = t + i;
  return s < -O ? s += zt : s > +O && (s -= zt), s;
}
var An = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
const $n = {
  init: xn,
  forward: bn,
  inverse: pn,
  names: An
};
var $i = [
  [1, 22199e-21, -715515e-10, 31103e-10],
  [0.9986, -482243e-9, -24897e-9, -13309e-10],
  [0.9954, -83103e-8, -448605e-10, -986701e-12],
  [0.99, -135364e-8, -59661e-9, 36777e-10],
  [0.9822, -167442e-8, -449547e-11, -572411e-11],
  [0.973, -214868e-8, -903571e-10, 18736e-12],
  [0.96, -305085e-8, -900761e-10, 164917e-11],
  [0.9427, -382792e-8, -653386e-10, -26154e-10],
  [0.9216, -467746e-8, -10457e-8, 481243e-11],
  [0.8962, -536223e-8, -323831e-10, -543432e-11],
  [0.8679, -609363e-8, -113898e-9, 332484e-11],
  [0.835, -698325e-8, -640253e-10, 934959e-12],
  [0.7986, -755338e-8, -500009e-10, 935324e-12],
  [0.7597, -798324e-8, -35971e-9, -227626e-11],
  [0.7186, -851367e-8, -701149e-10, -86303e-10],
  [0.6732, -986209e-8, -199569e-9, 191974e-10],
  [0.6213, -0.010418, 883923e-10, 624051e-11],
  [0.5722, -906601e-8, 182e-6, 624051e-11],
  [0.5322, -677797e-8, 275608e-9, 624051e-11]
], Nt = [
  [-520417e-23, 0.0124, 121431e-23, -845284e-16],
  [0.062, 0.0124, -126793e-14, 422642e-15],
  [0.124, 0.0124, 507171e-14, -160604e-14],
  [0.186, 0.0123999, -190189e-13, 600152e-14],
  [0.248, 0.0124002, 710039e-13, -224e-10],
  [0.31, 0.0123992, -264997e-12, 835986e-13],
  [0.372, 0.0124029, 988983e-12, -311994e-12],
  [0.434, 0.0123893, -369093e-11, -435621e-12],
  [0.4958, 0.0123198, -102252e-10, -345523e-12],
  [0.5571, 0.0121916, -154081e-10, -582288e-12],
  [0.6176, 0.0119938, -241424e-10, -525327e-12],
  [0.6769, 0.011713, -320223e-10, -516405e-12],
  [0.7346, 0.0113541, -397684e-10, -609052e-12],
  [0.7903, 0.0109107, -489042e-10, -104739e-11],
  [0.8435, 0.0103431, -64615e-9, -140374e-14],
  [0.8936, 969686e-8, -64636e-9, -8547e-9],
  [0.9394, 840947e-8, -192841e-9, -42106e-10],
  [0.9761, 616527e-8, -256e-6, -42106e-10],
  [1, 328947e-8, -319159e-9, -42106e-10]
], Fs = 0.8487, Hs = 1.3523, Ws = Q / 5, En = 1 / Ws, Mt = 18, hi = function(t, i) {
  return t[0] + i * (t[1] + i * (t[2] + i * t[3]));
}, Sn = function(t, i) {
  return t[1] + i * (2 * t[2] + i * 3 * t[3]);
};
function wn(t, i, s, e) {
  for (var a = i; e; --e) {
    var r = t(a);
    if (a -= r, Math.abs(r) < s)
      break;
  }
  return a;
}
function Cn() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.es = 0, this.title = this.title || "Robinson";
}
function Nn(t) {
  var i = _(t.x - this.long0), s = Math.abs(t.y), e = Math.floor(s * Ws);
  e < 0 ? e = 0 : e >= Mt && (e = Mt - 1), s = Q * (s - En * e);
  var a = {
    x: hi($i[e], s) * i,
    y: hi(Nt[e], s)
  };
  return t.y < 0 && (a.y = -a.y), a.x = a.x * this.a * Fs + this.x0, a.y = a.y * this.a * Hs + this.y0, a;
}
function Pn(t) {
  var i = {
    x: (t.x - this.x0) / (this.a * Fs),
    y: Math.abs(t.y - this.y0) / (this.a * Hs)
  };
  if (i.y >= 1)
    i.x /= $i[Mt][0], i.y = t.y < 0 ? -M : M;
  else {
    var s = Math.floor(i.y * Mt);
    for (s < 0 ? s = 0 : s >= Mt && (s = Mt - 1); ; )
      if (Nt[s][0] > i.y)
        --s;
      else if (Nt[s + 1][0] <= i.y)
        ++s;
      else
        break;
    var e = Nt[s], a = 5 * (i.y - e[0]) / (Nt[s + 1][0] - e[0]);
    a = wn(function(r) {
      return (hi(e, r) - i.y) / Sn(e, r);
    }, a, g, 100), i.x /= hi($i[s], a), i.y = (5 * s + a) * L, t.y < 0 && (i.y = -i.y);
  }
  return i.x = _(i.x + this.long0), i;
}
var In = ["Robinson", "robin"];
const On = {
  init: Cn,
  forward: Nn,
  inverse: Pn,
  names: In
};
function Rn() {
  this.name = "geocent";
}
function Tn(t) {
  var i = Is(t, this.es, this.a);
  return i;
}
function Ln(t) {
  var i = Os(t, this.es, this.a, this.b);
  return i;
}
var qn = ["Geocentric", "geocentric", "geocent", "Geocent"];
const kn = {
  init: Rn,
  forward: Tn,
  inverse: Ln,
  names: qn
};
var q = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
}, St = {
  h: { def: 1e5, num: !0 },
  // default is Karman line, no default in PROJ.7
  azi: { def: 0, num: !0, degrees: !0 },
  // default is North
  tilt: { def: 0, num: !0, degrees: !0 },
  // default is Nadir
  long0: { def: 0, num: !0 },
  // default is Greenwich, conversion to rad is automatic
  lat0: { def: 0, num: !0 }
  // default is Equator, conversion to rad is automatic
};
function Gn() {
  if (Object.keys(St).forEach((function(s) {
    if (typeof this[s] > "u")
      this[s] = St[s].def;
    else {
      if (St[s].num && isNaN(this[s]))
        throw new Error("Invalid parameter value, must be numeric " + s + " = " + this[s]);
      St[s].num && (this[s] = parseFloat(this[s]));
    }
    St[s].degrees && (this[s] = this[s] * L);
  }).bind(this)), Math.abs(Math.abs(this.lat0) - M) < g ? this.mode = this.lat0 < 0 ? q.S_POLE : q.N_POLE : Math.abs(this.lat0) < g ? this.mode = q.EQUIT : (this.mode = q.OBLIQ, this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0)), this.pn1 = this.h / this.a, this.pn1 <= 0 || this.pn1 > 1e10)
    throw new Error("Invalid height");
  this.p = 1 + this.pn1, this.rp = 1 / this.p, this.h1 = 1 / this.pn1, this.pfact = (this.p + 1) * this.h1, this.es = 0;
  var t = this.tilt, i = this.azi;
  this.cg = Math.cos(i), this.sg = Math.sin(i), this.cw = Math.cos(t), this.sw = Math.sin(t);
}
function zn(t) {
  t.x -= this.long0;
  var i = Math.sin(t.y), s = Math.cos(t.y), e = Math.cos(t.x), a, r;
  switch (this.mode) {
    case q.OBLIQ:
      r = this.sinph0 * i + this.cosph0 * s * e;
      break;
    case q.EQUIT:
      r = s * e;
      break;
    case q.S_POLE:
      r = -i;
      break;
    case q.N_POLE:
      r = i;
      break;
  }
  switch (r = this.pn1 / (this.p - r), a = r * s * Math.sin(t.x), this.mode) {
    case q.OBLIQ:
      r *= this.cosph0 * i - this.sinph0 * s * e;
      break;
    case q.EQUIT:
      r *= i;
      break;
    case q.N_POLE:
      r *= -(s * e);
      break;
    case q.S_POLE:
      r *= s * e;
      break;
  }
  var n, h;
  return n = r * this.cg + a * this.sg, h = 1 / (n * this.sw * this.h1 + this.cw), a = (a * this.cg - r * this.sg) * this.cw * h, r = n * h, t.x = a * this.a, t.y = r * this.a, t;
}
function Un(t) {
  t.x /= this.a, t.y /= this.a;
  var i = { x: t.x, y: t.y }, s, e, a;
  a = 1 / (this.pn1 - t.y * this.sw), s = this.pn1 * t.x * a, e = this.pn1 * t.y * this.cw * a, t.x = s * this.cg + e * this.sg, t.y = e * this.cg - s * this.sg;
  var r = F(t.x, t.y);
  if (Math.abs(r) < g)
    i.x = 0, i.y = t.y;
  else {
    var n, h;
    switch (h = 1 - r * r * this.pfact, h = (this.p - Math.sqrt(h)) / (this.pn1 / r + r / this.pn1), n = Math.sqrt(1 - h * h), this.mode) {
      case q.OBLIQ:
        i.y = Math.asin(n * this.sinph0 + t.y * h * this.cosph0 / r), t.y = (n - this.sinph0 * Math.sin(i.y)) * r, t.x *= h * this.cosph0;
        break;
      case q.EQUIT:
        i.y = Math.asin(t.y * h / r), t.y = n * r, t.x *= h;
        break;
      case q.N_POLE:
        i.y = Math.asin(n), t.y = -t.y;
        break;
      case q.S_POLE:
        i.y = -Math.asin(n);
        break;
    }
    i.x = Math.atan2(t.x, t.y);
  }
  return t.x = i.x + this.long0, t.y = i.y, t;
}
var Dn = ["Tilted_Perspective", "tpers"];
const Bn = {
  init: Gn,
  forward: zn,
  inverse: Un,
  names: Dn
};
function jn() {
  if (this.flip_axis = this.sweep === "x" ? 1 : 0, this.h = Number(this.h), this.radius_g_1 = this.h / this.a, this.radius_g_1 <= 0 || this.radius_g_1 > 1e10)
    throw new Error();
  if (this.radius_g = 1 + this.radius_g_1, this.C = this.radius_g * this.radius_g - 1, this.es !== 0) {
    var t = 1 - this.es, i = 1 / t;
    this.radius_p = Math.sqrt(t), this.radius_p2 = t, this.radius_p_inv2 = i, this.shape = "ellipse";
  } else
    this.radius_p = 1, this.radius_p2 = 1, this.radius_p_inv2 = 1, this.shape = "sphere";
  this.title || (this.title = "Geostationary Satellite View");
}
function Fn(t) {
  var i = t.x, s = t.y, e, a, r, n;
  if (i = i - this.long0, this.shape === "ellipse") {
    s = Math.atan(this.radius_p2 * Math.tan(s));
    var h = this.radius_p / F(this.radius_p * Math.cos(s), Math.sin(s));
    if (a = h * Math.cos(i) * Math.cos(s), r = h * Math.sin(i) * Math.cos(s), n = h * Math.sin(s), (this.radius_g - a) * a - r * r - n * n * this.radius_p_inv2 < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    e = this.radius_g - a, this.flip_axis ? (t.x = this.radius_g_1 * Math.atan(r / F(n, e)), t.y = this.radius_g_1 * Math.atan(n / e)) : (t.x = this.radius_g_1 * Math.atan(r / e), t.y = this.radius_g_1 * Math.atan(n / F(r, e)));
  } else this.shape === "sphere" && (e = Math.cos(s), a = Math.cos(i) * e, r = Math.sin(i) * e, n = Math.sin(s), e = this.radius_g - a, this.flip_axis ? (t.x = this.radius_g_1 * Math.atan(r / F(n, e)), t.y = this.radius_g_1 * Math.atan(n / e)) : (t.x = this.radius_g_1 * Math.atan(r / e), t.y = this.radius_g_1 * Math.atan(n / F(r, e))));
  return t.x = t.x * this.a, t.y = t.y * this.a, t;
}
function Hn(t) {
  var i = -1, s = 0, e = 0, a, r, n, h;
  if (t.x = t.x / this.a, t.y = t.y / this.a, this.shape === "ellipse") {
    this.flip_axis ? (e = Math.tan(t.y / this.radius_g_1), s = Math.tan(t.x / this.radius_g_1) * F(1, e)) : (s = Math.tan(t.x / this.radius_g_1), e = Math.tan(t.y / this.radius_g_1) * F(1, s));
    var o = e / this.radius_p;
    if (a = s * s + o * o + i * i, r = 2 * this.radius_g * i, n = r * r - 4 * a * this.C, n < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    h = (-r - Math.sqrt(n)) / (2 * a), i = this.radius_g + h * i, s *= h, e *= h, t.x = Math.atan2(s, i), t.y = Math.atan(e * Math.cos(t.x) / i), t.y = Math.atan(this.radius_p_inv2 * Math.tan(t.y));
  } else if (this.shape === "sphere") {
    if (this.flip_axis ? (e = Math.tan(t.y / this.radius_g_1), s = Math.tan(t.x / this.radius_g_1) * Math.sqrt(1 + e * e)) : (s = Math.tan(t.x / this.radius_g_1), e = Math.tan(t.y / this.radius_g_1) * Math.sqrt(1 + s * s)), a = s * s + e * e + i * i, r = 2 * this.radius_g * i, n = r * r - 4 * a * this.C, n < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    h = (-r - Math.sqrt(n)) / (2 * a), i = this.radius_g + h * i, s *= h, e *= h, t.x = Math.atan2(s, i), t.y = Math.atan(e * Math.cos(t.x) / i);
  }
  return t.x = t.x + this.long0, t;
}
var Wn = ["Geostationary Satellite View", "Geostationary_Satellite", "geos"];
const Qn = {
  init: jn,
  forward: Fn,
  inverse: Hn,
  names: Wn
};
var Rt = 1.340264, Tt = -0.081106, Lt = 893e-6, qt = 3796e-6, ni = Math.sqrt(3) / 2;
function Vn() {
  this.es = 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0;
}
function Xn(t) {
  var i = _(t.x - this.long0), s = t.y, e = Math.asin(ni * Math.sin(s)), a = e * e, r = a * a * a;
  return t.x = i * Math.cos(e) / (ni * (Rt + 3 * Tt * a + r * (7 * Lt + 9 * qt * a))), t.y = e * (Rt + Tt * a + r * (Lt + qt * a)), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t;
}
function Kn(t) {
  t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a;
  var i = 1e-9, s = 12, e = t.y, a, r, n, h, o, l;
  for (l = 0; l < s && (a = e * e, r = a * a * a, n = e * (Rt + Tt * a + r * (Lt + qt * a)) - t.y, h = Rt + 3 * Tt * a + r * (7 * Lt + 9 * qt * a), e -= o = n / h, !(Math.abs(o) < i)); ++l)
    ;
  return a = e * e, r = a * a * a, t.x = ni * t.x * (Rt + 3 * Tt * a + r * (7 * Lt + 9 * qt * a)) / Math.cos(e), t.y = Math.asin(Math.sin(e) / ni), t.x = _(t.x + this.long0), t;
}
var Jn = ["eqearth", "Equal Earth", "Equal_Earth"];
const Zn = {
  init: Vn,
  forward: Xn,
  inverse: Kn,
  names: Jn
};
function Yn(t) {
  t.Proj.projections.add(Yt), t.Proj.projections.add(ti), t.Proj.projections.add(Ye), t.Proj.projections.add(lr), t.Proj.projections.add(Mr), t.Proj.projections.add(xr), t.Proj.projections.add(Sr), t.Proj.projections.add(Ir), t.Proj.projections.add(qr), t.Proj.projections.add(Dr), t.Proj.projections.add(eh), t.Proj.projections.add(ch), t.Proj.projections.add(Mh), t.Proj.projections.add(bh), t.Proj.projections.add(Sh), t.Proj.projections.add(Ih), t.Proj.projections.add(qh), t.Proj.projections.add(Dh), t.Proj.projections.add(Qh), t.Proj.projections.add(Zh), t.Proj.projections.add(en), t.Proj.projections.add(ln), t.Proj.projections.add(vn), t.Proj.projections.add(_n), t.Proj.projections.add($n), t.Proj.projections.add(On), t.Proj.projections.add(kn), t.Proj.projections.add(Bn), t.Proj.projections.add(Qn), t.Proj.projections.add(Zn);
}
U.defaultDatum = "WGS84";
U.Proj = V;
U.WGS84 = new U.Proj("WGS84");
U.Point = pt;
U.toPoint = Rs;
U.defs = k;
U.nadgrid = ie;
U.transform = ei;
U.mgrs = ye;
U.version = "__VERSION__";
Yn(U);
var Kt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function to(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var io = "Expected a function", fs = NaN, so = "[object Symbol]", ao = /^\s+|\s+$/g, eo = /^[-+]0x[0-9a-f]+$/i, ro = /^0b[01]+$/i, ho = /^0o[0-7]+$/i, no = parseInt, oo = typeof Kt == "object" && Kt && Kt.Object === Object && Kt, lo = typeof self == "object" && self && self.Object === Object && self, co = oo || lo || Function("return this")(), uo = Object.prototype, fo = uo.toString, vo = Math.max, Mo = Math.min, gi = function() {
  return co.Date.now();
};
function mo(t, i, s) {
  var e, a, r, n, h, o, l = 0, u = !1, c = !1, f = !0;
  if (typeof t != "function")
    throw new TypeError(io);
  i = ds(i) || 0, Ei(s) && (u = !!s.leading, c = "maxWait" in s, r = c ? vo(ds(s.maxWait) || 0, i) : r, f = "trailing" in s ? !!s.trailing : f);
  function d(b) {
    var P = e, N = a;
    return e = a = void 0, l = b, n = t.apply(N, P), n;
  }
  function v(b) {
    return l = b, h = setTimeout(x, i), u ? d(b) : n;
  }
  function m(b) {
    var P = b - o, N = b - l, B = i - P;
    return c ? Mo(B, r - N) : B;
  }
  function y(b) {
    var P = b - o, N = b - l;
    return o === void 0 || P >= i || P < 0 || c && N >= r;
  }
  function x() {
    var b = gi();
    if (y(b))
      return p(b);
    h = setTimeout(x, m(b));
  }
  function p(b) {
    return h = void 0, f && e ? d(b) : (e = a = void 0, n);
  }
  function $() {
    h !== void 0 && clearTimeout(h), l = 0, e = o = a = h = void 0;
  }
  function C() {
    return h === void 0 ? n : p(gi());
  }
  function E() {
    var b = gi(), P = y(b);
    if (e = arguments, a = this, o = b, P) {
      if (h === void 0)
        return v(o);
      if (c)
        return h = setTimeout(x, i), d(o);
    }
    return h === void 0 && (h = setTimeout(x, i)), n;
  }
  return E.cancel = $, E.flush = C, E;
}
function Ei(t) {
  var i = typeof t;
  return !!t && (i == "object" || i == "function");
}
function yo(t) {
  return !!t && typeof t == "object";
}
function go(t) {
  return typeof t == "symbol" || yo(t) && fo.call(t) == so;
}
function ds(t) {
  if (typeof t == "number")
    return t;
  if (go(t))
    return fs;
  if (Ei(t)) {
    var i = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = Ei(i) ? i + "" : i;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = t.replace(ao, "");
  var s = ro.test(t);
  return s || ho.test(t) ? no(t.slice(2), s ? 2 : 8) : eo.test(t) ? fs : +t;
}
var _o = mo;
const xo = /* @__PURE__ */ to(_o), Qs = ':root,:host { --spacing: 1rem; --block-spacing-vertical: calc(var(--spacing) * 2); --block-spacing-horizontal: var(--spacing); --background-color: var(--eox-background-color, white); --color: var(--eox-color, #2c3d49); --h-color: var(--eox-h-color, var(--color)); --hover-transparency: var(--eox-hover-transparency, 20%); --bg-hover-transparency: var(--eox-bg-hover-transparency, 40%); --btn-hover-transparency: var(--eox-btn-hover-transparency, 80%); --primary-color: var(--eox-primary-color, #004170); --primary-color-hover: color-mix( in srgb, var(--primary-color) var(--hover-transparency), transparent ); --primary-bg-color-hover: color-mix( in srgb, var(--primary-color) var(--bg-hover-transparency), transparent ); --primary-btn-color-hover: color-mix( in srgb, var(--primary-color) var(--btn-hover-transparency), transparent ); --secondary-color: var(--eox-secondary-color, #c6d4df); --secondary-color-hover: color-mix( in srgb, var(--secondary-color) var(--hover-transparency), transparent ); --secondary-bg-color-hover: color-mix( in srgb, var(--secondary-color) var(--bg-hover-transparency), transparent ); --secondary-btn-color-hover: color-mix( in srgb, var(--secondary-color) var(--btn-hover-transparency), transparent ); --success: var(--eox-success, #26cc0f); --warning: var(--eox-warning, #f18e32); --error: var(--eox-error, #ff5252); --header-font-family: var(--eox-header-font-family, "Roboto", sans-serif); --body-font-family: var(--eox-body-font-family, "Roboto", sans-serif);}* { font-size: normal; font-family: var(--body-font-family); color: var(--eox-color);}h1,h2,h3,h4,h5,h6 { font-family: var(--header-font-family);}span,p,div,main,label { font-family: var(--body-font-family);}@media (min-width: 576px) { .container { max-width: 510px; padding-right: 0; padding-left: 0; --block-spacing-vertical: calc(var(--spacing) * 2.5); }}@media (min-width: 768px) { .container { max-width: 700px; --block-spacing-vertical: calc(var(--spacing) * 3); }}@media (min-width: 992px) { .container { max-width: 920px; --block-spacing-vertical: calc(var(--spacing) * 3.5); }}@media (min-width: 1200px) { .container { max-width: 1130px; --block-spacing-vertical: calc(var(--spacing) * 4); }}.container { width: 100%; margin-right: auto; margin-left: auto; display: block; padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);}h1,h2,h3 { line-height: 120%; margin-top: 0.8rem; margin-bottom: 0.8rem;}p { --font-size: 1rem; font-weight: 400; line-height: 170%; margin-top: 0.8rem; margin-bottom: 1.6rem; font-size: var(--font-size);}body { padding: 0; margin: 0;}.sb-show-main.sb-main-padded { padding: 0;}h1,h2,h3,h4,h5,h6 { --font-weight: 700;}h1 { --font-size: 3rem; --typography-spacing-vertical: 0.5rem;}h2 { --font-size: 2rem; --typography-spacing-vertical: 0.5rem;}h3 { --font-size: 1.75rem; --typography-spacing-vertical: 0.5rem;}h4 { --font-size: 1.5rem; --typography-spacing-vertical: 0.5rem;}h5 { --font-size: 1.25rem; --typography-spacing-vertical: 0.5rem;}h1,h2,h3,h4,h5,h6 { margin-top: 0; margin-bottom: var(--typography-spacing-vertical); color: var(--h-color); font-weight: var(--font-weight); font-size: var(--font-size); font-family: var(--header-font-family);}', bo = 'button,.button { display: inline-flex; position: relative; align-items: center; color: #fff; border-width: 0; outline: none; border-radius: 4px; padding: 16px; height: 36px; cursor: pointer; font-family: inherit; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1.25px; font-weight: 500; box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); transition-property: box-shadow, transform, opacity, background; transition-duration: 0.28s; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);}button:hover:not([disabled]):not(.icon):not(.json-editor-btntype-*),.button:hover:not([disabled]):not(.icon) { box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12); background: var(--primary-btn-color-hover);}button,button:active,.button,.button:active { background: var(--primary-color);}button[disabled],.button[disabled] { opacity: 0.5; cursor: not-allowed;}button.block,.button.block { display: block;}button.outline,.button.outline { background: transparent; box-shadow: none; color: var(--primary-color); outline: 1px solid var(--primary-color);}button.outline:hover,.button.outline:hover { background: transparent;}button.icon,.button.icon,button[class*="json-editor-btntype-"] { background: transparent; border: none; box-shadow: none; padding: 0; border-radius: 50%; width: 24px; height: 24px; text-indent: -9999px;}button.icon-text,.button.icon-text { text-indent: 26px;}button.icon-text.block,.button.icon-text.block { text-indent: 20px;}button.icon:before,button.icon-text:before,.button.icon:before,.button.icon-text:before { position: absolute; text-indent: 0; line-height: initial;}button.icon-text.block:before,.button.icon-text.block:before { text-indent: -54px;}button.icon:before,.button.icon:before,button[class*="json-editor-btntype-"]::before { width: 24px; height: 24px; margin-right: 0;}button.icon-text:before,.button.icon-text:before { width: 18px; height: 18px;}button.small,.button.small { height: 28px; padding: 12.4px; font-size: 0.75rem;}button.smallest.icon,button.smallest.icon::before { height: 16px; width: 16px; padding: 0;}', Vs = Js`
  .geosearch {
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .search-container {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .hidden {
    display: none;
    pointer-events: none;
  }
  .results-container {
    min-height: 100px;
    width: 332px;
    background: var(--results-bg, #eaf1f5);
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0px 3px 5px -2px rgba(0, 0, 0, 0.08),
      0px 2px 2px 0px rgba(0, 0, 0, 0.08), 0px 1px 5px 0px rgba(0, 0, 0, 0.08);
    padding: 0;
    margin: 0;
  }
  .results-container.too-short {
    height: 64px;
  }

  .results-container.too-short span {
    color: #00f;
    width: 100%;
    text-align: center;
  }

  input {
    background: var(--input-bg, #c6d4dd);
    color: var(--input-fg, #333);
    height: 48px;
    border-radius: 6px;
    padding: 0 16px;
    min-width: 300px;
    border: none;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.05),
      0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 5px 0px rgba(0, 0, 0, 0.05);
  }
  input::before {
    background: url("_data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' color='%23999999' viewBox='0 0 24 24'%3E%3Ctitle%3Emagnify%3C/title%3E%3Cpath d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' /%3E%3C/svg%3E");
    width: 48px;
    height: 48px;
    display: inline-block;
  }
  button {
    height: auto;
    background: var(--button-bg, #FFF);
  }

  .geosearch.small button {
    height: var(--button-size, 32px);
    width: var(--button-size, 32px);
    padding: calc((var(--button-size, 32px) - 20px) / 2);
  }

  .geosearch.small button .icon {
    width: 20px;
    height: 20px;
    transform: translateX(1px);
    fill: var(--button-fg, #fff);
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Emagnify%3C/title%3E%3Cpath d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' /%3E%3C/svg%3E");
  }

  .geosearch.small button .chevron {
    display: none;
  }

  .geosearch input {
    background: #fff;
  }

  .chevron {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFF' viewBox='0 0 24 24'%3E%3Ctitle%3Echevron-left%3C/title%3E%3Cpath d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' /%3E%3C/svg%3E");
    margin-right: 9px;
  }

  .chevron.right {
    transform: rotate(180deg);
    margin-left: 9px;
  }

  .chevron.top {
    transform: rotate(90deg);
    margin-bottom: 9px;
  }

  .chevron.bottom {
    transform: rotate(-90deg);
    margin-top: 9px;
  }

  .chevron.right.active {
    transform: rotate(180deg);
  }

  .search-result {
    padding: 10px;
    border-bottom: 1px solid var(--results-border-color, #aaa);
    color: var(--results-fg, #000);
    cursor: pointer;
    font-size: 0.9rem;
    list-style: none;
  }

  .search-result:hover {
    background: #0001;
  }

  .hint {
    display: flex;
    color: #0008;
    height: 40px;
    width: 100%;
    margin: 30px 0;
    text-align: center;
    justify-content: center;
    flex-direction: row;
    align-items: center;
  }
`;
var _t;
class po extends mt {
  constructor() {
    super();
    /**
     * @type import("../../map/main").EOxMap
     */
    qi(this, _t);
    this._data = [], this._isListVisible = !1, this._isInputVisible = !1, this._query = "", this.for = "eox-map", this.listDirection = "right", this.resultsDirection = "down";
  }
  static get properties() {
    return {
      /**
       * Internal storage of OpenCage API data after a successful API request.
       * @private
       */
      _data: { attribute: !1 },
      /**
       * Whether or not the list dropdown is visible.
       * @private
       */
      _isListVisible: { attribute: !1 },
      /**
       * Whether or not the input field is visible.
       * @private
       */
      _isInputVisible: { attribute: !1 },
      /**
       * The search query, which is bound to the input field.
       * @private
       */
      _query: { attribute: !1 },
      /**
       * The OpenCage API endpoint to use for the search, including the key but without the query parameter.
       *
       */
      endpoint: { type: String },
      /**
       * Selector for the eox-map instance
       */
      for: { type: String },
      /**
       * The name of the query parameter to use for the search query in the endpoint URI.
       *
       */
      queryParameter: { type: String, default: "q" },
      /**
       * Whether or not to enable button mode, which hides and shows the input field
       * similar to how a modal works.
       *
       */
      button: { type: Boolean },
      /**
       * Set a custom interval for the debounce function.
       *
       */
      interval: { type: Number, default: 200 },
      /**
       * Enables a smaller version of the button for use in map controls.
       *
       */
      small: { type: Boolean },
      /**
       * Which text to use for the button if it is enabled.
       *
       */
      label: { type: String },
      /**
       * The direction of the search input relative to the button, with the following options:
       *
       * - `left`
       * - `top`
       * - `right`
       * - `bottom`
       *
       */
      direction: {
        type: String,
        attribute: "list-direction"
      },
      /**
       * The direction of the results box relative to the input, with the following options:
       *
       * - `left`
       * - `top`
       * - `right`
       * - `bottom`
       *
       */
      resultsDirection: {
        type: String,
        attribute: "results-direction"
      },
      unstyled: { type: Boolean }
    };
  }
  async fetchRemoteData(s) {
    const a = await (await fetch(encodeURI(s))).json();
    this._data = a.results;
  }
  async onInput(s) {
    if (this._query = s.target.value, this._query.length == 0) {
      this._isListVisible = !1;
      return;
    } else
      this._isListVisible = !0;
    xo(async () => {
      if (!(this._query.length < 2))
        if (this.endpoint && this.endpoint.length > 0) {
          const a = `${this.endpoint}${this.endpoint.includes("?") ? "&" : "?"}${this.queryParameter ?? "q"}=${this._query}`;
          await this.fetchRemoteData(a);
        } else
          console.error("No endpoint provided for GeoSearch element.");
    }, this.interval)();
  }
  onInputBlur() {
    this._isInputVisible = !1, this._isListVisible = !1, this._query = "";
  }
  onButtonClick() {
    this._isInputVisible = !this._isInputVisible, this._isInputVisible && this.renderRoot.querySelector("#gazetteer").focus();
  }
  getFlexDirection() {
    return this.direction === "up" ? "column-reverse" : this.direction === "left" ? "row-reverse" : this.direction === "down" ? "column" : (this.direction === "right", "row");
  }
  getResultsDirection() {
    return this.resultsDirection === "up" ? "column-reverse" : this.resultsDirection === "left" ? "row-reverse" : this.resultsDirection === "down" ? "column" : (this.resultsDirection === "right", "row");
  }
  getVerticalAlign() {
    return this.resultsDirection === "up" ? "end" : "start";
  }
  getMarginDirection(s) {
    return s === "up" ? "top" : s === "left" ? "left" : s === "down" ? "bottom" : s === "right" ? "right" : "row";
  }
  handleSelect(s) {
    this._isInputVisible = !1, this._isListVisible = !1, this._query = "";
    const e = ui(this, _t).map.getView().getProjection().getCode();
    let a = U("EPSG:4326", e, [
      s.bounds.southwest.lng,
      s.bounds.southwest.lat
    ]), r = U("EPSG:4326", e, [
      s.bounds.northeast.lng,
      s.bounds.northeast.lat
    ]);
    const n = [a[0], a[1], r[0], r[1]];
    ui(this, _t).zoomExtent = n, this.dispatchEvent(new CustomEvent("geosearchSelect", s));
  }
  /**
   * initializes the EOxMap instance
   * And stores it in the private property #eoxMap.
   */
  firstUpdated() {
    ki(this, _t, document.querySelector(this.for));
  }
  render() {
    return ct`
      <style>
        .hidden {
          display: none;
        }
        ${!this.unstyled && Qs}
        ${!this.unstyled && bo}
        ${!this.unstyled && Vs}
      </style>
      <div
        class="geosearch ${this.small ? "small" : ""}"
        style="
            flex-direction: ${this.getFlexDirection()};
            align-items: ${this.getVerticalAlign()};
        "
      >
        <button
          class="${this.button ? "" : "hidden"} ${this._isInputVisible ? "active" : ""}"
          style="
            margin-${this.getMarginDirection(this.direction)}: 12px;
            flex-direction: ${this.getFlexDirection()};
          "
          @click="${this.onButtonClick}"
        >
          <span class="icon"></span>
          <span
            class="chevron ${this.direction ?? "right"} ${this._isInputVisible ? "active" : ""}"
          ></span>
          <span
            style="display: ${this.small && !this.unstyled ? "none" : "flex"}"
            >${(this.label || this.unstyled) ?? "Search"}</span
          >
        </button>
        <div
          class="search-container ${this.button ? this._isInputVisible ? "" : "hidden" : ""}"
          style="flex-direction: ${this.getResultsDirection()};"
        >
          <input
            id="gazetteer"
            type="text"
            placeholder="Type to search"
            .value="${this._query}"
            style="margin-${this.getMarginDirection(
      this.resultsDirection
    )}: ${this._isListVisible ? 12 : 0}px"
            @input="${this.onInput}"
          />
          <ul class="results-container ${this._isListVisible ? "" : "hidden"}">
            ${this._query.length < 2 ? ct`<span class="hint"
                  >Enter at least two characters to search</span
                >` : ct``}
            ${this._query.length >= 2 ? this._data.map(
      (s) => ct`
                    <eox-geosearch-item
                      .item="${s}"
                      .onClick="${(e) => {
        this.handleSelect(e);
      }}"
                      .unstyled=${this.unstyled}
                    />
                  `
    ) : ct``}
          </ul>
        </div>
      </div>
    `;
  }
  /**
   * Runs each time the element is appended to or moved in the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Runs when the element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
_t = new WeakMap();
class Ao extends mt {
  static get properties() {
    return {
      item: { type: Object },
      onClick: { type: Function },
      unstyled: { type: Boolean }
    };
  }
  constructor() {
    super();
  }
  render() {
    return ct`
      <style>
        ${!this.unstyled && Qs}
        ${!this.unstyled && Vs}
      </style>
      <li class="search-result" @click="${() => this.onClick(this.item)}">
        <span class="name">${this.item.formatted}</span>
      </li>
    `;
  }
}
customElements.define("eox-geosearch", po);
customElements.define("eox-geosearch-item", Ao);
export {
  po as EOxGeoSearch
};
