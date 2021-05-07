
declare namespace VueAppState {
    class Storage {
        prefix: string;
        storage: any;
        private _cache;
        constructor(name: any, localStorage: any);
        _parseKey (name: any): string;
        $set (key: any, value: any): void;
        $get (key: any): any;
        $remove (key: any): any;
        $keys (): string[];
    }
}
// declare
// export { AppStorage as default };
