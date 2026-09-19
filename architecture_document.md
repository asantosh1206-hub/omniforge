# OmniForge: Architecture Document
**NTRO SIH 2024 Solution (Problem Statement 26154)**

## 1. System Overview
OmniForge is an intelligent, React-based web application designed to act as an AI-powered content transformation engine. It receives raw source content (such as unclassified text, threat intelligence, or policy documents) and autonomously orchestrates the generation of diverse, format-specific deliverables based on configurable operator constraints. 

The system leverages a dual-LLM routing architecture (Groq and NVIDIA) to maximize both speed and reasoning capabilities, ensuring near-instantaneous artifact generation.

## 2. Component Architecture

### 2.1 Frontend Interface (Vite / React / Context API)
The user interface is built on a high-performance React frontend leveraging the Context API for robust state management. 
- **`IngestPage`**: Operators submit raw source content (text, metadata).
- **`TransformPage`**: Operators define strict generation parameters (Target Audience, Tone, Level of Detail, Language) and select the desired output deliverables (e.g., Video Scripts, Threat Advisories, Flowcharts).
- **`OutputPage`**: A rich, tabbed environment for rendering generated artifacts. It includes Markdown parsers, native Mermaid.js SVG renderers, and HTML5 audio players for localized TTS briefings.

### 2.2 Orchestration Engine (`llmService.js`)
The core intelligence layer. This service intercepts the operator's payload and structures deterministic prompts.
- **Dynamic Parameter Injection**: The LLM prompt is dynamically augmented with the operator's chosen Tone, Audience, and Detail parameters.
- **Batch Generation Mechanism**: Instead of hitting API rate limits with dozens of serial requests, OmniForge chunks deliverables into optimized parallel requests.
- **Translation Enforcement Guardrails**: Enforces that the LLM engine returns strictly formatted JSON with English schema keys, while translating only the markdown payload strings into regional Indian languages (Hindi, Tamil, Telugu, etc.).

### 2.3 Visual & Auditory Generation Layers
- **Diagram Synthesis (Mermaid.js)**: The LLM is instructed to generate structural Mermaid.js code representing Cyber Kill Chains and Network Architectures. The frontend safely sanitizes and compiles this code into visually stunning SVGs.
- **Text-To-Speech (Google TTS API)**: Generates localized audio briefings. The engine dynamically maps requested languages (e.g., `te` for Telugu) to optimal regional dialect codes (`te-IN`) to ensure authentic pronunciation.
- **Mission Package Engine (html2pdf)**: A custom document compiler that stitches together HTML, markdown tables, and sanitized SVG diagrams into a massive, monolithic PDF report representing the full "Mission Package".

## 3. Data Flow
1. **Operator Input** -> `IngestPage` captures raw text.
2. **Configuration** -> `TransformPage` sets `audience=Executive`, `tone=Urgent`, `language=hi`, `outputs=[Executive Summary, Flowchart, Video Script]`.
3. **Orchestration** -> `llmService.js` routes a highly constrained prompt to the Groq LLaMA-3 inference endpoint.
4. **Processing** -> The LLM processes the text, adheres to the Tone/Audience constraints, translates the content to Hindi, and outputs a JSON blob.
5. **Rendering** -> `OutputPage` parses the JSON, compiles the Mermaid.js flowcharts, fetches the Hindi MP3 audio, and presents the final deliverables to the operator.
