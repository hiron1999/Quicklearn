// Enhanced Quiz Game
export default class QuizGame {
    constructor(questions = null) {
        this.questions = questions || [
            {
                question: "What does AI stand for?",
                options: {
                    "A": "Artificial Intelligence",
                    "B": "Automated Intelligence", 
                    "C": "Advanced Intelligence",
                    "D": "Algorithmic Intelligence"
                },
                ans: "A"
            },
            {
                question: "Which of these is a type of machine learning?",
                options: {
                    "A": "Supervised Learning",
                    "B": "Unsupervised Learning",
                    "C": "Reinforcement Learning", 
                    "D": "All of the above"
                },
                ans: "D"
            },
            {
                question: "What is the main goal of Natural Language Processing?",
                options: {
                    "A": "Image Recognition",
                    "B": "Computer Vision",
                    "C": "Understanding Human Language",
                    "D": "Data Analysis"
                },
                ans: "C"
            },
            {
                question: "Which company developed ChatGPT?",
                options: {
                    "A": "Google",
                    "B": "Microsoft",
                    "C": "OpenAI",
                    "D": "Meta"
                },
                ans: "C"
            },
            {
                question: "What is a neural network inspired by?",
                options: {
                    "A": "Computer Circuits",
                    "B": "Human Brain",
                    "C": "Mathematical Equations",
                    "D": "Data Structures"
                },
                ans: "B"
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.userAnswers = []; // Track user's answers
        this.init();
    }

    init() {
        this.displayQuestion();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        // Remove existing listeners to prevent duplicates
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        restartBtn.replaceWith(restartBtn.cloneNode(true));
        
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const answersContainer = document.getElementById('answersContainer');
        
        questionText.textContent = `${this.currentQuestion + 1}. ${question.question}`;
        answersContainer.innerHTML = '';
        
        Object.entries(question.options).forEach(([key, value]) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = `${key}. ${value}`;
            button.dataset.option = key;
            button.addEventListener('click', () => this.selectAnswer(key));
            answersContainer.appendChild(button);
        });
        
        this.answered = false;
        document.getElementById('nextBtn').style.display = 'none';
    }

    selectAnswer(selectedOption) {
        if (this.answered) return;
        
        this.answered = true;
        const question = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Store user's answer
        this.userAnswers[this.currentQuestion] = selectedOption;
        
        // Visual feedback for answers
        buttons.forEach((button) => {
            const buttonOption = button.dataset.option;
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.7';
            
            if (buttonOption === question.ans) {
                button.classList.add('correct');
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.opacity = '1';
            } else if (buttonOption === selectedOption) {
                button.classList.add('incorrect');
                button.style.backgroundColor = '#f44336';
                button.style.color = 'white';
                button.style.opacity = '1';
            }
        });
        
        // Update score and show feedback
        if (selectedOption === question.ans) {
            this.score++;
            this.showStatusMessage('Correct! 🎉', 'success');
        } else {
            this.showStatusMessage(`Incorrect. The correct answer was: ${question.ans}. ${question.options[question.ans]}`, 'error');
        }
        
        this.updateStats();
        
        // Show next button or finish quiz
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                document.getElementById('nextBtn').style.display = 'inline-block';
            } else {
                this.showFinalScore();
            }
        }, 1500);
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('currentQ').textContent = this.currentQuestion + 1;
        document.getElementById('totalQ').textContent = this.questions.length;
        
        // Update progress bar if it exists
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    showStatusMessage(message, type = 'info') {
        // Try to use existing status manager, fallback to console or alert
        if (typeof statusManager !== 'undefined' && statusManager.showMessage) {
            statusManager.showMessage(message, 3000);
        } else {
            // Create a simple status display
            const statusDiv = document.getElementById('statusMessage') || this.createStatusDiv();
            statusDiv.textContent = message;
            statusDiv.className = `status-message ${type}`;
            statusDiv.style.display = 'block';
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

   showFinalResult(result){
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.style.display='none';
    questionText.innerText = result;
   }

    showFinalScore() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            message = 'Excellent! You\'re an  expert! 🌟';
            emoji = '🏆';
        } else if (percentage >= 70) {
            message = 'Great job! 👏';
            emoji = '🎉';
        } else if (percentage >= 50) {
            message = 'Good effort! 📚';
            emoji = '👍';
        } else {
            message = 'Don\'t worry Try again! 💪';
            emoji = '🤔';
        }
        
        // Display final results
        const finalMessage = `${emoji} Quiz Complete!\n\nYour Score: ${this.score}/${this.questions.length} (${percentage}%)\n\n${message}`;
        
        // Show in status or alert
        this.showFinalResult(finalMessage, 'success');
        
        // Show restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.style.display = 'inline-block';
        }
        
        // Hide next button
        document.getElementById('nextBtn').style.display = 'none';
        
        // Optional: Show detailed results
        // this.showDetailedResults();
    }

   
    

    restart() {
        // Reset all game state
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.userAnswers = [];
        
        // Hide restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.style.display = 'none';
        }
        
        // Hide status message
        const statusDiv = document.getElementById('statusMessage');
        if (statusDiv) {
            statusDiv.style.display = 'none';
        }
        
        // Reset progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Restart the quiz
        this.displayQuestion();
        this.updateStats();
        
        this.showStatusMessage('Quiz restarted! Good luck! 🚀', 'info');
    }

    // Utility method to get current question data
    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    // Utility method to check if quiz is complete
    isComplete() {
        return this.currentQuestion >= this.questions.length - 1 && this.answered;
    }

    // Method to add new questions dynamically
    addQuestion(questionObj) {
        if (questionObj.question && questionObj.options && questionObj.ans !== undefined) {
            this.questions.push(questionObj);
            this.updateStats();
            return true;
        }
        return false;
    }

    // Method to shuffle questions
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
}