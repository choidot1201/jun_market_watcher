// Silicon2 (실리콘투, 257720.KQ) brand-distribution ranking — Top 10 brands
// per period by Silicon2's own disclosed distribution scale (their IR
// materials), not an Amazon rank and not market share. Seeded from
// mooboard.xyz's public client bundle (this is the exact dataset it ships
// to every visitor's browser — reproducing it here is no different from
// viewing page source). Jun intends to update SILICON2_RANKINGS/PERIODS
// by hand each quarter from Silicon2's own IR deck.
//
// Local overrides (new periods Jun adds himself) are merged in at render
// time from localStorage — see kbeauty.js's loadSilicon2Overrides().

const SILICON2_TICKER = "257720.KQ";
const SILICON2_NAME = "Silicon2";

const SILICON2_PERIODS = ["2022", "2023", "2024", "2025", "1Q2026", "2Q2026"];

const SILICON2_RANKINGS = {
  "2022": [
    "COSRX",
    "SOME BY MI",
    "Pyunkang Yul",
    "Beauty of Joseon",
    "heimish",
    "BENTON",
    "Etude",
    "rom&nd",
    "Innisfree",
    "MIGUHARA"
  ],
  "2023": [
    "Beauty of Joseon",
    "COSRX",
    "Pyunkang Yul",
    "heimish",
    "SOME BY MI",
    "Anua",
    "rom&nd",
    "TOCOBO",
    "Round Lab",
    "SKIN1004"
  ],
  "2024": [
    "Beauty of Joseon",
    "Anua",
    "COSRX",
    "Round Lab",
    "TOCOBO",
    "TIRTIR",
    "SKIN1004",
    "Pyunkang Yul",
    "heimish",
    "numbuzin"
  ],
  "2025": [
    "Beauty of Joseon",
    "medicube",
    "Anua",
    "Dr.Althea",
    "Biodance",
    "SKIN1004",
    "Round Lab",
    "TOCOBO",
    "COSRX",
    "d'Alba"
  ],
  "1Q2026": [
    "medicube",
    "Beauty of Joseon",
    "Dr.Althea",
    "Biodance",
    "Anua",
    "celimax",
    "Round Lab",
    "COSRX",
    "TOCOBO",
    "SKIN1004"
  ],
  "2Q2026": [
    "medicube",
    "Beauty of Joseon",
    "Dr.Althea",
    "Biodance",
    "Anua",
    "COSRX",
    "Round Lab",
    "SKIN1004",
    "celimax",
    "TOCOBO"
  ]
};

const SILICON2_MOVE_GLYPHS = {
  up: { glyph: "▲", cls: "kb-move-up" },
  down: { glyph: "▼", cls: "kb-move-down" },
  flat: { glyph: "–", cls: "kb-move-flat" },
  new: { glyph: "NEW", cls: "kb-move-new" },
  reentry: { glyph: "RE", cls: "kb-move-new" },
};

const SILICON2_EXPRESSION_LABELS = {
  direct: { label: "DIRECT", cls: "kb-expr-direct" },
  diluted: { label: "DILUTED", cls: "kb-expr-diluted" },
  none_private: { label: "PRIVATE", cls: "kb-expr-private" },
  ipo_pending: { label: "IPO", cls: "kb-expr-ipo" },
  unresolved: { label: "?", cls: "kb-expr-unresolved" },
};

