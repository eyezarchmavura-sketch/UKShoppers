/* UK Shoppers Africa — i18n dictionary
   Languages: English (en), Swahili (sw), Kinyarwanda (rw), Luganda (lg).
   Brand: black ink + gold. Strings keyed by section. */

export type Lang = "en" | "sw" | "rw" | "lg";

export const LANGS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "sw", label: "Swahili", native: "Kiswahili", flag: "🇹🇿" },
  { code: "rw", label: "Kinyarwanda", native: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "lg", label: "Luganda", native: "Oluganda", flag: "🇺🇬" },
];

export const t: Record<string, Record<Lang, string>> = {
  /* ---------- Landing nav ---------- */
  "nav.howItWorks": {
    en: "How It Works",
    sw: "Inavyofanya Kazi",
    rw: "Uko Bikora",
    lg: "Bwe Bikola",
  },
  "nav.instantQuote": {
    en: "Instant Quote",
    sw: "Bei Papo kwa Papo",
    rw: "Igiciro Vuba",
    lg: "Emiwendo",
  },
  "nav.stores": {
    en: "Popular Stores",
    sw: "Maduka Maarufu",
    rw: "Amaduka Azwi",
    lg: "Edduuka Ebimanyiddwa",
  },
  "nav.login": {
    en: "Customer Login",
    sw: "Ingia",
    rw: "Injira",
    lg: "Yingira",
  },
  "nav.startShopping": {
    en: "Start Shopping",
    sw: "Anza Kununua",
    rw: "Tangira Kugura",
    lg: "Tandika Okugula",
  },
  "nav.staffAdmin": {
    en: "Staff Admin",
    sw: "Wafanyakazi",
    rw: "Abakozi",
    lg: "Abakozi",
  },

  /* ---------- Hero ---------- */
  "hero.badge": {
    en: "Direct UK Personal Shopping & Parcel Forwarding for Tanzania, Kenya, Uganda & Rwanda",
    sw: "Ununuzi wa Moja kwa Moja kutoka UK na Usafirishaji kwa Tanzania, Kenya, Uganda na Rwanda",
    rw: "Kugura muri UK no Kohereza muri Tanzaniya, Kenya, Uganda na Rwanda",
    lg: "Okugula mu UK n'Okusindika mu Tanzania, Kenya, Uganda ne Rwanda",
  },
  "hero.title1": {
    en: "Shop the UK.",
    sw: "Nunua kutoka UK.",
    rw: "Gura muri UK.",
    lg: "Gula mu UK.",
  },
  "hero.title2": {
    en: "Delivered to East Africa.",
    sw: "Inafika Afrika Mashariki.",
    rw: "Bigeze i Burasirazuba bwa Afurika.",
    lg: "Bibituukira mu East Africa.",
  },
  "hero.body": {
    en: "Get your favorite items from Amazon UK, ASOS, Zara, and top British stores. Paste any product link, upload a cart screenshot, or use your free UK address. We handle purchase, consolidation, and express air freight with customs cleared.",
    sw: "Pata bidhaa zako uzipendazo kutoka Amazon UK, ASOS, Zara na maduka bora ya Uingereza. Bandika kiungo cha bidhaa, pakia picha ya kikapu chako, au tumia anwani yako ya UK ya bure. Sisi tunashughulikia ununuzi, kuunganisha vifurushi, na usafirishaji wa ndege wa haraka huku forodha zimefutwa.",
    rw: "Kuramo ibicuruzwa byawe byiza kuri Amazon UK, ASOS, Zara n'amaduka akomeye yo mu Bwongereza. Kopa uruhererekane rw'igicuruzwa, ohereza ifoto y'urugendo rwawe, cyangwa ukoreshe adresse yawe ya UK. Turi gukurikirana kugura, guhuza ibipaki, no kohereza ku kirere vuba n'imisoro yakozwe.",
    lg: "Funa ebintu byo by'oyagala okuva mu Amazon UK, ASOS, Zara ne dukka eyenene ey'e Britain. Ssa link y'ekintu, teeka picha y'ekibinja ky'ogula, oba kozesa endagaano yo eya UK eya bwereere. Ffe tulaba okugula, okupakira wamu, ne okusindika n'ennyonyi n'omusolo gw'amafuta gugobeddwa.",
  },
  "hero.ctaLink": {
    en: "Paste Link or Upload Cart",
    sw: "Bandika Kiungo au Pakia Kikapu",
    rw: "Kopa Link cyangwa Ohereza Ifoto",
    lg: "Ssa Link oba Teeka Picha",
  },
  "hero.ctaPortal": {
    en: "Open Customer Portal",
    sw: "Fungua Portal ya Wateja",
    rw: "Fungura Portal y'Abakiriya",
    lg: "Gulawo Portal y'Abakaziyana",
  },
  "hero.fast": {
    en: "Fast Air Transit",
    sw: "Usafiri wa Haraka wa Ndege",
    rw: "Kohereza ku Kirere Vuba",
    lg: "Okusindika Kwangu",
  },
  "hero.duties": {
    en: "Duties Prepaid",
    sw: "Kodi Zimehakiwa",
    rw: "Imisoro Yishyuwe",
    lg: "Omusolo Gugobeddwa",
  },
  "hero.whatsapp": {
    en: "WhatsApp & Portal Updates",
    sw: "Masasisho ya WhatsApp na Portal",
    rw: "Ubutumwa bwa WhatsApp na Portal",
    lg: "Amabuuza ga WhatsApp ne Portal",
  },

  /* ---------- Calculator ---------- */
  "calc.title": {
    en: "Estimate Your Order",
    sw: "Kadiria Agizo Lako",
    rw: "Gereranya Icyo Ugiye Kugura",
    lg: "Ggereranya Ekiguzi Kyo",
  },
  "calc.subtitle": {
    en: "Select your East African destination and item details for instant pricing.",
    sw: "Chagua nchi yako na maelezo ya bidhaa kwa bei ya papo kwa papo.",
    rw: "Hitamo aho ukomoka mu Burasirazuba bw'Afurika n'ibisobanuro by'igicuruzwa.",
    lg: "Londa ekifo kyo mu East Africa n'ebimu ku kintu okumanya emiwendo.",
  },
  "calc.destination": {
    en: "Destination Country",
    sw: "Nchi ya Mwisho",
    rw: "Igihugu Ugiyemo",
    lg: "Ggwanga Gyo",
  },
  "calc.link": {
    en: "Paste UK Product Link (Optional)",
    sw: "Bandika Kiungo cha Bidhaa ya UK (Hiari)",
    rw: "Kopa Link y'Igicuruzwa cya UK (Bidafite akamaro)",
    lg: "Ssa Link y'Ekintu ekya UK (Bwe waba oyagala)",
  },
  "calc.price": {
    en: "Item Price (£ GBP)",
    sw: "Bei ya Bidhaa (£ GBP)",
    rw: "Igiciro cy'Igicuruzwa (£ GBP)",
    lg: "Emiwendo gy'Ekintu (£ GBP)",
  },
  "calc.weight": {
    en: "Approx. Weight (kg)",
    sw: "Uzito wa Makadirio (kg)",
    rw: "Uburemere (kg)",
    lg: "Obuzito (kg)",
  },
  "calc.shipping": {
    en: "Estimated UK Shipping",
    sw: "Usafirishaji UK Uliokadiriwa",
    rw: "Kohereza muri UK",
    lg: "Okusindika mu UK",
  },
  "calc.fee": {
    en: "Service & Inspection Fee",
    sw: "Ada ya Huduma na Uchunguzi",
    rw: "Serivisi no Kureba",
    lg: "Ekisenge ky'Obuweereza n'Okukebera",
  },
  "calc.total": {
    en: "Total Est. Cost",
    sw: "Jumla ya Makadirio",
    rw: "Igiciro Cyose",
    lg: "Ekiguzi Kyonna",
  },
  "calc.proceed": {
    en: "Proceed with Order",
    sw: "Endelea na Agizo",
    rw: "Komeza Gura",
    lg: "Ddamu Okugula",
  },

  "sec.howBadge": { en: "Seamless Process", sw: "Mchakato Rahisi", rw: "Urugendo Rworoshye", lg: "Entambula Ennungi" },
  "sec.insured": { en: "Fully Insured & Tracked", sw: "Imebima na Kufuatiliwa Kabisa", rw: "Birinzwe kandi Birakurikiranwa", lg: "Birindiddwa ne Bukebwe Byonna" },
  "steps.link": { en: "Paste Link or Upload Cart", sw: "Bandika Kiungo au Pakia Kikapu", rw: "Kopa Link cyangwa Ohereza Ifoto", lg: "Ssa Link oba Teeka Picha" },
  "steps.consolidate": { en: "We Buy, Inspect & Consolidate", sw: "Tununuzia, Tukagundua na Kuunganisha", rw: "Turikagura, Turireba tugahuza", lg: "Ffe Tuligula, Tulikebera ne Tubipakira Wamu" },
  "steps.delivery": { en: "Express Delivery to Your Door", sw: "Uwasilishaji wa Haraka Mlangoni", rw: "Kugeza Vuba Imbere y'Inyubako", lg: "Okugeza Kwangu ku Nnyumba" },
  "sec.consolidation": { en: "Consolidation & Volumetric Savings", sw: "Kuunganisha na Okoa Usafirishaji", rw: "Guhuza no Kurokoka ibyo Kohereza", lg: "Okupakira Wamu n'Okuwonyezebwa" },
  "sec.consolidationBody": { en: "Combine parcels from 5 different UK stores into one shipment and save up to 25% on shipping.", sw: "Unganisha vifurushi kutoka maduka 5 tofauti ya UK katika usafirishaji mmoja na uoke hadi 25%.", rw: "Huza ibipaki bituruka mu maduka 5 atandukanye ya UK mu kohereza kamwe wome kugeze 25%.", lg: "Yunga ebibinja okuva mu maduka 5 amangi ga mu UK mu kusindika kumwe obone okukwatibwa 25%.", },
  "sec.mobileMoney": { en: "Local Currency & Mobile Money", sw: "Sarafu ya Ndani na Pesapoi ya Simu", rw: "Amafaranga y'Ihugu n'Amafaranga ya Telefone", lg: "Ensimali y'Eggwanga n'Ensimali y'Essimu" },
  "sec.mobileMoneyBody": { en: "Pay conveniently using M-Pesa, Tigo Pesa, Airtel Money, bank transfer, or debit/credit cards.", sw: "Lipa kwa urahisi ukitumia M-Pesa, Tigo Pesa, Airtel Money, uhamisho wa benki, au kadi.", rw: "Wishyura neza ukoresheje M-Pesa, Tigo Pesa, Airtel Money, konti y'ibanki, cyangwa amakarito.", lg: "Sasula mu bugwagwa okozesa M-Pesa, Tigo Pesa, Airtel Money, okusindika banki, oba amakarooti.", },
  "sec.accessDashboard": { en: "Access Client Dashboard", sw: "Fungua Dashibodi ya Wateja", rw: "Fungura Dashboard y'Abakiriya", lg: "Gulawo Dashboard y'Abakaziyana" },
  "sec.teamAdmin": { en: "Team Operations Admin", sw: "Utawala wa Timu", rw: "Ubuyobozi bw'Ikipe", lg: "Ebikwatibwako eby'Abakozi" },
  "foot.home": { en: "Home", sw: "Nyumbani", rw: "Ahabanza", lg: "Ewaka" },
  "foot.dashboard": { en: "Customer Dashboard", sw: "Dashibodi ya Wateja", rw: "Dashboard y'Abakiriya", lg: "Dashboard y'Abakaziyana" },
  "foot.quote": { en: "Instant Quote & Link", sw: "Bei Papo na Kiungo", rw: "Igiciro Vuba na Link", lg: "Emiwendo ne Link" },
  "foot.admin": { en: "Operations Staff Admin", sw: "Utawala wa Timu", rw: "Ubuyobozi bw'Abakozi", lg: "Ebikwatibwako eby'Abakozi" },

  /* ---------- Section headers ---------- */
  "sec.categories": {
    en: "Everything You Love, One Link Away",
    sw: "Kila Unachopenda, Kiungo Kimoja Ukiacha",
    rw: "Ibyo Ukuza Byose, Link Imwe Ivuyeho",
    lg: "Ebintu Byonna By'oyagala, Link Emu",
  },
  "sec.storesTitle": {
    en: "Shop From Any UK Retailer",
    sw: "Nunua kutoka Duka Lolote la UK",
    rw: "Gura mu Duka Dukurarimo Dwayose wa UK",
    lg: "Gula mu Dduka Lyonna erya mu UK",
  },
  "sec.storesSub": {
    en: "Pick any British store from our wall of 24 supported retailers — or paste a link from another one. We buy it and forward it to East Africa.",
    sw: "Chagua duka lolote la Uingereza kutoka kuta yetu ya maduka 24 yanayofanyiwa kazi — au bandika kiungo kutoka duka lingine. Sisi tunakinunua na kukisafirisha Afrika Mashariki.",
    rw: "Hitamo iduka iryo ari ryo ryose ry'Ubwongereza mu maduka 24 tushyigikiye — cyangwa ukoire link y'irindi duka. Turikagura tukaryohereza i Burasirazuba bw'Afurika.",
    lg: "Londa dduka lyonna erya Britain mu maduka 24 ge tukolera — oba ss link ey'edduka eddala. Ffe tuligula tulitwere mu East Africa.",
  },
  "sec.howTitle": {
    en: "How UK Shoppers Africa Works",
    sw: "Jinsi UK Shoppers Africa Inavyofanya Kazi",
    rw: "Uko UK Shoppers Africa Ikora",
    lg: "UK Shoppers Africa Bwe Ekola",
  },
  "sec.howSub": {
    en: "Designed for East African shoppers. No UK bank account, no visa card required — just paste a link and relax.",
    sw: "Imetengenezwa kwa wateja wa Afrika Mashariki. Hakuna akaunti ya benki ya UK inayohitajika, hakuna kadi ya visa — bandika kiungo tu na pumzika.",
    rw: "Yateguwe ku bakiriya b'i Burasirazuba bw'Afurika. Nta konti y'ibanki ya UK ikenewe — gusa kopa link uhite uremera.",
    lg: "Etegekeddwa ku bakaziyana ab'omu East Africa. Wetaagisa account ya banki ya UK, wetaagisa card — ddala ss link oteeka wansi.",
  },
  "sec.step1Title": {
    en: "Send us a UK product link or cart screenshot",
    sw: "Tutumie kiungo cha bidhaa ya UK au picha ya kikapu",
    rw: "Tumiza link y'igicuruzwa cya UK cyangwa ifoto y'urugendo",
    lg: "Tutumye link y'ekintu ekya UK oba picha y'ekibinja",
  },
  "sec.step1Body": {
    en: "Works on Amazon UK, ASOS, Zara, Next, and any British retailer. We calculate product price, UK shipping, our fee, and full duties.",
    sw: "Inafanya kazi kwenye Amazon UK, ASOS, Zara, Next na duka lolote la Uingereza. Tunakokotoa bei ya bidhaa, usafirishaji, ada yetu, na kodi zote.",
    rw: "Bikora kuri Amazon UK, ASOS, Zara, Next n'amaduka yose y'Ubwongereza. Turagereranya igiciro, kohereza, serivisi, n'imisoro yose.",
    lg: "Kikola ku Amazon UK, ASOS, Zara, Next ne dukka lyonna erya Britain. Fwe tukalimba emiwendo, okusindika, ekisenge kyaffe, ne emisolo gyonna.",
  },
  "sec.step2Title": {
    en: "We buy, inspect & consolidate",
    sw: "Sisi tunanunua, tukagundua na kuunganisha",
    rw: "Turikagura, turireba tugahuza",
    lg: "Ffe tuligula, tulikebera ne tubipakira wamu",
  },
  "sec.step2Body": {
    en: "Your items arrive at our London Heathrow warehouse where they are checked, photographed, and packed securely before consolidation.",
    sw: "Bidhaa zako zinafika ghala yetu ya London Heathrow ambapo zinakagunduliwa, kupigwa picha, na kufungwa kwa usalama kabla ya kuunganishwa.",
    rw: "Ibicuruzwa byawe bigera mu kigega cyacu cya London Heathrow aho tubireba, tugafata ifoto, tugafunga neza mbere yo kubihuza.",
    lg: "Ebintu byo bituuka mu kagga kaffe ak'e London Heathrow wamu ne tulikebera, tulibakire ne tubipakire bulungi nga byeteeseddwa okupakirwa wamu.",
  },
  "sec.step3Title": {
    en: "Express air delivery to East Africa",
    sw: "Uwasilishaji wa ndege wa haraka hadi Afrika Mashariki",
    rw: "Kohereza ku Kirere vuba i Burasirazuba bw'Afurika",
    lg: "Okusindika n'ennyonyi kwangu okudda mu East Africa",
  },
  "sec.step3Body": {
    en: "Customs cleared before dispatch. Delivered to your door in 4–8 days in Tanzania, Kenya, Uganda and Rwanda with WhatsApp photo confirmation.",
    sw: "Forodha zimefutwa kabla ya kutuma. Inafika mlango wako kwa siku 4–8 nchini Tanzania, Kenya, Uganda na Rwanda na uthibitisho wa picha kupitia WhatsApp.",
    rw: "Imisoro yakozwe mbere yo kohereza. Bigezeyo imbere y'inyubako yawe mu minsi 4–8 muri Tanzaniya, Kenya, Uganda na Rwanda n'ifoto kuri WhatsApp.",
    lg: "Omusolo gw'amafuta gugobeddwa nga tebasindisse. Ebituuka ku luggi lw'ennyumba yo mu nnaku 4–8 mu Tanzania, Kenya, Uganda ne Rwanda n'obujulizi bwa picha ku WhatsApp.",
  },

  /* ---------- Journey ---------- */
  "sec.journeyTitle": {
    en: "Your Parcel's Journey, Step by Step",
    sw: "Safari ya Kifurushi Chako, Hatua kwa Hatua",
    rw: "Inzira y'Ikibaki Cyawe, Intambwe ku Ntambwe",
    lg: "Olugendo lw'Ekibinja Kyo, Entambula ku Ntambula",
  },
  "sec.journeySub": {
    en: "From our London warehouse to your doorstep — six checkpoints, fully tracked and updated on WhatsApp.",
    sw: "Kutoka ghala yetu ya London hadi mlango wako — vituo sita, vifuatiliwa kikamilifu na kusasishwa kwenye WhatsApp.",
    rw: "Kuva mu kigega cyacu cya London kugera imbere y'inyubako yawe — aho bacuza gatandatu, bikurikiranwa neza kuri WhatsApp.",
    lg: "Okuva mu kagga kaffe ak'e London okudda ku luggi lw'ennyumba yo — enkomerero mukaaga, zikwekwekkanyizibwa ne ku WhatsApp.",
  },
  "journey.warehouse": { en: "UK Warehouse", sw: "Ghala ya UK", rw: "Kigega cya UK", lg: "Ekagga ka UK" },
  "journey.inspection": { en: "Quality Inspection", sw: "Uchunguzi wa Ubora", rw: "Kureba Ubwiza", lg: "Okukebera Obulungi" },
  "journey.consolidation": { en: "Consolidation & Freight", sw: "Kuunganisha na Usafirishaji", rw: "Guhuza no Kohereza", lg: "Okupakira Wamu n'Okusindika" },
  "journey.customs": { en: "Customs Clearance", sw: "Ufutaji wa Forodha", rw: "Gusohoka mu Misoro", lg: "Okugobya Omusolo" },
  "journey.dispatch": { en: "Local Dispatch", sw: "Usafirishaji wa Ndani", rw: "Kohereza mu Gihugu", lg: "Okusindika mu Ggwanga" },
  "journey.delivery": { en: "Doorstep Delivery", sw: "Uwasilishaji Mlangoni", rw: "Kugeza Imbere y'Inyubako", lg: "Okugeza ku Nnyumba" },
  "journey.note": {
    en: "Every checkpoint sends you a WhatsApp update — you never have to ask.",
    sw: "Kituo kila kinakutumia sasisho la WhatsApp — huwezi kuuliza.",
    rw: "Buri ntambwe ikohereza ubutumwa kuri WhatsApp — ntugomba kubaza.",
    lg: "Buli nkomerero ekutumira ebbuuwa ku WhatsApp — togwetaagisa kubuuza.",
  },

  /* ---------- FAQ ---------- */
  "sec.faqTitle": {
    en: "Everything You Need to Know",
    sw: "Kila Unachohitaji Kujua",
    rw: "Ibyo Ugomba Kumenya Byose",
    lg: "Ebintu Byonna By'oyetaaga Okumanya",
  },
  "sec.faqSub": {
    en: "Can't find your answer? Our team is on WhatsApp 24/7 — tap the chat button or call +255 763 173 629.",
    sw: "Hujapata jibu lako? Timu yetu ipo WhatsApp masaa 24/7 — bonyeza kitufe cha mazungumzo au piga simu +255 763 173 629.",
    rw: "Ntiwabonye igisubizo? Ikipe yacu iri kuri WhatsApp 24/7 — kanda ku butumwa cyangwa uhamagare +255 763 173 629.",
    lg: "Tolaze ddagamulo? Ttiimu yaffe eri ku WhatsApp 24/7 — nyiga butani oba kuba +255 763 173 629.",
  },
  "faq.stillQuestion": {
    en: "Still have questions?",
    sw: "Bado una maswali?",
    rw: "Urafite ibibazo?",
    lg: "Kibuuza okiddira?",
  },
  "faq.stillAnswer": {
    en: "We reply on WhatsApp in minutes, not days.",
    sw: "Tunajibu kupitia WhatsApp kwa dakika, si siku.",
    rw: "Turasubiza kuri WhatsApp mu minota, atari iminsi.",
    lg: "Tugaba eddamu ku WhatsApp mu ddakiika, so si lunaku.",
  },

  /* ---------- Trust ---------- */
  "sec.trustTitle": {
    en: "Built on Transparency, Backed by Guarantees",
    sw: "Imejengwa kwa Uwajibikaji, Imetumwa kwa Dhamana",
    rw: "Yubatswe ku Mucyo, Ishyigikiwe n'Ibihamya",
    lg: "Eyazimbiddwa ku Buthegeefu, Ekakasiddwa n'Endagaano",
  },
  "sec.trustSub": {
    en: "Four promises that define every shipment we handle — because our name is on the box.",
    sw: "Ahadi nne zinazoafafanua kila usafirishaji tunaoendesha — kwa sababu jina letu liko kwenye sanduku.",
    rw: "Isezerano enye rigenga buri kohereza dukora — kuko izina ryacu riri ku kibaki.",
    lg: "Endagaano nnya eziraga buli kusindika kwe tukola — kubanga erinnya lyaffe liri ku kibinja.",
  },
  "trust.verified": { en: "Verified Parcels", sw: "Vifurushi Vilivyothibitishwa", rw: "Ibipaki Bigenzuzwe", lg: "Ebibinja Ebikebereddwa" },
  "trust.insured": { en: "Fully Insured", sw: "Imebima Kabisa", rw: "Byose Birinzwe", lg: "Birindiddwa Byonna" },
  "trust.local": { en: "Local Payments", sw: "Malipo ya Ndani", rw: "Kwishyura mu Gihugu", lg: "Okusasula mu Ggwanga" },
  "trust.duties": { en: "Duties Prepaid", sw: "Kodi Zimehakiwa", rw: "Imisoro Yishyuwe", lg: "Omusolo Gugobeddwa" },
  "trust.reviews": {
    en: "What Our Customers Say",
    sw: "Wateja Wetu Wanasema Nini",
    rw: "Ibyo Abakiriya Bacu Bavuga",
    lg: "Ebintu Ebiri ku Bakaziyana Baffe",
  },
  "trust.noFake": {
    en: "We don't publish fabricated reviews — this space is reserved for verified customers with real order numbers. Reviews appear here as they come in.",
    sw: "Hatuchapishi mapitio ya uongo — nafasi hii imehifadhiwa kwa wateja waliotambulishwa wenye nambari halisi za agizo. Mapitio yanaonekana hapa yanapofika.",
    rw: "Ntitusohora ibisubizo byangije — iki kibanza kirakozwe ku bakiriya bemewe bafite nimero z'ibikorwa nyazo. Ibisubizo biraza hano uko bireje.",
    lg: "Toteebika kwewandiisa kugamba ebyokuyinza — ekifo kino kyekuumiddwa ku bakaziyana ab'emegye balina nimuwa z'ebiguzi ez'amazima. Ebyogereddwa byetuuze wano nga bituuka.",
  },

  /* ---------- Hubs ---------- */
  "sec.hubsTitle": {
    en: "Dedicated Express Routes Across East Africa",
    sw: "Njia za Haraka Maalum Kote Afrika Mashariki",
    rw: "Inzira Zihuta z'Ubwihuta mu Burasirazuba bw'Afurika",
    lg: "Enguudo Z'Obwangu Ez'Ensonga mu East Africa",
  },
  "hubs.cityTz": { en: "Dar es Salaam, Tanzania", sw: "Dar es Salaam, Tanzania", rw: "Dar es Salaam, Tanzaniya", lg: "Dar es Salaam, Tanzania" },
  "hubs.cityKe": { en: "Nairobi, Kenya", sw: "Nairobi, Kenya", rw: "Nairobi, Kenya", lg: "Nairobi, Kenya" },
  "hubs.cityUg": { en: "Kampala, Uganda", sw: "Kampala, Uganda", rw: "Kigali, Uganda", lg: "Kampala, Uganda" },
  "hubs.cityRw": { en: "Kigali, Rwanda", sw: "Kigali, Rwanda", rw: "Kigali, Rwanda", lg: "Kigali, Rwanda" },

  /* ---------- Portal chrome ---------- */
  "portal.clientPortal": { en: "Client Portal", sw: "Portal ya Wateja", rw: "Portal y'Abakiriya", lg: "Portal y'Abakaziyana" },
  "portal.searchPh": { en: "Search orders, items, tracking…", sw: "Tafuta maagizo, bidhaa, usafirishaji…", rw: "Shakisha ibikorwa, ibicuruzwa, kohereza…", lg: "Noonya ebiguzi, ebintu, okutambula…" },
  "portal.backHome": { en: "Back to Home", sw: "Rudi Nyumbani", rw: "Subira mu rugo", lg: "Ddayo ewaka" },
  "portal.chatWhatsApp": { en: "Chat on WhatsApp", sw: "Chata kwenye WhatsApp", rw: "Vugana kuri WhatsApp", lg: "Yogera ku WhatsApp" },
  "portal.notifications": { en: "Notifications", sw: "Arifa", rw: "Ubutumwa", lg: "Amabuuza" },
  "nav.dashboard": { en: "Dashboard", sw: "Dashibodi", rw: "Dashboard", lg: "Dashboard" },
  "nav.ukWarehouse": { en: "UK Warehouse", sw: "Ghala ya UK", rw: "Kigega cya UK", lg: "Ekagga ka UK" },
  "nav.orders": { en: "Orders", sw: "Maagizo", rw: "Ibicuruzwa", lg: "Ebiguzi" },
  "nav.tracking": { en: "Tracking", sw: "Ufuatiliaji", rw: "Gukurikirana", lg: "Okukebera" },
  "nav.walletPay": { en: "Wallet & Pay", sw: "Mkopo na Malipo", rw: "Amafaranga & Kwishyura", lg: "Wallet n'Okusasula" },
  "nav.payments": { en: "Payments", sw: "Malipo", rw: "Kwishyura", lg: "Okusasula" },
  "nav.referrals": { en: "Referrals", sw: "Uteuzi", rw: "Kutumira Inshuti", lg: "Okutumiza" },
  "nav.settings": { en: "Settings", sw: "Mipangilio", rw: "Igenamiterere", lg: "Ebiteekateekeddwako" },

  /* ---------- Payment history ---------- */
  "pay.title": { en: "Payment History", sw: "Historia ya Malipo", rw: "Amateka y'Kwishyura", lg: "Ennabi ya Okusasula" },
  "pay.sub": { en: "Every payment you have made through UK Shoppers Africa — with receipts you can download anytime.", sw: "Kila malipo umeyafanya kupitia UK Shoppers Africa — pamoja na risiti unazoweza kupakua wakati wowote.", rw: "Buri kwishyura wakoze biciye kuri UK Shoppers Africa — n'amafiche ushobora kurakuramo igihe icyo ari cyo cyose.", lg: "Buli ssasula ly'okoze mu UK Shoppers Africa — ne risiti z'oyinza okutwalira ekiseera kyonna." },
  "pay.totalPaid": { en: "Total Paid", sw: "Jumla Iliyolipwa", rw: "Igiciro Cyose", lg: "Ekiguzi Kyonna" },
  "pay.txCount": { en: "Transactions", sw: "Muamala", rw: "Ihaguruka", lg: "Eby'okusasula" },
  "pay.completed": { en: "Completed", sw: "Zimekamilika", rw: "Byarangiye", lg: "Byamaze Okugwa" },
  "pay.pending": { en: "Pending", sw: "Zinasubiri", rw: "Birategereje", lg: "Birindiriire" },
  "pay.searchPh": { en: "Search by reference or gateway…", sw: "Tafuta kwa marejeleo au mlango wa malipo…", rw: "Shakisha nimero cyangwa uburyo bwo kwishyura…", lg: "Noonya nimuwa oba engeri y'okusasula…" },
  "pay.all": { en: "All", sw: "Zote", rw: "Byose", lg: "Byonna" },
  "pay.none": { en: "No transactions found.", sw: "Hakuna muamala iliyopatikana.", rw: "Nta guhurukana byabonetse.", lg: "Tewali kusasula kulaze." },
  "pay.paid": { en: "Paid", sw: "Imelipwa", rw: "Byishyuwe", lg: "Kyasasuliddwa" },
  "pay.pendingStatus": { en: "Pending", sw: "Inasubiri", rw: "Biratekerejwe", lg: "Kireetera" },
  "pay.refunded": { en: "Refunded", sw: "Imerejeshwa", rw: "Byasubijwe", lg: "Kyaddizibwa" },
  "pay.receiptTooltip": { en: "Download PDF receipt", sw: "Pakua risiti ya PDF", rw: "Kuramo ifiche ya PDF", lg: "Ttwaale risiti ya PDF" },
  "pay.export": { en: "Export", sw: "Pakua Orodha", rw: "Kuramo Urutonde", lg: "Ttwaale Olukalala" },
  "pay.exportCsv": { en: "Export CSV", sw: "Pakua CSV", rw: "Kuramo CSV", lg: "Ttwaale CSV" },
  "pay.exportPdf": { en: "Export PDF Report", sw: "Pakua Ripoti PDF", rw: "Kuramo Raporo ya PDF", lg: "Ttwaale Lipoti PDF" },
  "pay.exportNone": { en: "Nothing to export — adjust your filters first.", sw: "Hakuna cha kupakua — rekebisha vichungi kwanza.", rw: "Nta byo kuramo — hindura imikamo mbere.", lg: "Tewali kye tuttwaala — kyusa eby'okukebera kubanza." },

  /* ---------- Payment success ---------- */
  "success.locating": { en: "Locating your payment…", sw: "Inatafuta malipo yako…", rw: "Turishakira icyo wishyuye…", lg: "Tunoonya ssasula lyo…" },
  "success.confirmed": { en: "Payment Confirmed!", sw: "Malipo Yamekubaliwa!", rw: "Kwishyura Byemejwe!", lg: "Ssasula Lyakakasiddwa!" },
  "success.processing": { en: "Your order is now being processed by our London team.", sw: "Agizo lako linashughulikiwa na timu yetu ya London.", rw: "Icyo ugura kirimo gukorwa n'ikipe yacu ya London.", lg: "Ekiguzi kyo kati kiri kukolebwa ttiimu yaffe ey'e London." },
  "success.reference": { en: "Reference", sw: "Marejeleo", rw: "Indangamiterere", lg: "Ennimuwa" },
  "success.paidVia": { en: "Paid via", sw: "Imelipwa kupitia", rw: "Byishyuwe biciye", lg: "Kyasasuliddwa mu" },
  "success.amount": { en: "Amount", sw: "Kiasi", rw: "Igiciro", lg: "Omugendo" },
  "success.items": { en: "Items", sw: "Bidhaa", rw: "Ibicuruzwa", lg: "Ebintu" },
  "success.downloadReceipt": { en: "Download PDF Receipt", sw: "Pakua Risiti ya PDF", rw: "Kuramo Ifiche ya PDF", lg: "Ttwaale Risiti ya PDF" },
  "success.whatNext": { en: "What happens next", sw: "Kinachofuata", rw: "Ibyakurikira", lg: "Ebidda wansi" },
  "success.step1": { en: "We purchase your items from the UK store within 24 hours.", sw: "Tunanunua bidhaa zako kutoka dukani UK ndani ya masaa 24.", rw: "Turikagura ibicuruzwa byawe mu iduka rya UK mu masaha 24.", lg: "Tuligula ebintu byo mu dduka erya UK mu ssaawa 24." },
  "success.step2": { en: "Your parcel is inspected, consolidated, and flown to East Africa.", sw: "Kifurushi chako kinakagundua, kiunganishwa, na kusafirishwa ndege hadi Afrika Mashariki.", rw: "Ikibaki cyawe kirakurikiranwa, gihuza, kinjizwa ku ndege ku Burasirazuba bw'Afurika.", lg: "Ekibinja kyo kikebwa, kipakirwa wamu, ne kisindikiddwa n'ennyonyi mu East Africa." },
  "success.step3": { en: "You'll get WhatsApp updates at every checkpoint.", sw: "Utapata masasisho ya WhatsApp kila kituo.", rw: "Uzabona ubutumwa kuri WhatsApp buri ntambwe.", lg: "Ofuna amabuuza ga WhatsApp mu buli nkomerero." },
  "success.viewOrders": { en: "View My Orders", sw: "Tazama Maagizo Yangu", rw: "Reba Ibiguzi Byanjye", lg: "Laba Ebiguzi Byange" },
  "success.goDashboard": { en: "Go to Dashboard", sw: "Nenda Dashibodini", rw: "Jya muri Dashboard", lg: "Genda mu Dashboard" },

  "foot.quickLinks": { en: "Quick Links", sw: "Viungo vya Haraka", rw: "Link Zihuse", lg: "Link Enkangu" },
  "foot.services": { en: "Services", sw: "Huduma", rw: "Serivisi", lg: "Obuweereza" },
  "foot.contact": { en: "Contact & Support", sw: "Mawasiliano na Msaada", rw: "Twandikira", lg: "Twetuukirize" },
  "foot.privacy": { en: "Privacy Policy", sw: "Sera ya Faragha", rw: "Itegeko ry'Ibanga", lg: "Etteeka ly'Ekyama" },
  "foot.terms": { en: "Terms of Service", sw: "Masharti ya Huduma", rw: "Amabwiriza ya Serivisi", lg: "Endagaano z'Obuweereza" },
  "foot.shipping": { en: "Shipping Guidelines", sw: "Miongozo ya Usafirishaji", rw: "Amabwiriza yo Kohereza", lg: "Ebikwatibwako eby'Okusindika" },
  "foot.rights": {
    en: "All rights reserved.",
    sw: "Haki zote zimehifadhiwa. UK Shoppers Africa — Inaendeshwa na INM LTD",
    rw: "Uburenganzira bwose burabitswe. UK Shoppers Africa — Bishyigikiwe na INM LTD",
    lg: "Eddembe lyonna lirindiddwa. UK Shoppers Africa — Eyakolebwa INM LTD",
  },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? t[key]?.en ?? key;
}
