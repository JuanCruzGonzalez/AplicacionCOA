const importerInput = document.getElementById('importerName');
const operationNumberInput = document.getElementById('operationNumber');
const arrivalDateInput = document.getElementById('arrivalDate');
const addOperationButton = document.getElementById('addOperation');
const operationsGrid = document.getElementById('operationsGrid');
const emptyState = document.getElementById('emptyState');

// Filter elements
const searchFilter = document.getElementById('searchFilter');
const dateFromFilter = document.getElementById('dateFromFilter');
const dateToFilter = document.getElementById('dateToFilter');
const sortBySelect = document.getElementById('sortBy');
const clearFiltersButton = document.getElementById('clearFilters');
const resultsCount = document.getElementById('resultsCount');

// Modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalFilters = document.getElementById('modalFilters');
const openAddModal = document.getElementById('openAddModal');
const openFilterModal = document.getElementById('openFilterModal');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const closeModalFilters = document.getElementById('closeModalFilters');
const cancelModalFilters = document.getElementById('cancelModalFilters');
const operationDetailModal = document.getElementById('operationDetailModal');
const closeOperationDetailModal = document.getElementById('closeOperationDetailModal');
const operationDetailTitle = document.getElementById('operationDetailTitle');
const operationDetailContent = document.getElementById('operationDetailContent');
// Store all operations for filtering
let allOperations = [];

const showOperationDetailModal = (operation) => {
  operationDetailTitle.textContent = `Operación ${operation.operationNumber}`;

  operationDetailContent.innerHTML = `
    <div style="display: grid; gap: 24px;">
      <!-- Información básica -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e3a8a; margin-bottom: 16px; font-size: 16px; font-weight: 700; text-transform: uppercase;">Información General</h3>
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <strong style="color: #374151; min-width: 140px;">Cliente:</strong>
            <span style="color: #475569;">${operation.importerName}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <strong style="color: #374151; min-width: 140px;">Número:</strong>
            <span style="color: #475569; font-family: monospace; background: white; border-radius: 4px; font-size: 16px;">${operation.operationNumber}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <strong style="color: #374151; min-width: 140px;">Fecha de Arribo:</strong>
            <span style="color: #475569;">${formatDate(operation.estimatedArrivalDate)}</span>
          </div>
        </div>
      </div>

      <!-- Sección de archivos -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="color: #1e3a8a; font-size: 16px; font-weight: 700; text-transform: uppercase;">
            Archivos (${operation.files ? operation.files.length : 0})
          </h3>
          <div class="file-input-wrapper">
            <input type="file" class="file-input" id="detailFileInput-${operation.operationNumber}" multiple>
            <label for="detailFileInput-${operation.operationNumber}" class="file-input-btn">+ Agregar Archivo</label>
          </div>
        </div>
        
        <div id="detailFilesList-${operation.operationNumber}">
          ${operation.files && operation.files.length > 0 ?
      operation.files.map(file => `
              <div class="file-item" style="margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <svg style="width: 18px; height: 18px; fill: #3b82f6;" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <div>
                    <div class="file-name" title="${file.name}" style="font-weight: 500;">${file.name}</div>
                    <div style="font-size: 12px; color: #64748b;">
                      ${file.size ? Math.round(file.size / 1024) + ' KB' : ''} 
                      ${file.dateAdded ? '• Agregado ' + formatDate(file.dateAdded) : ''}
                    </div>
                  </div>
                </div>
                <div class="file-actions">
                  <button class="file-btn detail-open-file-btn" data-operation="${operation.operationNumber}" data-filename="${file.name}">Abrir</button>
                  <button class="file-btn delete detail-remove-file-btn" data-operation="${operation.operationNumber}" data-filename="${file.name}">Eliminar</button>
                </div>
              </div>
            `).join('')
      :
      '<div style="text-align: center; padding: 24px; color: #64748b; border: 2px dashed #cbd5e1; border-radius: 8px;"><p>No hay archivos adjuntos</p><small>Agrega archivos usando el botón de arriba</small></div>'
    }
        </div>
      </div>
    </div>
  `;

  // Agregar event listeners para los botones de archivos
  setupFileEventListeners(operation.operationNumber);

  operationDetailModal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

// Función para configurar event listeners de archivos en el modal de detalles
const setupFileEventListeners = (operationNumber) => {
  // File input
  const fileInput = document.getElementById(`detailFileInput-${operationNumber}`);
  if (fileInput) {
    fileInput.addEventListener('change', (e) => handleFileAdd(operationNumber, e.target.files));
  }

  // Open file buttons
  const openFileButtons = document.querySelectorAll('.detail-open-file-btn');
  openFileButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const operationNumber = e.target.getAttribute('data-operation');
      const fileName = e.target.getAttribute('data-filename');
      openFile(operationNumber, fileName);
    });
  });

  // Remove file buttons
  const removeFileButtons = document.querySelectorAll('.detail-remove-file-btn');
  removeFileButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const operationNumber = e.target.getAttribute('data-operation');
      const fileName = e.target.getAttribute('data-filename');
      await removeFile(operationNumber, fileName);
      // Recargar el modal con datos actualizados
      const operations = await window.api.loadOperations();
      const operation = operations.find(op => op.operationNumber === operationNumber);
      if (operation) {
        showOperationDetailModal(operation);
      }
    });
  });
};
const hideOperationDetailModal = () => {
  operationDetailModal.classList.remove('show');
  document.body.style.overflow = 'auto';
};
// Event listeners para el modal de detalles
closeOperationDetailModal.addEventListener('click', hideOperationDetailModal);
// Cerrar modal al hacer clic fuera
operationDetailModal.addEventListener('click', (e) => {
  if (e.target === operationDetailModal) {
    hideOperationDetailModal();
  }
});

