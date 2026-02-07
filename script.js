"use strict";

/**
 * Serag Store - متجر خدمات إلكترونية (صفحة ثابتة)
 * - إدارة سلة
 * - بحث/فلترة/ترتيب
 * - كوبون خصم
 * - رسالة طلب جاهزة (نسخ + فتح واتساب/تيليجرام)
 * - تخزين محلي localStorage
 */

/* ============ إعدادات قابلة للتعديل ============ */
const STORE = {
  name: "Serag Store",
  currency: "JOD", // عدّلها: USD / SAR / EGP ...
  // روابط التواصل (ضع روابطك الحقيقية)
  whatsappNumberInternational: "962790000000", // مثال الأردن: 9627xxxxxxxx
  telegramUsername: "serag_store", // بدون @
  couponCode: "SERAG10",
  couponPercent: 10
};

/* الخدمات (عدّل كما تريد) */
const SERVICES = [
  {
    id: "game-topup",
    name: "شحن ألعاب (Top Up)",
    category: "شحن",
    price: 5.0,
    unit: "طلب",
    desc: "شحن رصيد/جواهر للألعاب (رجاءً اذكر ID والمنصة).",
    popular: 95
  },
  {
    id: "pubg-uc",
    name: "شدات PUBG UC",
    category: "شحن",
    price: 10.0,
    unit: "باقة",
    desc: "شدات UC باقات متنوعة (اكتب ID والباقة المطلوبة).",
    popular: 90
  },
  {
    id: "ff-diamonds",
    name: "جواهر Free Fire",
    category: "شحن",
    price: 7.5,
    unit: "باقة",
    desc: "شحن جواهر فري فاير (اكتب UID والباندل).",
    popular: 88
  },
  {
    id: "netflix",
    name: "اشتراك Netflix",
    category: "اشتراكات",
    price: 6.0,
    unit: "شهر",
    desc: "اشتراك شهري أو تجديد (حدد الباقة ومدة الاشتراك).",
    popular: 84
  },
  {
    id: "spotify",
    name: "اشتراك Spotify Premium",
    category: "اشتراكات",
    price: 4.0,
    unit: "شهر",
    desc: "تفعيل/تجديد بريميوم (حدد فردي/عائلي).",
    popular: 78
  },
  {
    id: "office",
    name: "تفعيل Microsoft Office",
    category: "برامج",
    price: 12.0,
    unit: "مرة",
    desc: "تفعيل أوفيس/ويندوز حسب الحالة (اذكر الإصدار).",
    popular: 70
  },
  {
    id: "social-design",
    name: "تصميم بوست سوشيال",
    category: "تصميم",
    price: 8.0,
    unit: "تصميم",
    desc: "تصميم بوست احترافي (أرسل النص + الألوان + المقاسات).",
    popular: 82
  },
  {
    id: "logo",
    name: "تصميم شعار (Logo)",
    category: "تصميم",
    price: 20.0,
    unit: "شعار",
    desc: "شعار بسيط + ملفات PNG (اذكر اسم النشاط والأفكار).",
    popular: 60
  },
  {
    id: "ig-verify",
    name: "تهيئة حساب (مراجعة وتحسين)",
    category: "سوشيال",
    price: 9.0,
    unit: "حساب",
    desc: "تحسين بايو/هايلايت/إعدادات + نصائح نمو.",
    popular: 55
  },
  {
    id: "giftcard",
    name: "بطاقات رقمية (Gift Cards)",
    category: "بطاقات",
    price: 15.0,
    unit: "بطاقة",
    desc: "بطاقات منصات (Steam/PSN/Xbox...) حسب التوفر.",
    popular: 73
  },
  {
    id: "airtime",
    name: "تحويل رصيد (حسب الشبكة)",
    category: "تحويل",
    price: 3.0,
    unit: "مرة",
    desc: "تحويل رصيد محلي (اذكر الشبكة والرقم).",
    popular: 50
  }
];

