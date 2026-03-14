import fs from 'fs';

const endpoint = 'https://tagatuba.sepised.com/graphql';

const query = `
query GetMediaItems {
  mediaItems(first: 10) {
    nodes {
      id
      title
      mediaItemUrl
      # Trying to guess typical ACF fields or querying __typename
      __typename
    }
  }
}
`;

async function fetchSchema() {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
          query IntrospectionQuery {
            __schema {
              types {
                name
                kind
                description
                fields {
                  name
                }
              }
            }
          }
        `
            })
        });
        const data = await res.json();
        fs.writeFileSync('schema.json', JSON.stringify(data, null, 2));
        console.log('Schema saved to schema.json');

        // Also fetch sample data
        const res2 = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data2 = await res2.json();
        fs.writeFileSync('sample.json', JSON.stringify(data2, null, 2));
        console.log('Sample data saved to sample.json');

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchSchema();
