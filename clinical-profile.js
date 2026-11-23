// ============================================================
// CLINICAL PROFILE REGISTRY — qualifications, employment, achievements, publications, diagnostic devices
// and the photo gallery manifest, each with its provenance. Companion to doctor-data.js (identity, contact,
// procedures), which stays the source for everything that existed before 2026-11-23.
//
// Provenance (`source`):
//   owner-2026-11-23  supplied by the site owner on 2026-11-23 as information from Dr. Maan (the "master
//                     refinement" brief). Not independently documented.
//   doctor            personally confirmed by Dr. Maan (doctor-data.js SOURCES.doctor)
//   magrabi / taibah  published by the institution (doctor-data.js SOURCES)
//   manufacturer      the device maker's official product page
//
// Publication (`display`):
//   'public'          shown as written in `public`
//   'qualified'       shown, but in the factual, non-comparative wording in `public`; the original superlative
//                     ("first in …", "pioneer") stays here, in `original`, until evidence is recorded in `evidence`
//   'internal'        kept in this registry only (positioning statements, unverified comparative claims)
// Nothing here is a clinical approval. Governance: docs/implementation/clinical-profile-expansion-and-ux-refinement/
// PROVENANCE_POLICY.md and FIRST_IN_REGION_CLAIMS.md.
// ============================================================

export const OWNER_SOURCE = Object.freeze({
  id: 'owner-2026-11-23',
  label: 'Supplied by the site owner on 2026-11-23 (information from Dr. Maan)',
  date: '2026-11-23'
});

// ---------- 1. Qualifications (adds to doctor-data.js DOCTOR.professional.qualifications) ----------
export const QUALIFICATIONS = Object.freeze([
  {
    id: 'ico-2002', years: [2002, 2003], kind: 'certificate', source: 'owner-2026-11-23', display: 'public',
    original: 'حاصل على شهادات المجلس الدولي لطب وجراحة العيون (ICO) خلال عامي 2002–2003م.',
    public: {
      ar: 'شهادات المجلس الدولي لطب العيون (ICO)',
      en: 'International Council of Ophthalmology (ICO) examination certificates'
    },
    institution: { ar: 'المجلس الدولي لطب العيون', en: 'International Council of Ophthalmology' },
    // The specific ICO examinations passed were not supplied; none is named publicly.
    note: 'Examination level/titles not supplied — do not name a specific ICO examination.'
  },
  {
    id: 'ksu-fellowship-2004', years: [2004], kind: 'fellowship', source: 'owner-2026-11-23', display: 'public',
    original: 'حاصل على زمالة جامعة الملك سعود في طب وجراحة العيون عام 2004م.',
    public: {
      ar: 'زمالة جامعة الملك سعود في طب وجراحة العيون',
      en: 'King Saud University Fellowship in Ophthalmology'
    },
    institution: { ar: 'جامعة الملك سعود', en: 'King Saud University' },
    note: 'Exact official certificate title not yet documented.'
  },
  {
    id: 'kkesh-fellowship-2005', years: [2005], kind: 'fellowship', source: 'owner-2026-11-23', display: 'public',
    original: 'حاصل على زمالة مستشفى الملك خالد التخصصي للعيون عام 2005م، في التخصصات الدقيقة المتعلقة بجراحات القرنية والماء الأبيض وتصحيح الإبصار والتهابات العنبية.',
    public: {
      ar: 'زمالة مستشفى الملك خالد التخصصي للعيون في التخصصات الدقيقة: جراحات القرنية والماء الأبيض وتصحيح الإبصار، والتهابات العنبية',
      en: 'King Khaled Eye Specialist Hospital subspecialty fellowship: cornea, cataract and refractive surgery, and uveitis'
    },
    institution: { ar: 'مستشفى الملك خالد التخصصي للعيون', en: 'King Khaled Eye Specialist Hospital' },
    note: 'Exact official certificate title not yet documented.'
  }
]);

