const fs = require('fs');
let code = fs.readFileSync('src/components/transform/TransformPage.jsx', 'utf8');

const concurrentLoop = `        // Process concurrently in chunks of 3 to avoid massive 429s, but keep it extremely fast
        const chunkSize = 3;
        for (let i = 0; i < selectedOutputs.length; i += chunkSize) {
          const chunk = selectedOutputs.slice(i, i + chunkSize);
          await Promise.all(chunk.map(async (outputType) => {
            try {
              const content = await generateIntelligence(combinedText, outputType, state.apiConfig, language);
              dispatch({
                type: 'ADD_GENERATED_OUTPUT',
                payload: { jobId, outputType, content }
              });
            } catch (err) {
              console.error(\`Generation failed for \${outputType}:\`, err);
              dispatch({
                type: 'ADD_GENERATED_OUTPUT',
                payload: { jobId, outputType, content: \`Error generating content: \${err.message}\` }
              });
            }
          }));
          // Tiny delay between chunks to let Groq TPM token bucket drain safely
          if (i + chunkSize < selectedOutputs.length) {
            await new Promise(r => setTimeout(r, 2500));
          }
        }`;

code = code.replace(/\/\/ Generate sequentially to completely avoid JSON token cutoffs on Groq\s+for \(const outputType of selectedOutputs\) \{\s+try \{\s+const content = await generateIntelligence\(combinedText, outputType, state\.apiConfig, language\);\s+dispatch\(\{\s+type: 'ADD_GENERATED_OUTPUT',\s+payload: \{ jobId, outputType, content \}\s+\}\);\s+\} catch \(err\) \{\s+console\.error\(\`Generation failed for \$\{outputType\}:\`, err\);\s+dispatch\(\{\s+type: 'ADD_GENERATED_OUTPUT',\s+payload: \{ jobId, outputType, content: \`Error generating content: \$\{err\.message\}\` \}\s+\}\);\s+\}\s+\}/, concurrentLoop);

fs.writeFileSync('src/components/transform/TransformPage.jsx', code);
console.log('Done patching TransformPage!');
