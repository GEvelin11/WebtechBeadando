const BASE_URL = 'https://iit-playground.arondev.hu/api/OS5LFN/car';

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}
export async function getAllCars() {
    try {
        const response = await fetch(BASE_URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Hiba az autók lekérdezésekor:', error);
        throw error;
    }
}

export async function getCarById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Hiba az autó (ID: ${id}) lekérdezésekor:`, error);
        throw error;
    }
}

export async function createCar(carData) {
    try {
        if (!carData.brand || !carData.model) {
            throw new Error('A márka és a típus megadása kötelező');
        }

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...carData,
                dayOfCommission: carData.dayOfCommission || new Date().toISOString().split('T')[0],
                fuelUse: carData.fuelUse || 0,
                owner: carData.owner || 'Ismeretlen',
                electric: carData.electric || false
            })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Hiba az autó létrehozásakor:', error);
        throw error;
    }
}

export async function updateCar(id, carData) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData)
        });
        
        const data = await handleResponse(response);
        console.log('Sikeres:', data);
        return data;
    } catch (error) {
        console.error('Hiba:', error);
        throw error;
    }
}

export async function deleteCar(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Hiba az autó (ID: ${id}) törlésekor:`, error);
        throw error;
    }
}
