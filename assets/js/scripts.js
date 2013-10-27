 
var   window_height = $(window).height(),
      testMobile,
	  loadingError = '<p class="error">The Content cannot be loaded.</p>',
	  nameError = '<div class="alert alert-error">Please enter your name.</div>',
	  emailError = '<div class="alert alert-error">Please enter your e-mail address.</div>',
	  invalidEmailError = '<div class="alert alert-error">Please enter a valid e-mail address.</div>',	  
	  subjectError = '<div class="alert alert-error">Please enter the subject.</div>',
	  messageError = '<div class="alert alert-error">Please enter your message.</div>',	
	  mailSuccess = '<div class="alert alert-success">Your message has been sent. Thank you!</div>', 
	  mailResult = $('#contact .result'),
      current,
	  next, 
	  prev,
	  target, 
	  hash,
	  url,
	  page,
	  title,	  	  	  
	  projectIndex,
	  scrollPostition,
	  projectLength,
	  ajaxLoading = false,
	  wrapperHeight,
	  pageRefresh = true,
	  content =false,
	  loader = $('div#loader'),
	  portfolioGrid = $('div#portfolio-wrap'),
	  projectContainer = $('div#ajax-content-inner'),
	  projectNav = $('#project-navigation ul'),
	  exitProject = $('div#closeProject a'),
	  easing = 'easeOutExpo',
	  folderName ='projects';	
	    
	  $.browser.safari = ($.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase())));	 	
	  


	$('.home-slide').each(function(){
	    contentSize = $(this).find('.home-slide-content');  
        contentSize.fitText(1.2);			
	});
	
 
	 if ( $.browser.safari ) {		  
     $('#home-slider').flexslider({						
			animation: "swing",
			direction: "vertical", 
			slideshow: true,
			slideshowSpeed: 3500,
			animationDuration: 1000,
			directionNav: false,
			controlNav: true,
			smootheHeight:true,						
			useCSS: false
				
	 });		  
     }	
	 	 
    
	 if ( $.browser.safari ) {
		  $('.flexslider').flexslider({						
			animation: "slide",
			direction: "horizontal", 
			slideshow: false,
			slideshowSpeed: 3500,
			animationDuration: 500,
			directionNav: true,
			controlNav: false,						
			useCSS: false
		  });
	 }
	 
	 if ( !$.browser.safari ) {
		  $('.home-parallax, .home-gradient').find('.home-text-wrapper').children('.container').addClass('no-safari');
	 }	 
	 
	  

var init = function() {	
	$('nav').animate({'opacity': '1'}, 0);	   

    // Function to slabtext the H1 headings
    function slabTextHeadlines() {
        $(".home-quote h1").slabText({
			 // Don't slabtext the headers if the viewport is under 479px
            "viewportBreakpoint":300
			
			
			});
    };
	
 


    $(window).load(function() {
        setTimeout(slabTextHeadlines, 5); 
    });
	 
/*----------------------------------------------------*/
/* FULLSCREEN IMAGE HEIGHT
/*----------------------------------------------------*/	     
	
	  function fullscreenImgHeight(){

		  $('#home').css({height:window_height});
/*		  var headerH = $('nav').outerHeight();
          $("#home").css('marginBottom',-headerH);*/
		  
	  }
		  
	  fullscreenImgHeight();
		  
		  
		  
	  $(window).bind('resize',function() {
	  
		  fullscreenImgHeight();
		  home_parallax();
		 		  
	  });	 
	  
};	


  jQuery(window).load(function(){   
  jQuery(document).ready(function($){     
// cache container
	var container = $('#portfolio-wrap');	
	

	container.isotope({
		animationEngine : 'best-available',
	  	animationOptions: {
	     	duration: 200,
	     	queue: false
	   	},
		layoutMode: 'fitRows'
	});	


	// filter items when filter link is clicked
	$('#filters a').click(function(){
		$('#filters a').removeClass('active');
		$(this).addClass('active');
		var selector = $(this).attr('data-filter');
	  	container.isotope({ filter: selector });
        setProjects();		
	  	return false;
	});
		
		
		function splitColumns() { 
			var winWidth = $(window).width(), 
				columnNumb = 1;
			
			
			if (winWidth > 1200) {
				columnNumb = 5;
			} else if (winWidth > 900) {
				columnNumb = 4;
			} else if (winWidth > 600) {
				columnNumb = 3;
			} else if (winWidth > 300) {
				columnNumb = 2;
			}
			
			return columnNumb;
		}		
		
		function setColumns() { 
			var winWidth = $(window).width(), 
				columnNumb = splitColumns(), 
				postWidth = Math.floor(winWidth / columnNumb);
			
			container.find('.portfolio-item').each(function () { 
				$(this).css( { 
					width : postWidth + 'px' 
				});
			});
		}		
		
		function setProjects() { 
			setColumns();
			container.isotope('reLayout');
		}		
		
		container.imagesLoaded(function () { 
			setColumns();
		});
		
	
		$(window).bind('resize', function () { 
			setProjects();			
		});

});
});

 

