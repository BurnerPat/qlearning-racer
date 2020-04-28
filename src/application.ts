import Config from "./config";
import Simulation from "./simulation";
import Keyboard from "./visualization/keyboard";
import Network from "./visualization/network";
import Renderer from "./visualization/renderer";
import UI from "./visualization/ui";
import Visualizer from "./visualization/visualizer";

export default class Application {
    private readonly simulation: Simulation;

    private readonly ui: UI;

    private readonly visualizers: Visualizer[] = [];

    public constructor(container: HTMLElement, private readonly config: Config) {
        this.ui = new UI(container);
        this.simulation = new Simulation(config);
    }

    private _keyboard: Keyboard;

    public get keyboard(): Keyboard {
        return this._keyboard;
    }

    public start(): void {
        this.simulation.initialize(this);
        this.ui.initialize();

        const renderer: Renderer = new Renderer(this.config.renderer, this.simulation, this.ui.renderContainer);
        this.visualizers.push(renderer);
        this.visualizers.push(new Network(this.simulation, this.ui.networkContainer));

        this.visualizers.forEach(e => e.setup());

        this._keyboard = renderer.keyboard;

        this.startSimulation();
    }

    private startSimulation(): void {
        const timeout = 1000 / this.config.simulation.tickRate;

        const callback = async () => {
            await this.simulation.step();
            this.visualizers.forEach(e => e.update());
            await this.simulation.train();

            window.setTimeout(callback, timeout);
        };

        window.setTimeout(callback, timeout);
    }
}