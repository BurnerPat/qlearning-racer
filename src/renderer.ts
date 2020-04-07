import Simulation from "./simulation"

import * as P5 from "p5";

export default class Renderer {
    private readonly simulation: Simulation;

    public p5: P5;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
    }

    public setup(container: HTMLElement) {
        let callback = (sketch: P5) => {
            sketch.setup = () => {
                sketch.createCanvas(this.simulation.world.size.x, this.simulation.world.size.y);
            };

            sketch.draw = () => {
                this.render(sketch);
            };
        };

        this.p5 = new P5(callback, container);
    }

    private render(sketch: P5): void {
        sketch.background("#e0e0e0");

        const entities = [this.simulation.world.agent];

        for (const entity of entities) {
            sketch.push();
            sketch.translate(entity.position.x, entity.position.y);
            entity.render(sketch);
            sketch.pop();
        }
    }
}