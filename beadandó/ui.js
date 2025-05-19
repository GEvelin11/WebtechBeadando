export function renderCarList(cars, onItemClick, onCarUpdate, onItemDelete) {
  const container = document.getElementById('car-list');
  if (!container) {
    console.error('Az autólista konténer nem található!');
    return;
  }

  container.innerHTML = '';

  if (!cars || cars.length === 0) {
    container.innerHTML = '<p class="empty-message">No cars in the list</p>';
    return;
  }

  cars.forEach(car => {
    const carItem = document.createElement('div');
    carItem.className = 'car-item';
    carItem.innerHTML = `
      <span class="car-info">${car.brand} ${car.model} (${formatDateDisplay(car.dayOfCommission)})</span>
      <div class="car-actions">
        <button class="edit-btn" data-id="${car.id}">Szerkesztés</button>
        <button class="delete-btn" data-id="${car.id}">Törlés</button>
      </div>
    `;

    carItem.querySelector('.car-info').addEventListener('click', () => {
      onItemClick(car.id);
    });

    carItem.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showEditForm(car, onCarUpdate);
    });

    carItem.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete ${car.brand} ${car.model}?`)) {
        onItemDelete(car.id);
      }
    });

    container.appendChild(carItem);
  });
}

export function renderCarDetails(car, onCarUpdate) {
  const container = document.getElementById('car-details');
  if (!container) {
    console.error('Az autó részletek konténer nem található!');
    return;
  }

  container.innerHTML = `
    <h2>Car Details</h2>
    <div class="detail-row">
      <span class="detail-label">ID:</span>
      <span class="detail-value">${car.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Brand:</span>
      <span class="detail-value">${car.brand}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Model:</span>
      <span class="detail-value">${car.model}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Year:</span>
      <span class="detail-value">${formatDateDisplay(car.dayOfCommission)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fuel Consumption:</span>
      <span class="detail-value">${car.fuelUse || 'N/A'} l/100km</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Owner:</span>
      <span class="detail-value">${car.owner || 'Unknown'}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Electric:</span>
      <span class="detail-value">${car.electric ? 'Yes' : 'No'}</span>
    </div>
    <div class="button-group">
      <button id="edit-car-btn" class="btn-edit">Szerkesztés</button>
      <button id="close-details-btn" class="btn-close">Bezár</button>
    </div>
    <div id="edit-form-container"></div>
  `;

  container.classList.remove('hidden');

  document.getElementById('edit-car-btn').addEventListener('click', () => {
    showEditForm(car, onCarUpdate);
  });
}

function showEditForm(car, onCarUpdate) {
  const container = document.getElementById('edit-form-container');
  if (!container) {
    console.error('A szerkesztő űrlap konténer nem található!');
    return;
  }

  container.innerHTML = `
    <form id="editForm" class="edit-form">
      <h3>Edit Car</h3>
      <input type="hidden" id="edit-id" value="${car.id}">
      <div class="form-group">
        <label for="edit-brand">Brand*</label>
        <input id="edit-brand" type="text" value="${car.brand}" required>
      </div>
      <div class="form-group">
        <label for="edit-model">Model*</label>
        <input id="edit-model" type="text" value="${car.model}" required>
      </div>
      <div class="form-group">
        <label for="edit-dayOfCommission">Year</label>
        <input id="edit-dayOfCommission" type="date" value="${formatDateForInput(car.dayOfCommission)}">
      </div>
      <div class="form-group">
        <label for="edit-fuelUse">Fuel Consumption (l/100km)</label>
        <input id="edit-fuelUse" type="number" step="0.1" value="${car.fuelUse || ''}">
      </div>
      <div class="form-group">
        <label for="edit-owner">Owner</label>
        <input id="edit-owner" type="text" value="${car.owner || ''}">
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="edit-electric" ${car.electric ? 'checked' : ''}>
        <label for="edit-electric">Electric</label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Mentés</button>
        <button type="button" id="cancel-edit-btn" class="btn-close">Törlés</button>
      </div>
      <div id="edit-error" class="error-message" style="display: none;"></div>
    </form>
  `;

  const form = document.getElementById('editForm');
  const errorElement = document.getElementById('edit-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorElement.style.display = 'none';

    try {
      const updatedCar = {
        brand: document.getElementById('edit-brand').value.trim(),
        model: document.getElementById('edit-model').value.trim(),
        dayOfCommission: document.getElementById('edit-dayOfCommission').value || car.dayOfCommission,
        fuelUse: parseFloat(document.getElementById('edit-fuelUse').value) || 0,
        owner: document.getElementById('edit-owner').value.trim() || 'Unknown',
        electric: document.getElementById('edit-electric').checked
      };

      await onCarUpdate(car.id, updatedCar);
      container.innerHTML = '';
    } catch (error) {
      errorElement.textContent = error.message;
      errorElement.style.display = 'block';
    }
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    container.innerHTML = '';
  });
}

function formatDateDisplay(dateString) {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}
