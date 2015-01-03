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


        // TODO: implement below in Angular

        $('.button.delete').click(function(){
            $(this).parent().parent().remove();
        });

        $('.button.rotate').click(function(){
            var component = $(this).parent().parent().find('img.component-image');
            var deg = getRotationDegrees(component);
            console.debug(deg);
            deg += 90;
            component.css('transform', 'rotate('+deg+'deg)');
        });

    }, 500); // hack to wait until angular loads this template to bind events
});


// http://stackoverflow.com/a/11840120
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle +=360 : angle;
}
