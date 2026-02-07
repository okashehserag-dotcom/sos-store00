/* ============================================================
   Serag Store - Static Digital Services Store
   3 Files فقط: index.html + style.css + script.js
   بدون سيرفر - مع localStorage - سلة - كوبونات - رسالة جاهزة
   ============================================================ */

(() => {
  "use strict";

  /* =========================
     1) CONFIG (التعديل هنا)
     ========================= */
  const CONFIG = {
    store: {
      name: "Serag Store",
      tagline: "Digital Services Store",
      brandEmoji: "🕯️",
      currency: "USD",
      locale: "ar", // "ar" or "en" (حاليًا الواجهة عربية)
    },

    contact: {
      // رقم المتجر بدون +
      whatsappNumber: "201234567890",
      telegramUsername: "serag_store",
    },

    policies: {
      // تظهر في الفوتر + تضاف للرسالة
      shortPolicy:
        "سرعة، بساطة، وطلب واضح برسالة جاهزة للنسخ والإرسال. (سياسة التنفيذ/الضمان قابلة للتعديل).",
      deliveryNote:
        "المدة تعتمد على الخدمة والضغط. سيتم التأكيد بعد استلام تفاصيل الطلب.",
      warrantyNote:
        "في حال وجود مشكلة خلال مدة الضمان المحددة لكل خدمة، يتم المراجعة والدعم حسب الحالة.",
    },

    settings: {
      enableCoupons: true,
      enableMergeSameItems: true, // دمج العناصر المتطابقة في السلة
      requireCustomerName: true,
      requireCustomerPhone: true,
      autoOpenCartAfterAdd: true,
      persistState: true,
      maxQty: 999,
    },

    coupons: [
      { code: "SERAG10", type: "percent", value: 10, minSubtotal: 15, active: true },
      { code: "WELCOME5", type: "fixed", value: 5, minSubtotal: 25, active: true },
      { code: "VIP20", type: "percent", value: 20, minSubtotal: 100, active: false },
    ],

    categories: [
      { id: "all", name: "الكل" },
      { id: "games", name: "الألعاب" },
      { id: "social", name: "السوشيال ميديا" },
      { id: "subs", name: "الاشتراكات" },
      { id: "design", name: "التصميم" },
      { id: "accounts", name: "حسابات وخدمات" },
      { id: "misc", name: "متفرقات" },
    ],

    // خدمات مثال (غيّرها حسب متجرك)
    services: [
      {
        id: "pubg_uc",
        categoryId: "games",
        name: "شحن UC PUBG Mobile",
        short: "شحن UC حسب الباقة خلال وقت قصير",
        desc:
          "اختر الباقة المطلوبة ثم ضع Player ID بدقة. يتم تنفيذ الشحن بعد التأكيد.",
        tags: ["PUBG", "UC", "شحن", "Mobile"],
        requirements: ["Player ID", "الباقة المطلوبة"],
        popularity: 98,
        createdAt: "2026-01-20",
        pricing: {
          type: "packages",
          packages: [
            { id: "60", name: "60 UC", price: 1.49, desc: "باقة صغيرة" },
            { id: "180", name: "180 UC", price: 3.99, desc: "مناسبة" },
            { id: "600", name: "600 UC", price: 12.99, desc: "الأكثر طلبًا" },
            { id: "1200", name: "1200 UC", price: 24.50, desc: "قيمة أعلى" },
          ],
        },
      },
      {
        id: "free_fire",
        categoryId: "games",
        name: "شحن جواهر Free Fire",
        short: "شحن Diamonds حسب الباقة",
        desc:
          "تأكد من كتابة UID الصحيح واختر الباقة.",
        tags: ["Free Fire", "Diamonds", "جواهر", "شحن"],
        requirements: ["UID", "الباقة المطلوبة"],
        popularity: 85,
        createdAt: "2026-01-19",
        pricing: {
          type: "packages",
          packages: [
            { id: "100", name: "100 Diamonds", price: 0.99, desc: "" },
            { id: "520", name: "520 Diamonds", price: 4.49, desc: "الأكثر طلبًا" },
            { id: "1060", name: "1060 Diamonds", price: 8.49, desc: "" },
          ],
        },
      },
      {
        id: "mlbb",
        categoryId: "games",
        name: "شحن Mobile Legends",
        short: "Diamonds + Weekly Pass",
        desc:
          "اكتب User ID و Server ID واختر الباقة.",
        tags: ["MLBB", "Diamonds", "Mobile Legends"],
        requirements: ["User ID", "Server ID", "الباقة المطلوبة"],
        popularity: 80,
        createdAt: "2026-01-18",
        pricing: {
          type: "packages",
          packages: [
            { id: "86", name: "86 Diamonds", price: 1.89, desc: "" },
            { id: "172", name: "172 Diamonds", price: 3.59, desc: "" },
            { id: "weekly", name: "Weekly Pass", price: 2.79, desc: "اشتراك أسبوعي" },
          ],
        },
      },
      {
        id: "fortnite_vbucks",
        categoryId: "games",
        name: "Fortnite V-Bucks",
        short: "شحن V-Bucks (حسب المتاح)",
        desc:
          "حدد المنصة (PS/Xbox/PC) وأرسل بيانات الحساب أو طريقة الشحن المتفق عليها.",
        tags: ["Fortnite", "V-Bucks", "شحن"],
        requirements: ["المنصة", "نوع الباقة", "تفاصيل الحساب/الطريقة"],
        popularity: 72,
        createdAt: "2026-01-17",
        pricing: {
          type: "base",
          basePrice: 10.0,
          unitLabel: "باقة",
          note: "السعر يبدأ من حسب الباقة/المنصة.",
        },
      },

      /* Social */
      {
        id: "ig_followers",
        categoryId: "social",
        name: "متابعين انستغرام",
        short: "زيادة متابعين لحسابك (حسب الباقة)",
        desc:
          "اختر الباقة وأرسل رابط الحساب أو اليوزر. يفضل أن يكون الحساب عام (Public) أثناء التنفيذ.",
        tags: ["Instagram", "Followers", "انستا"],
        requirements: ["رابط الحساب أو Username", "الباقة المطلوبة"],
        popularity: 95,
        createdAt: "2026-01-25",
        pricing: {
          type: "packages",
          packages: [
            { id: "100", name: "100 متابع", price: 1.20, desc: "" },
            { id: "500", name: "500 متابع", price: 4.90, desc: "الأكثر طلبًا" },
            { id: "1000", name: "1000 متابع", price: 8.90, desc: "" },
            { id: "5000", name: "5000 متابع", price: 39.0, desc: "للمشاريع" },
          ],
        },
      },
      {
        id: "ig_likes",
        categoryId: "social",
        name: "لايكات انستغرام",
        short: "زيادة لايكات لمنشور محدد",
        desc:
          "أرسل رابط المنشور واختر عدد اللايكات.",
        tags: ["Instagram", "Likes", "لايكات"],
        requirements: ["رابط المنشور", "الكمية المطلوبة"],
        popularity: 78,
        createdAt: "2026-01-21",
        pricing: {
          type: "base",
          basePrice: 0.8,
          unitLabel: "100 لايك",
          note: "الكمية تحسب على أساس (100 لايك). مثال: 3 = 300 لايك.",
        },
      },
      {
        id: "tiktok_followers",
        categoryId: "social",
        name: "متابعين تيك توك",
        short: "متابعين لحساب تيك توك",
        desc: "أرسل رابط الحساب واختر الباقة.",
        tags: ["TikTok", "Followers", "تيك"],
        requirements: ["رابط الحساب", "الباقة المطلوبة"],
        popularity: 88,
        createdAt: "2026-01-22",
        pricing: {
          type: "packages",
          packages: [
            { id: "200", name: "200 متابع", price: 2.20, desc: "" },
            { id: "500", name: "500 متابع", price: 4.99, desc: "الأكثر طلبًا" },
            { id: "1000", name: "1000 متابع", price: 9.20, desc: "" },
          ],
        },
      },
      {
        id: "youtube_subs",
        categoryId: "social",
        name: "مشتركين يوتيوب",
        short: "زيادة مشتركين للقناة",
        desc:
          "أرسل رابط القناة واختر الباقة.",
        tags: ["YouTube", "Subscribers", "قناة"],
        requirements: ["رابط القناة", "الباقة المطلوبة"],
        popularity: 70,
        createdAt: "2026-01-23",
        pricing: {
          type: "packages",
          packages: [
            { id: "50", name: "50 مشترك", price: 3.50, desc: "" },
            { id: "100", name: "100 مشترك", price: 6.50, desc: "الأكثر طلبًا" },
            { id: "500", name: "500 مشترك", price: 29.0, desc: "" },
          ],
        },
      },

      /* Subscriptions */
      {
        id: "netflix",
        categoryId: "subs",
        name: "اشتراك Netflix",
        short: "اشتراك حسب الخطة والمدة",
        desc:
          "حدد نوع الخطة (Basic/Standard/Premium) والمدة. قد يتطلب بريد/حساب حسب طريقة التفعيل.",
        tags: ["Netflix", "اشتراك", "Streaming"],
        requirements: ["الخطة", "المدة", "تفاصيل الحساب/البريد إن لزم"],
        popularity: 92,
        createdAt: "2026-01-10",
        pricing: {
          type: "packages",
          packages: [
            { id: "1m_std", name: "شهر Standard", price: 7.99, desc: "" },
            { id: "1m_pre", name: "شهر Premium", price: 11.99, desc: "الأكثر طلبًا" },
            { id: "3m_pre", name: "3 أشهر Premium", price: 32.99, desc: "" },
          ],
        },
      },
      {
        id: "spotify",
        categoryId: "subs",
        name: "اشتراك Spotify Premium",
        short: "اشتراك بريميوم (فردي/عائلي حسب المتاح)",
        desc:
          "حدد نوع الاشتراك والمدة. قد يلزم بريد الحساب.",
        tags: ["Spotify", "Premium", "Music"],
        requirements: ["نوع الاشتراك", "المدة", "بريد الحساب (اختياري)"],
        popularity: 84,
        createdAt: "2026-01-12",
        pricing: {
          type: "packages",
          packages: [
            { id: "1m", name: "شهر", price: 3.99, desc: "" },
            { id: "3m", name: "3 أشهر", price: 10.99, desc: "قيمة أفضل" },
            { id: "12m", name: "سنة", price: 34.99, desc: "الأكثر توفيرًا" },
          ],
        },
      },
      {
        id: "discord_nitro",
        categoryId: "subs",
        name: "Discord Nitro",
        short: "اشتراك نيترو حسب المدة",
        desc:
          "أرسل رابط الحساب أو البريد حسب طريقة التفعيل.",
        tags: ["Discord", "Nitro"],
        requirements: ["المدة", "بريد/حساب (حسب الطريقة)"],
        popularity: 64,
        createdAt: "2026-01-14",
        pricing: {
          type: "packages",
          packages: [
            { id: "1m", name: "شهر", price: 6.99, desc: "" },
            { id: "12m", name: "سنة", price: 59.99, desc: "" },
          ],
        },
      },
      {
        id: "canva_pro",
        categoryId: "subs",
        name: "Canva Pro",
        short: "اشتراك كانفا برو",
        desc:
          "قد يلزم بريد الحساب أو دعوة فريق حسب طريقة التفعيل.",
        tags: ["Canva", "Pro", "Design"],
        requirements: ["المدة", "بريد الحساب أو طريقة التفعيل"],
        popularity: 77,
        createdAt: "2026-01-15",
        pricing: {
          type: "packages",
          packages: [
            { id: "1m", name: "شهر", price: 4.50, desc: "" },
            { id: "3m", name: "3 أشهر", price: 11.50, desc: "" },
            { id: "12m", name: "سنة", price: 34.50, desc: "الأكثر طلبًا" },
          ],
        },
      },

      /* Design */
      {
        id: "logo_design",
        categoryId: "design",
        name: "تصميم شعار (Logo)",
        short: "شعار بسيط وحديث + ملفات تسليم",
        desc:
          "اكتب اسم المشروع ونوع النشاط والألوان المفضلة (إن وجدت).",
        tags: ["Logo", "Branding", "Design"],
        requirements: ["اسم المشروع", "نوع النشاط", "ألوان مفضلة (اختياري)", "أمثلة تعجبك (اختياري)"],
        popularity: 90,
        createdAt: "2026-01-05",
        pricing: {
          type: "packages",
          packages: [
            { id: "basic", name: "Basic", price: 19.99, desc: "شعار بسيط + PNG" },
            { id: "pro", name: "Pro", price: 39.99, desc: "شعار + ملفات متعددة" },
            { id: "vip", name: "VIP", price: 79.99, desc: "شعار + هوية بسيطة" },
          ],
        },
      },
      {
        id: "post_design",
        categoryId: "design",
        name: "تصميم بوست سوشيال ميديا",
        short: "تصاميم جاهزة للنشر حسب عدد القطع",
        desc:
          "حدد المقاس (مربع/ستوري) واكتب النص والألوان والهوية.",
        tags: ["Post", "Social", "Design"],
        requirements: ["عدد التصاميم", "مقاس التصميم", "النص/المحتوى", "الألوان/الهوية (اختياري)"],
        popularity: 76,
        createdAt: "2026-01-08",
        pricing: {
          type: "packages",
          packages: [
            { id: "3", name: "3 تصاميم", price: 12.0, desc: "" },
            { id: "10", name: "10 تصاميم", price: 34.0, desc: "الأكثر طلبًا" },
            { id: "20", name: "20 تصميم", price: 62.0, desc: "" },
          ],
        },
      },
      {
        id: "yt_thumbnail",
        categoryId: "design",
        name: "تصميم Thumbnail يوتيوب",
        short: "ثمنيل احترافي لرفع CTR",
        desc:
          "أرسل عنوان الفيديو وصورة/صور إن وجدت، وطابع القناة.",
        tags: ["YouTube", "Thumbnail"],
        requirements: ["عنوان الفيديو", "أسلوب/طابع القناة", "صور (اختياري)"],
        popularity: 66,
        createdAt: "2026-01-09",
        pricing: {
          type: "base",
          basePrice: 6.0,
          unitLabel: "ثمنيل",
          note: "الكمية = عدد الثمنيلات",
        },
      },
      {
        id: "resume_cv",
        categoryId: "design",
        name: "تصميم سيرة ذاتية (CV)",
        short: "CV مرتب وحديث + PDF",
        desc:
          "أرسل بياناتك (خبرات/تعليم/مهارات) وسنرتبها بتصميم احترافي.",
        tags: ["CV", "Resume", "Design"],
        requirements: ["الاسم", "الخبرات", "التعليم", "المهارات", "لغة السيرة (AR/EN)"],
        popularity: 60,
        createdAt: "2026-01-11",
        pricing: {
          type: "packages",
          packages: [
            { id: "cv_basic", name: "Basic", price: 9.99, desc: "قالب بسيط مرتب" },
            { id: "cv_pro", name: "Pro", price: 19.99, desc: "تصميم احترافي + تعديلين" },
          ],
        },
      },

      /* Accounts / Services */
      {
        id: "account_recovery",
        categoryId: "accounts",
        name: "مساعدة استرجاع حساب",
        short: "مراجعة خطوات الاسترجاع وتقديم الدعم حسب الحالة",
        desc:
          "الخدمة عبارة عن إرشاد/مساعدة حسب نوع الحساب والمعلومات المتوفرة.",
        tags: ["Recovery", "Account", "Support"],
        requirements: ["نوع الحساب", "البريد/اسم المستخدم", "وصف المشكلة", "آخر وصول/معلومات متاحة"],
        popularity: 58,
        createdAt: "2026-01-02",
        pricing: {
          type: "base",
          basePrice: 12.0,
          unitLabel: "حالة",
          note: "قد تختلف حسب الحالة وتعقيدها.",
        },
      },
      {
        id: "steam_wallet",
        categoryId: "games",
        name: "Steam Wallet Gift Card",
        short: "بطاقة ستيم (حسب المتاح)",
        desc:
          "حدد قيمة البطاقة والمنطقة إن وجدت.",
        tags: ["Steam", "Gift Card", "Wallet"],
        requirements: ["قيمة البطاقة", "المنطقة (اختياري)"],
        popularity: 62,
        createdAt: "2026-01-06",
        pricing: { type: "base", basePrice: 10.0, unitLabel: "بطاقة", note: "سعر البداية حسب القيمة." },
      },
      {
        id: "ps_gift",
        categoryId: "games",
        name: "PlayStation Gift Card",
        short: "بطاقة بلايستيشن (حسب المتاح)",
        desc:
          "حدد قيمة البطاقة والمنطقة.",
        tags: ["PlayStation", "PSN", "Gift Card"],
        requirements: ["قيمة البطاقة", "المنطقة"],
        popularity: 68,
        createdAt: "2026-01-07",
        pricing: { type: "base", basePrice: 10.0, unitLabel: "بطاقة", note: "سعر البداية حسب القيمة." },
      },

      /* Misc */
      {
        id: "custom_service",
        categoryId: "misc",
        name: "خدمة مخصصة (حسب الطلب)",
        short: "اطلب خدمة غير موجودة بالقائمة",
        desc:
          "إذا لم تجد خدمتك، اكتب تفاصيلها وسنرد عليك بالتأكيد والسعر إن كانت متاحة.",
        tags: ["Custom", "Request", "Support"],
        requirements: ["شرح الخدمة المطلوبة", "أي روابط/معلومات ذات صلة", "موعد/مدة مطلوبة (إن وجدت)"],
        popularity: 55,
        createdAt: "2026-01-01",
        pricing: { type: "base", basePrice: 1.0, unitLabel: "طلب", note: "قيمة رمزية—السعر النهائي حسب الخدمة." },
      },
    ],
  };

  /* =========================
     2) Helpers
     ========================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const safeJsonParse = (text, fallback) => {
    try { return JSON.parse(text); } catch { return fallback; }
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  const nowStamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  const uid = (prefix = "id") => {
    const r = Math.random().toString(16).slice(2);
    const t = Date.now().toString(16);
    return `${prefix}_${t}_${r}`;
  };

  const normalizeText = (s) => (s || "")
    .toString()
    .trim()
    .toLowerCase()
    // تبسيط بعض الحروف العربية (اختياري)
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه");

  const tokenize = (q) => normalizeText(q).split(/\s+/).filter(Boolean);

  const sanitizePhone = (s) => (s || "").toString().replace(/[^\d]/g, "");

  const roundMoney = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  const moneyFormatter = (() => {
    try {
      return new Intl.NumberFormat(CONFIG.store.locale === "ar" ? "ar" : "en", {
        style: "currency",
        currency: CONFIG.store.currency,
        maximumFractionDigits: 2,
      });
    } catch {
      return null;
    }
  })();

  const formatMoney = (amount) => {
    const n = roundMoney(amount);
    if (moneyFormatter) return moneyFormatter.format(n);
    return `${n.toFixed(2)} ${CONFIG.store.currency}`;
  };

  const escapeHtml = (s) => (s || "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const debounce = (fn, ms = 150) => {
    let t = null;
    return (...args) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const isNonEmpty = (s) => (s || "").toString().trim().length > 0;

  const pluralize = (n, singular, plural) => (n === 1 ? singular : plural);

  /* =========================
     3) Storage
     ========================= */
  const STORAGE_KEY = "serag_store_state_v1";

  const Storage = {
    load() {
      if (!CONFIG.settings.persistState) return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return safeJsonParse(raw, null);
    },
    save(state) {
      if (!CONFIG.settings.persistState) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    },
    clear() {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    },
  };

  /* =========================
     4) State
     ========================= */
  const State = {
    categoryId: "all",
    search: "",
    sort: "popular",
    couponCode: "",
    cart: [], // items
    customer: {
      name: "",
      phone: "",
      note: "",
    },
    lastMessage: "",
  };

  /* =========================
     5) DOM refs
     ========================= */
  const els = {
    storeName: $("#storeName"),
    storeTagline: $("#storeTagline"),
    heroTitle: $("#heroTitle"),
    heroDesc: $("#heroDesc"),
    footerName: $("#footerName"),
    footerPolicy: $("#footerPolicy"),

    categories: $("#categories"),
    servicesGrid: $("#servicesGrid"),
    emptyState: $("#emptyState"),
    emptyResetBtn: $("#emptyResetBtn"),
    resultsMeta: $("#resultsMeta"),

    searchInput: $("#searchInput"),
    clearSearchBtn: $("#clearSearchBtn"),
    sortSelect: $("#sortSelect"),
    resetFiltersBtn: $("#resetFiltersBtn"),

    openCartBtn: $("#openCartBtn"),
    cartCount: $("#cartCount"),
    cartCountDrawer: $("#cartCountDrawer"),

    backdrop: $("#backdrop"),

    serviceModal: $("#serviceModal"),
    serviceModalTitle: $("#serviceModalTitle"),
    serviceModalSubtitle: $("#serviceModalSubtitle"),
    serviceModalBody: $("#serviceModalBody"),
    serviceModalPriceHint: $("#serviceModalPriceHint"),
    closeServiceModalBtn: $("#closeServiceModalBtn"),
    serviceModalCancelBtn: $("#serviceModalCancelBtn"),
    addToCartBtn: $("#addToCartBtn"),

    cartDrawer: $("#cartDrawer"),
    closeCartBtn: $("#closeCartBtn"),
    cartItems: $("#cartItems"),

    couponInput: $("#couponInput"),
    applyCouponBtn: $("#applyCouponBtn"),
    couponStatus: $("#couponStatus"),

    customerName: $("#customerName"),
    customerPhone: $("#customerPhone"),
    customerNote: $("#customerNote"),

    orderSummary: $("#orderSummary"),
    buildMessageBtn: $("#buildMessageBtn"),
    copyMessageBtn: $("#copyMessageBtn"),
    sendWhatsAppBtn: $("#sendWhatsAppBtn"),
    shareTelegramBtn: $("#shareTelegramBtn"),
    clearCartBtn: $("#clearCartBtn"),

    messageModal: $("#messageModal"),
    closeMessageModalBtn: $("#closeMessageModalBtn"),
    messageOutput: $("#messageOutput"),
    messageStats: $("#messageStats"),
    messageCopyBtn: $("#messageCopyBtn"),
    messageWhatsBtn: $("#messageWhatsBtn"),
    messageTgBtn: $("#messageTgBtn"),

    toast: $("#toast"),

    scrollToHowBtn: $("#scrollToHowBtn"),

    whatsBtnFooter: $("#whatsBtnFooter"),
    tgBtnFooter: $("#tgBtnFooter"),
  };

  /* =========================
     6) Derived data helpers
     ========================= */
  const getCategoryName = (id) => {
    const c = CONFIG.categories.find(x => x.id === id);
    return c ? c.name : "—";
  };

  const getServiceById = (serviceId) => CONFIG.services.find(s => s.id === serviceId);

  const getPackageById = (service, packageId) => {
    if (!service || service.pricing?.type !== "packages") return null;
    return (service.pricing.packages || []).find(p => p.id === packageId) || null;
  };

  const getMinPrice = (service) => {
    if (!service) return 0;
    const pr = service.pricing;
    if (!pr) return 0;
    if (pr.type === "base") return Number(pr.basePrice || 0);
    if (pr.type === "packages") {
      const prices = (pr.packages || []).map(p => Number(p.price || 0));
      return prices.length ? Math.min(...prices) : 0;
    }
    return 0;
  };

  const getUnitPrice = (service, packageId) => {
    if (!service) return 0;
    const pr = service.pricing;
    if (!pr) return 0;

    if (pr.type === "base") return Number(pr.basePrice || 0);

    if (pr.type === "packages") {
      const pkg = getPackageById(service, packageId);
      if (pkg) return Number(pkg.price || 0);
      // fallback: min price
      return getMinPrice(service);
    }
    return 0;
  };

  /* =========================
     7) Toast
     ========================= */
  let toastTimer = null;
  const showToast = (msg, ms = 2200) => {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.hidden = false;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
      els.toast.textContent = "";
    }, ms);
  };

  /* =========================
     8) Modal/Drawer toggles
     ========================= */
  const setBackdrop = (on) => {
    els.backdrop.hidden = !on;
  };

  const openModal = (modalEl) => {
    if (!modalEl) return;
    setBackdrop(true);
    modalEl.hidden = false;
    // Prevent scroll behind modal
    document.body.style.overflow = "hidden";
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.hidden = true;
    // If no other overlays open, remove backdrop
    const anyOpen = !els.serviceModal.hidden || !els.messageModal.hidden || !els.cartDrawer.hidden;
    setBackdrop(anyOpen);
    if (!anyOpen) document.body.style.overflow = "";
  };

  const openCart = () => {
    els.cartDrawer.hidden = false;
    setBackdrop(true);
    document.body.style.overflow = "hidden";
    renderCart();
    updateShareLinks(); // ensure current
  };

  const closeCart = () => {
    els.cartDrawer.hidden = true;
    const anyOpen = !els.serviceModal.hidden || !els.messageModal.hidden;
    setBackdrop(anyOpen);
    if (!anyOpen) document.body.style.overflow = "";
  };

  /* =========================
     9) Cart logic
     ========================= */
  const makeCartKey = (serviceId, packageId, note) => {
    // note does not affect merging unless you want it to
    // By default we merge only by serviceId+packageId and ignore note if empty
    const n = normalizeText(note || "");
    return `${serviceId}::${packageId || ""}::${n}`;
  };

  const findCartItemIndex = (serviceId, packageId, note) => {
    if (!CONFIG.settings.enableMergeSameItems) return -1;

    // Merge rules:
    // - If note is empty: merge by serviceId+packageId (ignore note)
    // - If note is not empty: merge only if same note
    const noteNorm = normalizeText(note || "");
    for (let i = 0; i < State.cart.length; i++) {
      const it = State.cart[i];
      if (it.serviceId !== serviceId) continue;
      if ((it.packageId || "") !== (packageId || "")) continue;

      const itNoteNorm = normalizeText(it.note || "");
      if (!noteNorm && !itNoteNorm) return i;           // both empty
      if (noteNorm && itNoteNorm && noteNorm === itNoteNorm) return i;
    }
    return -1;
  };

  const addToCart = ({ serviceId, packageId, qty, note }) => {
    const service = getServiceById(serviceId);
    if (!service) return;

    const q = clamp(Number(qty || 1), 1, CONFIG.settings.maxQty);

    const unitPrice = getUnitPrice(service, packageId);
    const pkg = getPackageById(service, packageId);

    const idx = findCartItemIndex(serviceId, packageId, note);

    if (idx >= 0) {
      State.cart[idx].qty = clamp(State.cart[idx].qty + q, 1, CONFIG.settings.maxQty);
      // If note was empty and new note provided, keep the most informative one
      if (!isNonEmpty(State.cart[idx].note) && isNonEmpty(note)) State.cart[idx].note = note;
    } else {
      State.cart.push({
        id: uid("item"),
        serviceId,
        packageId: packageId || null,
        qty: q,
        note: note || "",
        // snapshot (so if prices change later, cart retains)
        snapshot: {
          name: service.name,
          categoryId: service.categoryId,
          packageName: pkg ? pkg.name : null,
          unitLabel: service.pricing?.type === "base" ? (service.pricing.unitLabel || "وحدة") : "باقة",
          unitPrice: unitPrice,
          requirements: Array.isArray(service.requirements) ? service.requirements.slice() : [],
        },
      });
    }

    persist();
    updateCartCount();
    showToast("تمت الإضافة للسلة ✅");

    if (CONFIG.settings.autoOpenCartAfterAdd) openCart();
  };

  const removeCartItem = (id) => {
    State.cart = State.cart.filter(it => it.id !== id);
    persist();
    updateCartCount();
    renderCart();
  };

  const updateCartQty = (id, delta) => {
    const it = State.cart.find(x => x.id === id);
    if (!it) return;
    it.qty = clamp(it.qty + delta, 1, CONFIG.settings.maxQty);
    persist();
    updateCartCount();
    renderCart();
  };

  const setCartNote = (id, note) => {
    const it = State.cart.find(x => x.id === id);
    if (!it) return;
    it.note = note;
    persist();
    renderCartSummaryOnly();
  };

  const clearCart = () => {
    State.cart = [];
    State.couponCode = "";
    els.couponInput.value = "";
    persist();
    updateCartCount();
    renderCart();
    showToast("تم تفريغ السلة 🧹");
  };

  /* =========================
     10) Coupon logic
     ========================= */
  const findCoupon = (codeRaw) => {
    if (!CONFIG.settings.enableCoupons) return null;
    const code = normalizeText(codeRaw).toUpperCase();
    if (!code) return null;
    const c = CONFIG.coupons.find(x => normalizeText(x.code).toUpperCase() === code);
    if (!c || !c.active) return null;
    return c;
  };

  const calcTotals = () => {
    const subtotal = roundMoney(State.cart.reduce((acc, it) => {
      const unit = Number(it.snapshot?.unitPrice || 0);
      return acc + unit * Number(it.qty || 0);
    }, 0));

    let discount = 0;
    let coupon = null;

    const code = (State.couponCode || "").trim();
    if (code) {
      coupon = findCoupon(code);
      if (coupon && subtotal >= Number(coupon.minSubtotal || 0)) {
        if (coupon.type === "percent") discount = subtotal * (Number(coupon.value || 0) / 100);
        if (coupon.type === "fixed") discount = Number(coupon.value || 0);
      }
    }

    discount = roundMoney(clamp(discount, 0, subtotal));
    const total = roundMoney(subtotal - discount);

    return { subtotal, discount, total, coupon };
  };

  const applyCoupon = () => {
    if (!CONFIG.settings.enableCoupons) {
      showToast("الكوبونات غير مفعلة");
      return;
    }

    const code = (els.couponInput.value || "").trim();
    State.couponCode = code;

    const { subtotal, discount, coupon } = calcTotals();

    if (!code) {
      els.couponStatus.textContent = "أدخل كوبون إن وجد.";
      persist();
      renderCartSummaryOnly();
      return;
    }

    if (!coupon) {
      els.couponStatus.textContent = "الكوبون غير صحيح أو غير مفعل.";
      showToast("الكوبون غير صحيح ❌");
      persist();
      renderCartSummaryOnly();
      return;
    }

    if (subtotal < Number(coupon.minSubtotal || 0)) {
      els.couponStatus.textContent = `هذا الكوبون يحتاج حد أدنى ${formatMoney(Number(coupon.minSubtotal || 0))}.`;
      showToast("لم يتحقق الحد الأدنى للكوبون ⚠️");
      persist();
      renderCartSummaryOnly();
      return;
    }

    els.couponStatus.textContent = `تم تطبيق الكوبون (${coupon.code}) ✅ الخصم: ${formatMoney(discount)}`;
    showToast("تم تطبيق الكوبون ✅");
    persist();
    renderCartSummaryOnly();
  };

  /* =========================
     11) Filters / search / sort
     ========================= */
  const serviceMatches = (service, queryTokens) => {
    if (!queryTokens.length) return true;

    const hay = normalizeText([
      service.name,
      service.short,
      service.desc,
      (service.tags || []).join(" "),
      (service.requirements || []).join(" "),
      // include packages names too
      service.pricing?.type === "packages" ? (service.pricing.packages || []).map(p => p.name).join(" ") : "",
    ].join(" "));

    return queryTokens.every(t => hay.includes(t));
  };

  const getFilteredServices = () => {
    let list = CONFIG.services.slice();

    if (State.categoryId && State.categoryId !== "all") {
      list = list.filter(s => s.categoryId === State.categoryId);
    }

    const tokens = tokenize(State.search);
    if (tokens.length) list = list.filter(s => serviceMatches(s, tokens));

    // Sorting
    const sort = State.sort || "popular";
    const byNewest = (a, b) => (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    if (sort === "popular") {
      list.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
    } else if (sort === "price_asc") {
      list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (sort === "price_desc") {
      list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    } else if (sort === "az") {
      list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
    } else if (sort === "newest") {
      list.sort(byNewest);
    }

    return list;
  };

  /* =========================
     12) Rendering - Categories
     ========================= */
  const renderCategories = () => {
    els.categories.innerHTML = "";
    CONFIG.categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill" + (State.categoryId === cat.id ? " active" : "");
      btn.textContent = cat.name;

      btn.addEventListener("click", () => {
        State.categoryId = cat.id;
        persist();
        renderAll();
      });

      els.categories.appendChild(btn);
    });
  };

  /* =========================
     13) Rendering - Services
     ========================= */
  const renderServices = () => {
    const list = getFilteredServices();

    els.servicesGrid.innerHTML = "";

    // Meta
    const total = CONFIG.services.length;
    const shown = list.length;
    const catName = State.categoryId === "all" ? "كل التصنيفات" : getCategoryName(State.categoryId);
    const q = (State.search || "").trim();

    els.resultsMeta.textContent =
      `عرض ${shown} من ${total} — ${catName}` + (q ? ` — بحث: "${q}"` : "");

    // Empty
    if (!list.length) {
      els.emptyState.hidden = false;
      return;
    }
    els.emptyState.hidden = true;

    // Cards
    list.forEach(service => {
      const card = document.createElement("article");
      card.className = "card";

      const cat = getCategoryName(service.categoryId);
      const minPrice = getMinPrice(service);
      const priceText = (service.pricing?.type === "packages")
        ? `من ${formatMoney(minPrice)}`
        : `${formatMoney(minPrice)}${service.pricing?.unitLabel ? ` / ${service.pricing.unitLabel}` : ""}`;

      const tags = Array.isArray(service.tags) ? service.tags.slice(0, 3) : [];
      const tagsHtml = tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

      card.innerHTML = `
        <div class="card-top">
          <div>
            <h3 class="card-title">${escapeHtml(service.name)}</h3>
            <p class="card-desc">${escapeHtml(service.short || "")}</p>
          </div>
          <span class="card-cat">${escapeHtml(cat)}</span>
        </div>

        <div class="card-meta">
          <div class="price">${escapeHtml(priceText)} <small></small></div>
          <div class="tags">${tagsHtml}</div>
        </div>

        <div class="card-actions">
          <button class="btn btn-ghost" type="button" data-action="details">التفاصيل</button>
          <button class="btn btn-primary" type="button" data-action="quickadd">إضافة</button>
        </div>
      `;

      // Events
      card.querySelector('[data-action="details"]').addEventListener("click", () => openServiceModal(service.id));
      card.querySelector('[data-action="quickadd"]').addEventListener("click", () => openServiceModal(service.id, { quickAdd: true }));

      els.servicesGrid.appendChild(card);
    });
  };

  /* =========================
     14) Service Modal (details + add)
     ========================= */
  let currentServiceId = null;

  const openServiceModal = (serviceId, opts = {}) => {
    const service = getServiceById(serviceId);
    if (!service) return;

    currentServiceId = serviceId;

    els.serviceModalTitle.textContent = service.name;
    els.serviceModalSubtitle.textContent = `${getCategoryName(service.categoryId)} • ${service.short || ""}`.trim();

    const requirements = (service.requirements || []).map(r => `<li>${escapeHtml(r)}</li>`).join("");
    const tags = (service.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const pricingUI = buildPricingUI(service);
    const hint = service.pricing?.note ? service.pricing.note : "حدد الباقة/الكمية ثم أدخل التفاصيل.";
    els.serviceModalPriceHint.textContent = hint;

    const placeholder = (service.requirements || []).length
      ? `اكتب التفاصيل المطلوبة مثل:\n- ${service.requirements.join("\n- ")}`
      : "اكتب تفاصيل الطلب (اختياري)";

    els.serviceModalBody.innerHTML = `
      <div class="panel mini">
        <div class="panel-title">وصف الخدمة</div>
        <div class="muted">${escapeHtml(service.desc || service.short || "")}</div>
        <div class="tags" style="margin-top:10px">${tags}</div>
      </div>

      <div class="panel mini">
        <div class="panel-title">المطلوب لإتمام الخدمة</div>
        <ul class="muted" style="margin:0; padding-inline-start:18px">
          ${requirements || `<li>لا يوجد متطلبات محددة—اكتب ما يلزم داخل تفاصيل الطلب.</li>`}
        </ul>
      </div>

      <div class="panel mini">
        <div class="panel-title">السعر / الباقات</div>
        ${pricingUI}
      </div>

      <div class="panel mini">
        <div class="panel-title">الكمية</div>
        <div class="row" style="justify-content:space-between; flex-wrap:wrap">
          <div class="qty">
            <button class="icon-btn" id="qtyMinusBtn" type="button" aria-label="نقص">−</button>
            <span id="qtyValue">1</span>
            <button class="icon-btn" id="qtyPlusBtn" type="button" aria-label="زيادة">+</button>
          </div>
          <div class="muted tiny">الحد الأقصى: ${CONFIG.settings.maxQty}</div>
        </div>
      </div>

      <div class="panel mini">
        <div class="panel-title">تفاصيل الطلب لهذه الخدمة</div>
        <textarea class="textarea" id="serviceNote" rows="5" placeholder="${escapeHtml(placeholder)}"></textarea>
        <div class="muted tiny" style="margin-top:6px">
          اكتب هنا ID / رابط / مدة / أي تفاصيل مهمة. سيتم وضعها داخل رسالة الطلب النهائية.
        </div>
      </div>
    `;

    // qty logic
    let qty = 1;
    const qtyValue = $("#qtyValue", els.serviceModalBody);
    const minus = $("#qtyMinusBtn", els.serviceModalBody);
    const plus = $("#qtyPlusBtn", els.serviceModalBody);

    const syncQty = () => { qtyValue.textContent = String(qty); };

    minus.addEventListener("click", () => { qty = clamp(qty - 1, 1, CONFIG.settings.maxQty); syncQty(); });
    plus.addEventListener("click", () => { qty = clamp(qty + 1, 1, CONFIG.settings.maxQty); syncQty(); });

    // preselect first package if needed
    if (service.pricing?.type === "packages") {
      const first = (service.pricing.packages || [])[0];
      if (first) {
        const radio = $(`input[name="pkg"][value="${CSS.escape(first.id)}"]`, els.serviceModalBody);
        if (radio) radio.checked = true;
      }
    }

    // Add button
    els.addToCartBtn.onclick = () => {
      const note = ($("#serviceNote", els.serviceModalBody)?.value || "").trim();
      const packageId = getSelectedPackageId(service);
      const unitPrice = getUnitPrice(service, packageId);

      if (unitPrice <= 0) {
        showToast("تعذر تحديد السعر—راجع بيانات الخدمة.");
        return;
      }

      addToCart({ serviceId, packageId, qty, note });
      closeModal(els.serviceModal);
    };

    // quickAdd: open modal but focus add (optional)
    openModal(els.serviceModal);

    if (opts.quickAdd) {
      // Focus on details textarea for speed
      const ta = $("#serviceNote", els.serviceModalBody);
      if (ta) setTimeout(() => ta.focus(), 120);
    }
  };

  const buildPricingUI = (service) => {
    const pr = service.pricing;
    if (!pr) return `<div class="muted">لا يوجد تسعير محدد.</div>`;

    if (pr.type === "base") {
      const label = pr.unitLabel ? ` / ${escapeHtml(pr.unitLabel)}` : "";
      return `
        <div class="sum-row">
          <div class="k">السعر</div>
          <div class="v"><strong>${escapeHtml(formatMoney(Number(pr.basePrice || 0)))}</strong>${label}</div>
        </div>
        ${pr.note ? `<div class="muted tiny" style="margin-top:6px">${escapeHtml(pr.note)}</div>` : ""}
      `;
    }

    if (pr.type === "packages") {
      const pkgs = (pr.packages || []).map((p, idx) => {
        const pid = `pkg_${service.id}_${p.id}`;
        return `
          <label class="pkg" style="display:flex; gap:10px; align-items:flex-start; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.02); margin-bottom:8px; cursor:pointer">
            <input type="radio" name="pkg" value="${escapeHtml(p.id)}" id="${escapeHtml(pid)}" ${idx === 0 ? "checked" : ""} />
            <span style="flex:1">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
                <strong>${escapeHtml(p.name)}</strong>
                <span class="price">${escapeHtml(formatMoney(Number(p.price || 0)))}</span>
              </div>
              ${p.desc ? `<div class="muted tiny" style="margin-top:4px">${escapeHtml(p.desc)}</div>` : ""}
            </span>
          </label>
        `;
      }).join("");

      return pkgs || `<div class="muted">لا توجد باقات.</div>`;
    }

    return `<div class="muted">نوع تسعير غير مدعوم.</div>`;
  };

  const getSelectedPackageId = (service) => {
    if (service.pricing?.type !== "packages") return null;
    const checked = $('input[name="pkg"]:checked', els.serviceModalBody);
    return checked ? checked.value : null;
  };

  /* =========================
     15) Rendering - Cart
     ========================= */
  const updateCartCount = () => {
    const count = State.cart.reduce((acc, it) => acc + Number(it.qty || 0), 0);
    els.cartCount.textContent = String(count);
    els.cartCountDrawer.textContent = String(count);
  };

  const renderCart = () => {
    // Items
    if (!State.cart.length) {
      els.cartItems.innerHTML = `
        <div class="empty" style="margin:0">
          <div class="empty-icon">🛒</div>
          <div class="empty-title">السلة فارغة</div>
          <div class="empty-desc">أضف خدمات لتجهيز رسالة طلب.</div>
        </div>
      `;
    } else {
      els.cartItems.innerHTML = State.cart.map(it => {
        const name = it.snapshot?.name || "خدمة";
        const pkg = it.snapshot?.packageName ? ` • ${it.snapshot.packageName}` : "";
        const unit = Number(it.snapshot?.unitPrice || 0);
        const line = roundMoney(unit * Number(it.qty || 0));

        const req = (it.snapshot?.requirements || []).slice(0, 3);
        const reqHint = req.length
          ? `المطلوب: ${req.join("، ")}`
          : "المطلوب: —";

        return `
          <div class="cart-item" data-id="${escapeHtml(it.id)}">
            <div class="cart-item-head">
              <div>
                <div class="cart-item-title">${escapeHtml(name)}</div>
                <div class="cart-item-sub">
                  ${escapeHtml(pkg)}<span style="opacity:.65"> • </span>
                  <span>${escapeHtml(formatMoney(unit))} × ${escapeHtml(String(it.qty))} = <strong>${escapeHtml(formatMoney(line))}</strong></span>
                </div>
                <div class="muted tiny" style="margin-top:4px">${escapeHtml(reqHint)}</div>
              </div>
              <button class="icon-btn" type="button" data-action="remove" title="حذف" aria-label="حذف">🗑️</button>
            </div>

            <div class="cart-item-controls">
              <div class="qty">
                <button class="icon-btn" type="button" data-action="minus" aria-label="نقص">−</button>
                <span>${escapeHtml(String(it.qty))}</span>
                <button class="icon-btn" type="button" data-action="plus" aria-label="زيادة">+</button>
              </div>

              <div style="flex:1; min-width: 180px">
                <textarea class="textarea" rows="2" data-action="note" placeholder="تفاصيل الطلب (ID/رابط/مدة...)">${escapeHtml(it.note || "")}</textarea>
              </div>
            </div>
          </div>
        `;
      }).join("");

      // bind events
      $$(".cart-item", els.cartItems).forEach(itemEl => {
        const id = itemEl.getAttribute("data-id");
        const btnRemove = $('[data-action="remove"]', itemEl);
        const btnMinus = $('[data-action="minus"]', itemEl);
        const btnPlus = $('[data-action="plus"]', itemEl);
        const noteTa = $('[data-action="note"]', itemEl);

        btnRemove.addEventListener("click", () => removeCartItem(id));
        btnMinus.addEventListener("click", () => updateCartQty(id, -1));
        btnPlus.addEventListener("click", () => updateCartQty(id, +1));

        noteTa.addEventListener("input", debounce((e) => setCartNote(id, e.target.value), 120));
      });
    }

    // coupon
    if (!CONFIG.settings.enableCoupons) {
      els.couponStatus.textContent = "الكوبونات غير مفعلة.";
      els.couponInput.disabled = true;
      els.applyCouponBtn.disabled = true;
    } else {
      els.couponInput.disabled = false;
      els.applyCouponBtn.disabled = false;
      els.couponInput.value = State.couponCode || "";
      els.couponStatus.textContent = State.couponCode ? "اضغط تطبيق لتحديث الخصم." : "أدخل كوبون إن وجد.";
    }

    // customer
    els.customerName.value = State.customer.name || "";
    els.customerPhone.value = State.customer.phone || "";
    els.customerNote.value = State.customer.note || "";

    renderCartSummaryOnly();
  };

  const renderCartSummaryOnly = () => {
    const { subtotal, discount, total, coupon } = calcTotals();

    const couponLine = (discount > 0 && coupon)
      ? `<div class="sum-row"><div class="k">الخصم (${escapeHtml(coupon.code)})</div><div class="v">− ${escapeHtml(formatMoney(discount))}</div></div>`
      : `<div class="sum-row"><div class="k">الخصم</div><div class="v">—</div></div>`;

    els.orderSummary.innerHTML = `
      <div class="sum-row"><div class="k">المجموع</div><div class="v">${escapeHtml(formatMoney(subtotal))}</div></div>
      ${couponLine}
      <div class="sum-row total"><div class="k">الإجمالي النهائي</div><div class="v">${escapeHtml(formatMoney(total))}</div></div>
    `;

    // Update share links based on current message
    updateShareLinks();
  };

  /* =========================
     16) Order message builder
     ========================= */
  const validateCheckout = () => {
    if (!State.cart.length) {
      showToast("السلة فارغة—أضف خدمات أولاً.");
      return false;
    }

    if (CONFIG.settings.requireCustomerName && !isNonEmpty(State.customer.name)) {
      showToast("اكتب اسم العميل أولاً.");
      els.customerName.focus();
      return false;
    }

    if (CONFIG.settings.requireCustomerPhone && !isNonEmpty(State.customer.phone)) {
      showToast("اكتب رقم التواصل أولاً.");
      els.customerPhone.focus();
      return false;
    }

    return true;
  };

  const buildOrderMessage = () => {
    const { subtotal, discount, total, coupon } = calcTotals();
    const orderId = uid("order").slice(-10).toUpperCase();

    const lines = [];
    lines.push(`🕯️ ${CONFIG.store.name}`);
    lines.push(`📌 طلب خدمات رقمية`);
    lines.push(`🧾 رقم الطلب: ${orderId}`);
    lines.push(`⏱️ التاريخ: ${nowStamp()}`);
    lines.push("");

    lines.push("👤 بيانات العميل:");
    lines.push(`- الاسم: ${State.customer.name || "—"}`);
    lines.push(`- رقم التواصل: ${State.customer.phone || "—"}`);
    if (isNonEmpty(State.customer.note)) lines.push(`- ملاحظة: ${State.customer.note}`);
    lines.push("");

    lines.push("🛒 تفاصيل الطلب:");
    State.cart.forEach((it, idx) => {
      const name = it.snapshot?.name || "خدمة";
      const pkg = it.snapshot?.packageName ? ` (${it.snapshot.packageName})` : "";
      const unit = Number(it.snapshot?.unitPrice || 0);
      const qty = Number(it.qty || 0);
      const lineTotal = roundMoney(unit * qty);
      const req = (it.snapshot?.requirements || []);
      const reqText = req.length ? req.join("، ") : "—";

      lines.push(`${idx + 1}) ${name}${pkg}`);
      lines.push(`   • الكمية: ${qty}`);
      lines.push(`   • سعر الوحدة: ${formatMoney(unit)}`);
      lines.push(`   • الإجمالي: ${formatMoney(lineTotal)}`);
      lines.push(`   • المطلوب: ${reqText}`);
      if (isNonEmpty(it.note)) lines.push(`   • تفاصيل: ${it.note}`);
      else lines.push(`   • تفاصيل: (لم يتم إدخال تفاصيل)`);
      lines.push("");
    });

    lines.push("💰 ملخص الأسعار:");
    lines.push(`- المجموع: ${formatMoney(subtotal)}`);
    if (discount > 0 && coupon) {
      lines.push(`- الخصم (${coupon.code}): − ${formatMoney(discount)}`);
    } else {
      lines.push(`- الخصم: —`);
    }
    lines.push(`- الإجمالي النهائي: ${formatMoney(total)}`);
    lines.push("");

    lines.push("📎 ملاحظات المتجر:");
    lines.push(`- التنفيذ: ${CONFIG.policies.deliveryNote}`);
    lines.push(`- الضمان: ${CONFIG.policies.warrantyNote}`);
    lines.push("");

    lines.push("✅ الرجاء تأكيد توفر كل المعلومات المطلوبة لكل خدمة (ID/رابط/مدة...).");
    lines.push("");

    // Contact hint
    const wa = buildWhatsAppLink("(اكتب هنا رسالة)", { onlyBase: true });
    const tg = buildTelegramShareLink("(اكتب هنا رسالة)", { onlyBase: true });

    lines.push("📩 التواصل:");
    lines.push(`- واتساب: ${wa}`);
    lines.push(`- تيليجرام: ${tg}`);

    return lines.join("\n");
  };

  /* =========================
     17) WhatsApp / Telegram links
     ========================= */
  const buildWhatsAppLink = (message, opts = {}) => {
    const number = sanitizePhone(CONFIG.contact.whatsappNumber);
    const text = encodeURIComponent(message || "");
    if (opts.onlyBase) return `https://wa.me/${number}`;
    return `https://wa.me/${number}?text=${text}`;
  };

  const buildTelegramShareLink = (message, opts = {}) => {
    // Share URL (works well from web)
    const text = encodeURIComponent(message || "");
    if (opts.onlyBase) return `https://t.me/${CONFIG.contact.telegramUsername}`;
    return `https://t.me/share/url?url=&text=${text}`;
  };

  const updateShareLinks = () => {
    const message = State.lastMessage || buildOrderMessageSafePreview();
    els.sendWhatsAppBtn.href = buildWhatsAppLink(message);
    els.shareTelegramBtn.href = buildTelegramShareLink(message);

    // footer direct links
    els.whatsBtnFooter.href = buildWhatsAppLink("");
    els.tgBtnFooter.href = `https://t.me/${CONFIG.contact.telegramUsername}`;
  };

  const buildOrderMessageSafePreview = () => {
    // If invalid, generate short preview without blocking
    const { subtotal, discount, total, coupon } = calcTotals();
    const couponTxt = (discount > 0 && coupon) ? ` (Coupon: ${coupon.code})` : "";
    const count = State.cart.reduce((acc, it) => acc + Number(it.qty || 0), 0);
    return `🕯️ ${CONFIG.store.name}\nطلب سريع\nعدد العناصر: ${count}\nالمجموع: ${formatMoney(total)}${couponTxt}\n\n(افتح الموقع لتجهيز رسالة كاملة)`;
  };

  /* =========================
     18) Copy
     ========================= */
  const copyText = async (text) => {
    const t = (text || "").toString();
    if (!t) return false;

    // Modern clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(t);
        return true;
      }
    } catch {}

    // Fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  /* =========================
     19) Build message actions
     ========================= */
  const openMessageModal = () => {
    if (!validateCheckout()) return;

    const msg = buildOrderMessage();
    State.lastMessage = msg;
    persist();

    els.messageOutput.value = msg;
    els.messageStats.textContent = `${msg.length} حرف • ${State.cart.length} خدمة`;
    els.messageWhatsBtn.href = buildWhatsAppLink(msg);
    els.messageTgBtn.href = buildTelegramShareLink(msg);

    openModal(els.messageModal);
  };

  const copyOrderMessage = async () => {
    if (!validateCheckout()) return;
    const msg = buildOrderMessage();
    State.lastMessage = msg;
    persist();

    const ok = await copyText(msg);
    if (ok) showToast("تم نسخ رسالة الطلب ✅");
    else showToast("تعذر النسخ—انسخ يدويًا من نافذة الرسالة.");
  };

  /* =========================
     20) Persist / load
     ========================= */
  const persist = () => {
    Storage.save({
      categoryId: State.categoryId,
      search: State.search,
      sort: State.sort,
      couponCode: State.couponCode,
      cart: State.cart,
      customer: State.customer,
      lastMessage: State.lastMessage,
    });
  };

  const hydrate = () => {
    const saved = Storage.load();
    if (!saved) return;

    State.categoryId = saved.categoryId || "all";
    State.search = saved.search || "";
    State.sort = saved.sort || "popular";
    State.couponCode = saved.couponCode || "";
    State.cart = Array.isArray(saved.cart) ? saved.cart : [];
    State.customer = saved.customer || { name: "", phone: "", note: "" };
    State.lastMessage = saved.lastMessage || "";
  };

  /* =========================
     21) Render all
     ========================= */
  const renderAll = () => {
    renderCategories();
    renderServices();
    updateCartCount();
    // keep drawer content synced if open
    if (!els.cartDrawer.hidden) renderCart();
  };

  /* =========================
     22) Events
     ========================= */
  const bindEvents = () => {
    // Search
    els.searchInput.value = State.search || "";
    els.searchInput.addEventListener("input", debounce((e) => {
      State.search = e.target.value || "";
      persist();
      renderServices();
    }, 120));

    els.clearSearchBtn.addEventListener("click", () => {
      State.search = "";
      els.searchInput.value = "";
      persist();
      renderServices();
      showToast("تم مسح البحث");
      els.searchInput.focus();
    });

    // Sort
    els.sortSelect.value = State.sort || "popular";
    els.sortSelect.addEventListener("change", (e) => {
      State.sort = e.target.value || "popular";
      persist();
      renderServices();
    });

    // Reset filters
    els.resetFiltersBtn.addEventListener("click", () => {
      State.categoryId = "all";
      State.search = "";
      State.sort = "popular";
      els.searchInput.value = "";
      els.sortSelect.value = "popular";
      persist();
      renderAll();
      showToast("تمت إعادة الضبط");
    });

    els.emptyResetBtn.addEventListener("click", () => {
      State.categoryId = "all";
      State.search = "";
      persist();
      els.searchInput.value = "";
      renderAll();
    });

    // Hero
    els.scrollToHowBtn.addEventListener("click", () => {
      const el = document.getElementById("how");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Cart open/close
    els.openCartBtn.addEventListener("click", openCart);
    els.closeCartBtn.addEventListener("click", closeCart);

    // Backdrop click closes top overlay
    els.backdrop.addEventListener("click", () => {
      if (!els.messageModal.hidden) closeModal(els.messageModal);
      else if (!els.serviceModal.hidden) closeModal(els.serviceModal);
      else if (!els.cartDrawer.hidden) closeCart();
    });

    // Service modal close
    els.closeServiceModalBtn.addEventListener("click", () => closeModal(els.serviceModal));
    els.serviceModalCancelBtn.addEventListener("click", () => closeModal(els.serviceModal));

    // Message modal close
    els.closeMessageModalBtn.addEventListener("click", () => closeModal(els.messageModal));
    els.messageCopyBtn.addEventListener("click", async () => {
      const ok = await copyText(els.messageOutput.value);
      if (ok) showToast("تم النسخ ✅");
      else showToast("تعذر النسخ");
    });

    // Coupon
    els.applyCouponBtn.addEventListener("click", applyCoupon);
    els.couponInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applyCoupon();
    });

    // Customer data
    els.customerName.addEventListener("input", debounce((e) => {
      State.customer.name = e.target.value || "";
      persist();
    }, 120));

    els.customerPhone.addEventListener("input", debounce((e) => {
      State.customer.phone = e.target.value || "";
      persist();
    }, 120));

    els.customerNote.addEventListener("input", debounce((e) => {
      State.customer.note = e.target.value || "";
      persist();
    }, 120));

    // Build message / copy
    els.buildMessageBtn.addEventListener("click", openMessageModal);
    els.copyMessageBtn.addEventListener("click", copyOrderMessage);

    // Clear cart
    els.clearCartBtn.addEventListener("click", () => {
      if (!State.cart.length) return;
      const ok = confirm("هل تريد تفريغ السلة؟");
      if (ok) clearCart();
    });

    // Keyboard ESC closes overlays
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!els.messageModal.hidden) closeModal(els.messageModal);
      else if (!els.serviceModal.hidden) closeModal(els.serviceModal);
      else if (!els.cartDrawer.hidden) closeCart();
    });

    // Basic nav smooth scroll
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  /* =========================
     23) Init
     ========================= */
  const initBranding = () => {
    // Branding text
    els.storeName.textContent = CONFIG.store.name;
    els.storeTagline.textContent = CONFIG.store.tagline;
    els.footerName.textContent = CONFIG.store.name;
    els.footerPolicy.textContent = CONFIG.policies.shortPolicy;

    // Emoji (optional)
    const marks = $$(".brand-mark, .footer-emoji");
    marks.forEach(el => { el.textContent = CONFIG.store.brandEmoji; });

    // If coupons disabled hide UI hint (we keep it but disabled)
    if (!CONFIG.settings.enableCoupons) {
      els.couponStatus.textContent = "الكوبونات غير مفعلة.";
    }
  };

  const init = () => {
    hydrate();
    initBranding();
    bindEvents();
    renderAll();
    updateShareLinks();
  };

  // Start
  document.addEventListener("DOMContentLoaded", init);

})();
  function setJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
})();
