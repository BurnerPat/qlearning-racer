import Simulation from "./simulation";
import Evolution from "./algorithm/evolution";
import World from "./world";
import Vector from "./vector";
import Config from "./config";
import Renderer from "./renderer";
import ControlBrain from "./algorithm/control_brain";

export default class Application {
    private readonly simulation: Simulation;

    private readonly container: HTMLElement;

    public constructor(container: HTMLElement, width: number, height: number) {
        const world = new World(new Vector(width, height));
        this.simulation = new Simulation(world, new Evolution());

        this.container = container;
    }

    public start(): void {
        const renderer = new Renderer(this.simulation);
        renderer.setup(this.container);

        this.simulation.populate(new ControlBrain(this.simulation.world.agent, renderer.p5));
        this.startSimulation();
    }

    private startSimulation(): void {
        let handle = window.setInterval(() => {
            this.simulation.step();
        }, 1000 / Config.TICK_RATE_SIMULATION);
    }
}