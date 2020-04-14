import Brain from "./brain";

import * as tf from "@tensorflow/tfjs";

export default class NnBrain extends Brain {
    private model: tf.LayersModel;

    public constructor() {
        super();

        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    units: 10,
                    inputShape: [Brain.SENSOR_COUNT],
                    activation: "linear"
                }),
                tf.layers.dense({
                    units: 10,
                    activation: "linear"
                }),
                tf.layers.dense({
                    units: 10,
                    activation: "linear"
                }),
                tf.layers.dense({
                    units: Brain.OUTPUT_COUNT,
                    activation: "linear"
                })
            ]
        });

        this.model.compile({
            optimizer: "sgd",
            loss: "meanSquaredError"
        });
    }

    protected thinkInternal(input: number[]): number[] {
        const output = tf.tidy(() => {
            const tensor = tf.tensor2d([input]);
            return <tf.Tensor>this.model.predict(tensor);
        });

        return Array.from(output.dataSync());
    }

    public async train(input: number[][], output: number[][]): Promise<void> {
        await this.model.fit(tf.tensor2d(input), tf.tensor2d(output));
    }
}