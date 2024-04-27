var map = L.map('map').setView([0, 0], 1); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var locations = [
    { name: 'Bulgaria', coordinates: [42.7339, 25.4858], url: 'https://www.google.com' },
    { name: 'Germany', coordinates: [51.5167, 9.9167], url: 'https://www.google.com' },
    { name: 'USA', coordinates: [39.000000, -80.500000], url: 'https://www.google.com' },
];
locations.forEach(location => {
    var marker = L.marker(location.coordinates).addTo(map);
    marker.bindPopup(`<b>${location.name}</b><br>Loading ping...`);
    fetchPing(location)
        .then(ping => {
            if (ping !== null) {
                marker.bindPopup(`<b>${location.name}</b><br>Ping: ${ping}ms`);
                marker.on('click', function() {
                });
            } else {
                marker.bindPopup(`<b>${location.name}</b><br>Failed to fetch ping data`);
            }
        })
        .catch(error => {
            console.error(`Error fetching ping for ${location.name}:`, error);
            marker.bindPopup(`<b>${location.name}</b><br>Failed to fetch ping data`);
        });
});

function fetchPing(location) {
    return new Promise((resolve, reject) => {
        var startTime = performance.now();
        fetch(`https://proxy.cloudnest.wtf:8443/proxy?url=${encodeURIComponent(location.url)}`)
            .then(response => {
                var endTime = performance.now();
                if (response.ok) {
                    resolve(endTime - startTime);
                } else {
                    reject(new Error('Failed to fetch resource'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}




