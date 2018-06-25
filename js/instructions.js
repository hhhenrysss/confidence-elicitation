var instructions = (function () {

    var page_home = (function () {
        function main_prompt () {
            return 'You must enter a subject ID. If you do not enter an ID and click Continue, the software will reset.';
        }

        function main_selection () {
            return 'Please enter the subject ID.';
        }

        // PUBLIC API
        return {
            'main_prompt': main_prompt,
            'main_selection': main_selection
        };
    })();

    var page_tutorial = (function () {
        function tutorial_end_header () {
            return 'Instructions Ends';
        }

        function tutorial_end_explanation () {
            return [
                'The three-question tutorial ends here. In subsequent pages, you will encounter questions that have the exactly same format as previous ones.',
                'Please answer to the best of your knowledge.'
            ];
        }
        function instruction_header () {
            return 'INSTRUCTIONS';
        }

        function instruction_text () {
            return [
                'You will receive $10 for your participation in this experiment. This is yours to keep regardless of how you perform in the experiment.',
                'In the subsequent pages you will encounter three sample questions to help you get familiar with the format of questions.'
            ];
        }
        function load_tutorial (type) {
            if (type === 'parabolic') {
                return [
                    {
                        'question': 'Is the water composed of Hydrogen and Oxygen atoms?',
                        'answer': 'Based on your knowledge and experience, you may believe that a H2O molecule is composed of two Hydrogen atoms and one Oxygen atom, so choosing the "Yes" answer is more appropriate.',
                        'graph_instruction': 'Click anywhere on the curve so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the slider on the curve, the green bar always shows how many points you will earn if your answer is correct. The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the curve to a point where the relative sizes of the green and red bar represents what you are truly willing to gain or lose in case your answer is correct or incorrect. ',
                        'instruction': 'Since you have some evidence to support the “Yes” answer, it may be acceptable to move the slider all the way to the bottom of the curve. The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.'
                    },
                    {
                        'question': 'Does planet Earth orbit around the the Moon?',
                        'answer': 'Based on your knowledge and experience, you may believe that the Moon orbits around Earth, not the other way around, so choosing the "No" answer is more appropriate.',
                        'graph_instruction': 'Click anywhere on the curve so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the slider on the curve, the green bar always shows how many points you will earn if your answer is correct. The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the curve to a point where the relative sizes of the green and red bar represents what you are truly willing to gain or lose in case your answer is correct or incorrect. ',
                        'instruction': 'Since you have some evidence to support the “No” answer, it may be acceptable to move the slider all the way to the bottom of the curve. The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.'
                    },
                    {
                        'question': 'Is it a tail in a random coin toss?',
                        'answer': 'Based on your knowledge and experience, you may believe that the result depends and may vary each time a coin is tossed.',
                        'graph_instruction': 'Click anywhere on the curve so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the slider on the curve, the green bar always shows how many points you will earn if your answer is correct. The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the curve to a point where the relative sizes of the green and red bar represents what you are truly willing to gain or lose in case your answer is correct or incorrect. ',
                        'instruction': 'Since you are not sure about which side will be at the top after a random coin toss, your answer should lie between the two extremes. The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.'
                    }
                ];
            }
            else if (type === 'linear') {
                return [
                    {
                        'question': 'Is the water composed of Hydrogen and Oxygen atoms?',
                        'answer': 'Based on your knowledge and experience, you may believe that a H2O molecule is composed of two Hydrogen atoms and one Oxygen atom, so choosing the "Yes" answer is more appropriate.',
                        'graph_instruction': 'What is the probability that you think your answer to the question is correct? Click anywhere on the bar so that the slider appears, then by moving the slider, specify your confidence level to the question.',
                        'instruction': 'Since you have more tendency toward the "Yes", you don\'t stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction that your answer is correct, the more you slide to the right.'
                    },
                    {
                        'question': 'Does planet Earth orbit around the the Moon?',
                        'answer': 'Based on your knowledge and experience, you may believe that the Moon orbits around Earth, not the other way around, so choosing the "No" answer is more appropriate.',
                        'graph_instruction': 'What is the probability that you think your answer to the question is correct? Click anywhere on the bar so that the slider appears, then by moving the slider, specify your confidence level to the question.',
                        'instruction': 'Since you have more tendency toward the “No", you don\'t stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction that your answer is correct, the more you slide to the right.'
                    },
                    {
                        'question': 'Is it a tail in a random coin toss?',
                        'answer': 'Based on your knowledge and experience, you may believe that the result depends and may vary each time a coin is tossed.',
                        'graph_instruction': 'What is the probability that you think your answer to the question is correct? Click anywhere on the bar so that the slider appears, then by moving the slider, specify your confidence level to the question.',
                        'instruction': 'Since you are not sure about which side will be at the top after a random coin toss, your answer should lie between 0% to 100%.'
                    }
                ];
            }
        }

        // PUBLIC API
        return {
            'tutorial_end_header': tutorial_end_header,
            'tutorial_end_explanation': tutorial_end_explanation,
            'instruction_header': instruction_header,
            'instruction_text': instruction_text,
            'load_tutorial': load_tutorial
        };
    })();

    var page_group_selection = (function () {
        function group_selection_prompt () {
            return 'You must select a group for the subject. If you do not select a group and click Continue, the software will reset.';
        }

        function group_selection_question () {
            return 'What is the subject\'s group?';
        }

        function group_selection_options () {
            return {
                'linear': 'Group 1: Linear Slider',
                'parabolic': 'Group 2: Parabolic Slider'
            };
        }

        // PUBLIC API
        return {
            'group_selection_prompt': group_selection_prompt,
            'group_selection_question': group_selection_question,
            'group_selection_options': group_selection_options
        };
    })();

    var page_end = (function () {
        function ending_header () {
            return 'The survey ends here!';
        }
        function ending_content () {
            return "Thank you for your participation in this study! Your answers have been saved.";
        }

        // PUBLIC API
        return {
            'ending_header': ending_header,
            'ending_content': ending_content
        };
    })();

    var page_interval = (function () {
        function interval_header () {
            return 'You have answered 10 questions! Time to take a break!';
        }

        function interval_explanation () {
            return 'After 1 minute, the "continue" button will appear and you may continue. Please DO NOT switch to another tab or minimize/close the browser.';
        }

        // PUBLIC API
        return {
            'interval_header': interval_header,
            'interval_explanation': interval_explanation
        };
    })();

    function question_selection () {
        return {
            'Yes': 'Yes',
            'No': 'No'
        };
    }



    // PUBLIC API
    return {
        'page_interval': page_interval,
        'page_home': page_home,
        'page_tutorial': page_tutorial,
        'page_group_selection': page_group_selection,
        'page_end': page_end,
        'question_selection': question_selection
    };
})();