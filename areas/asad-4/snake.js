// Snake: arrow keys or WASD steer, eat food to grow, hitting a wall or yourself ends the game.
window.Snake = (() => {
  const CELL = 32; // pixels per grid square
  const START_STEP = 0.12; // seconds per move at the start
  const FASTEST_STEP = 0.06;
  const DIRS = {
    ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
  };

  let cols = 0;
  let rows = 0;
  let snake, dir, turns, food, score, step, timer;
  let best = 0;
  let state = "ready"; // ready, playing, paused, over, won

  function reset(w, h) {
    cols = Math.max(10, Math.floor(w / CELL));
    rows = Math.max(8, Math.floor(h / CELL));
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    dir = { x: 1, y: 0 };
    turns = [];
    score = 0;
    step = START_STEP;
    timer = 0;
    state = "ready";
    placeFood();
  }

  function placeFood() {
    const free = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!snake.some((p) => p.x === x && p.y === y)) free.push({ x, y });
      }
    }
    if (free.length === 0) {
      state = "won";
      food = null;
      return;
    }
    food = free[Math.floor(Math.random() * free.length)];
  }

  function move() {
    if (turns.length) dir = turns.shift();
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const eating = food && head.x === food.x && head.y === food.y;
    // The tail moves out of the way this step unless the snake is growing.
    const body = eating ? snake : snake.slice(0, -1);
    const hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
    if (hitWall || body.some((p) => p.x === head.x && p.y === head.y)) {
      state = "over";
      best = Math.max(best, score);
      return;
    }
    snake.unshift(head);
    if (eating) {
      score++;
      best = Math.max(best, score);
      step = Math.max(FASTEST_STEP, step * 0.97);
      placeFood();
    } else {
      snake.pop();
    }
  }

  function message(ctx, w, h, big, small) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, h / 2 - 80, w, 160);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.fillText(big, w / 2, h / 2 - 5);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillText(small, w / 2, h / 2 + 40);
  }

  return {
    help: "Arrow keys or WASD steer. Space pauses or restarts.",

    show(w, h) {
      if (!snake) reset(w, h);
    },

    hide() {
      if (state === "playing") state = "paused";
    },

    resize(w, h) {
      // A new grid size makes the old board invalid, so start over.
      if (Math.max(10, Math.floor(w / CELL)) !== cols || Math.max(8, Math.floor(h / CELL)) !== rows) {
        reset(w, h);
      }
    },

    update(dt) {
      if (state !== "playing") return;
      timer += dt;
      while (timer >= step && state === "playing") {
        timer -= step;
        move();
      }
    },

    draw(ctx, w, h) {
      ctx.fillStyle = "#0f1a12";
      ctx.fillRect(0, 0, w, h);
      const ox = Math.floor((w - cols * CELL) / 2);
      const oy = Math.floor((h - rows * CELL) / 2);

      ctx.fillStyle = "#16261a";
      for (let y = 0; y < rows; y++) {
        for (let x = (y % 2); x < cols; x += 2) {
          ctx.fillRect(ox + x * CELL, oy + y * CELL, CELL, CELL);
        }
      }

      if (food) {
        ctx.fillStyle = "#ff5a5a";
        ctx.beginPath();
        ctx.arc(ox + food.x * CELL + CELL / 2, oy + food.y * CELL + CELL / 2, CELL * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }

      snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#b6ff7a" : "#4fd15a";
        ctx.fillRect(ox + p.x * CELL + 2, oy + p.y * CELL + 2, CELL - 4, CELL - 4);
      });

      if (state === "ready") message(ctx, w, h, "Snake", "Press an arrow key to start");
      if (state === "paused") message(ctx, w, h, "Paused", "Press Space to keep going");
      if (state === "over") message(ctx, w, h, "Game over", `Score ${score}. Press Space to play again`);
      if (state === "won") message(ctx, w, h, "You filled the board!", "Press Space to play again");
    },

    click() {},

    // Returns true when the key was used.
    key(e) {
      const next = DIRS[e.key];
      if (next) {
        if (state === "ready" || state === "paused") state = "playing";
        if (state !== "playing") return true;
        const last = turns.length ? turns[turns.length - 1] : dir;
        const reverse = next.x === -last.x && next.y === -last.y;
        const same = next.x === last.x && next.y === last.y;
        if (!reverse && !same && turns.length < 3) turns.push(next);
        return true;
      }
      if (e.key === " ") {
        if (state === "playing") state = "paused";
        else if (state === "paused") state = "playing";
        else if (state === "over" || state === "won") {
          reset(cols * CELL, rows * CELL);
        }
        return true;
      }
      return false;
    },

    status() {
      return `Score ${score} · Best ${best}`;
    },
  };
})();
