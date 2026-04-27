d3.json("https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/manifest.json").then(data => {
    const nodes = data.assets.map(d => ({ id: d.path, label: d.name, hash: d.sha256 }));
    console.log("PADI Visualizer Connected:", nodes);
    // D3 force-directed logic goes here...
});
