# OmniForge
## NTRO SIH 2024 Solution (Problem Statement 26154)

OmniForge is an elite, multi-modal Gen AI platform designed specifically to ingest raw threat intelligence and fully automate the generation of tailored, multi-lingual, multi-format communication artifacts (advisories, flowcharts, videos, presentations) through a highly configurable dashboard.

### Features
* **Intelligent Transformation Engine**: Powered by Groq (LLaMA-3) and NVIDIA (Nemotron) for zero-latency, high-fidelity content generation.
* **Massive Parallel Generation**: Select multiple deliverables at once and generate them all simultaneously from a single intelligence source.
* **Granular Generation Controls**: Full control over *Target Audience, Tone, Level of Detail*, and native dialect localization (10+ languages including Hindi, Tamil, Telugu, Marathi).
* **Automated Visualizations**: Automatically generates native Mermaid.js flowcharts (Cyber Kill Chains) and Architecture diagrams.
* **Omni-Modal Formats**: Produces PPTX slides, Markdown, PDF Mission Packages, and MP3 Audio Briefings (using native regional accents).

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/omniforge.git
   cd omniforge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Navigate to `http://localhost:5173` in your browser. API Keys for Groq and NVIDIA are securely injected at runtime for ease of evaluation.