// Modal functionality
const showModal = () => {
  modalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Focus on first input
  document.getElementById('importerName').focus();
};

const showModalFilters = () => {
  modalFilters.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Focus on first input
  document.getElementById('searchFilter').focus();
};

const hideModalFilter = () => {
  modalFilters.classList.remove('show');
  document.body.style.overflow = 'auto';
  // Clear form when closing
  searchFilter.value = '';
  dateFromFilter.value = '';
  dateToFilter.value = '';
  applyFiltersAndSort();
};
const hideModal = () => {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
  // Clear form when closing
  document.getElementById('importerName').value = '';
  document.getElementById('operationNumber').value = '';
  document.getElementById('arrivalDate').value = '';
};

const loadOperations = async () => {
  allOperations = await window.api.loadOperations();
  applyFiltersAndSort();
};

const applyFiltersAndSort = () => {
  let filteredOperations = [...allOperations];

  // Apply search filter
  const searchTerm = searchFilter.value.toLowerCase().trim();
  if (searchTerm) {
    filteredOperations = filteredOperations.filter(operation =>
      operation.importerName.toLowerCase().includes(searchTerm) ||
      operation.operationNumber.toLowerCase().includes(searchTerm)
    );
  }

  // Apply date range filters
  const dateFrom = dateFromFilter.value;
  const dateTo = dateToFilter.value;

  if (dateFrom || dateTo) {
    filteredOperations = filteredOperations.filter(operation => {
      if (!operation.estimatedArrivalDate) return false;

      const operationDate = new Date(operation.estimatedArrivalDate);
      let includeOperation = true;

      if (dateFrom) {
        includeOperation = includeOperation && operationDate >= new Date(dateFrom);
      }

      if (dateTo) {
        includeOperation = includeOperation && operationDate <= new Date(dateTo);
      }

      return includeOperation;
    });
  }

  // Apply sorting
  const sortValue = sortBySelect.value;
  const [sortField, sortDirection] = sortValue.split('-');

  filteredOperations.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle dates
    if (sortField === 'estimatedArrivalDate' || sortField === 'createdAt') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    // Handle strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;

    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Update display
  displayOperations(filteredOperations);
  updateResultsCount(filteredOperations.length);
};

