# Clinical sources

## Cataract simulator

Scope: the 3D patient-education simulator in `src/cataract-sim/`. This section lists the references behind each visual concept. Numeric values in the model are typical adult or cataract-age reference values. They are illustrative and are not biometry, surgical parameters or instrument settings.

> **Verification note.** These references were compiled from the published literature and standard textbooks. Their bibliographic details were **not re-checked online during this session**. Before any public claim relies on them, a physician or medical editor should confirm the citations (and the EyeWiki article titles, which are given without URLs).

### Reference list

| Key | Reference |
|---|---|
| A&S | Atchison DA, Smith G. *Optics of the Human Eye*. Butterworth-Heinemann; 2000. This covers the schematic eyes (Gullstrand, Le Grand, Navarro), the refractive indices and the ocular dimensions. |
| NAV | Navarro R, Santamaría J, Bescós J. Accommodation-dependent model of the human eye with aspherics. *J Opt Soc Am A*. 1985;2:1273–1281. |
| LB | Liou HL, Brennan NA. Anatomically accurate, finite model eye for optical modeling. *J Opt Soc Am A*. 1997;14:1684–1695. |
| DUB-C | Dubbelman M, Sicam VA, van der Heijde GL. The shape of the anterior and posterior surface of the aging human cornea. *Vision Res*. 2006;46:993–1001. |
| DUB-T | Dubbelman M, van der Heijde GL, Weeber HA. The thickness of the aging human lens obtained from corrected Scheimpflug images. *Optom Vis Sci*. 2001;78:411–416. |
| DUB-S | Dubbelman M, van der Heijde GL. The shape of the aging human lens: curvature, equivalent refractive index and the lens paradox. *Vision Res*. 2001;41:1867–1877. |
| DZ | Doughty MJ, Zaman ML. Human corneal thickness and its impact on intraocular pressure measures: a review and meta-analysis approach. *Surv Ophthalmol*. 2000;44:367–408. |
| ATC08 | Atchison DA, et al. Age-related changes in optical and biometric characteristics of emmetropic eyes. *J Vis*. 2008;8(4):29. |
| ROS | Rosen AM, et al. In vitro dimensions and curvatures of human lenses. *Vision Res*. 2006;46:1002–1009. |
| STR | Strenk SA, et al. Age-related changes in human ciliary muscle and lens: a magnetic resonance imaging study. *Invest Ophthalmol Vis Sci*. 1999;40:1162–1169. |
| VASS | Vass C, Menapace R, et al. Prediction of pseudophakic capsular bag diameter based on biometric variables. *J Cataract Refract Surg*. 1999;25:1376–1381. |
| GN | Gimbel HV, Neuhann T. Development, advantages, and methods of the continuous circular capsulorhexis technique. *J Cataract Refract Surg*. 1990;16:31–37. |
| GIM | Gimbel HV. Divide and conquer nucleofractis phacoemulsification: development and variations. *J Cataract Refract Surg*. 1991;17:281–291. |
| KEL | Kelman CD. Phaco-emulsification and aspiration: a new technique of cataract removal. *Am J Ophthalmol*. 1967;64:23–35. |
| FINE | Fine IH. Architecture and construction of a self-sealing incision for cataract surgery. *J Cataract Refract Surg*. 1991;17(Suppl):672–676. |
| BCSC | American Academy of Ophthalmology, *Basic and Clinical Science Course*: Section 2 (Fundamentals and Principles of Ophthalmology), Section 3 (Clinical Optics) and Section 11 (Lens and Cataract). |
| EYEWIKI | AAO EyeWiki (eyewiki.aao.org) articles on capsulorhexis, phacoemulsification, intraocular lenses and clear corneal incisions. The titles are approximate and no URLs are given. |
| ESCRS | ESCRS (European Society of Cataract & Refractive Surgeons) cataract surgery guidelines and patient information. |
| AAO-PE | AAO EyeSmart, "What Is Cataract Surgery?" and "What Are Cataracts?". These are already cited in the UI. |
| NEI | National Eye Institute (NIH), "Cataracts". Already cited in the UI. |

