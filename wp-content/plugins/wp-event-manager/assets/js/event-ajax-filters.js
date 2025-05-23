var EventAjaxFilters = function() {
    var supportHtml5History;
    var xmlHttpRequest = [];
    return {
        init: function() {
            Common.logInfo("EventAjaxFilters.init...");
            jQuery('#search_fromdate, #search_todate').each(function() {
                var dateFormat = jQuery(this).attr('data-date-format') || 'mm/dd/yy';
        
                jQuery(this).datepicker({
                    dateFormat: dateFormat.replace('yy', 'yy').replace('mm', 'mm').replace('dd', 'dd'),
                    changeMonth: true,
                    changeYear: true
                });
            });
            // After deactivate calendar addon load box layout as default 
            if(localStorage.getItem("layout")==="calendar-layout" ){
				jQuery('.event_listings').on('update_event_listings', EventAjaxFilters.actions.getEventListings);
				jQuery("#wpem-event-box-layout").addClass("wpem-active-layout");
				localStorage.setItem("layout", "box-layout"); 
			}

            jQuery("#wpem-event-filter-version-2-filter-action").click(function(){
                jQuery("#wpem-event-filter-version-2-dropdown").toggle();
            });

            if (jQuery(".showing_applied_filters").hasClass("showing-applied-filters")) {
                jQuery(".showing_applied_filters").show();
            }else{
                jQuery(".showing_applied_filters").hide();
            }

            //set datepicker default range 
            var form = jQuery(this).closest('form');
            form.find(':input[name^="search_datetimes"]').not(':input[type="hidden"]').val(0).trigger('chosen:updated');

            //more filters
             if (jQuery('.wpem-search-event-more-filter').length > 0) {
                //hide advance filter
                jQuery('.wpem-event-advance-filter').hide();
                jQuery('.wpem-search-event-more-filter').on('click',function(){
                    jQuery('.wpem-event-advance-filter').slideToggle( "slow");
                })
             }
             
            if (jQuery.isFunction(jQuery.fn.chosen)) {
                if (event_manager_ajax_filters.is_rtl == 1) {
                    jQuery('select[name^="search_datetimes"]').addClass('chosen-rtl');
                    jQuery('select[name^="search_categories"]').addClass('chosen-rtl');
                    jQuery('select[name^="search_event_types"]').addClass('chosen-rtl');
                    jQuery('select[name^="search_ticket_prices"]').addClass('chosen-rtl')
                }
                jQuery('select[name^="search_datetimes"]').chosen({
                    search_contains: true
                });
                jQuery('select[name^="search_categories"]').chosen({
                    search_contains: true
                });
                jQuery('select[name^="search_event_types"]').chosen({
                    search_contains: true
                });
                jQuery('select[name^="search_ticket_prices"]').chosen({
                    search_contains: true
                })
            }
            if (window.history && window.history.pushState) {
                supportHtml5History = true
            } else {
                supportHtml5History = false
            }
            jQuery(document).ready(EventAjaxFilters.actions.windowLoad);
            jQuery(document.body).on('click', '.load_more_upcoming_events', EventAjaxFilters.actions.loadMoreUpcomingEvents);
            jQuery(document.body).on('click', '.load_more_events', EventAjaxFilters.actions.loadMoreEvents);
            jQuery('#event_filters').on('click', '.reset', EventAjaxFilters.actions.eventAjaxFiltersReset); 
            jQuery('div.event_listings_main').on('click', '.event-manager-pagination a', EventAjaxFilters.actions.eventPagination);
            // jQuery('.event_listings').on('update_event_listings', EventAjaxFilters.actions.getEventListings);
           
            jQuery('.wpem-event-filter-version-2-search-btn').change(function() {
                var target = jQuery(this).closest('div.event_listings');
                target.triggerHandler('update_event_listings', [1, false]);
                EventAjaxFilters.actions.event_manager_store_state(target, 1)
            }).on("click", function(e) {
                jQuery("#wpem-event-filter-version-2-dropdown").toggle(false);
                EventAjaxFilters.actions.getEventListings(e);
                if (e.which === 13) {
                    jQuery(this).trigger('change')
                }
            });
            jQuery('#search_keywords, #search_location, #search_datetimes, #search_categories, #search_event_types, #search_ticket_prices, .event-manager-filter').change(function() {
                var target = jQuery(this).closest('div.event_listings');
                target.triggerHandler('update_event_listings', [1, false]);
                EventAjaxFilters.actions.event_manager_store_state(target, 1)
            }).on("change", function(e) {
                EventAjaxFilters.actions.getEventListings(e);
                if (e.which === 13) {
                    jQuery(this).trigger('change')
                }
            });
        },
        
        actions: {
            event_manager_store_state: function(target, page) {
           
                Common.logInfo("EventAjaxFilters.event_manager_store_state...");
                var location = document.location.href.split('#')[0];
                var url = document.location.href;
                if (url.match(/\/page\/\d+/)) {
                    url = url.replace(/(\/page\/)\d+/, '/page/' + page);
                    }else{
                    if (url.endsWith('/')) {
                        url += 'page/' + page;
                    }else{
                        url += '/page/' + page;
                    }
                }
               
                if (supportHtml5History) {
                    var form = target.find('.event_filters');
                    var data = jQuery(form).serialize();
                    var index = jQuery('div.event_listings').index(target);
                    window.history.replaceState({
                        id: 'event_manager_state',
                        page: page,
                        data: data,
                        index: index
                    }, '',location)
                }
            },
            windowLoad: function(event) {
                Common.logInfo("EventAjaxFilters.actions.windowLoad...");
                jQuery('.event_filters').each(function() {
                    var target = jQuery(this).closest('div.event_listings');
                    var form = target.find('.event_filters');
                    var inital_page = 1;
                    var index = jQuery('div.event_listings').index(target);
                    if (window.history.state && window.location.hash) {
                        var state = window.history.state;
                        if (state.id && 'event_manager_state' === state.id && index == state.index) {
                           //set initial_page with 1 on page refresh
                            inital_page = 1;
                            form.deserialize(state.data);
                            form.find(':input[name^="search_datetimes"]').not(':input[type="hidden"]').trigger('chosen:updated');
                            form.find(':input[name^="search_categories"]').not(':input[type="hidden"]').trigger('chosen:updated');
                            form.find(':input[name^="search_event_types"]').not(':input[type="hidden"]').trigger('chosen:updated');
                            form.find(':input[name^="search_ticket_prices"]').not(':input[type="hidden"]').trigger('chosen:updated')
                        }
                    }
                    target.triggerHandler('update_event_listings', [inital_page, false])
                });
            },
            eventAjaxFiltersReset: function(event) {
                Common.logInfo("EventAjaxFilters.actions.eventAjaxFiltersReset...");
                
                var target = jQuery(this).closest('div.event_listings');
                var form = jQuery(this).closest('form');
                form.find(':input[name="search_keywords"], :input[name="search_location"], .event-manager-filter').not(':input[type="hidden"]').val('').trigger('chosen:updated');
                form.find(':input[name^="search_fromdate"]').not(':input[type="hidden"]').val('').trigger('chosen:updated');
                form.find(':input[name^="search_todate"]').not(':input[type="hidden"]').val('').trigger('chosen:updated');
                form.find(':input[name^="search_datetimes"]').not(':input[type="hidden"]').val('').trigger('chosen:updated');
                form.find(':input[name^="search_categories"]').not(':input[type="hidden"]').val('').trigger('chosen:updated');
                form.find(':input[name^="search_event_types"]').not(':input[type="hidden"]').val(0).trigger('chosen:updated');
                form.find(':input[name^="search_ticket_prices"]').not(':input[type="hidden"]').val(0).trigger('chosen:updated');
                target.triggerHandler('reset');
                target.triggerHandler('update_event_listings', [1, false]);
                jQuery('.event_listings').on('update_event_listings', EventAjaxFilters.actions.getEventListings);
                EventAjaxFilters.actions.event_manager_store_state(target, 1);
                return false;
                event.preventDefault()
            },
            loadMoreEvents: function(event) {
                //Common.logInfo("EventAjaxFilters.actions.loadMoreEvents...");
                jQuery('.event_listings').on('update_event_listings', EventAjaxFilters.actions.getEventListings);
                var target = jQuery(this).closest('div.event_listings');
                var page = parseInt(jQuery(this).data('page') || 1);
                var loading_previous = false;
                jQuery(this).parent().addClass('wpem-loading');               
                page = page + 1;
                jQuery(this).data('page', page);
                EventAjaxFilters.actions.event_manager_store_state(target, page);
                target.triggerHandler('update_event_listings', [page, true, loading_previous]);
                return false;
                event.preventDefault()
            },
            eventPagination: function(event) {
                Common.logInfo("EventAjaxFilters.actions.eventPagination...");
                var target = jQuery(this).closest('div.event_listings');
                var page = jQuery(this).data('page');
                EventAjaxFilters.actions.event_manager_store_state(target, page);
                EventAjaxFilters.actions.getEventListings(event, page, false, false);
            },
            getEventListings: function(event, page=1, append, loading_previous) {
                event.preventDefault();
                Common.logInfo("EventAjaxFilters.actions.getEventListings...");

                jQuery('.load_more_events').hide();
                var data = '';
                var target = jQuery('.event_listings');
                var form = target.find('.event_filters');
                var filters_bar = target.find('.showing_applied_filters');
                var results = target.find('.event_listings');
                var per_page = target.data('per_page');
                var orderby = target.data('orderby');
                var order = target.data('order');
                var featured = target.data('featured');
                var cancelled = target.data('cancelled');
                var event_online = target.data('event_online');
                var index = jQuery('div.event_listings').index(this);
               
                if (xmlHttpRequest[index]) {
                    xmlHttpRequest[index].abort()
                }
                if (!append) {
                    
                    jQuery(results).parent().addClass('wpem-loading');
                    jQuery('div.event_listing, div.no_event_listings_found', results).css('visibility', 'hidden');         
                    target.find('.load_more_events').data('page', page);
                }

                if (true == target.data('show_filters')) {
                    var filter_event_type = [];

                    if(form.find(':input[name^="search_datetimes"]').length > 0) {
                        var datetimes = form.find(':input[name^="search_datetimes"]').map(function () {
                            return jQuery(this).val()
                        }).get();
                    } else {
                        var startDate = form.find('#search_fromdate').val();
                        var endDate = form.find('#search_todate').val();

                        var datetimes = (startDate || endDate) ? JSON.stringify({ start: startDate, end: endDate }) : '';
                        var datetimes = datetimes ? { '': datetimes } : {};
                    }

                    if(jQuery( 'input.date_range_picker').length > 0) {
                        jQuery( 'input.date_range_picker').daterangepicker();
                    }
                    var categories = form.find(':input[name^="search_categories"]').map(function() {
                        return jQuery(this).val()
                    }).get();
                    var event_types = form.find(':input[name^="search_event_types"]').map(function() {
                        return jQuery(this).val()
                    }).get();
                    var ticket_prices = form.find(':input[name^="search_ticket_prices"]').map(function() {
                        return jQuery(this).val()
                    }).get();
                    var keywords = '';
                    var location = '';
                    var $keywords = form.find(':input[name="search_keywords"]');
                    var $location = form.find(':input[name="search_location"]');
                    if ($keywords.val() !== $keywords.attr('placeholder')) {
                        keywords = $keywords.val()
                    }
                    if ($location.val() !== $location.attr('placeholder')) {
                        location = $location.val()
                    }

                    if(jQuery( ':input[name="event_online"]').length > 0){
                        if(jQuery(':input[name="event_online"]').prop("checked") == true) {
                            var event_online = 'true';
                        }else{
                            var event_online = '';
                        }
                    }

                    data = {
                        lang: event_manager_ajax_filters.lang,
                        search_keywords: keywords,
                        search_location: location,
                        search_datetimes: datetimes,
                        search_categories: categories,
                        search_event_types: event_types,
                        search_ticket_prices: ticket_prices,
                        per_page: per_page,
                        orderby: orderby,
                        order: order,
                        page: page,
                        featured: featured,
                        cancelled: cancelled,
                        event_online: event_online,
                        show_pagination: target.data('show_pagination'),
                        form_data: form.serialize()
                    }
                } else {
                    
                    var keywords = target.data('keywords');
                    var location = target.data('location');
                    if(form.find(':input[name^="search_datetimes"]').length > 0) {
                        var datetimes = JSON.stringify(target.data('datetimes'));
                    } else {

                    }
                    var categories = target.data('categories');
                    var event_types = target.data('event_types');
                    var ticket_prices = target.data('ticket_prices');
                    if (categories) {
                        categories = categories.split(',')
                    }
                    if (event_types) {
                        event_types = event_types.split(',')
                    }
                    data = {
                        lang: event_manager_ajax_filters.lang,
                        search_keywords: keywords,
                        search_location: location,
                        search_datetimes: datetimes,
                        search_categories: categories,
                        search_event_types: event_types,
                        search_ticket_prices: ticket_prices,
                        per_page: per_page,
                        orderby: orderby,
                        order: order,
                        page: page,
                        featured: featured,
                        cancelled: cancelled,
                        event_online: event_online,
                        show_pagination: target.data('show_pagination')
                    }
                }
                xmlHttpRequest[index] = jQuery.ajax({
                    type: 'POST',
                    url: event_manager_ajax_filters.ajax_url.toString().replace("%%endpoint%%", "get_listings"),
                    data: data,
                    success: function(result) {
                        if (result) {
                            try {
                                jQuery('.no_event_listings_found').remove();
                                if (result.filter_value) {
                                    jQuery(filters_bar).show().html('<span>' + result.filter_value + '</span>' + result.showing_links)
                                } else {
                                    jQuery(filters_bar).hide()
                                }
                                if (result.showing_applied_filters) {
                                    jQuery(filters_bar).addClass('showing-applied-filters');
                                } else {
                                    jQuery(filters_bar).removeClass('showing-applied-filters');
                                }
                                if (result.html) {
                                    if (append && loading_previous) {
                                        jQuery(results).prepend(result.html);
										if(jQuery('div.google-map-loadmore').length > 0) {
											jQuery('div .google-map-loadmore').not('div.google-map-loadmore:first').remove();
										}
                                    } else if (append) { 
									   jQuery(results).append(result.html);
									    if(jQuery('div.google-map-loadmore').length > 0){
											jQuery('div .google-map-loadmore').not('div.google-map-loadmore:first').remove();
										}
                                    } else {
                                        jQuery(results).html(result.html);
                                    }
                                }
                                if (true == target.data('show_pagination')) {
                                  
                                    if (result.pagination) {
                                        jQuery('.event-manager-pagination').html(result.pagination)
                                    }
                                } else {
                                    localStorage.setItem( 'total_event_page', result.max_num_pages);
                                    localStorage.setItem( 'current_event_page', page);
                                    if (!result.found_events || result.max_num_pages <= page) {
                                        jQuery('.load_more_events:not(.load_previous)', target).hide()
                                    } else if (!loading_previous) {
                                        jQuery('.load_more_events', target).show()
                                    }
                                    jQuery('#load_more_events_loader').removeClass('wpem-loading');
                                    jQuery('li.event_listing', results).css('visibility', 'visible')
                                }
                                jQuery(results).parent().removeClass('wpem-loading');
                                target.triggerHandler('updated_results', result)
                            } catch (err) {
                                if (window.console) {
                                    Common.logError(err)
                                }
                            }
                        }
                    },
                    error: function(jqXHR, textStatus, error) {
                        if (window.console && 'abort' !== textStatus) {
                            Common.logError(textStatus + ': ' + error)
                        }
                    },
                    statusCode: {
                        404: function() {
                            if (window.console) {
                                Common.logError("Error 404: Ajax Endpoint cannot be reached. Go to Settings > Permalinks and save to resolve.")
                            }
                        }
                    }
                });
                event.preventDefault();
            },

            loadMoreUpcomingEvents: function(event){
                event.preventDefault();
                jQuery(this).parent().addClass('wpem-loading');
                var currentPage = parseInt(jQuery(this).attr('data-page'));
                var per_page = jQuery('#per-page-settings').data('per-page');
                jQuery.ajax({
                    type: 'POST',
                    url: event_manager_ajax_filters.ajax_url.toString().replace("%%endpoint%%", "load_more_upcoming_events"),
                    data: {
                        action: 'load_more_upcoming_events',
                        value: currentPage,
                        per_page: per_page,
                    },
                    success: function(response) {
                        jQuery('#load_more_events_loader').removeClass('wpem-loading');
                        if (response.success) {
                            jQuery('.event_listings').append(response.data.events_html);                            
                            var nextPage = currentPage + 1;
                            jQuery('#load_more_events').attr('data-page', nextPage);
                            if (response.data.no_more_events===true) {
                                jQuery('#load_more_events').hide();
                            }
                        } else {
                            console.error('Failed to load events:', response.data.error);
                            if (response.data.error === 'No more events found.') {
                                jQuery('#load_more_events').hide();
                            }
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', status, error);
                    }
                });
            }
        }
    }
};
EventAjaxFilters = EventAjaxFilters();
jQuery(document).ready(function($) {
    EventAjaxFilters.init()
});
