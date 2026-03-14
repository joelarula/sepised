import fs from 'fs';

const endpoint = 'https://tagatuba.sepised.com/graphql';

const query = `
query GetCategories {
  categories {
    nodes {
      id
      databaseId
      name
      slug
      mediaFiles {
        category {
          nodes {
            id
            name
          }
        }
        price
        titleEn
        titleRu
      }
    }
  }
}
`;

async function fetchCategories() {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        fs.writeFileSync('graphql_cat_data.json', JSON.stringify(data, null, 2));
        console.log('Successfully fetched categories. Saved to graphql_cat_data.json.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchCategories();
