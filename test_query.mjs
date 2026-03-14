import fs from 'fs';

const endpoint = 'https://tagatuba.sepised.com/graphql';

const query = `
query GetPortfolioMedia {
  mediaItems(first: 50) {
    nodes {
      id
      databaseId
      title
      sourceUrl
      mediaFiles {
        category {
          nodes {
            id
            databaseId
            name
            slug
            # let's map translations to name directly if there are any fields here too? 
            # from schema, category doesn't seem to have "mediaFiles" but it might have standard translation if using polylang/wpml maybe?
          }
        }
        price
        titleEn
        titleRu
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

async function fetchPortfolio() {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    fs.writeFileSync('graphql_data.json', JSON.stringify(data, null, 2));
    console.log('Successfully fetched sample data using the constructed query. Saved to graphql_data.json.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchPortfolio();
