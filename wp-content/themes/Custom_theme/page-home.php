<?php get_header(); ?> <!-- Includes the header -->

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            the_content(); // Displays content from the WordPress editor
        endwhile;
    else :
        echo '<p>No content found.</p>';
    endif;
    ?>
</main>

<?php get_footer(); ?> <!-- Includes the footer -->