/* ============ Helpers ============ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatMoney(amount) {
  // حافظنا على بساطة التنسيق (بدون Intl لتفادي اختلافات)
  const fixed = (Math.round(amount * 100) / 100).toFixed(2);
  return `${fixed} ${STORE.currency}`;
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function safeText(str) {
  return String(str ?? "").replace(/[<>]/g, "");
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove("show"), 2200);
}

/* ============ Storage ============ */
const LS_KEYS = {
  CART: "serag_cart_v1",
  COUPON: "serag_coupon_v1",
  DRAFT: "serag_draft_v1",
  ORDERS: "serag_orders_v1"
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.CART)) ?? {}; }
  catch { return {}; }
}
function saveCart(cart) {
  localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
}
function loadCouponState() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.COUPON)) ?? { code: "", applied: false }; }
  catch { return { code: "", applied: false }; }
}
function saveCouponState(state) {
  localStorage.setItem(LS_KEYS.COUPON, JSON.stringify(state));
}
function loadDraft() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.DRAFT)) ?? null; }
  catch { return null; }
}
function saveDraft(draft) {
  localStorage.setItem(LS_KEYS.DRAFT, JSON.stringify(draft));
}
function incOrders(n = 1) {
  const curr = Number(localStorage.getItem(LS_KEYS.ORDERS) || "0");
  const next = curr + n;
  localStorage.setItem(LS_KEYS.ORDERS, String(next));
  return next;
}
function getOrders() {
  return Number(localStorage.getItem(LS_KEYS.ORDERS) || "0");
}

/* ============ App State ============ */
let cart = loadCart(); // { serviceId: qty }
let couponState = loadCouponState(); // { code, applied }
let filtered = [...SERVICES];

/* ============ UI References ============ */
const servicesGrid = $("#servicesGrid");
const categorySelect = $("#categorySelect");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");

const cartDrawer = $("#cartDrawer");
const cartItems = $("#cartItems");
const cartCount = $("#cartCount");
const subTotalEl = $("#subTotal");
const discountEl = $("#discount");
const grandTotalEl = $("#grandTotal");
const couponInput = $("#couponInput");

const checkoutModal = $("#checkoutModal");
const checkoutForm = $("#checkoutForm");
const orderMessage = $("#orderMessage");
const custName = $("#custName");
const custPhone = $("#custPhone");
const custNotes = $("#custNotes");
const sendVia = $("#sendVia");

const whatsLink = $("#whatsLink");
const tgLink = $("#tgLink");

/* ============ Init ============ */
function init() {
  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Orders counter
  $("#ordersCounter").textContent = String(getOrders());

  // Social links (cards)
  whatsLink.href = buildWhatsAppLink("مرحبًا، أريد الاستفسار عن خدمات Serag Store.");
  tgLink.href = buildTelegramLink();

  // Fill categories
  const cats = Array.from(new Set(SERVICES.map(s => s.category))).sort((a,b)=>a.localeCompare(b,"ar"));
  for (const c of cats) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  }

  // Coupon restore
  couponInput.value = couponState.code || "";

  // Render
  applyFiltersAndRender();

  // Restore draft (optional)
  const draft = loadDraft();
  if (draft) {
    custName.value = draft.name || "";
    custPhone.value = draft.phone || "";
    custNotes.value = draft.notes || "";
    sendVia.value = draft.sendVia || "copy";
  }

  // Update cart UI
  updateCartUI();
  bindEvents();
}

