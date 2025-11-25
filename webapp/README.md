# Sizzle Webapp

Dit is de frontend implementatie van de Sizzle applicatie.

## Hoe te gebruiken

Omdat de applicatie gebruik maakt van ES Modules (`import`/`export`), kun je de HTML bestanden niet direct openen in de browser (vanwege CORS beveiliging). Je moet een lokale webserver gebruiken.

### Optie 1: Met Python (voorgeïnstalleerd op macOS)
1. Open de terminal.
2. Navigeer naar deze map:
   ```bash
   cd /Users/niekvogelaar/Downloads/Files/School/Informatica/Sizzle-De_ultieme_kookhulp/webapp
   ```
3. Start een simpele server:
   ```bash
   python3 -m http.server
   ```
4. Ga in je browser naar `http://localhost:8000`.

### Optie 2: VS Code Live Server
Als je de "Live Server" extensie in VS Code hebt, kun je rechtsklikken op `index.html` en kiezen voor "Open with Live Server".

## Functionaliteit
- **Homepagina (`index.html`)**: Toont aanbevolen recepten, zoekbalk en filters.
- **Receptpagina (`recipe.html`)**: Toont details van een recept, ingrediënten en stappen.
  - Checkboxes zijn klikbaar.
  - De AI-chatbalk aan de rechterkant beweegt mee (sticky).
  - Klik op een receptkaart op de homepagina om naar de detailpagina te gaan.

## API Integratie
De code bevat mock-data in `data.js` om de interface te laten werken zonder backend. In de JavaScript bestanden (`home.js`, `recipe.js`) staat in commentaar aangegeven hoe de echte API calls volgens `AFSPRAKEN_&_DOCUMENTATIE.md` geïmplementeerd zouden worden.
