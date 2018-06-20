var utils = (function () {

    function translate_linear_slider_value(actual_value) {
        return actual_value/100;
    }

    function translate_parabolic_slider_value(actual_x) {
        // actual_x coordinate is the 'Gain if correct 1 point'
        var translated_x = actual_x + 50;
        if (translated_x <= 50) {
            return 0;
        }
        else if (translated_x >= 180) {
            return 1;
        }
        else {
            return (translated_x-50)/260 + 0.5;
        }
    }

    function generate_mapped_values (group, answers) {
        var mapped_values = {};
        if (group === 'parabolic') {
            for (var i = 0; i < answers.length; i += 1) {
                mapped_values[answers[i].number] = translate_parabolic_slider_value(answers[i].x);
            }
        }
        else if (group === 'linear') {
            for (i = 0; i < answers.length; i += 1) {
                mapped_values[answers[i].number] = translate_linear_slider_value(answers[i].x);
            }
        }
        return mapped_values;
    }

    function sanitize_answer (string) {
        // strip all whitespace characters and convert string to lowercase
        return string.replace(/\s/g, "").toLowerCase();
    }

    function calculate_brier(user_answers, mapped_values, predictive_standard_answers, subjective_standard_answers) {
        if (user_answers === undefined || mapped_values === undefined || predictive_standard_answers === undefined || subjective_standard_answers) {
            return undefined;
        }

        var gain_loss = [];

        for (var i = 0; i < user_answers.length; i += 1) {
            var choice = user_answers[i].selection;
            var question_type = user_answers[i].type;
            var question_actual_index = user_answers[i].original_index;
            var value = mapped_values[i];
            var standard_answer = '';
            if (question_type === 'predictive') {
                standard_answer = predictive_standard_answers[question_actual_index].answer;
            }
            else {
                standard_answer = subjective_standard_answers[question_actual_index].answer;
            }

            var comparison = sanitize_answer(standard_answer) === sanitize_answer(choice);
            if (sanitize_answer(standard_answer) === 'no') {
                if (comparison) {
                    gain_loss.push(
                        (1 / 3) * value * value - 1 / 12
                    );
                }
                else {
                    gain_loss.push(
                        -1 * (value * value - 0.25)
                    );
                }
            }
            else {
                if (comparison) {
                    gain_loss.push(
                        (-1) * (value - 1) * (value - 1) + 0.25
                    );
                }
                else {
                    gain_loss.push(
                        -1 * ((-3) * (value - 1) * (value - 1) + 0.75)
                    );
                }
            }
        }

        return gain_loss;
    }

    function download_file(id, group, answers, time) {
        var $download_tag = $('#download_tag');
        if ($download_tag.length === 0) {

            // generate mapped_values
            var mapped_values = generate_mapped_values(group, answers);
            var brier_score = calculate_brier(); // THIS FUNCTION SHOULD NOT BE INVOKED

            var complete_json = {
                'ID': id,
                'GROUP': group,
                'ANSWERS': answers,
                'TIME': time,
                'BRIER': brier_score
            };
            var string_data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(complete_json));
            $download_tag = $('<a>', {
                'id': 'download_tag',
                'style': 'display:none;'
            });
            $download_tag.attr('href', string_data).attr('download', id+'.json');
            $('.graph').append($download_tag);
        }
        $download_tag[0].click();
    }


    function play_sound () {
        var sound = $("#audio")[0];
        sound.play();
    }

    function break_timer(time, callback) {
        // This function generates a timer and when time's up the timer disappears
        $('.graph').append('<div class="temporary_loading_container"><div class="loading"></div></div>');


        setTimeout(function () {
            $('.temporary_loading_container').remove();
            callback();
        }, time);
    }


    function load_questions(callback) {

        // Fisher-Yates Shuffle: https://bost.ocks.org/mike/shuffle/
        function shuffle(array) {
            // array is intended to be an array of indices
            // the array is deep-copied (provided that ARRAY MUST ONLY BE A PURE JSON OBJECT!)
            var new_array = JSON.parse(JSON.stringify(array));
            var counter = new_array.length;
            while (counter > 0) {
                var index = Math.floor(Math.random() * counter);
                counter -= 1;
                // swapping
                var temp = new_array[counter];
                new_array[counter] = new_array[index];
                new_array[index] = temp;
            }
            return new_array;
        }

        // the amount of questions you want to add to the final questionnaire
        var subjective_count = 5;
        var predictive_count = 5;

        // the arrays at this stage is sc till JSON object
        var subjective_sliced = [];
        var predictive_sliced = [];

        // the array is still JSON format with the order: first subjetcive, second predive
        var final_questions = [];

        // deferred call is needed
        $.when(
            $.getJSON("questions/subjective_questions.json", function (json) {
                // method to create random list is first shaffle all indices and the slice the top count
                var length = json.length;
                // create a list of indices
                var all_indices = Array.from(Array(length).keys());
                var sliced_indices = shuffle(all_indices).slice(0, subjective_count);
                for (var i = 0; i < sliced_indices.length; i++) {
                    var index = sliced_indices[i];
                    // add category metadata
                    json[index].category = 'subjective';
                    subjective_sliced.push(json[index]);
                }
            }),

            $.getJSON('questions/predictive_questions.json', function (json) {
                var length = json.length;
                var all_indices = Array.from(Array(length).keys());
                var sliced_indices = shuffle(all_indices).slice(0, predictive_count);
                for (var i = 0; i < sliced_indices.length; i++) {
                    var index = sliced_indices[i];
                    // add category metadata
                    json[index].category = 'predictive';
                    predictive_sliced.push(json[index]);
                }
            })
        ).then(
            function success () {
                // success ajax calls
                // zip two arrays
                // length is the smaller of two arrays
                var length = (predictive_sliced.length > subjective_sliced.length) ? subjective_sliced.length : predictive_sliced.length;
                for (var i = 0; i < length; i++) {
                    final_questions.push(subjective_sliced[i]);
                    final_questions.push(predictive_sliced[i]);
                }

                // if there are any left, append directly
                if (length === predictive_sliced.length && length < subjective_sliced.length) {
                    for (i = length; i < subjective_sliced.length; i++) {
                        final_questions.push(subjective_sliced[i]);
                    }
                }
                else if (length === subjective_sliced.length && length < predictive_sliced.length) {
                    for (i = length; i < predictive_sliced.length; i++) {
                        final_questions.push(predictive_sliced[i]);
                    }
                }

                callback(final_questions);
            },
            function failed () {
                // if any of the ajax requests fails
                utils.reload_page('Questions are not loading correctly. The page will be reloaded.');
            }
        );
    }

    function reload_page(text) {
        alert(text);
        window.location.reload();
    }

    function remove_all($text, $graph, $button) {
        if ($text !== undefined) {
            $text.html('');
        }
        if ($button !== undefined) {
            $button.off('click');
        }
        if ($graph !== undefined) {
            $graph.html('');
        }
    }

    function check_validity(string) {
        if (string === undefined) {
            return false;
        }
        var temp = '';
        if (string instanceof String) {
            temp = string;
        }
        else if (string instanceof Number) {
            temp = string.toString();
        }
        return !(temp === undefined || temp === '');
    }

    function retrieve_linear_values (counter, type, question, actual_index) {

        var selection = $('input[name=OPTION]:checked').val();
        var position = create_slider.get_linear_value();
        if (!(utils.check_validity(position) && utils.check_validity(selection))) {
            alert('You did not enter your answer!');
            return undefined;
        }
        return {
            'question': question,
            'position': position,
            'selection': selection,
            'type': type,
            'number': counter,
            'original_index': actual_index
        };
    }

    function retrieve_parabolic_values (counter, type, question, actual_index) {
        var selection = $('input[name=OPTION]:checked').val();
        var coordinates = create_slider.get_circle_coordinates();
        if (!(utils.check_validity(coordinates[0]) && utils.check_validity(coordinates[1]) && utils.check_validity(selection))) {
            alert('You did not enter your answer!');
            return undefined;
        }
        return {
            'question': question,
            'x': coordinates[0],
            'y': coordinates[1],
            'selection': selection,
            'type': type,
            'number': counter,
            'original_index': actual_index
        };
    }

    // PUBLIC API
    return {
        'download_file': download_file,
        'break_timer': break_timer,
        'retrieve_linear_values': retrieve_linear_values,
        'retrieve_parabolic_values': retrieve_parabolic_values,
        'play_sound': play_sound,
        'load_questions': load_questions,
        'reload_page': reload_page,
        'remove_all': remove_all,
        'check_validity': check_validity
    };
})();











