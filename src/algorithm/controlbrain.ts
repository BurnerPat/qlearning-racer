import Brain from "./brain";

import * as P5 from "p5";

export default class ControlBrain extends Brain {
    private readonly sketch: P5;

    constructor(sketch: P5) {
        super();

        this.sketch = sketch;
    }

    protected think(): number[] {
        return [
            this.sketch.keyIsDown(this.sketch.UP_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.DOWN_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.LEFT_ARROW) ? 1 : 0,
            this.sketch.keyIsDown(this.sketch.RIGHT_ARROW) ? 1 : 0
        ];
    }
}