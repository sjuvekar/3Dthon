jQuery(document).ready(function($){
	
	/* ------------------------------------------------------------------------ */
	/* Accordion */
	/* ------------------------------------------------------------------------ */
	
	$('.accordion').each(function(){
	    var acc = $(this).attr("rel") * 2;
	    $(this).find('.accordion-inner:nth-child(' + acc + ')').show();
	     $(this).find('.accordion-inner:nth-child(' + acc + ')').prev().addClass("active");
	});
	
	$('.accordion .accordion-title').click(function() {
	    if($(this).next().is(':hidden')) {
	        $(this).parent().find('.accordion-title').removeClass('active').next().slideUp(200);
	        $(this).toggleClass('active').next().slideDown(200);
	    }
	    return false;
	});
	
	/* ------------------------------------------------------------------------ */
	/* Alert Messages */
	/* ------------------------------------------------------------------------ */
	
	$(".alert-message .close").click(function(){
		$(this).parent().animate({'opacity' : '0'}, 300).slideUp(300);
		return false;
	});
	
	/* ------------------------------------------------------------------------ */
	/* Skillbar */
	/* ------------------------------------------------------------------------ */
	
	$('.skillbar').each(function(){
	    dataperc = $(this).attr('data-perc'),
	    $(this).find('.skill-percentage').animate({ "width" : dataperc + "%"}, dataperc*10);
	});
	
	/* ------------------------------------------------------------------------ */
	/* Tabs */
	/* ------------------------------------------------------------------------ */
	
	$('div.tabset').tabset();
	
	/* ------------------------------------------------------------------------ */
	/* Toggle */
	/* ------------------------------------------------------------------------ */
	
	if( $(".toggle .toggle-title").hasClass('active') ){
		$(".toggle .toggle-title.active").closest('.toggle').find('.toggle-inner').show();
	}
	
	$(".toggle .toggle-title").click(function(){
		if( $(this).hasClass('active') ){
			$(this).removeClass("active").closest('.toggle').find('.toggle-inner').slideUp(200);
		}
		else{
			$(this).addClass("active").closest('.toggle').find('.toggle-inner').slideDown(200);
		}
	});

/* EOF document.ready */
});

/* Tabset Function ---------------------------------- */
(function ($) {
$.fn.tabset = function () {
    var $tabsets = $(this);
    $tabsets.each(function (i) {
        var $tabs = $('li.tab a', this);
        $tabs.click(function (e) {
            var $this = $(this);
                panels = $.map($tabs, function (val, i) {
                    return $(val).attr('href');
                });
            $(panels.join(',')).hide();
            $tabs.removeClass('selected');
            $this.addClass('selected').blur();
            $($this.attr('href')).show();
            e.preventDefault();
            return false;
        }).first().triggerHandler('click');
    });
};
})(jQuery);

/* ------------------------------------------------------------------------ */
/* EOF */
/* ------------------------------------------------------------------------ */