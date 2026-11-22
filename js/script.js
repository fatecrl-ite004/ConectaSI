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

    // 2.1. Salva a disciplina selecionada ao clicar em "Acessar Disciplina"
    const accessLinks = document.querySelectorAll(".discipline-detailed-card .btn-access, .discipline-card .btn-access");
    accessLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const card = link.closest(".discipline-detailed-card, .discipline-card");
            const nomeDisciplina = card?.querySelector("h3, h2")?.textContent.trim();
            if (nomeDisciplina) {
                localStorage.setItem("conectasi_disciplina_filtro", nomeDisciplina);
            }
        });
    });

    // 2.2. Aplica filtro da disciplina em materiais.html e permite mostrar todos
    const materialsContainer = document.querySelector(".materials-list-container");
    const disciplinaFiltro = localStorage.getItem("conectasi_disciplina_filtro");

    if (materialsContainer && disciplinaFiltro) {
        const materialCards = Array.from(materialsContainer.querySelectorAll(".material-card"));
        const termoFiltro = disciplinaFiltro.toLowerCase();

        const bannerFiltro = document.createElement("div");
        bannerFiltro.className = "active-filter-banner";
        bannerFiltro.style.display = "flex";
        bannerFiltro.style.flexWrap = "wrap";
        bannerFiltro.style.alignItems = "center";
        bannerFiltro.style.justifyContent = "space-between";
        bannerFiltro.style.gap = "12px";
        bannerFiltro.style.padding = "12px 16px";
        bannerFiltro.style.marginBottom = "16px";
        bannerFiltro.style.borderRadius = "10px";
        bannerFiltro.style.backgroundColor = "#eff6ff";
        bannerFiltro.style.border = "1px solid #bfdbfe";
        bannerFiltro.style.color = "#1e3a8a";
        bannerFiltro.style.fontSize = "0.9rem";

        const textoBanner = document.createElement("span");
        const btnMostrarTodos = document.createElement("button");
        btnMostrarTodos.type = "button";
        btnMostrarTodos.textContent = "Mostrar todos os materiais";
        btnMostrarTodos.style.padding = "6px 12px";
        btnMostrarTodos.style.borderRadius = "8px";
        btnMostrarTodos.style.border = "1px solid #93c5fd";
        btnMostrarTodos.style.backgroundColor = "#ffffff";
        btnMostrarTodos.style.color = "#1d4ed8";
        btnMostrarTodos.style.fontWeight = "600";
        btnMostrarTodos.style.cursor = "pointer";

        const emptyMsg = document.createElement("p");
        emptyMsg.style.padding = "16px";
        emptyMsg.style.borderRadius = "10px";
        emptyMsg.style.backgroundColor = "#f8fafc";
        emptyMsg.style.border = "1px solid #e2e8f0";
        emptyMsg.style.color = "#475569";
        emptyMsg.style.display = "none";
        emptyMsg.textContent = `Nenhum material cadastrado para "${disciplinaFiltro}" no momento.`;

        let correspondentes = 0;
        materialCards.forEach((card) => {
            const textoCard = card.innerText.toLowerCase();
            const corresponde = textoCard.includes(termoFiltro);
            card.style.display = corresponde ? "" : "none";
            if (corresponde) correspondentes += 1;
        });

        textoBanner.innerHTML =
            correspondentes > 0
                ? `Filtrando materiais de <strong>${disciplinaFiltro}</strong> (${correspondentes})`
                : `Filtro selecionado: <strong>${disciplinaFiltro}</strong>`;

        if (correspondentes === 0) {
            emptyMsg.style.display = "block";
        }

        btnMostrarTodos.addEventListener("click", () => {
            localStorage.removeItem("conectasi_disciplina_filtro");
            materialCards.forEach((card) => {
                card.style.display = "";
            });
            emptyMsg.style.display = "none";
            bannerFiltro.remove();
        });

        bannerFiltro.appendChild(textoBanner);
        bannerFiltro.appendChild(btnMostrarTodos);
        materialsContainer.prepend(bannerFiltro);
        materialsContainer.appendChild(emptyMsg);
    }

    // 2.3. Favoritos em disciplinas (estrela nos cards + filtro ao clicar em "Favoritos" no menu)
    const FAV_STORAGE_KEY = "conectasi_favoritos";
    const FAV_FILTER_KEY = "conectasi_apenas_favoritos";

    const lerFavoritos = () => {
        try {
            const raw = localStorage.getItem(FAV_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const salvarFavoritos = (lista) => {
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(lista));
    };

    const disciplineCards = Array.from(document.querySelectorAll(".discipline-detailed-card, .discipline-card"));
    const disciplinesGrid = document.querySelector(".full-disciplines-grid");

    let favBanner = null;
    let favEmptyMsg = null;

    const atualizarFiltroFavoritos = () => {
        if (!disciplinesGrid || disciplineCards.length === 0) return;

        const apenasFavoritos = localStorage.getItem(FAV_FILTER_KEY) === "true";
        const favoritosAtuais = lerFavoritos();

        if (!favBanner) {
            favBanner = document.createElement("div");
            favBanner.className = "favorites-filter-banner";
            favBanner.style.gridColumn = "1 / -1";
            favBanner.style.display = "flex";
            favBanner.style.flexWrap = "wrap";
            favBanner.style.alignItems = "center";
            favBanner.style.justifyContent = "space-between";
            favBanner.style.gap = "12px";
            favBanner.style.padding = "12px 16px";
            favBanner.style.borderRadius = "10px";
            favBanner.style.backgroundColor = "#fefce8";
            favBanner.style.border = "1px solid #fde047";
            favBanner.style.color = "#854d0e";
            favBanner.style.fontSize = "0.9rem";

            const textoFav = document.createElement("span");
            textoFav.className = "favorites-banner-text";

            const btnMostrarTodas = document.createElement("button");
            btnMostrarTodas.type = "button";
            btnMostrarTodas.textContent = "Mostrar todas as disciplinas";
            btnMostrarTodas.style.padding = "6px 12px";
            btnMostrarTodas.style.borderRadius = "8px";
            btnMostrarTodas.style.border = "1px solid #facc15";
            btnMostrarTodas.style.backgroundColor = "#ffffff";
            btnMostrarTodas.style.color = "#854d0e";
            btnMostrarTodas.style.fontWeight = "600";
            btnMostrarTodas.style.cursor = "pointer";

            btnMostrarTodas.addEventListener("click", () => {
                localStorage.setItem(FAV_FILTER_KEY, "false");
                atualizarFiltroFavoritos();
            });

            favBanner.appendChild(textoFav);
            favBanner.appendChild(btnMostrarTodas);
            disciplinesGrid.prepend(favBanner);
        }

        if (!favEmptyMsg) {
            favEmptyMsg = document.createElement("p");
            favEmptyMsg.className = "favorites-empty-msg";
            favEmptyMsg.style.gridColumn = "1 / -1";
            favEmptyMsg.style.padding = "16px";
            favEmptyMsg.style.borderRadius = "10px";
            favEmptyMsg.style.backgroundColor = "#f8fafc";
            favEmptyMsg.style.border = "1px solid #e2e8f0";
            favEmptyMsg.style.color = "#475569";
            favEmptyMsg.style.display = "none";
            favEmptyMsg.textContent =
                "Você ainda não favoritou nenhuma disciplina. Clique na estrela (☆) de um card para salvar nos favoritos.";
            disciplinesGrid.appendChild(favEmptyMsg);
        }

        if (!apenasFavoritos) {
            favBanner.style.display = "none";
            favEmptyMsg.style.display = "none";
            disciplineCards.forEach((card) => {
                card.style.display = "";
            });
            return;
        }

        let visiveis = 0;
        disciplineCards.forEach((card) => {
            const nome = card.querySelector("h3, h2")?.textContent.trim() || "";
            const ehFavorito = favoritosAtuais.includes(nome);
            card.style.display = ehFavorito ? "" : "none";
            if (ehFavorito) visiveis += 1;
        });

        favBanner.style.display = "flex";
        const textoEl = favBanner.querySelector(".favorites-banner-text");
        if (textoEl) {
            textoEl.innerHTML =
                visiveis > 0
                    ? `Exibindo <strong>Favoritos</strong> (${visiveis} ${visiveis === 1 ? "disciplina" : "disciplinas"})`
                    : "Exibindo <strong>Favoritos</strong>";
        }
        favEmptyMsg.style.display = visiveis === 0 ? "block" : "none";
    };

    if (disciplineCards.length > 0) {
        const favoritosSalvos = lerFavoritos();

        disciplineCards.forEach((card) => {
            const nomeDisciplina = card.querySelector("h3, h2")?.textContent.trim();
            if (!nomeDisciplina) return;

            const cardTop = card.querySelector(".card-top");
            const favBtn = document.createElement("button");
            favBtn.type = "button";
            favBtn.className = "btn-favorite-toggle";
            favBtn.style.background = "transparent";
            favBtn.style.border = "none";
            favBtn.style.cursor = "pointer";
            favBtn.style.fontSize = "1.2rem";
            favBtn.style.lineHeight = "1";
            favBtn.style.padding = "2px 4px";

            const aplicarEstadoEstrela = (isFav) => {
                favBtn.textContent = isFav ? "★" : "☆";
                favBtn.style.color = isFav ? "#eab308" : "#94a3b8";
                favBtn.title = isFav ? "Remover dos favoritos" : "Adicionar aos favoritos";
                favBtn.setAttribute("aria-pressed", String(isFav));
            };

            aplicarEstadoEstrela(favoritosSalvos.includes(nomeDisciplina));

            favBtn.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                const atual = lerFavoritos();
                const jaExiste = atual.includes(nomeDisciplina);
                const novaLista = jaExiste
                    ? atual.filter((item) => item !== nomeDisciplina)
                    : [...atual, nomeDisciplina];

                salvarFavoritos(novaLista);
                aplicarEstadoEstrela(!jaExiste);

                if (localStorage.getItem(FAV_FILTER_KEY) === "true") {
                    atualizarFiltroFavoritos();
                }
            });

            if (cardTop) {
                cardTop.appendChild(favBtn);
            } else {
                favBtn.style.float = "right";
                card.prepend(favBtn);
            }
        });

        atualizarFiltroFavoritos();
    }

    const menuFavLinks = Array.from(document.querySelectorAll(".menu-nav a")).filter((a) =>
        a.textContent.toLowerCase().includes("favoritos")
    );

    menuFavLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const estaEmDisciplinas = Boolean(disciplinesGrid);
            const filtroAtual = localStorage.getItem(FAV_FILTER_KEY) === "true";

            if (estaEmDisciplinas) {
                event.preventDefault();
                localStorage.setItem(FAV_FILTER_KEY, filtroAtual ? "false" : "true");
                atualizarFiltroFavoritos();
            } else {
                localStorage.setItem(FAV_FILTER_KEY, "true");
            }
        });
    });

    // 3. Candidatura em vagas de estágio (abre caixa para currículo/observação no card)
    const applyButtons = document.querySelectorAll(".btn-apply");
    applyButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const card = btn.closest(".internship-card");
            if (!card || btn.dataset.candidatado === "true") return;

            let applyBox = card.querySelector(".internship-apply-box");
            if (applyBox) {
                applyBox.remove();
                return;
            }

            applyBox = document.createElement("div");
            applyBox.className = "internship-apply-box";
            applyBox.style.marginTop = "14px";
            applyBox.style.padding = "14px";
            applyBox.style.borderRadius = "10px";
            applyBox.style.backgroundColor = "#f8fafc";
            applyBox.style.border = "1px solid #cbd5e1";
            applyBox.style.color = "#0f172a";
            applyBox.style.width = "100%";

            applyBox.innerHTML = `
                <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px;">
                    Enviar currículo para a vaga
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <input type="file" class="apply-resume-input" accept=".pdf,.doc,.docx" style="font-size: 0.85rem;">
                    <input type="text" class="apply-link-input" placeholder="Link do LinkedIn/Portfólio ou mensagem (opcional)" style="padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.875rem; background-color: #ffffff; color: #0f172a;">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button type="button" class="btn-confirm-apply" style="padding: 8px 14px; border-radius: 8px; border: none; background-color: #16a34a; color: #ffffff; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                            Confirmar Candidatura
                        </button>
                        <button type="button" class="btn-cancel-apply" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background-color: #ffffff; color: #334155; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                            Cancelar
                        </button>
                    </div>
                </div>
            `;

            card.appendChild(applyBox);

            const resumeInput = applyBox.querySelector(".apply-resume-input");
            const linkInput = applyBox.querySelector(".apply-link-input");
            const btnConfirmar = applyBox.querySelector(".btn-confirm-apply");
            const btnCancelar = applyBox.querySelector(".btn-cancel-apply");

            btnCancelar.addEventListener("click", () => {
                applyBox.remove();
            });

            btnConfirmar.addEventListener("click", () => {
                const curriculo = resumeInput?.files?.[0]?.name || "curriculo-marilene.pdf";
                const complemento = linkInput?.value.trim() || "";

                let receipt = card.querySelector(".internship-receipt");
                if (!receipt) {
                    receipt = document.createElement("div");
                    receipt.className = "internship-receipt";
                    receipt.style.marginTop = "12px";
                    receipt.style.padding = "10px 12px";
                    receipt.style.borderRadius = "8px";
                    receipt.style.backgroundColor = "#f0fdf4";
                    receipt.style.border = "1px solid #bbf7d0";
                    receipt.style.color = "#166534";
                    receipt.style.fontSize = "0.85rem";
                    receipt.style.width = "100%";
                    card.appendChild(receipt);
                }

                receipt.textContent =
                    `Candidatura enviada • Currículo: ${curriculo}` +
                    (complemento ? ` • ${complemento}` : "");

                btn.dataset.candidatado = "true";
                btn.textContent = "Enviado ✓";
                btn.style.backgroundColor = "#16a34a";
                btn.style.color = "#ffffff";

                applyBox.remove();
            });
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

    // 5. Envio de atividades pendentes em atividades.html (abre caixa de arquivo no card)
    const submitButtons = document.querySelectorAll(".btn-submit");
    submitButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const card = btn.closest(".activity-card");
            if (!card || btn.dataset.enviado === "true") return;

            let uploadBox = card.querySelector(".activity-upload-box");
            if (uploadBox) {
                uploadBox.remove();
                return;
            }

            uploadBox = document.createElement("div");
            uploadBox.className = "activity-upload-box";
            uploadBox.style.marginTop = "14px";
            uploadBox.style.padding = "14px";
            uploadBox.style.borderRadius = "10px";
            uploadBox.style.backgroundColor = "#f8fafc";
            uploadBox.style.border = "1px solid #cbd5e1";
            uploadBox.style.color = "#0f172a";
            uploadBox.style.width = "100%";

            uploadBox.innerHTML = `
                <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px;">
                    Anexar entrega da atividade
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <input type="file" class="upload-file-input" style="font-size: 0.85rem;">
                    <input type="text" class="upload-note-input" placeholder="Observação ou link (opcional)" style="padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.875rem; background-color: #ffffff; color: #0f172a;">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button type="button" class="btn-confirm-upload" style="padding: 8px 14px; border-radius: 8px; border: none; background-color: #16a34a; color: #ffffff; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                            Confirmar Envio
                        </button>
                        <button type="button" class="btn-cancel-upload" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background-color: #ffffff; color: #334155; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                            Cancelar
                        </button>
                    </div>
                </div>
            `;

            card.appendChild(uploadBox);

            const fileInput = uploadBox.querySelector(".upload-file-input");
            const noteInput = uploadBox.querySelector(".upload-note-input");
            const btnConfirmar = uploadBox.querySelector(".btn-confirm-upload");
            const btnCancelar = uploadBox.querySelector(".btn-cancel-upload");

            btnCancelar.addEventListener("click", () => {
                uploadBox.remove();
            });

            btnConfirmar.addEventListener("click", () => {
                const arquivoSelecionado = fileInput?.files?.[0]?.name || "entrega-atividade.pdf";
                const observacao = noteInput?.value.trim() || "";

                card.dataset.arquivoEnviado = arquivoSelecionado;
                card.dataset.observacaoEnvio = observacao;

                const statusBadge = card.querySelector(".status-badge");
                const iconBox = card.querySelector(".activity-icon-box");
                const deadline = card.querySelector(".activity-deadline");

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

                btn.dataset.enviado = "true";
                btn.textContent = "Enviado ✓";
                btn.style.backgroundColor = "#16a34a";
                btn.style.color = "#ffffff";

                uploadBox.remove();
            });
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
            const arquivo = card.dataset.arquivoEnviado || "entrega-final.pdf";
            const observacao = card.dataset.observacaoEnvio;

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
            infoBox.textContent =
                `Comprovante de envio: ${titulo} (${disciplina}) • Arquivo: ${arquivo} • ${entrega}` +
                (observacao ? ` • Obs.: ${observacao}` : "");

            card.appendChild(infoBox);
            btn.textContent = "Ocultar Envio";
        });
    });
});