const displayOperations = (operations) => {
  operationsGrid.innerHTML = '';

  if (operations.length === 0) {
    if (allOperations.length === 0) {
      emptyState.innerHTML = `
        <h3>Sin operaciones aun</h3>
        <p>Agrega una nueva operacion para comenzar</p>
      `;
    } else {
      emptyState.innerHTML = `
        <h3>Los filtros no coinciden con ninguna operacion</h3>
        <p>Intenta ajustar o limpiar los filtros</p>
      `;
    }
    emptyState.style.display = 'block';
    operationsGrid.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    operations.forEach(operation => addOperationToGrid(operation));
  }
};

const updateResultsCount = (count) => {
  const total = allOperations.length;
  if (count === total) {
    resultsCount.textContent = `${total} operacion${total !== 1 ? 'es' : ''}`;
  } else {
    resultsCount.textContent = `${count} de ${total} operacion${total !== 1 ? 'es' : ''} mostradas`;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const addOperationToGrid = (operation) => {
  const operationCard = document.createElement('div');
  operationCard.className = 'operation-card';

  // Ensure files array exists
  if (!operation.files) {
    operation.files = [];
  }

  operationCard.innerHTML = `
    <div class="operation-header">
      <div class="flex items-center">
        <div class="operation-number">${operation.operationNumber}</div>
        <div class="importer-name">${operation.importerName}</div>
        <div class="operation-details">
          <div class="detail-item">
            <svg class="detail-icon" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span class="detail-text">Arribo: ${formatDate(operation.estimatedArrivalDate)}</span>
          </div>
        </div>
      </div>
      <button class="delete-btn" data-operation="${operation.operationNumber}">Eliminar</button>
    </div>
    

    <div class="files-section">
      <div class="files-header">
        <span class="files-title">Archivos (${operation.files.length})</span>
        <div class="file-input-wrapper">
          <input type="file" class="file-input" id="fileInput-${operation.operationNumber}" multiple>
          <label for="fileInput-${operation.operationNumber}" class="file-input-btn">+ Agregar</label>
        </div>
      </div>
      <div class="files-list" id="filesList-${operation.operationNumber}">
        ${operation.files.map(file => `
          <div class="file-item">
            <span class="file-name" title="${file.name}">${file.name}</span>
            <div class="file-actions">
              <button class="file-btn open-file-btn" data-operation="${operation.operationNumber}" data-filename="${file.name}">Abrir</button>
              <button class="file-btn delete remove-file-btn" data-operation="${operation.operationNumber}" data-filename="${file.name}">Eliminar</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Add event listeners
  const deleteBtn = operationCard.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    const operationNumber = e.target.getAttribute('data-operation');
    deleteOperation(operationNumber);
  });

  // Add file input event listener
  const fileInput = operationCard.querySelector(`#fileInput-${operation.operationNumber}`);
  fileInput.addEventListener('change', (e) => handleFileAdd(operation.operationNumber, e.target.files));

  // Add file action event listeners
  const openFileButtons = operationCard.querySelectorAll('.open-file-btn');
  openFileButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const operationNumber = e.target.getAttribute('data-operation');
      const fileName = e.target.getAttribute('data-filename');
      openFile(operationNumber, fileName);
    });
  });

  const removeFileButtons = operationCard.querySelectorAll('.remove-file-btn');
  removeFileButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const operationNumber = e.target.getAttribute('data-operation');
      const fileName = e.target.getAttribute('data-filename');
      removeFile(operationNumber, fileName);
    });
  });
  operationCard.addEventListener('click', (e) => {
    // Evitar que se abra el modal si se hace clic en botones
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    showOperationDetailModal(operation);
  });
  operationsGrid.appendChild(operationCard);
};

