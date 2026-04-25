const players = ["Kibet Aron", "Bralyn Kipkirui", "Manu Kheed", "Lino", "Holyplug", "Manu Josh", "Blamek", "Ian Too"];
const ADMIN_PASSWORD = "EliteAdmin2026";

let fixtures = [
    { r: 1, p1: "Kibet Aron", p2: "Ian Too", s1: null, s2: null },
    { r: 1, p1: "Bralyn Kipkirui", p2: "Blamek", s1: null, s2: null },
    { r: 1, p1: "Manu Kheed", p2: "Manu Josh", s1: null, s2: null },
    { r: 1, p1: "Lino", p2: "Holyplug", s1: null, s2: null },
    { r: 2, p1: "Ian Too", p2: "Holyplug", s1: null, s2: null },
    { r: 2, p1: "Manu Josh", p2: "Lino", s1: null, s2: null },
    { r: 2, p1: "Blamek", p2: "Manu Kheed", s1: null, s2: null },
    { r: 2, p1: "Kibet Aron", p2: "Bralyn Kipkirui", s1: null, s2: null },
    { r: 3, p1: "Bralyn Kipkirui", p2: "Ian Too", s1: null, s2: null },
    { r: 3, p1: "Manu Kheed", p2: "Kibet Aron", s1: null, s2: null },
    { r: 3, p1: "Lino", p2: "Blamek", s1: null, s2: null },
    { r: 3, p1: "Holyplug", p2: "Manu Josh", s1: null, s2: null },
    { r: 4, p1: "Ian Too", p2: "Manu Josh", s1: null, s2: null },
    { r: 4, p1: "Blamek", p2: "Holyplug", s1: null, s2: null },
    { r: 4, p1: "Kibet Aron", p2: "Lino", s1: null, s2: null },
    { r: 4, p1: "Bralyn Kipkirui", p2: "Manu Kheed", s1: null, s2: null },
    { r: 5, p1: "Manu Kheed", p2: "Ian Too", s1: null, s2: null },
    { r: 5, p1: "Lino", p2: "Bralyn Kipkirui", s1: null, s2: null },
    { r: 5, p1: "Holyplug", p2: "Kibet Aron", s1: null, s2: null },
    { r: 5, p1: "Manu Josh", p2: "Blamek", s1: null, s2: null },
    { r: 6, p1: "Ian Too", p2: "Blamek", s1: null, s2: null },
    { r: 6, p1: "Kibet Aron", p2: "Manu Josh", s1: null, s2: null },
    { r: 6, p1: "Bralyn Kipkirui", p2: "Holyplug", s1: null, s2: null },
    { r: 6, p1: "Manu Kheed", p2: "Lino", s1: null, s2: null },
    { r: 7, p1: "Lino", p2: "Ian Too", s1: null, s2: null },
    { r: 7, p1: "Holyplug", p2: "Manu Kheed", s1: null, s2: null },
    { r: 7, p1: "Manu Josh", p2: "Bralyn Kipkirui", s1: null, s2: null },
    { r: 7, p1: "Blamek", p2: "Kibet Aron", s1: null, s2: null }
];

let isAdmin = false;

function unlockAdmin() {
    if (prompt("Enter Password:") === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('saveBtn').classList.remove('hidden');
        renderFixtures();
        alert("Admin Mode ON");
    }
}

function renderFixtures() {
    const container = document.getElementById('fixtureContainer');
    container.innerHTML = '';
    let currentR = 0;
    fixtures.forEach((f, i) => {
        if (f.r !== currentR) {
            currentR = f.r;
            container.innerHTML += `<div class="round-header">MATCH WEEK ${currentR}</div>`;
        }
        container.innerHTML += `
            <div class="match">
                <span class="team-name" style="text-align:right">${f.p1}</span>
                <div style="display:flex; gap:5px;">
                    <input type="number" value="${f.s1!==null?f.s1:''}" ${!isAdmin?'readonly':''} onchange="updateScore(${i},'s1',this.value)">
                    <input type="number" value="${f.s2!==null?f.s2:''}" ${!isAdmin?'readonly':''} onchange="updateScore(${i},'s2',this.value)">
                </div>
                <span class="team-name">${f.p2}</span>
            </div>`;
    });
}

function updateScore(idx, key, val) {
    fixtures[idx][key] = (val === "" || val === null) ? null : parseInt(val);
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

    const sortedTable = Object.entries(stats).sort((a,b) => b[1].pts - a[1].pts || b[1].gd - a[1].gd);
    
    // Automatic Awards Logic
    const topScorer = Object.entries(stats).sort((a,b) => b[1].gf - a[1].gf)[0];
    const bestDef = Object.entries(stats).filter(p => p[1].p > 0).sort((a,b) => a[1].ga - b[1].ga || b[1].p - a[1].p)[0];

    document.getElementById('topScorer').innerText = topScorer[1].gf > 0 ? `${topScorer[0]} (${topScorer[1].gf})` : "Waiting...";
    document.getElementById('bestDefense').innerText = bestDef ? `${bestDef[0]} (${bestDef[1].ga} conceded)` : "Waiting...";

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    sortedTable.forEach((item, i) => {
        const [name, s] = item;
        tbody.innerHTML += `<tr><td>${i+1}</td><td class="col-name text-left">${name}</td><td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td><td>${s.gf}</td><td>${s.ga}</td><td>${s.gd}</td><td class="gold-pts">${s.pts}</td></tr>`;
    });
}

function saveData() {
    localStorage.setItem('efl_v_awards', JSON.stringify(fixtures));
    alert("Scores and Awards updated locally! Refresh then re-upload script.js to GitHub.");
}

function downloadTable() {
    const area = document.getElementById('captureArea');
    html2canvas(area, { backgroundColor: "#0a192f", scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'EFL-Standings.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

const saved = localStorage.getItem('efl_v_awards');
if (saved) fixtures = JSON.parse(saved);
renderFixtures();
calculateTable();
          
