import { getAllCars, getCarById, createCar, updateCar, deleteCar } from './api.js';
import { renderCarList, renderCarDetails } from './ui.js';

class CarApp {
  constructor() {
    this.currentCarId = null;
    this.init();
  }

  async init() {
    try {
      await this.loadCars();
      this.setupEventHandlers();
    } catch (error) {
      console.error('Inicializálási hiba:', hiba);
      this.hibaMegjelenitese('Az alkalmazás indítása sikertelen');
    }
  }

  async loadCars() {
    try {
      const cars = await getAllCars();
      renderCarList(
        cars,
        (id) => this.showCarDetails(id),
        (id, carData) => this.handleUpdateCar(id, carData),
        (id) => this.handleDeleteCar(id)
      );
    } catch (error) {
     console.error('Autók betöltése sikertelen:', hiba);
     this.hibaMegjelenitese('Nem sikerült betölteni az autólistát');
    }
  }

  setupEventHandlers() {
    const createForm = document.getElementById('createForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateCar(e));
    }

    document.addEventListener('click', (e) => {
      if (e.target.id === 'close-details-btn') {
        document.getElementById('car-details').classList.add('hidden');
      }
    });
  }

  async showCarDetails(id) {
    try {
      this.currentCarId = id;
      const car = await getCarById(id);
      renderCarDetails(car, (id, carData) => this.handleUpdateCar(id, carData));
      document.getElementById('car-details').classList.remove('hidden');
    } catch (error) {
      console.error('Részletek betöltése sikertelen:', hiba);
      this.hibaMegjelenitese('Az autó részleteinek betöltése nem sikerült');
    }
  }

  async handleCreateCar(e) {
    e.preventDefault();
    const errorElement = document.getElementById('form-error');
    errorElement.style.display = 'none';

    try {
      const newCar = {
        brand: document.getElementById('input-brand').value.trim(),
        model: document.getElementById('input-model').value.trim(),
        dayOfCommission: document.getElementById('input-dayOfCommission').value || new Date().toISOString().split('T')[0],
        fuelUse: parseFloat(document.getElementById('input-fuelUse').value) || 0,
        owner: document.getElementById('input-owner').value.trim() || 'Unknown',
        electric: document.getElementById('input-electric').checked
      };

      if (!newCar.brand || !newCar.model) {
        throw new Error('A márka és a típus megadása kötelező!');
      }

      await createCar(newCar);
      e.target.reset();
      await this.loadCars();
    } catch (error) {
      console.error('Create error:', error);
      errorElement.textContent = error.message;
      errorElement.style.display = 'block';
    }
  }

  async handleUpdateCar(id, carData) {
    try {
      if (!carData.brand || !carData.model) {
        throw new Error('A márka és a típus megadása kötelező!');
      }

      await updateCar(id, carData);
      await this.loadCars();
      
      // Refresh details if viewing the updated car
      if (this.currentCarId === id) {
        const car = await getCarById(id);
        renderCarDetails(car, (id, data) => this.handleUpdateCar(id, data));
      }
      
      return true;
    } catch (error) {
      console.error('Hiba:', error);
      this.showError('Nem sikerült a szerkesztés');
      throw error;
    }
  }

  async handleDeleteCar(id) {
    try {
      if (confirm('Biztos hogy törölni akarod?')) {
        await deleteCar(id);
        await this.loadCars();
        document.getElementById('car-details').classList.add('hidden');
      }
    } catch (error) {
      console.error('Hiba:', error);
      this.showError('Nem sikerült a törlés');
    }
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.prepend(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  new CarApp();
});
