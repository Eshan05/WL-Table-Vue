import json
import os

def extract_and_format_tags(input_filepath="data.json",
                            output_categories_filepath="categories_options.json",
                            output_topics_filepath="topics_options.json",
                            sort_alphabetically=True):
    """
    Extracts unique categories and topics from a video metadata JSON file
    and saves them in the specified format [{value: tag, label: tag}, ...].

    Args:
        input_filepath (str): Path to the input JSON file containing video metadata.
        output_categories_filepath (str): Path to save the formatted categories JSON.
        output_topics_filepath (str): Path to save the formatted topics JSON.
        sort_alphabetically (bool): Whether to sort the tags alphabetically in the output.
    """
    try:
        with open(input_filepath, 'r', encoding='utf-8') as f:
            video_list_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file not found at '{input_filepath}'")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{input_filepath}'. Is it valid?")
        return
    except Exception as e:
        print(f"An unexpected error occurred while reading the input file: {e}")
        return

    if not isinstance(video_list_data, list):
        print(f"Error: Expected a JSON list [] in '{input_filepath}', but found a different type ({type(video_list_data)}).")
        return

    unique_categories = set()
    unique_topics = set()

    for video in video_list_data:
        # Optional: Check if each item in the list is a dictionary
        if not isinstance(video, dict):
            print(f"Warning: Skipping item in list that is not a dictionary: {video}")
            continue

        # Process categories (using .get() for safety inside the dict)
        categories_list = video.get('categories')
        if isinstance(categories_list, list):
            for category in categories_list:
                # Ensure it's a non-empty string before adding
                if isinstance(category, str) and category.strip():
                    unique_categories.add(category.strip()) # Add trimmed version

        # Process topics (using .get() for safety inside the dict)
        topics_list = video.get('topics')
        if isinstance(topics_list, list):
            for topic in topics_list:
                 # Ensure it's a non-empty string before adding
                if isinstance(topic, str) and topic.strip():
                    unique_topics.add(topic.strip())

    category_list_to_format = list(unique_categories)
    topic_list_to_format = list(unique_topics)

    if sort_alphabetically:
        category_list_to_format.sort()
        topic_list_to_format.sort()

    formatted_categories = [{"value": cat, "label": cat} for cat in category_list_to_format]
    formatted_topics = [{"value": top, "label": top} for top in topic_list_to_format]

    output_dir_cat = os.path.dirname(output_categories_filepath)
    output_dir_top = os.path.dirname(output_topics_filepath)

    # Create output directories if they don't exist
    if output_dir_cat and not os.path.exists(output_dir_cat):
        os.makedirs(output_dir_cat)
        print(f"Created directory: {output_dir_cat}")
    if output_dir_top and not os.path.exists(output_dir_top):
        os.makedirs(output_dir_top)
        print(f"Created directory: {output_dir_top}")


    try:
        # Save categories
        with open(output_categories_filepath, 'w', encoding='utf-8') as f_cat:
            json.dump(formatted_categories, f_cat, indent=2, ensure_ascii=False)
        print(f"Successfully saved {len(formatted_categories)} unique categories to '{output_categories_filepath}'")

        # Save topics
        with open(output_topics_filepath, 'w', encoding='utf-8') as f_top:
            json.dump(formatted_topics, f_top, indent=2, ensure_ascii=False)
        print(f"Successfully saved {len(formatted_topics)} unique topics to '{output_topics_filepath}'")

    except IOError as e:
        print(f"Error writing output file: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while writing output files: {e}")

if __name__ == "__main__":
    # --- Configuration ---
    INPUT_JSON_FILE = '../src/data/videos.json' 
    OUTPUT_DIR = '../src/data/' 
    OUTPUT_CATEGORIES_FILE = os.path.join(OUTPUT_DIR, 'categoryOptions.json')
    OUTPUT_TOPICS_FILE = os.path.join(OUTPUT_DIR, 'topicOptions.json')
    SORT_OUTPUT = True # Set to False if you don't want alphabetical sorting

    extract_and_format_tags(
        input_filepath=INPUT_JSON_FILE,
        output_categories_filepath=OUTPUT_CATEGORIES_FILE,
        output_topics_filepath=OUTPUT_TOPICS_FILE,
        sort_alphabetically=SORT_OUTPUT
    )