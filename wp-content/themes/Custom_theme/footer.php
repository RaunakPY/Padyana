<?php
/**
 * The footer for our theme
 */
?>
<footer style="background-color: #661919; color: #fff; padding: 0; margin: 0;">

    <!-- Smart Slider 3 -->
    <div style="display: flex; justify-content: center; align-items: center; padding: 30px 0; margin: 0;">
        <?php echo do_shortcode('[smartslider3 slider="6"]'); ?>
    </div>

    <!-- Navigation Menu (Main Items Only) -->
    <nav style="text-align: center; margin-bottom: 15px;">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'header-menu',
            'depth' => 1, // Only top-level menu items
            'container' => false,
            'menu_class' => 'footer-menu',
            'link_before' => '<span class="footer-link">',
            'link_after' => '</span>',
        ));
        ?>
    </nav>

    <!-- Copyright -->
    <div style="text-align: center; padding-bottom: 15px; font-size: 14px;">
        <p>Copyright © <?php echo date("Y"); ?> MAHALINGESWARA TEMPLE - All Rights Reserved.</p>
    </div>

</footer>

<!-- Custom Footer Styles -->
<style>
.footer-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-menu li {
    display: inline;
}

.footer-menu li a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
    font-size: 16px;
}

.footer-menu li a:hover {
    color: #f0c040; /* Golden hover effect */
}

/* Responsive: Increase spacing for devices up to 800px */
@media (max-width: 800px) {
    .footer-menu {
        gap: 20px; /* Increase space between items */
		justify-content: center;
    
    }

    .footer-menu li a {
        font-size: 18px; /* Optional: slightly bigger text for small screens */
    }
}
</style>
