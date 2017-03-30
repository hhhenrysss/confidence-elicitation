survey = { questions: undefined,
           firstQuestionDisplayed: -1,
           lastQuestionDisplayed: -1};

////////////////////////////////////////////////////////////////////////////////////
// Survey Class
////////////////////////////////////////////////////////////////////////////////////

var coords=0;
(function (survey, $) {

    survey.setup_survey = function(questions) {
        var self = this;

        // Initialize needed computations
        var slider_value = []; // Use between rounds
        var sliderBank = [0]; // Use to output
        var currentBalance = 12; // Starting bank balance
        var moneyBank = ['Earnings from Previous Round'];
        var questionCounter = 0; // Keeps track of what question we are currently
        var nextClick = 0; // Count number of time the button next is clicked; used to determine the breaks
        var answerBank = [];
        var roundUserAnswer = [];
        var roundAnswer = [];

        // Read in the appropriate test bank
        testBank = getTestBank("answer_subjective");

        this.questions = questions;

        this.questions.forEach(function(question) {
            self.generateQuestionElement( question );
        });

        $('#nextBtn').click(function() {

            var subjectID = self.getQuestionAnswer(self.questions[0]);
            var questionID = self.questions[questionCounter]['id'];
            var group =  self.getQuestionAnswer(self.questions[1]);
            var ok = true;

            answerBank.push(self.getQuestionAnswer(self.questions[questionCounter]));

            //console.log("Question ID:" + self.questions[questionCounter]['id']);
            console.log("Question Counter:" + questionCounter);
            console.log("QuestionID:" + questionID);
            //console.log("nextClick value:" + nextClick);
            //console.log("SubjectID: " + self.getQuestionAnswer(self.questions[0]))
            //console.log("Group: " + group)
            //console.log("QuestioAnswer:" + self.getQuestionAnswer(self.questions[1]))
            //console.log("currentBalance:" + currentBalance);
            //console.log("AnswerBank" + answerBank);
            //console.log("moneyBank:" + moneyBank);

            if (questionID == 0 && questionCounter == 1) {

                // Instruction given will depend on the group
                if (group == "Group 1: SL, NB") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a horizontal slider as shown below. <br><br> " +
                        "<img src=\"\\image\\hslider.png\" align=\"middle\"> " +
                        "<br><br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br></font>";
                } else if (group == "Group 2: SL, B") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a horizontal slider as shown below. <br><br> " +
                        "<img src=\"\\image\\hslider.png\" align=\"middle\"> " +
                        "<br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br><br>" +
                        "There will be a virtual bank starting at $12 which " +
                        "increases or decreases depending on your answer and your conviction for each question. " +
                        "Note, the bank will never go below zero.<br></font>";
                } else if (group == "Group 3: PS, NB") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a parabolic slider as shown below. <br><br>" +
                         "<img src=\"\\image\\pslider.png\" align=\"middle\"> " +
                         "<br><br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br></font>";
                } else if (group == "Group 4: PS, B") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a parabolic slider as shown below. <br><br> " +
                        "<img src=\"\\image\\pslider.png\" align=\"middle\"> " +
                        "<br><br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br><br> There will be a virtual bank starting at $12 which " +
                        "increases or decreases depending on your answer and your conviction for each question. " +
                        "Note, the bank will never go below zero.<br></font>";
                }

            }
            else if ((questionCounter > 1)) {
                group = answerBank[1];
                if (group == "Group 1: SL, NB" || group == "Group 2: SL, B") {
                    $("#slider").show(); // Show the regular slider
                    d3.select("svg").remove(); // Destroy the parabolic slider

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline";
                    document.getElementById('instructions').innerHTML = "";
                }
                else if (group == "Group 3: PS, NB" || group == "Group 4: PS, B"){
                    $("#slider").remove(); // Destroy the regular slider

                    parabolicSlider(); // Start the parabolic slider
                    d3.selectAll("svg").attr("visibility", "show"); // Make sure it is visible after the breaks

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline";
                    document.getElementById('instructions').innerHTML = "";
                }
            }

            // Make question required and display message
            for (i = self.firstQuestionDisplayed; i <= self.lastQuestionDisplayed; i++) {
                if (self.questions[i]['required'] === true && !self.getQuestionAnswer(questions[i])) {
                    $('.question-container > div.question:nth-child(' + (i+1) + ') > .required-message').show();
                    ok = false;
                }
            }

            // Do nothing if no answer is selected
            if (!ok)
                return

            // If button is clicked and answer is selected
            if ( $('#nextBtn').text().indexOf('Continue') === 0) {

                if (questionCounter > 2 & nextClick != 0) {
                    // Push slider_value from previous question
                    // TODO: Add parabolic to slider value

                    if (group == "Group 4: PS, B" ||group == "Group 3: PS, B") {

                        slider_value.push(coords[1] / 500);
                        sliderBank.push(coords[1] / 500);

                    }
                    else{
                        slider_value.push($('#slider').slider('value'));
                        sliderBank.push($('#slider').slider('value'));

                    }
                    console.log(slider_value);
                    console.log(sliderBank);



                    roundUserAnswer.push(self.getQuestionAnswer(self.questions[questionCounter]));
                    roundAnswer.push(testBank[questionID]);
                }

                // TAKE A BREAK: Every n question, show the bank and take a break
                if (questionID % 10 == 0 && questionID != 0 && nextClick != 0) {

                    console.log("BREAK QUESTION!");
                    console.log("slider value: " + slider_value);
                    console.log("User answer in round:" + roundUserAnswer);
                    console.log("testBank round answer:" + roundAnswer);


                    // COMPUTE BRIER SCORE AND GET CHART
                    roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer)

                    moneyBank = moneyBank.concat(roundScore);
                    moneyBank = moneyBank.filter(Boolean); // Remove falsy because of pop()

                    // Hide the question and sliders
                    self.hideAllQuestions();
                    $("#slider").hide();
                    d3.selectAll("svg").attr("visibility", "hidden");
                    document.getElementById("slider-label").style.display = "none";

                    // Plot the current moneyBank if they are in the right group
                    self.getBank(moneyBank);
                    if (group == "Group 2: SL, B" || group == "Group 4: PS, B") {
                        $("#chart").show();
                    } else {
                        $("#chart").hide();
                    }

                    currentBalance +=  Number(self.sumArr(roundScore).toFixed(2));

                    // Tell them to take a break
                    document.getElementById('message').innerHTML="Please take a 1 minute break! " +
                            "The Continue button will show after 1 minute.<br><br>Below is a graph which displays how " +
                            "you've performed in the previous round.<br><br>In the last round, your balance changed by: " +
                            self.sumArr(roundScore).toFixed(2) + "$" + "<br><br>Your current total balance is $" +
                            currentBalance.toFixed(2);
                    $('#nextBtn').hide()
                    $('#nextBtn').delay(3000).show(0); // Show button after n/1000 seconds. (e.g., n=5000 is 5 sec)

                    // Reset the iterator
                    nextClick = 0;

                    // Reset slider values
                    slider_value = [];
                    roundAnswer = [];
                    roundUserAnswer = [];

                    // Reset the bank for new round
                    moneyBank = ['Earnings from Previous Round'];
                }
                // Move on to next question if not break
                else {

                    // Move the slider back to 0
                    // TODO: change slider text back to 0
                    $("#slider").slider("value",  $("#slider").slider("option", "min"));

                    // Increase the question index and click counter
                    nextClick += 1;
                    questionCounter += 1;

                    document.getElementById('message').innerHTML="";
                    self.showNextQuestionSet();
                    $("#chart").hide();
                }
            }

            // FINAL QUESTION
            else {

                // Store the slider value
                // TODO: Add parabolic to slider value


                if (group == "Group 4: PS, B" ||group == "Group 3: PS, B") {

                    slider_value.push(coords[1] / 500);
                    sliderBank.push(coords[1] / 500);

                }
                else{
                    slider_value.push($('#slider').slider('value'));
                    sliderBank.push($('#slider').slider('value'));

                }

                console.log(slider_value);
                console.log(sliderBank);

                
                roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer)

                moneyBank = moneyBank.concat(roundScore);
                moneyBank = moneyBank.filter(Boolean); // Remove falsy because of pop()

                // Hide the question and sliders
                self.hideAllQuestions();
                $("#slider").hide();
                d3.selectAll("svg").attr("visibility", "hidden");
                document.getElementById("slider-label").style.display = "none"
                document.getElementById('message').innerHTML="Thank you for your participation in this study! Your answers have been saved." +
                    "<br><br>Below is a graph which displays how " +
                    "you've performed in the previous round.<br><br>In the last round, your balance changed by: " +
                    self.sumArr(roundScore).toFixed(2) + "$" + "<br><br>The total money you've earned is $" +
                    currentBalance.toFixed(2);

                // Plot the current moneyBank
                self.getBank(moneyBank);
                if (group == "Group 2: SL, B" || group == "Group 4: PS, B") {
                    $("#chart").show();
                } else {
                    $("#chart").hide();
                }

                nextClick += 1;

                // TODO: Not writing the answer correctly; skips the first two
                // Get all of the answers and money earned to save
                var answers = {moneyEarned: currentBalance};
                for (i = 0; i < self.questions.length; i++) {
                    answers[self.questions[i].id] = [answerBank[i], sliderBank[i]];
                }

                // Write answer to file (Note: Only works for Chrome | Not Safari)
                self.saveAnswers(JSON.stringify(answers), String(subjectID) + '.json');
                self.hideAllQuestions();
                $("#chart").show();
                $("#slider").hide();
                d3.selectAll("svg").attr("visibility", "hidden");
                $('#nextBtn').hide();
                document.getElementById("slider-label").style.display = "none";
                //$('.completed-message').text("Thank you for participating in this study! Your answers have been saved.\n You've earned: $" + currentBalance.toFixed(2) + "!");

                /*
                 // USE THIS TO WRITE TO A SERVER
                $.ajax({type: 'post',
                        url: 'http://localhost:8000',
                        contentType: "application/json",
                        data: JSON.stringify(answers),
                        processData: false,
                        success: function(response) {
                            self.hideAllQuestions();
                            $('#nextBtn').hide();
                            if ('success' in response) {
                                $('.completed-message').html('Thank you for participating in this study!<br><br>'+response['success']);
                            }
                            else if ('error' in response) {
                                $('.completed-message').text('An error occurred: '+response['error']);
                            }
                            else {
                                $('.completed-message').text('An unknown error occurred.');
                            }
                        },
                        error: function(response) {
                            self.hideAllQuestions();
                            $('#nextBtn').hide();
                            $('.completed-message').text('An error occurred: could not send data to server!');
                        }
                });*/
            }
        });
      
        this.showNextQuestionSet();
    }

    // Function to get the answers to the radio buttom questions
    survey.getQuestionAnswer = function(question) {
        var result;

        if ( question.type === 'single-select' ) {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val() ;
        }
        else if ( question.type === 'single-select-oneline' ) {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val();
        }
        else if ( question.type === 'text-field-small' ) {
            result = $('input[name=' + question.id + ']').val();
        }
        return result ? result : undefined;
    }

    // Function to the question
    survey.generateQuestionElement = function(question) {
        var questionElement = $('<div id="' + question.id + '" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        questionCommentElement.html(question.comment);

        if ( question.type === 'single-select' ) {
            questionElement.addClass('single-select');
            question.options.forEach(function(option) {
                questionAnswerElement.append('<label class="radio"><input type="radio" value="' + option + '" name="' + question.id + '"/>' + option + '</label>');
            });
        }
        else if ( question.type === 'text-field-small' ) {
            // No slider for these types of questions
            $("#slider").hide();
            document.getElementById("slider-label").style.display = 'none';
            questionElement.addClass('text-field-small');
            questionAnswerElement.append('<input type="text" value="" class="text" name="' + question.id + '">');
        }
        else if ( question.type === 'single-select-oneline' ) {
            questionElement.addClass('single-select-oneline');
            var html = '<table border="0" cellpadding="5" cellspacing="0"><tr><td></td>';
            question.options.forEach(function(label) {
                html += '<td><label>' + label + '</label></td>';
            });
            html += '<td></td></tr><tr><td><div>' + question.labels[0] + '</div></td>';
            question.options.forEach(function(label) {
                html += '<td><div><input type="radio" value="' + label + '" name="' + question.id + '"></div></td>';
            });
            html += '<td><div>' + question.labels[1] + '</div></td></tr></table>';
            questionAnswerElement.append(html);
        }
        // If the question is marked as required, do not allow the user to continue
        if ( question.required === true ) {
            var last = questionTextElement.find(':last');
            (last.length ? last : questionTextElement).append('<span class="required-asterisk" aria-hidden="true">*</span>');
        }
        questionAnswerElement.after('<div class="required-message">Please select an answer before continuing.</div>');
        questionElement.hide();
    }

    // Function to hide question when we've reached the last page
    survey.hideAllQuestions = function() {
        $('.question:visible').each(function(index, element){
            $(element).hide();
        });
        $('.required-message').each(function(index, element){
            $(element).hide();
        });
    }

    // Function to get the next question
    survey.showNextQuestionSet = function() {
        this.hideAllQuestions();
        this.firstQuestionDisplayed = this.lastQuestionDisplayed+1;
      
        do {
            this.lastQuestionDisplayed++;  
            $('.question-container > div.question:nth-child(' + (this.lastQuestionDisplayed+1) + ')').show();
            if ( this.questions[this.lastQuestionDisplayed]['break_after'] === true)
                break;
        } while ( this.lastQuestionDisplayed < this.questions.length-1 );

        this.doButtonStates();
    }

    // Function to get the previous question
    survey.showPreviousQuestionSet = function() {
        this.hideAllQuestions();
        this.lastQuestionDisplayed = this.firstQuestionDisplayed-1;
      
        do {
            this.firstQuestionDisplayed--;  
            $('.question-container > div.question:nth-child(' + (this.firstQuestionDisplayed+1) + ')').show();
            if ( this.firstQuestionDisplayed > 0 && this.questions[this.firstQuestionDisplayed-1]['break_after'] === true)
                break;
        } while ( this.firstQuestionDisplayed > 0 );
      
        this.doButtonStates();
    }

    // Create the buttons for the survey
    survey.doButtonStates = function() {
        if ( this.lastQuestionDisplayed == this.questions.length-1 ) {
            $('#nextBtn').text('Finish');
            $('#nextBtn').addClass('blue');  
        }
        else if ( $('#nextBtn').text() === 'Finish' ) {
            $('#nextBtn').text('Continue »'); 
            $('#nextBtn').removeClass('blue');
        }
    }

    // Display the question
    survey.generateBankElement = function(question) {
        var questionElement = $('<div id="bank" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        questionCommentElement.html(question.comment);
        questionElement.hide();
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Utility Functions
    //////////////////////////////////////////////////////////////////////////////////////////

    // Use to get the answers and save to file locally
    survey.saveAnswers = function (text, filename){
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    // ToDo: Implement Brier Score correctly
    survey.getBrier = function(userAnswer, sliderValue, testBank) {
        var gain_loss = [];
        var O = 0;
        var F = 0;
        for (var i = 0; i < userAnswer.length; i++) {
            if (testBank[i] == "Yes")
                O = 1
            else
                O = 0
            F = sliderValue[i]*0.01;
            // Used for testing
            if (userAnswer[i] == testBank[i]) {
                //gain_loss.push(F * 0.01);
                gain_loss.push(Math.pow(F-1,2)+0.25);
            } else {
                //gain_loss.push(-F * 0.01);
                gain_loss.push(-(Math.pow(F-O,2)-0.25));
            }
        }
        return gain_loss
    }

    survey.getBank = function (moneyBank) {
        var chart = c3.generate({
            size: {
                height: 240,
                width: 480
            },
            data: {
                columns: [
                    moneyBank,
                    ['Reference Line',0,0,0,0,0,0,0,0,0,0] // # of 0 should be the number of questions per round
                ],
                type: 'bar',
                types: {
                        'Reference Line': 'line',
                },
                colors: {
                    'Earnings from Previous Round': function(d) { return d.value < 0 ? '#E57F7F' : '#99EA99' }
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {
                    max: 1,
                    min: -1,
                    label: "Bank Changes ($)"
                    // Range includes padding, set 0 if no padding needed
                    // padding: {top:0, bottom:0}
                },
                x: {
                    label: "Question",
                    show: false
                }
            },
            bar: {
                width: {
                    ratio: 0.3 // this makes bar width 50% of length between ticks
                }
            }
        });
    }

    survey.sumArr = function(array) {
        var count=0;
        for (var i=array.length; i--;) {
            count+=array[i];
        }
        return count;
    }

})(survey, jQuery); // End class

//////////////////////////////////////////////////////////////////////////////////////////
// LOAD IN THE QUESTIONS (TODO: Read CSV into JSON makes life easier)
//////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    $.getJSON('questions_subjective.json', function(json) {
        survey.setup_survey(json);        
    });
});


