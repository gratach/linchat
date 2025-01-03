#!/usr/bin/python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from pathlib import Path

hostName = "localhost"
serverPort = 9162

class MeinServer(BaseHTTPRequestHandler):
	def do_GET(self):
		daten = b""
		print(self.path)
		pfad = Path(self.path)
		sp = Path(__file__).resolve().parent / "www"
		pfad = sp / pfad.relative_to("/")
		for x in [pfad] + [y for y in pfad.parents]:
			if x == sp:
				tempfad = pfad / "index.html" if pfad.is_dir() else pfad
				if not tempfad.is_file(): continue
				self.send_response(200)
				if tempfad.suffix == ".html":
					self.send_header("content-type", "text/html; charset=\"utf-8\"")
				elif tempfad.suffix == ".js":
					self.send_header("content-type", "text/javascript; charset=\"utf-8\"")
				elif tempfad.suffix == ".mjs":
					self.send_header("content-type", "text/javascript; charset=\"utf-8\"")
				elif tempfad.suffix == ".wasm":
					self.send_header("content-type", "application/wasm")
				with tempfad.open('rb') as fil:
					daten = fil.read()
				self.send_header("content-length", str(len(daten)))
				self.end_headers()
				self.wfile.write(daten);
				return
		self.send_error(404, "datei existiert nicht")

if __name__ == "__main__":		
	wq = HTTPServer((hostName, serverPort), MeinServer)
	print("Der Server wurde gestartet:\n http://%s:%s" % (hostName, serverPort))

	try:
		wq.serve_forever()
	except KeyboardInterrupt:
		pass
	wq.server_close()
	print("Der Server wurde gestoppt") 
else:
	print("nicht main")
