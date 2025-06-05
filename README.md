**README.md** for your project, assuming it’s a React+Vite app that lets users upload PDFs and uses an LLM (like Llama via Ollama or a cloud API) to generate and export textbooks.

---

# 📚 AI Textbook Generator

A modern React app for generating custom textbooks from your PDF documents using Large Language Models (LLMs) such as Llama 2.  
Users can upload PDFs, extract content, generate AI-powered chapters, and export the result as PDF, DOCX, or HTML.

---

## 🚀 Features

- **PDF Upload:** Drag & drop or select PDF files for processing.
- **AI Generation:** Uses LLMs (local or cloud) to generate textbook chapters and sections based on your uploaded content.
- **Project Management:** Create, edit, and manage multiple textbook projects.
- **Export:** Download your generated textbook as PDF, DOCX, or HTML.
- **Custom Styles:** Choose fonts, colors, and layout options for your textbook.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **PDF Parsing:** [pdfjs-dist](https://github.com/mozilla/pdfjs-dist)
- **AI Integration:** Llama 2 (via Ollama, llama.cpp, or cloud APIs like Together/Replicate)
- **Styling:** Tailwind CSS
- **State Management:** React Context API

---

## ⚡ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/ai-textbook-generator.git
cd ai-textbook-generator
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Set Up the LLM Backend**

#### **Option A: Local Llama (Ollama)**
1. [Install Ollama](https://ollama.com/download) on your machine.
2. Start the model server:
   ```bash
   ollama run llama2
   ```
3. The API will be available at `http://localhost:11434`.

#### **Option B: Use a Cloud LLM API**
- Sign up for a service like [Together AI](https://www.together.ai/), [Replicate](https://replicate.com/), or [OpenRouter](https://openrouter.ai/).
- Get your API key.
- Update the LLM API endpoint and authentication in `src/context/ProjectContext.tsx`.

### 4. **Run the App**

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧩 Project Structure

```
src/
  components/         # React components (Uploader, Extraction, Preview, etc.)
  context/            # ProjectProvider and context logic
  types/              # TypeScript type definitions
  App.tsx             # Main app
  main.tsx            # Entry point
public/
  pdf.worker.min.js   # PDF.js worker file (required for PDF parsing)
```

---

## 🦙 LLM API Integration

- The app sends the combined text of your PDFs to the LLM API.
- You can configure the prompt and endpoint in `src/context/ProjectContext.tsx` (`generateTextbook` function).
- **Default:** Connects to Ollama running locally.  
  To use a cloud API, update the fetch URL and headers as needed.

---

## 📤 Exporting

- After AI generation, you can export your textbook as:
  - PDF
  - DOCX
  - HTML

*(Export is simulated in the demo; for real export, integrate a library like [jsPDF](https://github.com/parallax/jsPDF) or [docx](https://github.com/dolanmiu/docx).)*

---

## 📝 Customization

- **Styling:** Change fonts, colors, and layout in the project style options.
- **Prompt Engineering:** Edit the LLM prompt in the context to improve chapter/section generation.

---

## 🛡️ Security

- **Never expose API keys in client-side code.**  
  If using a paid or rate-limited LLM API, proxy requests through your own backend.

---

## ❓ FAQ

**Q: Why do I get "Failed to fetch" when generating a textbook?**  
A: Make sure your LLM backend (Ollama, etc.) is running and accessible from your app. If using a cloud IDE, you may need a public API endpoint.

**Q: Where are my exported files?**  
A: They are downloaded to your browser's default download location.

**Q: Can I use GPT-4 or other models?**  
A: Yes! Just update the API endpoint and prompt as needed.

---

## 🙏 Credits

- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist)
- [Ollama](https://ollama.com/)
- [Llama.cpp](https://github.com/ggerganov/llama.cpp)
- [Together AI](https://together.ai/)
- [Replicate](https://replicate.com/)

---

## 📄 License

MIT License

---

**Happy textbook building!**  
If you have questions or want to contribute, open an issue or PR!

---

*Need help with deployment or backend integration? Just ask!*
