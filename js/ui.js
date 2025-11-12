function displayIngredientLibrary() {
    filterIngredients();
}

function renderIngredients() {
    const total = dietIngredients.reduce((sum, ing) => sum + ing.percentage, 0);
    const html = dietIngredients.map((ing, idx) => `
        <div class="ingredient-item">
            <span class="ingredient-name">${ing.name}</span>
            <input type="number" value="${ing.percentage}" min="0" max="100" step="0.1" 
                onchange="dietIngredients[${idx}].percentage = parseFloat(this.value); renderIngredients();"
                style="text-align: center;">
            <span style="text-align: center; font-weight: 600; color: #667eea;">%</span>
            <span style="text-align: center; font-size: 0.85em; color: #7f8c8d;">PB: ${ing.pb.toFixed(1)}%</span>
            <button class="danger" onclick="dietIngredients.splice(${idx}, 1); renderIngredients();">✕ Remover</button>
        </div>
    `).join('');
    document.getElementById('ingredientsList').innerHTML = html;
    document.getElementById('noIngredientsMsg').style.display = dietIngredients.length === 0 ? 'block' : 'none';
    if (dietIngredients.length > 0) {
        const validationMsg = document.createElement('div');
        validationMsg.style.marginTop = '10px';
        validationMsg.style.fontSize = '0.9em';
        if (Math.abs(total - 100) < 0.1) {
            validationMsg.innerHTML = '<div class="success-box">✓ Suma de ingredientes = 100%</div>';
        } else if (total > 100) {
            validationMsg.innerHTML = `<div class="warning-box">⚠️ Suma: ${total.toFixed(1)}% (exceso de ${(total - 100).toFixed(1)}%)</div>`;
        } else {
            validationMsg.innerHTML = `<div class="warning-box">⚠️ Suma: ${total.toFixed(1)}% (falta ${(100 - total).toFixed(1)}%)</div>`;
        }
        document.getElementById('ingredientsList').appendChild(validationMsg);
    }
}

function generateNutritionResults(data) {
    const { pb, em, enl, ca, p, ms, dailyIntake } = data;
    const html = `
        <table>
            <tr>
                <th>Parámetro</th>
                <th>Valor</th>
                <th>Estado</th>
            </tr>
            <tr>
                <td><strong>PB (%)</strong></td>
                <td>${pb.toFixed(1)}</td>
                <td><span class="status-badge status-ok">✓ Óptimo</span></td>
            </tr>
            <tr>
                <td><strong>EM (Mcal/kg)</strong></td>
                <td>${em.toFixed(2)}</td>
                <td><span class="status-badge status-ok">✓ Óptimo</span></td>
            </tr>
            <tr>
                <td><strong>Ca:P</strong></td>
                <td>${(ca / p).toFixed(2)}</td>
                <td><span class="status-badge status-ok">✓ Balanceado</span></td>
            </tr>
        </table>
    `;
    document.getElementById('nutritionResults').innerHTML = html;
}

function generateCompositionResults(dailyIntake) {
    const html = `
        <table>
            <tr>
                <th>Ingrediente</th>
                <th>%</th>
                <th>kg/día</th>
                <th>PB %</th>
            </tr>
            ${dietIngredients.map(ing => `
                <tr>
                    <td>${ing.name}</td>
                    <td style="text-align: center;">${ing.percentage.toFixed(1)}</td>
                    <td style="text-align: right;">${(ing.percentage / 100 * dailyIntake).toFixed(2)}</td>
                    <td style="text-align: right;">${ing.pb.toFixed(1)}</td>
                </tr>
            `).join('')}
        </table>
    `;
    document.getElementById('compositionResults').innerHTML = html;
}

function generateRecommendations(data) {
    const recs = [];
    if (data.fiber < 18) recs.push('⚠️ Fibra baja. Aumenta inclusión de forrajes');
    if (data.fiber > 28) recs.push('💡 Fibra muy alta. Podría afectar digestibilidad');
    if (Math.abs(data.ca / data.p - 1.5) > 0.3) recs.push('⚠️ Ratio Ca:P desbalanceado');
    if (recs.length === 0) recs.push('✅ Formulación balanceada y óptima');
    const html = `<div>${recs.map(r => `<div style="padding: 8px 0; border-bottom: 1px solid #ecf0f1;">${r}</div>`).join('')}</div>`;
    document.getElementById('recommendationsResults').innerHTML = html;
}