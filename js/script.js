/* Script desenvolvido por Marilene Costa e Reginaldo Formoso para o ConectaSI */

document.addEventListener("DOMContentLoaded", () => {
    // 0. Aplica preferências salvas (tema, tamanho da fonte e foto) em todas as páginas
    const temaSalvo = localStorage.getItem("conectasi_tema") || "padrao";
    const escalaSalva = parseFloat(localStorage.getItem("conectasi_escala_fonte")) || 1;
    const fotoSalva = localStorage.getItem("conectasi_foto_perfil");

    document.body.classList.remove("tema-suave", "tema-escuro");
    if (temaSalvo === "tema-suave" || temaSalvo === "tema-escuro") {
        document.body.classList.add(temaSalvo);
    }

    document.documentElement.style.fontSize = `${escalaSalva * 16}px`;

    if (fotoSalva) {
        document.querySelectorAll(".avatar, .avatar-small, .profile-big-avatar").forEach((av) => {
            av.innerHTML = `<img src="${fotoSalva}" alt="Foto de perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        });
    }

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

    // 2. Botão de notificações (abre/fecha painel com avisos e zera o contador)
    const notifBtn = document.querySelector(".icon-btn[title='Notificações']");
    const badge = notifBtn ? notifBtn.querySelector(".badge") : null;
    const navbarActions = document.querySelector(".navbar-actions");

    if (notifBtn && navbarActions) {
        let notifDropdown = document.querySelector(".notif-dropdown");

        if (!notifDropdown) {
            notifDropdown = document.createElement("div");
            notifDropdown.className = "notif-dropdown";
            notifDropdown.style.display = "none";
            notifDropdown.style.position = "absolute";
            notifDropdown.style.top = "calc(100% + 8px)";
            notifDropdown.style.right = "0";
            notifDropdown.style.width = "290px";
            notifDropdown.style.backgroundColor = "#ffffff";
            notifDropdown.style.color = "#0f172a";
            notifDropdown.style.border = "1px solid #e2e8f0";
            notifDropdown.style.borderRadius = "12px";
            notifDropdown.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.12)";
            notifDropdown.style.padding = "12px";
            notifDropdown.style.zIndex = "50";
            notifDropdown.style.fontSize = "0.875rem";

            notifDropdown.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">
                    Notificações recentes
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                    <div><strong>Votação:</strong> Profa. Vanina Sigrist no ChangeMakers 2026</div>
                    <div><strong>Atividade:</strong> Entrega de Desenvolvimento Web I</div>
                    <div><strong>Evento:</strong> Semana Acadêmica de Tecnologia</div>
                </div>
                <a href="avisos.html" style="display: inline-block; font-weight: 600; color: #16a34a; text-decoration: none;">
                    Ver mural completo →
                </a>
            `;

            if (getComputedStyle(navbarActions).position === "static") {
                navbarActions.style.position = "relative";
            }
            navbarActions.appendChild(notifDropdown);
        }

        notifBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            if (badge) {
                badge.textContent = "0";
                badge.style.display = "none";
            }

            const estaVisivel = notifDropdown.style.display === "block";
            notifDropdown.style.display = estaVisivel ? "none" : "block";
        });

        document.addEventListener("click", (event) => {
            if (!notifDropdown.contains(event.target) && !notifBtn.contains(event.target)) {
                notifDropdown.style.display = "none";
            }
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