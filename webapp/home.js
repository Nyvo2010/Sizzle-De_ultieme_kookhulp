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

    // Search bar functionality
    const searchInput = document.querySelector('.search-input-wrapper input');
    const searchButton = document.querySelector('.search-button');
    
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Navigate to alle-recepten page with search query
            window.location.href = `alle-recepten.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
    
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Filter tags functionality
    const filterTags = document.querySelectorAll('.filters .filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            const filterName = tag.textContent.trim();
            if (filterName !== 'Meer filters...') {
                // Navigate to alle-recepten page with filter query
                window.location.href = `alle-recepten.html?filter=${encodeURIComponent(filterName)}`;
            }
        });
    });

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
