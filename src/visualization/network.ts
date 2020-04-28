import Brain, {Summary} from "../algorithm/brain";
import ExMath from "../ex-math";
import SketchContainer, {Sketch} from "./sketch-container";
import {Container} from "./ui";

class Connection {
    public node: Node;
    public weight: number;
}

class Node {
    public x: number;
    public y: number;
    public incoming: Connection[] = [];
}

class Layer {
    public nodes: Node[] = [];
}

export default class Network extends SketchContainer {
    public constructor(private readonly brain: Brain, container: Container) {
        super(100, 50, false, container);
    }

    protected render(sketch: Sketch): void {
        const summary: Summary = this.brain.summary();
        const layers = this.buildLayers(summary);

        sketch.p5.background("#ffffff");

        const dX = this.width / layers.length;
        const offX = dX / 2;

        const maxNodes = layers.reduce((acc, e) => Math.max(acc, e.nodes.length), 0);
        const dY = this.height / maxNodes;
        const offY = this.height / 2;

        sketch.p5.fill("#666666");
        sketch.p5.noStroke();

        let maxWeight = 0;

        for (let i = 0; i < layers.length; i++) {
            const l = layers[i].nodes.length;

            for (let j = 0; j < l; j++) {
                const node: Node = layers[i].nodes[j];

                node.x = offX + dX * i;
                node.y = offY + (j - l / 2) * dY + dY / 2;

                sketch.p5.circle(node.x, node.y, this.height / maxNodes / 2);

                for (const i of node.incoming) {
                    maxWeight = Math.max(maxWeight, Math.abs(i.weight));
                }
            }
        }

        sketch.p5.fill("#00ff00");
        sketch.p5.noStroke();

        const maxO = ExMath.argmax(summary.outputs);

        for (let i = 0; i < summary.inputs.length; i++) {
            const node = layers[0].nodes[i];
            sketch.p5.circle(node.x, node.y, this.height / maxNodes / 2 * summary.inputs[i]);
        }

        const out = layers[layers.length - 1].nodes[maxO];
        sketch.p5.circle(out.x, out.y, this.height / maxNodes / 2);

        for (const l of layers) {
            for (const n of l.nodes) {
                for (const i of n.incoming) {
                    sketch.p5.stroke("#ff0000");
                    sketch.p5.strokeWeight(5 * Math.abs(i.weight) / maxWeight);
                    sketch.p5.line(i.node.x, i.node.y, n.x, n.y);
                }
            }
        }
    }

    protected buildLayers(summary: Summary): Layer[] {
        const layers: Layer[] = [
            {
                nodes: new Array(summary.inputs.length).fill(0).map(() => new Node())
            }
        ];

        for (let l = 0; l < summary.layers.length; l++) {
            const data = summary.layers[l];
            const layer = new Layer();

            for (let i = 0; i < data.size; i++) {
                const node: Node = new Node();

                for (let j = 0; j < layers[l].nodes.length; j++) {
                    node.incoming.push({
                        node: layers[l].nodes[j],
                        weight: data.weights[j][i]
                    });
                }

                layer.nodes.push(node);
            }

            layers.push(layer);
        }

        return layers;
    }
}