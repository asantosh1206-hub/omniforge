document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const views = {
        upload: document.getElementById('upload-view'),
        loading: document.getElementById('loading-view'),
        result: document.getElementById('result-view')
    };
    
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
    const uploadedImage = document.getElementById('uploaded-image');
    const heatmapOverlay = document.getElementById('heatmap-overlay');
    const toggleHeatmap = document.getElementById('toggle-heatmap');
    const resetBtn = document.getElementById('reset-btn');
    
    // Result Elements
    const resultCard = document.getElementById('result-card');
    const diagnosisLabel = document.getElementById('diagnosis-label');
    const severityBadge = document.getElementById('severity-badge');
    const confidenceValue = document.getElementById('confidence-value');
    const confidenceBarFill = document.getElementById('confidence-bar-fill');
    const explanationText = document.getElementById('explanation-text');

    // Diagnosis Outcomes Logic
    const diagnoses = [
        { level: 0, label: "No DR (Normal)", color: "var(--color-level-0)", explanation: "No significant signs of diabetic retinopathy detected in this scan." },
        { level: 1, label: "Mild DR", color: "var(--color-level-1)", explanation: "Model detected early-stage microaneurysms consistent with mild DR." },
        { level: 2, label: "Moderate DR", color: "var(--color-level-2)", explanation: "Multiple hemorrhage-like regions detected, consistent with moderate DR." },
        { level: 3, label: "Severe DR", color: "var(--color-level-3)", explanation: "Extensive lesion patterns detected across multiple retinal quadrants." },
        { level: 4, label: "Proliferative DR", color: "var(--color-level-4)", explanation: "Signs consistent with abnormal blood vessel growth (neovascularization)." }
    ];

    // Helper: Switch views
    function switchView(viewName) {
        Object.values(views).forEach(view => view.classList.remove('active'));
        views[viewName].classList.add('active');
    }

    // Drag and Drop Events
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    uploadBox.addEventListener('click', (e) => {
        if(e.target !== fileInput && !e.target.classList.contains('primary-btn')) {
            fileInput.click();
        }
    });

    // Handle File Upload and Processing Mock
    function handleFileUpload(file) {
        // Only accept images
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        // Read image for display
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Switch to loading view
        switchView('loading');

        // Simulate API call / model inference time (1.5s - 3s)
        const processingTime = Math.floor(Math.random() * 1500) + 1500;
        
        setTimeout(() => {
            processDiagnosis();
            switchView('result');
        }, processingTime);
    }

    // Generate random diagnosis based on weights (weighted towards normal/mild for realism)
    function getRandomDiagnosis() {
        // Weights: Normal(35%), Mild(25%), Moderate(20%), Severe(15%), Proliferative(5%)
        const rand = Math.random();
        if (rand < 0.35) return diagnoses[0];
        if (rand < 0.60) return diagnoses[1];
        if (rand < 0.80) return diagnoses[2];
        if (rand < 0.95) return diagnoses[3];
        return diagnoses[4];
    }
    
    // Generate random mock Grad-CAM overlay using radial gradients
    function generateMockHeatmap(diagnosisInfo) {
        if (diagnosisInfo.level === 0) {
            return 'none'; // No heatmap for normal
        }
        
        // Use colors based on severity
        const baseColor = diagnosisInfo.level >= 3 ? 'rgba(255, 0, 0, 0.8)' : 
                          (diagnosisInfo.level === 2 ? 'rgba(255, 165, 0, 0.8)' : 'rgba(255, 255, 0, 0.7)');
        
        const spots = [];
        const numSpots = diagnosisInfo.level + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numSpots; i++) {
            const x = 30 + Math.random() * 40; // 30-70%
            const y = 30 + Math.random() * 40; // 30-70%
            const size = 15 + Math.random() * 25; // 15-40%
            
            spots.push(`radial-gradient(circle at ${x}% ${y}%, ${baseColor} 0%, rgba(0,255,0,0.4) ${size/2}%, rgba(0,0,255,0) ${size}%)`);
        }
        
        // Add a general central heatmap
        spots.push(`radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, rgba(0,0,255,0) 60%)`);
        
        return spots.join(', ');
    }

    function processDiagnosis() {
        const result = getRandomDiagnosis();
        
        // Generate random confidence score (78% - 97%)
        const confidence = (78 + Math.random() * 19).toFixed(1);
        
        // Update UI
        diagnosisLabel.textContent = result.label;
        diagnosisLabel.style.color = result.color;
        
        severityBadge.textContent = `Level ${result.level}`;
        
        confidenceValue.textContent = `${confidence}%`;
        
        // Reset bar width first for animation
        confidenceBarFill.style.width = '0%';
        setTimeout(() => {
            confidenceBarFill.style.width = `${confidence}%`;
        }, 100);
        
        explanationText.textContent = result.explanation;
        
        resultCard.style.borderLeftColor = result.color;

        // Apply Heatmap
        heatmapOverlay.style.background = generateMockHeatmap(result);
        
        // Make sure toggle is checked
        toggleHeatmap.checked = true;
        heatmapOverlay.style.opacity = '0.7';
    }

    // Toggle Heatmap visibility
    toggleHeatmap.addEventListener('change', (e) => {
        heatmapOverlay.style.opacity = e.target.checked ? '0.7' : '0';
    });

    // Reset Flow
    resetBtn.addEventListener('click', () => {
        fileInput.value = ''; // Clear file input
        uploadedImage.src = '';
        heatmapOverlay.style.background = 'none';
        confidenceBarFill.style.width = '0%';
        switchView('upload');
    });
});
