const form = document.getElementById("pomodoro-form")
const timerSection = document.getElementById("timer")
const countdownDisplay = document.getElementById("countdown")
const currentActivityDisplay = document.getElementById("current-activity")
const progressCircle = document.querySelector(".progress-ring .progress")
const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
progressCircle.style.strokeDasharray = CIRCUMFERENCE

let activities = []
let currentIndex = 0
let interval = null
let totalMs = 0        // duração total da atividade em ms
let startTime = null   // quando o timer (re)começou
let elapsed = 0        // ms já acumulados antes de pausar
let isPaused = false

const pauseBtn = document.getElementById("pause-btn")
const resumeBtn = document.getElementById("resume-btn")
const resetBtn = document.getElementById("reset-btn")
const restartBtn = document.getElementById("restart-btn")

pauseBtn.addEventListener("click", pauseTimer)
resumeBtn.addEventListener("click", resumeTimer)
resetBtn.addEventListener("click", resetTimer)
restartBtn.addEventListener("click", resetAll)

// ── Atualiza o display ao voltar para a aba ──────────────────────────────────
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !isPaused && interval) {
    tick() // força atualização imediata, sem esperar o próximo tick
  }
})

form.addEventListener("submit", e => {
  e.preventDefault()

  const formData = new FormData(form)
  activities = [1, 2, 3, 4].map(i => ({
    name: formData.get(`activity${i}`),
    minutes: parseInt(formData.get(`time${i}`), 10)
  }))

  const activityList = document.getElementById("activity-list")
  activityList.innerHTML = ""
  activities.forEach((a, i) => {
    const li = document.createElement("li")
    const input = document.createElement("input")
    input.value = a.name
    input.dataset.index = i
    input.addEventListener("input", e => {
      activities[+e.target.dataset.index].name = e.target.value
      if (currentIndex === +e.target.dataset.index) {
        currentActivityDisplay.textContent = e.target.value
      }
    })
    li.appendChild(input)
    activityList.appendChild(li)
  })

  form.classList.add("hidden")
  timerSection.classList.remove("hidden")

  currentIndex = 0
  startActivity()
})

function startActivity() {
  if (currentIndex >= activities.length) {
    currentActivityDisplay.textContent = "Todas atividades concluídas!"
    countdownDisplay.textContent = "00:00"
    hideControls()
    restartBtn.classList.remove("hidden")
    return
  }

  const { name, minutes } = activities[currentIndex]
  totalMs = minutes * 60 * 1000
  elapsed = 0

  currentActivityDisplay.textContent = name
  updateDisplay(totalMs)
  updateProgress(totalMs)
  showControls()
  startInterval()
}

function startInterval() {
  startTime = Date.now() // ── registra o instante de início/retomada
  interval = setInterval(tick, 500) // 500ms: responsivo sem custo alto
}

// ── Toda lógica de tempo fica aqui ──────────────────────────────────────────
function tick() {
  const remaining = totalMs - (elapsed + (Date.now() - startTime))

  if (remaining <= 0) {
    clearInterval(interval)
    interval = null
    updateDisplay(0)
    updateProgress(0)
    currentIndex++
    setTimeout(startActivity, 300) // pequena pausa entre atividades
    return
  }

  updateDisplay(remaining)
  updateProgress(remaining)
}

function pauseTimer() {
  if (isPaused) return
  isPaused = true
  elapsed += Date.now() - startTime // ── acumula o tempo decorrido
  clearInterval(interval)
  interval = null
  pauseBtn.classList.add("hidden")
  resumeBtn.classList.remove("hidden")
}

function resumeTimer() {
  if (!isPaused) return
  isPaused = false
  pauseBtn.classList.remove("hidden")
  resumeBtn.classList.add("hidden")
  startInterval() // ── recomeça medindo do ponto atual
}

function resetTimer() {
  clearInterval(interval)
  interval = null
  elapsed = 0
  isPaused = false
  pauseBtn.classList.remove("hidden")
  resumeBtn.classList.add("hidden")
  updateDisplay(totalMs)
  updateProgress(totalMs)
  startInterval()
}

function resetAll() {
  clearInterval(interval)
  interval = null
  currentIndex = 0
  isPaused = false
  activities = []
  totalMs = 0
  elapsed = 0
  startTime = null
  restartBtn.classList.add("hidden")
  form.reset()
  form.classList.remove("hidden")
  timerSection.classList.add("hidden")
  updateDisplay(0)
  updateProgress(0)
}

function showControls() {
  pauseBtn.classList.remove("hidden")
  resetBtn.classList.remove("hidden")
}

function hideControls() {
  pauseBtn.classList.add("hidden")
  resumeBtn.classList.add("hidden")
  resetBtn.classList.add("hidden")
}

function updateDisplay(ms) {
  const totalSecs = Math.ceil(ms / 1000)
  const mins = String(Math.floor(totalSecs / 60)).padStart(2, "0")
  const secs = String(totalSecs % 60).padStart(2, "0")
  countdownDisplay.textContent = `${mins}:${secs}`
}

function updateProgress(ms) {
  const percent = totalMs > 0 ? ms / totalMs : 0
  progressCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - percent)
}