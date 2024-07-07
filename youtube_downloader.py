import os
import json
from pytube import YouTube
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get YouTube API key from environment variable
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def search_youtube(query):
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    request = youtube.search().list(
        q=query,
        part='snippet',
        type='video',
        maxResults=1
    )
    response = request.execute()
    if response['items']:
        return 'https://www.youtube.com/watch?v=' + response['items'][0]['id']['videoId']
    return None

def download_audio(youtube_url, directory):
    video = YouTube(youtube_url)
    audio_stream = video.streams.filter(only_audio=True).first()
    output_file = audio_stream.download(output_path=directory)
    base, ext = os.path.splitext(output_file)
    new_file = base + '.mp3'
    os.rename(output_file, new_file)
    return new_file

def main():
    liked_songs_file = 'C:\\Users\\jashp\\OneDrive\\Desktop\\vacation doin\\PROJECTS\\Serendipity\\serendipity\\backend\\likedSongs.json'
    directory = 'C:\\Users\\jashp\\OneDrive\\Desktop\\vacation doin\\PROJECTS\\Serendipity\\serendipity\\backend\\public\\LocalSongs'

    with open(liked_songs_file, 'r') as file:
        liked_songs = json.load(file)

    for song in liked_songs:
        query = f"{song['song_name']} {song['artist']}"
        print(f"Searching for: {query}")
        youtube_url = search_youtube(query)
        if youtube_url:
            print(f"Downloading from: {youtube_url}")
            mp3_file = download_audio(youtube_url, directory)
            print(f"Downloaded: {mp3_file}")
        else:
            print(f"Could not find YouTube video for: {query}")

if __name__ == '__main__':
    main()
