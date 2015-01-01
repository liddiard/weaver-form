$(document).ready(function(){
    window.setTimeout(function(){

        $('.draggable').draggable({
            containment: 'document',
            helper: 'clone',
            appendTo: 'body',
            start: function(){
                $(this).css('display', 'none');
            },
            stop: function(){
                $(this).css('display', 'block');
            }
        });

        $('.draggable').resizable();
        
        $('#blueprint').droppable({
            accept: '.draggable',
            drop: function(event, ui){
                var blueprint = $(this);
                ui.draggable.appendTo(blueprint).css({
                    position: 'absolute',
                    top: ui.offset.top - $(this).offset().top,
                    left: ui.offset.left - $(this).offset().left
                });
            }
        });

    }, 500);
});
