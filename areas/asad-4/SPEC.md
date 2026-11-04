# Bouncing Balls and Snake

Two toys in one area. Bouncing Balls shows first.

## Switching

- Tab, or the button in the top left corner, switches between the toys.
- Leaving Snake in the middle of a game pauses it.
- The top right corner shows the ball count or the snake score.

## Bouncing Balls

Colorful balls fall and bounce off the edges of the window.

- 15 balls at the start, at random positions in the top half.
- A click adds 5 balls at the pointer, each with a random size, color, and speed.
- The arrow keys point gravity in that direction (down at the start).
- Space removes every ball and points gravity down again.
- Balls lose some speed at each bounce. At most 400 balls; the oldest go first.

## Snake

- The board is a grid of 32-pixel squares that fills the window. Resizing the window starts
  a new game.
- An arrow key (or W, A, S, D) starts the game and steers the snake. The snake cannot turn
  straight back on itself.
- Eating the red food adds one point, grows the snake by one square, and makes it a little
  faster.
- Hitting a wall or the snake's own body ends the game. Space then starts a new one.
- Space pauses and resumes during a game.
- The best score is kept until the page is reloaded.