/*----------------------------------------------------*/
/* TWITTER CALLBACK FUNCTION
/*----------------------------------------------------*/
	  
function twitterCall(twitters) {
	  var statusHTML = [];
	  for (var i=0; i<twitters.length; i++){
		var username = twitters[i].user.screen_name;
		var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
		  return '<a href="'+url+'">'+url+'</a>';
		}).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
		  return  '<a href="http://twitter.com/'+reply.substring(1)+'">'+ reply.charAt(0) + reply.substring(1)+'</a>';
		}).replace(/\B#([_a-z0-9а-я]+)/ig, function(hashtag) {
		  return '<a href="http://twitter.com/search?q=%23'+hashtag.substring(1)+'">'+hashtag+'</a>';
		});
		statusHTML.push('<li class="slide"><p class="tweet">' +status+ '</p><p class="twitter-date"><a href="http://twitter.com/'+username+'" target="_blank">-- '+relative_time(twitters[i].created_at)+' --</a></p></li>');
	  }
	  document.getElementById('twitter-feed').innerHTML = statusHTML.join('');
}

function twitterBlogCall(twitters) {
	  var statusHTML = [];
	  for (var i=0; i<twitters.length; i++){
		var username = twitters[i].user.screen_name;
		var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
		  return '<a href="'+url+'">'+url+'</a>';
		}).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
		  return  '<a href="http://twitter.com/'+reply.substring(1)+'">'+ reply.charAt(0) + reply.substring(1)+'</a>';
		}).replace(/\B#([_a-z0-9а-я]+)/ig, function(hashtag) {
		  return '<a href="http://twitter.com/search?q=%23'+hashtag.substring(1)+'">'+hashtag+'</a>';
		});
		statusHTML.push('<p class="tweet">' +status+ '</p><p class="twitter-date">'+relative_time(twitters[i].created_at)+'</p>');
	  }
	  document.getElementById('twitter-feed').innerHTML = statusHTML.join('');
}


/*----------------------------------------------------*/
/* RELATIVE TIME FUNCTION
/*----------------------------------------------------*/

function relative_time(time_value) {
	  var values = time_value.split(" ");
	  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	  var parsed_date = Date.parse(time_value);
	  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	  delta = delta + (relative_to.getTimezoneOffset() * 60);
	
	  if (delta < 60) {
		return 'less than a minute ago';
	  } else if(delta < 120) {
		return 'about a minute ago';
	  } else if(delta < (60*60)) {
		return (parseInt(delta / 60)).toString() + ' minutes ago';
	  } else if(delta < (120*60)) {
		return 'about an hour ago';
	  } else if(delta < (24*60*60)) {
		return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
	  } else if(delta < (48*60*60)) {
		return '1 day ago';
	  } else {
		return (parseInt(delta / 86400)).toString() + ' days ago';
	  }
}


function home_parallax() {
	        $(window).scroll(function() {
	            var yPos = -($(window).scrollTop() / 0.7); 
	             
	            // Put together our final background position
	            var coords = '100% '+ yPos + 'px';
	 
	            // Move the background
	            //$('.page-title-wrapper').css({ backgroundPosition: coords });
	            $('.home-parallax').css({ backgroundPosition: coords });
	        
	        }); 
}

 home_parallax();


/*----------------------------------------------------*/
/* MOBILE DETECT FUNCTION
/*----------------------------------------------------*/

	var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };	  
	  
	 	   



	 
