// Bouncing balls: click to add balls, arrow keys point gravity, Space clears.
window.Balls = (() => {
  const GRAVITY = 900; // pixels per second squared
  const BOUNCE = 0.85; // share of speed kept after hitting a wall
  const MAX_BALLS = 400;
  const ARROWS = {
    ArrowUp: { x: 0, y: -GRAVITY },
    ArrowDown: { x: 0, y: GRAVITY },
    ArrowLeft: { x: -GRAVITY, y: 0 },
    ArrowRight: { x: GRAVITY, y: 0 },
  };

  let balls = [];
  let gravity = ARROWS.ArrowDown;
  let started = false;

  function addBall(x, y) {
    balls.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 600,
      vy: (Math.random() - 0.5) * 600,
      r: 10 + Math.random() * 20,
      color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
    });
    if (balls.length > MAX_BALLS) balls.shift();
  }

  return {
    help: "Click to add balls. Arrow keys change gravity. Space clears.",

    show(w, h) {
      if (started) return;
      started = true;
      for (let i = 0; i < 15; i++) addBall(Math.random() * w, (Math.random() * h) / 2);
    },

    hide() {},

    resize() {},

    update(dt, w, h) {
      for (const b of balls) {
        b.vx += gravity.x * dt;
        b.vy += gravity.y * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * BOUNCE; }
        if (b.y + b.r > h) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * BOUNCE; }
      }
    },

    draw(ctx, w, h) {
      ctx.fillStyle = "#14141f";
      ctx.fillRect(0, 0, w, h);
      for (const b of balls) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      }
    },

    click(x, y) {
      for (let i = 0; i < 5; i++) addBall(x, y);
    },

    // Returns true when the key was used.
    key(e) {
      if (ARROWS[e.key]) {
        gravity = ARROWS[e.key];
        return true;
      }
      if (e.key === " ") {
        balls = [];
        gravity = ARROWS.ArrowDown;
        return true;
      }
      return false;
    },

    status() {
      return `${balls.length} balls`;
    },
  };
})();
