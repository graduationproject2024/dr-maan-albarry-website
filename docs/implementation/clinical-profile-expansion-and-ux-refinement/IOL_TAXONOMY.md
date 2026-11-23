# IOL taxonomy

| id | Arabic | English | Design | Typical need for glasses (doctor's wording; educational, not a promise) |
|---|---|---|---|---|
| monofocal | العدسة الأحادية | Standard monofocal | one focus | glasses for 65 cm and 40 cm when set for distance |
| enhanced | العدسة الأحادية المطورة | Enhanced monofocal | slightly extended profile; light not split | glasses for 40 cm |
| edof | العدسة ممتدة المدى | EDOF | extended range | clear to about 50 cm; glasses may be needed at 40 cm |
| trifocal | العدسة الثلاثية | Trifocal | three foci | **may greatly reduce** the need for glasses; no guarantee (the doctor's "no glasses" is not published as a guarantee) |
| toric | العدسة اللابؤرية | Toric | **a correction added to a design** (monofocal, EDOF or trifocal) | follows the design it is added to |

## How each part is built

**Lens Lab**
- `LENS_ORDER` is monofocal, enhanced, edof, trifocal, toric.
- The bifocal multifocal stays among the simulator's other lenses.

**Simulator**
- The simple row keeps three designs (monofocal, EDOF, trifocal), whose phone layout was verified on real devices.
- More settings adds the enhanced monofocal and a Toric switch.
- All five are compared side by side in the Lens Lab table.
- Lens ids follow the pattern `<design>-toric`; `toric` means a monofocal toric.
- Turning toric on in an eye with no astigmatism sets a 1.5 D demonstration and says so on screen.
- Toric changes nothing when there is no astigmatism (unit-tested).

**Enhanced optics**
- Foci are 0 D at 74 %, 0.5 D at 16 % and 1.0 D at 10 %.
- These are shape parameters, not measured data.
- The result sits between monofocal and EDOF at 65 cm (unit-tested).
- Reference: Auffarth GU et al., JCRS 2021.

**What guides the choice**
- Examination, ocular surface, corneal measurements, other eye conditions, lifestyle, expectations and the surgeon's assessment.
- The site never recommends a lens.
