
        document.addEventListener("DOMContentLoaded", function() {
            let wrapper = document.querySelector('.event-wrapper');
            let eventContainer = document.querySelector('.event-container');

            function duplicateEvents() {
                let originalEvents = Array.from(wrapper.children);
                originalEvents.forEach(event => {
                    let clone = event.cloneNode(true);
                    wrapper.appendChild(clone);
                });
            }

            duplicateEvents();
        });