// ---------- 2. Employment ----------
export const EMPLOYMENT = Object.freeze([
  {
    id: 'kkesh', from: 2001, to: 2009, current: false, source: 'owner-2026-11-23', display: 'public',
    original: [
      'عمل بمستشفى الملك خالد التخصصي للعيون من عام 2001 حتى عام 2009م.',
      'عضو الطاقم الطبي – استشاري بمستشفى الملك خالد التخصصي للعيون.',
      'ساهم في تدريب العشرات من الأخصائيين في التخصص الدقيق وأطباء زمالة طب وجراحة العيون.'
    ],
    place: { ar: 'مستشفى الملك خالد التخصصي للعيون، الرياض', en: 'King Khaled Eye Specialist Hospital, Riyadh' },
    // The owner supplied "medical staff member – consultant" without dates for the consultant appointment, so the
    // role is shown as supplied and no seniority or date is added.
    role: { ar: 'عضو الطاقم الطبي – استشاري', en: 'Medical staff member – Consultant' },
    teaching: {
      ar: 'شارك في تدريب عشرات الأطباء في التخصصات الدقيقة وأطباء زمالة طب وجراحة العيون.',
      en: 'Took part in training dozens of subspecialty trainees and ophthalmology fellows.'
    }
  }
]);

// ---------- 3. Credibility statistic ----------
// Requested by the owner as "+25,000 surgical operations". It replaces the earlier "15,000+ examinations and
// procedures combined" (doctor-data.js) so the site never shows two contradictory counts. Whether the figure counts
// operations Dr. Maan performed personally over his career is the owner's attribution; it is labelled accordingly.
export const SURGERY_STAT = Object.freeze({
  id: 'surgeries-25000', value: 25000, display: '25,000+', source: 'owner-2026-11-23', status: 'owner-supplied',
  original: '+25,000 عملية جراحية',
  scope: 'career total of surgical operations, as supplied by the owner (attribution to personally performed cases to be confirmed)',
  label: { ar: 'عملية جراحية خلال مسيرته', en: 'surgical operations over his career' },
  sub: { ar: 'إجمالي المسيرة المهنية', en: 'Career total' }
});

