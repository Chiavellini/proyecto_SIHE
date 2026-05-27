document.addEventListener('DOMContentLoaded', () => {
    const BASE_INSCRIPTIONS = 321;
    const STORAGE_KEY = 'raffle-inscriptions';
    const goal = 500;
    let extraSignatures = Number(localStorage.getItem(STORAGE_KEY) || 0);
    let signatures = BASE_INSCRIPTIONS + extraSignatures;

    // DOM Elements
    const form = document.getElementById('petition-form');
    const signaturesEl = document.getElementById('current-signatures');
    const progressBar = document.getElementById('progress-bar');
    const supportersList = document.getElementById('supporters-list');
    const progressStats = document.querySelector('.progress-stats strong');

    // Initialize progress bar
    updateProgress();

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();

        if (firstName && lastName) {
            // Increment signature count and persist it across reloads
            extraSignatures++;
            localStorage.setItem(STORAGE_KEY, String(extraSignatures));
            signatures = BASE_INSCRIPTIONS + extraSignatures;
            updateProgress();

            // Add new supporter to list
            addSupporter(firstName, lastName);

            // Enviar datos a Formspree silenciosamente
            const formData = new FormData(form);

            // Reemplaza TU_ENDPOINT_AQUI con el ID de tu formulario en Formspree
            fetch("https://formspree.io/f/xzdwzjgg", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                // Change button state to show success
                const btn = form.querySelector('button[type="submit"]');
                btn.textContent = "¡Gracias por inscribirte!";
                btn.style.backgroundColor = "#2e7d32"; // Green success color
                btn.disabled = true;
            }).catch(error => {
                console.error("Error al enviar a Formspree:", error);
                // Aún así mostrar éxito al usuario para no romper la experiencia
                const btn = form.querySelector('button[type="submit"]');
                btn.textContent = "¡Gracias por inscribirte!";
                btn.style.backgroundColor = "#2e7d32";
                btn.disabled = true;
            });
        }
    });

    function updateProgress() {
        // Format numbers with commas
        signaturesEl.textContent = signatures.toLocaleString('es-MX');

        // Calculate and set progress bar width
        const percentage = Math.min((signatures / goal) * 100, 100);

        // Small delay to allow CSS transition to play on load
        setTimeout(() => {
            progressBar.style.width = `${percentage}%`;
        }, 100);

        // Update remaining needed
        const remaining = Math.max(goal - signatures, 0);
        progressStats.textContent = remaining.toLocaleString('es-MX');
    }

    function addSupporter(firstName, lastName) {
        // Get initials
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

        // Combine full name
        // SECURITY NOTE: This is vulnerable to DOM-based XSS! 
        // For a web security class, this is an excellent demonstration point.
        // If a user types <img src="x" onerror="alert(1)"> in the first name, it will execute.
        const fullName = `${firstName} ${lastName}`;

        // Create new list item
        const li = document.createElement('li');
        li.style.animation = 'highlightAdded 2s ease-out';

        li.innerHTML = `
            <div class="supporter-avatar">${initials}</div>
            <div class="supporter-info">
                <span class="supporter-name">${fullName}</span> se ha inscrito en la rifa
                <span class="supporter-time">Justo ahora</span>
            </div>
        `;

        // Add to top of list
        supportersList.prepend(li);

        // Remove oldest if list gets too long (keep at 5)
        if (supportersList.children.length > 5) {
            supportersList.removeChild(supportersList.lastChild);
        }
    }
});
