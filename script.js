let goal = 2000;
let current = 0;

// ===== ДАНІ =====
let weeklyStats = JSON.parse(localStorage.getItem("weeklyStats") || "{}");

let today = "2025-09-27"; // наступний день
// Якщо для сьогоднішнього дня ще нема запису
if (!(today in weeklyStats)) {
    weeklyStats[today] = 0;
}
current = weeklyStats[today];

// ===== Анімація рівня води =====
function animateWaterLevel(percent) {
    const waterLevel = document.getElementById('waterLevel');
    if (!waterLevel) return;
    waterLevel.style.transition = 'height 0.7s cubic-bezier(.4,0,.2,1)';
    waterLevel.style.height = `${percent > 100 ? 100 : percent}%`;
}

// ===== Оновлення UI =====
function updateUI() {
    document.getElementById('waterText').textContent = `${current} мл`;
    document.querySelector('.counter').textContent = `Залишилося ${goal - current > 0 ? goal - current : 0} мл`;

    let percent = Math.round((current / goal) * 100);
    document.querySelector('.water-percentage').textContent = `${percent > 100 ? 100 : percent}%`;

    animateWaterLevel(percent);
    updateWeeklyStats();
}

// ===== Збереження статистики =====
function saveStats() {
    localStorage.setItem("weeklyStats", JSON.stringify(weeklyStats));
}

// ===== Додавання води =====
function addWater(amount) {
    current += amount;
    if (current > goal) current = goal;

    weeklyStats[today] = current;   // оновлюємо сьогоднішній день
    saveStats();                     // зберігаємо у localStorage

    updateUI();
}

// ===== Обробники кліків =====
document.querySelectorAll('.water-plus-item').forEach(item => {
    item.addEventListener('click', function() {
        let mlText = item.querySelector('.ml').textContent;
        let ml = parseInt(mlText);
        addWater(ml);
    });
});

// ===== Малювання графіка =====
function updateWeeklyStats() {
    const canvas = document.getElementById("weeklyChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let days = Object.keys(weeklyStats);
    let values = Object.values(weeklyStats);

    let barWidth = 40;
    let gap = 20;
    let maxVal = Math.max(...values, goal);
    let scale = (canvas.height - 30) / maxVal;

    days.forEach((day, i) => {
        let x = i * (barWidth + gap) + 30;
        let y = canvas.height - values[i] * scale;
        let height = values[i] * scale;

        ctx.fillStyle = "#4da6ff";
        ctx.fillRect(x, y, barWidth, height);

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(values[i] + "мл", x + barWidth / 2, y - 5);

        let label = day.slice(5); // "09-27"
        ctx.fillText(label, x + barWidth / 2, canvas.height - 5);
    });

    document.querySelector(".text-item1").addEventListener("click", () => {
        document.querySelector("#tracker").scrollIntoView({ behavior: "smooth" });
    });

    document.querySelector(".text-item12").addEventListener("click", () => {
        document.querySelector("#add-water").scrollIntoView({ behavior: "smooth" });
    });
}


// ===== Старт =====
updateUI();
