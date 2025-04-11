import json

def extract_video_data(filepath="ytwl.json", output_file="extracted_videos.json"):
    """
    Extracts specific video information (title, length, IDs, channel URL, thumbnail)
    from a JSON file containing video data and saves the extracted data to a new
    JSON file.

    Args:
        filepath (str, optional): Path to the JSON file. Defaults to "ytwl.json".
        output_file (str, optional): Path to the output JSON file. Defaults to "extracted_videos.json".
    """
    try:
        with open(filepath, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at path: {filepath}")
        return
    except json.JSONDecodeError:
        print(
            f"Error: Could not decode JSON from file: {filepath}. Please ensure it's valid JSON."
        )
        return
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return

    extracted_videos = []

    if (
        not isinstance(data, dict)
        or "videos" not in data
        or not isinstance(data["videos"], list)
    ):
        print("Warning: 'videos' key not found or not a list in the JSON data.")
        return

    for video in data["videos"]:
        extracted_video = {
            "title": video.get("titleLong"),
            "length": video.get("timeShort"),
            "video_id": video.get("id"),
            "set_video_id": video.get("setVideoId"),
            "channel_url": video.get("channel", {}).get("url"),
            "thumbnail_url": video.get("thumbnails", [{}])[0].get("url"),
        }
        extracted_videos.append(extracted_video)

    try:
        with open(output_file, "w") as f:
            json.dump(extracted_videos, f, indent=2)
        print(f"Extracted data saved to: {output_file}")
    except Exception as e:
        print(f"Error: Could not write to file: {e}")

# Replace with extract_video_data initially and then merge. You can get transformed_videos in various ways.
if __name__ == "__main__":
    with open("extracted_videos.json", "r") as f:
        videos = json.load(f)

    with open("transformed_videos.json", "r") as f:
        extra_info = json.load(f)

    # Create a lookup dictionary from the second file for quick access by title
    extra_lookup = {item["title"]: item for item in extra_info}

    # Merge the data
    for video in videos:
        match = extra_lookup.get(video["title"])
        if match:
            video["categories"] = match.get("categories", [])
            video["topics"] = match.get("topics", [])

    # Save the merged result
    with open("merged_videos.json", "w") as f:
        json.dump(videos, f, indent=2)
