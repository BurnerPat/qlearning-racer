import Vector from "./vector";
import Sketch from "./sketch";
import World, {Segment} from "./world";
import ExMath from "./exmath";
import Brain from "./algorithm/brain";

export interface AgentConfig {
    acceleration: number;
    steer: number;
    brake: number;
    friction: number;

    width: number;
    height: number;
}

class Sensor {
    public value: number = 0;

    constructor(public readonly vector: Vector) {

    }
}

export default class Agent {
    public angle: number = 0;

    public steer: number = 0;

    public position: Vector = new Vector();

    public movement: Vector = new Vector();

    public force: Vector = new Vector();

    public left: boolean = false;

    public right: boolean = false;

    public accelerate: boolean = false;

    public brake: boolean = false;

    private _state: Sensor[] = [];

    public constructor(private readonly config: AgentConfig) {
        // Empty
    }

    public update(): void {
        const weight = (x: boolean) => x ? 1 : 0;

        this.steer = -weight(this.left) * this.config.steer + weight(this.right) * this.config.steer;
        this.angle += this.steer;

        this.force = Vector.createFromRadial(this.angle, weight(this.accelerate) * this.config.acceleration);
        this.movement = this.movement.add(this.force).multiply(this.config.friction);

        if (this.brake) {
            this.movement = this.movement.multiply(this.config.brake);
        }

        this.position = this.position.add(this.movement);
    }

    public apply(brain: Brain): void {
        this.accelerate = brain.accelerate;
        this.brake = brain.brake;

        this.left = brain.left;
        this.right = brain.right;
    }

    public get state(): number[] {
        return this._state.map(e => e.value);
    }

    public observe(world: World): void {
        const range = 400;

        this._state = this.createSensors(range);
        this.findIntersections(world, range);
    }

    private findIntersections(world: World, max: number): void {
        const segments = world.getSegments(max);

        for (const sensor of this._state) {
            sensor.value = this.findIntersection(sensor, segments);
        }
    }

    private findIntersection(sensor: Sensor, segments: Segment[]): number {
        let result = 1;

        for (let i = 0; i < segments.length - 1; i++) {
            const end = this.position.add(sensor.vector);

            let intersect = ExMath.lineIntersection(
                this.position,
                end,
                segments[i].edge1,
                segments[i + 1].edge1
            );

            if (intersect === false) {
                intersect = ExMath.lineIntersection(
                    this.position,
                    end,
                    segments[i].edge2,
                    segments[i + 1].edge2
                );

                if (intersect === false) {
                    intersect = 1;
                }
            }

            result = Math.min(result, <number>intersect);
        }

        return result;
    }

    private createSensors(length: number): Sensor[] {
        const a = this.angle;

        return [
            Vector.createFromRadial(a, length),
            Vector.createFromRadial(a - Math.PI / 8, length / 2),
            Vector.createFromRadial(a + Math.PI / 8, length / 2),
            Vector.createFromRadial(a - Math.PI / 4, length / 4),
            Vector.createFromRadial(a + Math.PI / 4, length / 4),
        ].map(v => new Sensor(v));
    }

    public reset(): void {
        this.angle = 0;
        this.steer = 0;

        this.movement = new Vector();
        this.force = new Vector();
    }

    public render(sketch: Sketch): void {
        sketch.p5.rotate(this.angle);

        const size = new Vector(this.config.height, this.config.width);
        const wheelSize = size.divide(5);

        const offset = size.divide(-2);
        const wheelOffset = wheelSize.divide(-2);

        sketch.p5.noStroke();

        sketch.p5.fill("#37474f");

        const wheel = (x: number, y: number, rotation: number) => {
            sketch.p5.push();

            sketch.p5.translate(x, y);
            sketch.p5.rotate(rotation);
            sketch.rect(wheelOffset, wheelSize);

            sketch.p5.pop();
        };

        wheel(-offset.x, offset.y, this.steer * 5);
        wheel(-offset.x, -offset.y, this.steer * 5);

        wheel(offset.x, offset.y, 0);
        wheel(offset.x, -offset.y, 0);

        sketch.p5.fill("#d50000");
        sketch.rect(offset, size);

        sketch.p5.push();
        sketch.p5.rotate(-this.angle);

        for (const sensor of this._state) {
            sketch.p5.strokeWeight(1);
            sketch.p5.stroke("#18ffff");
            sketch.line(Vector.NULL, sensor.vector);

            sketch.p5.strokeWeight(2);
            sketch.p5.stroke("#e040fb");
            sketch.line(Vector.NULL, sensor.vector.multiply(sensor.value));
        }

        sketch.p5.pop();
    }
}