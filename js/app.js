document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-list-link');
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    // Asegúrate de que mobileMenu existe antes de agregar el event listener
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Cerrar el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    const startGameButton = document.getElementById('startGameButton');

    if (startGameButton) {
        startGameButton.addEventListener('click', function() {
            window.location.href ='menu.html'; 
        });
    }

    const start = document.getElementById('start');

    if (start) {
        start.addEventListener('click', function() {
            window.location.href ='juego.html'; 
        });
    }
    const home = document.getElementById('home');

    if (home) {
        home.addEventListener('click', function() {
            window.location.href ='index.html'; 
        });
    }
});
