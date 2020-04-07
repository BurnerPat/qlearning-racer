import * as P5 from "p5";

import Agent from "../agent";

export default abstract class Brain {
    public static readonly OUTPUT_IDX_ACCELERATE = 0;
    public static readonly OUTPUT_IDX_BRAKE = 1;
    public static readonly OUTPUT_IDX_LEFT = 2;
    public static readonly OUTPUT_IDX_RIGHT = 3;

    private _output: number[] = new Array(4).fill(0);

    private readonly _agent: Agent;

    protected constructor(agent: Agent) {
        this._agent = agent;
    }

    public update(): void {
        this._output = this.think(this._agent);
    }

    protected decide(idx1: number, idx2: number): boolean {
        return this._output[idx1] > this._output[idx2];
    }

    public get accelerate(): boolean {
        return this.decide(Brain.OUTPUT_IDX_ACCELERATE, Brain.OUTPUT_IDX_BRAKE);
    }

    public get brake(): boolean {
        return this.decide(Brain.OUTPUT_IDX_BRAKE, Brain.OUTPUT_IDX_ACCELERATE);
    }

    public get left(): boolean {
        return this.decide(Brain.OUTPUT_IDX_LEFT, Brain.OUTPUT_IDX_RIGHT);
    }

    public get right(): boolean {
        return this.decide(Brain.OUTPUT_IDX_RIGHT, Brain.OUTPUT_IDX_LEFT);
    }

    protected abstract think(agent: Agent): number[];

    public render(sketch: P5): void {
        const output = (decision: boolean, idx: number, x: number, y: number) => {
            sketch.stroke(decision ? "#64dd17" : "#ff6d00");
            sketch.line(0, 0, 100 * y, 100 * x);
        };

        sketch.strokeWeight(1);

        output(this.accelerate, Brain.OUTPUT_IDX_ACCELERATE, 0, this._output[0]);
        output(this.brake, Brain.OUTPUT_IDX_BRAKE, 0, -this._output[1]);
        output(this.left, Brain.OUTPUT_IDX_LEFT, -this._output[2], 0);
        output(this.right, Brain.OUTPUT_IDX_RIGHT, this._output[3], 0);
    }
}