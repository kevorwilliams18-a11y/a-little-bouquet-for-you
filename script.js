(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false, soundEnabled = false, audioContext, revealTimer;
  const defs = `<defs>
    <linearGradient id="tulipPink" x1="0" x2="1" y2=".8"><stop stop-color="#ffe4e2"/><stop offset=".5" stop-color="#ef9e99"/><stop offset="1" stop-color="#cb655e"/></linearGradient>
    <linearGradient id="tulipLight" x1="0" x2="1"><stop stop-color="#fff1f0"/><stop offset="1" stop-color="#e89b96"/></linearGradient>
    <linearGradient id="lilyPink" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#ffffff"/><stop offset=".6" stop-color="#fffdf5"/><stop offset="1" stop-color="#e4e9cf"/></linearGradient>
    <linearGradient id="leafGreen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#aec69a"/><stop offset="1" stop-color="#638d72"/></linearGradient>
    <linearGradient id="paperPink" x1="0" x2="1" y2="1"><stop stop-color="#fff1f0"/><stop offset="1" stop-color="#eeb9b6"/></linearGradient>
    <linearGradient id="ribbonPink"><stop stop-color="#ba544d"/><stop offset=".5" stop-color="#e39b96"/><stop offset="1" stop-color="#c1605a"/></linearGradient>
    <radialGradient id="daisyGold"><stop stop-color="#fceba5"/><stop offset=".7" stop-color="#e4b64f"/><stop offset="1" stop-color="#dba34d"/></radialGradient>
  </defs>`;
  function leaf(x, y, rotation, scale = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 0Q-48-15-42-67Q-2-54 0 0Z" fill="url(#leafGreen)"/><path d="M0 0Q-21-37-42-67" fill="none" stroke="#6a9377" stroke-width="1" opacity=".7"/></g>`;
  }
  function rose(x, y, rotation = 0, scale = 1) {
    let petals = '';
    for (let i = 0; i < 7; i++) petals += `<path d="M0 8C-35 11-48-11-31-30C-16-48 16-39 21-18C23-3 11 7 0 8Z" transform="rotate(${i*51.4})" fill="${i%2 ? '#bf233c' : '#d84051'}" stroke="#9c1830" stroke-width="1"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 10Q-7 75 2 145" fill="none" stroke="#799c79" stroke-width="4" stroke-linecap="round"/>${leaf(0,112,-21,.65)}${leaf(0,88,150,.51)}<path d="M-17 24L-25 4L0 14L24 1L16 27Z" fill="#638d72"/>${petals}<path d="M-24-13C-11-31 17-27 25-7C12-15-5-10-9 4C-24 3-30-3-24-13Z" fill="#ed5b68" stroke="#a92037" stroke-width="1"/><path d="M-9 4C-19-16 6-29 20-12C28 3 7 17-9 4Z" fill="#b91f38" stroke="#93162b"/><path d="M-10-8C-1-21 17-9 8 1C1 10-12 4-10-8Z" fill="#e34c5f"/><path d="M-5-7Q7-14 9-4Q8 3 0 1Q-6-1-1-6" fill="none" stroke="#8d162b" stroke-width="2" stroke-linecap="round"/><path d="M-26-16Q-15-27-5-24M8 16Q20 12 26 2" fill="none" stroke="#f58c91" stroke-width="1.6" opacity=".8"/></g>`;
  }
  function lily(x, y, rotation = 0, scale = 1) {
    let petals = '';
    for(let i=0;i<6;i++) petals += `<g transform="rotate(${i*60})"><path d="M0 7C-24-6-22-35-4-58Q0-64 4-58C21-34 23-7 0 7Z" fill="url(#lilyPink)" stroke="#d8d8bd" stroke-width=".6"/><path d="M0 4Q-1-23 0-55" stroke="#a6b485" stroke-width="1" fill="none" opacity=".65"/><g fill="#b9a775" opacity=".55"><circle cx="-5" cy="-15" r="1"/><circle cx="5" cy="-21" r="1.1"/><circle cx="-7" cy="-28" r=".8"/><circle cx="4" cy="-33" r=".8"/></g></g>`;
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 8Q-9 78 5 150" fill="none" stroke="#779a79" stroke-width="3.5"/>${leaf(0,100,-10,.58)}${leaf(0,74,155,.45)}${petals}<g stroke="#a0a070" stroke-width="1.4" fill="#b78b43"><path d="M0 5L-13-16M0 5L-1-23M0 5L13-14M0 5L17 1M0 5L-16 0"/><ellipse cx="-13" cy="-16" rx="3" ry="1.7" transform="rotate(25 -13 -16)"/><ellipse cx="-1" cy="-23" rx="3" ry="1.7"/><ellipse cx="13" cy="-14" rx="3" ry="1.7" transform="rotate(-25 13 -14)"/><ellipse cx="17" cy="1" rx="3" ry="1.7"/><ellipse cx="-16" cy="0" rx="3" ry="1.7"/></g><circle cy="5" r="3" fill="#9f9b55"/></g>`;
  }
  function sunflower(x,y,rotation=0,scale=1){let petals='';for(let i=0;i<20;i++)petals+=`<path d="M0-12Q-14-29 0-53Q14-29 0-12Z" transform="rotate(${i*18})" fill="${i%2?'#f4bc35':'#ffdc59'}" stroke="#d69b28" stroke-width=".6"/>`;let seeds='';for(let i=0;i<65;i++){const a=i*2.4,r=Math.sqrt(i)*2.1;seeds+=`<circle cx="${Math.cos(a)*r}" cy="${Math.sin(a)*r}" r="1.15" fill="${i%2?'#a1743a':'#d4ab61'}"/>`;}return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M0 10Q8 74 0 143" fill="none" stroke="#6f925d" stroke-width="4"/>${leaf(0,105,-30,.7)}${leaf(0,78,155,.5)}${petals}<circle r="21" fill="#694b30"/>${seeds}</g>`;}
  function sprig(x,y,r,s=1){let bits='';for(let i=0;i<5;i++)bits+=`<ellipse cx="${i%2?-9:9}" cy="${-i*19}" rx="8" ry="13" transform="rotate(${i%2?-35:35} ${i%2?-9:9} ${-i*19})" fill="${i%2?'#a8bba1':'#92ae94'}"/>`;return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 90L0-90" stroke="#8aab8b" stroke-width="2"/>${bits}</g>`;}
  const svgStart = (viewBox, label='') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${defs}`;
  const bouquetArt = svgStart('0 0 500 430') + `
    <ellipse cx="250" cy="407" rx="84" ry="12" fill="#d49c98" opacity=".13"/>
    <path d="M123 212L200 381Q250 408 301 381L378 211L268 249Z" fill="url(#paperPink)" stroke="#e3afac" stroke-width="1"/>
    <path d="M124 212L224 315L201 381Z" fill="#f7d6d4"/><path d="M377 212L273 315L301 381Z" fill="#eeb9b6"/>
    <g stroke="#7f9f7d" stroke-width="3" fill="none"><path d="M250 357L145 156M250 357L344 133M250 357L222 89M250 357L295 81M250 357L184 110"/></g>
    ${sprig(147,209,-34,.82)}${sprig(350,204,35,.84)}${sprig(260,140,8,.95)}
    ${leaf(211,294,-48,1.4)}${leaf(287,286,130,1.25)}${leaf(226,242,-26,1.1)}${leaf(285,233,160,1.15)}
    ${rose(189,118,-21,.99,true)}${rose(287,99,15,1.04)}${sunflower(237,66,-5,.86)}
    ${lily(137,166,-30,.72)}${lily(333,130,19,.84)}${lily(222,170,-14,.93)}${lily(328,218,22,.83)}
    ${rose(156,232,-26,.85)}${rose(285,202,12,.84,true)}${lily(199,254,-15,.79)}${lily(263,252,8,.69)}${sunflower(362,247,32,.57)}
    <g fill="#fff8f8" stroke="#ead0ce" stroke-width=".4"><circle cx="118" cy="224" r="3.6"/><circle cx="126" cy="215" r="3"/><circle cx="131" cy="231" r="4"/><circle cx="177" cy="182" r="3"/><circle cx="180" cy="192" r="3.4"/><circle cx="307" cy="151" r="3"/><circle cx="315" cy="159" r="4"/><circle cx="368" cy="186" r="4"/><circle cx="374" cy="197" r="3"/><circle cx="354" cy="193" r="3.5"/></g>
    <path d="M143 280Q195 280 250 329Q300 279 357 280L300 393Q250 417 200 393Z" fill="url(#paperPink)" stroke="#e8b5b2" stroke-width="1"/>
    <path d="M143 280Q187 320 228 398M357 280Q315 320 276 400" fill="none" stroke="#fff0ef" stroke-width="2" opacity=".75"/>
    <path d="M215 353Q178 309 163 333Q154 365 240 362Q214 342 215 353Z" fill="url(#ribbonPink)" stroke="#b9615b"/>
    <path d="M280 353Q323 311 336 337Q339 369 258 361Q280 340 280 353Z" fill="url(#ribbonPink)" stroke="#b9615b"/>
    <path d="M237 360L210 409L229 402L237 419L252 364M260 361L276 412L287 397L303 400L273 355" fill="url(#ribbonPink)"/>
    <path d="M240 350Q250 345 264 350L267 365Q250 374 237 364Z" fill="url(#ribbonPink)" stroke="#c2706b"/>
    <path d="M293 364L320 371L311 397L285 389Z" fill="#fff0ef" stroke="#e4c0be"/><text x="301" y="384" text-anchor="middle" fill="#b77571" font-family="Georgia" font-size="12" transform="rotate(17 301 384)">♡</text>
  </svg>`;
  $('bouquet').innerHTML = bouquetArt;
  document.querySelectorAll('[data-flower]').forEach((node) => {
    const type = node.dataset.flower;
    const art = type === 'rose' ? rose(100,61,-7,.87) : type === 'sunflower' ? sunflower(100,67,-8,.83) : lily(100,67,-8,.83);
    // Each miniature has its own SVG gradient IDs so the hidden bouquet cannot affect it.
    const prefix = 'flower-' + type + '-' + [...document.querySelectorAll('[data-flower]')].indexOf(node) + '-';
    node.innerHTML = (svgStart('0 0 200 200') + art + '</svg>').replaceAll('id="', 'id="' + prefix).replaceAll('url(#', 'url(#' + prefix);
  });
  if(new URLSearchParams(window.location.search).get('quiz') === 'sent'){ $('gift-quiz').hidden=true;$('quiz-thanks').hidden=false; }
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
    const colors = ['#e9a8a4','#f6cac7','#ce726c','#f8dfb1','#fff1f0'];
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
