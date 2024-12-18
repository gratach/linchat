#!/usr/bin/env python3
from pathlib import Path
import asyncio
import datetime
import websockets

kapa = 2000
grenz = 3000


verb = []
nutz = []
nutzdict = {}
nachr = []

ueberlastet = "Der Server ist überlastet"

loop = asyncio.get_event_loop()

def schreibeweg(weg, f):
	f.write(weg)
	f.write(bytes([0xFF]))

def leseweg(f):
	r = b""
	while True:
		b = f.read(1)
		if not b:
			return None
		if b[0] == 0xff:
			return r
		r += b
def wegzuzahl(weg):
	l = len(weg)
	i = 0
	mul = 1
	ges = 0
	while i < l:
		ges += (weg[i] + 1) * mul
		mul *= 255
		i += 1
	return ges
	
def zahlzuweg(zahl):
	i = 0
	mul = 1
	while zahl >= mul:
		zahl -= mul
		mul *= 255
		i += 1
	weg = bytearray(i)
	j = 0
	while j < i:
		weg[j] = zahl % 255
		zahl -= weg[j]
		zahl //= 255
		j += 1
	return weg
def schreibezahl(z, f):
	schreibeweg(zahlzuweg(z), f)
def lesezahl(f):
	l = leseweg(f)
	if not l == None:
		return wegzuzahl(l)
	return None
def schreibebytes(by, f):
	schreibezahl(len(by), f)
	f.write(by)
def lesebytes(f):
	l = lesezahl(f)
	if l == None:
		return None
	r = f.read(l)
	if(len(r) < l):
		return None
	return r

def chatvorbereiten():
	nutzdat = Path("nutz.dat")
	if not nutzdat.is_file(): nutzdat.touch()
	with nutzdat.open("rb") as fil:
		while True:
			na = lesebytes(fil)
			pw = lesebytes(fil)
			ze = lesebytes(fil)
			if ze:
				plusnutzer(na, pw, ze)
			else:
				break
	nachrdat = Path("nachr.dat")
	if not nachrdat.is_file(): nachrdat.touch()
	with nachrdat.open("rb") as fil:
		while True:
			te = lesebytes(fil)
			nu = lesezahl(fil)
			ze = lesebytes(fil)
			if ze:
				plusnachricht(te, nutz[nu], ze)
			else:
				break
def plusnutzer(name, passw, ze):
	global nutz
	global nutzdict
	nu = (len(nutz), name, passw, ze)
	nutz.append(nu)
	nutzdict[name] = nu[0]
	return nu
def plusnachricht(te, nu, ze):
	global nachr
	na = (len(nachr), te, nu, ze)
	nachr.append(na)
	return na
	
def neunutzer(na, pa):
	if erlaubnis(20 + len(na) + len(pa)):
		nu = plusnutzer(na, pa, zeitstempel())
		with open("nutz.dat", "ab") as fil:
			schreibebytes(nu[1], fil)
			schreibebytes(nu[2], fil)
			schreibebytes(nu[3], fil)
		return nu
	return None
	
async def sendenachricht(na, ws):
	await ws.send(str(na[0]))
	await ws.send(na[1].decode('utf-8'))
	await ws.send(na[2][1].decode('utf-8'))
	await ws.send(na[3].decode('utf-8'))
async def sendenachricht_lock(na, ve):
	async with AktivSync(ve):
		await ve[0].send("u")
		await sendenachricht(na, ve[0])
def neunachricht(te, nu, ws):
	global verb
	if erlaubnis(20 + len(te)):
		na = plusnachricht(te, nu, zeitstempel())
		with open("nachr.dat", "ab") as fil:
			schreibebytes(na[1], fil)
			schreibezahl(na[2][0], fil)
			schreibebytes(na[3], fil)
		for ve in verb:
			loop.create_task(sendenachricht_lock(na, ve))
		return na
	
def zeitstempel():
	return bytes(datetime.datetime.now().strftime("%y%m%d%H%M%S"), 'utf-8')

def erlaubnis(menge):
	global kapa
	if menge > kapa:
		return False
	kapa -= menge
	return True

async def uhr():
	global grenz
	global kapa
	while True:
		await asyncio.sleep(1)
		kapa += 50
		if kapa > grenz:
			kapa = grenz
				
async def aktivsyncstart(v):
	ws = v[0]
	await v[2].acquire()
	await ws.send("?")
	v[3] = loop.create_future()
	rfut = await v[3]
	def aktivsyncende():
		v[2].release()
		rfut.set_result(None)
	return aktivsyncende
					
class AktivSync:
	def __init__(self, v):
		self.v = v
	async def __aenter__(self):
		self.stop = await aktivsyncstart(self.v)
		return self
	async def __aexit__(self, exc_type, exc, tb):
		self.stop()

async def annahme(ws, path):
	global nutz
	global nachr
	global verb
	global nutzdict
	passivnachrichtwartet = False
	v = [ws, path, asyncio.Lock(), None]
	nu = None
	try:
		verb.append(v)
		await ws.send(str(len(nachr)))
		while True:
			sy = await ws.recv()
			if v[3]:
				if sy == "?":
					passivnachrichtwartet = True
					sy = await ws.recv()
				if sy == "!":
					f = v[3]
					v[3] = None
					f2 = loop.create_future()
					f.set_result(f2)
					await f2
				else:
					raise "Fehler im Protokoll"
				if passivnachrichtwartet:
					sy = "?"
			else:
				passivnachrichtwartet = True
			if passivnachrichtwartet:
				passivnachrichtwartet = False
				if sy != "?":
					raise "Fehler im Protokoll"
				await ws.send("!")

				m = await ws.recv()
				if m == "a":
	
					na = bytes(await ws.recv(), 'utf-8')
					pw = bytes(await ws.recv(), 'utf-8')
					if len(na) > 100:
						await ws.send("Der Nutzername ist zu lang")
					else:
						weiter = True
						for by in na:
							if by < 0x21 or by > 0x7e:
								weiter = False
								break
						if(not weiter):
							await ws.send("Bitte keine Leerzeichen und Sonderzeichen im Nutzernamen")
						elif na in nutzdict:
							nu = nutz[nutzdict[na]]
							if nu[2] == pw:
								await ws.send("ok")
							else:
								nu = None
								await ws.send("Der Nutzername existiert bereits aber das Passwort ist falsch")
						else:
							nu = neunutzer(na, pw)
							if nu:
								await ws.send("neu")
							else:
								await ws.send(ueberlastet)

				elif m == "n":
					if not nu:
						raise Exception("Nicht angemeldet")
					by = bytes(await ws.recv(), 'utf-8')
					ne = neunachricht(by, nu, ws)
					if ne:
						await ws.send("ok")
					else:
						await ws.send(ueberlastet)
					
				
				elif m == "#":
					await sendenachricht(nachr[int(await ws.recv())], v[0])
	except Exception as e:
		print(e)
		try:
			verb.remove(v)
		except Exception as e:
			print(e)

chatvorbereiten()
		
serv = websockets.serve(annahme, "localhost", 9249)

loop.create_task(uhr())
loop.run_until_complete(serv)
loop.run_forever()
	



