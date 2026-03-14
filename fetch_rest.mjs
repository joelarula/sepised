import fs from 'fs';

async function fetchRestAPI() {
    try {
        const res = await fetch('https://tagatuba.sepised.com/wp-json/wp/v2/media?per_page=5');
        if (!res.ok) {
            console.error("HTTP Error", res.status);
            return;
        }
        const data = await res.json();
        fs.writeFileSync('rest_media.json', JSON.stringify(data, null, 2));
        console.log('Saved WP REST API media response to rest_media.json');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchRestAPI();
