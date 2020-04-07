import Brain from "./brain";
import Agent from "../agent";

import * as P5 from "p5";

export default class ControlBrain extends Brain {
    private readonly sketch: P5;

    constructor(agent: Agent, sketch: P5) {
        super(agent);
        this.sketch = sketch;
    }

    protected think(agent: Agent): number[] {
        return [
            this.sketch.keyIsDown(this.sketch.UP_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.DOWN_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.LEFT_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.RIGHT_ARROW) ? 1 : 0
        ];
    }
}