// Read-through map: 44 companies, which brands they own/manufacture/
// distribute, and (for private brand-owners) their equity-stake
// read-through into listed names — this is the actual value of the tab,
// letting Jun trace an Amazon-ranking K-beauty brand back to a tradeable
// Korean ticker.
const SILICON2_COMPANIES = [
  {
    "id": "apr",
    "nameKo": "주식회사 에이피알",
    "nameEn": "APR Corp",
    "ticker": "278470.KS",
    "listed": true,
    "tier": "brand_owner",
    "tier1": true,
    "confidence": "verified",
    "revenueNote": "KOSPI since IPO 2024-02-27; never KOSDAQ. medicube is an in-house brand line — no separate entity, no stake, no consolidation date. 5:1 split effective 2024, so pre-Q4-2024 per-share figures are on a 5x basis. Corporate site apr-in.com — aprbeauty.com is an UNRELATED Toronto firm.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "medicube",
        "brandKo": "메디큐브",
        "aliases": [
          "medicube AGE-R",
          "AGE-R",
          "에이지알"
        ],
        "confidence": "verified"
      },
      {
        "brand": "APRILSKIN",
        "brandKo": "에이프릴스킨",
        "confidence": "verified"
      },
      {
        "brand": "forment",
        "brandKo": "포멘트",
        "confidence": "verified"
      },
      {
        "brand": "glam.D",
        "brandKo": "글램디",
        "confidence": "verified"
      },
      {
        "brand": "NERDY",
        "brandKo": "널디",
        "confidence": "verified"
      },
      {
        "brand": "Photogray",
        "brandKo": "포토그레이",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "dalba-global",
    "nameKo": "주식회사 달바글로벌",
    "nameEn": "d'Alba Global",
    "ticker": "483650.KS",
    "listed": true,
    "tier": "brand_owner",
    "tier1": true,
    "confidence": "verified",
    "source": "https://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?gicode=A483650",
    "revenueNote": "KOSPI listed 2025-05-22. FY2024 revenue ₩309.1bn, OP ₩59.8bn; overseas 45% of sales. Renamed from 비모뉴먼트 B Monument 2024-07-17 — screen on 483650, not the name. Founder stake drifting ~39.2% → ~28.9% (Apr 2026) on tax sales: an overhang story, not a change of control.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "d'Alba",
        "brandKo": "달바",
        "aliases": [
          "dalba",
          "d'alba Piedmont"
        ],
        "confidence": "verified"
      },
      {
        "brand": "d'Alba Signature",
        "confidence": "likely"
      },
      {
        "brand": "Veganery",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "amorepacific",
    "nameKo": "주식회사 아모레퍼시픽",
    "nameEn": "Amorepacific Corp",
    "ticker": "090430.KS",
    "listed": true,
    "tier": "brand_owner",
    "tier1": true,
    "confidence": "verified",
    "revenueNote": "The OPCO (KOSPI 2006-06-29). Innisfree / Etude / espoir / Amos / Osulloc are NOT here — they sit directly under Holdings 002790.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Laneige",
        "brandKo": "라네즈",
        "confidence": "verified",
        "note": "Cosmetics division"
      },
      {
        "brand": "Illiyoon",
        "brandKo": "일리윤",
        "confidence": "verified",
        "note": "Daily Beauty division — different margin structure from Cosmetics"
      },
      {
        "brand": "Sulwhasoo",
        "brandKo": "설화수",
        "confidence": "verified"
      },
      {
        "brand": "Hera",
        "brandKo": "헤라",
        "confidence": "verified"
      },
      {
        "brand": "IOPE",
        "brandKo": "아이오페",
        "confidence": "verified"
      },
      {
        "brand": "Mamonde",
        "brandKo": "마몽드",
        "confidence": "verified"
      },
      {
        "brand": "AESTURA",
        "brandKo": "에스트라",
        "confidence": "verified"
      },
      {
        "brand": "Primera",
        "brandKo": "프리메라",
        "confidence": "likely"
      },
      {
        "brand": "Hanyul",
        "brandKo": "한율",
        "confidence": "likely"
      },
      {
        "brand": "LABO-H",
        "brandKo": "라보에이치",
        "confidence": "likely"
      },
      {
        "brand": "Ryo",
        "brandKo": "려",
        "confidence": "verified"
      },
      {
        "brand": "Mise-en-scène",
        "brandKo": "미쟝센",
        "confidence": "verified"
      },
      {
        "brand": "Happy Bath",
        "brandKo": "해피바스",
        "confidence": "verified"
      },
      {
        "brand": "Tata Harper",
        "confidence": "likely",
        "note": "US acquisition, 100%"
      },
      {
        "brand": "COSRX",
        "brandKo": "코스알엑스",
        "stakePct": 90.2,
        "consolidated": true,
        "from": "2024-05-01",
        "confidence": "verified",
        "note": "90.2% audited at 2024-12-31 (39.4% → 90.2%; control 2024-04-30). Do NOT use the press 93.2% — that is gross SPA basis. FY2024 is an 8-MONTH STUB (rev ₩389.4bn) vs COSRX full-year ₩589.8bn, so any YoY spanning Q2 2024 is inorganic. A ₩147.1bn payment obligation on 9.46% was deferred to 2030-04-30. Post-2024 stake unverified."
      }
    ]
  },
  {
    "id": "amorepacific-holdings",
    "nameKo": "주식회사 아모레퍼시픽홀딩스",
    "nameEn": "Amorepacific Holdings",
    "ticker": "002790.KS",
    "listed": true,
    "tier": "conglomerate",
    "confidence": "verified",
    "revenueNote": "Renamed from 아모레퍼시픽그룹 in 2025; ticker unchanged — key on the number. Holds 38.1% of 090430 but CONSOLIDATES it, so 100% of opco (and COSRX) revenue appears in its top line; the ~38% applies only to net income attributable to owners. Also owns the five subs below outright.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Innisfree",
        "brandKo": "이니스프리",
        "stakePct": 90.4,
        "consolidated": true,
        "confidence": "verified"
      },
      {
        "brand": "Etude",
        "brandKo": "에뛰드",
        "stakePct": 100,
        "consolidated": true,
        "confidence": "verified"
      },
      {
        "brand": "espoir",
        "brandKo": "에스쁘아",
        "stakePct": 100,
        "consolidated": true,
        "confidence": "verified"
      },
      {
        "brand": "Amos Professional",
        "brandKo": "아모스프로페셔널",
        "stakePct": 100,
        "consolidated": true,
        "confidence": "verified"
      },
      {
        "brand": "Osulloc",
        "brandKo": "오설록",
        "stakePct": 100,
        "consolidated": true,
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "lg-hnh",
    "nameKo": "주식회사 엘지생활건강",
    "nameEn": "LG H&H",
    "ticker": "051900.KS",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Three divisions (Beauty / HDB / Refreshment) — cosmetics is only part of the P&L",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "The History of Whoo",
        "brandKo": "후",
        "confidence": "verified"
      },
      {
        "brand": "Su:m37",
        "brandKo": "숨37",
        "confidence": "verified"
      },
      {
        "brand": "O HUI",
        "brandKo": "오휘",
        "confidence": "verified"
      },
      {
        "brand": "belif",
        "brandKo": "빌리프",
        "confidence": "verified"
      },
      {
        "brand": "CNP",
        "brandKo": "CNP차앤박",
        "confidence": "verified"
      },
      {
        "brand": "VDL",
        "confidence": "verified"
      },
      {
        "brand": "The Face Shop",
        "brandKo": "더페이스샵",
        "confidence": "verified"
      },
      {
        "brand": "Beyond",
        "brandKo": "비욘드",
        "confidence": "likely"
      },
      {
        "brand": "Isa Knox",
        "brandKo": "이자녹스",
        "confidence": "likely"
      },
      {
        "brand": "CARE ZONE",
        "brandKo": "케어존",
        "confidence": "likely"
      },
      {
        "brand": "hince",
        "brandKo": "힌스",
        "stakePct": 75,
        "consolidated": true,
        "confidence": "verified",
        "note": "via 비바웨이브 Viva Wave"
      },
      {
        "brand": "The Creme Shop",
        "stakePct": 100,
        "consolidated": true,
        "from": "2025-01-01",
        "confidence": "verified",
        "note": "65% → 100% in 2025"
      },
      {
        "brand": "Dr.Groot",
        "brandKo": "닥터그루트",
        "confidence": "verified",
        "note": "HDB division"
      },
      {
        "brand": "Physiogel",
        "brandKo": "피지오겔",
        "confidence": "likely",
        "note": "Asia + North America rights only"
      }
    ]
  },
  {
    "id": "clio",
    "nameKo": "주식회사 클리오",
    "nameEn": "CLIO Cosmetics",
    "ticker": "237880.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "CLIO",
        "brandKo": "클리오",
        "confidence": "verified"
      },
      {
        "brand": "peripera",
        "brandKo": "페리페라",
        "confidence": "verified"
      },
      {
        "brand": "goodal",
        "brandKo": "구달",
        "confidence": "verified",
        "note": "NOT related to GOODAI GLOBAL — different company"
      },
      {
        "brand": "Dermatory",
        "brandKo": "더마토리",
        "confidence": "verified"
      },
      {
        "brand": "Twinkle Pop",
        "confidence": "likely"
      },
      {
        "brand": "healing bird",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "shinsegae-intl",
    "nameKo": "주식회사 신세계인터내셔날",
    "nameEn": "Shinsegae International",
    "ticker": "031430.KS",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "AMUSE",
        "brandKo": "어뮤즈",
        "stakePct": 100,
        "consolidated": true,
        "from": "2022-08-02",
        "confidence": "verified",
        "note": "₩71.3bn; prior owner Snow Corp (NAVER)"
      }
    ]
  },
  {
    "id": "manyo",
    "nameKo": "주식회사 마녀공장",
    "nameEn": "Manyo Factory",
    "ticker": "439090.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Listco 51.87% owned by 케이뷰티홀딩스 (KL&Partners PEF), closed 2025-04-30",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "ma:nyo",
        "brandKo": "마녀공장",
        "aliases": [
          "manyo",
          "manyo factory"
        ],
        "confidence": "verified"
      },
      {
        "brand": "Our Vegan",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "able-cnc",
    "nameKo": "주식회사 에이블씨엔씨",
    "nameEn": "Able C&C",
    "ticker": "078520.KS",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "likely",
    "revenueNote": "KOSDAQ 2005 → KOSPI 2011. IMM PE control.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "MISSHA",
        "brandKo": "미샤",
        "confidence": "verified"
      },
      {
        "brand": "A'PIEU",
        "brandKo": "어퓨",
        "confidence": "verified"
      },
      {
        "brand": "MERZY",
        "brandKo": "머지",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "vt",
    "nameKo": "주식회사 브이티",
    "nameEn": "VT Co.",
    "ticker": "018290.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "likely",
    "revenueNote": "Diversified — also GMP laminating and a residual Cube Ent. stake; cosmetics is one segment",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "VT Cosmetics",
        "brandKo": "브이티",
        "aliases": [
          "VT",
          "Reedle Shot",
          "리들샷"
        ],
        "consolidated": true,
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "ifamily-sc",
    "nameKo": "주식회사 아이패밀리에스씨",
    "nameEn": "iFamily SC",
    "ticker": "114840.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "rom&nd",
        "brandKo": "롬앤",
        "aliases": [
          "romand"
        ],
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "tonymoly",
    "nameKo": "주식회사 토니모리",
    "nameEn": "TONYMOLY",
    "ticker": "214420.KS",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "likely",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "TONYMOLY",
        "brandKo": "토니모리",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "hugel",
    "nameKo": "휴젤 주식회사",
    "nameEn": "Hugel",
    "ticker": "145020.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Wellage",
        "brandKo": "웰라쥬",
        "confidence": "verified",
        "note": "In-house; not Humedix"
      }
    ]
  },
  {
    "id": "seoulligare",
    "nameKo": "주식회사 서울리거",
    "nameEn": "Seoulligare",
    "ticker": "043710.KQ",
    "listed": true,
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "beplain",
        "brandKo": "비플레인",
        "stakePct": 86,
        "consolidated": true,
        "from": "2025-12-26",
        "confidence": "verified",
        "note": "via 모먼츠컴퍼니, ₩81.2bn"
      }
    ]
  },
  {
    "id": "goodai-global",
    "nameKo": "주식회사 구다이글로벌",
    "nameEn": "GOODAI GLOBAL INC.",
    "listed": false,
    "ipoStatus": "IPO preparing — preliminary review not yet filed",
    "tier": "brand_owner",
    "tier1": true,
    "confidence": "verified",
    "source": "https://goodai-global.com/en/company/intro",
    "revenueNote": "English legal name is GOODAI — 'Gudai' fails entity matching. KOSPI filing expected ~Q3 2026, listing early 2027 (slipped ~6 months on Craver's competing Japan listing plan). FY2025 consolidated revenue ₩1.4717tn vs ₩373bn — overwhelmingly M&A consolidation, NOT organic.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Beauty of Joseon",
        "brandKo": "조선미녀",
        "aliases": [
          "beautyofjoseon"
        ],
        "confidence": "verified"
      },
      {
        "brand": "TIRTIR",
        "brandKo": "티르티르",
        "stakePct": 75,
        "consolidated": true,
        "from": "2025-03-01",
        "confidence": "uncertain",
        "note": "TWO transactions: Apr 2024 bought 49.98% held as a JOINTLY-CONTROLLED entity (equity method) — ZERO TIRTIR revenue in Goodai FY2024. Mar 2025 remaining stake → consolidation begins here. Final stake genuinely conflicts across sources (75% vs 100%)."
      },
      {
        "brand": "Round Lab",
        "brandKo": "라운드랩",
        "confidence": "verified",
        "note": "via 서린컴퍼니 Seorin 100%; Dokdo Toner"
      },
      {
        "brand": "Skinfood",
        "brandKo": "스킨푸드",
        "stakePct": 99.95,
        "consolidated": true,
        "confidence": "likely"
      }
    ],
    "readThrough": [
      {
        "companyId": "kolmar-korea",
        "relation": "odm",
        "confidence": "verified",
        "disclosed": true
      },
      {
        "companyId": "cosmecca",
        "relation": "odm",
        "confidence": "uncertain",
        "disclosed": false
      }
    ]
  },
  {
    "id": "craver",
    "nameKo": "주식회사 크레이버코퍼레이션",
    "nameEn": "Craver Corporation",
    "listed": false,
    "ipoStatus": "own Japan listing plan reported 2026-04",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Chain: Goodai → 티엠뷰티 TM Beauty (SPC) → Craver → SKIN1004. 85% closed 2024-12-28 for ₩245.6bn (NOT '2.456tn' — a 10x mistranslation circulates). TM Beauty's Craver stake rose 85.37% → 97.29%. But Goodai holds only 53.21% of TM Beauty (end-2025), so its LOOK-THROUGH interest is ~51.8%, not 85%. Craver consolidates into Goodai, so 100% of revenue flows up while ~half the profit is minority interest. 주식회사 스킨천사 was absorb-merged into Craver 2025-03-31 and no longer exists.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "SKIN1004",
        "aliases": [
          "skin1004"
        ],
        "confidence": "verified"
      },
      {
        "brand": "ZOMBIE BEAUTY",
        "confidence": "likely"
      },
      {
        "brand": "COMMONLABS",
        "confidence": "likely"
      }
    ],
    "readThrough": [
      {
        "companyId": "cosmecca",
        "relation": "odm",
        "confidence": "uncertain",
        "disclosed": false
      }
    ]
  },
  {
    "id": "the-founders",
    "nameKo": "주식회사 더파운더즈",
    "nameEn": "The Founders Inc.",
    "listed": false,
    "ipoStatus": "no known plan — explicitly declined Aug 2025",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "~100% held by co-CEOs 이선형/이창주. FY2025 revenue ₩717.7bn, OP ₩129.5bn (+68%), ~90% overseas. TRAP: in Aug 2025 The Founders BOUGHT ~1% of HK-listed YesAsia — that is Anua's owner investing OUT, not Anua becoming listed. The '₩1tn milestone' press is run-rate/GMV, not reported revenue.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Anua",
        "brandKo": "아누아",
        "confidence": "verified"
      },
      {
        "brand": "FROM LABS",
        "confidence": "likely"
      }
    ],
    "readThrough": [
      {
        "companyId": "cosmax",
        "relation": "odm",
        "confidence": "likely",
        "disclosed": true
      }
    ]
  },
  {
    "id": "benow",
    "nameKo": "주식회사 비나우",
    "nameEn": "BENOW",
    "listed": false,
    "ipoStatus": "IPO preparing — Samsung Securities lead, filing targeted 2H2026",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "FY2025 revenue ₩325bn+; ~₩1tn valuation talk",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "numbuzin",
        "brandKo": "넘버즈인",
        "confidence": "verified"
      },
      {
        "brand": "fwee",
        "brandKo": "퓌",
        "confidence": "likely"
      }
    ],
    "readThrough": [
      {
        "companyId": "cosmax",
        "relation": "odm",
        "confidence": "verified",
        "disclosed": true
      }
    ]
  },
  {
    "id": "beauty-selection",
    "nameKo": "주식회사 뷰티셀렉션",
    "nameEn": "Beauty Selection",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "likely",
    "revenueNote": "FY2024 revenue ₩135.7bn (+226.5%)",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Biodance",
        "brandKo": "바이오던스",
        "aliases": [
          "BIODANCE"
        ],
        "confidence": "likely"
      }
    ],
    "readThrough": [
      {
        "companyId": "genic",
        "relation": "odm",
        "confidence": "likely",
        "disclosed": true
      }
    ]
  },
  {
    "id": "torriden",
    "nameKo": "주식회사 토리든",
    "nameEn": "Torriden",
    "listed": false,
    "ipoStatus": "no plan — LG H&H sale talks COLLAPSED Jan 2026; open to sale, ~₩1tn talk",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "FY2025 revenue ₩274.3bn, OP ₩60.4bn. Founders 45%/25%, no financial investor.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "TORRIDEN",
        "brandKo": "토리든",
        "aliases": [
          "Dive-In"
        ],
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "parket",
    "nameKo": "주식회사 파켓",
    "nameEn": "Parket",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Echo Marketing holds ~23.4–24% on an EQUITY-METHOD basis — not consolidated",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "mixsoon",
        "brandKo": "믹순",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "ferenbell",
    "nameKo": "주식회사 페렌벨",
    "nameEn": "FERENBELL",
    "listed": false,
    "ipoStatus": "100% JKL Partners; sale process running ~1yr, no preferred bidder as of Jul 2026",
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "SOME BY MI",
        "brandKo": "썸바이미",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "isntree",
    "nameKo": "주식회사 이즈앤트리",
    "nameEn": "ISNTREE",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Isntree",
        "brandKo": "이즈앤트리",
        "confidence": "verified",
        "note": "Korean is 이즈앤트리, not 이즌트리"
      }
    ]
  },
  {
    "id": "leegeeham",
    "nameKo": "이지함화장품",
    "nameEn": "Leegeehaam (LJH)",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Dr.Ceuracle",
        "brandKo": "닥터슈라클",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "dfs-company",
    "nameKo": "디에프에스컴퍼니",
    "nameEn": "DFS Company",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Haruharu Wonder",
        "brandKo": "하루하루원더",
        "aliases": [
          "Haruharu"
        ],
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "four-company",
    "nameKo": "주식회사 포컴퍼니",
    "nameEn": "Four Company",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "uncertain",
    "revenueNote": "Entity name contested vs 나로부터 Narobuteo — probably a rename, direction unknown",
    "reviewBy": "2026-09-30",
    "brands": [
      {
        "brand": "Abib",
        "brandKo": "아비브",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "hi-nature",
    "nameKo": "하이네이처",
    "nameEn": "Hi Nature",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "uncertain",
    "revenueNote": "Parent link is address-match corroboration only — not filing-verified",
    "reviewBy": "2026-09-30",
    "brands": [
      {
        "brand": "Purito",
        "brandKo": "퓨리토",
        "aliases": [
          "Purito Seoul"
        ],
        "confidence": "uncertain"
      }
    ]
  },
  {
    "id": "asiamastertrade",
    "nameKo": "아시아마스터트레이드",
    "nameEn": "AsiaMasterTrade",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "likely",
    "reviewBy": "2026-09-30",
    "brands": [
      {
        "brand": "AXIS-Y",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "lab-and-company",
    "nameKo": "랩앤컴퍼니",
    "nameEn": "Lab & Company",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "uncertain",
    "revenueNote": "Single-source parent link",
    "reviewBy": "2026-09-30",
    "brands": [
      {
        "brand": "I'm From",
        "brandKo": "아임프롬",
        "confidence": "uncertain"
      }
    ]
  },
  {
    "id": "gp-club",
    "nameKo": "지피클럽",
    "nameEn": "GP Club",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "likely",
    "revenueNote": "Also owns 36.78% of listed KODI (080530) — an ownership link, not a manufacturing one",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "JM Solution",
        "brandKo": "제이엠솔루션",
        "confidence": "likely"
      }
    ]
  },
  {
    "id": "cosmax",
    "nameKo": "주식회사 코스맥스",
    "nameEn": "Cosmax",
    "ticker": "192820.KS",
    "listed": true,
    "tier": "odm_oem",
    "confidence": "verified",
    "revenueNote": "Global #1 cosmetics ODM and the ONLY listed ODM that publishes its customer list. Q4'25 IR deck names 아누아 Anua, 메디큐브 medicube, 비나우 Benow(numbuzin), 정샘물, 쏘내추럴. ODM links are non-exclusive and capture manufacturing margin only.",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "kolmar-korea",
    "nameKo": "한국콜마 주식회사",
    "nameEn": "Kolmar Korea",
    "ticker": "161890.KS",
    "listed": true,
    "tier": "odm_oem",
    "confidence": "verified",
    "revenueNote": "The OPCO. Company-announced joint 100m-unit milestone with Goodai on Beauty of Joseon Relief Sun. Owns Yonwoo 100% (packaging; ex-KOSDAQ 115960, DELISTED Feb 2024 — no live ticker) and 43.0% of HK inno.N. Kolmar Holdings (024720) reaches these only through its 26.31% of 161890.",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "cosmecca",
    "nameKo": "주식회사 코스메카코리아",
    "nameEn": "Cosmecca Korea",
    "ticker": "241710.KQ",
    "listed": true,
    "tier": "odm_oem",
    "confidence": "verified",
    "revenueNote": "FY2025 revenue ₩640.9bn (+22.2%), OP ₩83.5bn — 13.0% OPM, best of the listed ODMs; Korea entity Q4'25 +53.8% YoY. Owns Englewood Lab 66.67%. Customer links (Beauty of Joseon, SKIN1004) are PRESS-ASSERTED only — its IR customer logos are unextractable images.",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "genic",
    "nameKo": "주식회사 제닉",
    "nameEn": "Genic",
    "ticker": "123330.KQ",
    "listed": true,
    "tier": "odm_oem",
    "confidence": "verified",
    "revenueNote": "Holds a DISCLOSED ODM manufacturing-and-supply contract for Biodance's Bio-Collagen mask, with capacity expanded twice. But do NOT present it as sole supplier — 엔코스 Encos and 아이큐어 iCure are also named in other sources, and multi-sourcing is plausible for an Amazon top-10 SKU.",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "cnc-intl",
    "nameKo": "주식회사 씨앤씨인터내셔널",
    "nameEn": "C&C International",
    "ticker": "352480.KQ",
    "listed": true,
    "tier": "odm_oem",
    "confidence": "verified",
    "revenueNote": "Colour-cosmetics ODM. Beauty Synergy (Ascent EP) is the 41.22% largest shareholder since 2025. Customer links (rom&nd, 3CE, CLIO, AMUSE) are press-only.",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "silicon2",
    "nameKo": "주식회사 실리콘투",
    "nameEn": "Silicon2",
    "ticker": "257720.KQ",
    "listed": true,
    "tier": "distributor",
    "confidence": "verified",
    "revenueNote": "Operates StyleKorean. NOT an Amazon read-through — it EXITED Amazon's low-margin fulfilment business and Amazon contribution is ~zero. Also not primarily a US story: Q3'25 mix was Europe 34.0% > North America 24.3% > Asia 17.7%. Its US book is customer-concentrated (iHerb >half). Live risk: Goodai — its largest customer at 23.6% of Q3'25 revenue — bought Hansung USA (Feb 2026).",
    "reviewBy": "2026-10-31",
    "brands": []
  },
  {
    "id": "pyunkang",
    "nameKo": "주식회사 편강한방피부과학연구소",
    "nameEn": "Pyunkang Oriental Medical Skin Science Research Institute",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "FY2025 revenue ₩36.56bn (~flat YoY after ~+60% in FY2024), net income ₩2.68bn. Q1 2026 net income collapsed to ₩61.7m on ₩7.87bn revenue — sharp margin compression. Silicon2's purchases from it fell ~30% YoY to ₩9.57bn. LINEAGE TRAP: 편강한의원 (the clinic, director 서효석) is a SEPARATE organisation and is NOT the brand owner, despite the heritage marketing. There is also no legal entity called '(주)편강율' — 편강율 is a brand, not a company.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Pyunkang Yul",
        "brandKo": "편강율",
        "confidence": "verified"
      }
    ],
    "readThrough": [
      {
        "companyId": "silicon2",
        "relation": "equity_stake",
        "stakePct": 10,
        "consolidated": false,
        "confidence": "verified",
        "disclosed": true,
        "note": "Held since 2017-12-20, flat at 10.00% through Q1 2026. Cost ₩300m, carrying value ₩1.36bn — immaterial to Silicon2."
      }
    ]
  },
  {
    "id": "oneand",
    "nameKo": "주식회사 원앤드",
    "nameEn": "ONEAND CO., LTD.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "All Clean Balm is the hero SKU. Silicon2 is the only listed shareholder on its audited roster.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "heimish",
        "brandKo": "헤이미쉬",
        "confidence": "verified"
      }
    ],
    "readThrough": [
      {
        "companyId": "silicon2",
        "relation": "equity_stake",
        "stakePct": 24.1,
        "consolidated": false,
        "confidence": "verified",
        "disclosed": true,
        "note": "Held since 2016-03."
      }
    ]
  },
  {
    "id": "benton",
    "nameKo": "주식회사 벤튼",
    "nameEn": "Benton Inc.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Korean name is 벤튼 (not 벤톤).",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "BENTON",
        "brandKo": "벤튼",
        "confidence": "verified"
      }
    ],
    "readThrough": [
      {
        "companyId": "silicon2",
        "relation": "equity_stake",
        "stakePct": 25,
        "consolidated": false,
        "confidence": "verified",
        "disclosed": true,
        "note": "Held since 2016-11 — Silicon2's largest brand stake."
      }
    ]
  },
  {
    "id": "picton",
    "nameKo": "주식회사 픽톤",
    "nameEn": "PICTON CO., LTD.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "Founded May 2021. Silicon2 CUT its stake from 32.52% to 14.70% by board resolution 2025-10-17 (타법인출자 지분 매각) — a reduction, not an increase, in a brand that was climbing at the time.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "TOCOBO",
        "brandKo": "토코보",
        "confidence": "verified"
      }
    ],
    "readThrough": [
      {
        "companyId": "silicon2",
        "relation": "equity_stake",
        "stakePct": 14.7,
        "consolidated": false,
        "confidence": "verified",
        "disclosed": true,
        "note": "198,000 shares. Cut from 32.52% in Oct 2025 — Silicon2 sold down into the brand's rise."
      }
    ]
  },
  {
    "id": "getbeauty",
    "nameKo": "주식회사 겟뷰티",
    "nameEn": "GETBEAUTY Co., Ltd.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "No listed stakeholder established. Romanization is not standardised in filings.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "MIGUHARA",
        "brandKo": "미구하라",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "the-pure-lab",
    "nameKo": "주식회사 더퓨어랩",
    "nameEn": "The Pure Lab Co., Ltd.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "No listed stakeholder established — notably NOT in Silicon2's brand-equity table despite the brand's sharp 2025→1Q2026 rise to #3.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "Dr.Althea",
        "brandKo": "닥터엘시아",
        "aliases": [
          "Dr Althea"
        ],
        "confidence": "verified",
        "note": "Official Korean is 닥터엘시아 — '닥터알테아' is a naive transliteration that will miss on matching."
      }
    ]
  },
  {
    "id": "absolv-lab",
    "nameKo": "주식회사 앱솔브랩",
    "nameEn": "Absolv Lab Co., Ltd.",
    "listed": false,
    "ipoStatus": "no known plan",
    "tier": "brand_owner",
    "confidence": "verified",
    "revenueNote": "BRN 711-87-00381. Four romanizations in the wild (Absolv/Absorb/Absolve/AppSolve Lab) — one company. Explicitly NOT in Silicon2's brand-equity table.",
    "reviewBy": "2026-10-31",
    "brands": [
      {
        "brand": "celimax",
        "brandKo": "셀리맥스",
        "confidence": "verified"
      }
    ]
  },
  {
    "id": "unresolved-indie",
    "nameKo": "미확인",
    "nameEn": "Parent not established",
    "listed": false,
    "tier": "brand_owner",
    "confidence": "unresolved",
    "reviewBy": "2026-08-31",
    "revenueNote": "Brands with material shelf presence whose corporate parent is NOT established. Deliberately not guessed — these render as 'parent not verified' and are excluded from every company roll-up.",
    "brands": [
      {
        "brand": "B_LAB",
        "brandKo": "비랩",
        "confidence": "unresolved",
        "note": "≥5 candidate entities; 비랩코리아 is a B Corp certifier, not this"
      },
      {
        "brand": "LAKA",
        "brandKo": "라카",
        "confidence": "unresolved",
        "note": "Sold out of Goodai, completed Aug 2025; new owner not established"
      },
      {
        "brand": "Cell Fusion C",
        "brandKo": "셀퓨전씨",
        "confidence": "unresolved",
        "note": "CMS Lab link needs DART"
      },
      {
        "brand": "House of Hur",
        "confidence": "unresolved",
        "note": "In Goodai rosters but no stake, date or deal coverage"
      },
      {
        "brand": "Dr.Melaxin",
        "brandKo": "닥터멜락신",
        "confidence": "unresolved",
        "note": "Found charting live at US #77 (Collagen Multi Balm Stick) during QA — parent not yet established"
      },
      {
        "brand": "MEDITHERAPY",
        "brandKo": "메디테라피",
        "confidence": "unresolved",
        "note": "Charts in the US top 100 (Retinal Skin Booster). Note: its name contains the substring 'thera', which is exactly what produced a false 'Hera' match before word-boundary attribution — it is a REAL and distinct brand, not a parsing artefact."
      },
      {
        "brand": "NOONI",
        "brandKo": "누니",
        "confidence": "unresolved",
        "note": "Found charting live at US #79 (Korean Lip Oil) during QA — parent not yet established"
      }
    ]
  }
];
