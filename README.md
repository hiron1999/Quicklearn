# QuickLearn AI

**Version:** v1.0.0  
**Author:** Hiron Saha  
**Date:** 08/06/2025  
**Status:** ✅ Completed  

---

## 🚀 Project Overview

QuickLearn AI is a privacy-focused, AI-powered assistant that runs entirely on the client side. It helps users quickly analyze and summarize large volumes of content and generates interactive quizzes for better retention—all while ensuring that sensitive data never leaves the user's device.

---

## 🎯 Objective

To develop a client-side AI assistant that:
- Summarizes long content by extracting key data points.
- Ensures privacy by not transmitting any data to external servers.
- Generates interactive quizzes from summarized content for self-assessment and learning reinforcement.

---

## 🛠 Technologies Used

| Technology  | Purpose                              |
|-------------|--------------------------------------|
| HTML/CSS    | Frontend UI                          |
| JavaScript  | Client-side logic                    |
| LLM (Gemma 2)| Local AI model by Google             |
| MediaPipe   | AI agent orchestration               |

---

## 🧱 Architecture Diagram

*(You can embed an image here if you have one)*

---

## ✨ Features

### 🧠 AI-Powered Summarization
- Extracts important points from long content.
- Supports `.pdf`, `.docx`, and plain text.
- Highlights key data for quick understanding.

### ✅ Quiz Generation
- Automatically generates MCQs from the summary.
- Includes correct answers for instant feedback.
- Enhances memory via active recall.

### 🔐 Client-Side Processing
- All processing happens in-browser.
- No data is sent to any server.
- Great for private or confidential use.

### 🖇 Multi-Format Input Support
- Accepts text input and file uploads.
- Supports `.pdf`, `.docx` formats.

### 🧾 Clean User Interface
- Responsive, accessible design.
- Works across desktop and mobile.
- Includes theme mode toggle.

### 📦 Offline-Friendly (Optional)
- Can run offline after initial load.
- Suitable for secure, air-gapped environments.

---

## 💻 Hardware Recommendations

As the model runs locally, performance may vary on low-end devices.

### 🖥 Gemma2 2B Minimum Requirements:

| Resource  | Recommendation |
|-----------|----------------|
| RAM       | 8–12 GB        |
| GPU       | Optional but recommended (e.g., GTX 1650+) |
| CPU       | Quad-core or better |
| Browser   | Latest Chrome, Edge, or Firefox (WebGPU/WebGL & WASM support) |

🔗 [Gemma Model Details](https://github.com/google-deepmind/gemma?tab=readme-ov-file)

---

## 🌐 API Endpoints

This application has **no backend**. It is deployed via GitHub Pages.

🔗 [Live App URL](https://hiron1999.github.io/Quicklearn/)

---

## 🧭 Usage Instructions

- Open the app via the [Live URL](https://hiron1999.github.io/Quicklearn/)
- Upload a file or paste content.
- View the summarized output.
- Take the auto-generated quiz!

---

## ⚠️ Known Issues / Limitations

- Can handle up to ~8000 tokens (~4000 words) due to quantization.
- First-time load may take time due to local model download.

---

## 📬 Contact

**Name:** Hiron Saha  
**Email:** [hironsaha0@gmail.com](mailto:hironsaha0@gmail.com)  
**LinkedIn:** [linkedin.com/in/hiron-saha-b7912b198](https://www.linkedin.com/in/hiron-saha-b7912b198/)  
**GitHub:** [github.com/hiron1999](https://github.com/hiron1999)

---