function bindEvents() {
  // Nav toggle
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Smooth scroll
  $("#scrollHow").addEventListener("click", () => $("#how").scrollIntoView({ behavior: "smooth" }));

  // Filters
  searchInput.addEventListener("input", applyFiltersAndRender);
  categorySelect.addEventListener("change", applyFiltersAndRender);
  sortSelect.addEventListener("change", applyFiltersAndRender);

  // Drawer open/close
  $("#openCartBtn").addEventListener("click", openCart);
  $("#closeCartBtn").addEventListener("click", closeCart);
  $("#drawerBackdrop").addEventListener("click", closeCart);
  $("#checkoutBtn").addEventListener("click", () => { closeCart(); openCheckout(); });
  $("#openCheckoutBtn").addEventListener("click", openCheckout);

  // Cart actions
  $("#clearCartBtn").addEventListener("click", () => {
    cart = {};
    saveCart(cart);
    couponState = { code: couponInput.value.trim(), applied: false };
    saveCouponState(couponState);
    toast("تم تفريغ السلة");
    updateCartUI();
  });

  $("#applyCouponBtn").addEventListener("click", applyCoupon);

  // Modal open/close
  $("#closeModalBtn").addEventListener("click", closeCheckout);
  $("#modalBackdrop").addEventListener("click", closeCheckout);

  // Copy message
  $("#copyMsgBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(orderMessage.value);
      toast("تم نسخ رسالة الطلب");
    } catch {
      toast("تعذر النسخ تلقائيًا — انسخ يدويًا");
    }
  });

  // Save draft
  $("#saveDraftBtn").addEventListener("click", () => {
    const draft = {
      name: custName.value.trim(),
      phone: custPhone.value.trim(),
      notes: custNotes.value.trim(),
      sendVia: sendVia.value
    };
    saveDraft(draft);
    toast("تم حفظ المسودة");
  });

  // Generate message when user types
  [custName, custPhone, custNotes, sendVia].forEach(el => {
    el.addEventListener("input", updateOrderMessage);
    el.addEventListener("change", updateOrderMessage);
  });

  // Submit checkout
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      toast("السلة فارغة");
      return;
    }
    if (!custName.value.trim() || !custPhone.value.trim()) {
      toast("يرجى إدخال الاسم ورقم التواصل");
      return;
    }

    updateOrderMessage(true);

    const method = sendVia.value;
    if (method === "whatsapp") {
      window.open(buildWhatsAppLink(orderMessage.value), "_blank", "noopener,noreferrer");
    } else if (method === "telegram") {
      // Telegram deep link to username; message will be in clipboard-ready preview
      window.open(buildTelegramLink(), "_blank", "noopener,noreferrer");
      toast("تم فتح تيليجرام — انسخ الرسالة وأرسلها");
    } else {
      // copy
      copyOrderMessageFallback();
    }

    // Count as order (demo)
    const newCount = incOrders(1);
    $("#ordersCounter").textContent = String(newCount);

    toast("تم تجهيز الطلب");
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeCheckout();
      $("#navMenu").classList.remove("show");
      $("#navToggle").setAttribute("aria-expanded", "false");
    }
  });
}

/* ============ Render Services ============ */
function applyFiltersAndRender() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  filtered = SERVICES.filter(s => {
    const matchesQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);

    const matchesCat = (cat === "all") ? true : s.category === cat;

    return matchesQ && matchesCat;
  });

  // Sort
  const sorted = [...filtered];
  if (sort === "popular") sorted.sort((a,b) => (b.popular ?? 0) - (a.popular ?? 0));
  if (sort === "priceAsc") sorted.sort((a,b) => a.price - b.price);
  if (sort === "priceDesc") sorted.sort((a,b) => b.price - a.price);
  if (sort === "nameAsc") sorted.sort((a,b) => a.name.localeCompare(b.name, "ar"));

  renderServices(sorted);
}

