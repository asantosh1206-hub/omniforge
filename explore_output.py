import os

path = 'src/components/output/OutputPage.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add ReactMarkdown import
target_import = """import { useLanguage } from '../../context/LanguageContext';"""
replacement_import = """import { useLanguage } from '../../context/LanguageContext';
import ReactMarkdown from 'react-markdown';"""
content = content.replace(target_import, replacement_import)

# Modify renderDocumentPreview to use ReactMarkdown if there's real content
# We will check if state.activeJobId and state.generatedOutputs exist
# We will just replace the renderDocumentPreview entirely.
# First, let's inject `activeJobId` and `generatedOutputs` extraction.

target_context = """  const { state, dispatch } = useApp();"""
replacement_context = """  const { state, dispatch } = useApp();
  const activeOutputs = state.activeJobId ? state.generatedOutputs[state.activeJobId] : null;"""
content = content.replace(target_context, replacement_context)

# Now, rewrite the mock document preview section
# We'll replace the static mock document structure with dynamic ReactMarkdown if `activeOutputs` has the currently viewed category.
# Currently, the OutputPage renders by matching `selectedOutput.name`. We need a mapping or just pass the raw content.
# Wait, I don't know the exact structure of OutputPage's selectedOutput viewing. Let's see how OutputPage is structured.
