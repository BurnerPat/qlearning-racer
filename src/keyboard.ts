import * as p5 from "p5";

export default class Keyboard {
    public constructor(private readonly p5: p5) {
        // Empty
    }

    public get leftArrow() {
        return this.p5.keyIsDown(this.p5.LEFT_ARROW);
    }

    public get rightArrow() {
        return this.p5.keyIsDown(this.p5.RIGHT_ARROW);
    }

    public get upArrow() {
        return this.p5.keyIsDown(this.p5.UP_ARROW);
    }

    public get downArrow() {
        return this.p5.keyIsDown(this.p5.DOWN_ARROW);
    }
}