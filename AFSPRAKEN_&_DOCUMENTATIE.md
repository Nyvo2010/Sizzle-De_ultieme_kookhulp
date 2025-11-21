# Sizzle API Documentatie

Dit document beschrijft alle API-endpoints voor de Sizzle recepten-app. Het is bedoeld voor frontend- en backend-ontwikkelaars.

---

## 1. Recepten

### 1.1 Lijst van Recepten

**Endpoint Naam:** Recepten Ophalen

**Methode:** GET

**URL:** `/api/recepten`

**Beschrijving:** Haalt een lijst van alle beschikbare recepten op, met optionele filters op tags, tijd en moeilijkheid.

**Parameters (Query):**

| Naam         | Type    | Verplicht | Beschrijving                                                         | Voorbeeld       |
| ------------ | ------- | --------- | -------------------------------------------------------------------- | --------------- |
| tags         | Array   | Nee       | Filter recepten op specifieke tags                                   | ["vegetarisch"] |
| maxTijd      | Integer | Nee       | Filter recepten die maximaal deze bereidingstijd hebben (in minuten) | 30              |
| moeilijkheid | String  | Nee       | Filter op moeilijkheidsgraad ('gemakkelijk', 'middel', 'moeilijk')   | 'gemakkelijk'   |

**Response:**

* **Status Code:** 200 OK
* **Beschrijving:** Geeft een lijst van recepten terug.
* **Response Body:**

```json
[
  {
    "id": "123",
    "titel": "Pasta Carbonara",
    "ingrediënten": [
      {"naam": "pasta", "hoeveelheid": "200g"},
      {"naam": "eieren", "hoeveelheid": "2"}
    ],
    "stappen": [
      "Kook de pasta volgens de verpakking.",
      "Meng eieren met kaas en voeg toe aan de pasta."
    ],
    "tags": ["snel", "pasta"],
    "bereidingstijd": 20,
    "moeilijkheid": "gemakkelijk"
  }
]
```

### 1.2 Recept Detail

**Endpoint Naam:** Recept Detail

**Methode:** GET

**URL:** `/api/recepten/{id}`

**Beschrijving:** Haalt gedetailleerde informatie op voor een specifiek recept.

**Parameters (Path):**

| Naam | Type   | Verplicht | Beschrijving                     | Voorbeeld |
| ---- | ------ | --------- | -------------------------------- | --------- |
| id   | String | Ja        | Unieke identifier van het recept | "123"     |

**Response:**

* **Status Code:** 200 OK
* **Response Body:**

```json
{
  "id": "123",
  "titel": "Pasta Carbonara",
  "ingrediënten": [
    {"naam": "pasta", "hoeveelheid": "200g"},
    {"naam": "eieren", "hoeveelheid": "2"}
  ],
  "stappen": [
    {"stapNummer": 1, "beschrijving": "Kook de pasta volgens de verpakking.", "duur": 10},
    {"stapNummer": 2, "beschrijving": "Meng eieren met kaas en voeg toe aan de pasta.", "duur": 5}
  ],
  "tags": ["snel", "pasta"],
  "bereidingstijd": 20,
  "moeilijkheid": "gemakkelijk"
}
```

### 1.3 Recept Toevoegen

**Endpoint Naam:** Recept Toevoegen

**Methode:** POST

**URL:** `/api/recepten`

**Beschrijving:** Voegt een nieuw recept toe aan de collectie.

**Request Body:**

* **Beschrijving:** JSON object met de volledige informatie van het nieuwe recept.
* **JSON Schema:**

```json
{
  "type": "object",
  "properties": {
    "titel": {"type": "string"},
    "ingrediënten": {
      "type": "array",
      "items": {"type": "object", "properties": {"naam": {"type": "string"}, "hoeveelheid": {"type": "string"}}}
    },
    "stappen": {"type": "array", "items": {"type": "string"}},
    "tags": {"type": "array", "items": {"type": "string"}},
    "bereidingstijd": {"type": "integer"},
    "moeilijkheid": {"type": "string"}
  },
  "required": ["titel", "ingrediënten", "stappen"]
}
```

* **Voorbeeld JSON:**

```json
{
  "titel": "Salade Caprese",
  "ingrediënten": [
    {"naam": "tomaat", "hoeveelheid": "2"},
    {"naam": "mozzarella", "hoeveelheid": "125g"}
  ],
  "stappen": ["Snijd tomaten en mozzarella.", "Leg ze afwisselend op een bord.", "Besprenkel met olie en zout."],
  "tags": ["vegetarisch", "snel"],
  "bereidingstijd": 10,
  "moeilijkheid": "gemakkelijk"
}
```

