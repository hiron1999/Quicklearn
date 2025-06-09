import {gen_summary,gen_questions,extractJsonFromLLMResponse,initLLM} from "./app.js";
import QuizGame from "./quiz.js";
import { exportTextPDF } from "./pdfexporter.js";
import DocumentTextExtractor from "./documentExtractor.js";

const SubmitBtn =document.getElementById("submitBtn");
const ExportBtn = document.createElement("button");
const FileUploadBtn = document.getElementById("fileInput")
const input= document.getElementById("userInput");
// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Note: localStorage removed for Claude.ai compatibility
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Status Manager
class StatusManager {
    constructor() {
        this.statusMessage = document.getElementById('statusMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
    }

    showLoading(message = 'Processing...') {
        this.loadingSpinner.classList.add('active');
        this.statusMessage.textContent = message;
        // SubmitBtn.disabled=true;
    }

    hideLoading(msg='Ready') {
        this.loadingSpinner.classList.remove('active');
        this.statusMessage.textContent = msg;
    }

    showMessage(message, duration = 3000) {
        this.statusMessage.textContent = message;
        if (duration > 0) {
            setTimeout(() => {
                this.statusMessage.textContent = 'Ready';
            }, duration);
        }
    }
}

// Tab Manager
class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab contents
        this.contents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }
}



function display_summery(mdText){
    const html = marked.parse(mdText);
    document.getElementById('outputArea').innerHTML = html;
}
//apply theme toggle
const thememanager =new ThemeManager();
const qizManager= new QuizGame();
//enable tab switch
const tabmng = new TabManager();

const statusmanager = new StatusManager();

 
//  console.log('triggered with input : ' ,inputprompt);
// submit article handel
function handleSubmit(txt){

    // console.log('triggered with input : ',txt);

    //generate summary
    statusmanager.showLoading("generating summary.....");
    gen_summary(txt) .then(res=>{
        // console.log(res);
        display_summery(res);
        statusmanager.showLoading("Preparing Quiz.....");
        gen_questions(res).then(ques => {
            // console.log(ques);
            const Questions = extractJsonFromLLMResponse(ques);
            statusmanager.hideLoading("Quiz available now");
            // console.log("parsed object" , Questions);
            qizManager = new QuizGame(Questions);
        });
        const outputarea =document.getElementById("outputTab");
        ExportBtn.id = 'exportBtn';
        ExportBtn.innerHTML = `<span class="btn-text">Save Notes</span>
                            <span class="btn-icon">→</span>`;
        ExportBtn.classList.add('submit-btn');

        //export pdf
        ExportBtn.addEventListener('click', async () => {
        statusmanager.showMessage("generating pdf");
        await exportTextPDF();
});
        outputarea.append(ExportBtn);
    });

}


// console.log(SubmitBtn);
SubmitBtn.addEventListener("click", () => { 
    // console.log("clicked....");
    //fetch article from text area
    const inputprompt=input.value;
    if (!inputprompt || inputprompt.trim().length === 0) statusmanager.showMessage('please add some context .. ')
    else handleSubmit(inputprompt); });

FileUploadBtn.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
    //   console.log("File selected:", file.name);
      // Pass to your text extractor class or function
      const docExt = new DocumentTextExtractor();
      if(docExt.isSupported(file)){
          statusmanager.showLoading(`extracting content from [${file.name}] please wait!`);
        docExt.extractAndCleanText(file).then(
            text=>{
                // console.log(text);
                input.value=text;
                statusmanager.hideLoading();
            }
        )
        
      }
    } else {
      console.log("No file selected.");
    }
    
  });

export{statusmanager}