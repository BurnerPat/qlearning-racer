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
                    units: 2
                })
            ]
        });

        this.model.weights.forEach(w => {
            const newVals = tf.randomNormal(w.shape);
            // w.val is an instance of tf.Variable
            // @ts-ignore
            w.val.assign(newVals);
        });
    }

    protected think(): number[] {
        return tf.tidy(() => {
            const input = tf.tensor2d([this.sensors.map(e => e.value)]);
            const output = <tf.Tensor>this.model.predict(input);

            return Array.from(output.dataSync());
        });
    }
}