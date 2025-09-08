const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const storage = require('./storage');

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.maximize();
  win.show();

  win.loadFile(path.join(__dirname, 'index.html'));
  
  // Open DevTools in development
  // win.webContents.openDevTools();
};

// Ensure files directory exists
const ensureFilesDirectory = () => {
  const filesDir = path.join(__dirname, 'files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }
  return filesDir;
};
require('update-electron-app')()
app.whenReady().then(() => {
  ensureFilesDirectory();

  // Existing handlers
  ipcMain.handle('load-operations', () => {
    return storage.loadOperations();
  });

  ipcMain.handle('save-operations', (event, operations) => {
    storage.saveOperations(operations);
    return;
  });

  ipcMain.handle('delete-operation', async (event, operationNumber) => {
    // Get operation data before deleting to clean up files
    const operations = storage.loadOperations();
    const operation = operations.find(op => op.operationNumber === operationNumber);
    
    if (operation && operation.files) {
      // Delete associated files
      for (const file of operation.files) {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      
      // Delete operation directory if empty
      const operationDir = path.join(__dirname, 'files', operationNumber);
      try {
        if (fs.existsSync(operationDir)) {
          const files = fs.readdirSync(operationDir);
          if (files.length === 0) {
            fs.rmdirSync(operationDir);
          }
        }
      } catch (error) {
        console.error('Error deleting directory:', error);
      }
    }
    
    storage.deleteOperation(operationNumber);
    return;
  });

  // New file handling
  ipcMain.handle('save-file', async (event, operationNumber, fileName, sourcePath) => {
    try {
      const filesDir = ensureFilesDirectory();
      const operationDir = path.join(filesDir, operationNumber);
      
      // Create operation-specific directory
      if (!fs.existsSync(operationDir)) {
        fs.mkdirSync(operationDir, { recursive: true });
      }
      
      const destinationPath = path.join(operationDir, fileName);
      
      // Copy file to operation directory
      fs.copyFileSync(sourcePath, destinationPath);
      
      return destinationPath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  });

  ipcMain.handle('delete-file', async (event, filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  });

  ipcMain.handle('open-file', async (event, filePath) => {
    try {
      await shell.openPath(filePath);
      return true;
    } catch (error) {
      console.error('Error opening file:', error);
      throw error;
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});