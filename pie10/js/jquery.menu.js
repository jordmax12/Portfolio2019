

(function( $ ) {
	

	
  $.fn.PieMenu2 = function(options) {
	var angle,
		delay_time,
		ele_angle=[],
		x_pos=[],
		y_pos=[];
    	/*$(window).resize(function(){	
	if ($(window).width() <= 800){
		// your code here
		$('body').hide();
	}
});*/
        var settings2 = $.extend( {
      'starting_angel'   : '0',
      'angel_difference' : '320',
	  'radius':'200',
	  'menu_element1' : this.children('.menu_option1').children(),
	  'menu_element2' : this.children('.menu_option1').children().hasClass('notSpecial'),
	  'menu_button1' : this.children('.menu_button1'),
	  'menu_button2' : this.children('.menu_button2'),
	  'menu_button3' : this.children('.menu_button3'),
	  'menu_button4' : this.children('.menu_button4'),
    }, options);
        
        angle = parseInt(settings2.angel_difference)/(settings2.menu_element1.length-1);
	delay_time = 1/(settings2.menu_element1.length-1);    

		
	function setPosition(val){
	  
		$(settings2.menu_element1).each(function(i,ele){
			$(ele).css({
			'left' : (val==0)?0:y_pos[i],
			'top' : (val==0)?0:-x_pos[i],
			});
		});

        }
        


        //remove event if exist
	
	
	var clickHandler = function() {
		if($(this).parent().hasClass('active')){
			setPosition(1);

                        

		}else{
			setPosition(1);
			$(this).parent().addClass('active');
			$(this).parent().removeClass('inactive');
                        $('.menu_option1').addClass('active').removeClass('inactive');
		}	
		//$(this).toggleClass("btn-rotate"); //this can rotate the button, may have some use for something later
	};
	
	function setPosition2(val){
		$(settings2.menu_element1).each(function(i,ele){
		  if ($('.menu_option1').children().hasClass('notSpecial')){
			$('.notSpecial').css({
			'left' : (val==0)?0:y_pos[i],
			'top' : (val==0)?0:-x_pos[i],
			});
		  }
		  
		});
		
	      
		  if ($('.menu_option1').children().hasClass('please')){
		  $(settings2.menu_element1).each(function(i,ele){
		  	$(ele).css({
			'left' : (val==0)?0:y_pos[i],
			'top' : (val==0)?0:-x_pos[i],
			});
			
		  });
		  }
		  
        }
	
	var clickHandler2 = function() {
	  if($('.star[data-genre="web"]').hasClass('qOpen')){
	      setPosition(1);
	  }
	  if ($('.menu_option1').children().hasClass('please')){
	    setPosition2(1);
	    $('.menu_option1').children().removeClass('Special').removeClass('please');
	  }else{
	    setPosition2(0);
	  }
	  


	};
	
	var clickHandler3 = function() {
	  if($('.star[data-genre="mobile"]').hasClass('qOpen')){
	      setPosition(1);
	  }
	  if ($('.menu_option1').children().hasClass('please')){
	    setPosition2(1);
	    $('.menu_option1').children().removeClass('Special').removeClass('please');
	  }else{
	    setPosition2(0);
	  }
	};
	
	var clickHandler4 = function() {
	  if($('.star[data-genre="game"]').hasClass('qOpen')){
	      setPosition(1);
	  }
	  if ($('.menu_option1').children().hasClass('please')){
	    setPosition2(1);
	    $('.menu_option1').children().removeClass('Special').removeClass('please');
	  }else{
	    setPosition2(0);
	  }
	  
	};

        $(settings2.menu_button1).bind('click', clickHandler);
	$(settings2.menu_button2).bind('click', clickHandler2);
	$(settings2.menu_button3).bind('click', clickHandler3);
	$(settings2.menu_button4).bind('click', clickHandler4);

	return settings2.menu_element1.each(function(i,ele){
		ele_angle[i] = (parseInt(settings2.starting_angel) + angle*(i))*Math.PI/180;
		 x_pos[i] = (settings2.radius * Math.sin(ele_angle[i]));
         y_pos[i] = (settings2.radius * Math.cos(ele_angle[i]));
		 
		 $(ele).css({
			'-webkit-transform': 'rotate('+(90-ele_angle[i]*180/Math.PI)+'deg)',
			   '-moz-transform': 'rotate('+(90-ele_angle[i]*180/Math.PI)+'deg)',
			    '-ms-transform': 'rotate('+(90-ele_angle[i]*180/Math.PI)+'deg)',
			     '-o-transform': 'rotate('+(90-ele_angle[i]*180/Math.PI)+'deg)',
			    	'transform': 'rotate('+(90-ele_angle[i]*180/Math.PI)+'deg)',
		});
      })
	  
  };
  
  
  
    $.fn.PieMenu = function(options) {


  };
})( jQuery );