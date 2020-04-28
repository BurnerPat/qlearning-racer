import ExMath from "../ex-math";

export interface LayerSummary {
    size: number;
    weights: number[][];
}

export interface Summary {
    inputs: number[];
    outputs: number[];
    layers: LayerSummary[];
}

export default abstract class Brain {
    public static readonly OUTPUT_IDX_ACCELERATE = 0;
    public static readonly OUTPUT_IDX_ACCELERATE_LEFT = 1;
    public static readonly OUTPUT_IDX_ACCELERATE_RIGHT = 2;
    public static readonly OUTPUT_IDX_LEFT = 3;
    public static readonly OUTPUT_IDX_RIGHT = 4;
    public static readonly OUTPUT_IDX_BRAKE = 5;

    public static readonly SENSOR_COUNT = 5;
    public static readonly OUTPUT_COUNT = 6;
    private _action: number = -1;

    private _input: number[] = [];
    private _output: number[] = new Array(Brain.OUTPUT_COUNT).fill(0);

    public get output(): number[] {
        return this._output;
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

    public think(input: number[]): number[] {
        this._output = this.thinkInternal(input);

        if (this._output.reduce((acc, e) => acc + e, 0) === 0) {
            this._action = -1;
        }
        else {
            this._action = ExMath.argmax(this._output);
        }

        this._input = input;
        return this._output;
    }

    public random(): void {
        this._action = Math.floor(Math.random() * (Brain.OUTPUT_COUNT - 1));
    }

    public async abstract train(input: number[][], output: number[][]): Promise<void>;

    public summary(): Summary {
        return {
            inputs: this._input,
            outputs: this._output,
            layers: this.layerSummary()
        };
    }

    protected decide(...idx: number[]): boolean {
        return idx.indexOf(this._action) >= 0;
    }

    protected abstract thinkInternal(input: number[]): number[];

    protected abstract layerSummary(): LayerSummary[];
}