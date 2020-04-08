import * as P5 from "p5";

import Agent from "../agent";
import World, {Segment} from "../world";
import Vector from "../vector";
import ExMath from "../exmath";

class Sensor {
    public value: number = 0;

    constructor(public readonly vector: Vector) {

    }
}

export default abstract class Brain {
    public static readonly OUTPUT_IDX_ACCELERATE = 0;
    public static readonly OUTPUT_IDX_BRAKE = 1;
    public static readonly OUTPUT_IDX_LEFT = 2;
    public static readonly OUTPUT_IDX_RIGHT = 3;

    private _output: number[] = new Array(4).fill(0);

    private _agent: Agent;

    private _world: World;

    private _sensors: Sensor[] = [];

    public update(): void {
        if (!this.agent) {
            return;
        }

        const range = 150;

        this._sensors = this.createSensors(range);
        this.findIntersections(range);

        this._output = this.think();
    }

    public get agent(): Agent {
        return this._agent;
    }

    public set agent(agent: Agent) {
        this._agent = agent;
    }

    public get world(): World {
        return this._world;
    }

    public set world(world: World) {
        this._world = world;
    }

    protected get sensors(): Sensor[] {
        return this._sensors;
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

    protected abstract think(): number[];

    private findIntersections(max: number): void {
        const segments = this.world.getSegments(max);

        for (const sensor of this._sensors) {
            sensor.value = this.findIntersection(sensor, segments);
        }
    }

    private findIntersection(sensor: Sensor, segments: Segment[]): number {
        let result = 1;

        for (let i = 0; i < segments.length - 1; i++) {
            const intersect = ExMath.lineIntersection(
                this.agent.position,
                sensor.vector,
                segments[i].edge1,
                segments[i + 1].edge1
            );

            result = Math.min(result, intersect === false ? 1 : Number(intersect));
        }

        return result;
    }

    private createSensors(max: number): Sensor[] {
        const x = this.agent.angle;

        return [
            Vector.createFromRadial(x, max),
            Vector.createFromRadial(x - Math.PI / 4, max),
            Vector.createFromRadial(x + Math.PI / 4, max),
            Vector.createFromRadial(x - Math.PI / 8, max),
            Vector.createFromRadial(x + Math.PI / 8, max),
        ].map(v => new Sensor(v));
    }

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

        for (const sensor of this._sensors) {
            sketch.strokeWeight(1);
            sketch.stroke("#18ffff");
            sketch.line(0, 0, sensor.vector.x, sensor.vector.y);

            const v = sensor.vector.multiply(sensor.value);
            sketch.strokeWeight(2);
            sketch.stroke("#448aff");
            sketch.line(0, 0, v.x, v.y);
        }
    }
}