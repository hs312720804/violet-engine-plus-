declare namespace VueAppState {
    interface StateOptions {
        prefix?: string,
        localStorage?: any
    }
    class State {
        constructor(options?: StateOptions);
    }
}
// export { AppState as default };
