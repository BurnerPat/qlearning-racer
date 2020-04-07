import Vector from "./vector";
import World from "./world";

import Brain from "./algorithm/brain";

import * as P5 from "p5";

export default class Agent {
    private angle: number = 0;

    private steer: number = 0;

    public position: Vector = new Vector();

    public movement: Vector = new Vector();

    public force: Vector = new Vector();

    private readonly _brain: Brain = null;

    constructor(position: Vector, brain: Brain) {
        this.position = position;

        this._brain = brain;
    }

    public get brain(): Brain {
        return this._brain;
    }

    update(world: World): void {
        this.brain.update();

        const weight = (x: boolean) => x ? 1 : 0;

        const steeringFactor = 0.1;

        this.steer = -weight(this.brain.left) * steeringFactor + weight(this.brain.right) * steeringFactor;
        this.angle += this.steer;

        const accelerationFactor = 1.5;

        this.force = Vector.createFromRadial(this.angle, weight(this.brain.accelerate) * accelerationFactor);
        this.movement = this.movement.add(this.force).multiply(0.925);

        if (this.brain.brake) {
            this.movement = this.movement.multiply(0.5);
        }

        this.position = this.position.add(this.movement);
    }

    public get alive(): boolean {
        return true;
    }

    public get fitness(): number {
        return 0;
    }

    public render(sketch: P5): void {
        sketch.rotate(this.angle);

        const width = 50;
        const height = 100;
        const wheelWidth = 10;
        const wheelHeight = 20;

        sketch.noStroke();

        sketch.fill("#37474f");

        const wheel = (x: number, y: number, rotation: number) => {
            sketch.push();
            sketch.translate(x, y);
            sketch.rotate(rotation);
            sketch.rect(wheelHeight / -2, wheelWidth / -2, wheelHeight, wheelWidth);
            sketch.pop();
        };

        wheel(height / 2, width / -2, this.steer * 5);
        wheel(height / 2, width / 2, this.steer * 5);

        wheel(height / -2, width / -2, 0);
        wheel(height / -2, width / 2, 0);

        sketch.fill("#d50000");
        sketch.rect(height / -2, width / -2, height, width);

        this.brain.render(sketch);
    }

    public reset(): void {
        this.angle = 0;
        this.steer = 0;

        this.movement = new Vector();
        this.force = new Vector();
    }
}