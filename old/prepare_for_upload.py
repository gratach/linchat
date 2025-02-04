from pathlib import Path
import json

parent_dir = Path(__file__).resolve().parent
custom_config_file = parent_dir / 'custom_config.json'
custom_config = {
    'websocket_url': 'ws://localhost:9249',
}
if custom_config_file.is_file():
    # Load custom config file
    with open(custom_config_file) as f:
        custom_config.update(json.load(f))
dist_dir = parent_dir / 'dist'
dist_dir.mkdir(exist_ok=True)
www_dir = parent_dir / 'www'
for file in www_dir.iterdir():
    if file.is_file():
        content = file.read_text()
        content = content.replace('ws://localhost:9249', custom_config['websocket_url'])
        (dist_dir / file.name).write_text(content)