**Response:**

* **Status Code:** 201 Created
* **Response Body:**

```json
{
  "id": "124",
  "bericht": "Recept succesvol toegevoegd."
}
```

### 1.4 Recept Bewerken

**Endpoint Naam:** Recept Bewerken

**Methode:** PUT

**URL:** `/api/recepten/{id}`

**Beschrijving:** Wijzigt de informatie van een bestaand recept.

**Parameters (Path):**

| Naam | Type   | Verplicht | Beschrijving                     | Voorbeeld |
| ---- | ------ | --------- | -------------------------------- | --------- |
| id   | String | Ja        | Unieke identifier van het recept | "123"     |

**Request Body:**

* **Beschrijving:** JSON object met de velden die aangepast moeten worden.
* **Voorbeeld JSON:**

```json
{
  "titel": "Pasta Carbonara Deluxe",
  "bereidingstijd": 25
}
```

**Response:**

* **Status Code:** 200 OK
* **Response Body:**

```json
{
  "id": "123",
  "bericht": "Recept succesvol bijgewerkt."
}
```

### 1.5 Recept Verwijderen

**Endpoint Naam:** Recept Verwijderen

**Methode:** DELETE

**URL:** `/api/recepten/{id}`

**Beschrijving:** Verwijdert een recept uit de collectie.

**Parameters (Path):**

| Naam | Type   | Verplicht | Beschrijving                     | Voorbeeld |
| ---- | ------ | --------- | -------------------------------- | --------- |
| id   | String | Ja        | Unieke identifier van het recept | "123"     |

**Response:**

* **Status Code:** 200 OK
* **Response Body:**

```json
{
  "bericht": "Recept succesvol verwijderd."
}
```

---

## 2. Tags

### 2.1 Alle Tags Ophalen

**Endpoint Naam:** Tags Ophalen

**Methode:** GET

**URL:** `/api/tags`

**Beschrijving:** Haalt een lijst van alle beschikbare tags op.

**Response:**

* **Status Code:** 200 OK
* **Response Body:**

```json
[
  "vegetarisch",
  "snel",
  "oven",
  "pasta"
]
```

---

## 3. Gebruiker

### 3.1 Gebruiker Profiel

**Endpoint Naam:** Gebruiker Profiel Ophalen

**Methode:** GET

**URL:** `/api/gebruiker/{id}`

**Beschrijving:** Haalt profielinformatie van een gebruiker op, inclusief voorkeuren en favorieten.

**Response Body Voorbeeld:**

```json
{
  "id": "u123",
  "naam": "Jan",
  "voorkeuren": {
    "dieet": "vegetarisch",
    "kookstijl": "snel"
  },
  "favorieten": ["123", "124"]
}
```

### 3.2 Favoriet Toevoegen

**Endpoint Naam:** Favoriet Toevoegen

**Methode:** POST

**URL:** `/api/gebruiker/{id}/favorieten`

**Request Body:**

```json
{
  "receptId": "123"
}
```

**Response Body:**

```json
{
  "bericht": "Recept toegevoegd aan favorieten."
}
```

### 3.3 Favoriet Verwijderen

**Endpoint Naam:** Favoriet Verwijderen

**Methode:** DELETE

**URL:** `/api/gebruiker/{id}/favorieten/{receptId}`

**Response Body:**

```json
{
  "bericht": "Recept verwijderd uit favorieten."
}
```

---

## 4. AI Vragenfunctie

### 4.1 Vraag Stellen bij Recept

**Endpoint Naam:** AI Vraag bij Recept

**Methode:** POST

**URL:** `/api/recepten/{id}/vraag`

**Beschrijving:** Stelt een vraag aan de AI over een specifiek recept.

**Request Body:**

```json
{
  "vraag": "Kan dit recept zonder boter?"
}
```

**Response Body:**

```json
{
  "antwoord": "Ja, je kunt boter vervangen door olijfolie, maar het kan de smaak iets veranderen."
}
```

---

## 5. Aanbevolen Recepten

### 5.1 Aanbevolen Recepten Ophalen

**Endpoint Naam:** Aanbevolen Recepten

**Methode:** GET

**URL:** `/api/gebruiker/{id}/aanbevolen`

**Beschrijving:** Haalt een lijst van aanbevolen recepten op voor de gebruiker op basis van tags en favorieten.

**Response Body:**

```json
[
  {
    "id": "125",
    "titel": "Quiche met spinazie",
    "tags": ["vegetarisch", "oven"],
    "bereidingstijd": 35,
    "moeilijkheid": "middel"
  }
]
```
