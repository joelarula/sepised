import fs from 'fs';

const schemaStr = fs.readFileSync('schema.json', 'utf-8');
const schema = JSON.parse(schemaStr);

const types = schema.data.__schema.types;

const interestingTypes = ['MediaItem', 'Category', 'Post', 'Tag'];

const extracted = {};

for (const t of types) {
    if (interestingTypes.includes(t.name) || t.name.includes('Acf') || t.name.includes('ACF')) {
        extracted[t.name] = t.fields ? t.fields.map(f => f.name) : (t.enumValues ? t.enumValues.map(e => e.name) : []);
    }
}

fs.writeFileSync('extracted.json', JSON.stringify(extracted, null, 2));
console.log('Extracted ' + Object.keys(extracted).length + ' types.');
