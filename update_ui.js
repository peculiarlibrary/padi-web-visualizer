// A2UI: Automated Metadata Fetcher
fetch('https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json')
  .then(res => res.json())
  .then(data => {
    console.log("PADI Metadata Ingested:", data);
    // These IDs must exist in your index.html to show up!
    if(document.getElementById('node-status')) {
        document.getElementById('node-status').innerHTML = "NODE: " + data.node;
    }
    if(document.getElementById('latest-pub')) {
        document.getElementById('latest-pub').innerHTML = "LATEST: " + data.latest_publication;
    }
  })
  .catch(err => console.error("A2UI Sync Error:", err));
