// Fitxer JavaScript per a la lògica de l'aplicació
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csv-file-input');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');

    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Netejar missatges d'error previs i mostrar càrrega
            hideError();
            loadingMessage.classList.remove('hidden');
            
            // Ocultar seccions anteriors si es recarrega un fitxer
            document.getElementById('summary-section').classList.add('hidden');
            document.getElementById('table-section').classList.add('hidden');
            document.getElementById('chart-section').classList.add('hidden');

            const reader = new FileReader();
            reader.onload = (e) => {
                // Afegim un petit setTimeout per permetre que la UI renderitzi el missatge de "Processant"
                setTimeout(() => {
                    const text = e.target.result;
                    processCSV(text);
                    loadingMessage.classList.add('hidden'); // Amagar carregant un cop acabat
                }, 100);
            };
            reader.onerror = () => {
                showError("No s'ha pogut llegir el fitxer.");
                loadingMessage.classList.add('hidden');
            };
            reader.readAsText(file);
        });
    }

    function processCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length === 0) {
            showError("El fitxer està buit.");
            return;
        }

        const headers = lines[0].trim().split(',');
        const expectedHeaders = ['userId', 'movieId', 'title', 'genres', 'rating', 'timestamp'];
        
        // Validar capçaleres
        if (!validateHeaders(headers, expectedHeaders)) {
            showError("Les columnes del fitxer no són vàlides. S'esperava: " + expectedHeaders.join(', '));
            return;
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const rowText = lines[i].trim();
            if (!rowText) continue;

            const rowData = parseCSVRow(rowText);
            if (rowData.length >= expectedHeaders.length) {
                const obj = {
                    userId: parseInt(rowData[0]),
                    movieId: parseInt(rowData[1]),
                    title: rowData[2],
                    genres: rowData[3],
                    rating: parseFloat(rowData[4]),
                    timestamp: parseInt(rowData[5])
                };
                data.push(obj);
            }
        }

        console.log("Dades processades correctament:", data);
        displayData(data);
    }

    // --- Lògica de la Fase 3: Taula i Paginació ---
    let currentData = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    function displayData(data) {
        currentData = data;
        currentPage = 1;
        
        const tableSection = document.getElementById('table-section');
        tableSection.classList.remove('hidden');

        if (currentData.length === 0) {
            document.getElementById('data-table').innerHTML = "<p>No hi ha dades per mostrar.</p>";
            document.getElementById('pagination-controls').innerHTML = "";
            return;
        }

        renderTable();
        renderSummary(data);
        renderChart(data);
    }

    // --- Lògica de la Fase 5: Gràfic ---
    let chartInstance = null;

    function renderChart(data) {
        const chartSection = document.getElementById('chart-section');
        chartSection.classList.remove('hidden');

        // Calcular valoració mitjana per gènere
        const genreStats = {};
        
        data.forEach(row => {
            const genresList = row.genres.split('|');
            genresList.forEach(g => {
                const genre = g.trim();
                if (!genre) return;
                
                if (!genreStats[genre]) {
                    genreStats[genre] = { sum: 0, count: 0 };
                }
                genreStats[genre].sum += row.rating;
                genreStats[genre].count += 1;
            });
        });

        const labels = [];
        const chartData = [];

        for (const [genre, stats] of Object.entries(genreStats)) {
            labels.push(genre);
            const avg = stats.count > 0 ? (stats.sum / stats.count) : 0;
            chartData.push(avg.toFixed(2));
        }

        const ctx = document.getElementById('genre-chart').getContext('2d');

        // Destruir gràfic previ si n'hi ha
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valoració Mitjana',
                    data: chartData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Valoració mitjana per cada gènere de pel·lícula'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Puntuació (0 - 5)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Gèneres'
                        }
                    }
                }
            }
        });
    }

    // --- Lògica de la Fase 4: Resum Estadístic ---
    function renderSummary(data) {
        const summarySection = document.getElementById('summary-section');
        const summaryList = document.getElementById('summary-list');
        
        summarySection.classList.remove('hidden');

        // Variables per als càlculs
        const uniqueMovies = new Set();
        const uniqueUsers = new Set();
        let totalRatings = data.length;
        let sumRatings = 0;
        const movieCounts = {}; // Per trobar la pel·lícula amb més valoracions

        data.forEach(row => {
            uniqueMovies.add(row.movieId);
            uniqueUsers.add(row.userId);
            sumRatings += row.rating;

            if (movieCounts[row.title]) {
                movieCounts[row.title]++;
            } else {
                movieCounts[row.title] = 1;
            }
        });

        const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0;

        let mostRatedMovie = "Cap";
        let maxRatings = 0;
        for (const [title, count] of Object.entries(movieCounts)) {
            if (count > maxRatings) {
                maxRatings = count;
                mostRatedMovie = title;
            }
        }

        // Renderitzar al HTML
        summaryList.innerHTML = `
            <li><strong>Nombre de pel·lícules úniques:</strong> ${uniqueMovies.size}</li>
            <li><strong>Nombre d'usuaris únics:</strong> ${uniqueUsers.size}</li>
            <li><strong>Nombre total de valoracions:</strong> ${totalRatings}</li>
            <li><strong>Valoració mitjana global:</strong> ${averageRating}</li>
            <li><strong>Pel·lícula amb més valoracions:</strong> ${mostRatedMovie} (${maxRatings} valoracions)</li>
        `;
    }

    function renderTable() {
        const thead = document.querySelector('#data-table thead');
        const tbody = document.querySelector('#data-table tbody');
        const pagination = document.getElementById('pagination-controls');

        // Render capçaleres amb opció d'ordenació per puntuació
        thead.innerHTML = `
            <tr>
                <th>ID Usuari</th>
                <th>ID Pel·lícula</th>
                <th>Títol</th>
                <th>Gèneres</th>
                <th style="cursor: pointer; text-decoration: underline;" id="sort-rating">Puntuació ↕</th>
                <th>Duració</th>
            </tr>
        `;

        // Afegir esdeveniment per ordenar
        document.getElementById('sort-rating').addEventListener('click', () => {
            currentData.sort((a, b) => b.rating - a.rating);
            currentPage = 1;
            renderTable();
        });

        // Calcular índexs de paginació
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, currentData.length);
        const pageData = currentData.slice(startIndex, endIndex);

        // Render files
        tbody.innerHTML = '';
        pageData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.userId}</td>
                <td>${row.movieId}</td>
                <td>${row.title}</td>
                <td>${row.genres}</td>
                <td>${row.rating}</td>
                <td>${row.timestamp}</td>
            `;
            tbody.appendChild(tr);
        });

        // Render controls paginació
        const totalPages = Math.ceil(currentData.length / rowsPerPage);
        pagination.innerHTML = `
            <button id="btn-prev" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
            <span>Pàgina ${currentPage} de ${totalPages}</span>
            <button id="btn-next" ${currentPage === totalPages ? 'disabled' : ''}>Següent</button>
        `;

        const btnPrev = document.getElementById('btn-prev');
        if (btnPrev) btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });

        const btnNext = document.getElementById('btn-next');
        if (btnNext) btnNext.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    function validateHeaders(headers, expected) {
        if (headers.length < expected.length) return false;
        for (let i = 0; i < expected.length; i++) {
            if (headers[i].trim() !== expected[i]) {
                return false;
            }
        }
        return true;
    }

    // Funció per parsejar una fila CSV tenint en compte possibles cometes
    function parseCSVRow(text) {
        let result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }
});