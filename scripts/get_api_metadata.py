import requests
import os
import json

folder = r"C:\Users\User\Documents\tfd-calculator\scripts\data"
language_code = "en"
filenames = [
    "descendant",
    "weapon",
    "module",
    "reactor",
    "external-component",
    "reward",
    "stat",
    "void-battle",
    "title",
]

if not os.path.isdir(folder):
    os.mkdir(folder)
    print(f'Created "{folder}" folder')

for filename in filenames:
    try:
        url = f"https://open.api.nexon.com/static/tfd/meta/{language_code}/{filename}.json"  # Corrected URL

        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            # Print the fetched data (JSON format)
            data = response.json()  # Parse the JSON response
            with open(f"{folder}/{filename}.json", "w", encoding="utf-8") as file:
                json.dump(data, file, ensure_ascii=False, indent=4)
            print(f"{filename}.json has been successfully retrieved and extracted into \"{folder}\\{filename}.json\"")
        else:
            print(
                f"Failed to retrieve {filename}.json data. Status code: {response.status_code}. Response: {response.text}"
            )

    except Exception as e:
        print(f"An error occurred while processing {filename}: {e}")
