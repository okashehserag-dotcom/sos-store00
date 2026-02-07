(() => {
  "use strict";

  /* -----------------------------
   * Config / Data
   * ----------------------------- */

  const STORE = {
    brand: "SOS STORE",
    instagram: "https://instagram.com/sos_sstorre",
    checkoutWhatsApp: "", // مثال: "9627XXXXXXX" بدون + أو 00
    themes: ["beige", "dark", "red"],
    tags: ["all", "new", "popular", "limited", "sale", "accessory", "classic", "sport", "lux"],
    collections: [
      { id: "c1", title: "New Arrivals", sub: "جاهز للتعبئة", tag: "new", color: "red" },
      { id: "c2", title: "Best Sellers", sub: "الأكثر طلبًا", tag: "popular", color: "blue" },
      { id: "c3", title: "Accessories", sub: "لمسة فخمة", tag: "accessory", color: "green" },
      { id: "c4", title: "Limited", sub: "كميات محدودة", tag: "limited", color: "yellow" },
      { id: "c5", title: "Classic", sub: "ستايل ثابت", tag: "classic", color: "blue" },
      { id: "c6", title: "Sport", sub: "خفيف وحيوي", tag: "sport", color: "green" },
      { id: "c7", title: "Sale", sub: "عروض", tag: "sale", color: "red" },
      { id: "c8", title: "Luxury", sub: "فخامة", tag: "lux", color: "yellow" }
    ],
    products: []
  };

  const UI = {
    themeNames: { beige: "بيج", dark: "داكن", red: "أحمر" },
    toast: {
      searchCleared: "تم مسح البحث",
      sectionSearchCleared: "تم مسح بحث القسم",
      reset: "تمت إعادة الضبط",
      liked: "تم حفظ اللايك",
      addedToCart: "تمت الإضافة للسلة",
      wishCleared: "تم تفريغ المفضلة",
      cartCleared: "تم تفريغ السلة",
      emptyCart: "السلة فارغة",
      commentsSaved: "تم حفظ التعليق",
      commentsCleared: "تم مسح التعليقات",
      opened: (t) => `تم فتح القسم: ${t}`
    },
    labels: {
      sort: {
        featured: "الأبرز",
        newest: "الأحدث",
        priceLow: "السعر: الأقل",
        priceHigh: "السعر: الأعلى",
        nameAZ: "الاسم: أ-ي"
      },
      tag: {
        all: "الكل",
        new: "جديد",
        popular: "الأكثر طلبًا",
        limited: "محدود",
        sale: "تخفيضات",
        accessory: "إكسسوارات",
        classic: "كلاسيك",
        sport: "سبورت",
        lux: "فاخر"
      }
    }
  };

  const LS = {
    theme: "sos_theme_v3",
    like: (id) => `sos_like_${id}`,
    wish: "sos_wish_v3",
    cart: "sos_cart_v3",
    comments: (id) => `sos_comments_${id}`
  };

  const state = {
    tag: "all",
    search: "",
    sort: "featured",
    pageSize: 20,
    page: 1,
    collectionId: null,
    lastFocus: null,
    traps: new Map() // element -> cleanup
  };

  /* -----------------------------
   * Boot
   * ----------------------------- */

  STORE.products = seedProducts();

  document.addEventListener("DOMContentLoaded", () => {
    setText("#year", String(new Date().getFullYear()));

    initTheme();
    initReveal();
    initTopButton();
    initControls();

    buildTagSelects();
    buildCollections();
    renderProducts(false);

    bindGlobalHandlers();
    syncCounts();
  });

  /* -----------------------------
   * Data seeding / placeholder images
   * ----------------------------- */

  function seedProducts() {
    const now = Date.now();
    const day = 86_400_000;
    const items = [];
    let n = 1;

    const make = (collectionId, tags) => {
      for (let i = 0; i < 22; i++) {
        const id = `p${n++}`;
        const title = `SOS Item ${id.toUpperCase()}`;
        const desc = "صورة داخلية باسم المحل + وصف جاهز للتعبئة بدون تعقيد.";
        const price = 10 + (n % 13) * 4;
        const createdAt = now - n * day;

        const extraTags = [];
        if (i % 3 === 0) extraTags.push("popular");
        if (i % 5 === 0) extraTags.push("limited");

        items.push({
          id,
          title,
          desc,
          price,
          tags: Array.from(new Set([...tags, ...extraTags])),
          collection: collectionId,
          createdAt,
          image: placeholderImg(STORE.brand, title)
        });
      }
    };

    make("c1", ["new", "classic", "lux"]);
    make("c2", ["popular", "classic"]);
    make("c3", ["accessory", "lux"]);
    make("c4", ["limited", "lux"]);
    make("c5", ["classic"]);
    make("c6", ["sport", "new"]);
    make("c7", ["sale", "popular"]);
    make("c8", ["lux", "classic"]);

    return items;
  }

  function placeholderImg(brand, title) {
    const bg = "#E7D9C4";
    const fg = "#201810";
    const t1 = escXML((brand || "SOS STORE").slice(0, 18));
    const t2 = escXML((title || "SOON").slice(0, 22));

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${bg}" stop-opacity="1"/>
            <stop offset="1" stop-color="#F8F0E3" stop-opacity="1"/>
          </linearGradient>
          <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="rgba(0,0,0,.18)"/>
          </filter>
        </defs>
        <rect width="1200" height="1200" fill="url(#g)"/>
        <rect x="86" y="86" width="1028" height="1028" rx="90" fill="rgba(255,255,255,.35)" stroke="rgba(32,24,16,.16)" filter="url(#s)"/>
        <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="96" fill="${fg}" opacity=".92" letter-spacing="10">${t1}</text>
        <text x="50%" y="57%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="34" fill="${fg}" opacity=".60">${t2}</text>
        <text x="50%" y="66%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="30" fill="${fg}" opacity=".55">SOON</text>
      </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function escXML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&apos;"
    }[c]));
  }

  /* -----------------------------
   * Theme
   * ----------------------------- */

  function initTheme() {
    const saved = localStorage.getItem(LS.theme);
    if (saved && STORE.themes.includes(saved)) {
      document.documentElement.setAttribute("data-theme", saved);
    }

    onClick("#themeBtn", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "beige";
      const idx = STORE.themes.indexOf(cur);
      const next = STORE.themes[(idx + 1) % STORE.themes.length];

      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(LS.theme, next);
      toast(UI.themeNames[next] || next);
    });
  }

  /* -----------------------------
   * Animations / Reveal
   * ----------------------------- */

  function initReveal() {
    const els = $$(".reveal");

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((e) => io.observe(e));
  }

  function initTopButton() {
    const btn = $("#toTop");
    if (!btn) return;

    const on = () => btn.classList.toggle("is-on", window.scrollY > 650);
    window.addEventListener("scroll", debounce(on, 80), { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* -----------------------------
   * Controls / Filters / Sorting
   * ----------------------------- */

  function initControls() {
    const search = $("#globalSearch");
    const clear = $("#searchClear");

    if (search) {
      search.addEventListener(
        "input",
        debounce(() => {
          state.search = search.value.trim().toLowerCase();
          state.page = 1;
          renderProducts(false);
        }, 140)
      );
    }

    if (clear) {
      clear.addEventListener("click", () => {
        if (search) search.value = "";
        state.search = "";
        state.page = 1;
        renderProducts(false);
        toast(UI.toast.searchCleared);
      });
    }

    onChange("#tagSelect", (e) => {
      state.tag = e.target.value;
      state.page = 1;
      renderProducts(false);
    });

    onChange("#sortSelect", (e) => {
      state.sort = e.target.value;
      state.page = 1;
      renderProducts(false);
    });

    onClick("#resetBtn", () => {
      state.tag = "all";
      state.search = "";
      state.sort = "featured";
      state.page = 1;

      setValue("#globalSearch", "");
      setValue("#tagSelect", "all");
      setValue("#sortSelect", "featured");

      renderProducts(false);
      toast(UI.toast.reset);
    });

    onClick("#loadMore", () => {
      state.page += 1;
      renderProducts(true);
    });
  }

  function buildTagSelects() {
    const tagSelect = $("#tagSelect");
    const colFilter = $("#collectionFilter");

    const options = STORE.tags
      .map((t) => `<option value="${escAttr(t)}">${esc(UI.labels.tag[t] || t)}</option>`)
      .join("");

    if (tagSelect) {
      tagSelect.innerHTML = options;
      tagSelect.value = "all";
    }

    if (colFilter) {
      colFilter.innerHTML = options;
      colFilter.value = "all";
    }

    const sortSelect = $("#sortSelect");
    if (sortSelect) {
      const sortOptions = Object.entries(UI.labels.sort)
        .map(([val, label]) => `<option value="${escAttr(val)}">${esc(label)}</option>`)
        .join("");
      sortSelect.innerHTML = sortOptions;
      sortSelect.value = "featured";
    }
  }

  /* -----------------------------
   * Collections
   * ----------------------------- */

  function buildCollections() {
    const grid = $("#collectionsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    STORE.collections.forEach((c) => {
      const el = document.createElement("div");
      el.className = "collectionCard reveal";
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `فتح قسم: ${c.title}`);

      el.innerHTML = `
        <div class="collectionCard__top">
          <div class="collectionCard__title">${esc(c.title)}</div>
          <div class="collectionCard__sub">${esc(c.sub)}</div>
        </div>
        <div class="collectionCard__bar"></div>
      `;

      el.addEventListener("click", () => openCollection(c.id));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCollection(c.id);
        }
      });

      grid.appendChild(el);
    });
  }

  function openCollection(collectionId) {
    const c = STORE.collections.find((x) => x.id === collectionId);
    if (!c) return;

    state.collectionId = c.id;

    setText("#collectionTitle", c.title);
    setText("#collectionSub", c.sub);

    const drawer = $("#collectionDrawer");
    if (drawer) drawer.setAttribute("data-color", c.color);

    setValue("#collectionSearch", "");
    setValue("#collectionFilter", "all");

    renderCollectionGrid(filterCollectionItems());
    openDrawer("collection", $("#collectionsGrid"));
    toast(UI.toast.opened(c.title));
  }

  function filterCollectionItems() {
    const q = getValue("#collectionSearch").trim().toLowerCase();
    const tg = getValue("#collectionFilter") || "all";

    const base = STORE.products.filter((p) => p.collection === state.collectionId);
    let items = base.slice();

    if (tg !== "all") items = items.filter((p) => (p.tags || []).includes(tg));

    if (q) {
      items = items.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.desc || "").toLowerCase().includes(q) ||
          (p.tags || []).some((t) => String(t).toLowerCase().includes(q))
      );
    }

    const limited = items.slice(0, 60);
    setText("#colCount", `${limited.length} / ${base.length}`);
    return limited;
  }

  function renderCollectionGrid(items) {
    const grid = $("#collectionGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (!items || items.length === 0) {
      grid.innerHTML = `<div class="muted">لا يوجد نتائج</div>`;
      return;
    }

    items.forEach((p) => grid.appendChild(productCard(p)));
  }

  /* -----------------------------
   * Product grid
   * ----------------------------- */

  function renderProducts(append) {
    const grid = $("#productsGrid");
    const loadMore = $("#loadMore");
    if (!grid) return;

    if (!append) grid.innerHTML = "";

    const all = getFilteredSortedProducts();
    const slice = all.slice(0, state.page * state.pageSize);

    const existing = append ? grid.children.length : 0;
    const chunk = slice.slice(existing);

    chunk.forEach((p) => grid.appendChild(productCard(p)));

    if (loadMore) loadMore.style.display = slice.length < all.length ? "inline-flex" : "none";
  }

  function getFilteredSortedProducts() {
    let items = STORE.products.slice();

    if (state.tag !== "all") items = items.filter((p) => (p.tags || []).includes(state.tag));

    if (state.search) {
      const q = state.search;
      items = items.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.desc || "").toLowerCase().includes(q) ||
          (p.tags || []).some((t) => String(t).toLowerCase().includes(q))
      );
    }

    switch (state.sort) {
      case "newest":
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case "priceLow":
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHigh":
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "nameAZ":
        items.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "ar"));
        break;
      default:
        items.sort((a, b) => scoreFeatured(b) - scoreFeatured(a));
    }

    return items;
  }

  function scoreFeatured(p) {
    const t = new Set(p.tags || []);
    return (t.has("popular") ? 5 : 0) + (t.has("limited") ? 3 : 0) + (t.has("new") ? 2 : 0);
  }

  function productCard(p) {
    const liked = isLiked(p.id);

    const el = document.createElement("article");
    el.className = "product";

    const topTags = (p.tags || []).slice(0, 2).map((t) => UI.labels.tag[t] || t).join(" • ");

    el.innerHTML = `
      <div class="product__media">
        <img src="${escAttr(p.image)}" alt="${escAttr(p.title)}" loading="lazy" decoding="async" />
      </div>
      <div class="product__body">
        <h3 class="product__title">${esc(p.title)}</h3>
        <p class="product__desc">${esc(p.desc)}</p>
        <div class="product__row">
          <span class="pill">${esc(formatPrice(p.price))}</span>
          <span class="pill">${esc(topTags)}</span>
        </div>
        <div class="product__actions">
          <button class="actionBtn" data-like="${escAttr(p.id)}" ${liked ? "disabled" : ""}>
            ${liked ? "تم اللايك" : "لايك"}
          </button>
          <button class="actionBtn" data-comment="${escAttr(p.id)}">تعليقات</button>
          <button class="actionBtn" data-add="${escAttr(p.id)}">إضافة</button>
        </div>
      </div>
    `;

    return el;
  }

  /* -----------------------------
   * Events
   * ----------------------------- */

  function bindGlobalHandlers() {
    // Global click delegation (buttons in product cards, drawers, modal overlays, cart actions)
    document.addEventListener("click", (e) => {
      const close = e.target.closest("[data-close]");
      if (close) {
        const key = close.dataset.close;
        if (key === "comment") closeComments();
        if (key === "cart") closeDrawer("cart");
        if (key === "wish") closeDrawer("wish");
        if (key === "collection") closeDrawer("collection");
        return;
      }

      const likeBtn = e.target.closest("[data-like]");
      if (likeBtn) {
        const id = likeBtn.dataset.like;
        if (!id || isLiked(id)) return;

        localStorage.setItem(LS.like(id), "1");
        likeBtn.textContent = "تم اللايك";
        likeBtn.disabled = true;

        addToWish(id);
        toast(UI.toast.liked);
        syncCounts();
        return;
      }

      const commentBtn = e.target.closest("[data-comment]");
      if (commentBtn) {
        openComments(commentBtn.dataset.comment);
        return;
      }

      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        addToCart(addBtn.dataset.add, 1);
        toast(UI.toast.addedToCart);
        syncCounts();
        return;
      }

      const minus = e.target.closest("[data-qminus]");
      if (minus) {
        const id = minus.dataset.qminus;
        setQty(id, getCartQty(id) - 1);
        syncCounts();
        return;
      }

      const plus = e.target.closest("[data-qplus]");
      if (plus) {
        const id = plus.dataset.qplus;
        setQty(id, getCartQty(id) + 1);
        syncCounts();
        return;
      }

      const remove = e.target.closest("[data-remove]");
      if (remove) {
        const id = remove.dataset.remove;
        setQty(id, 0);
        syncCounts();
      }
    });

    onClick("#cartBtn", (e) => {
      renderCart();
      openDrawer("cart", e.currentTarget);
    });

    onClick("#wishBtn", (e) => {
      renderWish();
      openDrawer("wish", e.currentTarget);
    });

    onClick("#clearCart", () => clearCart());
    onClick("#clearWish", () => clearWish());

    onClick("#checkoutBtn", () => checkout());

    const commentForm = $("#commentForm");
    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pid = e.currentTarget.dataset.pid;
        const name = getValue("#commentName").trim();
        const text = getValue("#commentText").trim();
        if (!pid || !name || !text) return;

        const items = getJSON(LS.comments(pid), []);
        items.unshift({ name, text, time: new Date().toLocaleString("ar-JO") });
        setJSON(LS.comments(pid), items.slice(0, 160));

        setValue("#commentName", "");
        setValue("#commentText", "");

        renderComments(pid);
        toast(UI.toast.commentsSaved);
      });
    }

    onClick("#clearComments", () => {
      const pid = commentForm?.dataset?.pid;
      if (!pid) return;
      localStorage.removeItem(LS.comments(pid));
      renderComments(pid);
      toast(UI.toast.commentsCleared);
    });

    const colSearch = $("#collectionSearch");
    if (colSearch) colSearch.addEventListener("input", debounce(() => renderCollectionGrid(filterCollectionItems()), 140));

    onChange("#collectionFilter", () => renderCollectionGrid(filterCollectionItems()));

    onClick("#collectionClear", () => {
      setValue("#collectionSearch", "");
      renderCollectionGrid(filterCollectionItems());
      toast(UI.toast.sectionSearchCleared);
    });

    // Prevent drawer click from bubbling (panel only)
    ["cartDrawer", "wishDrawer", "collectionDrawer"].forEach((id) => {
      const d = document.getElementById(id);
      const panel = d?.querySelector(".drawer__panel");
      if (panel) panel.addEventListener("click", (ev) => ev.stopPropagation());
    });

    // ESC closes the top-most overlay
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeComments();
      closeDrawer("cart");
      closeDrawer("wish");
      closeDrawer("collection");
    });
  }

  /* -----------------------------
   * Drawers + Focus management
   * ----------------------------- */

  function openDrawer(key, openerEl) {
    const el = drawerEl(key);
    if (!el) return;

    state.lastFocus = openerEl || document.activeElement;

    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");

    setExpandedForKey(key, true);
    lockScroll(true);

    const focusTarget = el.querySelector("[data-close]") || el.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusTarget) focusTarget.focus();

    trapFocus(el.querySelector(".drawer__panel") || el);
  }

  function closeDrawer(key) {
    const el = drawerEl(key);
    if (!el || !el.classList.contains("is-open")) return;

    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");

    setExpandedForKey(key, false);

    releaseTrap(el.querySelector(".drawer__panel") || el);

    if (!anyOverlayOpen()) {
      lockScroll(false);
      restoreFocus();
    }
  }

  function drawerEl(key) {
    if (key === "cart") return $("#cartDrawer");
    if (key === "wish") return $("#wishDrawer");
    if (key === "collection") return $("#collectionDrawer");
    return null;
  }

  function anyOverlayOpen() {
    const drawersOpen = ["cart", "wish", "collection"].some((k) => drawerEl(k)?.classList.contains("is-open"));
    const modalOpen = $("#commentModal")?.classList.contains("is-open");
    return drawersOpen || modalOpen;
  }

  function setExpandedForKey(key, val) {
    if (key === "cart") $("#cartBtn")?.setAttribute("aria-expanded", String(val));
    if (key === "wish") $("#wishBtn")?.setAttribute("aria-expanded", String(val));
  }

  function lockScroll(on) {
    document.documentElement.classList.toggle("is-locked", !!on);
  }

  function restoreFocus() {
    const el = state.lastFocus;
    state.lastFocus = null;
    if (el && typeof el.focus === "function") el.focus();
  }

  function trapFocus(container) {
    if (!container || state.traps.has(container)) return;

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusable(container);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    state.traps.set(container, () => container.removeEventListener("keydown", onKeyDown));
  }

  function releaseTrap(container) {
    const cleanup = state.traps.get(container);
    if (cleanup) cleanup();
    state.traps.delete(container);
  }

  function getFocusable(container) {
    const sel = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    return Array.from(container.querySelectorAll(sel)).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  /* -----------------------------
   * Comments modal
   * ----------------------------- */

  function openComments(productId) {
    const p = STORE.products.find((x) => x.id === productId);
    if (!p) return;

    state.lastFocus = document.activeElement;

    setText("#commentTitle", `تعليقات: ${p.title}`);
    setText("#commentSub", "بدون نجوم — تعليق فقط");

    const form = $("#commentForm");
    if (form) form.dataset.pid = productId;

    setValue("#commentName", "");
    setValue("#commentText", "");

    const modal = $("#commentModal");
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    lockScroll(true);
    renderComments(productId);

    const first = modal.querySelector("#commentName") || modal.querySelector("[data-close]");
    if (first) first.focus();

    trapFocus(modal.querySelector(".modal__panel") || modal);
  }

  function closeComments() {
    const modal = $("#commentModal");
    if (!modal || !modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    releaseTrap(modal.querySelector(".modal__panel") || modal);

    if (!anyOverlayOpen()) {
      lockScroll(false);
      restoreFocus();
    }
  }

  function renderComments(productId) {
    const list = $("#commentList");
    if (!list) return;

    const items = getJSON(LS.comments(productId), []);

    if (!items || items.length === 0) {
      list.innerHTML = `
        <div class="comment">
          <div class="comment__top">
            <div class="comment__name">لا يوجد تعليقات</div>
            <div class="comment__time">جاهز</div>
          </div>
          <div class="comment__text">اكتب أول تعليق.</div>
        </div>
      `;
      return;
    }

    list.innerHTML = items.slice(0, 80).map((c) => `
      <div class="comment">
        <div class="comment__top">
          <div class="comment__name">${esc(c.name)}</div>
          <div class="comment__time">${esc(c.time)}</div>
        </div>
        <div class="comment__text">${esc(c.text)}</div>
      </div>
    `).join("");
  }

  /* -----------------------------
   * Wishlist
   * ----------------------------- */

  function addToWish(productId) {
    const list = getJSON(LS.wish, []);
    if (!list.includes(productId)) list.unshift(productId);
    setJSON(LS.wish, list.slice(0, 400));
    renderWish();
  }

  function renderWish() {
    const wrap = $("#wishItems");
    if (!wrap) return;

    const ids = getJSON(LS.wish, []);

    if (!ids || ids.length === 0) {
      wrap.innerHTML = `<div class="muted">لا يوجد عناصر</div>`;
      return;
    }

    wrap.innerHTML = "";

    ids.slice(0, 120).forEach((id) => {
      const p = STORE.products.find((x) => x.id === id);
      if (!p) return;

      const row = document.createElement("div");
      row.className = "comment";
      row.innerHTML = `
        <div class="comment__top">
          <div class="comment__name">${esc(p.title)}</div>
          <div class="comment__time">${esc(formatPrice(p.price))}</div>
        </div>
        <div class="comment__text">${esc(p.desc)}</div>
      `;
      wrap.appendChild(row);
    });
  }

  function clearWish() {
    localStorage.removeItem(LS.wish);
    renderWish();
    syncCounts();
    toast(UI.toast.wishCleared);
  }

  /* -----------------------------
   * Cart
   * ----------------------------- */

  function addToCart(productId, qty) {
    const cart = getJSON(LS.cart, {});
    cart[productId] = (cart[productId] || 0) + qty;
    if (cart[productId] <= 0) delete cart[productId];
    setJSON(LS.cart, cart);
    renderCart();
  }

  function setQty(productId, qty) {
    const cart = getJSON(LS.cart, {});
    if (qty <= 0) delete cart[productId];
    else cart[productId] = qty;
    setJSON(LS.cart, cart);
    renderCart();
  }

  function getCartQty(productId) {
    const cart = getJSON(LS.cart, {});
    return Number(cart[productId] || 0);
  }

  function clearCart() {
    localStorage.removeItem(LS.cart);
    renderCart();
    syncCounts();
    toast(UI.toast.cartCleared);
  }

  function renderCart() {
    const wrap = $("#cartItems");
    const totalEl = $("#cartTotal");
    if (!wrap || !totalEl) return;

    const cart = getJSON(LS.cart, {});
    const ids = Object.keys(cart || {});

    if (ids.length === 0) {
      wrap.innerHTML = `<div class="muted">السلة فارغة</div>`;
      totalEl.textContent = "0";
      return;
    }

    let total = 0;
    wrap.innerHTML = "";

    ids.forEach((id) => {
      const p = STORE.products.find((x) => x.id === id);
      if (!p) return;

      const q = Number(cart[id] || 0);
      total += (p.price || 0) * q;

      const row = document.createElement("div");
      row.className = "comment";
      row.innerHTML = `
        <div class="comment__top">
          <div class="comment__name">${esc(p.title)}</div>
          <div class="comment__time">${esc(formatPrice(p.price))} × ${q}</div>
        </div>
        <div class="product__actions" style="margin-top:10px">
          <button class="actionBtn" data-qminus="${escAttr(id)}" aria-label="إنقاص الكمية">-</button>
          <button class="actionBtn" data-qplus="${escAttr(id)}" aria-label="زيادة الكمية">+</button>
          <button class="actionBtn" data-remove="${escAttr(id)}">حذف</button>
        </div>
      `;
      wrap.appendChild(row);
    });

    totalEl.textContent = String(total);
  }

  function checkout() {
    const cart = getJSON(LS.cart, {});
    const ids = Object.keys(cart || {});
    if (ids.length === 0) {
      toast(UI.toast.emptyCart);
      return;
    }

    const lines = ids
      .map((id) => {
        const p = STORE.products.find((x) => x.id === id);
        const q = cart[id];
        return p ? `${p.title} × ${q}` : "";
      })
      .filter(Boolean);

    const msg = encodeURIComponent(`طلب جديد من ${STORE.brand}:\n` + lines.join("\n"));

    if (STORE.checkoutWhatsApp) {
      window.open(`https://wa.me/${STORE.checkoutWhatsApp}?text=${msg}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(STORE.instagram, "_blank", "noopener,noreferrer");
    }
  }

  /* -----------------------------
   * Counts / Like
   * ----------------------------- */

  function syncCounts() {
    const wish = getJSON(LS.wish, []);
    setText("#wishCount", String((wish || []).length));

    const cart = getJSON(LS.cart, {});
    const count = Object.values(cart || {}).reduce((a, b) => a + Number(b || 0), 0);
    setText("#cartCount", String(count));
  }

  function isLiked(id) {
    return localStorage.getItem(LS.like(id)) === "1";
  }

  /* -----------------------------
   * Toast
   * ----------------------------- */

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;

    el.textContent = msg;
    el.classList.add("is-show");

    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-show"), 1200);
  }

  /* -----------------------------
   * Utils
   * ----------------------------- */

  function $(s, r = document) {
    return r.querySelector(s);
  }

  function $$(s, r = document) {
    return Array.from(r.querySelectorAll(s));
  }

  function setText(sel, value) {
    const el = $(sel);
    if (el) el.textContent = value;
  }

  function setValue(sel, value) {
    const el = $(sel);
    if (el) el.value = value;
  }

  function getValue(sel) {
    const el = $(sel);
    return el ? String(el.value || "") : "";
  }

  function onClick(sel, fn) {
    const el = $(sel);
    if (el) el.addEventListener("click", fn);
  }

  function onChange(sel, fn) {
    const el = $(sel);
    if (el) el.addEventListener("change", fn);
  }

  function debounce(fn, wait) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function formatPrice(n) {
    const num = Number(n || 0);
    return `${num} JD`;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[c]));
  }

  function escAttr(s) {
    return esc(s).replace(/`/g, "&#096;");
  }

  function getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function setJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
})();
