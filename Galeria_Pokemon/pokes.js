const pokemonImage = document.getElementById("pokemon-image");
const pokemonName = document.getElementById("pokemon-name");
const pokemonNumber = document.getElementById("pokemon-number");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const shinyToggle = document.getElementById("shiny-toggle");

let currentPokemonId = 1;
const totalPokemon = 1025; 
let isShiny = false;

async function fetchPokemon(identifier) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}/`);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        alert("Pokémon não encontrado! Por favor tente outro nome ou número.");
        return null;
    }
}

async function displayPokemon(id) {
    const pokemon = await fetchPokemon(id);
    if (pokemon) {
        currentPokemonId = pokemon.id;
        pokemonImage.src = isShiny 
            ? pokemon.sprites.front_shiny 
            : pokemon.sprites.front_default;
        pokemonName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonNumber.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        
        const typesContainer = document.getElementById("pokemon-types");
        typesContainer.innerHTML = ""; 
        pokemon.types.forEach(typeInfo => {
            const typeElement = document.createElement("span");
            typeElement.textContent = typeInfo.type.name;
            typeElement.style.backgroundColor = getTypeColor(typeInfo.type.name);
            typesContainer.appendChild(typeElement);
        });

        prevButton.disabled = currentPokemonId <= 1;
        nextButton.disabled = currentPokemonId >= totalPokemon;
        
        searchInput.value = '';
    }
}

function getTypeColor(type) {
    const colors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };
    return colors[type] || "#777"; 
}


async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) return;
    
    if (!isNaN(searchTerm)) {
        const id = parseInt(searchTerm);
        if (id >= 1 && id <= totalPokemon) {
            await displayPokemon(id);
        } else {
            alert(`Por favor selecione de 1 até ${totalPokemon}`);
        }
    } else {
        await displayPokemon(searchTerm);
    }
}

function addPulseEffect(button) {
    button.classList.add("pulse");
    setTimeout(() => {
        button.classList.remove("pulse");
    }, 300);
}

document.getElementById("prev-btn").addEventListener("click", function() {
    addPulseEffect(this);
});

document.getElementById("next-btn").addEventListener("click", function() {
    addPulseEffect(this);
});

shinyToggle.addEventListener('change', () => {
    isShiny = shinyToggle.checked;
    displayPokemon(currentPokemonId);
});

prevButton.addEventListener("click", () => {
    if (currentPokemonId > 1) {
        displayPokemon(currentPokemonId - 1);
    }
});

nextButton.addEventListener("click", () => {
    if (currentPokemonId < totalPokemon) {
        displayPokemon(currentPokemonId + 1);
    }
});

searchButton.addEventListener("click", searchPokemon);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    
    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️"; 
    } else {
        darkModeToggle.textContent = "🌙"; 
    }
});

document.getElementById("random-btn").addEventListener("click", () => {
    const randomId = Math.floor(Math.random() * 1025) + 1; 
    displayPokemon(randomId);
});



displayPokemon(currentPokemonId);