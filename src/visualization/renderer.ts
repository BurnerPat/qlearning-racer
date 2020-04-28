import Agent from "../agent";
import Brain from "../algorithm/brain";
import Simulation from "../simulation";
import Vector from "../vector";
import World from "../world";
import SketchContainer, {Sketch} from "./sketch-container";
import {Container} from "./ui";

export interface RendererConfig {
    agentWidth: number;
    agentHeight: number;
    outputLength: number;
}

export default class Renderer extends SketchContainer {
    public constructor(private readonly config: RendererConfig, private readonly simulation: Simulation, container: Container) {
        super(simulation.world.size.x, simulation.world.size.y, true, container);
    }

    public renderWorld(sketch: Sketch, world: World): void {
        for (let i = 0; i < world.track.length; i++) {
            const s1 = world.track.get(i);
            const s2 = world.track.get(i + 1);

            sketch.p5.stroke("black");
            sketch.p5.strokeWeight(1);
            sketch.line(s1.point, s2.point);

            sketch.p5.noStroke();
            sketch.p5.fill(s1 == world.segment ? "green" : "gray");
            sketch.quad(s1.edge1, s2.edge1, s2.edge2, s1.edge2);

            sketch.p5.strokeWeight(2);

            sketch.p5.stroke("#827717");
            sketch.line(s1.edge1, s2.edge1);

            sketch.p5.stroke("#1b5e20");
            sketch.line(s1.edge2, s2.edge2);
        }
    }

    protected render(sketch: Sketch): void {
        sketch.p5.background("#e0e0e0");

        sketch.p5.push();
        this.renderWorld(sketch, this.simulation.world);
        sketch.p5.pop();

        sketch.p5.push();
        sketch.translate(this.simulation.agent.position);
        this.renderAgent(sketch, this.simulation.agent);
        this.renderBrain(sketch, this.simulation.brain);
        sketch.p5.pop();
    }

    private renderAgent(sketch: Sketch, agent: Agent): void {
        sketch.p5.rotate(agent.angle);

        const size = new Vector(this.config.agentHeight, this.config.agentWidth);
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

        wheel(-offset.x, offset.y, agent.steer * 5);
        wheel(-offset.x, -offset.y, agent.steer * 5);

        wheel(offset.x, offset.y, 0);
        wheel(offset.x, -offset.y, 0);

        sketch.p5.fill("#d50000");
        sketch.rect(offset, size);

        sketch.p5.push();
        sketch.p5.rotate(-agent.angle);

        for (const sensor of agent.sensors) {
            sketch.p5.strokeWeight(1);
            sketch.p5.stroke("#18ffff");
            sketch.line(Vector.NULL, sensor.vector);

            sketch.p5.strokeWeight(2);
            sketch.p5.stroke("#e040fb");
            sketch.line(Vector.NULL, sensor.vector.multiply(1 - sensor.value));
        }

        sketch.p5.pop();
    }

    private renderBrain(sketch: Sketch, brain: Brain): void {
        const output = brain.output;
        const max = Math.max(...output) || 1;

        const draw = (decision: boolean, idx: number, x: number, y: number) => {
            sketch.p5.stroke(decision ? "#64dd17" : "#ff6d00");
            sketch.p5.line(0, 0, this.config.outputLength * (output[idx] * y / max), this.config.outputLength * (output[idx] * x / max));
        };

        sketch.p5.strokeWeight(1);

        draw(brain.accelerate, Brain.OUTPUT_IDX_ACCELERATE, 0, 1);
        draw(brain.brake, Brain.OUTPUT_IDX_BRAKE, 0, -1);
        draw(brain.left, Brain.OUTPUT_IDX_LEFT, -1, 0);
        draw(brain.right, Brain.OUTPUT_IDX_RIGHT, 1, 0);
    }
}