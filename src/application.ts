import Config from "./config";
import Simulation from "./simulation";
import Keyboard from "./visualization/keyboard";
import Network from "./visualization/network";
import Renderer from "./visualization/renderer";
import UI from "./visualization/ui";

export default class Application {
    private readonly simulation: Simulation;

    private readonly ui: UI;

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

        const renderer = new Renderer(this.config.renderer, this.simulation, this.ui.renderContainer);
        renderer.setup();

        const network = new Network(this.simulation.brain, this.ui.networkContainer);
        network.setup();

        this._keyboard = renderer.keyboard;

        this.startSimulation();
    }

    private startSimulation(): void {
        const timeout = 1000 / this.config.simulation.tickRate;

        const callback = async () => {
            if (!this._keyboard.backspace) {
                await this.simulation.step();
            }

            window.setTimeout(callback, timeout);
        };

        window.setTimeout(callback, timeout);
    }
}