// Immediately invoked function to set the theme on initial load
(function() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('#theme-toggle-switch');

    if (themeToggle) {
        // Set the toggle to the correct state
        if (localStorage.getItem('theme') === 'dark') {
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
