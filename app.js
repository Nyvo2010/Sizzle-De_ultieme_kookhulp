// Sizzle — app.js (uitgebreid)
// Gebruik: plaats index.html, style.css en app.js in dezelfde map. Open index.html in browser (of via WebStorm 'Open in Browser').

// ---------- SAMPLE RECEPTEN (kun je uitbreiden / importeren) ----------
const SAMPLE_RECIPES = [
    {
        id: 'pancakes',
        title: 'Fluffy Pancakes',
        tags: ['vegetarisch','snel','ontbijt'],
        time: 20,
        difficulty: 'snel',
        ingredients: [
            '200 g bloem',
            '2 el suiker (optioneel)',
            '1 tl bakpoeder',
            '1 ei',
            '300 ml melk',
            '1 el boter of olie'
        ],
        steps: [
            'Meng bloem, suiker en bakpoeder in een kom.',
            'Voeg ei en melk toe en klop tot een glad beslag.',
            'Verhit een koekenpan met een beetje boter of olie.',
            'Schep beslag in de pan en bak 2-3 min per kant tot goudbruin.',
            'Serveer met fruit of stroop.'
        ]
    },
    {
        id: 'oven_groenten',
        title: 'Oven geroosterde groenten',
        tags: ['vegetarisch','oven','gezond'],
        time: 40,
        difficulty: 'gemiddeld',
        ingredients: [
            '3 wortels',
            '1 rode paprika',
            '1 ui',
            '200 g courgette',
            '2 el olijfolie',
            'zout en peper'
        ],
        steps: [
            'Verwarm de oven voor op 200°C.',
            'Snijd alle groenten in gelijke stukken.',
            'Meng groenten met olie, zout en peper.',
            'Rooster 25-30 minuten tot goudbruin en zacht.'
        ]
    },
    {
        id: 'kip_pasta',
        title: 'Kip-pasta met romige saus',
        tags: ['snel','hoofdgerecht'],
        time: 30,
        difficulty: 'gemiddeld',
        ingredients: [
            '300 g pasta',
            '300 g kipfilet in stukjes',
            '1 sjalotje',
            '150 ml room',
            '2 el olijfolie',
            'zout en peper'
        ],
        steps: [
            'Kook de pasta volgens verpakking.',
            'Bak de kip in olie tot gaar.',
            'Fruit sjalotjes tot glazig.',
            'Voeg room toe en laat pruttelen tot saus bindt.',
            'Meng met pasta en serveer.'
        ]
    },
    {
        id: 'brownies',
        title: 'Smeuïge Brownies',
        tags: ['oven','dessert'],
        time: 45,
        difficulty: 'moeilijk',
        ingredients: [
            '200 g pure chocolade',
            '150 g boter',
            '200 g suiker',
            '3 eieren',
            '100 g bloem'
        ],
        steps: [
            'Verwarm oven op 180°C.',
            'Smelt chocolade en boter au bain-marie.',
            'Meng suiker en eieren, voeg chocolade toe.',
            'Zeef bloem en vouw voorzichtig door.',
            'Bak 20-25 minuten, laat afkoelen.'
        ]
    },
    {
        id: 'tonijnsalade',
        title: 'Snelle tonijnsalade',
        tags: ['snel','lunch'],
        time: 10,
        difficulty: 'snel',
        ingredients: [
            '1 blik tonijn (uitgelekt)',
            '2 el mayonaise',
            '1 el citroensap',
            'zout en peper',
            'sla'
        ],
        steps: [
            'Meng tonijn met mayo en citroensap.',
            'Breng op smaak en serveer op sla of brood.'
        ]
    }
];

// ---------- STATE & STORAGE KEYS ----------
const LS = {
    recipes: 'sizzle_recipes_v1',
    favorites: 'sizzle_favs_v1',
    profile: 'sizzle_profile_v1',
    shopping: 'sizzle_shopping_v1',
    planner: 'sizzle_planner_v1'
};

