$(document).ready(function(){
    var dimensions_midpoint = Math.ceil(barn_dimensions.length / 2);
    for (var i = 0; i < dimensions_midpoint; i++) {
        appendBarnRadioButton(barn_dimensions[i], '#dimensions .col.c1');
    }
    for (var i = dimensions_midpoint; i < barn_dimensions.length; i++) {
        appendBarnRadioButton(barn_dimensions[i], '#dimensions .col.c2');
    }

    $('.radio-option').hover(
        function(){
            var width = $(this).attr('data-width-feet');
            var height = $(this).attr('data-length-feet');
            sizeBarnDiagram('.barn-diagram.top', width, height);
        },
        function(){
            var selected_option = $('#dimensions input:radio:checked');
            if (selected_option.length) {
                var width = selected_option.parent().attr('data-width-feet');
                var height = selected_option.parent().attr('data-length-feet');
                sizeBarnDiagram('.barn-diagram.top', width, height);
            }
        }
    );
});

function sizeBarnDiagram(selector, width, height) {
    var multiplier = 10;
    $(selector).css({'width': width*multiplier,
                     'height': height*multiplier}).find('.dimension').text(width+'x'+height);
}

function appendBarnRadioButton(dimension, elem) {
    var container = $('<div/>', {
        'class': 'radio-option',
        'data-width-feet': dimension.width.feet,
        'data-width-inches': dimension.width.inches,
        'data-length-feet': dimension.length.feet,
        'data-length-inches': dimension.length.inches,
        'data-height-feet': dimension.height.feet,
        'data-height-inches': dimension.height.inches,
    }).appendTo(elem);

    var uid = "s" + dimension.width.feet + "x" + dimension.length.feet + "x" + dimension.height.feet + dimension.height.inches;
    var human_readable = dimension.width.feet + "'W x " + dimension.length.feet + "'L x " + dimension.height.feet + "'";
    if (dimension.height.inches) {
        human_readable += dimension.height.inches + "\"H";
    } else {
        human_readable += "H";
    }

    $('<input/>', {
        type: 'radio',
        id: uid,
        value: uid,
        name: 'dimension'
    }).appendTo(container);

    $('<label/>', {
        'for': uid,
        text: human_readable
    }).appendTo(container);
}

var barn_dimensions = [
    {
        width:
            {
                feet: 8,
                inches: 0
            },
        length:
            {
                feet: 8,
                inches: 0
            },
        height:
            {
                feet: 8,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 8,
                inches: 0
            },
        length:
            {
                feet: 10,
                inches: 0
            },
        height:
            {
                feet: 8,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 8,
                inches: 0
            },
        length:
            {
                feet: 12,
                inches: 0
            },
        height:
            {
                feet: 8,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 10,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 12,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 14,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 16,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 18,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 10,
                inches: 0
            },
        length:
            {
                feet: 20,
                inches: 0
            },
        height:
            {
                feet: 9,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 12,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 14,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 16,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 18,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 20,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 12,
                inches: 0
            },
        length:
            {
                feet: 24,
                inches: 0
            },
        height:
            {
                feet: 10,
                inches: 0
            }
    },
    {
        width:
            {
                feet: 14,
                inches: 0
            },
        length:
            {
                feet: 20,
                inches: 0
            },
        height:
            {
                feet: 11,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 14,
                inches: 0
            },
        length:
            {
                feet: 24,
                inches: 0
            },
        height:
            {
                feet: 11,
                inches: 5
            }
    },
    {
        width:
            {
                feet: 16,
                inches: 0
            },
        length:
            {
                feet: 20,
                inches: 0
            },
        height:
            {
                feet: 12,
                inches: 3
            }
    },
    {
        width:
            {
                feet: 16,
                inches: 0
            },
        length:
            {
                feet: 24,
                inches: 0
            },
        height:
            {
                feet: 12,
                inches: 3
            }
    },
    {
        width:
            {
                feet: 16,
                inches: 0
            },
        length:
            {
                feet: 30,
                inches: 0
            },
        height:
            {
                feet: 12,
                inches: 3
            }
    },
    {
        width:
            {
                feet: 16,
                inches: 0
            },
        length:
            {
                feet: 32,
                inches: 0
            },
        height:
            {
                feet: 12,
                inches: 3
            }
    },
];
