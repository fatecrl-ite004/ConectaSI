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

    // 4. Download de arquivo de resumo/material em materiais.html
    const downloadButtons = document.querySelectorAll(".btn-download");
    downloadButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const card = btn.closest(".material-card");
            const titulo = card?.querySelector("h3")?.textContent.trim() || "Material ConectaSI";
            const disciplina = card?.querySelector(".material-subject")?.textContent.trim() || "Sistemas para Internet";
            const meta = card?.querySelector(".material-date")?.textContent.trim() || "";

            const nomeArquivo =
                titulo
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") + ".txt";

            const conteudo = [
                "ConectaSI - Material de Aula (Demonstracao)",
                "============================================",
                `Material: ${titulo}`,
                `Disciplina / Professor: ${disciplina}`,
                meta ? `Informacoes: ${meta}` : "",
                "Plataforma: ConectaSI (FATEC)"
            ]
                .filter(Boolean)
                .join("\n");

            const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const linkTemp = document.createElement("a");
            linkTemp.href = url;
            linkTemp.download = nomeArquivo;
            document.body.appendChild(linkTemp);
            linkTemp.click();
            document.body.removeChild(linkTemp);
            URL.revokeObjectURL(url);

            btn.textContent = "Baixado ✓";
            btn.style.backgroundColor = "#16a34a";
            btn.style.color = "#ffffff";
        });
    });
});