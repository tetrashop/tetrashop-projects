import requests, time
T='659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc'
L=0
print('🌟 [SYSTEM]: Workspace Cleaned. Tetrasnap Engine ONLINE')
while True:
 try:
  r=requests.get(f'https://api.bale.ai/bot{T}/getUpdates?offset={L+1}',timeout=15).json()
  for u in r.get('result', []):
   L=u['update_id']
   m=u.get('message', {})
   c=m.get('chat', {}).get('id')
   if not c: continue
   t=m.get('text', '').strip().replace('۱', '1')
   print(f'📩 Recv: {t}')
   res='🚀 [3D-Print]: Ramin, 11-book model ready! 🦾⚡️' if t=='11' else f'✅ Received: {t}'
   requests.post(f'https://api.bale.ai/bot{T}/sendMessage',json={'chat_id':c,'text':res})
  time.sleep(1)
 except: time.sleep(5)