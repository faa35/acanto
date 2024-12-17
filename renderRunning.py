import requests
import time
from datetime import datetime
import pytz

# Replace with your desired URL
url = 'https://acanto7.onrender.com/'

# Function to get local time
def get_local_time():
    # Automatically detect the local timezone
    local_timezone = time.tzname[time.daylight]
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return current_time

# Function to keep website active
def keep_website_active():
    try:
        count = 1  # Start counting from 1
        while True:
            response = requests.get(url)
            current_time = get_local_time()  # Get the local time dynamically

            if response.status_code == 200:
                print(f"{count}. [{current_time}] Website is up and running! Status code: {response.status_code}")
            else:
                print(f"{count}. [{current_time}] Failed to connect. Status code: {response.status_code}")
            
            # Increment the count and wait for 40 seconds before sending another request
            count += 1
            time.sleep(40)  # 40 seconds
    except KeyboardInterrupt:
        print("Process stopped by the user.")

if __name__ == "__main__":
    keep_website_active()
