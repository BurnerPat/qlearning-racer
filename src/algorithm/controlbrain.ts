import Keyboard from "../visualization/keyboard";
import Brain, {LayerSummary} from "./brain";

export default class ControlBrain extends Brain {
    constructor(private readonly keyboard: Keyboard) {
        super();
    }

    public async train(input: number[][], output: number[][]): Promise<void> {
        // stupid brain ain't gonna learn
    }

    protected thinkInternal(): number[] {
        const up = this.keyboard.upArrow;
        const left = this.keyboard.leftArrow;
        const right = this.keyboard.rightArrow;
        const down = this.keyboard.downArrow;

        return [up, up && left, up && right, !up && left, !up && right, down].map(e => e ? 1 : 0);
    }

    protected layerSummary(): LayerSummary[] {
        return [];
    }
}