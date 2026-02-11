async function getPokemon(pokemonName){
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    if (pokemonName.trim().length != 0){ //handle empty cases
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Http ${response.status}`);
            return await response.json();
        }
        catch(error){
            console.log(error);
            return `Pokemon ${pokemonName} not found`;
        }
    }
}

async function pokemonButtonHandler(){
    const searchPokemonInput = document.getElementById("searchPokemonInput");
    const findPokemonButton = document.getElementById("findPokemonButton");
    const pokemonName = document.getElementById("pokemonName");
    const moveset = document.getElementById("moveset");
    const pokemonImage = document.getElementById("pokemonImage");

    // show loading state to user
    pokemonName.textContent = 'Loading...';
    moveset.textContent = '';
    pokemonImage.src = '';

    // prevent duplicate clicks while request is in flight
    findPokemonButton.disabled = true;

    try {
        // async work happens here — user sees "Loading..."
        const pokemonInfo = await getPokemon(searchPokemonInput.value);

        // on success, replace loading state with data
        pokemonName.textContent = pokemonInfo.name;
        for (let x = 0; x<pokemonInfo.moves.length; x++){
            allmoves += `Move ${x+1}: ${pokemonInfo.moves[x].move["name"]}\n`;
        }
        moveset.textContent = allmoves;
        pokemonImage.src = pokemonInfo.sprites['front_default'];
        pokemonImage.alt = `Image of ${pokemonInfo.name}`;
    } catch (err) {
        // on error, replace loading with error message
        pokemonName.textContent = 'Error';
        moveset.textContent = err.message; // show error details to user
        pokemonImage.src = '';
        console.error(err);
    } finally {
        // always clean up: re-enable button and clear input
        findPokemonButton.disabled = false;
        searchPokemonInput.value = '';
    }
}

async function main(){
    const findPokemonButton = document.getElementById("findPokemonButton");
    findPokemonButton.addEventListener('click', pokemonButtonHandler);
}
main();