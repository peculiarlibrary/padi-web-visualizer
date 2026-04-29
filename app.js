const DATA_URL = 'https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json';

d3.json(DATA_URL).then(data => {
    const svg = d3.select("#visualizer");
    const width = window.innerWidth;
    const height = window.innerHeight;

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g").selectAll("line")
        .data(data.links).enter().append("line")
        .attr("stroke", "#58a6ff").attr("stroke-width", 2);

    const node = svg.append("g").selectAll("circle")
        .data(data.nodes).enter().append("circle")
        .attr("r", 12).attr("fill", "#f0883e")
        .call(d3.drag()
            .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; }));

    node.append("title").text(d => d.id);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
});
