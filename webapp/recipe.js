import { recipeDetails } from './data.js';

function getRecipeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || "1"; // Default to 1 if not found
}

function renderRecipe(recipe) {
    document.getElementById('recipe-title').textContent = recipe.titel;
    
    const tagsContainer = document.getElementById('recipe-tags');
    tagsContainer.innerHTML = recipe.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');

    // Ingredients
    const ingredientList = document.getElementById('ingredient-list');
    ingredientList.innerHTML = '';
    recipe.ingrediënten.forEach((ing, index) => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        
        li.innerHTML = `
            <div class="checkbox-wrapper" onclick="toggleCheckbox(this)">
                <div class="custom-checkbox unchecked"><span class="material-symbols-rounded">check</span></div>
                <span>${ing.naam}</span>
            </div>
            <span class="amount">${ing.hoeveelheid}</span>
        `;
        ingredientList.appendChild(li);
    });

    // Steps
    const stepsList = document.getElementById('steps-list');
    stepsList.innerHTML = '';
    recipe.stappen.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-card';
        
        stepDiv.innerHTML = `
            <div class="step-header">
                <div class="checkbox-wrapper" onclick="toggleCheckbox(this)">
                    <div class="custom-checkbox unchecked"><span class="material-symbols-rounded">check</span></div>
                    <span>Stap ${step.stapNummer}</span>
                </div>
                <span class="step-time">${step.duur} min <span class="material-symbols-rounded" style="font-size: 1rem; vertical-align: text-bottom;">timer</span></span>
            </div>
            <p>${step.beschrijving}</p>
        `;
        stepsList.appendChild(stepDiv);
    });
}

// Global function for onclick handlers (since module scope is not global)
window.toggleCheckbox = function(element) {
    const checkbox = element.querySelector('.custom-checkbox');
    if (checkbox.classList.contains('unchecked')) {
        checkbox.classList.remove('unchecked');
        // Add checked style if needed, currently CSS handles unchecked state transparency
    } else {
        checkbox.classList.add('unchecked');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const id = getRecipeId();
    const recipe = recipeDetails[id] || recipeDetails["1"];
    
    if (recipe) {
        renderRecipe(recipe);
    } else {
        document.getElementById('recipe-title').textContent = "Recept niet gevonden";
    }

    /*
       Implementation according to API documentation:
       
       // Fetch recipe details
       fetch(`/api/recepten/${id}`)
           .then(res => res.json())
           .then(data => renderRecipe(data));
    */

    // AI Chat Mock
    const sendBtn = document.getElementById('ai-send');
    const input = document.getElementById('ai-input');
    const messages = document.getElementById('ai-messages');

    sendBtn.addEventListener('click', () => {
        const text = input.value;
        if (!text) return;

        // User message
        const userMsg = document.createElement('p');
        userMsg.style.marginTop = '10px';
        userMsg.innerHTML = `<strong>Jij:</strong> ${text}`;
        messages.appendChild(userMsg);
        input.value = '';

        // AI Response (Mock)
        setTimeout(() => {
            const aiMsg = document.createElement('p');
            aiMsg.style.marginTop = '10px';
            aiMsg.innerHTML = `<strong>Sizzle AI:</strong> Dat is een goede vraag! Je kunt dit ingrediënt vervangen door iets anders als je dat wilt.`;
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);

        /*
           API Implementation:
           
           fetch(`/api/recepten/${id}/vraag`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + localStorage.getItem('token')
               },
               body: JSON.stringify({ vraag: text })
           })
           .then(res => res.json())
           .then(data => {
               // Show data.antwoord
           });
        */
    });
});
