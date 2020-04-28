import Brain from "./algorithm/brain";
import ExMath from "./ex-math";
import Vector from "./vector";
import World, {Segment} from "./world";

export interface AgentConfig {
    acceleration: number;
    steer: number;
    brake: number;
    friction: number;
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

    public constructor(private readonly config: AgentConfig) {
        // Empty
    }

    private _sensors: Sensor[] = [];

    public get sensors(): Sensor[] {
        return this._sensors;
    }

    public get state(): number[] {
        return this._sensors.map(e => e.value);
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

    public observe(world: World): void {
        const range = 400;

        this._sensors = this.createSensors(range);
        this.findIntersections(world, range);
    }

    public reset(): void {
        this.angle = 0;
        this.steer = 0;

        this.movement = new Vector();
        this.force = new Vector();
    }

    private findIntersections(world: World, max: number): void {
        const segments = world.getSegments(max);

        for (const sensor of this._sensors) {
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
            Vector.createFromRadial(a - Math.PI / 8, length),
            Vector.createFromRadial(a + Math.PI / 8, length),
            Vector.createFromRadial(a - Math.PI / 4, length),
            Vector.createFromRadial(a + Math.PI / 4, length)
        ].map(v => new Sensor(v));
    }
}