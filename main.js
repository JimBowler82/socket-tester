// DOM References
const joinRoomBtn = document.querySelector("#joinroom");
const startSessionBtn = document.querySelector("#start");
const clientView = document.querySelector("#client-view");
const questionH3 = document.querySelector("#question");
const timerP = document.querySelector("#timer");
const slider = document.querySelector("#range");
const sliderVal = document.querySelector("#sliderValue");

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

// Socket Logic
socket.on("startThumb", ({ sessionData, timer }) => {
  questionH3.innerText = sessionData.question;
  timerP.innerText = `Timer: ${timer}`;
  slider.disabled = false;
});

socket.on("counter", (counter) => {
  timerP.innerText = `Timer: ${counter}`;
});

socket.on("finished", ({ sessionData }) => {
  timerP.innerText = "Timer: 0 - Finished";
  slider.disabled = true;
});
