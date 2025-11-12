let dietIngredients = [];
let selectedRequirements = {};

const ingredientLibrary = [
    { name: 'Pasto Alemana (fresco)', category: 'Forraje', region: 'local', pb: 2.5, em: 1.8, enl: 0.8, ca: 0.5, p: 0.25, ms: 18, fiber: 35 },
    { name: 'Pasto Bermuda', category: 'Forraje', region: 'local', pb: 1.8, em: 1.6, enl: 0.7, ca: 0.3, p: 0.2, ms: 25, fiber: 32 },
    { name: 'Ensilaje de Maíz', category: 'Forraje', region: 'local', pb: 1.2, em: 1.9, enl: 0.9, ca: 0.2, p: 0.15, ms: 35, fiber: 28 },
    { name: 'Heno de Alfalfa', category: 'Forraje', region: 'local', pb: 15, em: 2.1, enl: 1.0, ca: 1.2, p: 0.25, ms: 90, fiber: 35 },
    { name: 'Maíz Molido', category: 'Grano', region: 'local', pb: 8.5, em: 3.2, enl: 1.9, ca: 0.02, p: 0.27, ms: 88, fiber: 2 },
    { name: 'Sorgo', category: 'Grano', region: 'local', pb: 10, em: 3.0, enl: 1.8, ca: 0.03, p: 0.32, ms: 88, fiber: 2 },
    { name: 'Cebada', category: 'Grano', region: 'importado', pb: 11, em: 2.8, enl: 1.6, ca: 0.05, p: 0.38, ms: 88, fiber: 5 },
    { name: 'Harina de Soya', category: 'Proteína', region: 'importado', pb: 45, em: 2.1, enl: 1.1, ca: 0.2, p: 0.65, ms: 88, fiber: 5 },
    { name: 'Harina de Girasol', category: 'Proteína', region: 'local', pb: 32, em: 1.8, enl: 0.9, ca: 0.35, p: 0.7, ms: 88, fiber: 8 },
    { name: 'Pulpa de Remolacha', category: 'Proteína', region: 'importado', pb: 8, em: 2.2, enl: 1.0, ca: 0.8, p: 0.1, ms: 91, fiber: 20 },
    { name: 'Fosfato Bicálcico', category: 'Mineral', region: 'importado', pb: 0, em: 0, enl: 0, ca: 18, p: 21, ms: 100, fiber: 0 },
    { name: 'Sal Común', category: 'Mineral', region: 'local', pb: 0, em: 0, enl: 0, ca: 0, p: 0, ms: 100, fiber: 0 },
];

const nutritionalRequirements = {
    bovinos: {
        'Vaca Lechera - Producción Alta': { pb: 17, em: 2.8, ca: 0.75, p: 0.45 },
        'Vaca Lechera - Producción Media': { pb: 15, em: 2.5, ca: 0.65, p: 0.40 },
        'Vaca Lechera - Producción Baja': { pb: 12, em: 2.2, ca: 0.50, p: 0.30 },
        'Ternero Crecimiento': { pb: 16, em: 2.6, ca: 0.80, p: 0.50 },
        'Novillo Engorde': { pb: 13, em: 2.4, ca: 0.45, p: 0.35 },
        'Toro Reproductor': { pb: 12, em: 2.3, ca: 0.50, p: 0.35 },
    },
    ovinos: {
        'Oveja Lactancia': { pb: 15, em: 2.5, ca: 0.70, p: 0.45 },
        'Oveja Mantenimiento': { pb: 10, em: 2.0, ca: 0.45, p: 0.30 },
        'Cordero Crecimiento': { pb: 14, em: 2.4, ca: 0.75, p: 0.50 },
        'Carnero Reproductor': { pb: 12, em: 2.2, ca: 0.50, p: 0.35 },
    },
    caprinos: {
        'Cabra Lactancia': { pb: 14, em: 2.4, ca: 0.65, p: 0.42 },
        'Cabra Mantenimiento': { pb: 9, em: 1.9, ca: 0.40, p: 0.28 },
        'Cabrito Crecimiento': { pb: 13, em: 2.3, ca: 0.70, p: 0.48 },
        'Macho Reproductor': { pb: 11, em: 2.1, ca: 0.45, p: 0.32 },
    }
};

const animalTypes = {
    bovinos: ['Vaca Lechera - Producción Alta', 'Vaca Lechera - Producción Media', 'Vaca Lechera - Producción Baja', 'Ternero Crecimiento', 'Novillo Engorde', 'Toro Reproductor'],
    ovinos: ['Oveja Lactancia', 'Oveja Mantenimiento', 'Cordero Crecimiento', 'Carnero Reproductor'],
    caprinos: ['Cabra Lactancia', 'Cabra Mantenimiento', 'Cabrito Crecimiento', 'Macho Reproductor']
};