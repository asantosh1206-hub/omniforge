import mermaid from 'mermaid';

const code = `flowchart TD
classDef malicious fill:#450a0a,stroke:#ef4444,color:#f87171,stroke-width:2px,stroke-dasharray: 5 5;
classDef defensive fill:#052e16,stroke:#22c55e,color:#4ade80,stroke-width:2px;
classDef neutral fill:#172554,stroke:#3b82f6,color:#60a5fa,stroke-width:2px;
classDef external fill:#4a044e,stroke:#d946ef,color:#f0abfc,stroke-width:2px,stroke-dasharray: 5 5;
classDef secure fill:#052e16,stroke:#22c55e,color:#4ade80,stroke-width:2px;
classDef internal fill:#172554,stroke:#3b82f6,color:#60a5fa,stroke-width:2px;
subgraph Recon [Reconnaissance]
  direction TB
  R1[("Supply Chain")]:::neutral --> R2[("Recon Tools")]
end
subgraph Weaponization [Weaponization]
  direction TB
  W1{{"Malicious Script"}}:::malicious --> W2[("Obfuscated Batch")]:::malicious
end
subgraph Delivery [Delivery]
  direction TB
  D1["USB Drop"]:::malicious --> D2["Temporary Network Bridge"]:::malicious
end
subgraph Exploitation [Exploitation]
  direction TB
  E1{{"Credential Dumping"}}:::malicious -->|Mimikatz Variant| E2["LSASS Dump"]
end`;

async function test() {
  mermaid.initialize({ startOnLoad: false });
  try {
    const isValid = await mermaid.parse(code);
    console.log("Parse successful:", isValid);
  } catch (e) {
    console.error("PARSE FAILED:", e.message);
  }
}
test();
