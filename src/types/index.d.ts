interface Operation {
  importerName: string;
  operationNumber: string;
  estimatedArrivalDate: string;
}

interface Storage {
  operations: Operation[];
}

declare module 'electron' {
  interface IpcRenderer {
    invoke(channel: 'saveOperations', operations: Operation[]): Promise<void>;
    invoke(channel: 'loadOperations'): Promise<Operation[]>;
    invoke(channel: 'deleteOperation', operationNumber: string): Promise<void>;
  }
}