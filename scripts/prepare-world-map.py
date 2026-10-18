"""Build local SVG path data from Natural Earth's 110m country GeoJSON.

Usage: python3 scripts/prepare-world-map.py /path/to/ne_110m_admin_0_countries.geojson
Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
License: https://www.naturalearthdata.com/about/ (public domain)
This script does not fetch or modify follower insights.
"""
import json
import sys
from pathlib import Path

source = json.loads(Path(sys.argv[1]).read_text())
shapes = []
for feature in source['features']:
    properties = feature['properties']
    code = properties['ADM0_A3']
    if code == 'ATA':
        continue
    geometry = feature['geometry']
    polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    rings = []
    for polygon in polygons:
        for ring in polygon:
            points = [((point[0]+180)*1000/360, (85-point[1])*1000/360) for point in ring]
            rings.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x, y in points)+'Z')
    shapes.append({'id': code, 'name': properties.get('NAME_EN', properties['NAME']), 'd': ''.join(rings)})
target = Path(__file__).resolve().parents[1] / 'app/data/world-map.json'
target.write_text(json.dumps(shapes, separators=(',', ':'))+'\n')
print(f'{len(shapes)} country shapes written to {target}')
