<?php
/**
 * The header for our theme
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>

    
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>
<div id="page" class="site">

    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'ideal-magazine' ); ?></a>

    <div id="loader" class="loader-1">
        <div class="loader-container">
            <div id="preloader"></div>
        </div>
    </div>

    <header id="masthead" class="site-header">
		
    <div class="topbar">
    <div class="topbar-container">
        <!-- Left Side: Contact Information -->
        <div class="topbar-left">
            <span><i class="fa-solid fa-phone"></i> <a href="tel:+919448931215">+91 94489 31215</a></span>
            <span><i class="fa-solid fa-envelope"></i> <a href="mailto:padyanatemple@gmail.com">padyanatemple@gmail.com</a></span>
            <span><i class="fa-solid fa-location-dot"></i> <a href="https://maps.app.goo.gl/E6UAdHtZ8QUUc4up6" target="_blank">Our Location</a></span>
        </div>

        <!-- Right Side: Social Media Links -->
        <div class="topbar-right">
            <ul class="social-menu">
                <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                <li><a href="#"><i class="fa-brands fa-twitter"></i></a></li>
                <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                <li><a href="#"><i class="fa-brands fa-youtube"></i></a></li>
            </ul>
        </div>
    </div>
</div>

<header class="main-header">
    <div class="header-container">
        <!-- Left Decorative Image -->
        <div class="header-image header-left">
            <img src="<?php echo get_template_directory_uri(); ?>/images/left-design.png" alt="Left Decoration">
            <div class="header-logo">
                <img src="<?php echo get_template_directory_uri(); ?>/images/logo.png" alt="Site Logo">
            </div>
        </div>

        <!-- Center Content: Logo, Title & Subtitle -->
        <div class="header-content">
            <div class="header-text">
                <h1 class="main-title">MAHALINGESWARA TEMPLE</h1>
                <p class="subtitle">Karopadi Post and Village, Bantwal Taluk - 574279</p>
            </div>
        </div>
        <button class="donate-button" onclick="showDonatePopup()">Donate ❤</button>
        <!-- Right Decorative Image -->
        <div class="header-image header-right">
            <img src="<?php echo get_template_directory_uri(); ?>/images/right-design.png" alt="Right Decoration">
            </div>
            <!-- Donate Button Centered in Right Image -->
    </div>
</header>

<!-- 🌟 Navigation Menu Below Header -->
<div class="header_menu">


    <div class="header-menu-container">
        <nav class="header-navigation">
            <div class='hamberger'>
        <p class='menu_word'> MENU</p>
        <button class="menu-toggle" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
    </button>
</div>
            <?php
            wp_nav_menu(array(
                'theme_location' => 'header-menu',
                'menu_class' => 'header-menu',
                'container' => false,
                'depth' => 2, // Allows submenus
                'fallback_cb' => false,
                'walker' => new Custom_Nav_Walker() // Custom walker for dropdowns
            ));
            ?>
        </nav>
    </div>
</div>





<script>
function showDonatePopup() {
    document.getElementById("donation-overlay").style.display = "flex";
}

function closeDonatePopup() {
    document.getElementById("donation-overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const dropdowns = document.querySelectorAll(".header-menu li.menu-item-has-children > a");

    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior
            const submenu = this.nextElementSibling;

            if (submenu.style.display === "block") {
                submenu.style.display = "none";
            } else {
                submenu.style.display = "block";
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const menuContainer = document.querySelector(".header-menu-container");

    if (menuToggle && menuContainer) {
        menuToggle.addEventListener("click", function () {
            menuContainer.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    // Dropdown Toggle for Mobile
    document.querySelectorAll(".menu-item-has-children > a").forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            let submenu = this.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle("submenu-active");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item-has-children");

    menuItems.forEach((menuItem) => {
        const submenu = menuItem.querySelector(".sub-menu");

        if (submenu) {
            menuItem.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation(); // Stop event from propagating to parent elements

                // Close other submenus before opening a new one
                menuItems.forEach((item) => {
                    if (item !== menuItem) {
                        item.classList.remove("active");
                        const sub = item.querySelector(".sub-menu");
                        if (sub) sub.classList.remove("submenu-active");
                    }
                });

                // Toggle active class on clicked menu item
                menuItem.classList.toggle("active");

                // Toggle submenu visibility
                submenu.classList.toggle("submenu-active");
            });

            // Prevent submenu from closing when clicking inside it
            submenu.addEventListener("click", function (event) {
                event.stopPropagation();
            });
        }
    });

    // Close submenu when clicking outside
    document.addEventListener("click", function (event) {
        menuItems.forEach((item) => {
            if (!item.contains(event.target)) {
                item.classList.remove("active");
                const submenu = item.querySelector(".sub-menu");
                if (submenu) submenu.classList.remove("submenu-active");
            }
        });
    });
});

</script>



<?php wp_footer(); ?>
</body>
</html>
