if (false) {
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const TOTAL_SECONDS = 30 * 60;

const stages = [
  {
    id: 'classroom', image: 'assets/classroom.webp', location: '2층 일반교실', kicker: 'CHAPTER 01 · 관찰', title: '멈춘 전자칠판',
    story: '야간 점검 중 전자칠판이 잠겼다. 교실에 흩어진 세 단어를 먼저 찾아야 화면이 켜진다.',
    difficulty: 1, hint: '화면 위, 태극기 근처, 오른쪽 출입문 쪽을 살펴보세요.', type: 'hotspot',
    hotspots: [{x:47,y:13,w:'HAVE'},{x:18,y:27,w:'YOU'},{x:91,y:36,w:'EVER'}],
    prompt: '찾은 단어 뒤에 알맞은 말을 붙여 문장을 완성하세요.',
    question: 'Have you ever ___ Chuncheon?', options: ['visit','visited','visiting'], answer: 'visited'
  },
  {
    id: 'homebase', image: 'assets/homebase.webp', location: '2층 홈베이스', kicker: 'CHAPTER 02 · 어휘', title: '잠긴 파란 사물함',
    story: '사물함 번호표 대신 영어 뜻풀이가 남아 있다. 올바른 단어를 세 번 골라 잠금 장치를 해제하자.',
    difficulty: 1, hint: 'travel은 여행, pleasure는 즐거움을 뜻해요. protect는 보호하다입니다.', type: 'vocab',
    rounds: [
      {q:'a person who travels to a place for pleasure', a:'tourist', o:['tourist','battle','display']},
      {q:'a person who wears a uniform and protects a country', a:'soldier', o:['visitor','soldier','tie']},
      {q:'to show great respect to someone', a:'honor', o:['build','fight','honor']}
    ], fragment:['유일한 나라','ONLY']
  },
  {
    id: 'dream', image: 'assets/dream.webp', location: '꿈나래터 계단', kicker: 'CHAPTER 03 · 의사소통', title: '거꾸로 흩어진 질문',
    story: '계단 끝 벽면의 문장이 뒤섞여 있다. 여행 소감을 묻는 질문이 되도록 단어 카드를 순서대로 누르자.',
    difficulty: 2, hint: 'How로 시작하고, 물음표가 있는 카드가 마지막입니다.', type: 'order',
    words:['it?','like','How','you','did'], answer:['How','did','you','like','it?']
  },
  {
    id: 'digital', image: 'assets/digital.webp', location: 'DS실', kicker: 'CHAPTER 04 · 문법', title: '여행 가방 스캐너',
    story: '여행 가방 속 물건과 그 쓰임을 정확히 연결해야 검색대가 열린다. 명사를 뒤에서 꾸미는 to부정사를 사용하자.',
    difficulty: 2, hint: 'pen은 write with처럼 전치사 with를 끝에 남겨야 해요.', type: 'match',
    rows:[
      {label:'snacks',answer:'to eat',options:['to eat','to wear','to write with']},
      {label:'a pen',answer:'to write with',options:['to read','to write with','to drink']},
      {label:'water',answer:'to drink',options:['to visit','to drink','to display']}
    ], fragment:['전시 장소','SECOND']
  },
  {
    id: 'library', image: 'assets/library.webp', location: '3층 도서관', kicker: 'CHAPTER 05 · 본문 독해', title: '사라진 우정의 기록',
    story: '도서관 기록 카드 세 장 중 일부가 조작되었다. 춘천과 에티오피아의 실제 인연과 일치하는지 판별하자.',
    difficulty: 3, hint: '에티오피아는 군인을 보낸 유일한 아프리카 국가였고, 군인들은 아이들을 돕기 위해 자신들의 돈을 썼습니다.', type: 'tf',
    rows:[
      {q:'Ethiopia was the only African country to send soldiers during the Korean War.',a:true},
      {q:'Ethiopian soldiers used their own money to help Korean children.',a:true},
      {q:'The Memorial Hall in Chuncheon has two square roofs.',a:false}
    ], fragment:['기념관 지붕','THREE']
  },
  {
    id: 'study', image: 'assets/study.webp', location: '미디어월드 스터디카페', kicker: 'CHAPTER 06 · 현재완료', title: '여행자의 타임라인',
    story: '여행가 Kate의 기록이 과거와 현재 사이에서 끊어졌다. 현재완료 형태를 모두 복구해야 마지막 장소가 열린다.',
    difficulty: 4, hint: '현재완료는 have/has + 과거분사입니다. Kate는 3인칭 단수예요.', type: 'grammar',
    sentence:[
      {pre:'Kate ',post:' a lot since 2015.',answer:'has traveled',options:['traveled','has traveled','have traveled']},
      {pre:'She ',post:' to Ethiopia once.',answer:'has been',options:['has been','was','have gone']},
      {pre:'She has never ',post:' Australia.',answer:'visited',options:['visit','visiting','visited']}
    ], fragment:['기념관 건립','2006']
  },
  {
    id: 'lounge', image: 'assets/lounge.webp', location: '오션 라운지', kicker: 'FINAL CHAPTER · 종합 추리', title: '피아노의 마지막 암호',
    story: '피아노 안에서 네 개의 기록 조각이 발견되었다. 조각의 뜻을 숫자로 바꿔 네 자리 암호를 완성하자.',
    difficulty: 5, hint: 'ONLY=1, SECOND=2, THREE=3, 2006은 마지막 숫자만 사용하세요.', type: 'code', answer:'1236'
  }
];

let state = {
  screen: 'start', stage: 0, seconds: TOTAL_SECONDS, hints: 0, mistakes: 0,
  found: [], selections: {}, fragments: [], startedAt: null, hintOpen: false
};
let timerId = null;

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem('oceanEscapeV1'));
    if(saved && saved.screen === 'game' && saved.stage < stages.length){
      state = {...state,...saved,hintOpen:false};
      if(saved.savedAt) state.seconds = Math.max(0, saved.seconds - Math.floor((Date.now()-saved.savedAt)/1000));
    }
  } catch(e) {}
}

function saveState(){
  if(state.screen === 'game') localStorage.setItem('oceanEscapeV1',JSON.stringify({...state,savedAt:Date.now()}));
}

