// Runs one toy at a time on the shared canvas. Tab or the button switches toys.
const canvas = document.getElementById("box");
const ctx = canvas.getContext("2d");
const helpLabel = document.getElementById("help");
const statusLabel = document.getElementById("status");
const switchButton = document.getElementById("switch");

const toys = [
  { name: "Bouncing Balls", toy: window.Balls },
  { name: "Snake", toy: window.Snake },
];
let current = 0;

function active() {
  return toys[current].toy;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for (const { toy } of toys) toy.resize(canvas.width, canvas.height);
}

function showToy(index) {
  active().hide();
  current = index;
  active().show(canvas.width, canvas.height);
  helpLabel.textContent = `${active().help} Tab switches toys.`;
  const other = toys[(current + 1) % toys.length].name;
  switchButton.textContent = `Switch to ${other}`;
}

function switchToy() {
  showToy((current + 1) % toys.length);
}

let last = performance.now();
function frame(now) {
  // Cap the step so a hidden tab does not jump ahead.
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;
  active().update(dt, canvas.width, canvas.height);
  active().draw(ctx, canvas.width, canvas.height);
  statusLabel.textContent = active().status();
  requestAnimationFrame(frame);
}

canvas.addEventListener("click", (e) => active().click(e.clientX, e.clientY));

switchButton.addEventListener("click", () => {
  switchToy();
  // Drop focus so Space goes to the toy, not the button.
  switchButton.blur();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    switchToy();
  } else if (active().key(e)) {
    e.preventDefault();
  }
});

window.addEventListener("resize", resize);
resize();
showToy(0);
requestAnimationFrame(frame);