/*----------------------------------------------------*/
// CONTACT FORM WIDGET
/*----------------------------------------------------*/

    $("#contact form").submit(function()
    {
        var form = $(this);
        var formParams = form.serialize();
        $.ajax(
        {
            url: 'contact.php',
            type: 'POST',
            traditional: true,
            data: formParams,
            success: function(data){
                var response = jQuery.parseJSON(data);				
                $("#contact .result .alert").slideUp().remove();
                if(response.success)
                {   $('#contact form').slideUp().height('0');
                    $('#contact .result').append(mailSuccess);
                }
                else
                {
				   for(i=0; i<response.errors.length; i++){
					 if(response.errors[i].error == 'empty_name')  {                          
					   mailResult.append(nameError);
					 }
					 if(response.errors[i].error == 'empty_email')  {                          
					   mailResult.append(emailError);
					 }
					 if(response.errors[i].error == 'empty_subject')  {                          
					   mailResult.append(subjectError);
					 }
					 if(response.errors[i].error == 'empty_message')  {                          
					   mailResult.append(messageError);
					 }
					 if(response.errors[i].error == 'invalid'){
						mailResult.append(invalidEmailError);
					 }
				   }
                }
            }
        })
        return false;
    });
	

  

/*----------------------------------------------------*/
// LOAD PROJECT
/*----------------------------------------------------*/ 


	  
$(function(){	


  $(window).bind( 'hashchange', function() {
	  
	  		 
 hash = $(window.location).attr('hash'); 
 var root = '#!'+ folderName +'/';
 var rootLength = root.length;	
 
 	 
	if( hash.substr(0,rootLength) != root ){
		return;						
	} else {	

		 var correction = 50;
		 var headerH = $('nav').outerHeight()+correction;
		 hash = $(window.location).attr('hash'); 
	     url = hash.replace(/[#\!]/g, '' ); 
		 
		 
       
		portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');
		portfolioGrid.find('div.portfolio-item.current').removeClass('current' );
		
		


		/* IF URL IS PASTED IN ADDRESS BAR AND REFRESHED */
		if(pageRefresh == true && hash.substr(0,rootLength) ==  root){	

				$('html,body').stop().animate({scrollTop: (projectContainer.offset().top-20)+'px'},800,'easeOutExpo', function(){											
					loadProject();																									  
				});
				
		/* CLICKING ON PORTFOLIO GRID OR THROUGH PROJECT NAVIGATION */
		}else if(pageRefresh == false && hash.substr(0,rootLength) == root){				
					$('html,body').stop().animate({scrollTop: (projectContainer.offset().top-headerH)+'px'},800,'easeOutExpo', function(){ 		
		
					if(content == false){						
						loadProject();							
					}else{	
						projectContainer.animate({opacity:0,height:wrapperHeight},function(){
						loadProject();
						});
					}
							
					projectNav.fadeOut('100');
					exitProject.fadeOut('100');
							
					});
			
		/* USING BROWSER BACK BUTTON WITHOUT REFRESHING */	
		}else if(hash=='' && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == true){	
		        scrollPostition = hash; 
				console.log(scrollPostition);
				$('html,body').stop().animate({scrollTop: scrollPostition+'px'},1000,function(){				
							
					deleteProject();								
							
				});
				
		/* USING BROWSER BACK BUTTON WITHOUT REFRESHING */	
		}
		
		
		
		/* ADD ACTIVE CLASS TO CURRENTLY CLICKED PROJECT */
		 portfolioGrid.find('div.portfolio-item .portfolio a[href="#!' + url + '"]' ).parent().parent().addClass( 'current' );
		 portfolioGrid.find('div.portfolio-item.current').find('.portfolio').addClass('active');
		

	
  }
	  
	});	  
	  	/* LOAD PROJECT */		
		function loadProject(){
			loader.fadeIn().removeClass('projectError').html('');
			
			
			if(!ajaxLoading) {				
	            ajaxLoading = true;
								
				projectContainer.load( url +' div#ajaxpage', function(xhr, statusText, request){
																   
						if(statusText == "success"){				
								
								ajaxLoading = false;
								
									page =  $('div#ajaxpage');		
			
									$('.flexslider').flexslider({
												
												animation: "fade",
												slideDirection: "horizontal",
												slideshow: true,
												slideshowSpeed: 3500,
												animationDuration: 500,
												directionNav: true,
												controlNav: true,
												
												
												after: function(slider) {
												  slider.removeClass('loading');
												}
												
										});
			
										hideLoader();				  
											
										$(".container").fitVids();	
								
						}
						
						if(statusText == "error"){
						
								loader.addClass('projectError').append(loadingError);
								
								loader.find('p').slideDown();

						}
					 
					});
				
			}
			
		}
		

		
		function hideLoader(){
			loader.fadeOut('fast', function(){													  
					showProject();					
			});			 
		}	
		
		
		function showProject(){
			if(content==false){
				    wrapperHeight = projectContainer.children('div#ajaxpage').outerHeight()+'px';
					projectContainer.animate({opacity:1,height:wrapperHeight}, function(){
				        $(".container").fitVids();
						scrollPostition = $('html,body').scrollTop();
						projectNav.fadeIn();
						exitProject.fadeIn();
						content = true;	
								
					});
					
			}else{
                    wrapperHeight = projectContainer.children('div#ajaxpage').outerHeight()+'px';
					projectContainer.animate({opacity:1,height:wrapperHeight}, function(){																		  
					$(".container").fitVids();
						scrollPostition = $('html,body').scrollTop();
						projectNav.fadeIn();
						exitProject.fadeIn();
						
					});					
			}
					
			
			projectIndex = portfolioGrid.find('div.portfolio-item.current').index();
			projectLength = $('div.portfolio-item .portfolio').length-1;
			
			
			if(projectIndex == projectLength){
				
				$('ul li#nextProject a').addClass('disabled');
				$('ul li#prevProject a').removeClass('disabled');
				
			}else if(projectIndex == 0){
				
				$('ul li#prevProject a').addClass('disabled');
				$('ul li#nextProject a').removeClass('disabled');
				
			}else{
				
				$('ul li#nextProject a,ul li#prevProject a').removeClass('disabled');
				
			}
		
	  }
	  
	  
	  
	  function deleteProject(closeURL){
				projectNav.fadeOut(100);
				exitProject.fadeOut(100);				
				projectContainer.animate({opacity:0,height:'0px'});
				
			if(typeof closeURL!='undefined' && closeURL!='') {
				location = '#_';
			}
			portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');
			portfolioGrid.find('div.portfolio-item.current').removeClass('current' );			
	  }
	  
	  
     /* LINKING TO PREIOUS AND NEXT PROJECT VIA PROJECT NAVIGATION */
	  $('#nextProject a').on('click',function () {											   							   
					 
		    current = portfolioGrid.find('.portfolio-item.current');
		    next = current.next('.portfolio-item');
		    target = $(next).children('div').children('a').attr('href');
			$(this).attr('href', target);
			
		
			if (next.length === 0) { 
				 return false;			  
			 } 
		   
		   current.removeClass('current'); 
		   current.children().removeClass('active');
		   next.addClass('current');
		   next.children().addClass('active');
		   
		  
		   
		});



	    $('#prevProject a').on('click',function () {			
			
		  current = portfolioGrid.find('.portfolio-item.current');
		  prev = current.prev('.portfolio-item');
		  target = $(prev).children('div').children('a').attr('href');
		  $(this).attr('href', target);
			
		   
		   if (prev.length === 0) {
			  return false;			
		   }
		   
		   current.removeClass('current');  
		   current.children().removeClass('active');
		   prev.addClass('current');
		   prev.children().addClass('active');
		   
		});
		
		
         /* CLOSE PROJECT */
		 $('#closeProject a').on('click',function () {
			 
		    deleteProject($(this).attr('href')); 			
			portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');			
			loader.fadeOut();
			return false;
			
		});
		 

		 
		 pageRefresh = false;	  


});

		 

	
//BEGIN DOCUMENT.READY FUNCTION
$(document).ready(function() 
{ 
  init(); 

/*----------------------------------------------------*/
// ADD PRETTYPHOTO
/*----------------------------------------------------*/
	$("a[data-rel^='prettyPhoto']").prettyPhoto();
	
	
/*----------------------------------------------------*/
// ADD VIDEOS TO FIT ANY SCREEN
/*----------------------------------------------------*/
	 $(".container").fitVids();	 		
					
  
/*----------------------------------------------------*/
// PRELOADER CALLING
/*----------------------------------------------------*/    
    $("body.onepage").queryLoader2({
        barColor: "#111111",
        backgroundColor: "#ffffff",
        percentage: true,
        barHeight: 3,
        completeAnimation: "fade",
        minimumTime: 200
    });  


/*----------------------------------------------------*/
// MENU SMOOTH SCROLLING
/*----------------------------------------------------*/  
    $(".main-menu a, .logo a, .home-logo-text a, .scroll-to").click(function() {
		
		var headerH = $('nav').height();
		
		$(".main-menu a").removeClass('active');
		$(this).addClass('active');		
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top - headerH + "px"
        }, {
            duration: 1200,
            easing: "easeInOutExpo"
        });

        return false;
    });
	
	  
/*----------------------------------------------------*/
// PARALLAX CALLING
/*----------------------------------------------------*/  
  	testMobile = isMobile.any();
	
	if (testMobile == null)
	{
		$('.parallax .bg1').parallax("50%", 0.3);
		$('.parallax .bg2').parallax("50%", 0.3);
		$('.parallax .bg3').parallax("50%", 0.3);	
		$('.parallax .bg4').parallax("50%", 0.3);				
	} 
	
	jQuery('.milestone-counter').appear(function() {
		$('.milestone-counter').each(function(){
			dataperc = $(this).attr('data-perc'),
			$(this).find('.milestone-count').delay(6000).countTo({
            from: 0,
            to: dataperc,
            speed: 2000,
            refreshInterval: 100
        });
     });
 });	
 
 
    //img overlays
    $('.team-thumb').on('mouseover', function()
    {
        var overlay = $(this).find('.team-overlay');
        var content = $(this).find('.overlay-content');

        overlay.stop(true,true).fadeIn(600);
        content.stop().animate({'top': "40%",
			                     opacity:1 }, 600);
        
    }).on('mouseleave', function()
    {
        var overlay = $(this).find('.team-overlay');
        var content = $(this).find('.overlay-content');
        
        content.stop().animate({'top': "60%",
			                     opacity:0  }, 300, function(){
			content.css('top',"20%")});
			
        overlay.fadeOut(300);
		
    }); 	
  
});
//END DOCUMENT.READY FUNCTION


