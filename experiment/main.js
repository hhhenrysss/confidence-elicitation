var survey = (function () {
    var id = '';
    var group = 0; // group is int
    var answers = [];

    var main_page_flag = false;
    var select_group_flag = false;

    var tutorial_page_counter = 0;
    var tutorial_page_max = 3;
    var tutorial_instructions = [];

    var question_page_counter = 0;
    var question_max = 40;
    var question_instructions = [];

    function dispatcher () {

        // This is the main function, as all events work around the next button
        $('#nextBtn').click(function () {
            // play sound first
            utils.play_sound();

            var $text = $('.text');
            var $graph = $('.graph');

            // Handling the first page
            if (main_page_flag === false) {
                id = $('input').val();
                if (!utils.check_validity(id)) {
                    utils.reload_page('You did not enter your ID. The page will be reloaded.');
                    return;
                }
                console.log('id is:', id);
                main_page_flag = true;
                utils.remove_all($text);

                // invoke next page
                select_group();
            }

            // Handling the second page
            else if (select_group_flag === false) {
                group = parseInt($('input[name=GROUP]:checked').val());
                console.log('group is:', group);
                // error checking
                if (!utils.check_validity(group)) {
                    utils.reload_page('You did not enter your Group type. The page will be reloaded.');
                    return;
                }
                if (group !== 1 && group !== 2) {
                    utils.reload_page('An error regarding Group information has occurred. This page will be reloaded.');
                    return;
                }

                select_group_flag = true;
                utils.remove_all($text);

                // invoke next page
                tutorial_welcome();
            }

            // Handling the third page and all tutorial questions
            else if (tutorial_page_counter !== tutorial_page_max+1) {
                switch (tutorial_page_counter) {
                    case 0:
                        utils.remove_all($text, $graph);
                        tutorial_instructions = (group === 1) ? instructions.page_tutorial.load_tutorial('linear') : instructions.page_tutorial.load_tutorial('parabolic');
                        tutorial_questions(tutorial_instructions[tutorial_page_counter], tutorial_page_counter);
                        tutorial_page_counter += 1;
                        break;
                    default:
                        // this is the case where the template is populated with each question
                        // retrieve previous answers first
                        var selection = $('input[name=OPTION]:checked').val();
                        if (group === 2) {
                            // meaning that the group is linear
                            var coordinates = create_slider.get_circle_coordinates();
                            if (!(utils.check_validity(coordinates[0]) && utils.check_validity(coordinates[1]) && utils.check_validity(selection))) {
                                utils.reload_page('You did not enter your answer. The page will be reloaded.');
                                return;
                            }
                            answers.push({
                                'x': coordinates[0],
                                'y': coordinates[1],
                                'selection': selection,
                                'type': 'tutorial',
                                'number': tutorial_page_counter
                            });
                        }
                        else {
                            var position = create_slider.get_linear_value();
                            if (!(utils.check_validity(position) && utils.check_validity(selection))) {
                                utils.reload_page('You did not enter your answer. The page will be reloaded.');
                                return;
                            }
                            answers.push({
                                'position': position,
                                'selection': selection,
                                'type': 'tutorial',
                                'number': tutorial_page_counter
                            });
                        }
                        console.log(answers[answers.length-1]);
                        utils.remove_all($text, $graph);

                        // This is the case where next page, tutorial ends, should be rendered
                        if (tutorial_page_counter === tutorial_page_max) {
                            tutorial_ends();
                        }
                        else {
                            tutorial_questions(tutorial_instructions[tutorial_page_counter], tutorial_page_counter);
                        }
                        tutorial_page_counter += 1;
                }
            }

            // Handling the tutorial ends page and the subsequent questions page
            else if (question_page_counter !== question_max) {
                switch (question_page_counter) {
                    case 0:
                        // clear all
                        utils.remove_all($text, $graph);
                        // transition to next page
                        questions(question_page_counter);
                        question_page_counter += 1;
                        break;

                    default:

                }
            }
        });
    }

    // FIRST PAGE -->

     function main_page (questions) {
        question_instructions = questions;

        var $text = $('.text');
        var $prompt = $('<h3>', {'class': 'question_header'});
        var $question = $('<p>', {'class': 'question_text'});
        var $input = $('<input>', {
            'type': 'text',
            'class': 'input_text',
            'name': 'ID'
        });


        $text.append($prompt.html(instructions.page_home.main_prompt()));
        $text.append($question.html(instructions.page_home.main_selection()));
        $text.append($input);

        dispatcher();
    }

    // SECOND PAGE -->

     function select_group () {
        var $text = $('.text');
        var $prompt = $('<h3>', {
            'class': 'question_header'
        }).html(instructions.page_group_selection.group_selection_prompt());
        var $question = $('<p>', {
            'class': 'question_text'
        }).html(instructions.page_group_selection.group_selection_question());

        // append new prompts
        $text.append($prompt);
        $text.append($question);

        var options = instructions.page_group_selection.group_selection_options();
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var $select = $('<input>', {
                    'type': 'radio',
                    'id': 'selection'+key,
                    'name': 'GROUP',
                    'value': key
                });
                $text.append($('<label>', {'class': 'input_text', 'for': 'selection'+key}).append($select).append(options[key]));
            }
        }
    }

    // THIRD PAGE -->

    function tutorial_welcome () {
        var $text = $('.text');

        // start_page
        var $welcome = $('<h3>', {
            'class': 'question_header'
        }).html(instructions.page_tutorial.instruction_header());
        $text.append($welcome);

        var list_of_text = instructions.page_tutorial.instruction_text();
        var $content_wrapper = $('<div>', {
            'class': 'question_text'
        });
        for (var i = 0; i < list_of_text.length; i++) {
            var $content = $('<p>', {
                'class': 'question_text_paragraph'
            }).html(list_of_text[i]);
            $content_wrapper.append($content);
        }
        $text.append($content_wrapper);
    }

    // THIS FUNCTION SERVES AS A TEMPLATE FOR ALL EXAMPLE QUESTIONS
     function tutorial_questions (obj, indix) {
        var $text = $('.text');

        var $notice = $('<h2>', {
            'class': 'notice'
        }).html('Sample Question '+(indix+1));
        var $prompt = $('<h3>', {
            'class': 'question_header'
        }).html(obj['question']);
        var $graph_instruction = $('<p>', {
            'class': 'question_text'
        }).html(obj['graph_instruction']);
        var $answer = $('<p>', {
            'class': 'question_text'
        }).html(obj['answer']);
        var $explanation = $('<p>', {
            'class': 'question_text'
        }).html(obj['instruction']);

        $text.append($notice).append($prompt);

        var $last = $('h3');
        var options = instructions.question_selection();
        // create options here
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var $select = $('<input>', {
                    'type': 'radio',
                    'id': 'selection'+key,
                    'name': 'OPTION',
                    'value': key
                });
                $last.after($('<label>', {'class': 'input_text', 'for': 'selection'+key}).append($select).append(options[key]));
                $last = $('.text label:last-child');
            }
        }

        $last.after($graph_instruction);

        // both graphs will be styled using CSS
        if (group === 1) {
            // meaning that the group is linear slider
            create_slider.linearSlider();
        }
        else {
            // meaning that the group is parabolic slider
            create_slider.parabolicSlider();
        }
        $('.graph>div').filter(":last").after($answer).after($explanation);
    }

    // END OF TUTORIAL PAGE -->
    function tutorial_ends() {
        var $text = $('.text');
        var $prompt = $('<h3>', {'class': 'question_header'}).html(instructions.page_tutorial.tutorial_end_header());

        var $content_wrapper = $('<div>', {
            'class': 'question_text'
        });

        var list_of_text = instructions.page_tutorial.tutorial_end_explanation();
        for (var i = 0; i < list_of_text.length; i++) {
            var $content = $('<p>', {
                'class': 'question_text_paragraph'
            }).html(list_of_text[i]);
            $content_wrapper.append($content);
        }

        $text.append($prompt);
        $text.append($content_wrapper);
    }

    // SERVES AS A TEMPLATE FOR ALL FORMAL QUESTIONS
    function questions(counter) {
        var $text = $('.text');
        var $prompt = $('<h3>', {'class': 'question_header'}).html('Question '+(counter+1));
        var $content = $('<p>', {'class': 'question_text'}).html(question_instructions[counter]['question']);

        $text.append($prompt).append($content);

        if (group === 1) {
            create_slider.linearSlider();
        }
        else {
            create_slider.parabolicSlider();
        }
    }


    // PUBLIC API
    return {
        'main_page': main_page
    };
})();