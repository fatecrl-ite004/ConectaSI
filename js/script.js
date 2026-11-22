/* Script desenvolvido por Marilene Costa e Reginaldo Formoso para o ConectaSI */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Pesquisa instantânea nos cartões da página atual
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const termo = event.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll(
                ".discipline-card, .discipline-detailed-card, .material-card, .activity-card, .notice-card, .notice-card-full, .internship-card"
            );

            cards.forEach((card) => {
                const textoCard = card.innerText.toLowerCase();
                card.style.display = textoCard.includes(termo) ? "" : "none";
            });
        });
    }

    // 2. Botão de notificações (zera o contador na demonstração)
    const notifBtn = document.querySelector(".icon-btn[title='Notificações']");
    const badge = notifBtn ? notifBtn.querySelector(".badge") : null;

    if (notifBtn && badge) {
        notifBtn.addEventListener("click", () => {
            badge.textContent = "0";
            badge.style.display = "none";
        });
    }

    // 3. Feedback visual simples ao clicar em "Candidatar-se" nas vagas de estágio
    const applyButtons = document.querySelectorAll(".btn-apply");
    applyButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            btn.textContent = "Enviado ✓";
            btn.style.backgroundColor = "#16a34a";
            btn.style.color = "#ffffff";
        });
    });
});