window.onbeforeunload = function() {
    return "This will reset all answers that you've already filled in!";
}

// Function to read the answer csv into an array
function getTestBank(filename) {
    $.ajax({
        url: "answer/" + filename + ".csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
        }
    });
    return data[0];
};

////////////////////////////////////////////////////////////////////////////////////
// REGULAR SLIDER
////////////////////////////////////////////////////////////////////////////////////
$( function() {
    var handle = $("#custom-handle");

    $( "#slider" ).slider({
        range: "min",
        value: 50,
        min: 50,
        max: 100,
        step: 1,
        animate: true,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );

function parabolicSlider() {
    var data = [];

    // populate data
    getData();

    function getData() {
        for (var i = 0; i < 50; i++) {
            q = i
            p = gaussian(q)
            el = {
                "q": q,
                "p": p
            }
            var div = d3.select("#parabolic").select("#originData")
            div
                .text("x: " + q + ",y: " + p)
            // .style("left", (d3.event.pageX - 34) + "px")
            // .style("top", (d3.event.pageY - 12) + "px");
            //console.log("x: "+q+"y: "+p);

            data.push(el)
        }
        ;
        // need to sort for plotting
        data.sort(function (x, y) {
            return x.q - y.q;
        });
    }

    function gaussian(x) {
        return (-1) * x * x; // Function for line/curve
    };


    // create canvass
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#parabolic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // axises
    var x = d3.scale.linear()
    // .domain([0,d3.max(data)])
        .range([0, width]);//can adjust axis range

    var y = d3.scale.linear()
    // .domain([0,d3.max(data)])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickValues([])
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues([])

    x.domain(d3.extent(data, function (d) {
        return d.q;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.p;
    }));

    svg.append("g")
        .attr("class", "x axis")
        // .attr("transform","translate(10,160)")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // function plot
    var container = svg.append("g");

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
        .attr("d", line);

    // handle
    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    handle = [{
        x: 0,
        y: 0
    }];

    handle_circle = container.append("g")
        .attr("class", "dot")
        .selectAll('circle')
        .data(handle)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .call(drag);

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this)
            .classed("dragging", true);
    }

    function dragged(d) {
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = (0.025*d3.event.x *d3.event.x));
        var div = d3.select("body").select("#realTime")
        svg.select("rect[id='horizontal']")
            .attr("width",d3.event.x) ;
        svg.select("rect[id='vertical']")
            .attr("height",d3.event.y-20) ;
    }

    function dragended(d) {
        d3.select(this)
            .classed("dragging", false);
    }

    //color indicator
    container.append("rect")
        .attr("x", 0)
        .attr("y", -10)
        .attr("width", 0)
        .attr("height", 10)
        .attr("fill", "green")
        .attr("id", "horizontal");


    container.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 0)
        .attr("fill", "red")
        .attr("id", "vertical");

    // var coordinates = 0

    function findTheMouse() {
        var coordinates = d3.mouse(this);
        var div = d3.select("body").select("#realTime")
        div
        // .text("x: "+coordinates[0]/500 + ",y: " + coordinates[1]/500)
            .style("left", (d3.event.pageX - 100) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
        // .attr("width",xScale)           //pay attention
        // console.log("x: "+coordinates[0]+"y: "+coordinates[1]);
        // console.log("y: "+coordinates[1]);
    }

    d3.select("svg")
        .on("mousemove", findTheMouse);

    svg.on("click", function() {
        coords = d3.mouse(this);
        var div = d3.select("body").select("#realTime")
        div
            .text("x: "+coords[0]/500 + ",y: " + coords[1]/500)
        svg.select("rect[id='horizontal']")
            .attr("width",coords[0]) ;
        svg.select("rect[id='vertical']")
            .attr("height",coords[1]) ;
        // Normally we go from data to pixels, but here we're doing pixels to data
    })

    // Update rectangles when mouse is released
    svg.on("mouseup", function(){
         coords = d3.mouse(this);
        svg.select("rect[id='horizontal']")
                .attr("width",coords[0]) ;
            svg.select("rect[id='vertical']")
                .attr("height",coords[1]) ;
        });


    parabolicSlider = function(){} // Only allows function to be called once

};