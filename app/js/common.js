$(function() {
	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	}

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });




	$('.header-slider').lightSlider({
		adaptiveHeight:true,
		item:1,
		slideMargin:0,
		loop:true,
		prevHtml: "<i class='icon icon-arrow-left'></i>",
		nextHtml: "<i class='icon icon-arrow-right'></i>",
		addClass: 'header-slider'
	});
	$('#about-company__slider').lightSlider({
		adaptiveHeight:true,
		item:1,
		slideMargin:0,
		loop:true,
		prevHtml: "<i class='icon icon-arrow-left-blue'></i>",
		nextHtml: "<i class='icon icon-arrow-right-blue'></i>",
		addClass: 'about-company__slider',
		pager:false
	});
	$('#reviews').lightSlider({
		adaptiveHeight:true,
		item:1,
		slideMargin:0,
		loop:true,
		prevHtml: "<i class='icon icon-arrow-left-blue'></i>",
		nextHtml: "<i class='icon icon-arrow-right-blue'></i>",
		addClass: 'reviews',
		pager:false
	});
	$('.slider-brands').lightSlider({
		item:12,
		loop:false,
		slideMove:2,
		easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
		speed:600,
		prevHtml: "<",
		nextHtml: ">",
		pager: false,
		responsive : [
			{
				breakpoint:992,
				settings: {
					item:10,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:815,
				settings: {
					item:8,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:705,
				settings: {
					item:6,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:550,
				settings: {
					item:4,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:380,
				settings: {
					item:3,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:350,
				settings: {
					item:2,
					slideMove:1,
					slideMargin:6,
				}
			},
		],
		onSliderLoad: function (el) {
			el.next().appendTo(el.parents(".lSSlideOuter"));
		}
	});

	$('.gamburger').on('click',function(){
		$(this).toggleClass('active');
		$(".top-menu").toggleClass('active');
	});

	$(document).on("click",function(event){
		if( $(event.target).closest(".top-menu,.gamburger").length )return;
		$('.gamburger').toggleClass('active');
		$(".top-menu").toggleClass('active');
		event.stopPropagation();
	});

    $('.popup').magnificPopup({
        mainClass: "mfp-scale"
	});
});

//Форма отправки 2.0
$(function() {



	$("[name=send]").click(function () {
		$(":input.error").removeClass('error');
		$(".allert").remove();

		var error;
		var btn = $(this);
		var ref = btn.closest('form').find('[required]');
		var msg = btn.closest('form').find('input, textarea');
		var send_btn = btn.closest('form').find('[name=send]');
		var send_options = btn.closest('form').find('[name=campaign_token]');

		$(ref).each(function() {
			if ($(this).val() == '') {
				var errorfield = $(this);
				$(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
				error = 1;
				$(":input.error:first").focus();
				return;
			} else {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ($(this).attr("type") == 'email') {
					if(!pattern.test($(this).val())) {
						$("[name=email]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
				var patterntel = /^()[0-9]{9,18}/i;
				if ( $(this).attr("type") == 'tel') {
					if(!patterntel.test($(this).val())) {
						$("[name=phone]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный номер телефона</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
			}
		});
		if(!(error==1)) {
			$(send_btn).each(function() {
				$(this).attr('disabled', true);
			});
			$(send_options).each(function() {
        		var form = $(this).closest('form'), name = form.find('.name').val();
				if ($(this).val() == '') {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success: function() {
							$( "#modal_callback_ok h4" ).remove();
							$( "#modal_callback_ok" ).prepend("<h4>"+name+",</h4>");
							$('form').trigger("reset");
							setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
                            // Настройки модального окна после удачной отправки
                            $(".fancybox-close").click();
                            $('div.md-show').removeClass('md-show');
                            $("#call_ok")[0].click();
                        },
                        error: function(xhr, str) {
                        	alert('Возникла ошибка: ' + xhr.responseCode);
                        }
                    });
				} else {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success:
						$.ajax({
							type: 'POST',
							url: 'https://app.getresponse.com/add_subscriber.html',
							data: msg,
							statusCode: {0:function() {
								$( "#modal_callback_ok h4" ).remove();
								$( "#modal_callback_ok" ).prepend("<h4>"+name+",</h4>");
								$('form').trigger("reset");
								setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
								$(".fancybox-close").click();
								// Настройки модального окна после удачной отправки
								$('div.md-show').removeClass('md-show');
								$("#call_ok")[0].click();
							}}
						}),
						error:  function(xhr, str) {
							alert('Возникла ошибка: ' + xhr.responseCode);
						}
					});
				}
			});
		}
		return false;
	})

	$(".auto-repair__item").on("click",function () {
		var id = $(this).data("content");
		$("#" + id).show();
    });

	$(".krest").on("click",function () {
        $(".block-mfp").hide();
    });
});