const state = {
    recipes: loadJSON(LS.recipes) || SAMPLE_RECIPES,
    favorites: new Set(loadJSON(LS.favorites) || []),
    username: (loadJSON(LS.profile) || {}).username || '',
    shopping: loadJSON(LS.shopping) || [],
    planner: loadJSON(LS.planner) || {}, // object day -> recipeId
    ui: {
        search: '',
        tags: new Set(),
        maxTime: 120,
        difficulty: 'any',
        sortBy: 'relevance',
        showingFavs: false
    }
};

// ---------- UTILS ----------
function $(id){ return document.getElementById(id); }
function saveJSON(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
function loadJSON(key){ try{ return JSON.parse(localStorage.getItem(key)); }catch(e){return null} }
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}

// ---------- INIT BINDINGS ----------
document.addEventListener('DOMContentLoaded', ()=>{
    // UI elements
    const searchInput = $('searchInput');
    const tagContainer = $('tagContainer');
    const maxTime = $('maxTime');
    const difficulty = $('difficulty');
    const sortBy = $('sortBy');
    const grid = $('grid');
    const resultCount = $('resultCount');
    const recommendText = $('recommendText');
    const favList = $('favList');
    const viewFavs = $('viewFavs');

    // detail modal elements
    const detailModal = $('detailModal');
    const detailTitle = $('detailTitle');
    const detailMeta = $('detailMeta');
    const detailIngredients = $('detailIngredients');
    const detailSteps = $('detailSteps');
    const detailFavBtn = $('detailFavBtn');
    const closeDetail = $('closeDetail');
    const analyzeBtn = $('analyzeBtn');
    const subBtn = $('subBtn');
    const askBtn = $('askBtn');
    const aiOutput = $('aiOutput');
    const stepRunner = $('stepRunner');
    const currentStepText = $('currentStepText');
    const prevStep = $('prevStep');
    const nextStep = $('nextStep');
    const startTimer = $('startTimer');
    const timerDisplay = $('timerDisplay');
    const stepHints = $('stepHints');

    // shopping/planner
    const shoppingPanel = $('shoppingPanel');
    const plannerPanel = $('plannerPanel');
    const shoppingListEl = $('shoppingList');
    const openShopping = $('openShopping');
    const closeShopping = $('closeShopping');
    const clearShopping = $('clearShopping');
    const downloadShopping = $('downloadShopping');
    const autoFill = $('autoFill');
    const openPlanner = $('openPlanner');
    const closePlanner = $('closePlanner');
    const plannerGrid = $('plannerGrid');
    const clearPlanner = $('clearPlanner');

    // export/import
    const exportBtn = $('exportBtn');
    const importBtn = $('importBtn');
    const importFile = $('importFile');

    // profile
    const username = $('username');
    const saveProfileBtn = $('saveProfileBtn');
    const clearProfileBtn = $('clearProfileBtn');

    // initial UI state
    searchInput.value = '';
    maxTime.value = state.ui.maxTime;
    difficulty.value = state.ui.difficulty;
    sortBy.value = state.ui.sortBy;
    username.value = state.username || '';

    // populate tags
    renderTagButtons();

    // initial render
    renderGrid();

    // bind events
    searchInput.addEventListener('input', e=>{ state.ui.search = e.target.value.toLowerCase(); state.ui.showingFavs=false; renderGrid(); });
    maxTime.addEventListener('change', e=>{ state.ui.maxTime = Number(e.target.value)||120; renderGrid(); });
    difficulty.addEventListener('change', e=>{ state.ui.difficulty = e.target.value; renderGrid(); });
    sortBy.addEventListener('change', e=>{ state.ui.sortBy = e.target.value; renderGrid(); });
    viewFavs.addEventListener('click', ()=>{ state.ui.showingFavs = !state.ui.showingFavs; renderGrid(); viewFavs.textContent = state.ui.showingFavs ? 'Alle recepten' : 'Toon favorieten'; });

    // favorites list in sidebar clickable
    renderFavList();

    // export/import
    exportBtn.addEventListener('click', exportAll);
    importBtn.addEventListener('click', ()=> importFile.click());
    importFile.addEventListener('change', handleImportFile);

    // profile
    saveProfileBtn.addEventListener('click', ()=>{ state.username = username.value.trim(); saveJSON(LS.profile,{username:state.username}); alert('Profiel lokaal opgeslagen.'); updateRecommendations(); });
    clearProfileBtn.addEventListener('click', ()=>{ state.username=''; username.value=''; localStorage.removeItem(LS.profile); alert('Profiel verwijderd.'); updateRecommendations(); });

    // detail modal handlers
    closeDetail.addEventListener('click', ()=> closeModal());
    detailFavBtn.addEventListener('click', ()=> toggleFav(currentOpenId, detailFavBtn));

    analyzeBtn.addEventListener('click', ()=> aiAnalyze(currentOpenId));
    subBtn.addEventListener('click', ()=> aiIngredientAnalysis(currentOpenId));
    askBtn.addEventListener('click', ()=> openQuestionPrompt(currentOpenId));

    // step runner
    prevStep.addEventListener('click', ()=> stepRunnerPrev());
    nextStep.addEventListener('click', ()=> stepRunnerNext());
    startTimer.addEventListener('click', ()=> toggleTimer());

    // shopping
    openShopping.addEventListener('click', ()=> openPanel('shopping'));
    closeShopping.addEventListener('click', ()=> closePanel('shopping'));
    clearShopping.addEventListener('click', ()=> { state.shopping = []; saveJSON(LS.shopping,state.shopping); renderShopping(); });
    downloadShopping.addEventListener('click', ()=> downloadShoppingTxt());
    autoFill.addEventListener('click', ()=> autofillShoppingFromFavs());

    // planner
    openPlanner.addEventListener('click', ()=> openPanel('planner'));
    closePlanner.addEventListener('click', ()=> closePanel('planner'));
    clearPlanner.addEventListener('click', ()=> { state.planner={}; saveJSON(LS.planner,state.planner); renderPlanner(); });

    // initial shopping/planner render
    renderShopping();
    renderPlanner();

    // keyboard shortcuts
    document.addEventListener('keydown', (e)=>{
        if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){ e.preventDefault(); searchInput.focus(); }
        if(e.key==='f' && (e.ctrlKey||e.metaKey)){ e.preventDefault(); $('searchInput').value=''; state.ui.search=''; renderGrid(); }
    });

    // ---------- FUNCTIONS IN SCOPE ----------

    // render grid of recipe cards
    function renderGrid(){
        const filtered = state.recipes.filter(matchesFilters);
        const sorted = sortRecipes(filtered, state.ui.sortBy);
        grid.innerHTML = '';
        resultCount.textContent = sorted.length;

        if(state.ui.showingFavs){
            const arr = sorted.filter(r=> state.favorites.has(r.id));
            if(arr.length===0){ grid.innerHTML = `<div class="muted">Geen favorieten gevonden.</div>`; return; }
            arr.forEach(r => grid.appendChild(makeCard(r)));
        } else {
            if(sorted.length===0){ grid.innerHTML = `<div class="muted">Geen recepten gevonden. Probeer andere filters.</div>`; return; }
            sorted.forEach(r => grid.appendChild(makeCard(r)));
        }

        updateRecommendations();
    }

    function makeCard(r){
        const el = document.createElement('article');
        el.className = 'card';
        el.setAttribute('tabindex','0');
        el.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div>
          <h3>${escape(r.title)}</h3>
          <div class="meta">${r.time} min · ${r.difficulty}</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <div class="chips">${r.tags.map(t=>`<span class="chip">${escape(t)}</span>`).join('')}</div>
          <div class="star ${state.favorites.has(r.id)?'active':''}" data-id="${r.id}">${state.favorites.has(r.id)?'★':'☆'}</div>
        </div>
      </div>
      <div class="actions">
        <button class="btn openBtn" data-id="${r.id}">Open</button>
        <button class="btn ghost copyBtn" data-id="${r.id}">Kopieer recept</button>
      </div>
    `;
        // events
        el.querySelector('.openBtn').addEventListener('click', ()=> openDetail(r.id));
        el.querySelector('.copyBtn').addEventListener('click', ()=> { navigator.clipboard.writeText(formatRecipeText(r)); alert('Recept gekopieerd naar klembord.'); });
        el.querySelector('.star').addEventListener('click', (e)=>{ toggleFav(r.id); e.stopPropagation(); renderGrid(); renderFavList(); });
        el.addEventListener('keydown',(e)=>{ if(e.key==='Enter') openDetail(r.id); });
        return el;
    }

    function matchesFilters(r){
        // favorites filter
        if(state.ui.showingFavs && !state.favorites.has(r.id)) return false;
        // tags
        if(state.ui.tags.size>0){
            for(const t of state.ui.tags) if(!r.tags.includes(t)) return false;
        }
        // time
        if(r.time > state.ui.maxTime) return false;
        // difficulty
        if(state.ui.difficulty!=='any' && r.difficulty !== state.ui.difficulty) return false;
        // search
        if(state.ui.search){
            const hay = (r.title + ' ' + r.ingredients.join(' ') + ' ' + r.tags.join(' ')).toLowerCase();
            if(!hay.includes(state.ui.search)) return false;
        }
        return true;
    }

    function sortRecipes(list, by){
        const copy = [...list];
        if(by==='time') copy.sort((a,b)=>a.time - b.time);
        else if(by==='difficulty') copy.sort((a,b)=> difficultyScore(a.difficulty) - difficultyScore(b.difficulty));
        else {
            // relevance: simple heuristic — favorites first, then shorter time
            copy.sort((a,b)=>{
                const fa = state.favorites.has(a.id)?1:0;
                const fb = state.favorites.has(b.id)?1:0;
                if(fa!==fb) return fb-fa; // favorites first
                return a.time - b.time;
            });
        }
        return copy;
    }

    function difficultyScore(d){
        if(d==='snel') return 1;
        if(d==='gemiddeld') return 2;
        return 3;
    }

    // TAGS rendering and toggling
    function renderTagButtons(){
        const tags = new Set();
        state.recipes.forEach(r => r.tags.forEach(t=>tags.add(t)));
        tagContainer.innerHTML = '';
        Array.from(tags).sort().forEach(t=>{
            const btn = document.createElement('button');
            btn.className = 'tag';
            btn.textContent = t;
            btn.addEventListener('click', ()=> {
                if(state.ui.tags.has(t)){ state.ui.tags.delete(t); btn.classList.remove('active'); } else { state.ui.tags.add(t); btn.classList.add('active'); }
                renderGrid();
            });
            tagContainer.appendChild(btn);
        });
    }

    // FAVORITES functions
    function toggleFav(id, btnRef){
        if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
        saveJSON(LS.favorites, Array.from(state.favorites));
        renderFavList();
        renderGrid();
    }
    function renderFavList(){
        favList.innerHTML = '';
        if(state.favorites.size===0){ favList.innerHTML = '<div class="muted small">Geen favorieten</div>'; return; }
        state.favorites.forEach(id=>{
            const r = state.recipes.find(x=>x.id===id);
            if(!r) return;
            const el = document.createElement('div');
            el.className = 'fav-item';
            el.innerHTML = `<div style="flex:1">${escape(r.title)}</div><div style="display:flex;gap:6px"><button class="btn ghost" data-id="${r.id}">Open</button><button class="btn small" data-id="${r.id}">Verwijder</button></div>`;
            el.querySelectorAll('button')[0].addEventListener('click', ()=> openDetail(r.id));
            el.querySelectorAll('button')[1].addEventListener('click', ()=>{ state.favorites.delete(r.id); saveJSON(LS.favorites, Array.from(state.favorites)); renderFavList(); renderGrid(); });
            favList.appendChild(el);
        });
    }

    // DETAIL modal
    let currentOpenId = null;
    let runnerState = { idx:0, timer:null, seconds:0, running:false };

    function openDetail(id){
        const r = state.recipes.find(x=>x.id===id); if(!r) return;
        currentOpenId = id;
        detailTitle.textContent = r.title;
        detailMeta.textContent = `${r.time} min · ${r.difficulty} · ${r.tags.join(', ')}`;
        detailIngredients.innerHTML = '';
        r.ingredients.forEach(ing=>{
            const li = document.createElement('li'); l
