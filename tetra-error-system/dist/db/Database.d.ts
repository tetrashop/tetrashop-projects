export declare class Database {
    private static data;
    static insert(collection: string, record: any): Promise<void>;
    static update(collection: string, id: string, updates: any): Promise<void>;
    static query(collection: string, query: any): Promise<any[]>;
    static clear(collection: string): Promise<void>;
}
//# sourceMappingURL=Database.d.ts.map