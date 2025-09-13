class WhereInTheWorldGame {
    constructor() {
        this.map = null;
        this.targetLocation = null;
        this.currentZoom = 19;
        this.score = 0;
        this.gameActive = false;
        this.guessMarker = null;
        this.targetMarker = null;

        this.init();
    }

    init() {
        this.initMap();
        this.bindEvents();
        this.startNewGame();
    }

    initMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.openfreemap.org/styles/positron',
            center: [0, 0],
            zoom: this.currentZoom,
            attributionControl: true,
            interactive: false,
            dragPan: false,
            dragRotate: false,
            scrollZoom: false,
            boxZoom: false,
            keyboard: false,
            doubleClickZoom: false,
            touchZoomRotate: false
        });

        // Remove map click handler since we're using text input
    }

    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('give-up').addEventListener('click', () => this.giveUp());
        document.getElementById('play-again').addEventListener('click', () => this.startNewGame());
        document.getElementById('submit-guess').addEventListener('click', () => this.handleGuess());
        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGuess();
            }
        });
    }

    startNewGame() {
        this.score = 0;
        this.currentZoom = 19;
        this.gameActive = true;

        this.clearMarkers();
        this.hideModal();
        this.generateRandomLocation();
        this.updateUI();
        this.clearInput();
        this.clearFeedback();
    }

    generateRandomLocation() {
        const locations = [
            {
                lat: 40.7128, lng: -74.0060,
                name: "New York City, USA",
                city: "new york city",
                cityVariations: ["new york", "nyc", "new york city"],
                country: "usa",
                naturalFeatures: ["hudson river", "manhattan island", "east river"]
            },
            {
                lat: 51.5074, lng: -0.1278,
                name: "London, UK",
                city: "london",
                country: "uk",
                naturalFeatures: ["thames river", "river thames"]
            },
            {
                lat: 48.8566, lng: 2.3522,
                name: "Paris, France",
                city: "paris",
                country: "france",
                naturalFeatures: ["seine river", "river seine"]
            },
            {
                lat: 35.6762, lng: 139.6503,
                name: "Tokyo, Japan",
                city: "tokyo",
                country: "japan",
                naturalFeatures: ["tokyo bay", "sumida river"]
            },
            {
                lat: -33.8688, lng: 151.2093,
                name: "Sydney, Australia",
                city: "sydney",
                country: "australia",
                naturalFeatures: ["sydney harbour", "port jackson", "botany bay"]
            },
            {
                lat: 55.7558, lng: 37.6176,
                name: "Moscow, Russia",
                city: "moscow",
                country: "russia",
                naturalFeatures: ["moskva river", "moscow river"]
            },
            {
                lat: 39.9042, lng: 116.4074,
                name: "Beijing, China",
                city: "beijing",
                country: "china",
                naturalFeatures: ["yanshan mountains", "yellow river region"]
            },
            {
                lat: -22.9068, lng: -43.1729,
                name: "Rio de Janeiro, Brazil",
                city: "rio de janeiro",
                cityVariations: ["rio de janeiro", "rio"],
                country: "brazil",
                naturalFeatures: ["guanabara bay", "sugarloaf mountain", "copacabana beach"]
            },
            {
                lat: 30.0444, lng: 31.2357,
                name: "Cairo, Egypt",
                city: "cairo",
                country: "egypt",
                naturalFeatures: ["nile river", "river nile"]
            },
            {
                lat: 19.0760, lng: 72.8777,
                name: "Mumbai, India",
                city: "mumbai",
                country: "india",
                naturalFeatures: ["arabian sea", "mumbai harbour"]
            },
            {
                lat: 37.7749, lng: -122.4194,
                name: "San Francisco, USA",
                city: "san francisco",
                cityVariations: ["san francisco", "sf", "san fran"],
                country: "usa",
                naturalFeatures: ["san francisco bay", "golden gate strait", "pacific ocean"]
            },
            {
                lat: 52.5200, lng: 13.4050,
                name: "Berlin, Germany",
                city: "berlin",
                country: "germany",
                naturalFeatures: ["spree river", "river spree"]
            },
            {
                lat: 41.9028, lng: 12.4964,
                name: "Rome, Italy",
                city: "rome",
                country: "italy",
                naturalFeatures: ["tiber river", "river tiber"]
            },
            {
                lat: 59.9311, lng: 30.3609,
                name: "St. Petersburg, Russia",
                city: "st. petersburg",
                cityVariations: ["st. petersburg", "saint petersburg", "st petersburg", "petersburg"],
                country: "russia",
                naturalFeatures: ["neva river", "gulf of finland"]
            },
            {
                lat: -34.6037, lng: -58.3816,
                name: "Buenos Aires, Argentina",
                city: "buenos aires",
                country: "argentina",
                naturalFeatures: ["rio de la plata", "river plate"]
            },
            {
                lat: 25.2048, lng: 55.2708,
                name: "Dubai, UAE",
                city: "dubai",
                country: "uae",
                naturalFeatures: ["persian gulf", "dubai creek"]
            },
            {
                lat: 1.3521, lng: 103.8198,
                name: "Singapore",
                city: "singapore",
                country: "singapore",
                naturalFeatures: ["singapore strait", "johor strait"]
            },
            {
                lat: 50.0755, lng: 14.4378,
                name: "Prague, Czech Republic",
                city: "prague",
                country: "czech republic",
                naturalFeatures: ["vltava river", "river vltava"]
            },
            {
                lat: 64.1466, lng: -21.9426,
                name: "Reykjavik, Iceland",
                city: "reykjavik",
                country: "iceland",
                naturalFeatures: ["faxaflói bay", "atlantic ocean"]
            },
            {
                lat: -26.2041, lng: 28.0473,
                name: "Johannesburg, South Africa",
                city: "johannesburg",
                country: "south africa",
                naturalFeatures: ["witwatersrand", "highveld"]
            }
        ];

        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        this.targetLocation = randomLocation;

        const randomOffset = 0.01;
        const offsetLat = randomLocation.lat + (Math.random() - 0.5) * randomOffset;
        const offsetLng = randomLocation.lng + (Math.random() - 0.5) * randomOffset;

        this.map.setCenter([offsetLng, offsetLat]);
        this.map.setZoom(this.currentZoom);
    }

    handleGuess() {
        if (!this.gameActive) return;

        const guessInput = document.getElementById('guess-input');
        const guess = guessInput.value.trim().toLowerCase();

        if (!guess) {
            this.showFeedback('Please enter a guess!', 'error');
            return;
        }

        const result = this.checkGuess(guess);

        if (result.points > 0) {
            this.correctGuess(result);
        } else {
            this.wrongGuess(guess);
        }
    }

    checkGuess(guess) {
        const location = this.targetLocation;


        // Check for exact city match (3 points) - case insensitive
        if (guess === location.city.toLowerCase() || guess === location.name.toLowerCase()) {
            return { points: 3, type: 'city', match: location.city };
        }

        // Check city variations if they exist
        if (location.cityVariations) {
            for (const variation of location.cityVariations) {
                if (guess === variation.toLowerCase()) {
                    return { points: 3, type: 'city', match: location.city };
                }
            }
        }

        // Check for country match (1 point) - case insensitive
        if (guess === location.country.toLowerCase()) {
            return { points: 1, type: 'country', match: location.country };
        }

        // Check for natural feature match (5 points) - case insensitive
        for (const feature of location.naturalFeatures) {
            if (guess === feature.toLowerCase()) {
                return { points: 5, type: 'natural feature', match: feature };
            }
        }

        // Check for partial matches (case insensitive)
        const guessParts = guess.split(',').map(part => part.trim().toLowerCase());

        // Check if any part of the guess matches city, country, or natural features
        for (const part of guessParts) {
            if (part === location.city.toLowerCase()) {
                return { points: 3, type: 'city', match: location.city };
            }

            // Check city variations in partial matches
            if (location.cityVariations) {
                for (const variation of location.cityVariations) {
                    if (part === variation.toLowerCase()) {
                        return { points: 3, type: 'city', match: location.city };
                    }
                }
            }

            if (part === location.country.toLowerCase()) {
                return { points: 1, type: 'country', match: location.country };
            }
            // Check natural features (case insensitive)
            for (const feature of location.naturalFeatures) {
                if (part === feature.toLowerCase()) {
                    return { points: 5, type: 'natural feature', match: feature };
                }
            }
        }

        return { points: 0, type: 'none', match: null };
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }

    wrongGuess(guess) {
        this.score++;
        this.currentZoom = Math.max(1, this.currentZoom - 2);
        this.map.setZoom(this.currentZoom);
        this.updateUI();
        this.showFeedback(`"${guess}" is not correct. Try again!`, 'wrong');
        this.clearInput();
    }

    correctGuess(result) {
        this.score += result.points;
        this.updateUI();

        let message = `Correct! You guessed the ${result.type}: "${result.match}" (+${result.points} points)`;
        this.showFeedback(message, 'correct');
        this.clearInput();
    }

    winGame(result) {
        this.gameActive = false;
        this.score += result.points;
        this.showTargetLocation();
        this.showWinModal(result);
    }

    giveUp() {
        if (!this.gameActive) return;
        this.gameActive = false;
        this.showTargetLocation();
        this.showLoseModal();
    }

    showTargetLocation() {
        const targetElement = document.createElement('div');
        targetElement.className = 'marker target-marker';
        targetElement.innerHTML = '🎯';

        this.targetMarker = new maplibregl.Marker({
            element: targetElement,
            anchor: 'bottom'
        })
        .setLngLat([this.targetLocation.lng, this.targetLocation.lat])
        .addTo(this.map);

        this.map.setCenter([this.targetLocation.lng, this.targetLocation.lat]);
        this.map.setZoom(10);
    }

    showWinModal(result) {
        document.getElementById('result-title').textContent = 'Correct!';

        let message = `You guessed the ${result.type}: "${result.match}"! `;
        message += `+${result.points} points`;

        document.getElementById('result-message').textContent = message;
        document.getElementById('final-score').textContent = `Total Score: ${this.score} points`;
        this.showModal();
    }

    showLoseModal() {
        document.getElementById('result-title').textContent = 'Game Over';
        document.getElementById('result-message').textContent = `The location was ${this.targetLocation.name}`;
        document.getElementById('final-score').textContent = `Total Score: ${this.score} points`;
        this.showModal();
    }

    showModal() {
        document.getElementById('result-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('result-modal').classList.add('hidden');
    }

    clearMarkers() {
        this.clearGuessMarker();
        if (this.targetMarker) {
            this.targetMarker.remove();
            this.targetMarker = null;
        }
    }

    clearGuessMarker() {
        if (this.guessMarker) {
            this.guessMarker.remove();
            this.guessMarker = null;
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('zoom-level').textContent = this.currentZoom;
    }

    clearInput() {
        document.getElementById('guess-input').value = '';
    }

    clearFeedback() {
        document.getElementById('guess-feedback').textContent = '';
        document.getElementById('guess-feedback').className = 'guess-feedback';
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('guess-feedback');
        feedback.textContent = message;
        feedback.className = `guess-feedback ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhereInTheWorldGame();
});