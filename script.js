const courseDB = {
  "教育基礎課程": {
    "選修": [{n:"教育概論",c:2}, {n:"教育哲學",c:2}, {n:"教育法規",c:2}, {n:"教育行政",c:2}, {n:"比較教育",c:2}, {n:"教育心理學",c:2}, {n:"教育社會學",c:2}, {n:"特殊教育導論",c:3}, {n:"兒童及青少年發展",c:2}]
  },
  "教育方法課程": {
    "選修": [{n:"教學原理",c:2}, {n:"學習評量",c:2}, {n:"班級經營",c:2}, {n:"學習策略",c:2}, {n:"適性教學",c:2}, {n:"教育議題專題",c:2}, {n:"教師專業發展",c:2}, {n:"課程發展與設計",c:2}, {n:"輔導發展與實務",c:2}]
  },
  "教育實踐課程": {
    "必修": [{n:"分科／分領域教材教法",c:3}, {n:"分科／分領域實地學習",c:3}, {n:"分科／分領域教學實習",c:3}],
  }
};

let selected = [];

window.onload = function () {
    load();
    render();
};

function updateMain() {
    const semSelect = document.getElementById("semesterSelect");
    const sem = semSelect.value.trim();
    const mainSelect = document.getElementById("mainSelect");
    mainSelect.innerHTML = '<option value="">2. 選擇類別</option>';
    document.getElementById("courseSelect").innerHTML = '<option value="">3. 選擇課程</option>';
    
    if (!sem || !courseDB[sem]) return;
    
    Object.keys(courseDB[sem]).forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat; opt.textContent = cat;
        mainSelect.appendChild(opt);
    });
}

function updateCourse() {
    const sem = document.getElementById("semesterSelect").value.trim();
    const cat = document.getElementById("mainSelect").value.trim();
    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = '<option value="">3. 選擇課程</option>';
    
    if (!sem || !cat || !courseDB[sem][cat]) return;

    let mainTag = "";
    if (sem === "教育基礎課程") mainTag = "basic";
    else if (sem === "教育方法課程") mainTag = "method";
    else if (sem === "教育實踐課程") mainTag = "practice";

    courseDB[sem][cat].forEach(c => {
        const opt = document.createElement("option");
        const info = { n: c.n, c: c.c, main: mainTag, sem: sem };
        opt.value = JSON.stringify(info);
        opt.textContent = c.n;
        courseSelect.appendChild(opt);
    });
}

function addCourse() {
    const val = document.getElementById("courseSelect").value;
    if (!val) return alert("請選取課程！");
    const obj = JSON.parse(val);
    if (selected.some(s => s.n === obj.n)) return alert("這門課已經加過了喔！");
    obj.id = Date.now();
    selected.push(obj);
    save(); render();
}

function remove(id) {
    selected = selected.filter(c => c.id !== id);
    save(); render();
}

function render() {
    const container = document.getElementById("list-container");
    if (!container) return;
    container.innerHTML = "";
    
    const reqs = { basic: 7, method: 10, practice: 9, totalGoal: 26 };
    let stats = { basic: 0, method: 0, practice: 0, total: 0 };
    
    const semLabels = ["教育基礎課程", "教育方法課程", "教育實踐課程"];
    
    semLabels.forEach(semKey => {
        const courses = selected.filter(c => c.sem === semKey);
        if (courses.length > 0) {
            const block = document.createElement("div");
            block.className = "semester-block";
            const ulId = `ul-${Math.random().toString(36).substr(2, 9)}`;
            block.innerHTML = `<div class="semester-title">${semKey}</div><ul id="${ulId}"></ul>`;
            container.appendChild(block);
            
            courses.forEach(c => {
                if (c.main === "basic") stats.basic += c.c;
                else if (c.main === "method") stats.method += c.c;
                else if (c.main === "practice") stats.practice += c.c;
                stats.total += c.c;

                const li = document.createElement("li");
                li.innerHTML = `<span>${c.n} (${c.c})</span><button class="delete-btn" onclick="remove(${c.id})">刪除</button>`;
                document.getElementById(ulId).appendChild(li);
            });
        }
    });

    const updateUI = (id, cur, goal, isTotalCard = false) => {
        const el = document.getElementById(id);
        if(el) {
            el.textContent = cur;
            if (isTotalCard) {
                // 深色總分卡片達標用亮綠色，未達標用淡粉藍
                el.style.color = cur >= goal ? "#10b981" : "#a5b4fc";
            } else {
                // 一般卡片達標用綠色，未達標用紅色
                el.style.color = cur >= goal ? "#10b981" : "#ef4444";
            }
        }
    };

    updateUI("score-basic", stats.basic, reqs.basic);
    updateUI("score-method", stats.method, reqs.method);
    updateUI("score-practice", stats.practice, reqs.practice);
    updateUI("total", stats.total, reqs.totalGoal, true);

    const totalStatus = document.getElementById("total-status");
    const isWin = (stats.basic >= reqs.basic && stats.method >= reqs.method && stats.practice >= reqs.practice);
    if (isWin) {
        totalStatus.textContent = "✅ 已達成學分門檻！";
        totalStatus.style.color = "#10b981";
    } else {
        totalStatus.textContent = "目標：符合各項最低標準";
        totalStatus.style.color = "#9393FF";
    }
}

function save() { localStorage.setItem("nua_clean_v1", JSON.stringify(selected)); }
function load() { const d = localStorage.getItem("nua_clean_v1"); if (d) selected = JSON.parse(d); }