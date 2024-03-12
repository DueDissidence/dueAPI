from fastapi import FastAPI
import httpx
import os

# Parameters for GET request
url = "https://rumble.com/-livestream-api/get-data"
headers = {'Accept': "application/json", "User-Agent": "Mozilla/5.0"}
params = {"key": os.environ['RUMBLE_KEY']}

app = FastAPI()


@app.get("/rants")
async def rants() -> dict:
    data = None
    # Sending GET request
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
        except httpx.ConnectTimeout:
            pass

    livestream = parse_livestream(data)
    return livestream


def parse_livestream(data=None):
    livestream = {
        'rants': [],
        'watching': 0,
        'likes': 0,
        'title': "No Livestream Found"
    }

    if data is not None:
        data = data.get('livestreams')
        if data:
            data = data[0]
            data['chat']['recent_rants'].reverse()
            livestream['rants'] = data['chat']['recent_rants']
            livestream['likes'] = data['likes']
            livestream['watching'] = data['watching_now']
            livestream['title'] = data['title']

    return livestream
