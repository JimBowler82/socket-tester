// DOM References
const joinRoomBtn = document.querySelector("#joinroom");
const startSessionBtn = document.querySelector("#start");
const endSession = document.querySelector("#end");
const clientQuestion = document.querySelector("#client-question");
const speakerQuestion = document.querySelector("#speaker-question");
const viewTimer1 = document.querySelector("#viewTimer1");
const viewTimer2 = document.querySelector("#viewTimer2");
const slider = document.querySelector("#range");
const sliderVal = document.querySelector("#sliderValue");
const thumb = document.querySelector("#thumb");
const overallVal = document.querySelector("#overall-val");
const subSpan = document.querySelector("#subCount");
const totalSpan = document.querySelector("#totalUsers");
const sessionDiv = document.querySelector("#sessionData");
const dataList = document.querySelector("#dataList");
const refreshBtn = document.querySelector("#refresh");

// DOM intial values where needed
sliderVal.innerText = `Value: ${slider.value}`;

// Socket connection
const socket = io("http://localhost:3000"); // ADD YOUR SERVER ADDRESS HERE

// Event Listeners
joinRoomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector("#username").value;
  const role = document.querySelector("#roleSelect").value;
  const room = document.querySelector("#roomSelect").value;

  socket.emit("joinroom", { name, role, room });

  name.value = "";
});

startSessionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const question = document.querySelector("#questionInput").value;
  const timer = document.querySelector("#timerInput").value;

  socket.emit("start", { question, timer });

  question.value = "";
});

slider.addEventListener("change", () => {
  sliderVal.innerText = `Value: ${slider.value}`;
  socket.emit("submission", { value: slider.value });
});

refreshBtn.addEventListener("click", () => {
  location.href = location.href;
});

endSession.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("stopTimer");
});

// Socket Logic
socket.on("startThumb", ({ sessionData, timer }) => {
  clientQuestion.innerText = sessionData.question;
  speakerQuestion.innerText = sessionData.question;
  viewTimer1.innerText = `Timer: ${timer}`;
  viewTimer2.innerText = `Timer: ${timer}`;
  subSpan.innerText = sessionData.submissions;
  totalSpan.innerText = sessionData.participants;
  slider.disabled = false;
});

socket.on("counter", (counter) => {
  viewTimer1.innerText = `Timer: ${counter}`;
  viewTimer2.innerText = `Timer: ${counter}`;
});

socket.on("finished", ({ sessionData }) => {
  viewTimer1.innerText = "Timer: 0 - Finished";
  viewTimer2.innerText = "Timer: 0 - Finished";
  slider.disabled = true;

  overallVal.innerText = `Overall Mood: ${sessionData.thumbometerResult}`;
  subSpan.innerText = sessionData.submissions;
  totalSpan.innerText = sessionData.participants;

  dataList.innerHTML = `
  <li>ID: ${sessionData.id}</li>
  <li>Participants: ${sessionData.participants}</li>
  <li>Submissions: ${sessionData.submissions}</li>
  <li>Thumbometer Result: ${sessionData.thumbometerResult}</li>
  <li>Question: ${sessionData.question}</li>
  `;
});

socket.on("thumbUpdate", ({ sessionData }) => {
  thumb.style.transform = `rotate(${
    180 + (sessionData.thumbometerResult / 100) * 180
  }deg)`;
  overallVal.innerText = `Overall Mood: ${sessionData.thumbometerResult}`;
  subSpan.innerText = sessionData.submissions;
  totalSpan.innerText = sessionData.participants;
});
