# OmniForge: Technical Presentation Script
**NTRO SIH 2024 Solution (Problem Statement 26154)**

*(This script corresponds to a 5-slide presentation for hackathon evaluation)*

---

### Slide 1: Introduction & Problem Statement
**Visual:** OmniForge Logo, NTRO Problem Statement 26154, Title: "Gen AI Platform for Automated Content Transformation"
**Script:** 
"Hello everyone, we are presenting OmniForge. NTRO's problem statement highlighted a critical operational bottleneck: analysts spend hours manually converting raw intelligence into briefings, tweets, or diagrams. They need an intelligent platform that takes a single source of truth and instantly generates format-specific deliverables based on the operator's exact needs. OmniForge is that platform."

---

### Slide 2: The OmniForge Dashboard
**Visual:** Screenshots of the IngestPage and TransformPage, highlighting the Target Audience, Tone, and Level of Detail dropdowns.
**Script:**
"Our platform features a highly intuitive dashboard. First, the operator pastes the raw source content. Then, they are presented with granular generation controls. As requested by the problem statement, the operator can dictate the Target Audience, the Tone, the Level of Detail, and the Target Language. Finally, they select their desired output formats—whether that's a Threat Advisory, a LinkedIn post, or a full Video Script and Storyboard."

---

### Slide 3: The Intelligence Engine
**Visual:** Diagram showing Raw Text -> llmService.js (Groq/NVIDIA) -> JSON -> Parallel Deliverables.
**Script:**
"Under the hood, OmniForge is powered by a high-speed orchestration engine. We route queries through Groq and NVIDIA using advanced LLaMA-3 models. To ensure operational efficiency, we utilize Batch Generation. The engine takes the source content and the operator's parameters, and generates all requested deliverables in massive parallel chunks, returning a strictly structured JSON object in seconds."

---

### Slide 4: Multi-Modal Output & Localization
**Visual:** Screenshots of the OutputPage showing a Mermaid flowchart, a translated Hindi summary, and the Audio player.
**Script:**
"OmniForge isn't just a text generator; it's a multi-modal transformation engine. It autonomously writes Mermaid.js code to generate visual Cyber Kill Chains and Network Architectures. Furthermore, we implemented deep localization. The engine translates the content into regional languages like Hindi, Marathi, and Tamil, and even synthesizes native-accented audio briefings using Text-to-Speech, completely automating the communication pipeline."

---

### Slide 5: Mission Package Export
**Visual:** The "Generate Mission Package" button and a preview of the massive PDF report.
**Script:**
"Finally, the operator doesn't have to copy-paste the results. With one click, our PDF Export Engine stitches the markdown, the tables, and the visual SVG diagrams into a single, comprehensive Mission Package archive. OmniForge reduces manual effort, improves consistency, and drastically accelerates content creation, perfectly aligning with NTRO's objectives. Thank you."
