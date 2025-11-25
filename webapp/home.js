import { recipes, recommendations } from './data.js';

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => {
        window.location.href = `recipe.html?id=${recipe.id}`;
    };

    const tagsHtml = recipe.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');
    const heartIcon = recipe.isFavorite ? 'favorite' : 'favorite_border';
    const heartClass = recipe.isFavorite ? 'filled' : '';

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${recipe.titel}</div>
            <div class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite(this, '${recipe.id}')">
                <span class="material-symbols-rounded ${heartClass}">${heartIcon}</span>
            </div>
        </div>
        <div class="card-tags">
            ${tagsHtml}
        </div>
    `;
    return card;
}

// Global function for favorite toggle
window.toggleFavorite = function(element, id) {
    const icon = element.querySelector('.material-symbols-rounded');
    if (icon.textContent === 'favorite_border') {
        icon.textContent = 'favorite';
        icon.classList.add('filled');
        // Call API to add favorite
        console.log(`Added ${id} to favorites`);
    } else {
        icon.textContent = 'favorite_border';
        icon.classList.remove('filled');
        // Call API to remove favorite
        console.log(`Removed ${id} from favorites`);
    }
};

function renderSection(title, recipesList, highlightWord = '') {
    const section = document.createElement('section');
    section.className = 'recipe-section';
    
    let titleHtml = title;
    if (highlightWord) {
        titleHtml = title.replace(highlightWord, `<span class="highlight">${highlightWord}</span>`);
    }

    section.innerHTML = `<h2 class="section-title">${titleHtml}</h2>`;
    
    const grid = document.createElement('div');
    grid.className = 'recipe-scroll-container';
    
    recipesList.forEach(recipe => {
        grid.appendChild(createRecipeCard(recipe));
    });

    section.appendChild(grid);
    return section;
}

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Section 1: Voor jou
    contentArea.appendChild(renderSection('Voor jou', recommendations.voorkeur, 'jou'));

    // Section 2: Als avondeten
    contentArea.appendChild(renderSection('Als avondeten', recommendations.avondeten, 'avondeten'));

    // Section 3: Trending nu
    contentArea.appendChild(renderSection('Trending nu', recommendations.trending, 'Trending'));

    /* 
       Implementation according to API documentation:
       
       // Fetch recommendations
       fetch('/api/aanbevelingen', {
           headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
       })
       .then(response => response.json())
       .then(data => {
           contentArea.appendChild(renderSection('Voor jou', data.voorkeur, 'jou'));
           contentArea.appendChild(renderSection('Als avondeten', data.voorkeur_avondeten, 'avondeten'));
           contentArea.appendChild(renderSection('Trending nu', data.trending, 'Trending'));
       });
    */
});
