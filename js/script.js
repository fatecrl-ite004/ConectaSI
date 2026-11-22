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

    // 5. Envio de atividades pendentes em atividades.html
    const submitButtons = document.querySelectorAll(".btn-submit");
    submitButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const card = btn.closest(".activity-card");
            const statusBadge = card?.querySelector(".status-badge");
            const iconBox = card?.querySelector(".activity-icon-box");
            const deadline = card?.querySelector(".activity-deadline");

            if (statusBadge) {
                statusBadge.textContent = "Entregue";
                statusBadge.classList.remove("pending");
                statusBadge.classList.add("completed");
            }

            if (iconBox) {
                iconBox.classList.remove("pending");
                iconBox.classList.add("completed");
            }

            if (deadline) {
                deadline.classList.remove("urgent-text");
                const hoje = new Date().toLocaleDateString("pt-BR");
                deadline.textContent = `Entregue em: ${hoje}`;
            }

            btn.textContent = "Enviado ✓";
            btn.style.backgroundColor = "#16a34a";
            btn.style.color = "#ffffff";
        });
    });

    // 6. Detalhes do envio em atividades já entregues (sem alert)
    const viewButtons = document.querySelectorAll(".btn-view");
    viewButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const card = btn.closest(".activity-card");
            if (!card) return;

            let infoBox = card.querySelector(".submission-receipt");
            if (infoBox) {
                infoBox.remove();
                btn.textContent = "Ver Envio";
                return;
            }

            const titulo = card.querySelector("h3")?.textContent.trim() || "Atividade";
            const disciplina = card.querySelector(".activity-subject")?.textContent.trim() || "";
            const entrega = card.querySelector(".activity-deadline")?.textContent.trim() || "Entregue";

            infoBox = document.createElement("div");
            infoBox.className = "submission-receipt";
            infoBox.style.marginTop = "12px";
            infoBox.style.padding = "10px 14px";
            infoBox.style.borderRadius = "8px";
            infoBox.style.backgroundColor = "#f0fdf4";
            infoBox.style.border = "1px solid #bbf7d0";
            infoBox.style.color = "#166534";
            infoBox.style.fontSize = "0.875rem";
            infoBox.style.width = "100%";
            infoBox.textContent = `Comprovante de envio: ${titulo} (${disciplina}) • ${entrega}`;

            card.appendChild(infoBox);
            btn.textContent = "Ocultar Envio";
        });
    });
});