// script.js
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
let remainingSeconds = 0
let isPaused = false

const pauseBtn = document.getElementById("pause-btn")
const resumeBtn = document.getElementById("resume-btn")
const resetBtn = document.getElementById("reset-btn")
const restartBtn = document.getElementById("restart-btn")
restartBtn.addEventListener("click", resetAll)

pauseBtn.addEventListener("click", pauseTimer)
resumeBtn.addEventListener("click", resumeTimer)
resetBtn.addEventListener("click", resetTimer)

form.addEventListener("submit", e => {
  e.preventDefault()

  const formData = new FormData(form)
  activities = [1, 2, 3, 4].map(i => ({
    name: formData.get(`activity${i}`),
    minutes: parseInt(formData.get(`time${i}`), 10)
  }))

  form.classList.add("hidden")
  timerSection.classList.remove("hidden")

  currentIndex = 0
  startActivity()
})

function startActivity() {
    if (currentIndex >= activities.length) {
      currentActivityDisplay.textContent = "Todas atividades concluídas!"
      countdownDisplay.textContent = "00:00"
      restartBtn.classList.remove("hidden")
      return
    }
  
    const { name, minutes } = activities[currentIndex]
    remainingSeconds = minutes * 60
    totalSeconds = remainingSeconds
    updateProgress(remainingSeconds)
    currentActivityDisplay.textContent = name
    updateDisplay(remainingSeconds)
  
    showControls()
    startInterval()
  }
  
  function startInterval() {
    interval = setInterval(() => {
      if (!isPaused) {
        remainingSeconds--
        updateDisplay(remainingSeconds)
        updateProgress(remainingSeconds)
  
        if (remainingSeconds <= 0) {
          clearInterval(interval)
          currentIndex++
          startActivity()
        }
      }
    }, 1000)
  }  
  
  function pauseTimer() {
    isPaused = true
    pauseBtn.classList.add("hidden")
    resumeBtn.classList.remove("hidden")
  }
  
  function resumeTimer() {
    isPaused = false
    pauseBtn.classList.remove("hidden")
    resumeBtn.classList.add("hidden")
  }
  
  function resetTimer() {
    clearInterval(interval)
    const { minutes } = activities[currentIndex]
    remainingSeconds = minutes * 60
    updateDisplay(remainingSeconds)
    isPaused = false
    pauseBtn.classList.remove("hidden")
    resumeBtn.classList.add("hidden")
    startInterval()
  }

  function resetAll() {
  clearInterval(interval)
  currentIndex = 0
  isPaused = false
  activities = []
  remainingSeconds = 0
  totalSeconds = 0
  restartBtn.classList.add("hidden")
  form.reset()
  form.classList.remove("hidden")
  timerSection.classList.add("hidden")
  updateDisplay(0)
  updateProgress(0)
  document.getElementById("activity-list").innerHTML = ''
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

function updateDisplay(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  countdownDisplay.textContent = `${mins}:${secs}`
}

function updateProgress(secondsLeft) {
    const percent = secondsLeft / totalSeconds
    const offset = CIRCUMFERENCE * (1 - percent)
    progressCircle.style.strokeDashoffset = offset
  }
