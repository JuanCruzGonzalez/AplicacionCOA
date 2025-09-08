const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'operations.json');

const loadOperations = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading operations:', error);
    return [];
  }
};

const saveOperations = (operations) => {
  try {
    // Validate data before saving
    const validOperations = operations.map(op => ({
      importerName: op.importerName || '',
      operationNumber: op.operationNumber || '',
      estimatedArrivalDate: op.estimatedArrivalDate || '',
      files: op.files || [],
      createdAt: op.createdAt || new Date().toISOString()
    }));

    fs.writeFileSync(dataFilePath, JSON.stringify(validOperations, null, 2));
  } catch (error) {
    console.error('Error saving operations:', error);
    throw error;
  }
};

const deleteOperation = (operationNumber) => {
  try {
    const operations = loadOperations();
    const updatedOperations = operations.filter(op => op.operationNumber !== operationNumber);
    saveOperations(updatedOperations);
  } catch (error) {
    console.error('Error deleting operation:', error);
    throw error;
  }
};

const getOperationById = (operationNumber) => {
  try {
    const operations = loadOperations();
    return operations.find(op => op.operationNumber === operationNumber);
  } catch (error) {
    console.error('Error getting operation:', error);
    return null;
  }
};

module.exports = {
  loadOperations,
  saveOperations,
  deleteOperation,
  getOperationById,
};