// BEGIN WINDOW.RESIZE FUNCTION	
 $(window).bind('resize',function(){						
	$(projectContainer).css({height:'auto'});										 
});
// END WINDOW.RESIZE FUNCTION			


// BEGIN WINDOW.LOAD FUNCTION		
$(window).load(function(){
	
	$('#load').fadeOut().remove();
	$(window).trigger( 'hashchange' );
	$(window).trigger( 'resize' );
 
/* ------------------------------------------------------------------------ */
/* FLEX SLIDER */
/* ------------------------------------------------------------------------ */    
	$('.flexslider').flexslider({						
			animation: "slide",
			direction: "horizontal", 
			slideshow: false,
			slideshowSpeed: 3500,
			animationDuration: 500,
			directionNav: true,
			controlNav: false
				
	 });
	 
/* ------------------------------------------------------------------------ */
/* Skillbar */
/* ------------------------------------------------------------------------ */	
	jQuery('.skillbar').appear(function() {
		$('.skillbar').each(function(){
			dataperc = $(this).attr('data-perc'),
			$(this).find('.skill-percentage').animate({ "width" : dataperc + "%"}, dataperc*10);
		});
	 });  
 
/* ------------------------------------------------------------------------ */
/* TEXT FITTING FOR HOME STYLING 2 */
/* ------------------------------------------------------------------------ */ 	    
     $('.home-slide-content').fitText(1.2);
	  $('.fittext-content').fitText(1.4);
 
/* ------------------------------------------------------------------------ */
/* STICKY NAVIGATION */
/* ------------------------------------------------------------------------ */ 
 
	$("nav").sticky({ topSpacing: 0, className: 'sticky', wrapperClassName: 'main-menu-wrapper' });

/* ------------------------------------------------------------------------ */
/* SELECTNAV - A DROPDOWN NAVIGATION FOR SMALL SCREENS */
/* ------------------------------------------------------------------------ */ 
	selectnav('nav', {
		nested: true,
		indent: '-'
	}); 
	
	
 
});
// END OF WINDOW.LOAD FUNCTION
	
  
 $('#home-slider.flexslider').flexslider({						
		animation: "swing",
		direction: "vertical", 
		slideshow: true,
		slideshowSpeed: 3500,
		animationDuration: 1000,
		directionNav: false,
		controlNav: true,
		smootheHeight:true,
		after: function(slider) {
		  slider.removeClass('loading');
		}
			
 });
 
 
 
 
 (function($) {
    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).delay(1000).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null,  // callback method for when the element finishes updating
    };
})(jQuery);

	 
