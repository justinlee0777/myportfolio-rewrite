export class GridWorld {
  numActions = 4;
  gridSize;
  startingState;
  numStates;

  goalPos;

  pits = [];

  usedPositions = new Set();

  constructor(gridSize, numPits) {
    this.gridSize = gridSize;
    this.numStates = gridSize ** 2;

    this.startingState = this.createRandomPosition();

    this.goalPos = this.createRandomPosition();

    for (let i = 0; i < numPits; i++) {
      this.pits.push(this.createRandomPosition());
    }
  }

  step(state, action) {
    const { gridSize } = this;

    let [row, col] = this.getPos(state);

    switch (action) {
      case 0:
        row = Math.max(0, row - 1);
        break;
      case 1:
        row = Math.min(gridSize - 1, row + 1);
        break;
      case 2:
        col = Math.max(0, col - 1);
        break;
      case 3:
        col = Math.min(gridSize - 1, col + 1);
        break;
    }

    const nextState = this.getState(row, col);

    let reward,
      done = false;

    if (this.pits.includes(nextState)) {
      reward = -1;
      done = true;
    } else if (this.goalPos === nextState) {
      reward = 10;
      done = true;
    } else if (state === nextState) {
      reward = -0.1;
    } else {
      reward = -0.01;
    }

    return { reward, state: nextState, done };
  }

  getPos(state) {
    const row = Math.floor(state / this.gridSize),
      col = state % this.gridSize;

    return [row, col];
  }

  getState(row, col) {
    return row * this.gridSize + col;
  }

  createRandomPosition() {
    const { gridSize } = this;
    const state = this.getState(
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    );

    if (this.usedPositions.has(state)) {
      return this.createRandomPosition();
    } else {
      this.usedPositions.add(state);

      return state;
    }
  }
}
