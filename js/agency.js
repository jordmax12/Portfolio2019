// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })
    
    $( window ).load( function () {
        //$( 'header' ).css( 'height', $( window ).height() );
    });
    // Window resize event
			$( window ).resize( function () {

				/** Keeping Logo and Phone at the bottom of teh page
				 **********************************************************/
				//$( 'header' ).css( 'height', $( window ).height() );

//				/** Pushing Content down to the height equal to Intro section height + height necessary to finish animation
//				 *************************************************************************************************************/
//				if ( intro.length > 0 ) {
//					content.css( 'margin-top', intro.height() * 1.5 );
//				}
//
//				/** Content 'margin-bottom' equals footer height to reveal footer
//				 ********************************************************************************/
//				if ( $( '.fixed-footer' ).length > 0 ) {
//					content.css( 'margin-bottom', footer.outerHeight() );
//				}
			} );

})(jQuery); // End of use strict
