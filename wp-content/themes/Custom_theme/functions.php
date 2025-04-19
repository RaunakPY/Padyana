<?php
// Prevent direct access to this file
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 🌟 Enqueue Styles & Scripts
function custom_theme_enqueue_assets() {
    // Load Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css', array(), null);

    // Load Theme Stylesheet
    wp_enqueue_style('custom-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
}

// Hook function to enqueue styles and scripts
add_action('wp_enqueue_scripts', 'custom_theme_enqueue_assets');

// 🌟 Register Navigation Menus
function custom_theme_setup() {
    // Register header menu
    register_nav_menus(array(
        'header-menu' => __('Header Menu', 'custom-theme'),
    ));
}
add_action('after_setup_theme', 'custom_theme_setup');

class Custom_Nav_Walker extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = NULL, $id = 0) {
        $class_names = !empty($item->classes) ? implode(' ', $item->classes) : '';
        $has_children = in_array('menu-item-has-children', $item->classes);
        
        $output .= '<li class="' . esc_attr($class_names) . '">';

        $output .= '<a href="' . esc_url($item->url) . '">';
        $output .= esc_html($item->title);
        
        // Add dropdown arrow if the item has children
        if ($has_children) {
            $output .= ' <span class="dropdown-arrow">▼</span>';
        }

        $output .= '</a>';
    }
}

function custom_menu_scripts() {
    wp_enqueue_script('jquery'); // Load jQuery
    wp_enqueue_script('custom-menu-js', get_template_directory_uri() . '/js/custom-menu.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'custom_menu_scripts');



function enqueue_event_styles_based_on_page() {
    if (is_front_page() || is_home()) {
        wp_enqueue_style('event-home-style', get_template_directory_uri() . '/css/event-home.css');
    } elseif (is_page('invitation')) { // Change 'invitation' to your actual page slug or condition
        wp_enqueue_style('event-invitation-style', get_template_directory_uri() . '/css/event-invitation.css');
    }
}
add_action('wp_enqueue_scripts', 'enqueue_event_styles_based_on_page');


function enqueue_event_scripts_based_on_page() {
    if (is_front_page() || is_home()) {
        wp_enqueue_script('event-home-script', get_template_directory_uri() . '/js/event-home.js', array('jquery'), null, true);
    } 
}
add_action('wp_enqueue_scripts', 'enqueue_event_scripts_based_on_page');


function display_upcoming_events($atts) {
    $atts = shortcode_atts(array(
        'page' => '', // Default is empty
    ), $atts, 'events_section');

    if (!function_exists('tribe_get_events')) {
        return '<p>The Events Calendar plugin is not active.</p>';
    }

	
    // Get upcoming events
    $events = tribe_get_events(array(
        'posts_per_page' => -1, // Fetch all events
        'eventDisplay'   => 'all', // Get past, present, and future events
        'order'          => 'ASC', // Order by ascending date
    ));
    
    ob_start(); // Start output buffering
    ?>

    <section class="event-section">
        <div class="event-container">
            <div class="event-wrapper">
                <?php if (!empty($events)) : ?>
                    <?php foreach ($events as $event) : ?>
                        <div class="event-block">
                            <h3><?php echo esc_html(get_the_title($event)); ?></h3>
                            <p><strong>Date:</strong> <?php echo esc_html(tribe_get_start_date($event, false, 'F j, Y g:i A')); ?></p>
                            <p><?php echo wp_trim_words(get_the_excerpt($event), 20); ?></p>
                            <a href="<?php echo esc_url(get_permalink($event)); ?>" class="event-link">View Details</a>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <p>No upcoming events found.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>


    <?php
    return ob_get_clean(); // Return buffered output
}
add_shortcode('events_section', 'display_upcoming_events');

function add_google_fonts() {
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,500;1,500&display=swap', false);
}
add_action('wp_enqueue_scripts', 'add_google_fonts');



?>
