import Agent from "../agent";
import ExMath from "../exmath";
import Sketch from "../sketch";

export default abstract class Brain {
    public static readonly OUTPUT_IDX_ACCELERATE = 0;
    public static readonly OUTPUT_IDX_ACCELERATE_LEFT = 1;
    public static readonly OUTPUT_IDX_ACCELERATE_RIGHT = 2;
    public static readonly OUTPUT_IDX_LEFT = 3;
    public static readonly OUTPUT_IDX_RIGHT = 4;
    public static readonly OUTPUT_IDX_BRAKE = 5;

    public static readonly SENSOR_COUNT = 5;
    public static readonly OUTPUT_COUNT = 6;

    private _output: number[] = new Array(Brain.OUTPUT_COUNT).fill(0);

    private _action: number = -1;

    public think(input: number[]): number[] {
        this._output = this.thinkInternal(input);

        if (this._output.reduce((acc, e) => acc + e, 0) === 0) {
            this._action = -1;
        }
        else {
            this._action = ExMath.argmax(this._output);
        }

        return this._output;
    }

    public get output(): number[] {
        return this._output;
    }

    public random(): void {
        this._action = Math.floor(Math.random() * (Brain.OUTPUT_COUNT - 1));
    }

    protected decide(...idx: number[]): boolean {
        return idx.indexOf(this._action) >= 0;
    }

    public get accelerate(): boolean {
        return this.decide(Brain.OUTPUT_IDX_ACCELERATE, Brain.OUTPUT_IDX_ACCELERATE_LEFT, Brain.OUTPUT_IDX_ACCELERATE_RIGHT);
    }

    public get brake(): boolean {
        return this.decide(Brain.OUTPUT_IDX_BRAKE);
    }

    public get left(): boolean {
        return this.decide(Brain.OUTPUT_IDX_LEFT, Brain.OUTPUT_IDX_ACCELERATE_LEFT);
    }

    public get right(): boolean {
        return this.decide(Brain.OUTPUT_IDX_RIGHT, Brain.OUTPUT_IDX_ACCELERATE_RIGHT);
    }

    protected abstract thinkInternal(input: number[]): number[];

    public async abstract train(input: number[][], output: number[][]): Promise<void>;

    public render(agent: Agent, sketch: Sketch): void {
        const output = (decision: boolean, idx: number, x: number, y: number) => {
            sketch.p5.stroke(decision ? "#64dd17" : "#ff6d00");
            sketch.p5.line(0, 0, 100 * y, 100 * x);
        };

        sketch.p5.strokeWeight(1);

        output(this.accelerate, Brain.OUTPUT_IDX_ACCELERATE, 0, this._output[0]);
        output(this.brake, Brain.OUTPUT_IDX_BRAKE, 0, -this._output[1]);
        output(this.left, Brain.OUTPUT_IDX_LEFT, -this._output[2], 0);
        output(this.right, Brain.OUTPUT_IDX_RIGHT, this._output[3], 0);
    }
}