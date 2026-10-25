(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={nameAr:`د. معن بن عبدالله بن عمر البري`,nameEn:`Dr. Maan Abdullah Omar Al Barry`,shortNameAr:`د. معن البري`,shortNameEn:`Dr. Maan Al Barry`,titleAr:`استشاري طب وجراحة العيون والقرنية والماء الأبيض وتصحيح الإبصار`,titleEn:`Consultant Ophthalmologist — Cataract, Cornea & Refractive Surgery`,degreesAr:`زميل كلية الجراحين الملكية (بريطانيا) FRCS`,degreesEn:`Fellow of the Royal College of Surgeons (UK) FRCS`,clinicAr:`مستشفيات ومراكز مغربي للعيون والأذن – المدينة المنورة`,clinicEn:`Magrabi Health Eye & ENT Hospital – Madinah`,addressAr:`طريق المطار، المدينة المنورة، المملكة العربية السعودية`,addressEn:`Airport Road, Madinah, Saudi Arabia`,whatsapp:`966508533309`,bookingUrl:`https://ob.magrabi.com.sa/OnlineBooking/`,callCenter:`19505`,landline:`920018000`,magrabiProfile:`https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry`,taibahProfile:`https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431`,email:`mbarry@taibahu.edu.sa`,mapsUrl:`https://maps.app.goo.gl/Hx6M1eKNEnGbe7AbA`,roles:{ar:[`المدير الطبي التنفيذي – مستشفيات ومراكز مغربي بالمدينة المنورة`,`رئيس قسم طب وجراحة العيون – جامعة طيبة`,`ممثل الجمعية السعودية لطب وجراحة العيون – المدينة المنورة`,`عضو المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون`,`أمين سر الجمعية السعودية لطب العيون سابقاً`,`زميل كلية الجراحين الملكية – بريطانيا (FRCS)`,`عضو الجمعية الأمريكية لطب وجراحة العيون (AAO)`,`عضو الجمعية السعودية لطب وجراحة العيون (SOS)`],en:[`Chief Medical Officer – Magrabi Health Eye & ENT, Madinah`,`Chairman, Department of Ophthalmology – Taibah University`,`Saudi Ophthalmological Society Representative – Madinah`,`Scientific Council Member – Red Sea Ophthalmology Conference`,`Former Secretary General – Saudi Ophthalmological Society`,`Fellow of the Royal College of Surgeons – UK (FRCS)`,`Member – American Academy of Ophthalmology (AAO)`,`Member – Saudi Ophthalmological Society (SOS)`]}},t=[0,-.5,-1,-1.5,-2,-2.5,-3,-3.5],n={monofocal:{id:`monofocal`,ar:`أحادية البؤرة`,en:`Monofocal`,va:[0,.1,.18,.32,.42,.5,.58,.66],halo:.1,noteAr:`أوضح رؤية للبعيد؛ القريب والمتوسط يحتاجان نظارة غالباً. أقل معدل للهالات بين الأنواع.`,noteEn:`Sharpest at distance; intermediate/near usually need glasses. Lowest halo rate of the three.`},edof:{id:`edof`,ar:`ممتدة المدى (EDOF)`,en:`Extended depth of focus`,va:[0,.03,.08,.13,.19,.24,.38,.52],halo:.35,noteAr:`انتقال سلس من البعيد إلى المتوسط، والقريب أقل من الثلاثية. الهالات أكثر من الأحادية.`,noteEn:`Smooth distance-to-intermediate range; near is weaker than trifocal. More halos than monofocal.`},trifocal:{id:`trifocal`,ar:`ثلاثية البؤرة`,en:`Trifocal`,va:[0,.08,.12,.1,.08,.1,.17,.32],halo:.8,noteAr:`رؤية جيدة للبعيد والمتوسط والقريب؛ الهالات الليلية أكثر شيوعاً وتخف غالباً مع التكيف العصبي.`,noteEn:`Good distance, intermediate and near; night halos are more common and often fade with neuroadaptation.`},cataract:{id:`cataract`,ar:`ساد (مثال متوسط)`,en:`Cataract (moderate example)`,va:[.5,.5,.52,.52,.55,.55,.58,.6],halo:0,noteAr:`مثال لساد متوسط (≈20/60). تختلف الشدة من مريض لآخر، والنظارة لا تعالج العتامة.`,noteEn:`A moderate example (~20/60). Severity varies, and glasses cannot fix lens opacity.`}},r=[[0,`بعيد (٦م+)`,`Distance (6m+)`],[-1,`١ متر`,`1 m`],[-1.5,`كمبيوتر ٦٦سم`,`Computer 66cm`],[-2.5,`جوال ٤٠سم`,`Phone 40cm`],[-3,`كتاب ٣٣سم`,`Book 33cm`]],i={lens:`trifocal`,scene:`night`,D:0,pos:50,tab:`sim`,lang:`ar`},a=(e,t)=>i.lang===`ar`?e:t,o=[20,25,32,40,50,63,80,100,125,160,200],s=e=>{let t=20*10**e;return`20/`+o.reduce((e,n)=>Math.abs(n-t)<Math.abs(e-t)?n:e)};function c(e,t){let r=n[e].va,i=Math.min(3.5,Math.max(0,-t))/.5,a=Math.min(6,Math.floor(i));return r[a]+(r[a+1]-r[a])*(i-a)}function l(e){let t=0;for(let n=0;n<=3.5;n+=.05)c(e,-n)<=.2&&(t=n);return t}var u=2.6,d=e=>Math.max(0,.5*u*(10**e-1));function f(e,t,n,r,i,a){let o=e.createRadialGradient(t,n,0,t,n,r);o.addColorStop(0,`rgba(${a},${i})`),o.addColorStop(1,`rgba(${a},0)`),e.fillStyle=o,e.fillRect(t-r,n-r,2*r,2*r)}function p(e,t,n,r,i,a,o){let s=e.createRadialGradient(t,n,Math.max(0,r-i),t,n,r+i);s.addColorStop(0,`rgba(${o},0)`),s.addColorStop(.5,`rgba(${o},${a})`),s.addColorStop(1,`rgba(${o},0)`),e.fillStyle=s,e.fillRect(t-r-i,n-r-i,2*(r+i),2*(r+i))}function m(e,t,n){let r=n*.47,i=t*.5,a=[],o=e.createLinearGradient(0,0,0,r);o.addColorStop(0,`#1b2a45`),o.addColorStop(1,`#4b5772`),e.fillStyle=o,e.fillRect(0,0,t,n),e.fillStyle=`#2b3550`,[[0,.34,.09],[.09,.39,.07],[.16,.33,.06],[.7,.37,.08],[.78,.32,.07],[.86,.36,.14]].forEach(([i,a,o])=>{e.fillRect(t*i,n*a,t*o,r-n*a)}),e.fillStyle=`rgba(235,208,150,.5)`;for(let r=0;r<60;r++){let i=[.01,.1,.71,.88][r%4];e.fillRect(t*(i+r%8*.007),n*(.37+.014*(r*5%7)),4,5)}o=e.createLinearGradient(0,r,0,n),o.addColorStop(0,`#3a414d`),o.addColorStop(1,`#242932`),e.fillStyle=o,e.beginPath(),e.moveTo(i-14,r),e.lineTo(i+14,r),e.lineTo(t*1.02,n),e.lineTo(-t*.02,n),e.fill(),e.fillStyle=`#98a0a8`;for(let t=0;t<7;t++){let a=(t/7)**2.2,o=((t+.55)/7)**2.2,s=r+(n-r)*a,c=r+(n-r)*o;e.beginPath(),e.moveTo(i-1-a*7,s),e.lineTo(i+1+a*7,s),e.lineTo(i+1+o*7,c),e.lineTo(i-1-o*7,c),e.fill()}e.fillStyle=`#2f3947`,e.fillRect(t*.5-2,n*.26,4,r-n*.26),e.fillStyle=`#17724b`,e.fillRect(t*.4,n*.12,t*.2,n*.14),e.strokeStyle=`#e8efe9`,e.lineWidth=2,e.strokeRect(t*.4+3,n*.12+3,t*.2-6,n*.14-6),e.fillStyle=`#fff`,e.textAlign=`center`,e.direction=`rtl`,e.font=`600 20px "IBM Plex Sans Arabic", sans-serif`,e.fillText(`المدينة المنورة`,t*.5,n*.19),e.direction=`ltr`,e.font=`600 14px Inter, sans-serif`,e.fillText(`Madinah  ·  12 km`,t*.5,n*.235);let s=(t,n,r,i,o)=>{a.push({x:t,y:n,r,col:i,s:o}),f(e,t,n,r*1.8,.4*o,i),e.fillStyle=`rgb(${i})`,e.beginPath(),e.arc(t,n,r*.5,0,Math.PI*2),e.fill()};for(let a=0;a<5;a++){let o=1-a/5*.75,c=r-(r-n*.2)*o,l=i-(i-t*.1)*o,u=i+(t*.9-i)*o,d=(n-r)*.5*o;e.fillStyle=`#2c3542`,[l,u].forEach(t=>e.fillRect(t-1.5*o,c,3*o,d)),s(l,c,3.6*o+1.2,`255,222,170`,.8),s(u,c,3.6*o+1.2,`255,222,170`,.8)}let c=(t,n,r)=>{e.fillStyle=`#1a202b`,e.fillRect(t-r/2,n-r*.32,r,r*.4),e.fillStyle=`#2a3240`,e.fillRect(t-r*.38,n-r*.52,r*.76,r*.22),s(t-r*.36,n-r*.1,r*.065,`255,70,60`,.9),s(t+r*.36,n-r*.1,r*.065,`255,70,60`,.9)};return c(t*.47,n*.56,60),c(t*.58,n*.58,86),c(t*.37,n*.66,128),[[.2,.6,6],[.3,.56,4.2]].forEach(([e,r,i])=>{e*=t,r*=n,s(e,r,i,`255,246,225`,.9),s(e+i*5,r,i,`255,246,225`,.9)}),a}function h(e,t,r){e.globalCompositeOperation=`lighter`;for(let i of t){let t=i.r,a=i.s;if(r===`cataract`){f(e,i.x,i.y,t*12,.5*a,i.col),e.lineWidth=1.2;for(let n=0;n<8;n++){let r=n*.785,a=i.x+Math.cos(r)*t*16,o=i.y+Math.sin(r)*t*16,s=e.createLinearGradient(i.x,i.y,a,o);s.addColorStop(0,`rgba(${i.col},.45)`),s.addColorStop(1,`rgba(${i.col},0)`),e.strokeStyle=s,e.beginPath(),e.moveTo(i.x,i.y),e.lineTo(a,o),e.stroke()}}else{let o=n[r].halo;f(e,i.x,i.y,t*3,.18+.2*o,i.col),o>.3&&p(e,i.x,i.y,t*5,t*1.8,.26*o*a,i.col),o>.6&&p(e,i.x,i.y,t*8.5,t*2.4,.14*o*a,i.col)}}e.globalCompositeOperation=`source-over`}function g(e,t,n,r){e.fillStyle=`#e9e6df`,e.fillRect(0,0,t,n),e.fillStyle=`#fbfaf6`,e.fillRect(t*.12,n*.08,t*.76,n*.84),e.fillStyle=`#1d2630`;let a=i.lang===`ar`;e.textAlign=`center`,e.direction=a?`rtl`:`ltr`;let o=a?[[.5,`فحص قياس حدة الإبصار للمسافات القريبة`],[.4,`تثقيف صحة العين ورعاية الإبصار المستمرة`],[.4,`تختلف قوة التكبير المناسبة بحسب طبيعة كل عين`],[.3,`القراءة المريحة تتطلب مسافة وإضاءة معتدلة دائماً`],[.2,`الفحوصات الدورية تحفظ كفاءة التباين وصفاء الرؤية`],[.1,`رعاية متخصصة لصحة القرنية والعدسات داخل العين`],[0,`مستشفيات ومراكز مغربي للعيون والأذن · المدينة المنورة`]]:[[.5,`Standard Near Visual Acuity Reading Chart`],[.4,`Continuous Eye Health & Vision Care Guidance`],[.4,`Magnification Needs Vary by Individual Patient`],[.3,`Comfortable Reading Demands Proper Lighting`],[.2,`Periodic Comprehensive Exams Protect Clarity`],[.1,`Specialized Anterior Segment & Cataract Surgery`],[0,`Magrabi Health Eye & Ear Hospital · Madinah`]],s=n*.13;o.forEach(([n,r])=>{let i=5*10**n*u,o=a?`"IBM Plex Sans Arabic", Alexandria, sans-serif`:`Inter, sans-serif`;e.font=`500 ${i/.68}px ${o}`,e.direction=a?`rtl`:`ltr`,e.fillText(r,t*.5,s+i),e.direction=`ltr`,e.font=`500 11px Inter, sans-serif`,e.fillStyle=`#7a838c`,e.textAlign=`start`,e.fillText(`20/`+Math.round(20*10**n),t*.14,s+i),e.textAlign=`center`,e.direction=a?`rtl`:`ltr`,e.fillStyle=`#1d2630`,s+=i*1.45+6})}function _(e,t){if(!e)return;let n=e.getContext(`2d`),r=e.width,a=e.height,o=i.scene===`night`?0:i.D,s=d(c(t,o)),l=t===`cataract`;i.scene===`night`?(h(n,m(n,r,a),t),l&&(n.fillStyle=`rgba(205,190,150,.12)`,n.fillRect(0,0,r,a))):(g(n,r,a,o),l&&(n.fillStyle=`rgba(205,190,150,.18)`,n.fillRect(0,0,r,a))),e.style.filter=`blur(${s.toFixed(2)}px)`+(l?` contrast(.78) sepia(.35) brightness(.95)`:``)}function v(){let e=e=>70+-e/3.5*600,o=e=>26+e/.8*230,s=`<svg viewBox="0 0 720 300" class="vs-svg" role="img" aria-label="defocus curve">`;s+=`<rect x="70" y="${o(0)}" width="600" height="${o(.2)-o(0)}" fill="var(--vs-band)"/>`,[[0,`20/20`],[.1,`20/25`],[.2,`20/32`],[.3,`20/40`],[.5,`20/63`],[.7,`20/100`]].forEach(([e,t])=>{s+=`<line x1="70" x2="670" y1="${o(e)}" y2="${o(e)}" stroke="var(--vs-grid)"/>`,s+=`<text x="62" y="${o(e)+4}" text-anchor="end" class="vs-t">${t}</text>`}),r.forEach(([t,n,r])=>{s+=`<line x1="${e(t)}" x2="${e(t)}" y1="26" y2="256" stroke="var(--vs-grid)" stroke-dasharray="3 4"/>`,s+=`<text x="${e(t)}" y="274" text-anchor="middle" class="vs-t">\u200E${t.toFixed(1).replace(`-`,`−`)} D</text>`,s+=`<text x="${e(t)}" y="290" text-anchor="middle" class="vs-t2">${a(n,r)}</text>`});let l={monofocal:`#5b7f95`,edof:`#3f8f87`,trifocal:`#8a6a3d`,cataract:`#a35a52`};Object.keys(n).forEach(r=>{let a=r===i.lens,c=t.map((t,i)=>`${e(t)},${o(n[r].va[i])}`).join(` `);s+=`<polyline points="${c}" fill="none" stroke="${l[r]}" stroke-width="${a?3.2:1.4}" opacity="${a?1:.35}" ${r===`cataract`?`stroke-dasharray="5 4"`:``}/>`});let u=e(i.D),d=o(c(i.lens,i.D));return s+=`<line x1="${u}" x2="${u}" y1="26" y2="256" stroke="var(--vs-ink)" opacity=".5"/>`,s+=`<circle cx="${u}" cy="${d}" r="6" fill="var(--vs-surface)" stroke="var(--vs-ink)" stroke-width="2.5"/>`,s+=`</svg>`,s}function y(e){return i.lang=e,`
  <section class="section vs-section" id="simulator">
    <div class="container">
      <div class="section-header">
        <div class="section-label">${a(`أداة تثقيفية`,`Educational tool`)}</div>
        <h2>${a(`كيف قد تبدو رؤيتك بعد زراعة العدسة؟`,`How might your vision look after lens implantation?`)}</h2>
        <p>${a(`محاكاة مبنية على متوسطات دراسات منشورة لمنحنيات حدة الإبصار، وليست تنبؤاً بنتيجتك الشخصية.`,`A simulation based on averages from published defocus-curve studies, not a prediction of your personal result.`)}</p>
      </div>

      <div class="vs-card" id="vs-root">
        <div class="vs-bar">
          <div class="vs-seg" id="vs-tabs">
            <button data-tab="sim">${a(`المحاكاة`,`Simulation`)}</button>
            <button data-tab="curve">${a(`منحنى حدة الإبصار`,`Acuity curve`)}</button>
          </div>
          <div class="vs-seg" id="vs-scenes">
            <button data-scene="night">${a(`قيادة ليلاً`,`Night driving`)}</button>
            <button data-scene="read">${a(`القراءة`,`Reading`)}</button>
          </div>
          <button data-action="reset" class="btn btn-sm" style="margin-inline-start: auto; height: 34px; padding: 0 14px; font-size: 0.8rem; border-color: var(--border-subtle); color: var(--text-muted);" title="${a(`إعادة ضبط المحاكي للحالة الافتراضية`,`Reset simulator to defaults`)}">
            ${a(`إعادة ضبط ↺`,`Reset ↺`)}
          </button>
        </div>

        <div class="vs-bar vs-lens" id="vs-lens">
          ${Object.keys(n).map(e=>`<button data-lens="${e}">${a(n[e].ar,n[e].en)}</button>`).join(``)}
        </div>

        <div id="vs-sim">
          <div class="vs-view" dir="ltr">
            <canvas id="vs-b" width="960" height="480"></canvas>
            <canvas id="vs-a" width="960" height="480"></canvas>
            <input type="range" id="vs-slider" min="0" max="100" value="50" aria-label="${a(`مقارنة قبل وبعد`,`Before / after`)}">
            <div class="vs-line" id="vs-line"><span></span></div>
            <em class="vs-tag l" id="vs-tl"></em>
            <em class="vs-tag r">${a(`ساد غير معالج`,`Untreated cataract`)}</em>
          </div>
          <p class="vs-hint">${a(`اسحب الخط للمقارنة بين الساد والعدسة المختارة`,`Drag the line to compare cataract with the selected lens`)}</p>
        </div>

        <div id="vs-curve" hidden></div>

        <div class="vs-dist" id="vs-dist" role="group" aria-label="${a(`المسافة`,`Distance`)}">
          ${r.map(([e,t,n])=>`<button data-d="${e}">${a(t,n)}</button>`).join(``)}
        </div>

        <div class="vs-metrics" id="vs-metrics"></div>

        <p class="vs-note">${a(`تفترض المحاكاة عينين بقوة بصرية مستهدفة قريبة من الصفر، وإضاءة جيدة للقراءة. حدة الإبصار بالمتوسط ≤ 0.2 logMAR تُعد رؤية وظيفية. النتيجة الفعلية تعتمد على قياسات عينك وفحص الطبيب. المصادر: مراجعة منهجية BMC Ophthalmology 2019، وملخصات مؤتمر ESCRS 2024.`,`Assumes near-plano targets and good reading light. Mean acuity ≤ 0.2 logMAR is treated as functional. Your actual result depends on your own eye measurements and your surgeon’s exam. Sources: BMC Ophthalmology 2019 meta-analysis; ESCRS 2024 abstracts.`)}</p>
      </div>
    </div>
  </section>`}function b(){let e=document.getElementById(`vs-root`);if(!e)return;e.querySelectorAll(`[data-tab]`).forEach(e=>e.classList.toggle(`on`,e.dataset.tab===i.tab)),e.querySelectorAll(`[data-scene]`).forEach(e=>e.classList.toggle(`on`,e.dataset.scene===i.scene)),e.querySelectorAll(`[data-lens]`).forEach(e=>e.classList.toggle(`on`,e.dataset.lens===i.lens)),e.querySelectorAll(`[data-d]`).forEach(e=>{e.classList.toggle(`on`,+e.dataset.d===i.D),e.disabled=!1});let t=e.querySelector(`#vs-scenes`);t&&(t.hidden=i.tab!==`sim`);let r=e.querySelector(`#vs-sim`);r&&(r.hidden=i.tab!==`sim`);let o=e.querySelector(`#vs-dist`);o&&(o.hidden=i.tab!==`curve`&&i.scene!==`read`);let u=e.querySelector(`#vs-curve`);if(u&&(u.hidden=i.tab!==`curve`,i.tab===`curve`&&(u.innerHTML=v())),i.tab===`sim`){let t=e.querySelector(`#vs-a`),r=e.querySelector(`#vs-b`);_(t,i.lens),_(r,`cataract`),t&&(t.style.clipPath=`inset(0 ${100-i.pos}% 0 0)`);let o=e.querySelector(`#vs-line`);o&&(o.style.left=`${i.pos}%`);let s=e.querySelector(`#vs-tl`);s&&(s.textContent=a(n[i.lens].ar,n[i.lens].en))}let d=i.scene===`night`&&i.tab===`sim`?0:i.D,f=c(i.lens,d),p=l(i.lens),m=f<=.2,h=e.querySelector(`#vs-metrics`);h&&(h.innerHTML=`
      <div>
        <small>${a(`حدة الإبصار المتوقعة`,`Expected acuity`)}</small>
        <strong>${s(f)}</strong>
        <span>${f.toFixed(2)} logMAR</span>
      </div>
      <div>
        <small>${a(`عند هذه المسافة`,`At this distance`)}</small>
        <strong class="${m?`ok`:`warn`}">
          ${m?a(`رؤية وظيفية غالباً بدون نظارة`,`Usually functional without glasses`):a(`غالباً تلزم نظارة`,`Glasses usually needed`)}
        </strong>
      </div>
      <div>
        <small>${a(`أقرب مسافة وظيفية`,`Nearest functional distance`)}</small>
        <strong>
          ${i.lens===`cataract`?a(`لا يوجد`,`None`):p<.1?a(`البعيد فقط`,`Far only`):`${Math.round(100/p)} ${a(`سم`,`cm`)}`}
        </strong>
      </div>
      <p>${a(n[i.lens].noteAr,n[i.lens].noteEn)}</p>
    `)}function x(e){i.lang=e;let t=document.getElementById(`vs-root`);if(!t)return;t.addEventListener(`click`,e=>{let n=e.target.closest(`button`);if(n&&!n.disabled){if(n.dataset.action===`reset`){i.lens=`trifocal`,i.scene=`night`,i.D=0,i.pos=50,i.tab=`sim`;let e=t.querySelector(`#vs-slider`);e&&(e.value=50)}n.dataset.tab&&(i.tab=n.dataset.tab),n.dataset.scene&&(i.scene=n.dataset.scene),n.dataset.lens&&(i.lens=n.dataset.lens),n.dataset.d!==void 0&&(i.D=+n.dataset.d),n.dataset.scene&&i.scene===`read`&&i.D===0&&(i.D=-2.5),b()}});let n=t.querySelector(`#vs-slider`);if(n){let e=e=>{i.pos=+e.target.value,b()};n.addEventListener(`input`,e),n.addEventListener(`change`,e)}b(),document.fonts&&document.fonts.ready&&document.fonts.ready.then(b)}var S=`ar`,C=(()=>{try{return localStorage.getItem(`theme`)}catch{return null}})()||`system`,w=0,T=[],E=!1,D=null;function O(e=`theme-toggle-btn`){let t=C===`dark`||C===`system`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches;return`
  <button id="${e}" class="theme-sun-moon-toggle ${t?`is-dark`:``}" onclick="toggleTheme()" role="switch" aria-checked="${t?`true`:`false`}" aria-label="${S===`ar`?t?`الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري`:`الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي`:t?`Dark mode enabled. Click to switch to light mode`:`Light mode enabled. Click to switch to dark mode`}" title="${S===`ar`?`تبديل المظهر (ليلي / نهاري)`:`Toggle Theme (Dark / Light)`}">
    <span class="tsm-sky">
      <span class="tsm-clouds" aria-hidden="true">
        <svg viewBox="0 0 24 14" class="tsm-cloud tsm-cloud-1"><path d="M19 14H5a4 4 0 01-.8-7.9A5.5 5.5 0 0115 4a4.5 4.5 0 014 6.8 4 4 0 010 3.2z"/></svg>
        <svg viewBox="0 0 20 12" class="tsm-cloud tsm-cloud-2"><path d="M16 12H4a3.5 3.5 0 01-.7-6.9A4.5 4.5 0 0112 3a3.5 3.5 0 014 6 3.5 3.5 0 010 3z"/></svg>
      </span>
      <span class="tsm-stars" aria-hidden="true">
        <span class="tsm-star tsm-star-1">★</span>
        <span class="tsm-star tsm-star-2">✦</span>
        <span class="tsm-star tsm-star-3">★</span>
      </span>
      <span class="tsm-thumb">
        <svg class="tsm-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4.5" fill="#f59e0b" stroke="#d97706"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#f59e0b"></path>
        </svg>
        <svg class="tsm-moon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
    </span>
  </button>`}function k(e){C=e;try{localStorage.setItem(`theme`,e)}catch{}e===`system`?document.documentElement.removeAttribute(`data-theme`):document.documentElement.setAttribute(`data-theme`,e);let t=e===`dark`||e===`system`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches;document.querySelectorAll(`.theme-sun-moon-toggle`).forEach(e=>{e.classList.toggle(`is-dark`,t),e.setAttribute(`aria-checked`,t?`true`:`false`);let n=S===`ar`?t?`الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري`:`الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي`:t?`Dark mode enabled. Click to switch to light mode`:`Light mode enabled. Click to switch to dark mode`;e.setAttribute(`aria-label`,n),e.setAttribute(`title`,n)}),document.getElementById(`vs-root`)&&b()}window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,()=>{C===`system`&&k(`system`)}),window.toggleTheme=function(){k(C===`dark`||C===`system`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches?`light`:`dark`)},window.cycleTheme=window.toggleTheme;function A(t){let n=encodeURIComponent(t||(S===`ar`?`مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن عبدالله البري في مستشفى مغربي المدينة المنورة.`:`Hello, I would like to inquire about booking a consultation with Dr. Maan Al Barry at Magrabi Madinah.`));return`https://wa.me/${e.whatsapp}?text=${n}`}function j(){return`
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="#home" class="header-logo" onclick="scrollToSection('home');return false;">
        <div class="logo-icon">م</div>
        <div class="logo-text">
          <strong>${S===`ar`?e.shortNameAr:e.shortNameEn}</strong>
          <small>${S===`ar`?`استشاري طب وجراحة العيون`:`Consultant Ophthalmologist`}</small>
        </div>
      </a>

      <nav class="header-nav">
        <div class="nav-links">
          <a href="#home" onclick="scrollToSection('home');return false;">${S===`ar`?`الرئيسية`:`Home`}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${S===`ar`?`عن الدكتور`:`Biography`}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`التخصصات`:`Specialties`}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${S===`ar`?`محاكي الرؤية`:`Simulator`}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${S===`ar`?`دليل العدسات`:`IOL Guide`}</a>
          <a href="#education" onclick="scrollToSection('education');return false;">${S===`ar`?`المكتبة الطبية`:`Education`}</a>
          <a href="#clinic" onclick="scrollToSection('clinic');return false;">${S===`ar`?`العيادة والحجز`:`Clinic`}</a>
        </div>

        <div class="header-actions">
          ${O(`theme-toggle-btn`)}
          <button class="lang-switch" onclick="toggleLang()" aria-label="Switch Language">${S===`ar`?`English`:`عربي`}</button>
          <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${S===`ar`?`احجز موعداً`:`Book Appointment`}
          </a>
        </div>

        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open Navigation">☰</button>
      </nav>
    </div>

    <!-- Mobile Drawer -->
    <nav class="mobile-nav" id="mobile-nav">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px 14px;border-bottom:1px solid var(--border-subtle);margin-bottom:6px;">
        <span style="font-size:0.88rem;font-weight:600;color:var(--text-primary);">${S===`ar`?`مظهر الموقع`:`Appearance`}</span>
        ${O(`theme-toggle-btn-mobile`)}
      </div>
      <a href="#home" onclick="scrollToSection('home');closeMobileMenu();return false;">${S===`ar`?`الرئيسية`:`Home`}</a>
      <a href="#profile" onclick="scrollToSection('profile');closeMobileMenu();return false;">${S===`ar`?`عن الدكتور والمسيرة`:`Biography`}</a>
      <a href="#specialties" onclick="scrollToSection('specialties');closeMobileMenu();return false;">${S===`ar`?`التخصصات والخدمات`:`Specialties`}</a>
      <a href="#simulator" onclick="scrollToSection('simulator');closeMobileMenu();return false;">${S===`ar`?`محاكي الرؤية التفاعلي`:`Vision Simulator`}</a>
      <a href="#cataracts" onclick="scrollToSection('cataracts');closeMobileMenu();return false;">${S===`ar`?`دليل العدسات (IOLs)`:`IOL Guide`}</a>
      <a href="#questionnaire" onclick="scrollToSection('questionnaire');closeMobileMenu();return false;">${S===`ar`?`استبيان نمط الحياة البصري`:`Questionnaire`}</a>
      <a href="#education" onclick="scrollToSection('education');closeMobileMenu();return false;">${S===`ar`?`المكتبة الطبية والتثقيف`:`Medical Library`}</a>
      <a href="#clinic" onclick="scrollToSection('clinic');closeMobileMenu();return false;">${S===`ar`?`العيادة والحجز والموقع`:`Clinic & Booking`}</a>
      <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer">${S===`ar`?`موقع المستشفى (خرائط جوجل)`:`Hospital Google Maps`}</a>
    </nav>
  </header>`}function M(){return`
  <section class="hero" id="home">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content fade-in">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            ${S===`ar`?`استشاري معتمد | خبرة سريرية وأكاديمية متقدمة | المدينة المنورة`:`Consultant Ophthalmologist | Madinah, Saudi Arabia`}
          </div>

          <h1>
            ${S===`ar`?`رعاية متخصصة لصحة العين<br><span class="gold-text">ورؤية أوضح وأكثر دقة</span>`:`Specialized Eye Care &amp;<br><span class="gold-text">Precision Cataract Surgery</span>`}
          </h1>

          <p class="hero-subtitle">
            ${S===`ar`?`استشاري طب وجراحة العيون، جراحة الساد (الماء الأبيض)، وزراعة العدسات الذكية، وتصحيح العيوب الانكسارية بالمدينة المنورة. خبرة أكاديمية وسريرية موثقة ترتكز على أحدث التقنيات وأعلى معايير الأمان الجراحي.`:`Senior consultant specializing in micro-incision cataract surgery, premium IOL implantation, laser refractive correction, and corneal preservation at Magrabi Health Madinah.`}
          </p>

          <div class="hero-cta">
            <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg btn-arrow-fill" id="hero-primary-cta">
              <span class="btn-fill-effect" aria-hidden="true"></span>
              <span class="btn-label">${S===`ar`?`احجز موعد كشف أو استشارة`:`Book Clinic Appointment`}</span>
              <span class="btn-arrow-wrap" aria-hidden="true">
                <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </a>
            <a href="#simulator" onclick="scrollToSection('simulator');return false;" class="btn btn-outline btn-lg btn-gradient-shimmer" id="hero-secondary-cta">
              <span class="btn-shimmer-border" aria-hidden="true"></span>
              <span class="btn-shimmer-body">
                <span class="btn-label">${S===`ar`?`جرب محاكي الرؤية التفاعلي`:`Try Vision Simulator`}</span>
                <span class="btn-sparkle" aria-hidden="true">✦</span>
              </span>
            </a>
            <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px;">
              <span>${S===`ar`?`مستشفيات مغربي – المدينة المنورة`:`Magrabi Hospital – Madinah`}</span>
            </a>
          </div>

          <div class="hero-credentials">
            <div class="credential-item">
              <span class="icon">🏥</span>
              <span>${S===`ar`?`المدير الطبي لمغربي المدينة`:`CMO Magrabi Madinah`}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🎓</span>
              <span>${S===`ar`?`رئيس قسم العيون بجامعة طيبة`:`Chair of Ophthalmology, Taibah Univ.`}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🇬🇧</span>
              <span>${S===`ar`?`زميل كلية الجراحين الملكية (FRCS)`:`Fellow of Royal College of Surgeons (FRCS)`}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🇸🇦</span>
              <span>${S===`ar`?`ممثل الجمعية السعودية لطب العيون`:`SOS Madinah Representative`}</span>
            </div>
          </div>
        </div>

        <div class="hero-image fade-in">
          <img src="./images/dr-maan-portrait.png" alt="${S===`ar`?e.nameAr:e.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='./images/doctor-portrait.jpg'">
          <div class="image-accent">
            <div class="accent-title">${S===`ar`?`العيادة التخصصية`:`Clinical Practice`}</div>
            <div class="accent-value">${S===`ar`?`مغربي — طريق المطار`:`Magrabi — Airport Road`}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`}function N(){let t=e.roles[S];return`
  <section class="section section-alt" id="profile">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`السيرة المهنية والأكاديمية`:`Professional Profile`}</div>
        <h2>${S===`ar`?e.nameAr:e.nameEn}</h2>
        <p style="font-weight:600;color:var(--secondary-burgundy);">${S===`ar`?e.titleAr:e.titleEn}</p>
      </div>

      <div class="profile-grid fade-in">
        <div class="profile-media">
          <img src="./images/doctor-portrait.jpg" alt="${e.nameAr}" class="profile-media-img" loading="lazy">
          <div class="credentials-chips">
            <span class="chip chip-gold">${S===`ar`?`زميل كلية الجراحين الملكية – بريطانيا (FRCS)`:`Fellow of Royal College of Surgeons (FRCS UK)`}</span>
            <span class="chip">${S===`ar`?`رئيس قسم طب وجراحة العيون – جامعة طيبة`:`Chair of Ophthalmology – Taibah University`}</span>
            <span class="chip">${S===`ar`?`المدير الطبي التنفيذي – مغربي المدينة`:`Executive Medical Director – Magrabi Madinah`}</span>
            <span class="chip">🇸🇦 ${S===`ar`?`ممثل الجمعية السعودية لطب وجراحة العيون`:`Saudi Ophthalmology Society Rep.`}</span>
          </div>
        </div>

        <div class="profile-text">
          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-primary);margin-bottom:var(--space-4);">
            ${S===`ar`?`د. معن بن عبدالله البري استشاري طب وجراحة العيون في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة. يعمل ضمن وحدة جراحة الماء الأبيض ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة متناهية في فحص عدسة العين، تشخيص القرنية المخروطية، وتحديد خيارات تصحيح الإبصار بالليزر أو زراعة العدسات.`:`Dr. Maan Al Barry is a Consultant Ophthalmologist and Anterior Segment Surgeon practicing at Magrabi Health Eye & ENT Hospital in Madinah. He provides specialized clinical care in cataract micro-surgery, corneal disease management, and customized laser refractive procedures.`}
          </p>

          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-secondary);margin-bottom:var(--space-6);">
            ${S===`ar`?`تتكامل ممارسته السريرية مع أدوار قيادية وأكاديمية بارزة؛ حيث يشغل منصب المدير الطبي التنفيذي لمغربي المدينة المنورة، ورئيس قسم طب وجراحة العيون في جامعة طيبة، وممثل الجمعية السعودية لطب وجراحة العيون في منطقة المدينة المنورة، وعضو المجلس العلمي لمؤتمر البحر الأحمر لطب العيون.`:`His clinical mastery is backed by distinguished academic appointments as Chairman of the Ophthalmology Department at Taibah University, Chief Medical Officer at Magrabi Madinah, and active member of the American Academy of Ophthalmology.`}
          </p>

          <h3 style="margin-bottom:var(--space-4);font-size:1.15rem;color:var(--secondary-burgundy);">
            ${S===`ar`?`المسيرة القيادية والمهنية`:`Leadership & Scientific Appointments`}
          </h3>
          <div class="timeline">
            ${t.map(e=>`
              <div class="timeline-item">
                <h4>${e}</h4>
              </div>
            `).join(``)}
          </div>
        </div>
      </div>

      <!-- Scientific participation & Conferences -->
      <div class="sci-head fade-in">
        <h3>${S===`ar`?`المشاركات العلمية والمؤتمرات الدولية`:`Scientific Participation & Conferences`}</h3>
        <p>${S===`ar`?`حضور وتمثيل علمي في مؤتمرات طب العيون`:`Representing ophthalmology at national and international meetings`}</p>
      </div>
      <div class="sci-grid fade-in">
        <figure class="sci-fig">
          <img src="./images/dr-maan-redsea.jpg" alt="${S===`ar`?`د. معن البري في مؤتمر البحر الأحمر لطب العيون 2024`:`Dr. Maan Al Barry at Saudi Ophthalmology 2024, The Red Sea`}" style="object-position:50% 22%" loading="lazy">
          <figcaption><strong>${S===`ar`?`مؤتمر البحر الأحمر لطب وجراحة العيون 2024`:`Saudi Ophthalmology 2024 — The Red Sea`}</strong><span>${S===`ar`?`عضو المجلس العلمي للمؤتمر`:`Scientific Council Member`}</span></figcaption>
        </figure>
        <figure class="sci-fig">
          <img src="./images/dr-maan-faculty.jpg" alt="${S===`ar`?`مع نخبة من أطباء العيون في الجلسات العلمية`:`With fellow faculty at the scientific sessions`}" style="object-position:50% 100%" loading="lazy">
          <figcaption><strong>${S===`ar`?`الجلسات العلمية الدولية`:`International scientific sessions`}</strong><span>${S===`ar`?`مع نخبة من أطباء وجراحي العيون`:`With ophthalmic surgeons and faculty`}</span></figcaption>
        </figure>
      </div>

      <!-- Verified Patient Reviews -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${S===`ar`?`آراء وتجارب المرضى`:`Patient Testimonials`}</div>
          <h3 style="font-size:1.35rem;">${S===`ar`?`تجارب المراجعين في مغربي المدينة المنورة`:`Reviews from Magrabi Health Madinah`}</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-top:6px;max-width:620px;margin-inline:auto;">
            ${S===`ar`?`ملاحظة سريرية: تجارب وشهادات استرشادية منقولة من مراجعي منصات التقييم العامة لمستشفيات مغربي، وتخضع للمراجعة والتأكيد النهائي من الطبيب.`:`Clinical note: Illustrative feedback compiled from public review platforms for Magrabi Health, pending final administrative confirmation by the clinic owner.`}
          </p>
        </div>
        <div class="reviews-grid">
          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${S===`ar`?`كانت تجربة ممتازة بكل المقاييس. استغرق موعدي قرابة ساعة، أجريت خلالها الفحوصات الدقيقة ثم قابلت الدكتور معن البري، الذي شرح لي تفاصيل الإجراء وأي مضاعفات محتملة بكل أمانة ووضوح ومهنية عالية.`:`An outstanding experience by all measures. I completed thorough diagnostics before meeting Dr. Maan Al Barry, who explained the procedure and potential nuances with utmost clarity and professional integrity.`}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">ر</div>
              <div class="review-meta">
                <strong>${S===`ar`?`راكان العبري`:`Rakan Al-Abri`}</strong>
                <span>${S===`ar`?`مريض تم علاجه بمغربي المدينة المنورة`:`Patient at Magrabi Madinah`}</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${S===`ar`?`أود أن أشكر فريق د. معن البري على حسن الاستقبال والتعامل الراقي والمعاملة المريحة، والاهتمام الفائق بتنظيم المواعيد والإجابة عن كافة التساؤلات بابتسامة وترحاب.`:`I would like to extend heartfelt thanks to Dr. Maan Al Barry and his clinical team for their wonderful hospitality, comfortable care, and seamless appointment coordination.`}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">م</div>
              <div class="review-meta">
                <strong>${S===`ar`?`مايا أحمد`:`Maya Ahmed`}</strong>
                <span>${S===`ar`?`مراجعة عيادة العيون والقرنية`:`Cornea & Vision Correction Patient`}</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${S===`ar`?`أعرب عن خالص امتناني للدكتور معن البري على مهنيته الاستثنائية، وخبرته الواسعة، وتوجيهه اللطيف والمهدئ طوال مراحل العملية، والاهتمام الدقيق بالمتابعة بعد الإجراء.`:`My deepest gratitude to Dr. Maan for his exceptional surgical precision, vast expertise, and gentle guidance throughout the entire procedure and post-op follow-up.`}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">ب</div>
              <div class="review-meta">
                <strong>${S===`ar`?`بشرى الشراحيلي`:`Bushra Al-Sharahili`}</strong>
                <span>${S===`ar`?`مريضة جراحة عيون`:`Ophthalmic Surgery Patient`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`}function P(){return`
  <section class="section" id="specialties">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`التخصصات الطبية والخدمات الجراحية الدقيقة`:`Precision Clinical Specialties`}</div>
        <h2>${S===`ar`?`حلول جراحية وعلاجية بأحدث ما توصل إليه علم العيون`:`Advanced Ophthalmic Medical & Surgical Solutions`}</h2>
        <p>${S===`ar`?`إجراءات جراحية وتشخيصية متقدمة تُجرى وفق بروتوكولات عالمية معتمدة لضمان أمان ودقة النتائج.`:`State-of-the-art diagnostics and surgeries performed according to international clinical quality benchmarks.`}</p>
      </div>

      <div class="specialties-grid fade-in">
        ${[{code:`SURG-01`,titleAr:`جراحة الماء الأبيض (الساد) وزراعة العدسات الذكية`,titleEn:`Cataract Surgery & Premium IOL Implantation`,descAr:`استبدال العدسة المعتمة بالموجات فوق الصوتية (الفاكو) وزراعة أحدث العدسات الذكية: أحادية البؤرة، ممتدة المدى البصري (EDOF)، والعدسات ثلاثية البؤرة لاستعادة صفاء الرؤية.`,descEn:`Micro-incision phacoemulsification for lens replacement with advanced monofocal, EDOF, and trifocal intraocular lenses.`,img:`./images/surgery-phaco.jpg`,tagsAr:[`إزالة الساد بالفاكو`,`تصحيح الاستجماتيزم`,`العدسات التوريكية`,`عدسات ثلاثية EDOF`],tagsEn:[`Phacoemulsification`,`Astigmatism Correction`,`Toric IOLs`,`Trifocal / EDOF Optics`]},{code:`SURG-02`,titleAr:`جراحة وأمراض القرنية والقرنية المخروطية المتقدمة`,titleEn:`Cornea Care & Advanced Keratoconus Treatment`,descAr:`التشخيص المبكر والدقيق للقرنية المخروطية وتثبيت القرنية بالأشعة فوق البنفسجية والريبوفلافين (Corneal Cross-Linking - CXL)، مع خطط متابعة مستمرة لحفظ النظر.`,descEn:`Early keratoconus detection, corneal collagen cross-linking (CXL) to arrest progression, and specialized anterior segment management.`,img:`./images/cornea-cxl.jpg`,tagsAr:[`تثبيت القرنية CXL`,`سماكة القرنية الطبقية`,`علاج سحابات القرنية`,`جفاف العين المزمن`],tagsEn:[`Corneal Cross-Linking (CXL)`,`Pachymetry Tomography`,`Corneal Opacities`,`Ocular Surface Disease`]},{code:`SURG-03`,titleAr:`عمليات تصحيح النظر بالليزر والفيمتو ليزك`,titleEn:`Laser Refractive Surgery (Femto-LASIK & PRK)`,descAr:`معاينة وفحص دقيق لقصر وطول النظر والاستجماتيزم باستخدام تقنيات الفيمتوليزك، والليزر السطحي (PRK)، وبصمة العين المخصصة (Custom Wavefront) لتحقيق أقصى حدة بصرية.`,descEn:`Comprehensive suitability evaluation for Femto-LASIK and surface ablation (PRK) driven by customized wavefront topography.`,img:`./images/clinic-exam-room.jpg`,tagsAr:[`فحص سماكة القرنية`,`الليزر السطحي PRK`,`الفيمتو ليزك`,`بصمة العين Wavefront`],tagsEn:[`Pachymetry Check`,`Surface PRK`,`Femto-LASIK`,`Wavefront Custom`]},{code:`DIAG-04`,titleAr:`الفحوصات التشخيصية المتقدمة وقياسات ما قبل الجراحة`,titleEn:`Advanced Diagnostics & Optical Biometry`,descAr:`التصوير المقطعي للقرنية (Pentacam)، فحص خلايا البطانة القرنية (Specular Microscopy)، وقياس قوة العدسة الدقيق ضوئياً (Optical Biometry) بأحدث أجهزة التصوير ثلاثية الأبعاد.`,descEn:`High-precision Scheimpflug corneal tomography (Pentacam), specular endothelial microscopy, and optical biometry for exact surgical planning.`,img:`./images/diagnostics-pentacam.jpg`,tagsAr:[`طبوغرافيا البنتاكام`,`قياس ضغط العين`,`مسح العصب البصري`,`حساب العدسات بالبيومتري`],tagsEn:[`Pentacam Tomography`,`Intraocular Pressure`,`OCT Macula & Nerve`,`Optical Biometry IOL Master`]}].map(t=>`
          <div class="specialty-unit-card">
            <div class="specialty-img-wrap">
              <img src="${t.img}" alt="${S===`ar`?t.titleAr:t.titleEn}" loading="lazy">
            </div>
            <div class="specialty-body">
              <div class="specialty-tag">${t.code}</div>
              <h3>${S===`ar`?t.titleAr:t.titleEn}</h3>
              <p>${S===`ar`?t.descAr:t.descEn}</p>
              <div class="specialty-features">
                ${(S===`ar`?t.tagsAr:t.tagsEn).map(e=>`<span class="specialty-pill">${e}</span>`).join(``)}
              </div>
              <div style="margin-top:auto;padding-top:var(--space-3);">
                <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                  ${S===`ar`?`طلب تقرير تشخيصي أو حجز موعد ←`:`Book Specialty Evaluation →`}
                </a>
              </div>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  </section>`}function F(){let e=S===`ar`,t=[{n:e?`ثلاثية البؤرة`:`Trifocal`,sub:e?`للاستغناء عن النظارة قدر الإمكان`:`For maximum spectacle independence`,d:[4,e?`ممتازة`:`Excellent`],m:[4,e?`جيدة جداً`:`Very good`],nr:[4,e?`جيدة غالباً بدون نظارة`:`Good, often without glasses`],h:[3,e?`أكثر شيوعاً، وتخف غالباً مع التكيف العصبي`:`More common; often fade with neuroadaptation`],g:e?`قليلة لدى أغلب المرضى، وتختلف من حالة لأخرى`:`Uncommon for most patients; varies`},{n:e?`ممتدة المدى (EDOF)`:`Extended depth of focus (EDOF)`,sub:e?`للقيادة الليلية والعمل على الشاشات`:`For night driving and screen work`,d:[4,e?`ممتازة`:`Excellent`],m:[4,e?`جيدة جداً`:`Very good`],nr:[2,e?`محدودة للخط الدقيق`:`Limited for fine print`],h:[2,e?`أقل من الثلاثية، وأكثر من الأحادية`:`Fewer than trifocal, more than monofocal`],g:e?`غالباً للقراءة الدقيقة فقط`:`Mostly for fine reading only`},{n:e?`أحادية البؤرة`:`Monofocal`,sub:e?`لأعلى نقاء للبعيد مع نظارة للقريب`:`Sharpest distance, glasses for near`,d:[4,e?`ممتازة`:`Excellent`],m:[2,e?`تحتاج نظارة غالباً`:`Glasses usually needed`],nr:[1,e?`تحتاج نظارة قراءة`:`Reading glasses needed`],h:[1,e?`الأقل بين الأنواع`:`Lowest of the three`],g:e?`دائمة للقراءة والكمبيوتر`:`Permanent for reading and computer`}],n=(e,t)=>`
    <span class="pips ${t}" role="img" aria-label="${e}/4">
      ${[1,2,3,4].map(t=>`<i class="${t<=e?`on`:``}"></i>`).join(``)}
    </span>
  `,r=(e,t,r)=>`
    <div class="iol-row">
      <b>${e}</b>
      ${n(t[0],r)}
      <small>${t[1]}</small>
    </div>
  `;return`
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${e?`دليل اختيار العدسة`:`Lens selection guide`}</div>
        <h2>${e?`مقارنة العدسات الشائعة داخل العين`:`Comparing common intraocular lenses`}</h2>
        <p>${e?`ملخص مبسّط للفروق بين الأنواع الثلاثة لمساعدتك على الحوار مع طبيبك.`:`A simple summary of the three main types, to support your conversation with your surgeon.`}</p>
      </div>

      <div class="iol-grid fade-in">
        ${t.map(t=>`
          <article class="iol-card">
            <header>
              <h3>${t.n}</h3>
              <p>${t.sub}</p>
            </header>
            ${r(e?`الرؤية البعيدة`:`Distance`,t.d,`good`)}
            ${r(e?`المتوسطة (الكمبيوتر)`:`Intermediate (computer)`,t.m,`good`)}
            ${r(e?`القريبة (القراءة)`:`Near (reading)`,t.nr,`good`)}
            ${r(e?`الهالات الليلية`:`Night halos`,t.h,`more`)}
            <div class="iol-foot">
              <b>${e?`الحاجة للنظارة:`:`Glasses:`}</b> ${t.g}
            </div>
          </article>
        `).join(``)}
      </div>

      <p class="iol-legend fade-in">
        <span>${e?`الأخضر: كلما زادت الدرجات كان الأداء أفضل`:`Green: more bars means better performance`}</span>
        <span>${e?`البرتقالي: كلما زادت الدرجات زاد تكرار الهالات`:`Amber: more bars means more frequent halos`}</span>
      </p>

      <div class="medical-disclaimer fade-in">
        <strong>${e?`تنبيه سريري:`:`Clinical Note:`}</strong>
        ${e?`لا توجد عدسة هي الأفضل للجميع. يعتمد الاختيار على فحص القرنية والشبكية وقياسات العين ونمط حياتك، ويحدده الطبيب بعد الفحص.`:`No single lens is best for everyone. The choice depends on your corneal and retinal exam, eye measurements and lifestyle, and is made with your surgeon after examination.`}
      </div>
    </div>
  </section>`}function I(){let t={ar:{steps:[{question:`ما هي فئتك العمرية التقريبية؟`,desc:`تساعد لمعرفة درجة التكيف العصبي الطبيعي وجفاف العين الفسيولوجي.`,options:[`أقل من 45 سنة`,`45 إلى 58 سنة`,`59 إلى 70 سنة`,`أكثر من 70 سنة`,`لست متأكداً`]},{question:`هل تم تشخيصك سابقاً بأي من حالات العين التالية؟`,desc:`بعض حالات الشبكية وارتفاع ضغط العين تتطلب اختيار عدسات تحافظ على أعلى حساسية للتباين.`,options:[`لا توجد حالات سابقة معتمدة (سليمة)`,`ارتفاع ضغط العين أو ماء أزرق (Glaucoma)`,`اعتلال بمركز الإبصار أو السكري بالشبكية`,`قرنية مخروطية أو جفاف عين مزمن`,`لست متأكداً تماماً (أرغب بفحص شامل)`]},{question:`ما هي الأولوية البصرية الأهم في نمط حياتك اليومي؟`,desc:`تساعد على تحديد النطاق البصري الأكثر استخداماً خلال يومك.`,options:[`القيادة الليلية ورؤية المسافات البعيدة بوضوح ودون هالات`,`العمل المكتبي، شاشات الحاسوب، ولوحة قيادة السيارة (مسافة ممتدة)`,`قراءة المصحف الشريف والهاتف الذكي دون نظارة`,`الاستقلالية التامة بنسبة 95%+ عن النظارات في كافة الظروف`]},{question:`هل سبق لك إجراء عملية ليزك أو تصحيح نظر سابق؟`,desc:`العيون التي خضعت لعمليات سابقة تحتاج معادلات حسابية خاصة (Barrett True-K).`,options:[`لم أجرِ أي عملية سابقة (قرنية طبيعية)`,`نعم، أجريت فيمتو ليزك أو ليزر سطحي PRK`,`نعم، خضعت لتثبيت قرنية مخروطية CXL`,`لست متأكداً من التاريخ الجراحي الدقيق`]}]},en:{steps:[{question:`What is your approximate age group?`,desc:`Guides expectations regarding neuroadaptation and ocular surface status.`,options:[`Under 45 years`,`45 to 58 years`,`59 to 70 years`,`Over 70 years`,`Not certain`]},{question:`Do you have any previously diagnosed ocular conditions?`,desc:`Conditions such as glaucoma or maculopathy influence lens optical platform selection.`,options:[`No diagnosed conditions (Healthy Eyes)`,`Glaucoma or elevated eye pressure`,`Diabetic retinopathy or macular condition`,`Keratoconus or severe chronic dry eye`,`Not certain (Require complete exam)`]},{question:`What is your primary visual priority in daily routine?`,desc:`Defines your most critical working visual focal distance.`,options:[`Night driving and high contrast distance clarity with zero halos`,`Computer work, laptops, and dashboard view (Intermediate continuous)`,`Smartphone use and book reading without reading glasses`,`Maximum spectacle independence (95%+) in all everyday scenarios`]},{question:`Have you undergone previous laser refractive surgery (LASIK / PRK)?`,desc:`Post-refractive eyes require specialized biometric calculations (e.g., Barrett True-K).`,options:[`No previous surgery (Virgin Cornea)`,`Yes, prior Femto-LASIK or PRK`,`Yes, prior corneal cross-linking (CXL)`,`Not certain of surgical history`]}]}}[S];if(E)return`
    <section class="section" id="questionnaire">
      <div class="container">
        <div class="section-header fade-in">
          <div class="section-label">${S===`ar`?`تقرير نمط الحياة البصري الاسترشادي`:`Visual Lifestyle Report`}</div>
          <h2>${S===`ar`?`النقاط المقترحة لمناقشتها مع الدكتور معن البري`:`Discussion Points for Your Ophthalmic Consultation`}</h2>
        </div>
        <div class="questionnaire fade-in">
          <div class="q-result">
            <h3 style="color:var(--secondary-burgundy);margin-bottom:var(--space-3);">
              ${S===`ar`?`تم تجهيز ملخص أولوياتك البصرية`:`Your Discussion Summary is Ready`}
            </h3>
            <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:var(--space-6);">
              ${S===`ar`?`بناءً على إجاباتك الأربع، هذه المحاور العلمية التي يوصى بطرحها ومناقشتها خلال جلستك في عيادة مغربي بالمدينة المنورة:`:`Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:`}
            </p>

            <div class="q-result-item">
              <h4>${S===`ar`?`الأولوية الوظيفية المستهدفة`:`Target Visual Focus`}</h4>
              <p>${S===`ar`?`مناقشة موازنة الرؤية بين عدسات EDOF (للقيادة والشاشات مع انعدام الهالات) أو عدسات Trifocal (للقراءة بدون نظارات مع فترة تكيف عصبي).`:`Evaluate EDOF for pure night contrast vs Trifocals for complete spectacle independence with neuroadaptation.`}</p>
            </div>

            <div class="q-result-item">
              <h4>${S===`ar`?`الفحوصات الطبوغرافية الموصى بها`:`Required Diagnostic Profiling`}</h4>
              <p>${S===`ar`?`إجراء فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.`:`Perform Pentacam Scheimpflug tomography to evaluate regular vs irregular astigmatism before premium IOL selection.`}</p>
            </div>

            <div class="q-result-item">
              <h4>${S===`ar`?`تحديد الخيار الجراحي النهائي`:`Final Surgical Confirmation`}</h4>
              <p>${S===`ar`?`يتم اتخاذ القرار النهائي بناءً على قياسات طول العين بالموجات الضوئية (IOL Master) وفحص قاع العين المباشر مع الدكتور.`:`Target lens power is calculated using optical biometry paired with thorough clinical examination by Dr. Maan.`}</p>
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
              <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                ${S===`ar`?`حجز موعد فحص القرنية والعدسات`:`Book Exam Appointment`}
              </a>
              <a href="${A(`مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                ${S===`ar`?`تنسيق الموعد عبر واتساب`:`Inquire via WhatsApp`}
              </a>
              <button class="btn btn-outline" onclick="restartQ()">
                ${S===`ar`?`إعادة الاستبيان`:`Restart`}
              </button>
            </div>

            <div class="medical-disclaimer" style="margin-top:var(--space-6);text-align:start;">
              <strong>${S===`ar`?`تنبيه سريري:`:`Clinical Safety Notice:`}</strong>
              ${S===`ar`?`هذا التقرير استرشادي وتثقيفي فقط ولا يمثل تشخيصاً طبياً أو وصفة ملزمة لنوع عدسة. القرار الطبي يتخذه الاستشاري حصراً بعد الفحص المجهري المباشر.`:`This summary is for educational discussion only and does not constitute a prescription. Clinical diagnosis and treatment decisions are made exclusively following in-person examination.`}
            </div>
          </div>
        </div>
      </div>
    </section>`;let n=t.steps[w];return`
  <section class="section" id="questionnaire">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`استبيان نمط الحياة البصري`:`Visual Lifestyle Questionnaire`}</div>
        <h2>${S===`ar`?`4 خطوات لاكتشاف خيارات العدسة الأنسب لك`:`4 Guided Steps to Identify Your Visual Needs`}</h2>
        <p>${S===`ar`?`أداة تثقيفية لمساعدتك في تحديد أولوياتك اليومية قبل جلسة الفحص والاستشارة في العيادة.`:`A guided tool to map your daily priorities before your comprehensive clinical consultation.`}</p>
      </div>

      <div class="questionnaire fade-in">
        <div class="q-progress">
          ${t.steps.map((e,t)=>`
            <div class="step ${t<w?`done`:``} ${t===w?`current`:``}"></div>
          `).join(``)}
        </div>

        <div style="margin-bottom:var(--space-4);">
          <span style="font-size:0.78rem;font-weight:700;color:var(--gold);text-transform:uppercase;">
            ${S===`ar`?`الخطوة ${w+1} من 4`:`Step ${w+1} of 4`}
          </span>
          <h3 style="font-size:1.25rem;color:var(--text-primary);margin-top:4px;">${n.question}</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">${n.desc}</p>
        </div>

        <div class="q-options">
          ${n.options.map((e,t)=>`
            <button class="q-option ${T[w]===t?`selected`:``}" onclick="selectQOption(${t})">
              <span>${e}</span>
            </button>
          `).join(``)}
        </div>

        <div class="q-nav">
          ${w>0?`<button class="btn btn-outline btn-sm" onclick="prevQStep()">${S===`ar`?`السابق`:`Previous`}</button>`:`<div></div>`}
          <button class="btn btn-primary btn-sm" onclick="nextQStep()" ${T[w]===void 0?`disabled style="opacity:0.5;cursor:not-allowed;"`:``}>
            ${w<t.steps.length-1?S===`ar`?`التالي ←`:`Next →`:S===`ar`?`عرض التقرير الاسترشادي`:`View Lifestyle Summary`}
          </button>
        </div>
      </div>
    </div>
  </section>`}function L(){return`
  <section class="section section-alt" id="education">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`المكتبة الطبية والتثقيف السريري`:`Medical Library & Patient Education`}</div>
        <h2>${S===`ar`?`إرشادات طبية موثقة لصحة عينيك`:`Evidence-Based Eye Health Guidance`}</h2>
        <p>${S===`ar`?`مقالات وأدلة سريرية محكمة أعدت بإشراف الدكتور معن البري لتزويدك بالحقائق الطبية الدقيقة.`:`Peer-reviewed guides developed under Dr. Maan Al Barry’s clinical oversight.`}</p>
      </div>

      <div class="article-accordion fade-in">
        ${[{id:`cataract-guide`,titleAr:`ما هي المياه البيضاء (الساد) ومتى تصبح الجراحة ضرورية؟`,titleEn:`What is a Cataract and When is Surgery Indicated?`,contentAr:`
        <h4>ما هو إعتام عدسة العين؟</h4>
        <p>المياه البيضاء ليست غشاءً ينمو فوق سطح العين، بل هي عتامة تدريجية في العدسة الطبيعية الشفافة الموجودة داخل العين خلف بؤبؤ العين. تؤدي هذه العتامة إلى تشتت الضوء الداخل إلى الشبكية، مما يسبب ضبابية الرؤية، بهتان الألوان، وصعوبة القيادة ليلاً بسبب الوهج.</p>
        <h4>متى ينبغي إجراء العملية؟</h4>
        <p>لا تتطلب المياه البيضاء الجراحة فور اكتشافها إلا إذا كانت تسبب مضاعفات نادرة كارتفاع ضغط العين. المعيار الأساسي هو مدى تأثير ضعف النظر على أنشطتك اليومية مثل القراءة، قيادة السيارة، أو التعرف على وجوه الأشخاص.</p>
        <h4>كيف تُجرى الجراحة الحديثة؟</h4>
        <p>تُجرى عملية الفاكو (Phacoemulsification) عبر فتحة ميكروسكوبية لا تتجاوز 2.2 ملم، حيث يتم تفتيت العدسة المعتمة بالموجات فوق الصوتية وشفطها، ثم زراعة عدسة صناعية قابلة للطي مكانها تحت تخدير موضعي بقطرات ودون الحاجة لغرز جراحية في الغالبية العظمى من الحالات.</p>
      `,contentEn:`
        <h4>Understanding Cataracts</h4>
        <p>A cataract is not a film over the eye, but rather a gradual clouding of the natural crystalline lens inside the eye. This clouding scatters light entering the retina, producing blurred vision, washed-out colors, and glare around light sources at night.</p>
        <h4>When Should Surgery Be Performed?</h4>
        <p>Cataract surgery is rarely urgent. The guiding criterion is whether reduced visual acuity interferes with your regular daily activities, such as driving, reading, working on screens, or personal safety.</p>
        <h4>Modern Phacoemulsification</h4>
        <p>Surgery is performed through a micro-incision (~2.2 mm). Ultrasound gently breaks up the clouded lens, which is aspirated, and an artificial intraocular lens (IOL) is implanted under topical drop anesthesia with no stitches required in most cases.</p>
      `},{id:`keratoconus-guide`,titleAr:`القرنية المخروطية: الأعراض، التشخيص، وخيارات التثبيت (CXL)`,titleEn:`Keratoconus: Diagnosis, Progression, and Corneal Cross-Linking (CXL)`,contentAr:`
        <h4>ما هي القرنية المخروطية؟</h4>
        <p>القرنية هي النافذة الشفافة الأمامية للعين. في القرنية المخروطية، يضعف النسيج الضام وتبرز القرنية تدريجياً لتأخذ شكلاً مخروطياً، مما يؤدي إلى استجماتيزم غير منتظم وتدهور سريع في قياسات النظارة خاصة لدى فئة الشباب والمراهقين.</p>
        <h4>أهمية التشخيص المبكر وتصوير تضاريس القرنية (Pentacam)</h4>
        <p>يساعد التصوير الطبقي للقرنية في اكتشاف المرض قبل ظهور أي علامات واضحة بالفحص العادي. يُنصح كل من يلاحظ تغيراً متكرراً في مقاس النظارة أو فركاً مزمناً في العين بإجراء هذا الفحص.</p>
        <h4>عملية تثبيت القرنية بالكولاجين (CXL)</h4>
        <p>إجراء علاجي يهدف إلى تقوية الروابط بين ألياف القرنية باستخدام قطرات فيتامين ب2 (الريبوفلافين) مع الأشعة فوق البنفسجية UVA. الهدف الأساسي هو إيقاف تقدم المرض وحماية النظر من التدهور المستقبلي.</p>
      `,contentEn:`
        <h4>What is Keratoconus?</h4>
        <p>Keratoconus is a progressive condition where the cornea thins and bulges into an irregular conical shape. This produces progressive irregular astigmatism, frequently requiring frequent eyeglass prescription changes in adolescents and young adults.</p>
        <h4>Early Diagnosis with Corneal Tomography</h4>
        <p>High-resolution Scheimpflug tomography (Pentacam) detects subclinical keratoconus before overt signs appear on basic slit-lamp examination. Anyone with rapidly changing astigmatism or habitual eye rubbing should be screened.</p>
        <h4>Corneal Collagen Cross-Linking (CXL)</h4>
        <p>CXL strengthens corneal stromal collagen bonds using riboflavin (vitamin B2) drops activated by precise UVA light, arresting disease progression and preserving visual acuity.</p>
      `},{id:`lasik-candidacy`,titleAr:`من هو المرشح المناسب لعمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك)؟`,titleEn:`Who is an Ideal Candidate for Laser Vision Correction (LASIK / PRK)?`,contentAr:`
        <h4>المعايير الأساسية للأمان:</h4>
        <ul>
          <li><strong>العمر:</strong> ألا يقل عن 18 عاماً لضمان استقرار نمو العين.</li>
          <li><strong>استقرار النظر:</strong> ثبات قياسات النظارة لمدة عام على الأقل.</li>
          <li><strong>سماكة القرنية وشكلها:</strong> خلو القرنية تماماً من أي علامات للقرنية المخروطية أو الترقق غير الطبيعي.</li>
          <li><strong>صحة سطح العين:</strong> علاج أي جفاف حاد قبل اتخاذ قرار الليزك.</li>
        </ul>
        <h4>ما الفرق بين الفيمتو ليزك والليزر السطحي (PRK)؟</h4>
        <p>في الفيمتو ليزك يتم رفع قشرة رقيقة من القرنية بواسطة ليزر الفيمتوثانية ثم تصحيح النظر، مما يوفر تعافياً سريعاً جداً. أما الليزر السطحي فيتم دون رفع أي قشرة، ويعد الخيار الأنسب لأصحاب القرنيات الرقيقة أو من يمارسون رياضات عنيفة.</p>
      `,contentEn:`
        <h4>Essential Safety Criteria:</h4>
        <ul>
          <li><strong>Age:</strong> At least 18 years to ensure ocular maturity.</li>
          <li><strong>Refractive Stability:</strong> Stable eyeglass prescription for at least 12 months.</li>
          <li><strong>Corneal Thickness & Shape:</strong> Adequate corneal pachymetry with no topographic evidence of ectasia or forme fruste keratoconus.</li>
          <li><strong>Ocular Surface:</strong> Absence of severe untreated dry eye disease.</li>
        </ul>
        <h4>Femto-LASIK vs. Surface Ablation (PRK)</h4>
        <p>Femto-LASIK utilizes a femtosecond laser to create a precise flap for swift visual recovery. PRK reshapes the corneal surface without flap creation, making it preferable for patients with thinner corneas or active contact sports involvement.</p>
      `},{id:`surgery-journey`,titleAr:`رحلة المريض: ماذا تتوقع قبل وأثناء وبعد جراحة المياه البيضاء؟`,titleEn:`The Patient Journey: What to Expect Before, During, and After Cataract Surgery`,contentAr:`
        <h4>قبل العملية (التحضير والقياسات):</h4>
        <p>يخضع المريض لقياسات بصرية فائقة الدقة (Optical Biometry) لحساب قوة العدسة المناسبة، مع مناقشة نوع العدسة الأنسب لاحتياجاته.</p>
        <h4>يوم العملية:</h4>
        <p>إجراء يومي لا يستدعي المبيت. تستغرق الجراحة نحو 15 إلى 20 دقيقة تحت تخدير موضعي بالقطرات، مع شعور المريض بضغط خفيف أو أضواء دون ألم حقيقي.</p>
        <h4>بعد العملية:</h4>
        <p>يغادر المريض بعد وقت وجيز مرتدياً غطاءً واقياً. من الضروري الالتزام بجدول القطرات المضادة للالتهاب والمضادات الحيوية، وتجنب فرك العين أو وصول الماء المباشر إليها خلال الأيام الأولى.</p>
      `,contentEn:`
        <h4>Pre-Operative Preparation:</h4>
        <p>Precise optical biometry is performed to calculate target IOL power, paired with a detailed lifestyle discussion regarding distance, intermediate, and near visual needs.</p>
        <h4>Day of Surgery:</h4>
        <p>Performed as an outpatient day procedure under topical anesthetic eye drops. The surgical procedure typically lasts 15–20 minutes with zero pain and immediate discharge.</p>
        <h4>Post-Operative Care:</h4>
        <p>Patients follow a structured regimen of anti-inflammatory and antibiotic eye drops, avoiding eye rubbing or direct tap water exposure during the initial healing window.</p>
      `}].map(e=>`
          <div class="article-item ${D===e.id?`open`:``}" id="art-item-${e.id}">
            <button class="article-trigger" onclick="toggleArticle('${e.id}')">
              <span>${S===`ar`?e.titleAr:e.titleEn}</span>
              <span class="trigger-icon">▼</span>
            </button>
            <div class="article-content">
              ${S===`ar`?e.contentAr:e.contentEn}
              <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--border-subtle);font-size:0.8rem;color:var(--text-muted);">
                ${S===`ar`?`إشراف ومراجعة سريرية: د. معن بن عبدالله البري — استشاري طب وجراحة العيون`:`Medically supervised by Dr. Maan Al Barry — Consultant Ophthalmologist`}
              </div>
            </div>
          </div>
        `).join(``)}
      </div>

      <!-- Emergency Red Flags Card -->
      <div class="emergency-card fade-in">
        <div class="emergency-header">
          <span>${S===`ar`?`علامات التحذير الطارئة (تستوجب الرعاية العاجلة فوراً)`:`Emergency Red Flags (Require Immediate Ophthalmic Care)`}</span>
        </div>
        <p style="font-size:0.9rem;">
          ${S===`ar`?`إذا كنت تعاني من أي من الأعراض التالية، يرجى التوجه فوراً لأقرب طوارئ عيون متخصصة:`:`If you experience any of the following symptoms, seek urgent emergency ophthalmic care immediately:`}
        </p>
        <ul>
          <li>${S===`ar`?`فقدان مفاجئ أو تدهور حاد وسريع في الرؤية بأي من العينين.`:`Sudden vision loss or rapid deterioration of sight in either eye.`}</li>
          <li>${S===`ar`?`ألم شديد ومفاجئ في العين مصحوب باحمرار أو صداع وغثيان.`:`Severe, sudden eye pain accompanied by redness, headache, or nausea.`}</li>
          <li>${S===`ar`?`ظهور ومضات ضوئية مفاجئة أو هطول كثيف من النقاط السوداء العائمة (ذباب طائر).`:`Sudden onset of light flashes or a heavy shower of floating black spots.`}</li>
          <li>${S===`ar`?`ظهور ما يشبه الستارة السوداء أو الظل الذي يغطي جزءاً من مجال الرؤية.`:`A dark shadow or curtain falling across any portion of your visual field.`}</li>
        </ul>
      </div>
    </div>
  </section>`}function R(){return`
  <section class="section" id="clinic">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`العيادة والموقع الجغرافي`:`Hospital Practice & Location`}</div>
        <h2>${S===`ar`?`العيادة والاستشارات وحجز المواعيد`:`Clinic Location & Direct Appointment Booking`}</h2>
        <p>${S===`ar`?`نرحب بكم في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، المزودة بأحدث التجهيزات الجراحية والتشخيصية.`:`We welcome you at Magrabi Health Eye & ENT Hospital in Madinah, fully equipped with state-of-the-art diagnostic and surgical technology.`}</p>
      </div>

      <div class="clinic-card fade-in">
        <!-- Exact Google Maps Direction Integration -->
        <div class="clinic-map-pane">
          <h4 style="font-size:1.15rem;color:var(--text-primary);margin-bottom:var(--space-1);">
            ${S===`ar`?e.clinicAr:e.clinicEn}
          </h4>
          <p style="font-size:0.88rem;color:var(--text-secondary);max-width:320px;margin-bottom:var(--space-4);">
            ${S===`ar`?e.addressAr:e.addressEn}
          </p>
          <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${S===`ar`?`فتح الاتجاهات عبر خرائط جوجل (Google Maps)`:`Open in Google Maps`}
          </a>
          <span style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">
            ${S===`ar`?`رابط الوصول المباشر المعتمد للمستشفى`:`Official Verified Hospital Destination Link`}
          </span>
        </div>

        <div class="clinic-info">
          <h3>${S===`ar`?`بيانات التواصل وأوقات الزيارة`:`Clinic Contact & Practice Schedule`}</h3>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${S===`ar`?`الموقع والصرح الطبي`:`Medical Hospital`}</strong>
              <span>${S===`ar`?e.clinicAr:e.clinicEn}</span>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${S===`ar`?`مركز الاتصال والحجز الموحد`:`Central Call Center`}</strong>
              <a href="tel:${e.callCenter}" style="direction:ltr;display:inline-block;font-weight:700;color:var(--secondary-burgundy);">
                ${e.callCenter} / ${e.landline}
              </a>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${S===`ar`?`مواعيد عمل العيادات`:`Clinic Hours`}</strong>
              <span>${S===`ar`?`السبت إلى الخميس: 9:00 ص – 1:00 م | 5:00 م – 9:30 م`:`Saturday to Thursday: 9:00 AM – 1:00 PM | 5:00 PM – 9:30 PM`}</span>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-6);">
            <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${S===`ar`?`حجز موعد عبر البوابة الرسمية لمغربي`:`Book via Magrabi Official Portal`}
            </a>
            <a href="${A()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              ${S===`ar`?`تنسيق واستفسار عبر واتساب`:`Inquire via WhatsApp`}
            </a>
            <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              ${S===`ar`?`الاتجاهات الجغرافية (Google Maps)`:`Hospital Directions (Google Maps)`}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`}function z(){return`
  <section class="section section-alt" id="faq">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${S===`ar`?`الأسئلة الشائعة والاستفسارات`:`Frequently Asked Questions`}</div>
        <h2>${S===`ar`?`دليل إجابات صحة العين وجراحة الساد والقرنية`:`Ophthalmic Health & Surgical Answers`}</h2>
      </div>

      <div class="faq-list fade-in">
        ${[{qAr:`ما هو التخصص الدقيق للدكتور معن بن عبدالله البري؟`,qEn:`What are Dr. Maan Al Barry's medical subspecialties?`,aAr:`استشاري طب وجراحة العيون، متخصص في جراحة المياه البيضاء (الساد) وزراعة العدسات الذكية، عمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك والسطحي)، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية CXL.`,aEn:`He is a Consultant Ophthalmologist specializing in cataract surgery, advanced IOL implantation, laser refractive surgery (LASIK, Femto-LASIK, PRK), and corneal diseases including keratoconus and corneal cross-linking (CXL).`},{qAr:`أين تقع عيادة الدكتور معن البري وكيف يمكن الوصول إليها؟`,qEn:`Where is Dr. Maan Al Barry clinic located?`,aAr:`يستقبل د. معن البري مراجعيه في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، الواقع على طريق المطار. يمكنك فتح رابط خرائط جوجل المعتمد مباشرة عبر الموقع.`,aEn:`At Magrabi Health Eye & ENT Hospital in Madinah, located on Airport Road. You can access the verified Google Maps destination link directly from this website.`},{qAr:`كيف يمكنني حجز موعد مؤكد مع الطبيب؟`,qEn:`How can I book a confirmed appointment?`,aAr:`يمكنك الحجز مباشرة عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو عبر الاتصال بالرقم الموحد 19505، أو الاستفسار السريع وتنسيق الموعد عبر رابط واتساب المتوفر في الموقع.`,aEn:`You can book through the official Magrabi Online Booking portal (ob.magrabi.com.sa), via the contact center at 19505, or via direct WhatsApp coordination.`},{qAr:`هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟`,qEn:`Does the Vision Simulator predict actual surgical vision?`,aAr:`كلا، محاكي الرؤية هو أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.`,aEn:`No. The simulator is strictly an educational tool illustrating optical principles. Real-world postoperative visual acuity is determined by clinical biometry, corneal morphology, and individualized healing.`},{qAr:`هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟`,qEn:`Can cataract surgery guarantee complete spectacle independence?`,aAr:`توفر العدسات الحديثة مثل العدسات ثلاثية البؤرة (Trifocal) والعدسات ممتدة العمق (EDOF) استقلالية عالية عن النظارات لمعظم الأنشطة كالقراءة وقيادة السيارة، ولكن لا يمكن تقديم ضمان طبي بنسبة 100% لعدم الحاجة لنظارة في بعض الظروف الخاصة.`,aEn:`While modern premium IOLs (Trifocals & EDOFs) significantly decrease dependence on glasses for distance, intermediate, and near tasks, complete 100% independence cannot be guaranteed for every clinical case.`},{qAr:`ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟`,qEn:`What are the main criteria for laser vision correction (LASIK)?`,aAr:`يشترط ألا يقل العمر عن 18 عاماً، وثبات النظر لمدة عام، وسماكة قرنية كافية، وخلو العين التام من القرنية المخروطية أو الجفاف الشديد غير المعالج، ويتم حسم القرار بعد تصوير القرنية الطبقي (Pentacam).`,aEn:`Candidates must be at least 18 years old, possess stable refraction for 12 months, have adequate corneal thickness, and demonstrate normal corneal topography with no evidence of keratoconus.`}].map((e,t)=>`
          <div class="faq-item" id="faq-${t}">
            <button class="faq-question" onclick="toggleFaq(${t})" aria-expanded="false" aria-controls="faq-answer-${t}">
              <span>${S===`ar`?e.qAr:e.qEn}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${t}" role="region">
              <p>${S===`ar`?e.aAr:e.aEn}</p>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  </section>`}function B(){return`
  <section class="section">
    <div class="container">
      <div class="cta-banner fade-in">
        <h2>${S===`ar`?`هل ترغب في معرفة أي عدسة تناسب نمط حياتك؟`:`Ready for a Specialized Eye Evaluation?`}</h2>
        <p>${S===`ar`?`احجز موعدك الآن مع د. معن بن عبدالله البري في مغربي المدينة المنورة لإجراء تقييم شامل ومناقشة الخيارات الأنسب لحالتك.`:`Schedule your comprehensive examination with Dr. Maan Al Barry at Magrabi Health Madinah today.`}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
          <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-lg">
            ${S===`ar`?`تأكيد حجز موعد كشف واستشارة`:`Book Clinic Appointment`}
          </a>
          <a href="${A()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
            ${S===`ar`?`تنسيق عبر واتساب`:`Inquire via WhatsApp`}
          </a>
          <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg" style="color:#FFFFFF;border-color:rgba(255,255,255,0.4);">
            ${S===`ar`?`موقع المستشفى بالمدينة`:`Hospital Location`}
          </a>
        </div>
      </div>
    </div>
  </section>`}function V(){return`
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
            <div class="logo-icon" style="width:38px;height:38px;font-size:1.1rem;">م</div>
            <div>
              <strong style="color:var(--footer-title);font-size:1.05rem;display:block;">${S===`ar`?e.nameAr:e.nameEn}</strong>
              <small style="color:var(--gold);font-size:0.75rem;">${S===`ar`?e.titleAr:e.titleEn}</small>
            </div>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;">
            ${S===`ar`?`الموقع الرسمي للتعريف بالخبرات الأكاديمية والسريرية للدكتور معن البري، ونشر التثقيف الطبي الموثوق حول جراحات المياه البيضاء، القرنية، وتصحيح النظر.`:`Official medical portal presenting Dr. Maan Al Barry academic appointments and evidence-based patient education.`}
          </p>
        </div>

        <div class="footer-col">
          <h4>${S===`ar`?`روابط الوصول السريع`:`Quick Navigation`}</h4>
          <a href="#home" onclick="scrollToSection('home');return false;">${S===`ar`?`الرئيسية`:`Home`}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${S===`ar`?`السيرة المهنية`:`Biography`}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`التخصصات الجراحية`:`Specialties`}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${S===`ar`?`محاكي الرؤية`:`Simulator`}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${S===`ar`?`دليل العدسات IOL`:`IOL Guide`}</a>
        </div>

        <div class="footer-col">
          <h4>${S===`ar`?`التخصصات الدقيقة`:`Clinical Focus`}</h4>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`جراحة الساد والماء الأبيض`:`Cataract Surgery`}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`زراعة العدسات ثلاثية البؤرة`:`Trifocal / EDOF IOLs`}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`القرنية المخروطية وتثبيت CXL`:`Keratoconus (CXL)`}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${S===`ar`?`الفيمتو ليزك وتصحيح النظر`:`Femto-LASIK & PRK`}</a>
        </div>

        <div class="footer-col">
          <h4>${S===`ar`?`العيادة والتواصل`:`Hospital & Contact`}</h4>
          <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer">${S===`ar`?`مغربي طريق المطار (Google Maps)`:`Airport Road, Madinah (Maps)`}</a>
          <a href="tel:${e.callCenter}">${S===`ar`?`الرقم الموحد: `:`Call Center: `}${e.callCenter}</a>
          <a href="${A()}" target="_blank" rel="noopener noreferrer">WhatsApp (${e.whatsapp})</a>
          <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer">${S===`ar`?`بوابة الحجز الإلكتروني`:`Online Booking`}</a>
        </div>
      </div>

      <div class="medical-disclaimer" style="background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);color:#94A3B8;margin-bottom:var(--space-6);">
        <strong style="color:var(--gold);">${S===`ar`?`إخلاء مسؤولية طبي معتمد:`:`Medical Disclaimer:`}</strong>
        ${S===`ar`?`المحتوى العلمي والمواد التثقيفية المنشورة على هذا الموقع مخصصة حصرياً للتوعية الطبية العامة، ولا تُعد بأي حال من الأحوال بديلاً عن الكشف الإكلينيكي المباشر والتشخيص العيني الدقيق لدى الطبيب الاستشاري.`:`Content published on this website is for educational and awareness purposes only and does not substitute for personalized clinical examination and medical diagnosis by an ophthalmologist.`}
      </div>

      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${S===`ar`?e.nameAr:e.nameEn} — ${S===`ar`?`جميع الحقوق محفوظة`:`All Rights Reserved`}</p>
        <div>
          <a href="${e.magrabiProfile}" target="_blank" rel="noopener noreferrer">${S===`ar`?`الملف الطبي في مغربي`:`Magrabi Profile`}</a> ·
          <a href="${e.taibahProfile}" target="_blank" rel="noopener noreferrer">${S===`ar`?`ملف جامعة طيبة`:`Taibah University Profile`}</a> ·
          <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a>
        </div>
      </div>
    </div>
  </footer>`}function H(){return`
  <div class="booking-bar" id="booking-bar">
    <div class="booking-bar-inner">
      <a href="${e.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        ${S===`ar`?`احجز موعداً`:`Book Exam`}
      </a>
      <a href="${A()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
        WhatsApp
      </a>
      <a href="${e.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        Maps
      </a>
    </div>
  </div>`}window.toggleLang=function(){S=S===`ar`?`en`:`ar`,w=0,T=[],E=!1,D=null,G(),window.scrollTo(0,0)},window.scrollToSection=function(e){let t=document.getElementById(e);if(t){let e=document.getElementById(`site-header`)?.offsetHeight||74,n=t.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:n,behavior:`smooth`})}},window.toggleMobileMenu=function(){let e=document.getElementById(`mobile-nav`);e&&e.classList.toggle(`open`)},window.closeMobileMenu=function(){let e=document.getElementById(`mobile-nav`);e&&e.classList.remove(`open`)},window.selectQOption=function(e){T[w]=e,G(),scrollToSection(`questionnaire`)},window.nextQStep=function(){T[w]!==void 0&&(w<3?w++:E=!0,G(),scrollToSection(`questionnaire`))},window.prevQStep=function(){w>0&&(w--,G(),scrollToSection(`questionnaire`))},window.restartQ=function(){w=0,T=[],E=!1,G(),scrollToSection(`questionnaire`)},window.toggleArticle=function(e){D=D===e?null:e;let t=document.getElementById(`art-item-${e}`);t&&t.classList.toggle(`open`)},window.toggleFaq=function(e){let t=document.getElementById(`faq-${e}`);t&&t.classList.toggle(`open`)};function U(){let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)})},{threshold:.08,rootMargin:`0px 0px -40px 0px`});document.querySelectorAll(`.fade-in`).forEach(t=>e.observe(t))}function W(){window.addEventListener(`scroll`,()=>{let e=document.getElementById(`site-header`);e&&(window.scrollY>40?e.style.boxShadow=`0 4px 20px rgba(0, 0, 0, 0.08)`:e.style.boxShadow=`none`)},{passive:!0})}function G(){document.documentElement.lang=S,document.documentElement.dir=S===`ar`?`rtl`:`ltr`,document.body.className=S===`en`?`lang-en`:``;let e=document.getElementById(`app`);e&&(e.innerHTML=`
    ${j()}
    <main>
      ${M()}
      ${N()}
      ${P()}
      ${y(S)}
      ${F()}
      ${I()}
      ${L()}
      ${R()}
      ${z()}
      ${B()}
    </main>
    ${V()}
    ${H()}
  `,k(C),U(),W(),x(S))}G();