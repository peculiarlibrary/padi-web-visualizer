// PADI A2UI: Sovereign Anchor & Safety Net
const width = window.innerWidth;
const height = window.innerHeight;

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(50))
    // REDUCED repulsion to prevent the "explosion"
    .force("charge", d3.forceManyBody().strength(-50)) 
    // HARD centering force
    .force("center", d3.forceCenter(width / 2, height / 2))
    // Friction/Velocity Decay - keeps things from moving too fast
    .velocityDecay(0.4);

// The "Safety Net" - Mathematical Bounding Box
simulation.on("tick", () => {
    nodes.forEach(d => {
        // Force nodes to stay 30px away from any edge
        d.x = Math.max(30, Math.min(width - 30, d.x));
        d.y = Math.max(30, Math.min(height - 30, d.y));
    });
    
    // Update your SVG element positions here (link/node update logic)
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`);
});
