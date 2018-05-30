var group1_linear_instruction = "<h3><span class='instruction_title'>INSTRUCTIONS</span></h3> \
<span class='instruction_text'>You will receive $12 for your participation in this experiment. This is yours to keep regardless of how you perform in the experiment.\
<br><br>\
You will also have a virtual bank which you will receive its cash value at the end of the experiment. The bank's initial balance is $12.\
<br><br>\
By answering each question, your reward or penalty from that question will increase or decrease your bank balance.\
<br><br>\
At the end of every 10 questions, you will receive a summary report of your earned reward/penalty in the most recent 10 questions as well as your overall bank balance up to that point of the experiment.\
<br><br>\
Your answers will determine your final bank balance. Correct answers will increase your bank balance from the initial $12, and incorrect answers will lower your bank balance, but the bank balance will never go below zero.\
<br></span>";

var group2_parabolic_instruction = "<h3><span class='instruction_title'>INSTRUCTIONS</span></h3>\
 <span class='instruction_text'>You will receive $10 for your participation in this experiment. This is yours to keep regardless of how you perform in the experiment.\
 <br><br>\
 You will also have a virtual bank which you will receive its cash value at the end of the experiment. The bank's initial balance is $12.\
 <br><br>\
 By answering each question, your reward or penalty from that question will increase or decrease your bank balance.\
 <br><br>\
 At the end of every 10 questions, you will receive a summary report of your earned reward/penalty in the most recent 10 questions as well as your overall bank balance up to that point of the experiment.\
 <br><br>\
 Your answers will determine your final bank balance. Correct answers will increase your bank balance from the initial $12, and incorrect answers will lower your bank balance, but the bank balance will never go below zero.\
 <br></span>";

var linear_slider_prompts = "\
<h2><strong>Part 2)</strong></h2> \
<span class='instruction_text'>What is the probability that you think your answer to Part 1 is correct? (Click anywhere on the bar so that the slider appears, then by moving the slider, specify your answer to Part 2)</span>>\
<br><br>";

var linear_first_instruction_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is more likely that Donald Trump was over 40 when he became president, so choosing the \"Yes\" answer is more appropriate.\
<br><br>\
Since you have more tendency toward the \"Yes\", you don't stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction that your answer is correct, the more you slide to the right.\
<br><span>";

var linear_second_instruction_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is less likely that Bill Gates was one of the founders of Apple, so choosing the \“No\" answer is more appropriate.\
<br><br>\
Since you have more tendency toward the \“No\", you don't stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction that your answer is correct, the more you slide to the right.\
<br></span>";

var linear_third_instruction_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is more likely that a 5-10 adult is a male than female, so choosing the \"Yes\" answer is more appropriate.\
 <br><br>\
 Since you have more tendency toward the \"Yes\", you don't stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction that your answer is correct, the more you slide to the right. But since you realize that there is still some chance that this adult may be female, it is not appropriate to move the slider all the way to 100%, therefore, a slider position somewhere between 50% and 100% is more appropriate.\
 <br></span>";


var parablic_slider_prompts = "<h2><strong>Part 2)</strong></h2>\
<span class='instruction_text'>Click anywhere on the curve so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the slider on the curve, the green bar always shows how many points you will earn if your answer is correct. The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the curve to a point where the relative sizes of the green and red bar represents what you are truly willing to gain or lose in case your answer is correct or incorrect.\
 <br></span>";

var parabolic_first_question_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is more likely that Donald Trump was over 40 when he became president, so choosing the \"Yes\" answer is more appropriate.\
<br><br>\
Since you have some evidence to support the \“Yes\” answer, it may be acceptable to move the slider all the way to the bottom of the curve.\
<br><br>\
The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.\
<br></span>";


var parabolic_second_question_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is less likely that Bill Gates was one of the founders of Apple, so choosing the \“No\" answer is more appropriate. \
<br><br>\
Since you have some evidence to support the \“No\” answer, it may be acceptable to move the slider all the way to the bottom of the curve.\
<br><br>\
The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.\
<br><br></span>";

var parabolic_third_question_answer = "<span class='instruction_text'>Based on your knowledge and experience, you may believe it is more likely that a 5-10 adult is a male than female, so choosing the \"Yes\" answer is more appropriate.\
<br><br>\
Since you have some evidence to support the \“Yes\” answer, it is not acceptable to move the slider all the way to the bottom of the curve. But you are not completely sure that \“Yes\” is the correct answer, so it is not appropriate to move the slider all the way to the top of the curve either.\
<br><br>\
The right place for the slider is somewhere in between where your belief about the likelihood of winning versus losing justifies the length of red and green bars at that point. The more you believe your answer is correct, the more you want to move towards the bottom.\
<br></span>";




var instruction_is_finished = "<span class='instruction_text'>This completes the instructions for your task. If you have any questions, please feel free to share them with the experimenter before proceeding.\
<br><br>\
If you have no questions, then please click on the \"Continue\" button to begin performing the experimental task, for which you you will gain or lose money in your bank based on the accuracy of answering the questions and in adjusting the slider knob.\
<br></span>";