const DATA_URL = 'https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json';

d3.json(DATA_URL).then(data => {
    const svg = d3.select("#visualizer");
    const width = window.innerWidth, height = window.innerHeight;

    // Clear previous view
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g").selectAll("line")
        .data(data.links).enter().append("line")
        .attr("stroke", "#58a6ff").attr("stroke-width", 1);

    const node = svg.append("g").selectAll("circle")
        .data(data.nodes).enter().append("circle")
        .attr("r", 8).attr("fill", d => d.group === 1 ? "#f0883e" : "#58a6ff");

    node.append("title").text(d => d.id);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
}).catch(err => console.error("Visualizer Error:", err));
