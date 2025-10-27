// Arquivo: map.js
// Solução Definitiva para compatibilidade máxima (PC e Mobile)

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const mapSimulationBox = document.getElementById('map-simulation-box');
    const simulateButton = document.getElementById('simulate-location-btn');
    
    if (!mapSimulationBox || !simulateButton) {
        console.error("Erro: Elementos de instrução do mapa não encontrados.");
        return; 
    }

    // Função para detectar se é um dispositivo móvel
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Função para construir a URL do Google Maps com a localização e pesquisa
    const buildMapUrl = (lat, lon) => {
        // A URL usa a pesquisa "Ecoponto" e centraliza o mapa na localização do usuário.
        // O termo de pesquisa é anexado ao final da string.
        return `https://www.google.com/maps/search/Ecoponto/@$`;
    };

    // Função para tratar o clique no botão
    const findUserLocation = () => {
        
        if (mapSimulationBox) {
            mapSimulationBox.innerHTML = `
                <h4>🛰️ Buscando sua Localização...</h4>
                <p>Conceda a permissão no navegador.</p>
            `;
        }
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // --- CASO DE SUCESSO ---
                    const lat = position.coords.latitude.toFixed(6);
                    const lon = position.coords.longitude.toFixed(6);

                    const newMapUrl = buildMapUrl(lat, lon);
                    
                    if (isMobile()) {
                        // SOLUÇÃO MOBILE: Redireciona a aba atual (window.location.href).
                        // Isso evita o bloqueio de pop-up e aciona o app nativo de mapas.
                        window.location.href = newMapUrl; 
                        
                        // Mensagem de fallback
                        if (mapSimulationBox) {
                            mapSimulationBox.innerHTML = `
                                <h4>✅ Redirecionando para o Mapa...</h4>
                                <p>Sua posição foi identificada. Se a tela não mudar em 5 segundos, <a href="${newMapUrl}" target="_blank" class="btn-cta" style="display: inline-block; margin-top: 10px;">Clique Aqui</a>.</p>
                            `;
                        }
                        
                    } else {
                        // SOLUÇÃO PC: Abre em nova aba (window.open).
                        window.open(newMapUrl, '_blank'); 
                        
                        // Atualiza a caixa de instrução para o sucesso no PC
                        if (mapSimulationBox) {
                            mapSimulationBox.innerHTML = `
                                <h4>✅ Mapa Aberto com Sucesso!</h4>
                                <p>O Google Maps foi aberto em uma nova aba com a pesquisa "Ecoponto" centralizada em você.</p>
                                <button id="simulate-location-btn" class="btn-cta" style="margin-top: 10px;">Abrir Mapa Novamente</button>
                            `;
                            // Reativa o listener do botão
                            const retryButton = document.getElementById('simulate-location-btn');
                            if(retryButton) {
                                retryButton.addEventListener('click', findUserLocation); 
                            }
                        }
                    }
                },
                (error) => {
                    // --- CASO DE ERRO OU NEGAÇÃO DO USUÁRIO ---
                    let message = "❌ Acesso negado. Permita a localização para abrir o mapa centralizado.";
                    
                    const fallbackMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117075.76019550742!2d-46.6027376!3d-23.6841103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce43d1f053503f%3A0x676790e729a738a0!2sSanto%20Andr%C3%A9%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr`; // URL genérica do ABC
                    
                    if (mapSimulationBox) {
                        mapSimulationBox.innerHTML = `
                            <h4>${message}</h4>
                            <p>O Google Maps do ABC será aberto em nova aba. Você pode pesquisar manualmente.</p>
                            <a href="${fallbackMapUrl}" target="_blank" class="btn-cta" style="display: inline-block; margin-top: 10px;">Abrir Mapa Padrão (ABC)</a>
                        `;
                    }
                    
                    // Fallback para abrir o mapa padrão do ABC em nova aba (útil no PC)
                    window.open(fallbackMapUrl, '_blank'); 

                    // Reativa o listener do botão após a falha
                    const retryButton = document.getElementById('simulate-location-btn');
                    if(retryButton) {
                        retryButton.addEventListener('click', findUserLocation); 
                    }
                }
            );
            
        } else if (mapSimulationBox) {
            // Navegador não suporta geolocalização
            mapSimulationBox.innerHTML = `
                <h4>🚫 Geolocalização Não Suportada</h4>
                <p>Seu dispositivo não suporta este recurso. Pesquise por Ecopontos no Google Maps.</p>
            `;
        }
    };
    
    // Liga o listener ao botão na inicialização
    if (simulateButton) {
        simulateButton.addEventListener('click', findUserLocation);
    }
});