function renderServices(list) {
  servicesGrid.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `
      <div class="card-head">
        <h4>لا توجد نتائج</h4>
        <span class="tag">جرّب كلمة أخرى</span>
      </div>
      <p class="desc">غيّر البحث أو التصنيف لعرض خدمات أخرى.</p>
    `;
    servicesGrid.appendChild(empty);
    return;
  }

  for (const s of list) {
    const card = document.createElement("article");
    card.className = "card";
    const qty = cart[s.id] ?? 0;

    card.innerHTML = `
      <div class="card-head">
        <div>
          <h4>${safeText(s.name)}</h4>
          <div class="tag">${safeText(s.category)}</div>
        </div>
        <div class="price">${formatMoney(s.price)}</div>
      </div>

      <p class="desc">${safeText(s.desc)}</p>

      <div class="meta">
        <span class="muted">الوحدة: ${safeText(s.unit)}</span>

        <div class="card-actions">
          <div class="qty" aria-label="الكمية">
            <button class="icon-btn" type="button" data-action="dec" data-id="${s.id}" aria-label="تقليل">−</button>
            <strong id="qty-${s.id}">${qty}</strong>
            <button class="icon-btn" type="button" data-action="inc" data-id="${s.id}" aria-label="زيادة">+</button>
          </div>
          <button class="btn primary" type="button" data-action="add" data-id="${s.id}">
            إضافة للسلة
          </button>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (!id) return;

      if (action === "inc") setQty(id, (cart[id] ?? 0) + 1);
      if (action === "dec") setQty(id, (cart[id] ?? 0) - 1);
      if (action === "add") setQty(id, (cart[id] ?? 0) + 1, true);
    });

    servicesGrid.appendChild(card);
  }
}

function setQty(id, qty, showToast = false) {
  const next = clamp(qty, 0, 99);
  if (next === 0) delete cart[id];
  else cart[id] = next;

  saveCart(cart);
  updateCartUI();

  const qtyEl = $(`#qty-${CSS.escape(id)}`);
  if (qtyEl) qtyEl.textContent = String(cart[id] ?? 0);

  if (showToast) toast("تمت إضافة الخدمة للسلة");
}

/* ============ Cart UI ============ */
function getCartLines() {
  const lines = [];
  for (const [id, qty] of Object.entries(cart)) {
    const svc = SERVICES.find(s => s.id === id);
    if (!svc) continue;
    lines.push({ svc, qty });
  }
  return lines;
}

function calcTotals() {
  const lines = getCartLines();
  let subtotal = 0;
  for (const { svc, qty } of lines) subtotal += svc.price * qty;

  let discount = 0;
  const code = couponInput.value.trim().toUpperCase();
  const isValid = (code === STORE.couponCode);
  const applied = couponState.applied && isValid;

  if (applied) discount = subtotal * (STORE.couponPercent / 100);

  const total = Math.max(0, subtotal - discount);
  return { subtotal, discount, total, applied, code, isValid };
}

