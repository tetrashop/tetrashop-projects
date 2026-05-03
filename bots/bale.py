import requests, time
import urllib3
urllib3.disable_warnings()
T, L = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc", 0
# استفاده از HTTP ساده برای دور زدن فیلترهای لایه SSL
URL = f"http://185.239.106.3/bot{T}"
print("--- BYPASS MODE ACTIVE ---")
while True:
	try:
		headers = {"Host": "api.bale.ai"}
		r = requests.get(f"{URL}/getUpdates", params={"offset": L+1, "timeout": 10}, headers=headers, timeout=15)
		if r.status_code == 200:
			data = r.json()
			if data.get("ok"):
				for u in data.get("result", []):
					L = u["update_id"]
					if "message" in u:
						c_id = u["message"]["chat"]["id"]
						txt = str(u["message"].get("text", "")).strip()
						print(f"BINGO! Msg: {txt}")
						ans = "Rocket Ramin 11-book ready" if txt == "11" else f"OK: {txt}"
						requests.post(f"{URL}/sendMessage", json={"chat_id": c_id, "text": ans}, headers=headers, timeout=15)
		else:
			print(f"Status {r.status_code}... Waiting for Gate.")
	except Exception as e:
		print(f"Retrying... {str(e)[:40]}")
	time.sleep(3)
