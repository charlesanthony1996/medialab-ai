import os
from googleapiclient.discovery import build
import googleapiclient.errors

youtube_api_key = "AIzaSyBpcyTyN0zpVQ5urZv9m6f9eZDVlNIgc2g"
def main():

    api_service_name = "youtube"
    api_version = "v3"
    YOUR_API_KEY = youtube_api_key

    # Use developerKey parameter for API key
    youtube = build(
        api_service_name, api_version, developerKey=YOUR_API_KEY)

    request = youtube.channels().list(
        part="snippet,contentDetails,statistics",
        id="UC_x5XG1OV2P6uZZ5FSM9Ttw"
    )
    response = request.execute()

    print(response)

if __name__ == "__main__":
    main()
