function updateAnimalTypes() {
    const species = document.getElementById('species').value;
    const animalTypeSelect = document.getElementById('animalType');
    animalTypeSelect.innerHTML = '<option value="">Seleccionar...</option>';
    if (species && animalTypes[species]) {
        animalTypes[species].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            animalTypeSelect.appendChild(option);
        });
    }
}

function updateRequirements() {
    const species = document.getElementById('species').value;
    const animalType = document.getElementById('animalType').value;
    if (!species || !animalType) return;
    const requirements = nutritionalRequirements[species][animalType];
    if (!requirements) return;
    selectedRequirements = requirements;
    const html = Object.entries(requirements).map(([key, value]) => `
        <div class="requirement-row">
            <strong>${key.toUpperCase()}:</strong>
            <span>${value.toFixed(2)}</span>
        </div>
    `).join('');
    document.getElementById('requirementsList').innerHTML = html;
}

function filterIngredients() {
    const search = document.getElementById('ingredientSearch').value.toLowerCase();
    const region = document.getElementById('ingredientRegion').value;
    const filtered = ingredientLibrary.filter(ing =>
        (ing.name.toLowerCase().includes(search) || ing.category.toLowerCase().includes(search)) &&
        (region === '' || ing.region === '' || ing.region === region)
    );
    const html = filtered.map(ing => `
        <div class="library-item" onclick="addIngredient('${ing.name}', ${ing.pb}, ${ing.em}, ${ing.enl}, ${ing.ca}, ${ing.p}, ${ing.ms}, ${ing.fiber})">
            <strong>${ing.name}</strong>
            <small>PB: ${ing.pb.toFixed(1)}% | EM: ${ing.em.toFixed(2)} Mcal/kg</small>
        </div>
    `).join('');
    document.getElementById('ingredientLibrary').innerHTML = html || '<div class="library-item" style="cursor: default;">No se encontraron ingredientes</div>';
}

function addIngredient(name, pb, em, enl, ca, p, ms, fiber) {
    const existing = dietIngredients.find(i => i.name === name);
    if (!existing) {
        dietIngredients.push({ name, pb, em, enl, ca, p, ms, fiber, percentage: 5 });
        renderIngredients();
    }
}

function calculateNutrition() {
    if (dietIngredients.length === 0) {
        alert('⚠️ Agrega ingredientes primero');
        return;
    }
    const total = dietIngredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(total - 100) > 0.5) {
        alert(`⚠️ La suma de ingredientes debe ser 100% (actual: ${total.toFixed(1)}%)`);
        return;
    }
    const dailyIntake = parseFloat(document.getElementById('dailyIntake').value) || 10;
    let pb = 0, em = 0, enl = 0, ca = 0, p = 0, ms = 0, fiber = 0;
    dietIngredients.forEach(ing => {
        const pct = ing.percentage / 100;
        pb += ing.pb * pct;
        em += ing.em * pct;
        enl += ing.enl * pct;
        ca += ing.ca * pct;
        p += ing.p * pct;
        ms += ing.ms * pct;
        fiber += ing.fiber * pct;
    });
    generateNutritionResults({ pb, em, enl, ca, p, ms, dailyIntake });
    generateCompositionResults(dailyIntake);
    generateRecommendations({ pb, em, enl, ca, p, ms, fiber });
    document.getElementById('resultsContainer').classList.remove('hidden');
}

function clearForm() {
    if (confirm('¿Limpiar todo el formulario?')) {
        document.getElementById('species').value = '';
        document.getElementById('animalType').innerHTML = '<option value="">Seleccionar...</option>';
        document.getElementById('weight').value = '';
        document.getElementById('dailyIntake').value = '10';
        dietIngredients = [];
        renderIngredients();
        document.getElementById('resultsContainer').classList.add('hidden');
        selectedRequirements = {};
    }
}

function loadExampleDiet() {
    document.getElementById('species').value = 'bovinos';
    updateAnimalTypes();
    setTimeout(() => {
        document.getElementById('animalType').value = 'Vaca Lechera - Producción Media';
        document.getElementById('weight').value = '550';
        document.getElementById('dailyIntake').value = '18';
        updateRequirements();
        dietIngredients = [
            { name: 'Pasto Alemana (fresco)', pb: 2.5, em: 1.8, enl: 0.8, ca: 0.5, p: 0.25, ms: 18, fiber: 35, percentage: 40 },
            { name: 'Maíz Molido', pb: 8.5, em: 3.2, enl: 1.9, ca: 0.02, p: 0.27, ms: 88, fiber: 2, percentage: 30 },
            { name: 'Harina de Soya', pb: 45, em: 2.1, enl: 1.1, ca: 0.2, p: 0.65, ms: 88, fiber: 5, percentage: 20 },
            { name: 'Fosfato Bicálcico', pb: 0, em: 0, enl: 0, ca: 18, p: 21, ms: 100, fiber: 0, percentage: 10 }
        ];
        renderIngredients();
    }, 100);
}

function optimizeDiet() { alert('✨ Función de optimización automática (próxima versión)'); }
function exportPDF() { alert('📄 Exportar a PDF (próxima versión mejorada)'); }
function printReport() { window.print(); }