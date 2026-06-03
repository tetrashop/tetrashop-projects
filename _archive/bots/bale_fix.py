import requests, time
T = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
L = 0
print("🚀 [System]: Tetrasnap Engine is ONLINE!")
while True:
try:
r = requests.get(f"https://api.bale.ai/bot{T}/getUpdates?offset={L+1}", timeout=10).json()
for u in r.get("result", []):
L = u["update_id"]
m = u.get("message", {})
c = m.get("chat", {}).get("id")
if not c: continue
txt = m.get("text", "").strip().replace("۱", "1")
print(f"📩 Received: {txt}")
if txt == "11":
res = "🚀 [3D-Print]: Ramin, 11-book model ready! 🦾⚡️"
else:
res = f"✅ Received: {txt}"
requests.post(f"https://api.bale.ai/bot{T}/sendMessage", json={"chat_id": c, "text": res})
time.sleep(1)
except Exception as e:
time.sleep(2)
