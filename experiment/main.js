var survey = (function () {
    // below are variables that need to be exported for future analysis
    var id = '';
    var group = 0; // group is int
    var answers = [];

    // below are internal variables
    var main_page_flag = false;
    var select_group_flag = false;

    var tutorial_page_counter = -1;
    var tutorial_page_max = 100; // just a place holder; this value will change dynamically
    var tutorial_instructions = [];

    var question_page_counter = -1;
    var question_page_max = 100; // just a place holder; this value will change dynamically
    var question_instructions = [];

    var question_break_interval = 10;
    var question_break_flag = false;

    function start(questions) {
        question_instructions = questions;
        question_page_max = question_instructions.length;
        document.getElementsByTagName('button')[0].addEventListener('click', function () {
           utils.play_sound();
        });
        main_page();
    }

    function dispatcher () {

        // This is the main function, as all events work around the next button
        $('#nextBtn').click(function () {

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

                // load tutorial here
                tutorial_instructions = (group === 1) ? instructions.page_tutorial.load_tutorial('linear') : instructions.page_tutorial.load_tutorial('parabolic');
                tutorial_page_max = tutorial_instructions.length;

                select_group_flag = true;
                utils.remove_all($text);

                // invoke next page
                tutorial_welcome();
            }

            // Handling the third page and all tutorial questions
            else if (tutorial_page_counter !== tutorial_page_max) {
                if (tutorial_page_counter === -1) {
                    // tutorial is loaded at select_group stage
                    utils.remove_all($text, $graph);
                    tutorial_page_counter += 1;
                    tutorial_questions(tutorial_instructions[tutorial_page_counter], tutorial_page_counter);
                }
                else {
                    // this is the case where the template is populated with each question
                    // retrieve previous answers first
                    if (group === 2) {
                        // meaning that the group is parabolic
                        var temp = utils.retrieve_parabolic_values(
                            tutorial_page_counter,
                            'tutorial',
                            tutorial_instructions[tutorial_page_counter]['question'],
                            tutorial_page_counter // actual_index entry does not make sense for tutorial questions, so use counter as substitution
                        );
                        if (temp === undefined) {
                            return;
                        }
                        answers.push(temp);
                    }
                    else {
                        temp = utils.retrieve_linear_values(
                            tutorial_page_counter,
                            'tutorial',
                            tutorial_instructions[tutorial_page_counter]['question'],
                            tutorial_page_counter
                        );
                        if (temp === undefined) {
                            return;
                        }
                        answers.push(temp);
                    }
                    // console.log(answers[answers.length-1]);
                    utils.remove_all($text, $graph);

                    tutorial_page_counter += 1;

                    // This is the case where next page, tutorial ends, should be rendered
                    if (tutorial_page_counter === tutorial_page_max) {
                        tutorial_ends();
                    }
                    else {
                        tutorial_questions(tutorial_instructions[tutorial_page_counter], tutorial_page_counter);
                    }
                }
            }

            // Handling the tutorial ends page and the subsequent questions page
            else if (question_page_counter !== question_page_max) {
                if (question_page_counter === -1 || question_break_flag === true) {
                    // clear all
                    utils.remove_all($text, $graph);
                    // transition to next page
                    question_page_counter += 1;
                    if (question_page_counter !== question_page_max) {
                        questions(question_instructions[question_page_counter], question_page_counter);
                        question_break_flag = false;
                    }
                    else {
                        // this function has two ways to exit, as there are two cases:
                        /*
                        * 1. when the questions end exactly after break
                        * 2. when questions end normally
                        * */
                        question_ends();
                    }
                }
                else {
                    if (group === 2) {
                        // meaning the group is parabolic
                        temp = utils.retrieve_parabolic_values(
                            question_page_counter,
                            question_instructions[question_page_counter]['category'],
                            question_instructions[question_page_counter]['question'],
                            question_instructions[question_page_counter]['index']
                        );
                        if (temp === undefined) {
                            return;
                        }
                        answers.push(temp);
                    }
                    else {
                        // meaning the group is linear
                        temp = utils.retrieve_linear_values(
                            question_page_counter,
                            question_instructions[question_page_counter]['category'],
                            question_instructions[question_page_counter]['question'],
                            question_instructions[question_page_counter]['index']
                        );
                        if (temp === undefined) {
                            return;
                        }
                        answers.push(temp);
                    }
                    utils.remove_all($text, $graph);

                    // take a break; counter is not incremented; after break ends the first if statements will be invoked
                    if ((question_page_counter+1) % question_break_interval === 0 && question_page_counter !== 0) {
                        question_break();
                        question_break_flag = true;
                    }
                    else {
                        question_page_counter += 1;
                        // This is the case where next page, tutorial ends, should be rendered
                        if (question_page_counter === question_page_max) {
                            question_ends();
                        }
                        else {
                            questions(question_instructions[question_page_counter], question_page_counter);
                        }
                    }
                }
            }

            // the final case -> the last page button click handler
            else {
                utils.download_file(id, group, answers);
            }
        });
    }

    // FIRST PAGE -->

     function main_page () {

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

        var $last = $('.question_header');
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
    function questions(obj, counter) {
        var $text = $('.text');
        var $prompt = $('<h2>', {'class': 'notice'}).html('Question '+(counter+1));
        var $content = $('<h3>', {'class': 'question_header'}).html(obj['question']);

        $text.append($prompt).append($content);

        var $last = $('.question_header');
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

        if (group === 1) {
            create_slider.linearSlider();
        }
        else {
            create_slider.parabolicSlider();
        }
    }

    function question_break() {
        var $text = $('.text');
        var $prompt = $('<h3>', {'class': 'question_header'}).html(instructions.page_interval.interval_header());
        var $content = $('<p>', {'class': 'question_text'}).html(instructions.page_interval.interval_explanation());

        $text.append($prompt).append($content);

        var $button = $('button');
        $button.hide();
        utils.break_timer(6000, function () {
            $button.show();
        }); // the unit is milliseconds
    }

    function question_ends() {
        var $text = $('.text');
        var $prompt = $('<h3>', {'class': 'question_header'}).html(instructions.page_end.ending_header());
        var $content = $('<p>', {'class': 'question_text'}).html(instructions.page_end.ending_content());
        $text.append($prompt).append($content);
        $('button').html('Download');
    }


    // PUBLIC API
    return {
        'start': start
    };
})();