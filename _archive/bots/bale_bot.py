import requests, time
T='659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc'
last_id=0
print('🚀 Tetrasnap Engine: ONLINE')
while True:
 try:
  r=requests.get(f'https://api.bale.ai/bot{T}/getUpdates?offset={last_id+1}', timeout=10).json()
  for u in r.get('result', []):
   last_id=u['update_id']
   m=u.get('message', {})
   chat_id=m.get('chat', {}).get('id')
   if not chat_id: continue
   text=m.get('text', '').strip().replace('۱', '1')
   print(f'📩 Recv: {text}')
   res='🚀 [3D-Print]: Ramin, 11-book model ready! 🦾⚡️' if text=='11' else f'✅ Received: {text}'
   requests.post(f'https://api.bale.ai/bot{T}/sendMessage', json={'chat_id': chat_id, 'text': res})
  time.sleep(1)
 except Exception as e:
  time.sleep(5)
