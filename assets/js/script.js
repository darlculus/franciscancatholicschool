// Add floating items dynamically
document.addEventListener('DOMContentLoaded', function() {
    const floatingContainer = document.querySelector('.floating-items');
    const emojis = ['🍎', '✏️', '📚', '🎒', '🔍', '🎭', '🎵', '⚽', '🧩', '🔢'];
    
    for (let i = 0; i < 15; i++) {
        const item = document.createElement('div');
        item.classList.add('floating-item');
        item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        item.style.left = `${Math.random() * 100}%`;
        item.style.top = `${Math.random() * 100}%`;
        item.style.fontSize = `${Math.random() * 2 + 1}rem`;
        item.style.animationDuration = `${Math.random() * 15 + 10}s`;
        item.style.animationDelay = `${Math.random() * 5}s`;
        floatingContainer.appendChild(item);
    }

    // Let's add some additional interactivity
    const logo = document.querySelector('.logo-container');
    logo.addEventListener('click', function() {
        this.style.animationName = 'none';
        setTimeout(() => {
            this.style.animationName = 'bounce';
        }, 10);
    });

    // Make buttons more interactive
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});