function esc(s){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function stars(n){ return '●'.repeat(n)+'○'.repeat(5-n); }
function timeText(sec){ const m=Math.floor(sec/60),s=sec%60; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function say(msg){ toast.textContent=msg; toast.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(()=>toast.classList.remove('show'),2200); }
function fail(msg='다시 살펴보세요.'){ state.mistakes++; saveState(); say(msg); document.querySelector('.mission')?.classList.add('shake'); setTimeout(()=>document.querySelector('.mission')?.classList.remove('shake'),420); }

function startGame(){
  state={screen:'game',stage:0,seconds:TOTAL_SECONDS,hints:0,mistakes:0,found:[],selections:{},fragments:[],startedAt:Date.now(),hintOpen:false};
  saveState(); render(); startTimer();
}

function startTimer(){
  clearInterval(timerId);
  timerId=setInterval(()=>{
    if(state.screen!=='game') return;
    state.seconds=Math.max(0,state.seconds-1);
    const el=document.querySelector('.timer');
    if(el){ el.textContent=timeText(state.seconds); el.classList.toggle('danger',state.seconds<180); }
    if(state.seconds===0){ clearInterval(timerId); say('시간은 끝났지만, 끝까지 도전할 수 있어요!'); }
    if(state.seconds%10===0) saveState();
  },1000);
}

function hud(){
  const pct=(state.stage/stages.length)*100;
  return `<header class="hud">
    <div class="brand"><div class="brand-mark">O</div><div class="brand-copy"><strong>OCEAN ESCAPE</strong><small>UNIT 5 · DISCOVER KOREA</small></div></div>
    <div class="progress"><div class="progress-label"><span>탈출 진행도</span><b>${state.stage} / ${stages.length}</b></div><div class="progress-line"><div class="progress-fill" style="width:${pct}%"></div></div></div>
    <div class="hud-actions"><div class="timer ${state.seconds<180?'danger':''}" aria-label="남은 시간">${timeText(state.seconds)}</div><button class="icon-btn" data-action="hint">힌트</button><button class="icon-btn" data-action="restart" aria-label="게임 다시 시작">↻</button></div>
  </header>`;
}

function missionContent(s){
  if(s.type==='hotspot'){
    const words=s.hotspots.map((h,i)=>`<span class="word-chip ${state.found.includes(i)?'':'empty'}">${state.found.includes(i)?h.w:'?'}</span>`).join('');
    const ready=state.found.length===s.hotspots.length;
    return `<p class="prompt">${esc(s.prompt)}</p><div class="found-row">${words}</div>${ready?`<div class="clue-box">${esc(s.question)}</div><div class="choices">${s.options.map(o=>`<button class="choice" data-choice="${o}">${o}</button>`).join('')}</div>`:'<p class="micro">사진 속 파란 신호 3개를 찾아 누르세요.</p>'}`;
  }
  if(s.type==='vocab'){
    const r=state.selections.round||0, item=s.rounds[r];
    return `<p class="micro">단어 카드 ${r+1} / ${s.rounds.length}</p><div class="clue-box">${esc(item.q)}</div><div class="choices">${item.o.map(o=>`<button class="choice" data-vocab="${o}">${o}</button>`).join('')}</div>`;
  }
  if(s.type==='order'){
    const built=state.selections.order||[];
    return `<p class="prompt">여행에 대한 소감을 묻는 문장을 만드세요.</p><div class="sentence-slot">${built.length?built.map(w=>`<span class="word-chip">${esc(w)}</span>`).join(''):'<span class="micro">카드를 차례대로 선택하세요</span>'}</div><div class="tile-bank">${s.words.map((w,i)=>`<button class="tile" data-tile="${i}" ${built.includes(w)?'disabled':''}>${esc(w)}</button>`).join('')}</div><button class="secondary" data-action="clear-order">다시 배열</button>`;
  }
  if(s.type==='match'){
    return `<p class="prompt">각 물건의 쓰임을 알맞게 고르세요.</p><div class="match-list">${s.rows.map((r,i)=>`<div class="match-row"><label for="m${i}">${esc(r.label)}</label><select id="m${i}" data-match="${i}"><option value="">선택</option>${r.options.map(o=>`<option ${state.selections['m'+i]===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`).join('')}</div><button class="primary" data-action="check-match">검색대 열기</button>`;
  }
  if(s.type==='tf'){
    return `<p class="prompt">본문과 일치하면 T, 일치하지 않으면 F를 선택하세요.</p>${s.rows.map((r,i)=>`<div class="tf-row"><p>${esc(r.q)}</p><button class="tf-btn ${state.selections['tf'+i]===true?'active':''}" data-tf="${i}:1">T</button><button class="tf-btn ${state.selections['tf'+i]===false?'active':''}" data-tf="${i}:0">F</button></div>`).join('')}<button class="primary" data-action="check-tf">기록 판별하기</button>`;
  }
  if(s.type==='grammar'){
    return `<p class="prompt">괄호에 들어갈 현재완료 표현을 고르세요.</p><div class="match-list">${s.sentence.map((r,i)=>`<div><p class="micro">${esc(r.pre)} <b style="color:var(--cyan)">[ &nbsp; ? &nbsp; ]</b> ${esc(r.post)}</p><select data-grammar="${i}"><option value="">선택</option>${r.options.map(o=>`<option ${state.selections['g'+i]===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`).join('')}</div><button class="primary" data-action="check-grammar">타임라인 복구</button>`;
  }
  if(s.type==='code'){
    const frags=state.fragments.map(f=>`<div class="fragment"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('');
    return `<p class="prompt">각 기록 조각이 가리키는 숫자를 순서대로 입력하세요.</p><div class="fragment-grid">${frags}</div><input class="code-input" inputmode="numeric" maxlength="4" aria-label="네 자리 암호" placeholder="••••"><button class="primary" data-action="unlock">피아노 열기</button>`;
  }
}

function renderGame(){
  const s=stages[state.stage];
  const hotspots=s.type==='hotspot'?`<div class="hotspots">${s.hotspots.map((h,i)=>`<button class="hotspot ${state.found.includes(i)?'found':''}" style="left:${h.x}%;top:${h.y}%" data-hotspot="${i}" aria-label="숨은 단어 ${i+1}"></button>`).join('')}</div>`:'';
  app.innerHTML=`<main class="shell"><img class="scene-bg" src="${s.image}" alt=""><div>${hud()}<div class="game">
    <section class="scene" aria-label="${esc(s.location)}"><div class="location-chip"><span></span>${esc(s.location)}</div>${hotspots}<div class="chapter"><div class="chapter-kicker">${esc(s.kicker)}</div><h1>${esc(s.title)}</h1><p>${esc(s.story)}</p></div></section>
    <aside class="mission"><div class="mission-head"><div><div class="eyebrow">CURRENT MISSION</div><h2>${esc(s.title)}</h2></div><div class="difficulty">난이도<br><b>${stars(s.difficulty)}</b></div></div><div class="mission-body">${missionContent(s)}</div></aside>
  </div></div>${state.hintOpen?hintPanel(s):''}</main>`;
}

function hintPanel(s){
  return `<div class="scrim" data-action="close-hint"></div><aside class="hint-panel open" aria-modal="true" role="dialog" aria-label="힌트"><button class="icon-btn" data-action="close-hint" style="float:right">닫기</button><div class="eyebrow">FIELD NOTE</div><h2>수사관의 힌트</h2><p>${esc(s.hint)}</p><p class="hint-cost">힌트를 열 때마다 제한 시간 1분이 차감됩니다.</p></aside>`;
}

function renderStart(){
  const hasSave=localStorage.getItem('oceanEscapeV1');
  app.innerHTML=`<main class="start"><section class="start-card"><div class="start-tag">OCEAN MIDDLE SCHOOL · CASE 05</div><h1>사라진<br><span>우정의 기록</span></h1><p class="start-lead">학교에 남겨진 일곱 개의 잠금 장치를 풀고, 춘천과 에티오피아를 잇는 기록을 되찾으세요. 초반 단서는 눈앞에 있지만 마지막 암호는 5과의 모든 지식을 요구합니다.</p><div class="brief"><span>⏱ 제한 시간 30분</span><span>◆ 7개 장소</span><span>영어 2 · Unit 5</span></div><button class="primary" data-action="start">수사 시작</button>${hasSave?'<button class="secondary" data-action="continue" style="width:auto;padding:0 24px;margin-left:8px">이어하기</button>':''}</section></main>`;
}

function renderComplete(){
  clearInterval(timerId); localStorage.removeItem('oceanEscapeV1');
  const used=TOTAL_SECONDS-state.seconds;
  const rank=state.hints===0&&state.mistakes<3?'S':state.mistakes<7?'A':'B';
  app.innerHTML=`<main class="complete"><section class="complete-card"><div class="seal">✓</div><div class="eyebrow">MISSION COMPLETE</div><h1>기록을 되찾았습니다</h1><p>교실에서 시작한 단서가 오션 라운지의 피아노를 열었습니다.<br>두 나라를 이어 온 우정처럼, 배운 표현들도 하나의 이야기로 연결되었습니다.</p><div class="score"><div><b>${timeText(used)}</b><small>탈출 시간</small></div><div><b>${state.hints}</b><small>사용한 힌트</small></div><div><b>${rank}</b><small>수사 등급</small></div></div><button class="primary" data-action="restart-complete" style="width:auto;padding:0 30px">다시 도전하기</button></section></main>`;
}

function render(){
  if(state.screen==='start') renderStart(); else if(state.screen==='complete') renderComplete(); else renderGame();
}

function addFragment(s){ if(s.fragment && !state.fragments.some(f=>f[1]===s.fragment[1])) state.fragments.push(s.fragment); }
function completeStage(){
  const s=stages[state.stage]; addFragment(s); say('잠금 해제! 다음 장소로 이동합니다.');
  setTimeout(()=>{ state.stage++; state.found=[]; state.selections={}; if(state.stage>=stages.length) state.screen='complete'; saveState(); render(); },650);
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  const a=b.dataset.action;
  if(a==='start'){ localStorage.removeItem('oceanEscapeV1'); startGame(); return; }
  if(a==='continue'){ state.screen='game'; render(); startTimer(); return; }
  if(a==='restart'||a==='restart-complete'){ if(a==='restart-complete'||confirm('처음부터 다시 시작할까요?')) startGame(); return; }
  if(a==='hint'){ if(!state.hintOpen){ state.hintOpen=true; state.hints++; state.seconds=Math.max(0,state.seconds-60); saveState(); render(); } return; }
  if(a==='close-hint'){ state.hintOpen=false; render(); return; }
  if(b.dataset.hotspot!==undefined){ const i=+b.dataset.hotspot; if(!state.found.includes(i)){ state.found.push(i); say(`단어 ${stages[state.stage].hotspots[i].w} 발견!`); saveState(); render(); } return; }
  if(b.dataset.choice){ if(b.dataset.choice===stages[state.stage].answer) completeStage(); else fail('동사의 과거분사형이 필요해요.'); return; }
  if(b.dataset.vocab){ const s=stages[state.stage],r=state.selections.round||0; if(b.dataset.vocab===s.rounds[r].a){ if(r===s.rounds.length-1) completeStage(); else {state.selections.round=r+1;say('정답! 다음 뜻풀이입니다.');render();} } else fail('뜻풀이의 핵심 단어를 다시 확인하세요.'); return; }
  if(b.dataset.tile!==undefined){ const s=stages[state.stage],word=s.words[+b.dataset.tile],arr=state.selections.order||[]; arr.push(word); state.selections.order=arr; if(arr.length===s.answer.length){ if(arr.every((w,i)=>w===s.answer[i])) completeStage(); else {fail('어순이 맞지 않아요. 다시 배열해 보세요.');state.selections.order=[];setTimeout(render,450);} } else render(); return; }
  if(a==='clear-order'){state.selections.order=[];render();return;}
  if(b.dataset.tf){const [i,v]=b.dataset.tf.split(':');state.selections['tf'+i]=v==='1';render();return;}
  if(a==='check-tf'){const s=stages[state.stage]; if(s.rows.every((r,i)=>state.selections['tf'+i]===r.a))completeStage();else fail('세 기록 중 조작된 내용이 있어요.');return;}
  if(a==='check-match'){const s=stages[state.stage];if(s.rows.every((r,i)=>state.selections['m'+i]===r.answer))completeStage();else fail('물건과 쓰임의 연결을 다시 확인하세요.');return;}
  if(a==='check-grammar'){const s=stages[state.stage];if(s.sentence.every((r,i)=>state.selections['g'+i]===r.answer))completeStage();else fail('have/has + 과거분사 형태를 확인하세요.');return;}
  if(a==='unlock'){const val=document.querySelector('.code-input').value.trim();if(val===stages[state.stage].answer)completeStage();else fail('기록 조각을 숫자로 바꾸는 규칙을 다시 찾아보세요.');}
});

app.addEventListener('change',e=>{
  if(e.target.dataset.match!==undefined) state.selections['m'+e.target.dataset.match]=e.target.value;
  if(e.target.dataset.grammar!==undefined) state.selections['g'+e.target.dataset.grammar]=e.target.value;
  saveState();
});

function currentToolPuzzle(){
  if(state.screen==='start') return {screen:'start',instruction:'Start the escape game.'};
  if(state.screen==='complete') return {screen:'complete',progress:`${stages.length}/${stages.length}`};
  const s=stages[state.stage];
  const shape={hotspot:'a single option word',vocab:'three vocabulary words in order',order:'the completed question',match:'three to-infinitive phrases in order',tf:'three true/false values in order',grammar:'three grammar choices in order',code:'a four-digit code'}[s.type];
  return {screen:'game',stage:state.stage+1,totalStages:stages.length,title:s.title,location:s.location,answerFormat:shape,remainingSeconds:state.seconds};
}

function registerWebMCP(){
  const context=document.modelContext;
  if(!context?.registerTool) return;
  const register=tool=>{ try{ Promise.resolve(context.registerTool(tool)).catch(()=>{}); }catch(e){} };
  register({
    name:'read_escape_status', title:'방탈출 진행 상태 읽기',
    description:'Read the visible Ocean Middle School escape-game stage, location, required answer format, progress, and remaining time.',
    inputSchema:{type:'object',properties:{},additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:false},
    execute(){ return currentToolPuzzle(); }
  });
  register({
    name:'start_escape_game', title:'방탈출 시작하기',
    description:'Start or restart the visible Unit 5 escape game from chapter 1.',
    inputSchema:{type:'object',properties:{},additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(){ startGame(); return currentToolPuzzle(); }
  });
  register({
    name:'submit_escape_answer', title:'현재 미션 정답 제출',
    description:'Submit one answer for the currently visible puzzle. Use read_escape_status first to learn the expected format.',
    inputSchema:{type:'object',properties:{answer:{description:'A string, or an ordered array of strings or booleans, matching the current puzzle format.'}},required:['answer'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    async execute(input){
      if(state.screen!=='game') throw new Error('The game is not currently in progress.');
      const s=stages[state.stage], a=input?.answer;
      let ok=false;
      if(s.type==='hotspot'){ ok=a===s.answer; if(ok) state.found=s.hotspots.map((_,i)=>i); }
      if(s.type==='vocab') ok=Array.isArray(a)&&a.length===s.rounds.length&&a.every((v,i)=>v===s.rounds[i].a);
      if(s.type==='order') ok=a===s.answer.join(' ');
      if(s.type==='match') ok=Array.isArray(a)&&a.length===s.rows.length&&a.every((v,i)=>v===s.rows[i].answer);
      if(s.type==='tf') ok=Array.isArray(a)&&a.length===s.rows.length&&a.every((v,i)=>v===s.rows[i].a);
      if(s.type==='grammar') ok=Array.isArray(a)&&a.length===s.sentence.length&&a.every((v,i)=>v===s.sentence[i].answer);
      if(s.type==='code') ok=String(a)===s.answer;
      if(!ok){ state.mistakes++; saveState(); throw new Error('Incorrect answer for the current puzzle.'); }
      completeStage(); await new Promise(resolve=>setTimeout(resolve,720)); return currentToolPuzzle();
    }
  });
}

loadState(); render(); if(state.screen==='game') startTimer(); registerWebMCP();
}

(() => {
  'use strict';

  const root = document.querySelector('#app');
  const toastNode = document.querySelector('#toast');
  const SAVE_KEY = 'ocean-night-record-v2';
  const MAX_SLOTS = 7;

  const ITEMS = {
    pageA: { name: '찢어진 종이 A', glyph: '◩', description: '비에 젖은 종이의 왼쪽 조각. 문장 일부만 보인다.' },
    lockerKey: { name: '12번 열쇠', glyph: '⚿', description: '손때 묻은 작은 사물함 열쇠. 12라는 숫자가 새겨져 있다.' },
    pageB: { name: '찢어진 종이 B', glyph: '◪', description: '오른쪽 조각. 다른 조각과 이어 붙일 수 있을 것 같다.' },
    blueFilter: { name: '청색 필터', glyph: '▣', description: '어두운 곳의 숨은 글씨를 읽게 해 주는 투명 필터.' },
    restoredNote: { name: '복원된 기록', glyph: '▤', description: 'ONLY · SECOND · THREE · 2006에 붉은 밑줄이 있다.' },
    accessCard: { name: 'DS실 카드', glyph: '▥', description: 'DS실 출입 카드.' },
    pianoKey: { name: '피아노 열쇠', glyph: '♩', description: '오션 라운지의 오래된 피아노 덮개 열쇠.' }
  };

  const SCENES = {
    exterior: { name: '오션중학교 · 중앙 현관', image: 'assets/horror-exterior.png?v=6' },
    classFront: { name: '2층 일반교실 · 앞쪽', image: 'assets/horror-class-front.png?v=6' },
    classSide: { name: '2층 일반교실 · 창가', image: 'assets/horror-class-side.png?v=6' },
    homebase: { name: '2층 홈베이스', image: 'assets/horror-homebase.png?v=6' },
    library: { name: '도서관 · 자료 열람실', image: 'assets/horror-library.png?v=6' },
    digital: { name: 'DS실', image: 'assets/horror-digital.png?v=6' },
    lounge: { name: '오션 라운지', image: 'assets/horror-lounge.png?v=6' }
  };

  const freshState = () => ({
    screen: 'start', scene: 'exterior', inventory: [], selected: [], journal: [],
    flags: {}, log: '정문은 잠기지 않았다. 안쪽에서 희미한 전자음이 들린다.',
    modal: null, startedAt: 0, elapsed: 0, mistakes: 0, hints: 0, sequenceStep: 0, sequenceChosen: [], pianoNotes: []
  });

  let state = freshState();
  let ticker = null;
  let transitioning = false;

  function safeLoad() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && saved.screen === 'game') state = { ...freshState(), ...saved, modal: null };
    } catch (_) { /* start fresh */ }
  }

  function save() {
    const copy = { ...state, modal: null, elapsed: currentElapsed() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(copy));
  }

  function currentElapsed() {
    return state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) + state.elapsed : state.elapsed;
  }

  function timeText(sec = currentElapsed()) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    clearInterval(ticker);
    if (!state.startedAt) state.startedAt = Date.now();
    ticker = setInterval(() => {
      const node = document.querySelector('[data-clock]');
      if (node) node.textContent = timeText();
    }, 1000);
  }

  function notify(message) {
    toastNode.textContent = message;
    toastNode.classList.add('show');
    setTimeout(() => toastNode.classList.remove('show'), 1900);
  }

  function addJournal(text) {
    if (!state.journal.includes(text)) state.journal.push(text);
  }

  function has(item) { return state.inventory.includes(item); }

  function addItem(item) {
    if (!has(item)) {
      state.inventory.push(item);
      notify(`${ITEMS[item].name}을(를) 얻었다.`);
    }
  }

  function removeItem(item) {
    state.inventory = state.inventory.filter(id => id !== item);
    state.selected = state.selected.filter(id => id !== item);
  }

  function objective() {
    if (!state.flags.boardSolved) return ['첫 번째 신호', '교실의 꺼진 전자칠판을 조사해 잠금 문제를 풀어라.', 'Have you ever 뒤에는 과거분사 형태가 옵니다.'];
    if (!state.flags.pageA) return ['첫 번째 흔적', '교실 바닥에 떨어진 것을 찾아라.', '반짝이는 지점을 눌러 자세히 조사하세요.'];
    if (!state.flags.lockerOpened) return ['사라진 기록', '교실 책상 서랍에서 12번 사물함의 열쇠를 찾고 홈베이스로 가라.', '창가 쪽 책상들의 서랍을 자세히 살펴보세요.'];
    if (!state.flags.noteCombined) return ['둘로 나뉜 기록', '종이 조각 두 장을 인벤토리에서 선택해 조합하라.', '아이템 두 개를 고른 뒤 ‘조합’을 누르세요.'];
    if (!state.flags.libraryOpen) return ['네 개의 밑줄', '복원된 기록의 강조어를 숫자로 바꿔 도서관 문을 열어라.', '영어 서수와 연도를 관찰하세요.'];
    if (!state.flags.librarySolved) return ['어둠 속 어휘', '청색 필터로 도서관 서가의 숨은 글씨를 읽어라.', '필터를 선택한 상태로 서가를 조사하세요.'];
    if (!state.flags.digitalSolved) return ['끊어진 문장', '출입 카드로 DS실에 들어가 세 문장을 복구하라.', '5과의 의사소통 표현, 현재완료와 to부정사를 떠올리세요.'];
    if (!state.flags.pianoUnlocked) return ['마지막 연주', '피아노 악보의 네 문장을 풀어 건반 순서를 찾아라.', '각 문장의 정답이 몇 번째 선택지인지 차례로 연주하세요.'];
    if (!state.flags.finished) return ['마지막 증언', '피아노 안의 기록을 읽고 우정의 역사를 완성하라.', '여러 방에서 모은 기록을 다시 확인하세요.'];
    return ['탈출 성공', '오션중학교의 21시 기록을 복원했다.', '모든 단서가 하나의 역사로 이어졌다.'];
  }

  function hotspots() {
    const spots = {
      exterior: [
        { x: 52, y: 68, label: '현관으로 들어간다', kind: 'exit', action: 'go', value: 'classFront' }
      ],
      classFront: [
        { x: 50, y: 34, label: '전원이 꺼진 전자칠판', action: 'board' },
        { x: 89, y: 49, label: '복도로 나간다', kind: 'exit', action: 'go', value: 'homebase' },
        { x: 10, y: 53, label: '창가 쪽으로 시선을 돌린다', kind: 'exit', action: 'go', value: 'classSide' }
      ],
      classSide: [
        ...(!state.flags.pageA ? [{ x: 44, y: 74, label: '바닥의 구겨진 종이', kind: 'item', action: 'pickup', value: 'pageA' }] : []),
        ...(!state.flags.keyFound && state.flags.boardSolved ? [{ x: 34, y: 51, label: '책상 서랍 안의 반짝임', kind: 'item', action: 'pickup', value: 'lockerKey' }] : []),
        { x: 11, y: 48, label: '교실 앞쪽을 본다', kind: 'exit', action: 'go', value: 'classFront' }
      ],
      homebase: [
        { x: 51, y: 63, label: '12번 사물함', action: 'locker' },
        { x: 85, y: 54, label: '도서관 방화문', kind: 'exit', action: 'libraryDoor' },
        { x: 13, y: 57, label: '일반교실로 돌아간다', kind: 'exit', action: 'go', value: 'classFront' },
        ...(state.flags.librarySolved ? [{ x: 69, y: 48, label: 'DS실 출입문', kind: 'exit', action: 'digitalDoor' }] : [])
      ],
      library: [
        { x: 50, y: 59, label: '곡선 서가의 숨은 표식', action: 'shelf' },
        { x: 9, y: 66, label: '홈베이스로 돌아간다', kind: 'exit', action: 'go', value: 'homebase' }
      ],
      digital: [
        { x: 38, y: 38, label: '켜진 대형 화면', action: 'monitor' },
        { x: 7, y: 49, label: '홈베이스로 돌아간다', kind: 'exit', action: 'go', value: 'homebase' },
        ...(state.flags.digitalSolved ? [{ x: 88, y: 49, label: '오션 라운지로 간다', kind: 'exit', action: 'go', value: 'lounge' }] : [])
      ],
      lounge: [
        { x: 83, y: 54, label: '잠긴 피아노', action: 'piano' },
        { x: 7, y: 53, label: 'DS실로 돌아간다', kind: 'exit', action: 'go', value: 'digital' }
      ]
    };
    return spots[state.scene] || [];
  }

  function hotspotMarkup(spot) {
    return `<button class="hotspot ${spot.kind || ''}" style="left:${spot.x}%;top:${spot.y}%" data-action="${spot.action}" ${spot.value ? `data-value="${spot.value}"` : ''} aria-label="${spot.label}"><span class="tip">${spot.label}</span></button>`;
  }

  function inventoryMarkup() {
    const slots = [...state.inventory];
    while (slots.length < MAX_SLOTS) slots.push(null);
    return slots.map((item, index) => item
      ? `<button class="slot ${state.selected.includes(item) ? 'selected' : ''}" data-action="selectItem" data-value="${item}" aria-label="${ITEMS[item].name}"><span class="glyph">${ITEMS[item].glyph}</span><span class="name">${ITEMS[item].name}</span></button>`
      : `<div class="slot empty" aria-label="빈 칸"><span class="glyph">·</span><span class="name">${index + 1}</span></div>`).join('');
  }

  function modalMarkup() {
    if (!state.modal) return '';
    const type = state.modal;
    let body = '';
    if (type === 'board') body = `<div class="eyebrow">교실 전자칠판 · 비상 전원</div><h2>멈춘 문장을 완성하라</h2><p>화면은 꺼져 있지만 아래쪽 비상 표시창에 한 문장만 희미하게 남아 있다.</p><div class="dark-screen-note"><strong>Have you ever ___ Chuncheon?</strong><small>알맞은 말을 선택하면 마지막 위치 정보가 나타난다.</small></div><div class="board-options"><button class="token" data-action="answerBoard" data-value="visit">visit</button><button class="token" data-action="answerBoard" data-value="visited">visited</button><button class="token" data-action="answerBoard" data-value="visiting">visiting</button></div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">나중에</button></div>`;
    if (type === 'pageA') body = `<div class="eyebrow">습득한 단서</div><h2>찢어진 종이 A</h2><div class="clue-paper">Ethiopia was the <strong>ONLY</strong> African country<br>to send soldiers during the Korean <span class="cut">War...</span><br><br><span class="cut">The me...</span> has THREE round <span class="cut">roofs...</span></div><p>오른쪽 절반이 있어야 내용을 읽을 수 있다.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">접어 둔다</button></div>`;
    if (type === 'restoredNote') body = `<div class="eyebrow">조합 성공</div><h2>복원된 우정의 기록</h2><div class="clue-paper">Ethiopia was the <strong>ONLY</strong> African country to send soldiers.<br><br>The <strong>SECOND</strong> floor displays cultural items.<br><br>The house has <strong>THREE</strong> round roofs.<br><br>The memorial was built in <strong>2006</strong>.<br><br><em>“밑줄 친 네 부분을 한 자리씩 읽어라.”</em></div><p>서수는 숫자로, 연도는 마지막 한 자리로 바꾸면 네 자리 암호가 된다.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">기록한다</button></div>`;
    if (type === 'libraryKeypad') body = `<div class="eyebrow">도서관 방화문</div><h2>4자리 기록 번호</h2><p>복원된 종이의 붉은 밑줄 네 개가 순서대로 열쇠가 된다.</p><label class="field-label" for="codeAnswer">암호 입력</label><input id="codeAnswer" class="code-input" inputmode="numeric" maxlength="4" autocomplete="off"><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">취소</button><button class="button primary" data-action="submitCode">해제</button></div>`;
    if (type === 'shelfPuzzle') body = `<div class="eyebrow">청색 필터로 드러난 글씨</div><h2>세 권의 책</h2><p>각 뜻풀이에 맞는 5과 단어를 영어로 입력하라. 세 단어가 모두 맞아야 서랍이 열린다.</p><label class="field-label">1. a person who travels to a place for pleasure</label><input class="code-input answer-input" data-vocab="0" autocomplete="off"><label class="field-label">2. a person who wears a uniform and protects a country</label><input class="code-input answer-input" data-vocab="1" autocomplete="off"><label class="field-label">3. to show great respect to someone</label><input class="code-input answer-input" data-vocab="2" autocomplete="off"><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">나중에</button><button class="button primary" data-action="submitVocab">서가 조사</button></div>`;
    if (type === 'sequence') body = sequenceMarkup();
    if (type === 'pianoCode') body = pianoCodeMarkup();
    if (type === 'final') body = `<div class="eyebrow">피아노 내부의 마지막 기록</div><h2>새로운 우정의 증언</h2><p>앞에서 풀지 않았던 세 문장의 빈칸을 영어로 완성하라.</p><label class="field-label">1. Ethiopian soldiers used their own money to ____ Korean children.</label><input class="code-input answer-input" data-final="0" autocomplete="off"><label class="field-label">2. The Memorial Hall in Chuncheon has three round ____.</label><input class="code-input answer-input" data-final="1" autocomplete="off"><label class="field-label">3. Kate ____ to Ethiopia once. (두 단어)</label><input class="code-input answer-input" data-final="2" autocomplete="off"><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">기록 다시 보기</button><button class="button primary" data-action="submitFinal">기록 완성</button></div>`;
    if (type === 'journal') body = `<div class="eyebrow">조사 수첩</div><h2>발견한 기록</h2><ul class="journal-list">${state.journal.length ? state.journal.map(x => `<li>${x}</li>`).join('') : '<li>아직 기록한 단서가 없다.</li>'}</ul><div class="modal-actions"><button class="button primary" data-action="closeModal">닫기</button></div>`;
    if (type === 'hint') body = `<div class="eyebrow">현재 단계 힌트</div><h2>조금만 더 자세히</h2><p>${hintText()}</p><div class="modal-actions"><button class="button primary" data-action="closeModal">계속 조사</button></div>`;
    if (type === 'item') {
      const item = state.modalItem;
      body = `<div class="eyebrow">소지품</div><h2>${ITEMS[item].glyph} ${ITEMS[item].name}</h2><p>${ITEMS[item].description}</p><div class="modal-actions"><button class="button primary" data-action="closeModal">닫기</button></div>`;
    }
    return `<div class="modal-backdrop" role="dialog" aria-modal="true"><section class="modal">${body}</section></div>`;
  }

  const sequences = [
    { prompt: '현재까지 이어진 관계를 나타내는 문장', tokens: ['for many years.', 'strong ties', 'Ethiopia', 'with Korea', 'has had'], answer: ['Ethiopia', 'has had', 'strong ties', 'with Korea', 'for many years.'] },
    { prompt: '관람할 문화 물품이 많다는 문장', tokens: ['on the second floor.', 'There are', 'to see', 'many cultural items'], answer: ['There are', 'many cultural items', 'to see', 'on the second floor.'] },
    { prompt: '춘천 여행에 대한 소감을 묻는 문장', tokens: ['the trip?', 'you', 'How', 'like', 'did'], answer: ['How', 'did', 'you', 'like', 'the trip?'] }
  ];

  function sequenceMarkup() {
    const seq = sequences[state.sequenceStep];
    const chosen = state.sequenceChosen;
    return `<div class="eyebrow">화면 ${state.sequenceStep + 1} / ${sequences.length}</div><h2>끊어진 문장 신호</h2><p>${seq.prompt}. 아래 조각을 올바른 순서로 누르세요.</p><div class="token-board" aria-label="조립한 문장">${chosen.map((t, i) => `<button class="token" data-action="removeToken" data-value="${i}">${t}</button>`).join('') || '<span style="color:var(--muted)">여기에 문장을 조립하세요.</span>'}</div><div class="token-board" aria-label="문장 조각">${seq.tokens.map(t => `<button class="token ${chosen.includes(t) ? 'chosen' : ''}" data-action="addToken" data-value="${t}" ${chosen.includes(t) ? 'disabled' : ''}>${t}</button>`).join('')}</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetTokens">다시 배열</button><button class="button primary" data-action="submitSequence">신호 전송</button></div>`;
  }

  function pianoCodeMarkup() {
    const notes = state.pianoNotes || [];
    const noteNames = ['도', '레', '미', '파', '솔', '라', '시'];
    return `<div class="eyebrow">피아노 위의 낡은 악보</div><h2>정답의 번호를 연주하라</h2><p>각 문장의 빈칸에 맞는 말을 고르고, 그 선택지의 번호를 위에서부터 누르세요.</p><ol class="music-clues"><li>Have you ever ___ Chuncheon?<br><span>① visit　② visited　③ visiting</span></li><li>There are many cultural items ___ on the second floor.<br><span>① seeing　② to see　③ saw</span></li><li>Ethiopia ___ the only African country to send soldiers.<br><span>① was　② were　③ is</span></li><li>How did you ___ the trip?<br><span>① liked　② like　③ liking</span></li></ol><div class="note-display" aria-label="입력한 건반">${notes.length ? notes.map(n => `<span>${n}</span>`).join('') : '<em>— — — —</em>'}</div><div class="piano-keyboard" aria-label="피아노 건반"><div class="white-keys">${noteNames.map((name, i) => `<button class="piano-white" data-action="pianoNote" data-value="${i + 1}" ${notes.length >= 4 ? 'disabled' : ''}><b>${name}</b><small>${i + 1}</small></button>`).join('')}</div><div class="black-keys" aria-hidden="true"><i style="left:14.3%"></i><i style="left:28.6%"></i><i style="left:57.1%"></i><i style="left:71.4%"></i><i style="left:85.7%"></i></div></div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetPiano">다시 연주</button><button class="button primary" data-action="submitPianoCode">잠금 해제</button></div>`;
  }

  function hintText() {
    state.hints += 1;
    const [,, base] = objective();
    if (!state.flags.libraryOpen && state.flags.noteCombined) return 'ONLY=1, SECOND=2, THREE=3, 그리고 2006에서는 마지막 숫자만 읽습니다.';
    if (!state.flags.librarySolved && state.flags.libraryOpen) return '청색 필터를 먼저 인벤토리에서 선택한 다음, 가운데 곡선 서가를 누르세요.';
    if (!state.flags.digitalSolved && state.flags.librarySolved) return '현재완료는 has had, 목적을 나타내는 to부정사는 to see입니다.';
    if (!state.flags.pianoUnlocked && state.flags.digitalSolved) return '네 문장의 정답 선택지 번호는 차례로 2, 2, 1, 2입니다.';
    return base;
  }

  function render() {
    if (state.screen === 'start') {
      root.innerHTML = `<main class="start-screen"><div class="start-bg"></div><section class="start-card"><div class="eyebrow">UNIT 5 · DISCOVER KOREA</div><h1>21시의 기록<span>오션중학교 방과후 교내 조사</span></h1><p>방과후 수업이 끝난 뒤, 학교의 모든 전자문이 잠겼다. 흩어진 우정의 기록을 복원해야만 중앙 현관을 다시 열 수 있다.</p><div class="warning">장면의 희미한 표식을 조사하세요. 물건은 인벤토리에서 선택하거나 두 개를 조합할 수 있습니다. 공포 연출은 있지만 괴물과 잔혹 표현은 없습니다.</div><button class="button primary" data-action="start">학교에 들어가기</button></section></main>`;
      bind(); return;
    }
    if (state.screen === 'ending') { renderEnding(); return; }
    const [chapter, title, sub] = objective();
    const scene = SCENES[state.scene];
    root.innerHTML = `<main class="game"><div class="scene ${transitioning ? 'is-transitioning' : ''}"><img class="scene-image" src="${scene.image}" alt="${scene.name}" draggable="false">${hotspots().map(hotspotMarkup).join('')}</div><div class="grain"></div><div class="hud"><div class="topbar"><section class="objective"><div class="eyebrow">${chapter}</div><strong>${title}</strong><small>${sub}</small></section><div class="top-actions"><div class="status-chip">◷ <b data-clock>${timeText()}</b></div><button class="icon-button" data-action="showHint" aria-label="힌트">? <span>힌트</span></button><button class="icon-button" data-action="showJournal" aria-label="조사 수첩">▤ <span>수첩</span></button></div></div><div class="scene-label">${scene.name}</div><div class="log-box" aria-live="polite"><strong>조사</strong>${state.log}</div></div><section class="inventory-wrap"><div class="inventory-head"><span>INVENTORY · ${state.inventory.length}/${MAX_SLOTS}</span><span>${state.selected.length ? `${state.selected.length}개 선택됨` : '아이템을 선택하세요'}</span></div><div class="inventory">${inventoryMarkup()}<button class="combine-button" data-action="combine" ${state.selected.length !== 2 ? 'disabled' : ''}>조합</button></div></section>${modalMarkup()}</main>`;
    bind(); save();
  }

  function renderEnding() {
    clearInterval(ticker);
    root.innerHTML = `<main class="start-screen"><div class="start-bg"></div><section class="start-card ending"><div class="ending-mark">◇</div><div class="eyebrow">RECORD RESTORED</div><h1>탈출 성공<span>우정은 기록보다 오래 남는다</span></h1><p>에티오피아와 한국의 오랜 우정에 관한 기록을 모두 복원했습니다.</p><div class="ending-stats"><div><strong>${timeText(state.elapsed)}</strong>소요 시간</div><div><strong>${state.mistakes}</strong>오답</div><div><strong>${state.hints}</strong>힌트</div></div><button class="button primary" data-action="restart">처음부터 다시 하기</button></section></main>`;
    bind();
  }

  function bind() {
    root.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => act(el.dataset.action, el.dataset.value)));
  }

  function go(scene) {
    if (transitioning) return;
    transitioning = true;
    setTimeout(() => {
      state.scene = scene; transitioning = false;
      const messages = {
        classFront: '빗소리가 멀어졌다. 교실 안에는 전자칠판의 대기음만 남아 있다.',
        classSide: '창가 쪽 바닥에 누군가 급히 떨어뜨린 흔적이 보인다.',
        homebase: '사물함들이 늘어서 있다. 12번 문에 긁힌 자국이 선명하다.',
        library: '오래된 나무 냄새가 난다. 가운데 서가에 푸른 흔적이 번져 있다.',
        digital: 'DS실의 빈 모니터 사이에서 대형 화면 하나만 불규칙하게 깜박인다.',
        lounge: '달빛 아래 피아노 한 대만 따뜻한 빛을 받고 있다.'
      };
      state.log = messages[scene] || '다시 익숙한 장소로 돌아왔다.'; render();
    }, 90);
  }

  function openModal(type) { state.modal = type; render(); setTimeout(() => root.querySelector('.modal button, .modal input')?.focus(), 0); }
  function closeModal() { state.modal = null; state.modalItem = null; render(); }
  function error(message) { const node = root.querySelector('[data-error]'); if (node) node.textContent = message; state.mistakes += 1; save(); }

  function act(action, value) {
    if (action === 'start') { state = freshState(); state.screen = 'game'; state.startedAt = Date.now(); render(); startTimer(); return; }
    if (action === 'restart') { localStorage.removeItem(SAVE_KEY); state = freshState(); render(); return; }
    if (action === 'go') return go(value);
    if (action === 'closeModal') return closeModal();
    if (action === 'showJournal') return openModal('journal');
    if (action === 'showHint') return openModal('hint');
    if (action === 'board') return inspectBoard();
    if (action === 'answerBoard') return answerBoard(value);
    if (action === 'pickup') return pickup(value);
    if (action === 'locker') return openLocker();
    if (action === 'selectItem') return selectItem(value);
    if (action === 'combine') return combineItems();
    if (action === 'libraryDoor') return libraryDoor();
    if (action === 'submitCode') return submitCode();
    if (action === 'shelf') return inspectShelf();
    if (action === 'submitVocab') return submitVocab();
    if (action === 'digitalDoor') return digitalDoor();
    if (action === 'monitor') return monitor();
    if (action === 'addToken') { if (!state.sequenceChosen.includes(value)) state.sequenceChosen.push(value); return render(); }
    if (action === 'removeToken') { state.sequenceChosen.splice(Number(value), 1); return render(); }
    if (action === 'resetTokens') { state.sequenceChosen = []; return render(); }
    if (action === 'submitSequence') return submitSequence();
    if (action === 'piano') return piano();
    if (action === 'pianoNote') { if ((state.pianoNotes || []).length < 4) state.pianoNotes.push(value); return render(); }
    if (action === 'resetPiano') { state.pianoNotes = []; return render(); }
    if (action === 'submitPianoCode') return submitPianoCode();
    if (action === 'submitFinal') return submitFinal();
  }

  function pickup(item) {
    addItem(item);
    if (item === 'pageA') { state.flags.pageA = true; state.log = '종이 한쪽이 찢겨 있다. 반대쪽 조각이 학교 어딘가에 있다.'; addJournal('종이 A: ONLY, THREE가 붉게 표시되어 있다.'); openModal('pageA'); }
    if (item === 'lockerKey') { state.flags.keyFound = true; state.log = '책상 서랍 안에 숨겨진 12번 사물함 열쇠다. 홈베이스에서 맞는 문을 찾아야 한다.'; addJournal('교실 책상 서랍에서 “12”가 새겨진 열쇠를 발견했다.'); render(); }
  }

  function inspectBoard() {
    if (state.flags.boardSolved) { state.log = '비상 표시창에는 “창가 쪽 세 번째 책상 서랍”이라는 위치 정보가 남아 있다.'; return render(); }
    openModal('board');
  }

  function answerBoard(answer) {
    if (answer !== 'visited') return error('표시창이 다시 어두워진다. Have you ever 뒤에 오는 동사 형태를 확인하자.');
    state.flags.boardSeen = true; state.flags.boardSolved = true; state.modal = null;
    state.log = '정답을 누르자 비상 표시창에 “창가 쪽 세 번째 책상 서랍”이 나타났다.';
    addJournal('전자칠판: Have you ever visited Chuncheon? — have + 과거분사 visited.');
    notify('책상 서랍의 위치가 드러났다.'); render();
  }

  function openLocker() {
    if (state.flags.lockerOpened) { state.log = '12번 사물함은 비어 있다. 안에서 찾은 물건은 인벤토리에 있다.'; return render(); }
    if (!has('lockerKey') || !state.selected.includes('lockerKey')) { state.log = has('lockerKey') ? '12번 열쇠를 인벤토리에서 먼저 선택해야 한다.' : '열쇠 구멍이 있다. 교실 어딘가에 맞는 열쇠가 있을 것이다.'; return render(); }
    removeItem('lockerKey'); addItem('pageB'); addItem('blueFilter'); state.flags.lockerOpened = true; state.log = '사물함 안에서 종이의 나머지 절반과 청색 필터를 찾았다.'; addJournal('종이 B: SECOND, 2006이 붉게 표시되어 있다.'); render();
  }

  function selectItem(item) {
    if (state.selected.includes(item)) state.selected = state.selected.filter(id => id !== item);
    else { if (state.selected.length === 2) state.selected.shift(); state.selected.push(item); }
    state.log = `${ITEMS[item].name}: ${ITEMS[item].description}`; render();
  }

  function combineItems() {
    const pair = [...state.selected].sort().join('+');
    if (pair === ['pageA', 'pageB'].sort().join('+')) {
      removeItem('pageA'); removeItem('pageB'); addItem('restoredNote'); state.flags.noteCombined = true; state.selected = []; addJournal('복원 기록: ONLY → SECOND → THREE → 2006. 한 자리 숫자로 읽으면 1-2-3-6.'); state.log = '두 조각의 찢어진 면이 정확히 맞는다. 네 개의 밑줄이 하나의 암호를 만든다.'; openModal('restoredNote');
    } else { state.log = '두 물건은 서로 맞지 않는다.'; state.selected = []; render(); }
  }

  function libraryDoor() {
    if (state.flags.libraryOpen) return go('library');
    if (!state.flags.noteCombined) { state.log = '숫자 키패드가 켜져 있다. 아직 네 자리 암호를 알 수 없다.'; return render(); }
    openModal('libraryKeypad');
  }

  function submitCode() {
    const answer = root.querySelector('#codeAnswer')?.value.trim();
    if (answer !== '1236') return error('짧은 경고음이 난다. 밑줄 네 개를 다시 한 자리씩 바꾸어 보자.');
    state.flags.libraryOpen = true; state.modal = null; addJournal('도서관 문 암호 1236: ONLY(1), SECOND(2), THREE(3), 2006의 끝자리(6).'); state.log = '잠금 장치가 풀렸다. 도서관 안쪽에서 푸른 표식이 반짝인다.'; notify('도서관 문이 열렸다.'); render();
  }

  function inspectShelf() {
    if (state.flags.librarySolved) { state.log = '숨은 서랍은 이미 열려 있다.'; return render(); }
    if (!state.selected.includes('blueFilter')) { state.log = has('blueFilter') ? '글씨가 너무 어둡다. 청색 필터를 선택해 서가에 대 보자.' : '푸른 흔적은 보이지만 글씨를 읽을 수 없다.'; return render(); }
    openModal('shelfPuzzle');
  }

  function submitVocab() {
    const answers = [...root.querySelectorAll('[data-vocab]')].map(n => n.value.trim().toLowerCase());
    if (answers.join('|') !== 'tourist|soldier|honor') return error('한 권이 움직이지 않는다. 뜻풀이와 철자를 모두 확인하자.');
    removeItem('blueFilter'); addItem('accessCard'); state.flags.librarySolved = true; state.selected = []; state.modal = null; state.log = '세 권을 차례로 누르자 숨은 서랍에서 DS실 출입 카드가 나왔다.'; addJournal('어휘: tourist(관광객), soldier(군인), honor(기리다).'); notify('DS실 출입 카드를 얻었다.'); render();
  }

  function digitalDoor() {
    if (!state.selected.includes('accessCard')) { state.log = '카드 인식기가 붉게 깜박인다. 출입 카드를 선택해야 한다.'; return render(); }
    state.selected = []; go('digital');
  }

  function monitor() {
    if (state.flags.digitalSolved) { state.log = '복원된 문장과 함께 라운지 방향 화살표가 떠 있다.'; return render(); }
    state.sequenceStep = 0; state.sequenceChosen = []; openModal('sequence');
  }

  function submitSequence() {
    const seq = sequences[state.sequenceStep];
    if (state.sequenceChosen.join('|') !== seq.answer.join('|')) return error('신호가 끊겼다. 문장 성분과 시제를 다시 확인하자.');
    if (state.sequenceStep < sequences.length - 1) { state.sequenceStep += 1; state.sequenceChosen = []; notify(`${state.sequenceStep}번째 문장 복구 완료.`); return render(); }
    removeItem('accessCard'); addItem('pianoKey'); state.flags.digitalSolved = true; state.selected = []; state.modal = null; state.log = '세 문장이 연결되며 화면 아래에서 작은 피아노 열쇠가 떨어졌다.'; addJournal('현재완료: Ethiopia has had strong ties with Korea for many years.'); addJournal('to부정사의 형용사적 용법: many cultural items to see.'); addJournal('여행 소감 묻기: How did you like the trip?'); notify('피아노 열쇠를 얻었다.'); render();
  }

  function piano() {
    if (!state.selected.includes('pianoKey') && !state.flags.pianoUnlocked) { state.log = has('pianoKey') ? '피아노 열쇠를 인벤토리에서 선택해 덮개를 열자.' : '덮개가 잠겨 있다. DS실의 신호와 관련 있어 보인다.'; return render(); }
    if (state.flags.pianoUnlocked) return openModal('final');
    state.pianoNotes = [];
    openModal('pianoCode');
  }

  function submitPianoCode() {
    if ((state.pianoNotes || []).join('') !== '2212') return error('낮은 불협화음이 울린다. 각 문장의 정답이 몇 번째 선택지인지 다시 확인하자.');
    removeItem('pianoKey'); state.flags.pianoUnlocked = true; state.pianoNotes = []; addJournal('피아노 악보: visited(②), to see(②), was(①), like(②) → 2-2-1-2.'); state.log = '정답 번호대로 건반을 누르자 피아노 안쪽 비밀 칸이 열렸다.'; notify('피아노의 비밀 칸이 열렸다.'); openModal('final');
  }

  function submitFinal() {
    const a = [...root.querySelectorAll('[data-final]')].map(n => n.value.trim().toLowerCase().replace(/[.]/g, ''));
    const ok = a[0] === 'help' && a[1] === 'roofs' && a[2] === 'has been';
    if (!ok) return error('피아노가 불협화음을 낸다. help의 원형, 복수형 roofs, 현재완료 has been을 확인하자.');
    state.elapsed = currentElapsed(); state.startedAt = 0; state.flags.finished = true; state.screen = 'ending'; localStorage.removeItem(SAVE_KEY); render();
  }

  function registerWebMCP() {
    if (!document.modelContext?.registerTool) return;
    const register = def => { try { document.modelContext.registerTool(def); } catch (_) { /* already registered */ } };
    register({ name: 'read_night_investigation', description: 'Read the visible game location, objective, inventory, and collected journal clues.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => ({ content: [{ type: 'text', text: JSON.stringify({ scene: SCENES[state.scene]?.name, objective: objective()[1], inventory: state.inventory.map(i => ITEMS[i].name), journal: state.journal }, null, 2) }] }) });
    register({ name: 'move_to_school_scene', description: 'Move to an available named scene in the visible escape game.', inputSchema: { type: 'object', properties: { scene: { type: 'string', enum: Object.keys(SCENES) } }, required: ['scene'], additionalProperties: false }, execute: ({ scene }) => { const target = hotspots().find(h => h.action === 'go' && h.value === scene); if (!target) throw new Error('That scene is not currently reachable.'); go(scene); return { content: [{ type: 'text', text: `Moved to ${SCENES[scene].name}.` }] }; } });
  }

  safeLoad(); render(); if (state.screen === 'game') startTimer(); registerWebMCP();
})();
