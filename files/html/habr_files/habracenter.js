

$(document).ready(function(){
	/**
	 * Twitter
	 */
	/* 
	var twitter_text = $('#twitter_text');
	if(twitter_text){
		var screen_name = twitter_text.data('username');
		$.getJSON('https://api.twitter.com/1.1/statuses/user_timeline.json?callback=?', { screen_name: screen_name, count: '1', exclude_replies: true }, function(json){

    	var text = replaceURLWithHTMLLinks(json[0].text);    	
      if(typeof(text) != 'undefined' ){
      	twitter_text.html( text).removeClass('hidden'); 
      } 
		},'json');
	}
	*/
	
	/**
	 * Private Note
	 */
	var private_note = $('#private_note');
	if(private_note.size()){
		// add note
		$('.add_note', private_note).click(function(){
			$('.add_note', private_note).addClass('hidden');
			$('.edit_note', private_note).removeClass('hidden');
			$('.current_note', private_note).addClass('hidden');
			$('#note_text').focus();
		});
		
		// cancel note
		$('.cancel_note', private_note).click(function(){
			$('.add_note', private_note).removeClass('hidden');
			$('.edit_note', private_note).addClass('hidden');
			$('.current_note', private_note).removeClass('hidden');
		});
		
		// save note
		$('#edit_note', private_note).ajaxForm({
			dataType: 'json',
	    url: '/json/users/save_note/',
	    beforeSubmit: function(){
	   	 	var text = $('.text', private_note).val();
	   	 	//if( text == '' ){
				//	$.jGrowl('Введите текст заметки', { theme: 'error' });
				//	return false;
				//}	    	
				$('input[type="submit"]', private_note).addClass('loading');
	    },
	    success: function(json){
	     if(json.messages == 'ok'){
	     		if(json.note == ''){
	     			$.jGrowl('Заметка про вашего мальчика удалена', { theme: 'notice' });
	     		}else{
	     			$.jGrowl('Заметка про вашего мальчика сохранена', { theme: 'notice' });
	     		}
	      	$('.current_note', private_note).html(json.note).removeClass('hidden');
	      	$('.edit_note', private_note).addClass('hidden');
	      	$('.add_note', private_note).removeClass('hidden');
	      	
	     	}else{       
	          show_system_error(json);
	     	}
	     	$('input[type="submit"]', private_note).removeClass('loading');
	    }
		});
	}

	$(document).on('click','.js-remove-badge', function(){
		var link = $(this),
				alias = link.data('alias'),
				url = link.data('url'),
				element = link.closest('li')

		$.ajax({
			type: 'post',
			data: {alias:alias},
			url: url,
			success: function(json){
				if( json.messages == 'ok'){
					element.remove();
					$.jGrowl('Бейджик удален', { theme: 'notice' });
				}else{
					show_system_error(json);
				}
			}
		})

		return false;
	})
	
	
	
	
	/** 
	 * "показать еще" в списках друзей, подписчиков, компаний и пр. на странице профиля пользователя.
	 * по умолчанию показано 25 штук - по клику на эту кнопку подгружаем остальных. :) 
	 */ 
	$('.showmore_items').click(function(){
		var login = $(this).data('login')
		var type = $(this).data('type')

		$('#'+type+'_items li.hidden').show()
		$(this).remove()
		return false;
	})
	
})