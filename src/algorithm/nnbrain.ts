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
                    inputShape: [5]
                }),
                tf.layers.dense({
                    units: 10
                }),
                tf.layers.dense({
                    units: 10
                }),
                tf.layers.dense({
                    units: 4
                })
            ]
        });
    }

    protected think(): number[] {
        const output = tf.tidy(() => {
            const input = tf.tensor2d([this.sensors.map(e => e.value)]);
            return <tf.Tensor>this.model.predict(input);
        });

        return Array.from(output.dataSync());
    }
}