<?php
global $wp_post_types;

switch($event->post_status) :
	case 'publish' :
		// translators: %1$s is the singular name of the listing (e.g., "Event"), and %2$s is the URL to view the listing.
		printf(
			'<p class="post-submitted-success-green-message wpem-alert wpem-alert-success">' .
			esc_html('%1$s listed successfully. To view your listing <a href="%2$s">click here</a>.', 'wp-event-manager') .
			'</p>',
			esc_attr($wp_post_types['event_listing']->labels->singular_name),
			esc_url(get_permalink($event->ID))
		);
		break;
	case 'pending' :
		// translators: %s is the singular name of the listing (e.g., "Event").
		printf('<p class="post-submitted-success-green-message wpem-alert wpem-alert-success">'.esc_attr('%s submitted successfully. Your listing will be visible once approved.', 'wp-event-manager').'</p>', esc_attr($wp_post_types['event_listing']->labels->singular_name), esc_url(get_permalink($event->ID)));
		break;
	default :
		do_action('event_manager_event_submitted_content_' . str_replace('-', '_', sanitize_title($event->post_status)), $event);
		break;

endswitch;

do_action('event_manager_event_submitted_content_after', sanitize_title($event->post_status), $event);