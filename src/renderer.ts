import Simulation from "./simulation"
import Sketch from "./sketch";

import * as P5 from "p5";

export default class Renderer {
    private readonly simulation: Simulation;

    public p5: P5;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
    }

    public setup(container: HTMLElement) {
        let callback = (p5: P5) => {
            const sketch = new Sketch(p5);

            p5.setup = () => {
                p5.createCanvas(this.simulation.world.size.x, this.simulation.world.size.y);
            };

            p5.draw = () => {
                this.render(sketch);
            };
        };

        this.p5 = new P5(callback, container);
    }

    private render(sketch: Sketch): void {
        sketch.p5.background("#e0e0e0");

        sketch.p5.push();
        this.simulation.world.render(sketch);
        sketch.p5.pop();

        sketch.p5.push();
        sketch.translate(this.simulation.agent.position);
        this.simulation.agent.render(sketch);
        this.simulation.brain.render(this.simulation.agent, sketch);
        sketch.p5.pop();
    }
}