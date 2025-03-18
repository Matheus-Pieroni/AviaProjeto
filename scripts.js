document.addEventListener('DOMContentLoaded', () => {
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    const altitudeInput = document.getElementById('altitude');
    const altitudeValue = document.getElementById('altitudeValue');
    const fuelInput = document.getElementById('fuel');
    const fuelValue = document.getElementById('fuelValue');
    const directionInput = document.getElementById('direction');
    const directionValue = document.getElementById('directionValue');
    const flapsInput = document.getElementById('flaps');
    const flapsStatus = document.getElementById('flapsStatus');
    const landingGearInput = document.getElementById('landingGear');
    const landingGearStatus = document.getElementById('landingGearStatus');
    const calculateButton = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    const aviaoElemento = document.querySelector('.aviao');

    // Atualiza os valores dos medidores
    speedInput.addEventListener('input', () => {
        speedValue.textContent = speedInput.value;
        if (speedInput.value < 150) {
            altitudeValue.textContent = 0;
            altitudeInput.value = 0;
        }
        gazolina();
    });

    altitudeInput.addEventListener('input', () => {
        altitudeValue.textContent = altitudeInput.value;
        if (speedInput.value < 150) {
            alert('Ei! O avião não pode subir a não ser que esteja a mais de 150Km/h!!!')
            altitudeValue.textContent = 0;
            altitudeInput.value = 0;
        }
    });

    fuelInput.addEventListener('input', () => {
        fuelValue.textContent = fuelInput.value;
    });

    directionInput.addEventListener('input', () => {
        directionValue.textContent = directionInput.value;
        aviaoElemento.style.transform = `rotate(${directionInput.value}deg)`;
    });

    flapsInput.addEventListener('change', () => {
        flapsStatus.textContent = flapsInput.checked ? 'Ativado' : 'Desativado';
    });

    landingGearInput.addEventListener('change', () => {
        landingGearStatus.textContent = landingGearInput.checked ? 'Baixado' : 'Recolhido';
    });

    // Função para calcular a distância e o tempo de voo
    calculateButton.addEventListener('click', () => {
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const speed = parseFloat(speedInput.value);
        const altitude = parseFloat(altitudeInput.value);
        const fuel = parseInt(fuelInput.value, 10);
        const landingGear = landingGearInput.checked;

        if (fuel <= 0) {
            alert("Combustível insuficiente para realizar a viagem.");
            return;
        }

        if (landingGear) {
            alert("O avião não pode decolar com o trem de pouso baixado.");
            return;
        }

        if (altitude < 12) {
            alert("A altitude deve ser de pelo menos 12 metros para decolar.");
            return;
        }

        // Coordenadas geográficas dos países (exemplo)
        const coordinates = {
            'Brasil': { lat: -14.235, lon: -51.9253 },
            'Estados Unidos': { lat: 37.0902, lon: -95.7129 },
            'França': { lat: 46.6034, lon: 1.8883 },
            'Japão': { lat: 36.2048, lon: 138.2529 },
            'China': { lat: 35.8617, lon: 104.1954 },
            'Alemanha': { lat: 51.1657, lon: 10.4515 },
            'Itália': { lat: 41.8719, lon: 12.5674 },
            'Espanha': { lat: 40.4637, lon: -3.7492 },
            'Portugal': { lat: 39.3999, lon: -8.2245 },
            'Argentina': { lat: -38.4161, lon: -63.6167 }
        };

        const distance = calculateDistance(coordinates[origin], coordinates[destination]);
        let time = distance / speed;

        // Ajusta o tempo de voo se os flaps estiverem ativados
        if (flapsInput.checked) {
            time *= 1.2; // Aumenta o tempo de voo em 20% se os flaps estiverem ativados
        }

        resultDiv.textContent = `Distância: ${distance.toFixed(2)} km, Tempo estimado de voo: ${time.toFixed(2)} horas`;

        // Exibe a rota no mapa
        calculateAndDisplayRoute(map, origin, destination);
    });

    // Função para calcular a distância entre dois pontos geográficos
    function calculateDistance(coord1, coord2) {
        const R = 6371; // Raio da Terra em km
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLon = toRad(coord2.lon - coord1.lon);
        const lat1 = toRad(coord1.lat);
        const lat2 = toRad(coord2.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Converte graus para radianos
    function toRad(value) {
        return value * Math.PI / 180;
    }

    const map = L.map('map').setView([-15.7942, -47.8822], 4); // Centro do mapa no Brasil

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let currentRoute = null;

    function calculateAndDisplayRoute(map, origin, destination) {
        const locations = {
            "Brasil": [-15.7942, -47.8822],
            "Estados Unidos": [37.0902, -95.7129],
            "França": [46.6034, 1.8883],
            "Japão": [36.2048, 138.2529],
            "China": [35.8617, 104.1954],
            "Alemanha": [51.1657, 10.4515],
            "Itália": [41.8719, 12.5674],
            "Espanha": [40.4637, -3.7492],
            "Portugal": [39.3999, -8.2245],
            "Argentina": [-38.4161, -63.6167]
        };

        const originCoords = locations[origin];
        const destinationCoords = locations[destination];

        if (originCoords && destinationCoords) {
            if (currentRoute) {
                map.removeLayer(currentRoute);
            }
            currentRoute = L.polyline([originCoords, destinationCoords], { color: 'blue' }).addTo(map);
            map.fitBounds(currentRoute.getBounds());
        } else {
            alert("Localização inválida.");
        }
    }

    function gazolina() {
        if (speedInput.value > 10) {
            fuelInput.value -= 1;
            fuelValue.textContent = fuelInput.value;
        }
    requestAnimationFrame(gazolina);
    }
});