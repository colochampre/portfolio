// Theme System
const ThemeManager = {
    themes: ['retro', 'jinxed'],
    currentThemeIndex: 0,

    init() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentThemeIndex = this.themes.indexOf(savedTheme);
            this.applyTheme(savedTheme);
        } else {
            this.applyTheme(this.themes[0]);
        }
    },

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('selectedTheme', themeName);
    },

    toggleTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const newTheme = this.themes[this.currentThemeIndex];
        this.applyTheme(newTheme);
        return newTheme;
    },

    getCurrentTheme() {
        return this.themes[this.currentThemeIndex];
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const newTheme = ThemeManager.toggleTheme();
            console.log(`Tema cambiado a: ${newTheme}`);
        });
    }
});
