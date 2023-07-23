const express = require("express");
const morgan = require("morgan");
const pokeBank = require("./pokeBank");

// Initialize the Express Application
const app = express();

// Use the Morgan middleware for logging
app.use(morgan("dev"));

// Define the homepage route
app.get("/", (req, res) => {
  const pokemonList = pokeBank.list();
  let html = "<h1>Pokedex</h1>";
  pokemonList.forEach((pokemon) => {
    html += `<p><a href=" /pokemon/${pokemon.id}">${pokemon.name}</a></p>`;
  });
  res.send(html);
});

// Define the Pokemon details route with error catch

app.get("/pokemon/:id", (req, res, next) => {
  const id = req.params.id;
  const pokemon = pokeBank.find(id);
  if (!pokemon) {
    res.status(404);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Pokedex</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Pokedex</header>
      <div class="not-found">
        <p>Pika pika... Page Not Found</p>
        <img src="/pikachu-404.gif" />
      </div>
    </body>
    </html>`;
    res.send(html);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Pokedex</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        
        <body>
          <div class="pokemon-list">
            <header><img src="/logo.png" />Pokedex</header>
            <div class="pokemon-item">
              <img class="pokemon-img" src="${pokemon.image}" />
              <p>
                <span class="pokemon-position">${pokemon.id}. ▲</span>${pokemon.name}
                <small>(Trained by ${pokemon.trainer})</small>
              </p>
              <small class="pokemon-info">
                Type: ${pokemon.type} | Date Caught: ${pokemon.date}
              </small>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
