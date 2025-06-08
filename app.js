import { FilesetResolver ,LlmInference } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai';
import FileProxyCache from 'https://cdn.jsdelivr.net/gh/jasonmayes/web-ai-model-proxy-cache@main/FileProxyCache.min.js';
import { statusmanager } from './animate.js';
const modelFileRemote= 'https://storage.googleapis.com/quick_learn/models/gemma2-2b-it-gpu-int8.bin';
const Gama2Url = '/assets/models/gemma2-2b-it-gpu-int8.bin'
const modelFileLocal = 'http://localhost/gemma2-2b-it-gpu-int8.bin';
var llmInference = undefined;

function modelLoadingprogress(update){
    // console.log(update);
    statusmanager.showLoading("Downloading model status : "+update);

}

async function initLLM() {
    statusmanager.showLoading("Initilizing model...")
    var ModelUrl =await FileProxyCache.loadFromURL(modelFileLocal,modelLoadingprogress);

    if(ModelUrl==null){
        ModelUrl = await FileProxyCache.loadFromURL(modelFileRemote,modelLoadingprogress);
        
    }
    


const genai = await FilesetResolver.forGenAiTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm"
);
const llm = await LlmInference.createFromOptions(genai, {
    baseOptions: {
        modelAssetPath: ModelUrl
    },
    maxTokens: 8000,
    topK: 20,
    temperature: 0.1,
    randomSeed: 0,
});

llmInference=llm;
statusmanager.hideLoading('Model is loaded successfully');
}

initLLM();


function gen_summary(inputprompt){
   
    const sys_inst = `
 You are an expert in data extraction and summarization. Your task is to extract important data points from an article to create a summary. The summary should emphasize numerical and statistical data, as well as reasoning. 

Use the article below to generate a summary.

Article:
${inputprompt}
**important 
- Do NOT use phrases like "The article says", "This article discusses", or "It begins by".
- Write the summary as if explaining the key points directly to someone unfamiliar with the source.
Follow these instructions:
1. there should be atleast 6 sections 
2.  Under each section, include a paragraph summarizing the section's content.
3.  Limit each paragraph to a maximum of 50 words.
4.  Ensure the summary includes important data points, such as numerical data, statistics, and reasoning.
5. use markdown format 
`;

return llmInference.generateResponse(sys_inst);
// generator(sys_inst,setings).then(res=>display_summery(res[0].summary_text));
}



// submit article handel
//  const button = document.getElementById("submitBtn").addEventListener("click", gen_summary);
 

 function gen_questions(context){

    const quizPrompt = `
You are a quiz generation assistant.

Your task is to read the provided context and generate a multiple-choice question (MCQ) quiz.

Output Requirements:
- Return a valid JSON array.
- Each item in the array should be a JSON object with the following fields:
  - "question": The question text.
  - "options": An object with keys "A", "B", "C", and "D" representing the answer choices.
  - "ans": The correct answer (use one of: "A", "B", "C", or "D").
- The output must be a valid JSON string that can be parsed using JSON.parse().

Guidelines:
- Generate at least 5 MCQs.
- Each question must have exactly 4 options (A, B, C, D).
- Each question should have only one correct answer.

Context:
${context}
`;
   return llmInference.generateResponse(quizPrompt)
    
 }

 function extractJsonFromLLMResponse(response) {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = response.match(regex);
    
    if (match && match[1]) {
      try {
        const json = JSON.parse(match[1]);
        return json;
      } catch (err) {
        throw new Error("Failed to parse JSON: " + err.message);
      }
    } else {
      throw new Error("No valid JSON code block found.");
    }
  }

  
  export {gen_summary , gen_questions,extractJsonFromLLMResponse,initLLM }