(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false, soundEnabled = false, audioContext, revealTimer;
  const defs = `<defs>
    <linearGradient id="tulipPink" x1="0" x2="1" y2=".8"><stop stop-color="#ffe2ed"/><stop offset=".5" stop-color="#ef99ba"/><stop offset="1" stop-color="#cb5e8d"/></linearGradient>
    <linearGradient id="tulipLight" x1="0" x2="1"><stop stop-color="#fff0f4"/><stop offset="1" stop-color="#e896b5"/></linearGradient>
    <linearGradient id="lilyPink" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffdf8"/><stop offset=".45" stop-color="#ffe4eb"/><stop offset="1" stop-color="#df82a3"/></linearGradient>
    <linearGradient id="leafGreen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#aec69a"/><stop offset="1" stop-color="#638d72"/></linearGradient>
    <linearGradient id="paperPink" x1="0" x2="1" y2="1"><stop stop-color="#fff1f0"/><stop offset="1" stop-color="#eeb6c8"/></linearGradient>
    <linearGradient id="ribbonPink"><stop stop-color="#ba4d76"/><stop offset=".5" stop-color="#e396b1"/><stop offset="1" stop-color="#c15a80"/></linearGradient>
    <radialGradient id="daisyGold"><stop stop-color="#fceba5"/><stop offset=".7" stop-color="#e4b64f"/><stop offset="1" stop-color="#dba34d"/></radialGradient>
  </defs>`;
  function leaf(x, y, rotation, scale = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 0Q-48-15-42-67Q-2-54 0 0Z" fill="url(#leafGreen)"/><path d="M0 0Q-21-37-42-67" fill="none" stroke="#6a9377" stroke-width="1" opacity=".7"/></g>`;
  }
  function tulip(x, y, rotation = 0, scale = 1, variant = false) {
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 5Q-7 74 2 145" fill="none" stroke="#799c79" stroke-width="4" stroke-linecap="round"/>${leaf(0,112,-21,.65)}${leaf(0,88,150,.51)}<path d="M-29-30Q-38 20 0 30Q39 20 28-32L10-15L0-43L-13-14Z" fill="url(#${variant ? 'tulipLight' : 'tulipPink'})" stroke="#ce7799" stroke-width=".65"/><path d="M-29-30Q-12-18 0 28Q-24 23-29-30Z" fill="#eea3bd"/><path d="M28-32Q9-13 0 28Q29 18 28-32Z" fill="#e68eaf" opacity=".65"/><path d="M0-40Q-6-3 0 25" fill="none" stroke="#fff5f5" stroke-width="1.2" opacity=".7"/></g>`;
  }
  function daisy(x, y, rotation = 0, scale = 1) {
    let petals = '';
    for (let i = 0; i < 13; i++) petals += `<ellipse cx="0" cy="-23" rx="6.8" ry="19" transform="rotate(${i * 360 / 13})" fill="${i % 2 ? '#fffdf5' : '#fff9ed'}" stroke="#e8d9c5" stroke-width=".7"/>`;
    let pollen = '';
    for (let i = 0; i < 15; i++) { const a = i * 2.4; const r = Math.sqrt(i) * 2.2; pollen += `<circle cx="${Math.cos(a)*r}" cy="${Math.sin(a)*r}" r="1" fill="#c9953e" opacity=".55"/>`; }
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 8Q8 63 0 138" fill="none" stroke="#82a17b" stroke-width="3"/>${leaf(3,98,145,.43)}${leaf(3,72,-12,.35)}${petals}<circle r="12" fill="url(#daisyGold)"/>${pollen}</g>`;
  }
  function lily(x, y, rotation = 0, scale = 1) {
    let petals = '';
    for(let i=0;i<6;i++) petals += `<g transform="rotate(${i*60})"><path d="M0 7C-24-6-22-35-4-58Q0-64 4-58C21-34 23-7 0 7Z" fill="url(#lilyPink)" stroke="#e4a1b7" stroke-width=".6"/><path d="M0 4Q-1-23 0-55" stroke="#d16d92" stroke-width="1" fill="none" opacity=".65"/><g fill="#c45a86" opacity=".55"><circle cx="-5" cy="-15" r="1"/><circle cx="5" cy="-21" r="1.1"/><circle cx="-7" cy="-28" r=".8"/><circle cx="4" cy="-33" r=".8"/></g></g>`;
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 8Q-9 78 5 150" fill="none" stroke="#779a79" stroke-width="3.5"/>${leaf(0,100,-10,.58)}${leaf(0,74,155,.45)}${petals}<g stroke="#a0a070" stroke-width="1.4" fill="#b78b43"><path d="M0 5L-13-16M0 5L-1-23M0 5L13-14M0 5L17 1M0 5L-16 0"/><ellipse cx="-13" cy="-16" rx="3" ry="1.7" transform="rotate(25 -13 -16)"/><ellipse cx="-1" cy="-23" rx="3" ry="1.7"/><ellipse cx="13" cy="-14" rx="3" ry="1.7" transform="rotate(-25 13 -14)"/><ellipse cx="17" cy="1" rx="3" ry="1.7"/><ellipse cx="-16" cy="0" rx="3" ry="1.7"/></g><circle cy="5" r="3" fill="#9f9b55"/></g>`;
  }
  function sprig(x,y,r,s=1){let bits='';for(let i=0;i<5;i++)bits+=`<ellipse cx="${i%2?-9:9}" cy="${-i*19}" rx="8" ry="13" transform="rotate(${i%2?-35:35} ${i%2?-9:9} ${-i*19})" fill="${i%2?'#a8bba1':'#92ae94'}"/>`;return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 90L0-90" stroke="#8aab8b" stroke-width="2"/>${bits}</g>`;}
  const svgStart = (viewBox, label='') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${defs}`;
  const bouquetArt = svgStart('0 0 500 430') + `
    <ellipse cx="250" cy="407" rx="84" ry="12" fill="#d498ab" opacity=".13"/>
    <path d="M123 212L200 381Q250 408 301 381L378 211L268 249Z" fill="url(#paperPink)" stroke="#e3acbf" stroke-width="1"/>
    <path d="M124 212L224 315L201 381Z" fill="#f7d4de"/><path d="M377 212L273 315L301 381Z" fill="#eeb6c8"/>
    <g stroke="#7f9f7d" stroke-width="3" fill="none"><path d="M250 357L145 156M250 357L344 133M250 357L222 89M250 357L295 81M250 357L184 110"/></g>
    ${sprig(147,209,-34,.82)}${sprig(350,204,35,.84)}${sprig(260,140,8,.95)}
    ${leaf(211,294,-48,1.4)}${leaf(287,286,130,1.25)}${leaf(226,242,-26,1.1)}${leaf(285,233,160,1.15)}
    ${tulip(189,118,-21,.99,true)}${tulip(287,99,15,1.04)}${tulip(237,66,-5,.92,true)}
    ${daisy(137,166,-30,.72)}${daisy(333,130,19,.84)}${lily(222,170,-14,.93)}${lily(328,218,22,.83)}
    ${tulip(156,232,-26,.85)}${tulip(285,202,12,.84,true)}${daisy(199,254,-15,.79)}${daisy(263,252,8,.69)}${daisy(362,247,32,.57)}
    <g fill="#fffdf8" stroke="#ead8ce" stroke-width=".4"><circle cx="118" cy="224" r="3.6"/><circle cx="126" cy="215" r="3"/><circle cx="131" cy="231" r="4"/><circle cx="177" cy="182" r="3"/><circle cx="180" cy="192" r="3.4"/><circle cx="307" cy="151" r="3"/><circle cx="315" cy="159" r="4"/><circle cx="368" cy="186" r="4"/><circle cx="374" cy="197" r="3"/><circle cx="354" cy="193" r="3.5"/></g>
    <path d="M143 280Q195 280 250 329Q300 279 357 280L300 393Q250 417 200 393Z" fill="url(#paperPink)" stroke="#e8b2c3" stroke-width="1"/>
    <path d="M143 280Q187 320 228 398M357 280Q315 320 276 400" fill="none" stroke="#fff3ef" stroke-width="2" opacity=".75"/>
    <path d="M215 353Q178 309 163 333Q154 365 240 362Q214 342 215 353Z" fill="url(#ribbonPink)" stroke="#b95b7f"/>
    <path d="M280 353Q323 311 336 337Q339 369 258 361Q280 340 280 353Z" fill="url(#ribbonPink)" stroke="#b95b7f"/>
    <path d="M237 360L210 409L229 402L237 419L252 364M260 361L276 412L287 397L303 400L273 355" fill="url(#ribbonPink)"/>
    <path d="M240 350Q250 345 264 350L267 365Q250 374 237 364Z" fill="url(#ribbonPink)" stroke="#c26b8c"/>
    <path d="M293 364L320 371L311 397L285 389Z" fill="#fffbef" stroke="#e4c9be"/><text x="301" y="384" text-anchor="middle" fill="#b7718d" font-family="Georgia" font-size="12" transform="rotate(17 301 384)">♡</text>
  </svg>`;
  $('bouquet').innerHTML = bouquetArt;
  document.querySelectorAll('[data-flower]').forEach((node) => {
    const type = node.dataset.flower;
    const art = type === 'tulip' ? tulip(100,61,-7,.87,true) : type === 'daisy' ? daisy(100,58,8,.86) : lily(100,67,-8,.83);
    // Each miniature has its own SVG gradient IDs so the hidden bouquet cannot affect it.
    const prefix = 'flower-' + type + '-' + [...document.querySelectorAll('[data-flower]')].indexOf(node) + '-';
    node.innerHTML = (svgStart('0 0 200 200') + art + '</svg>').replaceAll('id="', 'id="' + prefix).replaceAll('url(#', 'url(#' + prefix);
  });
  function chime() {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();
      [523.25,659.25,783.99,1046.5].forEach((frequency,i) => {
        const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        const start = audioContext.currentTime + i * .13;
        gain.gain.setValueAtTime(0,start); gain.gain.linearRampToValueAtTime(.065,start+.025); gain.gain.exponentialRampToValueAtTime(.001,start+1.25);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(start); oscillator.stop(start+1.3);
      });
    } catch { soundEnabled = false; updateSound(); }
  }
  let cleanupTimer;
  function magic() {
    chime();
    if(reducedMotion) return;
    const layer = $('petals');
    clearTimeout(cleanupTimer); layer.replaceChildren();
    const colors = ['#e9a4be','#f6c7d8','#ce6c93','#f8dfb1','#fff7f0'];
    const fragment = document.createDocumentFragment();
    for(let i=0;i<48;i++) {
      const petal = document.createElement('span');
      petal.className = 'falling-petal' + (i%3 ? ' petal' : '');
      petal.textContent = i%3 ? '' : (i%2 ? '♡' : '✧');
      petal.style.cssText = `--left:${Math.random()*100}%;--size:${12+Math.random()*14}px;--duration:${4+Math.random()*3}s;--delay:${Math.random()*1.3}s;--drift:${-120+Math.random()*240}px;--color:${colors[i%colors.length]}`;
      fragment.appendChild(petal);
    }
    layer.appendChild(fragment);
    cleanupTimer = setTimeout(() => layer.replaceChildren(),8500);
  }
  function openGift() {
    if(opened) return;
    opened = true;
    $('gift').setAttribute('aria-expanded','true');
    $('open').disabled = true;
    $('surprise-card').classList.add('opened');
    magic();
    revealTimer = setTimeout(() => {
      $('before').hidden = true; $('gift').hidden = true; $('reveal-message').hidden = false;
      $('shower').focus({preventScroll:true});
    }, reducedMotion ? 0 : 850);
  }
  function replay() {
    clearTimeout(revealTimer); opened = false;
    $('surprise-card').classList.remove('opened');
    $('before').hidden = false; $('gift').hidden = false; $('reveal-message').hidden = true;
    $('gift').setAttribute('aria-expanded','false'); $('open').disabled = false;
    $('petals').replaceChildren(); $('open').focus({preventScroll:true});
  }
  function updateSound() {
    $('sound').setAttribute('aria-pressed',String(soundEnabled));
    $('sound').setAttribute('aria-label',soundEnabled ? 'Turn off gentle chime sounds' : 'Turn on gentle chime sounds');
    $('sound').querySelector('span').textContent = soundEnabled ? 'sound on' : 'sound off';
  }
  $('gift').addEventListener('click',openGift); $('open').addEventListener('click',openGift);
  $('replay').addEventListener('click',replay); $('shower').addEventListener('click',magic);
  $('sound').addEventListener('click',()=>{soundEnabled=!soundEnabled;updateSound();if(soundEnabled)chime();});
})();