### Concept → reference

| Visual concept (file) | What is depicted | Supported by |
|---|---|---|
| Corneal anterior radius 7.8 mm, white-to-white 11.7 mm (`anatomy.js`) | Corneal dome size and curvature | A&S, NAV, LB, BCSC §2/§3 |
| Corneal posterior radius 6.5 mm (`anatomy.js`) | Meniscus cornea that thickens peripherally | NAV, LB, DUB-C |
| Central corneal thickness ~0.54 mm, thicker periphery (`anatomy.js`) | Cross-section thickness | DZ, BCSC §2 |
| Anterior chamber depth: 2.6 mm aqueous, i.e. 3.14 mm from the epithelium (`anatomy.js`) | A shallower chamber in a cataract-age eye | ATC08, A&S, BCSC §11 |
| Lens thickness 4.6 mm at age ~70 (`anatomy.js`) | The lens thickens with age | DUB-T, ATC08 |
| Lens apical radii: anterior 8.9 mm, posterior 5.4 mm (`anatomy.js`) | Asymmetric biconvex lens | DUB-S, A&S |
| Lens equatorial diameter ~9.4 mm (`anatomy.js`) | Lens and bag diameter | ROS, STR, A&S |
| Capsule as a thin envelope; anterior capsule thicker than posterior (drawn as a thin shell) | The capsule is continuous with the lens surface | BCSC §11 |
| Zonules: anterior, equatorial and posterior insertions; fibres crossing | Suspensory ligament | BCSC §2 and §11 |
| Ciliary body and processes at the lens equator, small circumlental space | Ciliary anatomy | BCSC §2, STR |
| Iris resting on the anterior lens; posterior chamber behind the iris | Iris–lens relationship | BCSC §2 |
| Pupil 3.2 mm (age-related miosis), 7 mm dilated | Pupil sizes | BCSC §2/§11, AAO-PE |
| Refractive indices: cornea 1.376, aqueous/vitreous 1.336, lens (homogeneous equivalent) 1.42 (`anatomy.js`, `optics.js`) | Computed light paths | A&S, NAV, LB |
| IOL: 6 mm optic, ~13 mm overall, C-loop haptics, generic acrylic index ~1.5 (`anatomy.js`, `surgery.js`) | A generic one-piece IOL | BCSC §3/§11, EYEWIKI |
| Capsular bag diameter after lens removal (~10–10.5 mm in vivo; the model bag is 9.4 mm, see the anatomy review) | Haptics engaging the bag equator | VASS, BCSC §11 |
| Clear-corneal, self-sealing tunnel incision at the temporal limbus (`anatomy.js` `WOUND`) | Entry point and fulcrum for instruments | FINE, EYEWIKI, AAO-PE |
| Continuous curvilinear capsulorhexis: a circular tear, with the flap folded and removed (`surgery.js`) | Stage 4 | GN, EYEWIKI, ESCRS |
| Phacoemulsification: nucleus fragmented into quadrants and aspirated at the tip inside the bag (`surgery.js`) | Stage 5 | KEL, GIM, EYEWIKI, AAO-PE, NEI |
| Folded IOL injected through the incision, unfolding in the bag (`surgery.js`) | Stage 6 | BCSC §11, EYEWIKI, AAO-PE |
| Anterior chamber deepening after lens replacement (`irisPseudoZ`, qualitative) | Stage 7 | BCSC §11 (pseudophakic ACD) |

### What the sources do **not** support

The following are educational choices with no clinical source. None of them is presented to the user as a number:
- the playback timings;
- the tear direction;
- the order of quadrant removal;
- the instrument paths, apart from the rule that instruments pass through the incision;
- the depicted rolled diameter of the IOL;
- the 0.16 mm iris-to-lens clearance.

No surgical parameter, instrument setting, energy, fluidics value, wound size, rhexis size or IOL power is given anywhere in the UI.