const handleFileAdd = async (operationNumber, files) => {
  const operations = await window.api.loadOperations();
  const operation = operations.find(op => op.operationNumber === operationNumber);

  if (!operation) return;

  if (!operation.files) {
    operation.files = [];
  }

  for (let file of files) {
    // Copy file to application directory and store reference
    const filePath = await window.api.saveFile(operationNumber, file.name, file.path);

    // Check if file already exists
    if (!operation.files.find(f => f.name === file.name)) {
      operation.files.push({
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
        dateAdded: new Date().toISOString()
      });
    }
  }

  await window.api.saveOperations(operations);
  loadOperations();
};

const removeFile = async (operationNumber, fileName) => {
  if (!confirm(`¿Seguro que quieres eliminar "${fileName}"?`)) return;

  const operations = await window.api.loadOperations();
  const operation = operations.find(op => op.operationNumber === operationNumber);

  if (!operation || !operation.files) return;

  // Remove file from filesystem
  const fileToRemove = operation.files.find(f => f.name === fileName);
  if (fileToRemove) {
    await window.api.deleteFile(fileToRemove.path);
  }

  // Remove from operation
  operation.files = operation.files.filter(f => f.name !== fileName);

  await window.api.saveOperations(operations);
  loadOperations();
};

const openFile = async (operationNumber, fileName) => {
  const operations = await window.api.loadOperations();
  const operation = operations.find(op => op.operationNumber === operationNumber);

  if (!operation || !operation.files) return;

  const file = operation.files.find(f => f.name === fileName);
  if (file) {
    await window.api.openFile(file.path);
  }
};

const deleteOperation = async (operationNumber) => {
  if (!confirm(`¿Seguro que quieres eliminar la operacion numero "${operationNumber}"?`)) return;

  await window.api.deleteOperation(operationNumber);
  loadOperations();
};

const validateForm = () => {
  const importer = importerInput.value.trim();
  const operationNum = operationNumberInput.value.trim();
  const arrivalDate = arrivalDateInput.value;

  if (!importer || !operationNum) {
    alert('Please fill in all required fields (Importer Name and Operation Number)');
    return false;
  }

  return true;
};

const clearFilters = () => {
  searchFilter.value = '';
  dateFromFilter.value = '';
  dateToFilter.value = '';
  sortBySelect.value = 'createdAt-desc';
  applyFiltersAndSort();
};

addOperationButton.onclick = async () => {
  if (!validateForm()) return;

  const operations = await window.api.loadOperations();

  // Check for duplicate operation number
  if (operations.find(op => op.operationNumber === operationNumberInput.value.trim())) {
    alert('Operation number already exists. Please use a different number.');
    return;
  }

  const newOperation = {
    importerName: importerInput.value.trim(),
    operationNumber: operationNumberInput.value.trim(),
    estimatedArrivalDate: arrivalDateInput.value,
    files: [],
    createdAt: new Date().toISOString()
  };

  await window.api.saveOperations([...operations, newOperation]);

  // Clear form and close modal
  importerInput.value = '';
  operationNumberInput.value = '';
  arrivalDateInput.value = '';
  hideModal();

  loadOperations();
};

// Modal event listeners
openAddModal.addEventListener('click', showModal);
openFilterModal.addEventListener('click', showModalFilters);
closeModal.addEventListener('click', hideModal);
closeModalFilters.addEventListener('click', hideModalFilter);
cancelModal.addEventListener('click', hideModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    hideModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
    hideModal();
  }
});

// Event listeners for filters
searchFilter.addEventListener('input', applyFiltersAndSort);
dateFromFilter.addEventListener('change', applyFiltersAndSort);
dateToFilter.addEventListener('change', applyFiltersAndSort);
sortBySelect.addEventListener('change', applyFiltersAndSort);
clearFiltersButton.addEventListener('click', clearFilters);

// Handle Enter key in form inputs
[importerInput, operationNumberInput, arrivalDateInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addOperationButton.click();
    }
  });
});

// Handle Enter key in filter inputs
[searchFilter, dateFromFilter, dateToFilter].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      applyFiltersAndSort();
    }
  });
});

// Load operations on page load
loadOperations();