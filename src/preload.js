const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadOperations: () => ipcRenderer.invoke('load-operations'),
  saveOperations: (operations) => ipcRenderer.invoke('save-operations', operations),
  deleteOperation: (operationNumber) => ipcRenderer.invoke('delete-operation', operationNumber),
  saveFile: (operationNumber, fileName, filePath) => ipcRenderer.invoke('save-file', operationNumber, fileName, filePath),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
});