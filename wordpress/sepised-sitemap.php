<?php
/**
 * Plugin Name: Sepised Headless Sitemap
 * Description: Generates sitemap.xml for the headless Vue frontend at www.sepised.com
 * Version: 1.0
 * Author: Jaani Sepikoda
 *
 * Install: Copy this file to wp-content/plugins/ and activate.
 * Sitemap URL: https://tagatuba.sepised.com/?sepised-sitemap=1
 * Point your frontend sitemap URL (www.sepised.com/sitemap.xml) here via redirect/proxy.
 */

if (!defined('ABSPATH')) exit;

// The frontend domain where the Vue SPA is hosted
define('SEPISED_FRONTEND_URL', 'https://www.sepised.com');

// Supported languages
define('SEPISED_LANGUAGES', ['et', 'en', 'ru']);

// Default language
define('SEPISED_DEFAULT_LANG', 'et');

/**
 * Intercept ?sepised-sitemap=1 requests and serve XML sitemap
 * Uses get_query_var() so it works both with direct ?sepised-sitemap=1
 * and the /sitemap.xml rewrite rule
 */
add_action('template_redirect', function () {
    if (!get_query_var('sepised-sitemap')) return;

    header('Content-Type: application/xml; charset=UTF-8');
    header('X-Robots-Tag: noindex'); // Sitemap itself shouldn't be indexed

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
    echo '        xmlns:xhtml="http://www.w3.org/1999/xhtml"' . "\n";
    echo '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

    $base = rtrim(SEPISED_FRONTEND_URL, '/');
    $langs = SEPISED_LANGUAGES;

    // --- Static pages ---
    $static_paths = [
        '',             // home
        '/portfolio',   // portfolio
        '/contact',     // contact
    ];

    foreach ($static_paths as $path) {
        foreach ($langs as $lang) {
            $url = $base . '/' . $lang . $path;
            echo "  <url>\n";
            echo "    <loc>" . esc_url($url) . "</loc>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "    <priority>" . ($path === '' ? '1.0' : '0.8') . "</priority>\n";

            // hreflang alternates
            foreach ($langs as $alt_lang) {
                $alt_url = $base . '/' . $alt_lang . $path;
                echo '    <xhtml:link rel="alternate" hreflang="' . esc_attr($alt_lang) . '" href="' . esc_url($alt_url) . '" />' . "\n";
            }

            echo "  </url>\n";
        }
    }

    // --- Collect categories ---
    $categories = get_terms([
        'taxonomy'   => 'category',
        'hide_empty' => true,
    ]);

    $cat_slugs = [];
    if (!is_wp_error($categories)) {
        foreach ($categories as $cat) {
            $cat_slugs[] = $cat->slug;

            // Category page URL: /:lang/portfolio?category=slug
            foreach ($langs as $lang) {
                $url = $base . '/' . $lang . '/portfolio?category=' . urlencode($cat->slug);
                echo "  <url>\n";
                echo "    <loc>" . esc_url($url) . "</loc>\n";
                echo "    <changefreq>weekly</changefreq>\n";
                echo "    <priority>0.7</priority>\n";

                foreach ($langs as $alt_lang) {
                    $alt_url = $base . '/' . $alt_lang . '/portfolio?category=' . urlencode($cat->slug);
                    echo '    <xhtml:link rel="alternate" hreflang="' . esc_attr($alt_lang) . '" href="' . esc_url($alt_url) . '" />' . "\n";
                }

                echo "  </url>\n";
            }
        }
    }

    // --- Portfolio items (media attachments with categories) ---
    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];

    $media_query = new WP_Query($args);

    if ($media_query->have_posts()) {
        while ($media_query->have_posts()) {
            $media_query->the_post();
            $post_id = get_the_ID();
            $slug = get_post_field('post_name', $post_id);

            if (empty($slug)) continue;

            // Get categories for this media item
            $item_cats = wp_get_post_terms($post_id, 'category', ['fields' => 'slugs']);
            if (is_wp_error($item_cats) || empty($item_cats)) {
                // No category — use first available or skip
                continue;
            }

            $cat_slug = $item_cats[0]; // Primary category for the URL

            // Get modification date for lastmod
            $modified = get_the_modified_date('c', $post_id);

            // Get image URL
            $image_url = wp_get_attachment_url($post_id);

            // Get title and description
            $title = get_the_title($post_id);
            $caption = get_post_field('post_excerpt', $post_id);
            $description = get_post_field('post_content', $post_id);

            // Get ACF multilingual fields if available
            $acf_et = function_exists('get_field') ? get_field('et', $post_id) : '';
            $acf_en = function_exists('get_field') ? get_field('en', $post_id) : '';
            $acf_ru = function_exists('get_field') ? get_field('ru', $post_id) : '';

            // Get all category names for this item
            $item_cat_names = wp_get_post_terms($post_id, 'category', ['fields' => 'names']);
            $cat_label = (!is_wp_error($item_cat_names) && !empty($item_cat_names))
                ? implode(', ', $item_cat_names) : '';

            foreach ($langs as $lang) {
                $url = $base . '/' . $lang . '/portfolio/' . urlencode($cat_slug) . '/' . urlencode($slug);
                echo "  <url>\n";
                echo "    <loc>" . esc_url($url) . "</loc>\n";
                if ($modified) {
                    echo "    <lastmod>" . esc_html($modified) . "</lastmod>\n";
                }
                echo "    <changefreq>monthly</changefreq>\n";
                echo "    <priority>0.6</priority>\n";

                // hreflang alternates
                foreach ($langs as $alt_lang) {
                    $alt_url = $base . '/' . $alt_lang . '/portfolio/' . urlencode($cat_slug) . '/' . urlencode($slug);
                    echo '    <xhtml:link rel="alternate" hreflang="' . esc_attr($alt_lang) . '" href="' . esc_url($alt_url) . '" />' . "\n";
                }

                // Image metadata (Google Image Sitemap extension)
                if ($image_url) {
                    echo "    <image:image>\n";
                    echo "      <image:loc>" . esc_url($image_url) . "</image:loc>\n";

                    // Language-specific caption
                    $lang_desc = '';
                    if ($lang === 'et' && !empty($acf_et)) $lang_desc = $acf_et;
                    elseif ($lang === 'en' && !empty($acf_en)) $lang_desc = $acf_en;
                    elseif ($lang === 'ru' && !empty($acf_ru)) $lang_desc = $acf_ru;

                    // Title: use post title + categories
                    $image_title = $title;
                    if (!empty($cat_label)) {
                        $image_title .= ' — ' . $cat_label;
                    }
                    if (!empty($image_title)) {
                        echo "      <image:title>" . esc_html($image_title) . "</image:title>\n";
                    }

                    // Caption: prefer language-specific ACF field, fall back to excerpt/description
                    $image_caption = $lang_desc ?: ($caption ?: $description);
                    if (!empty($image_caption)) {
                        echo "      <image:caption>" . esc_html(wp_strip_all_tags($image_caption)) . "</image:caption>\n";
                    }

                    echo "    </image:image>\n";
                }

                echo "  </url>\n";
            }

        }
        wp_reset_postdata();
    }

    echo "</urlset>\n";
    exit;
});

/**
 * Register a rewrite rule so the sitemap can be accessed at /sitemap.xml
 * on the WordPress domain (tagatuba.sepised.com/sitemap.xml)
 */
add_action('init', function () {
    add_rewrite_rule('^sitemap\.xml/?$', 'index.php?sepised-sitemap=1', 'top');
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'sepised-sitemap';
    return $vars;
});

/**
 * Flush rewrite rules on plugin activation
 */
register_activation_hook(__FILE__, function () {
    add_rewrite_rule('^sitemap\.xml/?$', 'index.php?sepised-sitemap=1', 'top');
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});
