import fs from 'fs';

async function fetchMoreRestAPI() {
    try {
        const res = await fetch('https://tagatuba.sepised.com/wp-json/wp/v2/media?per_page=50');
        const data = await res.json();

        // Find any media that has acf not empty
        const withAcf = data.filter(d => d.acf && Object.keys(d.acf).length > 0);
        fs.writeFileSync('rest_media_acf.json', JSON.stringify(withAcf, null, 2));
        console.log('Saved media with ACF:', withAcf.length);

        const res2 = await fetch('https://tagatuba.sepised.com/wp-json/wp/v2/categories?per_page=50');
        if (res2.ok) {
            const data2 = await res2.json();
            const withAcf2 = data2.filter(d => d.acf && Object.keys(d.acf).length > 0);
            fs.writeFileSync('rest_cat_acf.json', JSON.stringify(withAcf2.length > 0 ? withAcf2 : data2, null, 2));
            console.log('Saved categories with/without ACF:', data2.length);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchMoreRestAPI();
