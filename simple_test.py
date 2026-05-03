import requests
TOKEN = "659328109:wgtP8s2g-VZ_xPzCmBuLdCQNVWdgZIFN6TA"
url = f"https://tapi.bale.ai/bot{TOKEN}/getMe"
r = requests.get(url)
print(r.json())