function updateCartUI() {
  // count
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  cartCount.textContent = String(count);

  // list
  const lines = getCartLines();
  cartItems.innerHTML = "";

  if (!lines.length) {
    cartItems.innerHTML = `
      <div class="card">
        <div class="card-head">
          <h4>السلة فارغة</h4>
          <span class="tag">ابدأ بالاختيار</span>
        </div>
        <p class="desc">أضف خدمة أو أكثر من قائمة الخدمات.</p>
      </div>
    `;
  } else {
    for (const { svc, qty } of lines) {
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <div>
          <h5>${safeText(svc.name)}</h5>
          <p>${safeText(svc.category)} • ${safeText(svc.unit)}</p>
          <p class="small">${formatMoney(svc.price)} × ${qty}</p>
        </div>
        <div class="actions">
          <div class="qty">
            <button class="icon-btn" type="button" data-action="dec" data-id="${svc.id}">−</button>
            <strong>${qty}</strong>
            <button class="icon-btn" type="button" data-action="inc" data-id="${svc.id}">+</button>
          </div>
          <button class="icon-btn" type="button" data-action="remove" data-id="${svc.id}" aria-label="حذف">🗑</button>
        </div>
      `;

      item.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const id = btn.getAttribute("data-id");
        const action = btn.getAttribute("data-action");
        if (!id) return;

        if (action === "inc") setQty(id, (cart[id] ?? 0) + 1);
        if (action === "dec") setQty(id, (cart[id] ?? 0) - 1);
        if (action === "remove") setQty(id, 0, true);
      });

      cartItems.appendChild(item);
    }
  }

  // totals
  const t = calcTotals();
  subTotalEl.textContent = formatMoney(t.subtotal);
  discountEl.textContent = formatMoney(t.discount);
  grandTotalEl.textContent = formatMoney(t.total);

  // update message preview if open
  updateOrderMessage();
}

/* ============ Coupon ============ */
function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  if (!code) {
    couponState = { code: "", applied: false };
    saveCouponState(couponState);
    updateCartUI();
    toast("أدخل كود كوبون");
    return;
  }
  if (code === STORE.couponCode) {
    couponState = { code, applied: true };
    saveCouponState(couponState);
    updateCartUI();
    toast(`تم تطبيق خصم ${STORE.couponPercent}%`);
  } else {
    couponState = { code, applied: false };
    saveCouponState(couponState);
    updateCartUI();
    toast("الكوبون غير صحيح");
  }
}

/* ============ Drawer / Modal ============ */
function openCart() {
  cartDrawer.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}
function openCheckout() {
  checkoutModal.classList.add("show");
  checkoutModal.setAttribute("aria-hidden", "false");
  updateOrderMessage();
}
function closeCheckout() {
  checkoutModal.classList.remove("show");
  checkoutModal.setAttribute("aria-hidden", "true");
}

/* ============ Order Message ============ */
function buildOrderSummaryText() {
  const lines = getCartLines();
  const t = calcTotals();

  const parts = [];
  parts.push(`طلب جديد من ${STORE.name}`);
  parts.push(`--------------------`);
  parts.push(`العميل: ${safeText(custName.value.trim() || "—")}`);
  parts.push(`التواصل: ${safeText(custPhone.value.trim() || "—")}`);
  parts.push(`--------------------`);
  parts.push(`الخدمات:`);

  if (!lines.length) {
    parts.push(`- (السلة فارغة)`);
  } else {
    for (const { svc, qty } of lines) {
      parts.push(`- ${safeText(svc.name)} × ${qty} = ${formatMoney(svc.price * qty)}`);
    }
  }

  parts.push(`--------------------`);
  parts.push(`المجموع: ${formatMoney(t.subtotal)}`);
  parts.push(`الخصم: ${formatMoney(t.discount)}${t.applied ? ` (كوبون ${t.code})` : ""}`);
  parts.push(`الإجمالي: ${formatMoney(t.total)}`);
  parts.push(`--------------------`);
  const notes = custNotes.value.trim();
  parts.push(`تفاصيل/ملاحظات: ${safeText(notes || "—")}`);
  parts.push(``);
  parts.push(`شكراً لكم 🌟`);

  return parts.join("\n");
}

function updateOrderMessage(force = false) {
  // لا تزعج المستخدم إن لم يفتح المودال، لكن نحدث عند الحاجة
  if (!force && checkoutModal.getAttribute("aria-hidden") === "true") return;
  orderMessage.value = buildOrderSummaryText();
}

async function copyOrderMessageFallback() {
  try {
    await navigator.clipboard.writeText(orderMessage.value);
    toast("تم نسخ رسالة الطلب");
  } catch {
    toast("تعذر النسخ تلقائيًا — انسخ يدويًا من الصندوق");
  }
}

/* ============ WhatsApp / Telegram ============ */
function buildWhatsAppLink(text) {
  const num = STORE.whatsappNumberInternational.replace(/\D/g, "");
  const msg = encodeURIComponent(text);
  // wa.me supports text query
  return `https://wa.me/${num}?text=${msg}`;
}
function buildTelegramLink() {
  const u = STORE.telegramUsername.replace(/^@/, "");
  return `https://t.me/${encodeURIComponent(u)}`;
}

/* ============ Start ============ */
init();

  function setJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
})();