// ---------- 4. Achievements (all 16 supplied items + leadership + two devices) ----------
// type: 'experience' (performed/used since …) · 'first-in-region' · 'publication-backed' · 'positioning' · 'leadership'
// evidence: [] until a document is recorded ({ kind, ref, url, note }). `publicationIds` link to PUBLICATIONS.
export const ACHIEVEMENTS = Object.freeze([
  {
    id: 'A01', category: 'innovation', area: 'cataract-uveitis', year: 2013, type: 'first-in-region', display: 'qualified',
    original: 'المطور والرائد في عمليات الماء الأبيض بمرضى القزحية والتهابات الطبقة العنبية منذ عام 2013.',
    public: {
      ar: 'جراحة الماء الأبيض لدى مرضى التهابات الطبقة العنبية وأمراض القزحية، مجال اختصاص يمارسه ويطوّر أسلوبه فيه منذ 2013.',
      en: 'Cataract surgery in eyes with uveitis and iris disease — a field he has practised and developed since 2013.'
    },
    pending: 'The "developer and pioneer" characterisation is the owner\'s; no documented priority.', evidence: []
  },
  {
    id: 'A02', category: 'innovation', area: 'dropless-cataract', year: 2013, type: 'publication-backed', display: 'qualified',
    original: 'رائد عمليات الماء الأبيض بدون قطرات، وله بحث منشور، منذ عام 2013.',
    public: {
      ar: 'يجري جراحة الماء الأبيض دون قطرات (Dropless) منذ 2013، أي بإعطاء الدواء داخل العين أثناء العملية لتقليل الحاجة إلى القطرات بعدها. قد يحتاج بعض المرضى إلى قطرات رغم ذلك، ويقرر الطبيب ما يناسب كل عين.',
      en: 'He has performed "dropless" cataract surgery since 2013 — medication placed inside the eye during the operation to reduce the need for drops afterwards. Some patients may still need drops; the surgeon decides what suits each eye.'
    },
    publicationIds: ['P-dropless'], pending: 'Publication details not yet verified (see PUBLICATIONS).', evidence: []
  },
  {
    id: 'A03', category: 'positioning', area: 'cataract-cornea-refractive', type: 'positioning', display: 'internal',
    original: 'من رواد جراحي الماء الأبيض والقرنية وعمليات تصحيح الإبصار بالمملكة العربية السعودية.',
    pending: 'Broad positioning statement; the profile shows the concrete items instead (policy: no stacked superlatives).', evidence: []
  },
  {
    id: 'A04', category: 'innovation', area: 'cxl', year: 2010, type: 'first-in-region', display: 'qualified', region: 'madinah',
    original: 'أول من أدخل العلاج الضوئي لتصليب القرنية بالمدينة المنورة عام 2010م.',
    public: {
      ar: 'يجري العلاج الضوئي لتثبيت القرنية (CXL) في المدينة المنورة منذ 2010.',
      en: 'Corneal cross-linking (CXL) in Madinah since 2010.'
    },
    link: 'keratoconus-cxl', pending: '"First in Madinah" awaits documentary evidence.', evidence: []
  },
  {
    id: 'A05', category: 'innovation', area: 'icl', year: 2010, type: 'first-in-region', display: 'qualified', region: 'madinah',
    original: 'أول من أدخل زراعة العدسات ICL بالمدينة المنورة عام 2010م.',
    public: {
      ar: 'يزرع العدسة اللاصقة الداخلية (ICL) في المدينة المنورة منذ 2010.',
      en: 'Implantable contact lens (ICL) surgery in Madinah since 2010.'
    },
    link: 'icl', pending: '"First in Madinah" awaits documentary evidence.', evidence: []
  },
  {
    id: 'A06', category: 'innovation', area: 'premium-iol', year: 2010, type: 'first-in-region', display: 'qualified', region: 'madinah',
    original: 'أول من بدأ زراعة العدسات الثلاثية والممتدة وعدسات اللابؤرية بالمدينة المنورة عام 2010م.',
    // Split into components (brief §19, A06). Each component carries its own status; see FIRST_IN_REGION_CLAIMS.md.
    components: [
      { lens: 'toric', display: 'qualified', note: 'Toric IOLs were in clinical use well before 2010.' },
      { lens: 'trifocal', display: 'qualified', note: 'First trifocal IOLs reached the market around 2010 — plausible, not documented.' },
      { lens: 'edof', display: 'internal', note: 'Anachronism: the first EDOF lens (Tecnis Symfony) received its CE mark in June 2014. Kept out of the public text until the owner clarifies (e.g. a later year).' }
    ],
    evidence: [{ kind: 'press', ref: 'al-madina-2016', url: 'https://www.al-madina.com/article/463973/', note: 'Al-Madina newspaper, 16 Aug 2016: a team led by Dr. Maan implanted a trifocal lens with cataract removal. Supports trifocal experience (2016); does not claim or establish a first.' }],
    public: {
      ar: 'يزرع العدسات الثلاثية البؤرة والعدسات اللابؤرية (Toric) في المدينة المنورة منذ 2010.',
      en: 'Trifocal and toric lens implants in Madinah since 2010.'
    },
    link: 'lens-implants', pending: '"First in Madinah" and the EDOF-in-2010 component await evidence / clarification.'
  },
  {
    id: 'A07', category: 'innovation', area: 'femto-lasik', year: 2010, type: 'first-in-region', display: 'qualified', region: 'madinah',
    original: 'أول من أدخل عمليات الفيمتوليزيك بالمدينة المنورة عام 2010م.',
    public: {
      ar: 'يجري الفيمتوليزيك (Femto-LASIK) في المدينة المنورة منذ 2010.',
      en: 'Femto-LASIK (femtosecond laser-assisted LASIK) in Madinah since 2010.'
    },
    link: 'laser-vision-correction', pending: '"First in Madinah" awaits documentary evidence.', evidence: []
  },
  {
    id: 'A08', category: 'innovation', area: 'topography-guided', type: 'first-in-region', display: 'qualified', region: 'saudi-arabia',
    original: 'من رواد علاج القرنية المخروطية بواسطة الليزر الطوبوغرافي بالمملكة العربية السعودية.',
    public: {
      ar: 'خبرة في العلاج بالليزر الموجَّه بالطوبوغرافيا لحالات مختارة من القرنية المخروطية؛ وهو لا يناسب كل مريض.',
      en: 'Experience with topography-guided laser treatment for selected keratoconus cases — it is not suitable for every patient.'
    },
    link: 'keratoconus-cxl', pending: '"Pioneer in Saudi Arabia" awaits evidence.', evidence: []
  },
  {
    id: 'A09', category: 'clinical', area: 'vkc', type: 'first-in-region', display: 'qualified', region: 'saudi-arabia',
    original: 'من رواد علاج الرمد الربيعي بالمملكة العربية السعودية.',
    public: {
      ar: 'خبرة طويلة في علاج الرمد الربيعي (التهاب القرنية والملتحمة الربيعي).',
      en: 'Long experience in treating vernal keratoconjunctivitis (VKC).'
    },
    publicationIds: ['P-vkc-tacrolimus-2017', 'P-vkc-tacrolimus-2022'],
    pending: '"Pioneer in Saudi Arabia" awaits evidence.',
    evidence: [{ kind: 'publication', ref: 'P-vkc-tacrolimus-2022', url: 'https://pubmed.ncbi.nlm.nih.gov/35401178/', note: 'Two peer-reviewed VKC treatment papers (2017, 2022) list him as author.' }]
  },
  {
    id: 'A10', category: 'clinical', area: 'corneal-surgery', type: 'first-in-region', display: 'internal', region: 'madinah',
    original: 'من أوائل الجراحين المختصين في جراحات القرنية بالمدينة المنورة.',
    pending: 'Comparative claim without a date; corneal surgery experience is already shown through A04, A05, A08 and the procedure list.', evidence: []
  },
  {
    id: 'A11', category: 'research', area: 'anti-vegf-uveitis', year: 2006, type: 'publication-backed', display: 'qualified', region: 'saudi-arabia',
    original: 'أول من بدأ استخدام حقن الآنتي-VEGF لمرضى الطبقة العنبية بالمملكة العربية السعودية، وله بحث منشور، عام 2006م.',
    public: {
      ar: 'استخدم حقن مضادات عامل نمو بطانة الأوعية (Anti-VEGF) لدى مرضى التهابات الطبقة العنبية منذ 2006.',
      en: 'Used anti-VEGF (anti-vascular endothelial growth factor) injections in patients with uveitis from 2006.'
    },
    publicationIds: ['P-antivegf-uveitis'], link: 'intravitreal-injections',
    pending: '"First in Saudi Arabia" awaits evidence. The KKESH series he co-authored covers patients treated from June 2006 (published 2014).',
    evidence: [{ kind: 'publication', ref: 'P-antivegf-uveitis', url: 'https://pubmed.ncbi.nlm.nih.gov/25136452/', note: 'Supports use of intravitreal bevacizumab in uveitic macular oedema at KKESH from 2006; does not establish a national first.' }]
  },
  {
    id: 'A12', category: 'clinical', area: 'pediatric-uveitis-biologics', year: 2009, type: 'first-in-region', display: 'qualified', region: 'saudi-arabia',
    original: 'أول من بدأ استخدام الإبر البيولوجية لمرضى الطبقة العنبية من الأطفال بالمملكة العربية السعودية عام 2009م.',
    public: {
      ar: 'استخدم العلاجات البيولوجية لدى الأطفال المصابين بالتهابات الطبقة العنبية منذ 2009.',
      en: 'Used biologic therapy for children with uveitis from 2009.'
    },
    pending: 'Medication not named by the owner (none is named publicly); "first in Saudi Arabia" awaits evidence.', evidence: []
  },
  {
    id: 'A13', category: 'clinical', area: 'voriconazole', year: 2008, type: 'experience', display: 'public',
    original: 'استخدم فوريكونازول المضاد للفطريات بمستشفى الملك خالد التخصصي للعيون عام 2008م.',
    public: {
      ar: 'استخدم مضاد الفطريات فوريكونازول (Voriconazole) في مستشفى الملك خالد التخصصي للعيون عام 2008.',
      en: 'Used the antifungal voriconazole at King Khaled Eye Specialist Hospital in 2008.'
    },
    pending: 'Route, dose and indication not supplied — none is published.', evidence: []
  },
  {
    id: 'A14', category: 'experience', area: 'referral-centres', type: 'experience', display: 'public',
    original: 'عمل كل حياته الوظيفية في مراكز ومستشفيات مرجعية ومتقدمة.',
    public: {
      ar: 'أمضى مسيرته في مراكز ومستشفيات مرجعية متقدمة: مستشفى الملك خالد التخصصي للعيون، وجامعة طيبة، ومغربي الصحية.',
      en: 'His career has been spent in advanced referral centres: King Khaled Eye Specialist Hospital, Taibah University and Magrabi Health.'
    },
    pending: 'Shown through the documented employment timeline rather than as a universal claim.', evidence: []
  },
  {
    id: 'A15', category: 'experience', area: 'regional-anterior-segment', type: 'experience', display: 'public',
    original: 'تتسم بعض الأمراض بخصائص جغرافية وإقليمية، وللدكتور معن خبرة ممتدة في أمراض وعمليات مقدمة العين المعقدة التي تشاهد في السعودية والخليج والشرق الأوسط.',
    public: {
      ar: 'خبرة ممتدة في الحالات المعقدة لمقدمة العين كما تُشاهد في الممارسة المرجعية بالمملكة والخليج والشرق الأوسط.',
      en: 'Extensive experience with complex anterior-segment conditions as seen in referral practice in Saudi Arabia, the Gulf and the Middle East.'
    },
    evidence: []
  },
  {
    id: 'A16', category: 'positioning', area: 'general', type: 'positioning', display: 'internal',
    original: 'أحد رواد المملكة في مجاله الطبي.',
    pending: 'Broad positioning statement; not stacked on the site.', evidence: []
  },
  {
    id: 'L01', category: 'leadership', area: 'society', type: 'leadership', display: 'public', roleId: 'sscc-president',
    original: 'تم تعيين الدكتور معن البري رغم عدم رغبته كأول رئيس لرابطة جراحي القرنية والماء الأبيض وعمليات تصحيح الإبصار.',
    // The personal remark ("despite his reluctance") stays in this internal record only.
    public: {
      ar: 'اختير لتولي منصب أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار.',
      en: 'Selected as the first President of the Saudi Association of Cornea, Cataract & Refractive Surgeons.'
    },
    pending: 'Not independently documented. The Saudi Society of Cornea, Cataract and Refractive Surgery (SSCRS, sscrs.org) was established in 2021 and its pages name no president; the owner\'s "رابطة" may be a different, earlier body. The site keeps the wording already published (doctor-data.js role sscc-president) until the owner confirms the organisation.', evidence: []
  },
  {
    id: 'D01', category: 'devices', area: 'itrace', type: 'first-in-region', display: 'qualified', region: 'madinah', deviceId: 'itrace',
    original: 'أدخل الدكتور أول جهاز iTrace بالمدينة المنورة.',
    public: {
      ar: 'أدخل جهاز iTrace لتحليل جودة الرؤية إلى ممارسته في المدينة المنورة.',
      en: 'Brought the iTrace visual-function analyser into his practice in Madinah.'
    },
    pending: '"First in Madinah" awaits installation records.', evidence: []
  },
  {
    id: 'D02', category: 'devices', area: 'pentacam-axl-wave', type: 'first-in-region', display: 'qualified', region: 'saudi-arabia', deviceId: 'pentacam-axl-wave',
    original: 'أدخل الدكتور جهاز Pentacam AXL Wave، وهو أول جهاز من نوعه بالمملكة العربية السعودية.',
    public: {
      ar: 'أدخل جهاز Pentacam AXL Wave إلى ممارسته في المدينة المنورة.',
      en: 'Brought the Pentacam AXL Wave into his practice in Madinah.'
    },
    pending: '"First of its kind in Saudi Arabia" awaits installation records. The model was launched in 2019 (ESCRS Paris), so any first dates from 2019 or later.', evidence: []
  }
]);

