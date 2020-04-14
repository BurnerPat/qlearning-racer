import Simulation from "./simulation";
import Config from "./config";
import Renderer from "./renderer";
import Keyboard from "./keyboard";

export default class Application {
    private readonly simulation: Simulation;

    private readonly container: HTMLElement;

    private _keyboard: Keyboard;

    public constructor(container: HTMLElement, private readonly config: Config) {
        this.simulation = new Simulation(config);
        this.container = container;
    }

    public start(): void {
        const renderer = new Renderer(this.simulation);
        renderer.setup(this.container);

        this._keyboard = new Keyboard(renderer.p5);

        this.simulation.initialize(this);
        this.startSimulation();
    }

    public get keyboard(): Keyboard {
        return this._keyboard;
    }

    private startSimulation(): void {
        const timeout = 1000 / this.config.simulation.tickRate;

        const callback = async () => {
            await this.simulation.step();
            window.setTimeout(callback, timeout)
        };

        window.setTimeout(callback, timeout);
    }
}