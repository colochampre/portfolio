document.addEventListener('DOMContentLoaded', () => {
    const sortableHeaders = document.querySelectorAll('.ranking-table th.sortable');
    const thead = document.querySelector('.ranking-table thead');
    
    const currentSort = thead?.dataset.currentSort || 'wilson';
    const currentDir = thead?.dataset.currentDir || 'default';
    
    // Default directions for each sort type
    const defaultDirs = {
        wilson: 'desc',
        username: 'asc',
        level: 'desc',
        matches: 'desc',
        record: 'desc',
        winrate: 'desc',
        goals: 'desc',
        assists: 'desc'
    };
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.dataset.sort;
            const url = new URL(window.location.href);
            
            let newDir;
            if (sortBy === currentSort) {
                // Toggle direction if clicking the same column
                const effectiveCurrentDir = currentDir === 'default' ? defaultDirs[sortBy] : currentDir;
                newDir = effectiveCurrentDir === 'desc' ? 'asc' : 'desc';
            } else {
                // Use default direction for new column
                newDir = 'default';
            }
            
            url.searchParams.set('sort', sortBy);
            url.searchParams.set('dir', newDir);
            window.location.href = url.toString();
        });
    });
});
