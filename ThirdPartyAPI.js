// This function makes the output for the location names a little more readable and pretty
function formatLocationName(locationName) {
    return locationName.split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
}

async function fetchPokemonData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        // capitalizedPokeName allows for future reference to name entry
        let capitalizedPokeName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

        // Using this portion of code to catch any input errors
        if (!response.ok) {
            const infoContainer = document.getElementById("infoContainer");
            infoContainer.innerHTML = `<p>No results can be found for ${capitalizedPokeName}. Please try again.</p>`;
            return; // Exit the function early if there's an error
        } 

        // Used to catch blank entries
        if (capitalizedPokeName.length === 0) {
            const infoContainer = document.getElementById("infoContainer");
            infoContainer.innerHTML = "<p>Please enter a Pokemon to be located.</p>";
            return; // Exit the function early if the input is blank
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;

        // Show image container
        const imageContainer = document.getElementById("imageContainer");
        imageContainer.style.display = "block";

        const imageElement = document.getElementById("pokemonSprite");
        imageElement.src = pokemonSprite;
     
        const infoContainer = document.getElementById("infoContainer");
        infoContainer.innerHTML = "";

        // Pokemon Location call
        const pokeLocation = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`);

        if (!pokeLocation.ok) {
            throw new Error("Could not fetch Pokemon Location resource data.");
        }

        // Extracting in-game location of where to find Pokemon in question
        let locationInfo;
        const locationData = await pokeLocation.json();

        if (!locationData[0]) {         // Check to see if locationData[0] is falsy or undefined
            locationInfo = `${pokemonName} Encounter Location: ???`;
        } else {
            const locationOutput = formatLocationName(locationData[0].location_area.name);

            capitalizedPokeName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            locationInfo = `${capitalizedPokeName} Encounter Location: ${locationOutput}`;
        }

        const locationOutputElement = document.createElement("p");
        locationOutputElement.innerHTML = locationInfo;
        infoContainer.appendChild(locationOutputElement);

    } catch (error) {
        console.error("ERROR OCCURRED: ", error);
    }
}
