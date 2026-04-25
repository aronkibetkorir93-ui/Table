const players = ["KIBET ARON", "BRALYN KIPKIRUI", "MANU KHEED", "LINO", "HOLYPLUG", "MANU JOSH", "BLAMEK", "IAN TOO"];

// Initial empty fixtures
let fixtures = [
    { p1: "KIBET ARON", p2: "IAN TOO", s1: null, s2: null },
    { p1: "BRALYN KIPKIRUI", p2: "BLAMEK", s1: null, s2: null },
    { p1: "MANU KHEED", p2: "MANU JOSH", s1: null, s2: null },
    { p1: "LINO", p2: "HOLYPLUG", s1: null, s2: null },
    { p1: "IAN TOO", p2: "HOLYPLUG", s1: null, s2: null },
    { p1: "MANU JOSH", p2: "LINO", s1: null, s2: null },
    { p1: "BLAMEK", p2: "MANU KHEED", s1: null, s2: null },
    { p1: "KIBET ARON", p2: "BRALYN KIPKIRUI", s1: null, s2: null }
];

function unlockAdmin() {
    if (prompt("PASSWORD:") === "EliteAdmin2026") {
        document.getElementById('adminSection').classList.remove('hidden');
        renderFixtures();
    }
}

function renderFixtures() {
    const list = document.getElementById('fixtureList');
    list.innerHTML = '';
    fixtures.forEach((f, i) => {
        list.innerHTML += `
            <div class="match-row">
                <span style="width:38%; text-align:right;">${f.p1}</span>
                <div style="display:flex; gap:5px;">
                    <input type="number" value="${f.s1!==null?f.s1:''}" onchange="updateScore(${i},'s1',this.value)">
                    <input type="number" value="${f.s2!==null?f.s2:''}" onchange="updateScore(${i},'s2',this.value)">
                </div>
                <span style="width:38%;">${f.p2}</span>
            </div>`;
    });
}

function updateScore(idx, key, val) {
    fixtures[idx][key] = val === "" ? null : parseInt(val);
    calculateTable();
}

function calculateTable() {
    let stats = {};
    players.forEach(p => stats[p] = { p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 });
    
    fixtures.forEach(f => {
        if (f.s1 !== null && f.s2 !== null) {
            stats[f.p1].p++; stats[f.p2].p++;
            stats[f.p1].gf += f.s1; stats[f.p1].ga += f.s2;
            stats[f.p2].gf += f.s2; stats[f.p2].ga += f.s1;
            if (f.s1 > f.s2) { stats[f.p1].w++; stats[f.p1].pts += 3; stats[f.p2].l++; }
            else if (f.s1 < f.s2) { stats[f.p2].w++; stats[f.p2].pts += 3; stats[f.p1].l++; }
            else { stats[f.p1].d++; stats[f.p2].d++; stats[f.p1].pts += 1; stats[f.p2].pts += 1; }
            stats[f.p1].gd = stats[f.p1].gf - stats[f.p1].ga;
            stats[f.p2].gd = stats[f.p2].gf - stats[f.p2].ga;
        }
    });

    const sorted = Object.entries(stats).sort((a,b) => b[1].pts - a[1].pts || b[1].gd - a[1].gd);
    
    // Update Awards
    const ts = Object.entries(stats).sort((a,b) => b[1].gf - a[1].gf)[0];
    const bd = Object.entries(stats).filter(x => x[1].p > 0).sort((a,b) => a[1].ga - b[1].ga)[0];
    document.getElementById('topScorer').innerText = ts[1].gf > 0 ? `${ts[0]} (${ts[1].gf})` : "---";
    document.getElementById('bestDefense').innerText = bd ? `${bd[0]} (${bd[1].ga} GA)` : "---";

    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    sorted.forEach((item, i) => {
        const [name, s] = item;
        body.innerHTML += `
            <div class="t-row">
                <div class="col-pos">${i+1}</div>
                <div class="col-name">${name}</div>
                <div class="col-s">${s.p}</div><div class="col-s">${s.w}</div><div class="col-s">${s.d}</div><div class="col-s">${s.l}</div>
                <div class="col-s">${s.gf}</div><div class="col-s">${s.ga}</div><div class="col-s">${s.gd}</div>
                <div class="col-pts">${s.pts}</div>
            </div>`;
    });
}

function downloadTable() {
    html2canvas(document.getElementById('captureArea'), { backgroundColor: "#020617", scale: 2 }).then(canvas => {
        let link = document.createElement('a');
        link.download = 'EFL_Standings_Season1.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function saveData() {
    localStorage.setItem('efl_final_v6', JSON.stringify(fixtures));
    alert("SCORES PUBLISHED SUCCESSFULLY!");
}

// Load data on start
const local = localStorage.getItem('efl_final_v6');
if (local) fixtures = JSON.parse(local);
calculateTable();
        
