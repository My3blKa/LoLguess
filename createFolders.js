const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'audio'); 
const result = {};

const champFolders = fs.readdirSync(audioDir);

champFolders.forEach(champ => {
    const champPath = path.join(audioDir, champ);
    const files = fs.readdirSync(champPath).filter(f => f.endsWith('.m4a'));
    
    result[champ] = {
        quotes: files.map(file => ({
            audio_en: `audio/${champ}/${file}`,
            audio_ru: `audio/${champ}/${file}`,
            text_ru: '',
            text_en: ''
        }))
    };
});

fs.writeFileSync('./data/quotes.json', JSON.stringify(result, null, 4), 'utf-8');
console.log('quotes.json создан!');