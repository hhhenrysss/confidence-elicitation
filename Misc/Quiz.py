""" quiz.py
    example of a quiz game
    using objects for data
"""

from tkinter import *
# from tkMessageBox import *


class Problem(object):
    def __init__(self, qtype="", question="", a="", b=""):
        object.__init__(self)
        self.qtype = qtype
        self.question = question
        self.a = a
        self.b = b

class App(Tk):
    def __init__(self):
        Tk.__init__(self)
        self.problems = []
        self.counter = 0
        self.addComponents()
        self.loadProblems()
        self.showProblem(0)
        self.mainloop()

    def addComponents(self):
        """ add components to the GUI """
        self.title("Confidence Elicitation")
        # force app to a fixed width
        self.grid()
        self.columnconfigure(0, minsize=100)
        self.columnconfigure(1, minsize=200)
        self.columnconfigure(2, minsize=100)

        self.lblQuestion = Label(self, text="Question")
        self.lblQuestion.grid(columnspan=3, sticky="we")

        self.selection = StringVar()
        self.btnA = Radiobutton(self, text="A", anchor="w", variable=self.selection, value="Yes", command=self.checkA)
        self.btnA.grid(columnspan=3, sticky="we")

        self.btnB = Radiobutton(self, text="B", anchor="w", state="active", variable=self.selection, value="No",
                                command=self.checkB)
        self.btnB.grid(columnspan=3, sticky="we")

        self.Confidence = Scale(self, from_=50, to=100, tickinterval=10, label="How confident are you? (%)",
                                orient=HORIZONTAL, troughcolor="white", fg="#33CFC6")
        self.Confidence.grid(row=4, columnspan=2, sticky="we")

        self.lblCounter = Label(self, text="0")
        self.lblCounter.grid(row=5, column=1)

        self.btnPrev = Button(self, text="Previous <<", command=self.prev)
        self.btnPrev.grid(row=5, column=0)

        self.btnNext = Button(self, text="Next >>", command=self.next)
        self.btnNext.grid(row=5, column=2)

    def checkA(self):
        self.check("A")

    def checkB(self):
        self.check("B")

    def check(self, guess):
        # compares the guess to the correct answer
        if guess == "":
            print("Quiz", "Please answer the question!")
        else:
            print("")

    def prev(self):
        self.counter -= 1
        if self.counter < 0:
            self.counter = 0
        self.showProblem(self.counter)

    def next(self):
        self.counter += 1
        if self.counter >= len(self.problems):
            self.counter = len(self.problems) - 1
        self.showProblem(self.counter)

    def showProblem(self, counter):
        self.lblQuestion["text"] = self.problems[counter].question
        self.btnA["text"] = self.problems[counter].a
        self.btnB["text"] = self.problems[counter].b
        self.lblCounter["text"] = self.counter

    def loadProblems(self):
        self.problems.append(Problem(
            "TEXT",
            "INSTRUCTIONS HERE",
            "",
            ""))
        self.problems.append(Problem(
            "Q1",
            "Did the Patriots won Super Bowl LI?",
            "Yes",
            "No"))

        self.problems.append(Problem(
            "Q1",
            "Will we land on Mars by 2020?",
            "Yes",
            "No"))

        self.problems.append(Problem(
            "Q2",
            "Duke will win the NCAA Basketball Championship.",
            "Yes",
            "No"))


def main():
    a = App()

if __name__ == "__main__":
    main()
