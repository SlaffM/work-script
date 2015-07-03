$(document).ready(function(){

    if (!$.browser.webkit) {

        $('INPUT[placeholder], TEXTAREA[placeholder]').blur(function(){

            if ($(this).val()=='') {
                $(this).val($(this).attr('placeholder'));
                $(this).addClass('m-placeholder');
            }

        }).focus(function(){

                $(this).removeClass('m-placeholder');
                if ($(this).val()==$(this).attr('placeholder'))
                    $(this).val('');

            }).each(function(){

                if ( ($(this).val()=='') || ($(this).val()==$(this).attr('placeholder')) ) {
                    $(this).val( $(this).attr('placeholder') );
                    $(this).addClass('m-placeholder');
                }

                var form = $(this).closest('FORM');
                if (form.length)
                    form.submit(function(){
                        if ($(this).val()==$(this).attr('placeholder'))
                            $(this).val('');
                    });

            });

    }

});