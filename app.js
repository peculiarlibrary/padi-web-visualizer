// PADI A2UI: Sovereign Clustering Engine
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(30))
    // Global repulsion to keep clusters distinct
    .force("charge", d3.forceManyBody().strength(-200))
    // The "Sovereign Anchor" - Forces the whole graph to the viewport center
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    // Global gravity to keep nodes from escaping
    .force("gravity", d3.forceX(window.innerWidth / 2).strength(0.05))
    .force("gravityY", d3.forceY(window.innerHeight / 2).strength(0.05))
    // Collision detection ensures no node overlaps
    .force("collision", d3.forceCollide().radius(d => d.radius + 5));

// Ensure the simulation respects screen resizing
window.addEventListener("resize", () => {
    simulation.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
    simulation.alpha(0.3).restart();
});
