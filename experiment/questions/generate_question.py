import json

with open('subjective.json', 'r') as subjective, open('predictive.json', 'r') as predictive:
    sub_list = json.load(subjective)
    pre_list = json.load(predictive)

sub_questions = []
for item in sub_list:
    sub_questions.append({
        'question': item['question'],
        'index': item['index']
    })
pre_questions = []
for item in pre_list:
    pre_questions.append({
        'question': item['question'],
        'index': item['index']
    })

with open('subjective_questions.json', 'w') as subjective, open('predictive_questions.json', 'w') as predictive:
    json.dump(sub_questions, subjective)
    json.dump(pre_questions, predictive)
