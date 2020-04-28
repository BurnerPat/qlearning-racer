import * as $ from "jquery";
import Split from "split-grid";

export interface ResizeListener {
    (width: number, height: number): void;
}

export class Container {
    public resize: ResizeListener;

    public constructor(public readonly $element: JQuery) {
        // empty
    }

    public get width(): number {
        return this.$element.width();
    }

    public get height(): number {
        return this.$element.height();
    }

    public get element(): HTMLElement {
        return this.$element.get()[0];
    }

    public fireResize(): void {
        if (this.resize) {
            this.resize(this.width, this.height);
        }
    }
}

export default class UI {
    public constructor(private readonly container: HTMLElement) {
        // Empty
    }

    private _renderContainer: Container;

    public get renderContainer(): Container {
        return this._renderContainer;
    }

    private _networkContainer: Container;

    public get networkContainer(): Container {
        return this._networkContainer;
    }

    private _graphContainer: Container;

    public get graphContainer(): Container {
        return this._graphContainer;
    }

    public initialize(): void {
        const $container = $(this.container);

        $container.addClass("ui");

        $container.html(`
            <div class="renderer"></div>
            <div class="network"></div>
            <div class="graph"></div>
            <div></div>
            
            <div class="gutter horizontal"></div>
            <div class="gutter vertical"></div>
        `);

        this._renderContainer = new Container($container.find(".renderer"));
        this._networkContainer = new Container($container.find(".network"));
        this._graphContainer = new Container($container.find(".graph"));

        Split({
            columnGutters: [
                {
                    track: 1,
                    element: $container.find(".gutter.vertical").get()[0]
                }
            ],
            rowGutters: [
                {
                    track: 1,
                    element: $container.find(".gutter.horizontal").get()[0]
                }
            ]
        });

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "style") {
                    this._renderContainer.fireResize();
                    this._graphContainer.fireResize();
                    this._networkContainer.fireResize();
                }
            }
        });

        observer.observe(this.container, {
            attributes: true,
            attributeFilter: [
                "style"
            ]
        });
    }
}