var create_slider = (function () {
    var circle_x = 0;
    var circle_y = 0;

    var linear_position = 0;

    function get_circle_coordinates() {
        return [circle_x, circle_y];
    }

    function get_linear_value() {
        return linear_position;
    }

    function parabolicSlider() {

        var $graph = $('.graph');

        // populate data
        //
        //
        function gaussian(x) {
            return (-1) * x * x; // Function for line/curve
        }

        var data = [];
        (function getData() {
            for (var i = 0; i < 50; i++) {
                var el = {
                    "q": i,
                    "p": gaussian(i)
                };
                data.push(el)
            }
            // need to sort for plotting
            data.sort(function (x, y) {
                return x.q - y.q;
            });
        })();


        // create canvass
        //
        //
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        };
        var width = 200 - margin.left - margin.right;
        var height = 440 - margin.top - margin.bottom;

        var $svg_wrapper = $('<div>', {'id': 'parabolic'});
        $graph.append($svg_wrapper);
        // $('#parabolic').append($('<p>', {'id': 'originData'}).html('x: '+0+', y: '+0));

        var svg = d3.select("#parabolic").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var container = svg.append("g");


        // create axes
        //
        //
        var x = d3.scale.linear()
        // .domain([0,d3.max(data)])
            .range([0, width]);//can adjust axis range

        var y = d3.scale.linear()
        // .domain([0,d3.max(data)])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .tickValues([]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickValues([]);

        x.domain(d3.extent(data, function (d) {
            return d.q;
        }));
        y.domain(d3.extent(data, function (d) {
            return d.p;
        }));

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        //label of axis (text is styled with css)
        //
        //
        var padding = 2;
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("x", "-180")
            .attr("y", "-10")
            .attr("transform", "translate(" + (padding / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("3 points");
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("x", "0")
            .attr("y", "-10")
            .attr("transform", "translate(" + (padding / 2) + "," + (height / 2) + ")rotate(-90)")
            .text("Loss if incorrect");
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("x", "50")
            .attr("y", "-10")
            .attr("transform", "translate(" + (width / 2) + "," + (0) + ")")  // centre below axis
            .text("1 point");
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("x", "0")
            .attr("y", "-10")
            .attr("transform", "translate(" + (width / 2) + "," + (0) + ")")  // centre below axis
            .text("Gain if correct");


        // function plot
        //
        //
        var line = d3.svg.line()
            .x(function (d) {
                return x(d.q);
            })
            .y(function (d) {
                return y(d.p);
            });
        container.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("id", "lineId")
            .attr("d", line);

        handle1 = [{
            x: 0,
            y: 0
        }];

        // create handle
        //
        //
        var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("drag", dragged);

        function dragged(d) {

            var coordinates = d3.mouse(this);
            var cx = Math.min(Math.max(coordinates[0], 0), 140);
            var cy = Math.min(Math.max(0.023 * cx * cx, 0), 440);

            circle_x = Math.min(cx, 130);
            circle_y = Math.min(cy, 390);
            d3.select('g.dot circle')
                .attr("cx", circle_x)
                .attr("cy", circle_y);
            svg.select("rect[id='horizontal']")
                .attr("width", Math.min(cx, width));
            svg.select("rect[id='vertical']")
                .attr("height", Math.min(cy, height));

            // $('#originData').html('x: '+circle_x+', y: '+circle_y);

            clicked = false;
        }

        handle_circle = container.append("g")
            .attr("id", "handle_circle")
            .attr("class", "dot")
            .attr("style", "display:none")
            .selectAll('circle')
            .data(handle1)
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .call(drag);


        //create color bars
        //
        //
        hor = container.append("rect")
            .attr("id", "hor")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 0)
            .attr("height", 10)
            .attr("fill", "green")
            .attr("id", "horizontal")
            .attr("opacity", 0.3);

        ver = container.append("rect")
            .attr("id", "ver")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 0)
            .attr("fill", "red")
            .attr("id", "vertical")
            .attr("opacity", 0.3);

        container.append("use")
            .attr("id", 'use')
            .attr("xlink:href", '#lineId');


        //mouse move
        //
        //
        function findTheMouse() {
            var coordinates = d3.mouse(this);
        }

        d3.select("svg")
            .on("mousemove", findTheMouse);

        //mouse click
        //
        //
        var clicked = false;

        function click_on_canvas() {
            coords = d3.mouse(this);
            var cx = Math.min(Math.max(coords[0] - 50, 0), 140);
            var cy = Math.min(Math.max(0.023 * cx * cx, 0), 440);
            container.select("g.dot").attr("style", "display:block");

            circle_x = Math.min(cx, 130);
            circle_y = Math.min(cy, 390);
            if (!clicked) {
                d3.select('g.dot circle')
                    .attr("cx", circle_x)
                    .attr("cy", circle_y);
                svg.select("rect[id='horizontal']")
                    .attr("width", Math.min(cx, width));
                svg.select("rect[id='vertical']")
                    .attr("height", Math.min(cy, height));
                clicked = true;
                // $('#originData').html('x: '+Math.min(cx, 130)+', y: '+Math.min(cy, 390));
            }
        }

        d3.select("svg")
            .on("click", click_on_canvas);
    }

    function linearSlider() {
        var $slider = $('<div>', {'id': 'slider'});

        $('.graph').append($slider);
        var $handle = $('<div>', {'class': 'ui-slider-handle'});
        $slider.append($handle);

        $slider.slider({
            range: "min",
            value: 50,
            min: 50,
            max: 100,
            step: 1,
            animate: true,
            create: function () {
                var value = $slider.slider("value");
                $handle.html(value);
                linear_position = value;
            },
            slide: function (event, ui) {
                $handle.html(ui.value);
                linear_position = ui.value;
            },
            start: function () {
                $('.ui-slider-handle').show();
            }
        });
    }

    // PUBLIC API
    return {
        'get_circle_coordinates': get_circle_coordinates,
        'get_linear_value': get_linear_value,
        'parabolicSlider': parabolicSlider,
        'linearSlider': linearSlider
    };
})();
