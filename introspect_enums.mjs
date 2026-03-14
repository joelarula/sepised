import fs from 'fs';

const endpoint = 'https://tagatuba.sepised.com/graphql';

const query = `
query IntrospectEnums {
  __type(name: "MediaItemSizeEnum") {
    enumValues {
      name
      description
    }
  }
}
`;

async function introspect() {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        fs.writeFileSync('graphql_enums.json', JSON.stringify(data, null, 2));
        console.log('Successfully introspected enums. Saved to graphql_enums.json.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

introspect();
