import fs from 'fs';

const endpoint = 'https://tagatuba.sepised.com/graphql';

const query = `
query GetMediaSizes {
  mediaItems(first: 5) {
    nodes {
      id
      title
      sourceUrl
      mediumUrl: sourceUrl(size: MEDIUM)
      largeUrl: sourceUrl(size: LARGE)
      mediaDetails {
        sizes {
          name
          sourceUrl
          width
          height
        }
      }
    }
  }
}
`;

async function fetchSizes() {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        fs.writeFileSync('graphql_sizes.json', JSON.stringify(data, null, 2));
        console.log('Successfully fetched sizes. Saved to graphql_sizes.json.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchSizes();
