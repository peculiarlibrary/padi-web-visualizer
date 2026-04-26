# PADI Web Visualizer
## The Interface Layer of the Sovereign Bureau

The **PADI Web Visualizer** is the frontend observability node designed to consume, parse, and render the deterministic logic produced by the [PADI Ontology Kernel](https://github.com/peculiarlibrary/padi-ontology-kernel). 

Its primary function is to transform complex **OWL 2** and **RDF** graph structures into interactive, human-readable visualizations using **D3.js** and semantic web technologies.

---

## Role in the Bureau
This repository represents the **"View"** in the Bureau’s architectural model:
1. **Pillar 1 (Kernel):** Computes truth and validates logic.
2. **Pillar 2 (Documentation):** Defines the mandate and policy.
3. **Pillar 3 (Visualizer):** Renders the validated state for human oversight.

## Technical Stack
- **D3.js / SVG:** For high-fidelity force-directed graph layouts.
- **JSON-LD / RDF.js:** For native consumption of semantic data.
- **Vanilla JavaScript/ES6:** Maintaining a low-dependency, high-integrity codebase.

## Core Artifacts
- **`CoderLegion_PADI_Prototype.jsonld`**: The foundational sample data structure. It serves as the mock-truth for testing visual rendering of node relationships, ontological classes, and property axioms.
- **`index.html`**: The entry point for the Visualizer Node (configured for GitHub Pages).

## Deployment & Usage
The visualizer is automatically deployed via **GitHub Pages**. To view the live graph rendering of the PADI Prototype:
1. Ensure the `main` branch is selected.
2. Navigate to the deployment URL (provided by GitHub).

### To Run Locally:
```bash
git clone [https://github.com/peculiarlibrary/padi-web-visualizer.git](https://github.com/peculiarlibrary/padi-web-visualizer.git)
cd padi-web-visualizer
# Use a local server to avoid CORS issues with JSON-LD
python -m http.server 8000
