from fastapi import FastAPI
import httpx
import datetime

# Parameters for GET request
url = "https://rumble.com/-livestream-api/get-data"
headers = {'Accept': "application/json", "User-Agent": "Mozilla/5.0"}
params = {"key": "zOK4ZBwdcCp8C0GBl-9bN-4Im9fqIckMGn-01KQyXT3-W8YRiu5zkbQmiaApTnsZAbdaSU3-WL8RRgi8J0bdsw"}

app = FastAPI(docs_url=None)

@app.get("/e117d001ff1e4e27ba7bb306689c81eb84d564dd547c40922fe3c9603ad3efd4")
async def rumble():
    # Sending GET request
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            response = await client.get(url, params=params)
        except httpx.ConnectTimeout:
            return None

    data = None
    if response.status_code == 200:
        data = response.json()

        # This will return None outside a live stream
        livestream = data.get('livestreams')
        if livestream:
            # Add donation amount to name
            rants = livestream[0]['chat']['recent_rants']
            for i, r in enumerate(rants):
                r['username'] += f"  (${r['amount_dollars']})"

            # Add rants to messages and sort by time in reverse order
            livestream[0]['chat']['recent_messages'] += rants
            livestream[0]['chat']['recent_messages'].sort(
                key=lambda x: datetime.datetime.strptime(x['created_on'], "%Y-%m-%dT%H:%M:%S+00:00"),
                reverse=True)

    return data
