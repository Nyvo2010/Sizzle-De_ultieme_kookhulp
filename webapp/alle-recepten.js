import { recipes } from './data.js';

let filteredRecipes = [...recipes];
let selectedFilters = new Set();

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
        console.log(`Added ${id} to favorites`);
    } else {
        icon.textContent = 'favorite_border';
        icon.classList.remove('filled');
        console.log(`Removed ${id} from favorites`);
    }
};

function getAllUniqueTags() {
    const tags = new Set();
    recipes.forEach(recipe => {
        recipe.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

function renderFilters() {
    const filtersContainer = document.getElementById('filters-container');
    filtersContainer.innerHTML = '';
    
    const allTags = getAllUniqueTags();
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'filter-tag';
        if (selectedFilters.has(tag)) {
            button.classList.add('active');
        }
        button.textContent = tag;
        button.onclick = (e) => {
            e.preventDefault();
            toggleFilter(tag, button);
        };
        filtersContainer.appendChild(button);
    });
}

function toggleFilter(tag, button) {
    if (selectedFilters.has(tag)) {
        selectedFilters.delete(tag);
        button.classList.remove('active');
    } else {
        selectedFilters.add(tag);
        button.classList.add('active');
    }
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    filteredRecipes = recipes.filter(recipe => {
        // Search filter
        const matchesSearch = recipe.titel.toLowerCase().includes(searchInput) ||
                            recipe.tags.some(tag => tag.toLowerCase().includes(searchInput));
        
        // Tags filter
        const matchesTags = selectedFilters.size === 0 || 
                           recipe.tags.some(tag => selectedFilters.has(tag));
        
        return matchesSearch && matchesTags;
    });
    
    renderRecipes();
}

function renderRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';
    
    if (filteredRecipes.length === 0) {
        grid.innerHTML = '<p class="no-results">Geen recepten gevonden. Probeer andere filters.</p>';
        return;
    }
    
    filteredRecipes.forEach(recipe => {
        grid.appendChild(createRecipeCard(recipe));
    });
}

function getURLParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        search: params.get('search') || '',
        filter: params.get('filter') || ''
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const { search, filter } = getURLParameters();
    
    // Initial render
    renderFilters();
    
    // Apply search parameter if provided
    if (search) {
        document.getElementById('search-input').value = search;
    }
    
    // Apply filter parameter if provided
    if (filter) {
        selectedFilters.add(filter);
        renderFilters();
    }
    
    // Apply filters and render recipes
    applyFilters();
    
    // Search input listener
    document.getElementById('search-input').addEventListener('input', applyFilters);
    
    // Search button listener
    document.getElementById('search-btn').addEventListener('click', (e) => {
        e.preventDefault();
        applyFilters();
    });
});
