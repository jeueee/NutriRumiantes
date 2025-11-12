function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    displayIngredientLibrary();
});