// ---------- 5. Publications ----------
// Only entries with `verified: true` are linked publicly. Unverified entries render nothing.
export const PUBLICATIONS = Object.freeze([
  // Claimed by the owner (A02); searched in PubMed and the open web on 2026-11-23 — not found. Nothing is published.
  { id: 'P-dropless', claimedBy: 'A02', topic: 'Dropless cataract surgery', verified: false, citation: null, doi: null, pubmed: null,
    searchNote: 'PubMed: 0 results for dropless / intracameral / transzonular steroid-antibiotic cataract papers with a Madinah, Taibah or Magrabi affiliation.' },
  // Supports A11 (anti-VEGF in uveitis): a KKESH series of patients treated June 2006 – June 2009; published 2014.
  { id: 'P-antivegf-uveitis', claimedBy: 'A11', topic: 'Anti-VEGF in uveitis', verified: true, year: 2014,
    citation: 'Al-Dhibi H, Hamade IH, Al-Halafi A, Barry M, Chacra CB, Gupta V, Tabbara KF. The effects of intravitreal bevacizumab in infectious and noninfectious uveitic macular edema. J Ophthalmol. 2014;2014:729465.',
    title: 'The effects of intravitreal bevacizumab in infectious and noninfectious uveitic macular edema', journal: 'Journal of Ophthalmology',
    doi: '10.1155/2014/729465', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/25136452/', nameForm: 'Barry, Maan (King Khaled Eye Specialist Hospital)' },
  // Further peer-reviewed papers that list him (PubMed full-name form and affiliation checked, 2026-11-23). Selected
  // for relevance to the practice; supports A09 (VKC) and A05 (phakic lens experience).
  { id: 'P-vkc-tacrolimus-2022', verified: true, year: 2022, supports: ['A09'],
    citation: 'Albarry MA, Parekh M, Ferrari S, Eltahir HM, Shehata AM, Shaker MA, Elbadawy HM. Incremental concentrations of tacrolimus eye drops as a strategy for the management of severe vernal keratoconjunctivitis. Front Pharmacol. 2022;13:798998.',
    title: 'Incremental concentrations of tacrolimus eye drops as a strategy for the management of severe vernal keratoconjunctivitis', journal: 'Frontiers in Pharmacology',
    doi: '10.3389/fphar.2022.798998', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/35401178/' },
  { id: 'P-vkc-tacrolimus-2017', verified: true, year: 2017, supports: ['A09'],
    citation: 'Al-Amri AM, Fiorentini SF, Albarry MA, Bamahfouz AY. Long-term use of 0.003% tacrolimus suspension for treatment of vernal keratoconjunctivitis. Oman J Ophthalmol. 2017;10(3):145-149.',
    title: 'Long-term use of 0.003% tacrolimus suspension for treatment of vernal keratoconjunctivitis', journal: 'Oman Journal of Ophthalmology',
    doi: '10.4103/ojo.OJO_232_2014', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/29118487/' },
  { id: 'P-phakic-toric-2024', verified: true, year: 2024, supports: ['A05'],
    citation: 'Al-Barry M, Alshareef EK, Albadawi S, Alkayyal AA, Alharbi AN, Alzahrani SA, Alsaedi MG. Refractive results with EyeCryl phakic toric IOL implantation in a hospital in Medina: a retrospective study. Cureus. 2024;16(12):e76656.',
    title: 'Refractive results with EyeCryl phakic toric IOL implantation in a hospital in Medina: a retrospective study', journal: 'Cureus',
    doi: '10.7759/cureus.76656', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/39886731/' },
  { id: 'P-vkh-vitd-2016', verified: true, year: 2016,
    citation: 'Al-Barry MA, Albalawi AM, Sayf MA, Badawi A, Afzal S, Latif M, Samman MI, Basit S. Sequence analysis of four vitamin D family genes (VDR, CYP24A1, CYP27B1 and CYP2R1) in Vogt-Koyanagi-Harada (VKH) patients. BMC Ophthalmol. 2016;16(1):172.',
    title: 'Sequence analysis of four vitamin D family genes in Vogt-Koyanagi-Harada patients', journal: 'BMC Ophthalmology',
    doi: '10.1186/s12886-016-0354-6', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/27716192/' },
  { id: 'P-dry-eye-cl-2021', verified: true, year: 2021,
    citation: 'Almutairi AH, Alalawi BS, Badr GH, Alawaz RA, Albarry M, Elbadawy HM. Prevalence of dry eye syndrome in association with the use of contact lenses in Saudi Arabia. BMC Ophthalmol. 2021;21(1):147.',
    title: 'Prevalence of dry eye syndrome in association with the use of contact lenses in Saudi Arabia', journal: 'BMC Ophthalmology',
    doi: '10.1186/s12886-021-01912-8', pubmed: 'https://pubmed.ncbi.nlm.nih.gov/33757466/' }
]);
export const verifiedPublications = () => PUBLICATIONS.filter(p => p.verified && p.citation);

// ---------- 6. Diagnostic devices ----------
// `image` stays null until an authentic, licensed photograph of the actual device is supplied (IMAGE_PERMISSIONS.md).
// Capabilities are paraphrased from the manufacturers' official pages (`url`); nothing is added.
export const DEVICES = Object.freeze([
  {
    id: 'itrace', name: 'iTrace', maker: 'Tracey Technologies', url: 'https://www.traceytechnologies.com/itrace-ophthalmic-technology/',
    kind: { ar: 'محلّل لجودة الرؤية بتقنية تتبع الأشعة، مع خرائط للقرنية', en: 'Ray-tracing aberrometer and corneal topographer' },
    what: {
      ar: 'يقيس كيف يمر الضوء عبر العين نقطةً بنقطة، ويفصل بين ما تسهم به القرنية وما تسهم به العدسة داخل العين في جودة الصورة.',
      en: 'Measures how light travels through the eye point by point, and separates what the cornea and what the lens inside the eye contribute to image quality.'
    },
    uses: [
      { ar: 'قياس الانحرافات البصرية (Wavefront aberrations) وجودة الرؤية', en: 'Wavefront aberrations and overall optical quality' },
      { ar: 'التمييز بين أثر القرنية وأثر العدسة', en: 'Separating corneal from internal (lens) contributions' },
      { ar: 'المساعدة في تخطيط جراحة الماء الأبيض وتقييم العدسات بعد زراعتها', en: 'Helping plan cataract surgery and assess lens implants afterwards' }
    ],
    image: null, achievementId: 'D01'
  },
  {
    id: 'pentacam-axl-wave', name: 'Pentacam® AXL Wave', maker: 'OCULUS', url: 'https://www.oculus.de/en/products/pentacam-axl-wave/',
    kind: { ar: 'جهاز تصوير مقطعي للقرنية ومقدمة العين مع قياس طول العين وتحليل الانحرافات', en: 'Corneal tomography, biometry and wavefront analysis in one device' },
    what: {
      ar: 'يصوّر القرنية ومقدمة العين بكاميرا دوّارة، ويقيس طول العين اللازم لحساب قوة العدسة، ويحلل الانحرافات البصرية للعين كاملة.',
      en: 'Images the cornea and the front of the eye with a rotating camera, measures the eye\'s length needed to calculate lens power, and analyses the optical aberrations of the whole eye.'
    },
    uses: [
      { ar: 'التصوير المقطعي للقرنية وكشف القرنية المخروطية', en: 'Corneal tomography, including keratoconus screening' },
      { ar: 'القياسات الحيوية لحساب قوة العدسة المزروعة', en: 'Biometry for intraocular lens power calculation' },
      { ar: 'تحليل الانحرافات البصرية قبل عمليات تصحيح الإبصار وجراحة الماء الأبيض', en: 'Aberration analysis before refractive and cataract surgery' }
    ],
    image: null, achievementId: 'D02'
  }
]);

// ---------- 7. Photo gallery manifest ----------
// One entry per approved photograph. Only `published: true` entries with a documented permission render.
// No photograph has been supplied yet, so the public gallery is not linked or indexed (PHOTO_GALLERY_ARCHITECTURE.md).
export const GALLERY_CATEGORIES = Object.freeze([
  { id: 'conferences', ar: 'المؤتمرات والمحافل العلمية', en: 'Conferences & Scientific Events' },
  { id: 'operating-room', ar: 'من داخل غرفة العمليات', en: 'Inside the Operating Room' },
  { id: 'meetings', ar: 'اللقاءات العلمية والمهنية', en: 'Scientific & Professional Meetings' }
]);
/** @type {ReadonlyArray<{id:string,category:string,image:string,thumbnail:string,width:number,height:number,alt:{ar:string,en:string},caption:{ar:string,en:string},date?:string,event?:string,location?:string,source:string,permission:{documented:boolean,reference:string,patientPrivacyReviewed?:boolean},exifStripped:boolean,published:boolean}>} */
export const GALLERY = Object.freeze([]);

/** A photograph may render only with a documented permission, stripped metadata and (operating room) a privacy review. */
export function isPublishablePhoto(p) {
  return Boolean(p && p.published && p.image && p.alt && p.alt.ar && p.alt.en &&
    p.permission && p.permission.documented && p.permission.reference && p.exifStripped &&
    (p.category !== 'operating-room' || p.permission.patientPrivacyReviewed === true) &&
    GALLERY_CATEGORIES.some(c => c.id === p.category));
}
export const publishedPhotos = () => GALLERY.filter(isPublishablePhoto);

// ---------- helpers ----------
export const publicAchievements = (category) => ACHIEVEMENTS.filter(a => a.display !== 'internal' && a.public && (!category || a.category === category));
export const achievementById = id => ACHIEVEMENTS.find(a => a.id === id) || null;

/** Dated milestones for the professional timeline (only public items; undated items are never given a date). */
export function timelineItems() {
  const items = [];
  for (const e of EMPLOYMENT) items.push({ id: e.id, from: e.from, to: e.to, kind: 'employment', title: e.place, text: e.role });
  for (const q of QUALIFICATIONS) items.push({ id: q.id, from: q.years[0], to: q.years[1] || null, kind: 'qualification', title: q.public, text: q.institution });
  for (const a of ACHIEVEMENTS) if (a.year && a.display !== 'internal') items.push({ id: a.id, from: a.year, to: null, kind: a.category, title: a.public, text: null });
  return items.sort((x, y) => x.from - y.from || (x.to ? -1 : 1));
}
