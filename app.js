// PADI A2UI: Sovereign Bridge v2.0
const METADATA_URL = 'https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json';

async function ingestSovereignData() {
    try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        console.log("Librarian: Data Ingested", data);
        
        // Transform Metadata into D3 Nodes
        const nodes = [
            { id: data.node, group: 1, label: "NODE" },
            { id: data.latest_publication, group: 2, label: "PUBLICATION" },
            { id: data.architect, group: 3, label: "ARCHITECT" }
        ];
        
        const links = [
            { source: data.node, target: data.latest_publication },
            { source: data.node, target: data.architect }
        ];

        renderGraph(nodes, links);
    } catch (err) {
        console.error("Epistemic Break: Link failed", err);
    }
}

// 3. Robust Rendering Engine
function renderGraph(nodes, links) {
    const svg = d3.select("svg");
    const width = +svg.attr("width") || window.innerWidth;
    const height = +svg.attr("height") || window.innerHeight;

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Update UI elements from metadata
    document.getElementById('node-status').innerText = "NODE: " + nodes[0].id;

    // (Standard D3 selection/join logic follows here...)
    console.log("Graph Rendered: " + nodes.length + " nodes active.");
}

ingestSovereignData();
