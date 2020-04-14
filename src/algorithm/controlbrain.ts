import Brain from "./brain";

import * as P5 from "p5";
import Keyboard from "../keyboard";

export default class ControlBrain extends Brain {
    constructor(private readonly keyboard: Keyboard) {
        super();
    }

    protected thinkInternal(): number[] {
        const up = this.keyboard.upArrow;
        const left = this.keyboard.leftArrow;
        const right = this.keyboard.rightArrow;
        const down = this.keyboard.downArrow;

        return [up, up && left, up && right, !up && left, !up && right, down].map(e => e ? 1 : 0);
    }

    public async train(input: number[][], output: number[][]): Promise<void> {
        // stupid brain ain't gonna learn
    }
}