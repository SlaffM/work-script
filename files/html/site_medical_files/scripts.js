if (jQuery.browser.msie) {
    //Вычисляем IE 6!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (jQuery.browser.version == '6.0') {
//        window.location.replace('http://2dr.ru/ie/ie6.html');
    }
    //Вычисляем IE 7!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (jQuery.browser.version == '7.0') {
//        window.location.replace('http://2dr.ru/ie/ie7.html');
    }
}
//Вычисляем возраст по дате в формате dd.mm.YYYY
function getAge(birthDateString) {
    var birthDateArr = birthDateString.split('.');
    birthDateString = birthDateArr[2] + '-' + birthDateArr[1] + '-' + birthDateArr[0];
    var today = new Date();
    var birthDate = new Date(birthDateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
//Инициализируем jScrollPane
function jScrollInit() {
    var settings = {
            showArrows: true,
            autoReinitialise: true,
            verticalDragMinHeight: 38,
            verticalDragMaxHeight: 38
        },
        pane = $('.scroll-pane');
        
    pane.jScrollPane(settings);
}
//Инициализация скрола талонов
function talon_scroll_init() {
    var talons_cnt_all = $('.talon_width').size(),
        talons_cnt = $('.talon_width.visible').size(),
        talons_green_cnt = $('.top_green_talon').size(),
        talons_blue_cnt = $('.top_blue_talon').size(),
        talons_orange_cnt = $('.top_orange_talon').size();
    
    $('.container_talon').css('marginLeft', '0');
    
    $('.all_talon a').text('все талоны (' + talons_cnt_all + ')');
    
    
    $('.vidan_talon a').show().text('выданные талоны (' + talons_green_cnt + ')');
    
    $('.predvar_talon a').show().text('предварительные заявки (' + talons_blue_cnt + ')');
    
    $('.predlog_talon a').show().text('предложенные талоны (' + talons_orange_cnt + ')');
    
    if(talons_cnt > 4) {
        $('#talon_arrow_r').show();
        return talons_cnt - 4;
    } else {
        $('#talon_arrow_l, #talon_arrow_r').fadeOut();
        return 0;
    }
}
//Фильтр талонов
function talons_filter(el) {
    var talon_color_class = "";
    
    $('.different_talon a').removeClass('active');
    $(el).find('a').addClass('active');
    switch($(el).attr('class')) {
        case 'vidan_talon':
            talon_color_class = '.green_talon';
            break;
        case 'predvar_talon':
            talon_color_class = '.blue_talon';
            break;
        case 'predlog_talon':
            talon_color_class = '.orange_talon';
            break;
        default: talon_color_class = '';
    }
    if(talon_color_class == '') {
        $('.talon_width').addClass('visible').show(400)
    } else {
        $('.talon_width').addClass('visible').show().not(talon_color_class).removeClass('visible').hide();
    }
    
    return talon_scroll_init();
}
//Чтение cookie-данных
function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}

/*ПРОВЕРКА НОМЕРА ПОЛИСА НА ВАЛИДНОСТЬ*/
function CheckENP(ENP)
{
    var ret = false;
    if (ENP.length==16)
    {
        ENP = "0" + ENP;// чтобы было нечетное количество
        var sum = 0; //сумма четных
        var nechetsum = 0; //сумма нечетных
        var nch = 0; //нечетные
        for (var i = ENP.length - 2; i > 0; i = i - 2)
        {
            sum += (ENP[i-1]-0); //просто суммируем четные
            nch = ENP[i]*2; //умножаем на 2 нечетные
            nechetsum += (nch % 10 + Math.floor(nch / 10)); //суммируем умноженное на два (как типа в столбик)
        }        
        sum += nechetsum; //итоговое число сумма четных сумма нечетных плюс не забываем если есть старушую десятку, порядок не важет
        sum = (10 - sum % 10) % 10; //берем вычет от 10ки        
        ret=(""+sum)[0] == ENP[ENP.length - 1];
    }
    return ret;
}

/*ПОЛУЧИТЬ ДАТУ РОЖДЕНИЯ ИЗ ЕНП*/
function GetBirthDateFromENP(ENP)
{
    if (!CheckENP(ENP))
     return new Date(1990, 0, 1);
     
    var y = 0;
    var yy = ENP.substring(4, 8);
    var splitext =  yy.split("");
    splitext = splitext.reverse();
    yy = splitext.join("");
    y = 9999-yy;
    var m = 0;
    m = 99-ENP.substring(2, 4);
    if (y < 1951)
       m -= 20;
    else if (y < 2001)
        m -= 40;
    var d = 0;
    d = 99 - ENP.substring(8, 10);
    if (d > 50)
        d -= 50;    
    return new Date(y, m-1, d);         
}

/*ПОЛУЧИТЬ ПОЛ ИЗ ENP*/
function GetGenderFromENP(ENP)
{
    if (!CheckENP(ENP))
     return false;

    var d = ENP.substring(8, 10)-0;
    return d < 49;
}

function readcom(name_param, value_param) {
    if (name_param != '') {
        //alert(name_param+":"+value_param);

        //получаем массив из строки
        var name_param_arr = name_param.split(' ');
        var value_param_arr = value_param.split(' ');

        if (name_param_arr[0] == "SNUM_NNUM") {
            $('#n_polisa_input_for_authorize').val(value_param_arr[1]);
        } else {
			$('#n_polisa_input_for_authorize').val(value_param_arr[0]);
		}
        
        document.polis_auth.submit();
    }
}

//выделение промежуточных дней в календаре выбора листов ожидания
function first_day_to_last_day(class_name) {
    var first_day = parseInt($('.' + class_name + ' td.first').text(), 10),
        last_day = parseInt($('.' + class_name + ' td.last').text(), 10);
        
    $('.' + class_name + ' td').each(function(index, element) {
        var element_day = parseInt($(element).text(), 10);
            
        if(element_day > first_day && element_day < last_day) {
            $(element).addClass('selected');
        }
    });
}

//выбираем промежуток времени или даты для листов ожидания
function choose_between(el, wl, class_name) {
    if($(el).text() == "\u00A0" || $(el).hasClass('cld_today')) {
        if($(el).hasClass('cld_today')) {
            alert("Данный день недоступен!");
        } else {
            alert('Пустая ячейка!');
        }
    } else {
        if(!$(el).hasClass('selected')) {
            $(el).addClass('selected');
            if(wl.first == 0) {
                wl.first = $(el).attr('date');
                $(el).addClass('first');
                first_day_to_last_day(class_name);
            } else if(wl.last == 0) {
                var first_day = parseInt($('.' + class_name + ' td.first').text(), 10),
                    last_day = parseInt($(el).text(), 10);
                    
                if(first_day < last_day) {
                    wl.last = $(el).attr('date');
                    $(el).addClass('last');
                    first_day_to_last_day(class_name);
                } else {
                    wl.last = $('.' + class_name + ' td.first').attr('date');
                    $('.' + class_name + ' td.first').removeClass('first').addClass('last');
                    wl.first = $(el).attr('date');
                    $(el).addClass('first');
                    first_day_to_last_day(class_name);
                }
            } else {
                $('.' + class_name + ' td.selected, .' + class_name + ' td.selected.first, .' + class_name + ' td.selected.last').removeClass('selected').removeClass('first').removeClass('last');
                wl.first = 0;
                wl.last = 0;
            }
        } else {
            if($(el).hasClass('first')) {
                $(el).removeClass('selected');
                wl.first = 0;
                $(el).removeClass('first');
            } else if($(el).hasClass('last')) {
                $(el).removeClass('selected');
                wl.last = 0;
                $(el).removeClass('last');
            } else {
                $('.' + class_name + ' td.selected, .' + class_name + ' td.selected.first, .' + class_name + ' td.selected.last').removeClass('selected').removeClass('first').removeClass('last');
                wl.first = 0;
                wl.last = 0;
            }
        }
    }
    
    return wl;
}

$(document).ready(function() {
    var registratu = {
            old_talon : "",
            infomat : 0
        },
        private_office = {
            talon_arrow_l : 0,
            talon_arrow_r : 0,
            this_talon: 0,
            remove_talon_type: ''
        },
        waiting_list = {
            month : {
                count : parseInt($("#waiting_list_calendar_wrapper").css("width"), 10) / parseInt($("#waiting_list_calendar_wrapper").parents("div").css("width"), 10),
                current : 1
            },
            days : {
                first : 0,
                last : 0    
            },
            times : {
                first : 0,
                last : 0
            }
        },
        auth_form = {
            n_polisa_input_for_authorize : "",
            birthday_input_for_authorize : ""
        };

    //Вычисляем версию Mozilla Firefox
    if(jQuery.browser.mozilla) {
        if(parseInt(jQuery.browser.version, 10) < 8) {
            $('#oldBrowserMessage>div').html('<img src="/bitrix/templates/2dr/images/mozillaFirefox.png" alt="Mozilla Firefox" align="left" />&nbsp;&nbsp;Вы используете устаревшую версию браузера Mozilla Firefox! Сайт может работать не корректно!  <a href="http://www.mozilla.com/firefox/">Обновить</a>');
            $('#oldBrowserMessage').slideDown();
        }
    }
    //Вычисляем версию Opera
    if(jQuery.browser.opera) {
        if(parseInt(jQuery.browser.version, 10) < 11) {
            $('#oldBrowserMessage>div').html('<img src="/bitrix/templates/2dr/images/opera.png" alt="Opera" align="left" />&nbsp;&nbsp;Вы используете устаревшую версию браузера Opera! Сайт может работать не корректно! <a href="http://www.opera.com/download/">Обновить</a>');
            $('#oldBrowserMessage').slideDown();
        }
    }
    //Вычисляем версию Google Chrome
    if(jQuery.browser.webkit) {
        if(parseInt(jQuery.browser.version, 10) < 5) {
            $('#oldBrowserMessage>div').html('<img src="/bitrix/templates/2dr/images/googleChrome.png" alt="Google Chrome" align="left" />&nbsp;&nbsp;Вы используете устаревшую версию браузера Google Chrome! Сайт может работать не корректно! <a href="http://www.google.com/chrome">Обновить</a>');
            $('#oldBrowserMessage').slideDown();
        }
    }
    //Вычисляем версию Safari
    if(jQuery.browser.safari) {
        if(parseInt(jQuery.browser.version, 10) < 5) {
            $('#oldBrowserMessage>div').html('<img src="/bitrix/templates/2dr/images/googleChrome.png" alt="Safari" align="left" />&nbsp;&nbsp;Вы используете устаревшую версию браузера Safari! Сайт может работать не корректно! <a href="http://www.apple.com/safari/download/">Обновить</a>');
            $('#oldBrowserMessage').slideDown();
        }
    }
        
    //Определение инфомата
    var curr_url = location.href,
        regV = /private_office\/3/gi,
		regV2 = /registratu\/6/gi,
        result = curr_url.match(regV),
		result2 = curr_url.match(regV2);
		
    registratu.infomat = getCookie('BITRIX_SM_INFOMAT');

    //Убираем ссылку для регистрации
    $('.bx-auth').find('a').hide();

    // Определим Internet Explorer и страницу авторизации и инфомат
    if (jQuery.browser.msie && registratu.infomat == 1) {
		if (result != null || result2 != null) {
			window.external.OpenPorts();
		} else {
			window.external.ClosePorts();
		}
    }

    if(location.href.match(/\registratu\/6/gi)) {
        $('.inf_board_l_b_small').html(localStorage.getItem('talon_step6'));
    }

    /*if(location.href.match(/registratu\/5/gi)) {
        var green_button_count = $('.green_button_time').size();
        //Если нет зеленых кнопок
        if(green_button_count == 0) {
            $('#shadow').fadeIn();
            $('#for_create_visit .title_popup_red').html('Рабочий день врача закончен. Выберите, пожалуйста, другую дату');
            $('#for_create_visit').show();
        }
    }*/
    
    if (registratu.infomat == 1) {
        jScrollInit();
    } else {
        $('.scroll-pane').css('height', 'auto');
        $('#wrapper').css({
            height: 'auto',
            overflow: 'hidden'
        });
        $('#shadow').css({
            height: ($('#wrapper').height() - 16) + 'px',
            top: '-' + ($('#wrapper').height() - 47) + 'px'
        });
        /*$('#footer').css({
            margin: '0 auto 0'
        });*/
        $('#footer').remove();
        $('.hr').remove();
    }
    
    if(location.href.match(/\private_office\/3/gi)) {
        private_office.talon_arrow_r = talon_scroll_init();
    }
    
    //Переопределяем, что бы разного регистра текст находился
    jQuery.expr[':'].contains = function(a,i,m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };

    //Убираем кнопку листания прошлого месяца в первом календаре листов ожидания
    $(".cld_month").first().find(".back_month").hide();

    //Убираем кнопку листания следующего месяца в последнем календаре листов ожидания
    $(".cld_month").last().find(".next_month").hide();

    //Если на 3 шаге выбран Областной перинатальный центр
    if(location.href.match(/registratu\/3\/belgorod\/oblastnoy_perinatalnyy_tsentr/gi)) {
        $('#shadow').fadeIn();
        $('#for_create_visit .title_popup_red').html('В 2013 году запись будет идти через <a href="/registratu/3/belgorod/poliklinika_belgorodskoy_oblastnoy_klinicheskoy_bolnitsy/">Поликлинику Белгородской областной клинической больницы</a>');
        $('#for_create_visit').show();
        setTimeout(function() {
            window.location.assign('http://2dr.ru/registratu/3/belgorod/poliklinika_belgorodskoy_oblastnoy_klinicheskoy_bolnitsy/');
        }, 1000);
    }

    //Затеняем страницу сайта
    $('.vkladki .wasActive, #arrow_left, #city_list ul a, #pol_list a, #spec_list ul a, .next_week, .back_week, #create_waiting_list').on('click', function() {
        $(this).addClass('active');
        $('#shadow').fadeIn();
        /*if($(this).parents('li').hasClass('no_active_hospital')) {
            $('#for_create_visit .title_popup_red').html('Данная поликлиника недоступна');
            $('#for_create_visit').show();
        }*/
    });
    //листаем талоны вправо
    $('#talon_arrow_r').on('click', function(e) {
        e.preventDefault();
        if(private_office.talon_arrow_r > 0) {
            $('.container_talon').animate({marginLeft : '-=227'}, 200);
            $('#talon_arrow_l').fadeIn();
            --private_office.talon_arrow_r;
            ++private_office.talon_arrow_l;
        }
        if(private_office.talon_arrow_r == 0) {
            $('#talon_arrow_r').fadeOut();
        }
    });
    //листаем талоны влево
    $('#talon_arrow_l').on('click', function(e) {
        e.preventDefault();
        if(private_office.talon_arrow_l > 0) {
            $('.container_talon').animate({marginLeft : '+=227'}, 200);
            $('#talon_arrow_r').fadeIn();
            --private_office.talon_arrow_l;
            ++private_office.talon_arrow_r;
        }
        if(private_office.talon_arrow_l == 0) {
            $('#talon_arrow_l').fadeOut();
        }
    });
    //сортировка талонов
    $('.all_talon').on('click', function(e) {
        e.preventDefault();
        private_office.talon_arrow_r = talons_filter($(this));
    });
    $('.vidan_talon').on('click', function(e) {
        e.preventDefault();
        private_office.talon_arrow_r = talons_filter($(this));
    });
    $('.predvar_talon').on('click', function(e) {
        e.preventDefault();
        private_office.talon_arrow_r = talons_filter($(this));
    });
    $('.predlog_talon').on('click', function(e) {
        e.preventDefault();
        private_office.talon_arrow_r = talons_filter($(this));
    });
//Пример номера полиса модальное окно
    $('#show_n_polis_img').on('click', function(e) {
        e.preventDefault();
        $('#shadow, #n_polis_img').fadeIn();
    });
    //помощь лист ожидания
    $('#help_buttom').on('click', function(e) {
        e.preventDefault();
        $('#shadow, #waiting_list_window_help').fadeIn();
    });
    $(document).on('click', '.help_close2, .help_close, #shadow', function(e) {
        e.preventDefault();
        $('#shadow, .inf_board_3').fadeOut();
        $('.accordion a.active').removeClass('active');
    });

    //Создать медицинскую карту
    $(document).on('click', '.create_med_card', function(e) {
        if($(this).text() == 'Продолжить запись') {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/private_office/3/create_visit_for_other_lpu.php",
                data: {
                    n_polisa : $('#n_polisa_input_for_authorize').val(),
                    wsdl : $('#pol_wsdl').text(),
                    birthday : $('#birthday_input_for_authorize').val()
                },
                beforeSend: function() {
                    $('.inf_board_3').fadeOut();
                },
                success: function(data) {
                    if(data == 'Выбранное время уже занято') {
                        $('#polis_auth').find('.agree').trigger('click');
                        $('#shadow').fadeIn();
                    } else {
                        if(data == 'Не найдена медицинская карта, обратитесь, пожалуйста, в регистратуру поликлиники') {
                            //alert('Пациент не найден в регистре, медицинская карта не создана.');
                            $('#for_create_visit').find('.title_popup_red').text('К сожалению, нам не удалось создать карту и записать Вас на прием к врачу.');
                            $('#talon_text_for_del').show().html('<p>Возможные причины:<br>1) Ошибка в номере страхового медицинского полиса.<br>Проверьте правильность ввода номера полиса.</p><p>2) Ваши данные отсутствуют в Регистре застрахованых.<br>Для создания карты и записи на прием обратитесь  в регистратуру медицинского учреждения.</p>');
                            $('#for_create_visit').fadeIn();
                            $('#shadow').fadeIn();
                        } else {
                            //alert(data);
                            $('#for_create_visit').find('.title_popup_red').text(data);
                            $('#for_create_visit').fadeIn();
                            $('#shadow').fadeIn();
                        }
                    }
                },
                complete: function() {
                    //$('#shadow, .inf_board_3').fadeOut();
                },
                error: function() {
                    alert('Ошибка!');
                }
            });
        }
    });
    
    //Поиск населенного пункта по введенным в строку поиска данным
    $('#txt_search_input_nas').live('keyup', function() {
        var text = $(this).attr('value');
        $('#city_list li:contains("'+text+'")').slideDown('slow');
        $('#city_list li:not(:contains("'+text+'"))').slideUp('slow');
        $('#city_list>li>a').addClass('active').next().slideDown();
    });
    //Выбор региона
    $('#city_list>li>a').on('click', function(e) {
        e.preventDefault();
        if($(this).hasClass('city')) {
            $(this).addClass('active');
            $('#shadow').fadeIn();
            window.location.assign($(this).attr('href'));
        } else if($(this).hasClass('active')) {
            $(this).removeClass('active').next().slideUp();
        } else {
            $('#city_list .active').removeClass('active').next().slideUp();
            $(this).addClass('active').next().slideDown();
        }
    });
    //Поиск поликлиники по введенным в строку поиска данным
    $('#txt_search_input_pol').live('keyup', function() {
        var text = $(this).attr('value');
        $('#pol_list li:contains("'+text+'")').slideDown('slow');
        $('#pol_list li:not(:contains("'+text+'"))').slideUp('slow');
    });
    //Фильтр по типу поликлиники: взрослые, детские и все
    $('.button_allChild a').on('click', function(e) {
        e.preventDefault();
        $('.button_allChild a').removeClass('active');
        $(this).addClass('active');
        $('#pol_list li').slideDown('slow');
        switch($(this).text()) {
            case "Взрослые":
                $('#pol_list li[children=1]').slideUp('slow');
                break;
            case "Детские":
                $('#pol_list li[children=0]').slideUp('slow');
                break;
            default:
                $('#pol_list li').slideDown('slow');
        }
    });
    //Поиск специализации по введенным в строку поиска данным
    $('#txt_search_input_spec').live('keyup', function() {
        var text = $(this).attr('value');
        $('#spec_list>li>a:contains("'+text+'")').slideDown('slow');
        $('#spec_list>li>a:not(:contains("'+text+'"))').slideUp('slow');
    });
    //выбор специализации
    $('#spec_list>li>a').on('click', function(e) {
        e.preventDefault();
        if($(this).attr('href') == '#') {
            if($(this).hasClass('active')) {
                $('#spec_list li>a').removeClass('active');
                $('#spec_list li ul').slideUp();
            } else {
                $('#spec_list li>a').removeClass('active');
                $('#spec_list li ul').slideUp();
                $(this).addClass('active');
                $(this).next().slideDown();
                //Прокрутка вверх на 45px
                var $jspPane = $(this).parents('.jspPane');
                if(parseInt($($jspPane).css('top'), 10) < -45) { //Если поле прокручивалось больше чем на 45px
                    $($jspPane).animate({top:(parseInt($($jspPane).css('top'), 10)-45) + 'px'});
                }
            }
        } else {
            $('#shadow').fadeIn();
            location.assign($(this).attr('href'));
        }
    });
    //Поиск врача по введенным в строку поиска данным
    $('#txt_search_input_doc').live('keyup', function() {
        var text = $(this).attr('value');
        $('.list_choose_doc:contains("'+text+'")').slideDown('slow');
        $('.list_choose_doc:not(:contains("'+text+'"))').slideUp('slow');
    });
    //Выбор врача и даты
    $('.time_table_green_step4, .time_table_purple_step4').on('click', function() {
        var url = $(this).find('input[name=href]').val();
        $(this).removeClass('time_table_green_step4').removeClass('time_table_purple_step4').addClass('time_table_orange_step4');
        $('#shadow').fadeIn();
        //console.log(url);
        window.location.assign(url);
    });

    //Показать все участки врача
    $('.display_rooms').on('click', function(e) {
        e.preventDefault();
        var $m = $('#new_talon_message'),
            close = "<div class='title_help' style='font-size:20px;'>Участки врача " + $(this).data('fio') + "<a href='#' class='help_close2'>" + $m.find('.help_close2').html() + "</a></div>";

        $m.css('width', '680px');
        $m.find('.inf_board2_middle').html(close + '<br><p>' + $(this).data('rooms') + '</p>');
        $m.find('.triangle_b').hide();
        $m.fadeIn();
    });

    //Выбор времени
    $('.choose_doc_time>div').on('click', function() {
        var title = $(this).find('.title').text(),
            time = $(this).find('span:eq(0)').text(),
            types = $(this).find('.types').html(),
            id = $(this).find('.id').text();

        $('.choose_doc_time .orange_button_time').removeClass('orange_button_time').addClass('green_button_time');
        $('#inf_types').html(types);
        $('#inf_text').text(title);
        $('#inf_time').text(time);
        

        if ($(this).hasClass('green_button_time')) {
            /*var href = document.location.pathname.replace('registratu/5', 'registratu/6') + "/" + id + "/",
                time = $(this).find('span:eq(0)').text(),
                date = $('.current_day').text();

            if(registratu.old_talon == "") {
                registratu.old_talon = $('.talon_step5').html();
            }
            $('.talon_step5').html(registratu.old_talon).wrapInner('<div style="color:#898989;"></div>').append(" " + date + "г., " + time).css({'backgroundPosition' : '0 -564px', 'height' : '170px'});
            localStorage.setItem('step', '6');
            localStorage.setItem('talon_step6', $('.talon_step5').html());
            
            $(this).addClass('orange_button_time');
            $('.page_zapis').attr('href', href).fadeIn();*/
            $('#inf_board').hide();
            var time = $(this).find('span:eq(0)').text(),
                date = $('.current_day').text();
                
            if(registratu.old_talon == "") {
                registratu.old_talon = $('.talon_step5').html();
            }
            $('.talon_step5').html(registratu.old_talon).wrapInner('<div style="color:#898989;"></div>').append(" " + date + "г., " + time).css({'backgroundPosition' : '0 -564px', 'height' : '170px'});
            localStorage.setItem('step', '6');
            localStorage.setItem('talon_step6', $('.talon_step5').html());
            $(this).addClass('orange_button_time');
            $('#shadow').fadeIn();
            window.top.location = document.location.pathname.replace('registratu/5', 'registratu/6') + "/" + id + "/";
        } else {
            $('#inf_board').fadeIn();
            $('.page_zapis').fadeOut();
            
            if(registratu.old_talon != "") {
                $('.talon_step5').html(registratu.old_talon).css({'backgroundPosition' : '0 -400px', 'height' : '155px'});
            }
        }
    });
    
    //Записаться на прием
    $('.page_zapis').live('click', function() {
        $('#shadow').fadeIn();
    });
    
    //Фильтрация поля даты формы авторизации
    $('#birthday_input_for_authorize').live('keypress', function(e) {
        //console.log(e.which);
        if(e.which == 46 || e.which == 8 || (e.which >= 48 && e.which <= 57)) {} else {return false}
    });
    
    //submit формы авторизации
    $('.agree').on('click', function(e) {
        e.preventDefault();
        var n_polisa = $('#polis_auth input[name=n_polisa]').val(),
            birthday = $('#polis_auth input[name=birthday]').val(),
            age = getAge(birthday),
            is_children_pol = parseInt($('#is_children_pol').text(), 10);
        //удаляем из строки пробелы
        n_polisa = n_polisa.replace(/\s/g, "");
        
        if(n_polisa == "") {
            //$('.inf_board_3.add_marg_popup.for_create_visit .title_popup_red').text("Поле 'Номер полиса' не должно быть пустым");
            //$('.inf_board_3.add_marg_popup.for_create_visit, #shadow, img[src*=dateofbirth]').fadeIn();
            $('img[src*=polis]').fadeIn();
        } else if (birthday == "") {
            //$('.inf_board_3.add_marg_popup.for_create_visit .title_popup_red').text("Поле 'Дата рожденя' не должно быть пустым");
            //$('.inf_board_3.add_marg_popup.for_create_visit, #shadow, img[src*=polis]').fadeIn();
            $('img[src*=dateofbirth]').fadeIn();
        } else if (age >= 18 && is_children_pol == 1) {
            $('#for_create_visit').find('.title_popup_red').text('В детские учреждения запись взрослому населению запрещена');
            $('#for_create_visit').fadeIn();
            $('#shadow').fadeIn();
        /*} else if(n_polisa.length == 16) {
            var birthday_arr = birthday.split('.'),
                birthdayDate = new Date(birthday_arr[2], (birthday_arr[1] - 1), birthday_arr[0]),
                birthday_from_polis = GetBirthDateFromENP(n_polisa);

            if(birthday_from_polis.getTime() == birthdayDate.getTime()) {
                $('#shadow').fadeIn();
                $('#polis_auth').submit();
            } else {
                $('#for_create_visit').find('.title_popup_red').text('Вы указали неверный номер полиса или дату рождения');
                $('#for_create_visit').fadeIn();
                $('#shadow').fadeIn();
            }*/
        } else {
            $('#shadow').fadeIn();
            $('#polis_auth').submit();
        }
    });
    //submit формы авторизации с фамилией
    $('.agree_family').on('click', function(e) {
        e.preventDefault();
        
        $('#shadow').fadeIn();
        $('#polis_auth_family').submit();
    });
    //убираем сообщение об ошибке при вводе
    $('input[name=n_polisa]').live('keyup', function() {
        var this_val = $(this).val().replace(/\s/g, "");
        if(this_val != "") {
            $('img[src*=polis]').hide();
        }
    });
    $('input[name=birthday]').live('keyup', function() {
        var this_val = $(this).val().replace(/\s/g, "");
        if(this_val != "") {
            $('img[src*=dateofbirth]').fadeOut();
        }
    });
    
    //удаление талона
    $('.delete_talon').on('click', function(e) {
        e.preventDefault();
        var print_talon_text = $(this).parents('.talon_width').find('.print_talon_text').html();
        
        this_talon = $(this).parents('.talon_width');
        $('#new_talon_message .title_popup_black').html('Удаление записи на приём!');
        $('#new_talon_message .authorization_talon').html(print_talon_text).show();
        //$('#new_talon_message .accept_del_talon').show();
        $('#i_disaccept_wrap').show();
        $('#new_talon_message .print_talon_text_printdate, #new_talon_message .print_talon_text_title').hide();
        $('#new_talon_message .help_close').hide();
        $('#SetPhoneNumberModalForm').hide();
        $('#new_talon_message, #shadow').fadeIn();
        //Если лист ожидания, иначе талон
        if($(this).parent().hasClass('bottom_blue_talon')) {
            private_office.remove_talon_type = 'waiting_list';
        } else {
            private_office.remove_talon_type = 'talon';
        }
    });
    $(document).on('change', '#i_disaccept', function(){
        if($(this).is(':checked')) {
            $('#new_talon_message .accept_del_talon').show();
        } else {
            $('#new_talon_message .accept_del_talon').hide();
        }
        
    });
    $('.accept_del_talon').live('click', function(e) {
        e.preventDefault();
        var talon_id = $(this_talon).attr('id'),
            UserN_pol = $('#UserN_pol').text(),
            UserBirthday = $('#UserBirthday').text(),
            pol_wsdl = $('#pol_wsdl').text();

        $.ajax({
            type: "POST",
            url: "/private_office/3/del_talon.php",
            data: {
                del_talon : "Y",
                post : "<PatientInfo><N_POL>" + UserN_pol + "</N_POL><Birthday>" + UserBirthday + "</Birthday></PatientInfo>",
                talon_id : talon_id,
                pol_wsdl : pol_wsdl,
                talon_type : private_office.remove_talon_type
            },
            beforeSend: function() {
                $('#new_talon_message, #new_talon_message .accept_del_talon, #talon_text_for_del').fadeOut();
                $('#i_disaccept').prop('checked', false);
                $('#new_talon_message .help_close').show();
            },
            success: function() {
                var c = $.Callbacks();
                
                c.add(function() {
                    $(this_talon).remove();
                });
                c.add(function() {
                    private_office.talon_arrow_r = talons_filter($('.different_talon .active'));
                });
                c.fire();
            },
            complete: function() {
                $('#shadow').fadeOut();
            },
            error: function() {
                alert('Ошибка!');
            }
        });
    });
    
    //Печать талона
    $('.print_talon').on('click', function(e) {
        e.preventDefault();
        
        var print_talon_text = $(this).parents('.talon_width').find('.print_talon_text').html();
        
        $('#print_talon_text').html(print_talon_text);
        
        if (registratu.infomat == 1) {
			str = $('#talon_for_print').html();
			flag = window.external.PrintStub(str);
        } else {
			if(registratu.infomat == 1) {
				printer.Print(false);
			} else {
				//print();
                var objBrowse = window.navigator;
                if(objBrowse.appName == "Opera" || objBrowse.appName == "Netscape") {
                    setTimeout('window.print()', 1000);
                } else {
                    window.print();
                }
			}
		}
    });

    //Выбор следующего месяца
    $('.next_month').on('click', function(e) {
        e.preventDefault();
        
        if(waiting_list.month.current < waiting_list.month.count) {
            var width = parseInt($("#waiting_list_calendar_wrapper").parents("div").css("width"), 10);
            if(waiting_list.month.current == 0) {
                ++waiting_list.month.current;
            }
            $("#waiting_list_calendar_wrapper").animate({marginLeft : "-"+(width*waiting_list.month.current)+"px"}, 100);
            waiting_list.month.current++;
        }
    });

    //Выбор предыдущего месяца
    $('.back_month').on('click', function(e) {
        e.preventDefault();
        
        var width = parseInt($("#waiting_list_calendar_wrapper").parents("div").css("width"), 10);
        if(waiting_list.month.current == 3) {
            waiting_list.month.current -= 2;
        } else {
            --waiting_list.month.current;
        }
        
        $("#waiting_list_calendar_wrapper").animate({marginLeft : "-"+(width*waiting_list.month.current)+"px"}, 100);
    });
    
    //Выбор периода дат предварительной заявки
    $('.cld_month td').on('click', function() {
        waiting_list.days = choose_between($(this), waiting_list.days, 'cld_month');
        if(waiting_list.days.first != 0) {
            if(waiting_list.days.last != 0) {
                $('#days_between').html('с ' + $('.cld_month td.first').attr('rusdate') + '<br />по ' + $('.cld_month td.last').attr('rusdate'));
                $('input[name=dateFrom]').val($('.cld_month td.first').attr('date'));
                $('input[name=dateTo]').val($('.cld_month td.last').attr('date'));
            } else {
                $('#days_between').html('с ' + $('.cld_month td.first').attr('rusdate'));
            }
        } else {
            $('#days_between').html('');
        }
        //показываем или прячем кнопку создания листа ожидания
        if(waiting_list.days.first != 0 && waiting_list.days.last != 0 && waiting_list.times.first != 0 && waiting_list.times.last != 0) {
            $('#submit_create_waiting_list').fadeIn(100);
        } else {
            $('#submit_create_waiting_list').fadeOut(100);
        }
        //Если отсутствуют оба маркера выбора даты
        if(waiting_list.days.first == 0 && waiting_list.days.last == 0) {
            $('.cld_month td.selected').removeClass('selected');
        }
    });
    
    //Выбо периода времени предварительной заявки
    $('.cld_time td').on('click', function() {
        waiting_list.times = choose_between($(this), waiting_list.times, 'cld_time');
        if(waiting_list.times.first != 0) {
            if(waiting_list.times.last != 0) {
                var hFrom = $('.cld_time td.first').text().slice(0, -2),
                    hTo = $('.cld_time td.last').text().slice(0, -2),
                    first_time = hFrom + ':00',
                    last_time = hTo + ':00';
                    
                $('#times_between').html(', с ' + first_time + ' по ' + last_time);
                $('input[name=hFrom]').val(hFrom);
                $('input[name=hTo]').val(hTo);
            } else {
                var first_time = $('.cld_time td.first').text().slice(0, -2) + ':00';
                
                $('#times_between').html(', с ' + first_time);
            }
        } else {
            $('#times_between').html('');
        }
        //показываем или прячем кнопку создания листа ожидания
        if(waiting_list.days.first != 0 && waiting_list.days.last != 0 && waiting_list.times.first != 0 && waiting_list.times.last != 0) {
            $('#submit_create_waiting_list').fadeIn(100);
        } else {
            $('#submit_create_waiting_list').fadeOut(100);
        }
        //Если отсутствуют оба маркера выбора времени
        if(waiting_list.times.first == 0 && waiting_list.times.last == 0) {
            $('.cld_time td.selected').removeClass('selected');
        }
        //console.log($(this).text().slice(0, -2));
    });
    
    //создание листа ожидания
    $('#submit_create_waiting_list').on('click', function(e) {
        e.preventDefault();
        localStorage.setItem('step', '6');
        localStorage.setItem('talon_step6', $('.inf_board_l_b_list_ogidaniy').html());
        $('#shadow').fadeIn(100);
        $('#form_create_waiting_list').submit();
    });
    
    //Подтвердить талон листа ожидания
    $('.talon_accept').on('click', function(e) {
        e.preventDefault();
        var talon = $(this).parents('.talon_width')
            id = $(talon).attr('id');
        if ($('#UserN_pol').text() == "") {
            var data = {Phone : $('#UserPhone').text(), RIDN : $('#UserRIDN').text(), id : id};
        } else {
            var data = {n_polisa : $('#UserN_pol').text(), id : id}
        }
        
        $.ajax({
            type: "POST",
            url: "/private_office/3/confirm.php",
            data: data,
            beforeSend: function() {
                $('#shadow').fadeIn(100);
            },
            success: function() {
                $(talon).find('.orange_talon').removeClass('orange_talon').addClass('green_talon');
                $(talon).find('.top_orange_talon').removeClass('top_orange_talon').addClass('top_green_talon');
                $(talon).find('.bottom_orange_talon').removeClass('bottom_orange_talon').addClass('bottom_green_talon');
                $(this).removeClass('talon_accept').addClass('print_talon').text('Распечатать талон');
            },
            complete: function() {
                $('#shadow').fadeOut(100);
            },
            error: function() {
                alert('Ошибка!');
            }
        });
    });
    
    //Отправить обращение в тех поддержку
    $('.obr_sv_otpravit').on('click', function(e) {
        e.preventDefault();
        if($('form#question input[name=name]').val() == "") {
            $('.title_popup_red').text('Укажите ваше имя');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else if($('form#question input[name=email]').val() == "") {
            $('.title_popup_red').text('Укажите вашу электронную почту');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else if($('form#question input[name=naspunkt]').val() == "") {
            $('.title_popup_red').text('Укажите населенный пункт');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else if($('form#question input[name=company]').val() == "") {
            $('.title_popup_red').text('Укажите медицинское учреждение');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else if($('form#question input[name=question_title]').val() == "") {
            $('.title_popup_red').text('Укажите заголовок');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else if($('form#question textarea[name=question_text]').val() == "") {
            $('.title_popup_red').text('Вы забыли написать вопрос');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else {
            $('form#question').submit();
            $('#shadow').fadeIn(100);
        }
    });
    
    //Выбор населенного пункта в форме обратной связи
    $('#naspunkt_wrap .sel_option').live('click', function() {
        if($(this).attr('value') != "") {
            $.ajax({
                type: "POST",
                url: "/feedback/get_lpu.php",
                data: {city_id : $(this).attr('value')},
                beforeSend: function() {
                    $('#shadow').fadeIn(100);
                },
                success: function(data){
                    $('#company_wrap .sel_wrap').html(data);
                },
                complete: function() {
                    $('#shadow').fadeOut(100);
                },
                error: function(){
                    alert('Ошибка!')
                }
            });
        }
    });
    
    //Поиск вопросов
    $('.obr_sv_search').live('click', function(e) {
        e.preventDefault();
        if($('input[name=search_for_questions]').val() == '') {
            $('.title_popup_red').text('Вы забыли написать вопрос');
            $('.inf_board_3, #shadow').fadeIn(100);
        } else {
            $('#shadow').fadeIn(100);
            $('form#search_for_questions').submit();
        }
    });
    
    //Показ и скрытие клавиатуры
    $('.search_a').live('click', function(e) {
        e.preventDefault();
        if ($("#keyboard").css('bottom') == "-335px") {
            if(registratu.infomat == 1) {
                if($(this).val() == "Поиск") {
                    keyboard.input_val = "";
                } else {
                    keyboard.input_val = $(this).prev().val();
                }
                keyboard.input = $(this);
                $('#keyboard').animate({bottom : '-3'}, 200);
            }
        } else {
            $('#keyboard').animate({bottom : '-335'}, 200);
        }
        $(this).prev().focus();
    });
    $('.authorization_a').live('click', function(e) {
        e.preventDefault();
        if ($("#keyboard_digital").css('right') == "-275px") {
            if(registratu.infomat == 1) {
                if($(this).val() == "Поиск") {
                    keyboard.input_val = "";
                } else {
                    keyboard.input_val = $(this).prev().val();
                }
                keyboard.input = $(this);
                $('#keyboard_digital').animate({right : '0'}, 200);
            }
        } else {
            $('#keyboard_digital').animate({right : '-275'}, 200);
        }
        $(this).prev().focus();
    });
    $('.search').focus(function() {
        if(registratu.infomat == 1) {
            if($(this).val() == "Поиск") {
                keyboard.input_val = "";
            } else {
                keyboard.input_val = $(this).val();
            }
            keyboard.input = $(this);
            $('#keyboard').animate({bottom : '-3'}, 200);
        }
    });
    $('.authorization').focus(function() {
        if(registratu.infomat == 1) {
            if($(this).val() == "Поиск") {
                keyboard.input_val = "";
            } else {
                keyboard.input_val = $(this).val();
            }
            keyboard.input = $(this);
            $('#keyboard_digital').animate({right : '0'}, 200);
        }
    });
    $('#n_polisa_input_for_authorize, #birthday_input_for_authorize').keypress(function(e) {
        if(e.which == 13) {
            $('.agree').trigger('click');
        }
    });
    $('#close_keyboard').live('click', function(e) {
        e.preventDefault();
        $('#keyboard').animate({bottom : '-335'}, 200);
    })
    $('#close_keyboard_digital').live('click', function(e) {
        e.preventDefault();
        $('#keyboard_digital').animate({right : '-275'}, 200);
    });
    $('#close_keyboard').live('mousedown', function() {
        $(this).addClass('active_kb_but');
    });
    $('#close_keyboard').live('mouseup', function() {
        $(this).removeClass('active_kb_but');
    });
    $('.backspace_a').live('mousedown', function() {
        $(this).addClass('active_kb_but');
    });
    $('.backspace_a').live('mouseup', function() {
        $(this).removeClass('active_kb_but');
    });
    //Печать на клавиатуре
    $('#keyboard a, #keyboard_digital a').live('click', function(e) {
        e.preventDefault();
            
        if($(this).hasClass('symbol')) {
            
            $(keyboard.input).focus();
            if($(this).hasClass('uppercase')) {
                keyboard.input_val += $(this).find('span').eq(1).text().toUpperCase();
                //Убираем shift
        		if (keyboard.shift === true) {
        			if (keyboard.capslock === false) {
                        $('.symbol').toggleClass('uppercase');
                        //$('.capslock_a').toggleClass('active_kb_but_green');
        			}
                    $('.symbol').removeClass('uppercase');
        			keyboard.shift = false;
                    $('.shift_a').removeClass('active_kb_but');
        		}
            } else {
                keyboard.input_val += $(this).find('span').eq(1).text();
            }
            $('.symbol').removeClass('active_kb_but');
            $(this).addClass('active_kb_but');
            
            $(keyboard.input).val(keyboard.input_val).keyup();
        } else if($(this).hasClass('backspace_a')) {
            $(keyboard.input).focus();
            keyboard.input_val = keyboard.input_val.substr(0, keyboard.input_val.length - 1)
            $(keyboard.input).val(keyboard.input_val).keyup();
        } else if($(this).hasClass('shift_a')) {
            $('.symbol').toggleClass('uppercase');
            if(keyboard.capslock === true) {
                $('.capslock_a').toggleClass('active_kb_but_green');
                keyboard.capslock = false;
                keyboard.shift = false;
            } else {
                if(keyboard.shift === true) {
                    keyboard.shift = false;
                    $('.shift_a').removeClass('active_kb_but');
                } else {
                    keyboard.shift = true;
                    $('.shift_a').addClass('active_kb_but');
                }
                //keyboard.shift = (keyboard.shift === true) ? false : true;
            }
			return false;
        } else if($(this).hasClass('capslock_a')) {
            if(keyboard.capslock === false) {
                $('.symbol').addClass('uppercase');
                $(this).addClass('active_kb_but_green');
                keyboard.capslock = true;
            } else {
                $('.symbol').removeClass('uppercase');
                $(this).removeClass('active_kb_but_green');
                keyboard.capslock = false;
            }
			/*$('.symbol').toggleClass('uppercase');
            $(this).toggleClass('active_kb_but_green');
			keyboard.capslock = true;
			return false;*/
		}
        
    });

    $('.footer_phones__phone').hover(function() {
        $(this).find('img').fadeIn();
    }, function() {
        $(this).find('img').fadeOut();
    });
});

      $(document).ready(function() {   

           
var text = 0;
var left = 0;


        $("#element").draggable({    
                containment: '#glassbox',    
                scroll: false  
         }).mousemove(function(){   


           
            
        
            var wid = $("#element").position();
            text = 0;
            
            left = wid.left;
          

            if(wid.left<"83"){  
                $(".b-thermometer").children("p").children("span").fadeIn(500);
            }
            else if(wid.left>"83" && wid.left<"239"){ 
                $(".b-thermometer").children("p").children("span").fadeOut(500);
            }
            if(wid.left>"239"){
                $(".b-thermometer").children("p").children("span").fadeIn(1000);
            } 

            if(wid.left=="3"){ $("#b-sel").attr("value", "33");   }
            if(wid.left=="7"){ $("#b-sel").attr("value", "33,1"); }
            if(wid.left=="11"){ $("#b-sel").attr("value", "33,2"); }
            if(wid.left=="15"){ $("#b-sel").attr("value", "33,3"); }
            if(wid.left=="19"){ $("#b-sel").attr("value", "33,4"); }
            if(wid.left=="23"){ $("#b-sel").attr("value", "33,5"); }
            if(wid.left=="27"){ $("#b-sel").attr("value", "33,6"); }
            if(wid.left=="31"){ $("#b-sel").attr("value", "33,7"); }
            if(wid.left=="35"){ $("#b-sel").attr("value", "33,8"); }
            if(wid.left=="39"){ $("#b-sel").attr("value", "33,9"); }


            if(wid.left=="43"){ $("#b-sel").attr("value", "34"); }
            if(wid.left=="47"){ $("#b-sel").attr("value", "34,1"); }
            if(wid.left=="51"){ $("#b-sel").attr("value", "34,2"); }
            if(wid.left=="55"){ $("#b-sel").attr("value", "34,3"); }
            if(wid.left=="59"){ $("#b-sel").attr("value", "34,4"); }
            if(wid.left=="63"){ $("#b-sel").attr("value", "34,5"); }
            if(wid.left=="67"){ $("#b-sel").attr("value", "34,6"); }
            if(wid.left=="71"){ $("#b-sel").attr("value", "34,7"); }
            if(wid.left=="75"){ $("#b-sel").attr("value", "34,8"); }
            if(wid.left=="79"){ $("#b-sel").attr("value", "34,9"); }

            if(wid.left=="83"){ $("#b-sel").attr("value", "35"); }
            if(wid.left=="87"){ $("#b-sel").attr("value", "35,1"); }
            if(wid.left=="91"){ $("#b-sel").attr("value", "35,2"); }
            if(wid.left=="95"){ $("#b-sel").attr("value", "35,3"); }
            if(wid.left=="99"){ $("#b-sel").attr("value", "35,4"); }
            if(wid.left=="103"){ $("#b-sel").attr("value", "35,5"); }
            if(wid.left=="107"){ $("#b-sel").attr("value", "35,6"); }
            if(wid.left=="111"){ $("#b-sel").attr("value", "35,7"); }
            if(wid.left=="115"){ $("#b-sel").attr("value", "35,8"); }
            if(wid.left=="119"){ $("#b-sel").attr("value", "35,9"); }

            if(wid.left=="123"){ $("#b-sel").attr("value", "36"); }
            if(wid.left=="127"){ $("#b-sel").attr("value", "36,1"); }
            if(wid.left=="131"){ $("#b-sel").attr("value", "36,2"); }
            if(wid.left=="135"){ $("#b-sel").attr("value", "36,3"); }
            if(wid.left=="139"){ $("#b-sel").attr("value", "36,4"); }
            if(wid.left=="143"){ $("#b-sel").attr("value", "36,5"); }
            if(wid.left=="147"){ $("#b-sel").attr("value", "36,6"); }
            if(wid.left=="151"){ $("#b-sel").attr("value", "36,7"); }
            if(wid.left=="155"){ $("#b-sel").attr("value", "36,8"); }

            if(wid.left=="159"){ $("#b-sel").attr("value", "36,9"); }

            if(wid.left=="163"){ $("#b-sel").attr("value", "37"); }
            if(wid.left=="167"){ $("#b-sel").attr("value", "37,1"); }
            if(wid.left=="171"){ $("#b-sel").attr("value", "37,2"); }
            if(wid.left=="175"){ $("#b-sel").attr("value", "37,3"); }
            if(wid.left=="179"){ $("#b-sel").attr("value", "37,4"); }
            if(wid.left=="183"){ $("#b-sel").attr("value", "37,5"); }
            if(wid.left=="187"){ $("#b-sel").attr("value", "37,6"); }
            if(wid.left=="191"){ $("#b-sel").attr("value", "37,7"); }
            if(wid.left=="195"){ $("#b-sel").attr("value", "37,8"); }
            if(wid.left=="199"){ $("#b-sel").attr("value", "37,9"); }

            if(wid.left=="203"){ $("#b-sel").attr("value", "38"); }
            if(wid.left=="207"){ $("#b-sel").attr("value", "38,1"); }
            if(wid.left=="211"){ $("#b-sel").attr("value", "38,2"); }
            if(wid.left=="215"){ $("#b-sel").attr("value", "38,3"); }
            if(wid.left=="219"){ $("#b-sel").attr("value", "38,4"); }
            if(wid.left=="223"){ $("#b-sel").attr("value", "38,5"); }
            if(wid.left=="227"){ $("#b-sel").attr("value", "38,6"); }
            if(wid.left=="231"){ $("#b-sel").attr("value", "38,7"); }
            if(wid.left=="235"){ $("#b-sel").attr("value", "38,8"); }
            if(wid.left=="239"){ $("#b-sel").attr("value", "38,9"); }

            if(wid.left=="243"){ $("#b-sel").attr("value", "39"); }
            if(wid.left=="247"){ $("#b-sel").attr("value", "39,1"); }
            if(wid.left=="251"){ $("#b-sel").attr("value", "39,2"); }
            if(wid.left=="255"){ $("#b-sel").attr("value", "39,3"); }
            if(wid.left=="259"){ $("#b-sel").attr("value", "39,4"); }
            if(wid.left=="263"){ $("#b-sel").attr("value", "39,5"); }
            if(wid.left=="267"){ $("#b-sel").attr("value", "39,6"); }
            if(wid.left=="271"){ $("#b-sel").attr("value", "39,7"); }
            if(wid.left=="275"){ $("#b-sel").attr("value", "39,8"); }
            if(wid.left=="279"){ $("#b-sel").attr("value", "39,9"); }

            if(wid.left=="283"){ $("#b-sel").attr("value", "40"); }
            if(wid.left=="287"){ $("#b-sel").attr("value", "40,1"); }
            if(wid.left=="291"){ $("#b-sel").attr("value", "40,2"); }
            if(wid.left=="295"){ $("#b-sel").attr("value", "40,3"); }
            if(wid.left=="299"){ $("#b-sel").attr("value", "40,4"); }
            if(wid.left=="303"){ $("#b-sel").attr("value", "40,5"); }
            if(wid.left=="307"){ $("#b-sel").attr("value", "40,6"); }
            if(wid.left=="311"){ $("#b-sel").attr("value", "40,7"); }
            if(wid.left=="315"){ $("#b-sel").attr("value", "40,8"); }
            if(wid.left=="319"){ $("#b-sel").attr("value", "40,9"); }


            if(wid.left=="323"){ $("#b-sel").attr("value", "41"); }
            if(wid.left=="327"){ $("#b-sel").attr("value", "41,1"); }
            if(wid.left=="331"){ $("#b-sel").attr("value", "41,2"); }
            if(wid.left=="335"){ $("#b-sel").attr("value", "41,3"); }
            if(wid.left=="339"){ $("#b-sel").attr("value", "41,4"); }
            if(wid.left=="343"){ $("#b-sel").attr("value", "41,5"); }
            if(wid.left=="347"){ $("#b-sel").attr("value", "41,6"); }
            if(wid.left=="351"){ $("#b-sel").attr("value", "41,7"); }
            if(wid.left=="355"){ $("#b-sel").attr("value", "41,8"); }
            if(wid.left=="359"){ $("#b-sel").attr("value", "41,9"); }
            if(wid.left=="363"){ $("#b-sel").attr("value", "42"); }

            
       


 

               
             
           


          
            



         }).mouseup(function(){    

              

            if(text!=0){ left = text;}
            else{ left = wid.left;  }

           
           
            if(left=="3"){  $("#element").animate({ left: '3'},1300); }
            if(left=="7"){  $("#element").animate({ left: '7'},1300); }
            if(left=="11"){ $("#element").animate({ left: '11'},1300); }
            if(left=="15"){ $("#element").animate({ left: '15'},1300); }
            if(left=="19"){ $("#element").animate({ left: '19'},1300); }
            if(left=="23"){ $("#element").animate({ left: '23'},1300); }
            if(left=="27"){ $("#element").animate({ left: '27'},1300); }
            if(left=="31"){ $("#element").animate({ left: '31'},1300); }
            if(left=="35"){ $("#element").animate({ left: '35'},1300); }
            if(left=="39"){ $("#element").animate({ left: '39'},1300); }
            


             if(left=="43"){ $("#element").animate({ left: '43'},1300); }
            if(left=="47"){ $("#element").animate({ left: '47'},1300); }
            if(left=="51"){ $("#element").animate({ left: '51'},1300); }
            if(left=="55"){ $("#element").animate({ left: '55'},1300); }
            if(left=="59"){ $("#element").animate({ left: '59'},1300); }
            if(left=="63"){ $("#element").animate({ left: '63'},1300); }
            if(left=="67"){ $("#element").animate({ left: '67'},1300); }
            if(left=="71"){ $("#element").animate({ left: '71'},1300); }
            if(left=="75"){ $("#element").animate({ left: '75'},1300); }
            if(left=="79"){ $("#element").animate({ left: '79'},1300); }
            
            if(left=="83"){ $("#element").animate({ left: '83'},1300); }
            if(left=="87"){ $("#element").animate({ left: '87'},1300); }
            if(left=="91"){ $("#element").animate({ left: '91'},1300); }
            if(left=="95"){ $("#element").animate({ left: '95'},1300); }
            if(left=="99"){ $("#element").animate({ left: '99'},1300); }
            if(left=="103"){ $("#element").animate({ left: '103'},1300); }
            if(left=="107"){ $("#element").animate({ left: '107'},1300); }
            if(left=="111"){ $("#element").animate({ left: '111'},1300); }
            if(left=="115"){ $("#element").animate({ left: '115'},1300); }
            if(left=="119"){ $("#element").animate({ left: '119'},1300); }

            if(left=="123"){ $("#element").animate({ left: '123'},1300); }
            if(left=="127"){ $("#element").animate({ left: '127'},1300); }
            if(left=="131"){ $("#element").animate({ left: '131'},1300); }
            if(left=="135"){ $("#element").animate({ left: '135'},1300); }
            if(left=="139"){ $("#element").animate({ left: '139'},1300); }
            if(left=="143"){ $("#element").animate({ left: '143'},1300); }
            if(left=="147"){ $("#element").animate({ left: '147'},1300); }
            if(left=="151"){ $("#element").animate({ left: '151'},1300); }
            if(left=="155"){ $("#element").animate({ left: '155'},1300); }
            if(left=="159"){ $("#element").animate({ left: '159'},1300); }

            if(left=="163"){ $("#element").animate({ left: '163'},1300); }
            if(left=="167"){ $("#element").animate({ left: '167'},1300); }
            if(left=="171"){ $("#element").animate({ left: '171'},1300); }
            if(left=="175"){ $("#element").animate({ left: '175'},1300); }
            if(left=="179"){ $("#element").animate({ left: '179'},1300); }
            if(left=="183"){ $("#element").animate({ left: '183'},1300); }
            if(left=="187"){ $("#element").animate({ left: '187'},1300); }
            if(left=="191"){ $("#element").animate({ left: '191'},1300); }
            if(left=="195"){ $("#element").animate({ left: '195'},1300); }
            if(left=="199"){ $("#element").animate({ left: '199'},1300); }

            if(left=="203"){ $("#element").animate({ left: '203'},1300); }
            if(left=="207"){ $("#element").animate({ left: '207'},1300); }
            if(left=="211"){ $("#element").animate({ left: '211'},1300); }
            if(left=="215"){ $("#element").animate({ left: '215'},1300); }
            if(left=="219"){ $("#element").animate({ left: '219'},1300); }
            if(left=="223"){ $("#element").animate({ left: '223'},1300); }
            if(left=="227"){ $("#element").animate({ left: '227'},1300); }
            if(left=="231"){ $("#element").animate({ left: '231'},1300); }
            if(left=="235"){ $("#element").animate({ left: '235'},1300); }
            if(left=="239"){ $("#element").animate({ left: '239'},1300); }

            if(left=="243"){ $("#element").animate({ left: '243'},1300); }
            if(left=="247"){ $("#element").animate({ left: '247'},1300); }
            if(left=="251"){ $("#element").animate({ left: '251'},1300); }
            if(left=="255"){ $("#element").animate({ left: '255'},1300); }
            if(left=="259"){ $("#element").animate({ left: '259'},1300); }
            if(left=="263"){ $("#element").animate({ left: '263'},1300); }
            if(left=="267"){ $("#element").animate({ left: '267'},1300); }
            if(left=="271"){ $("#element").animate({ left: '271'},1300); }
            if(left=="275"){ $("#element").animate({ left: '275'},1300); }
            if(left=="279"){ $("#element").animate({ left: '279'},1300); }

            if(left=="283"){ $("#element").animate({ left: '283'},1300); }
            if(left=="287"){ $("#element").animate({ left: '287'},1300); }
            if(left=="291"){ $("#element").animate({ left: '291'},1300); }
            if(left=="295"){ $("#element").animate({ left: '295'},1300); }
            if(left=="299"){ $("#element").animate({ left: '299'},1300); }
            if(left=="303"){ $("#element").animate({ left: '303'},1300); }
            if(left=="307"){ $("#element").animate({ left: '307'},1300); }
            if(left=="311"){ $("#element").animate({ left: '311'},1300); }
            if(left=="315"){ $("#element").animate({ left: '315'},1300); }
            if(left=="319"){ $("#element").animate({ left: '319'},1300); }

             if(left=="323"){ $("#element").animate({ left: '323'},1300); }
            if(left=="327"){ $("#element").animate({ left: '327'},1300); }
            if(left=="331"){ $("#element").animate({ left: '331'},1300); }
            if(left=="335"){ $("#element").animate({ left: '335'},1300); }
            if(left=="339"){ $("#element").animate({ left: '339'},1300); }
            if(left=="343"){ $("#element").animate({ left: '343'},1300); }
            if(left=="347"){ $("#element").animate({ left: '347'},1300); }
            if(left=="351"){ $("#element").animate({ left: '351'},1300); }
            if(left=="355"){ $("#element").animate({ left: '355'},1300); }
            if(left=="359"){ $("#element").animate({ left: '359'},1300); }
            if(left=="363"){ $("#element").animate({ left: '363'},1300); }

            



            });
               
                
              
      
  
          $('#b-sel').blur(function(){
            
            var val = $("#b-sel").val();
            var i =32.9;
            var y = 0;
            var e = 0;
             text = 0;
             var nn=0;
             var mn=0;
             var mm=0;


val = val.replace(/[^\d.,]/g, ''); //любой символ кроме цифраы заменяем на пустоту
if(val.replace(/[^\w]/, '.')){ val = val.replace(/[^\w]/, '.'); }



      if(val<33){val=33; $("#b-sel").val("33");}
      if(val>42){val=42; $("#b-sel").val("42");}

            for ( i; val != i; y++ ) {

                
                i = i +0.1;
             
                i = i.toFixed(1); 
                i = Number(i);


                text = text + 4;
                if(text==4){text = text - 1;}
            


        

            if(val<"35"){  
                $(".b-thermometer").children("p").children("span").fadeIn(500);
            }
            else if(val>"35" && val<"39"){ 
                $(".b-thermometer").children("p").children("span").fadeOut(500);
            }
            if(val>"39"){
                $(".b-thermometer").children("p").children("span").fadeIn(1000);
            } 
            };
           

        
            $("#element").trigger('mouseup');
                    
         });

    var gradus = $(".b-thermometer").children("p").children("span");
    $(gradus).mousemove(function(){ 
        event.stopPropagation();


    });





jQuery(".niceCheck").mousedown(
/* при клике на чекбоксе меняем его вид и значение */
function() {

     changeCheck(jQuery(this));
     
});


jQuery(".niceCheck").each(
/* при загрузке страницы нужно проверить какое значение имеет чекбокс и в соответствии с ним выставить вид */
function() {
     
     changeCheckStart(jQuery(this));
     
});

                                        });

function changeCheck(el)
/* 
    функция смены вида и значения чекбокса
    el - span контейнер дял обычного чекбокса
    input - чекбокс
*/
{
     var el = el,
          input = el.find("input").eq(0);
     if(!input.attr("checked")) {
        el.css("background-position","0 -20px");    
        input.attr("checked", true)
    } else {
        el.css("background-position","0 0");    
        input.attr("checked", false)
    }
     return true;
}

function changeCheckStart(el)
/* 
    если установлен атрибут checked, меняем вид чекбокса
*/
{
var el = el,
        input = el.find("input").eq(0);
      if(input.attr("checked")) {
        el.css("background-position","0 -17px");    
        }
     return true;
}



