import argparse
import csv
import collections
import json
import string
import os
import requests


def parseArgs():
    parser = argparse.ArgumentParser(description="This program converts a CSV file with columns image, caption, and rating into the proper JSON format to be able to be inserted into the Image Caption Rating game.")

    parser.add_argument('-i', '--inputFile')

    args = parser.parse_args()

    return args


"""
This function converts a CSV file with columns image, caption, and rating into the proper JSON format to be able to be inserted into the Image Caption Rating game.
"""
def formatData(inputFile, outputFile="formattedData.json"):
    print(f"'{os.getcwd()}'")

    with open(inputFile, "r") as f:
        reader = csv.reader(f)

        header = next(reader)
        inputRows = [row for row in reader]


    imageCol = -1
    captionCol = -1
    ratingCol = -1

    for col, heading in enumerate(header):
        headingLower = heading.lower()

        if headingLower.__contains__('image'):
            imageCol = col
        elif headingLower.__contains__('caption'):
            captionCol = col
        elif headingLower.__contains__('rating'):
            ratingCol = col
        elif heading != '':
            print(f"WARNING: Unknown column '{heading}' in input csv file will be ignored.")

    
    if imageCol == -1 or captionCol == -1 or ratingCol == -1:
        print(f"ERROR: Input csv file does not contain columns named 'image' and 'caption'. Aborting...")
    
    print(f"Data validation completed, formatting data...")

    result = {
        'info': {
            "description": "Flicker8K captions with VICR scores/ratings"
        },
        'images': [],
        'annotations': [],
    }

    for col, row in enumerate(inputRows):
        imageUrl = row[imageCol]
        caption = row[captionCol]
        rating = row[ratingCol]
    
        # Get the UID of the image which should be the last part of the URL
        # after the final "/"
        image = imageUrl.split('/')[-1]

        imageArr = image.split('_')

        imageJson = {
            "id": int(imageArr[0]),
            "file_name": image,
            "url": image
        }

        result["images"].append(imageJson)


        captionJson = {
            "id": int(imageArr[0]),
            "caption": caption.replace("\"", ""),
            "vicr_rating": float(rating),
            "rating": str(round(float(rating)))
        }

        result["annotations"].append(captionJson)
    

    resultFile = open(outputFile, 'w')
    resultFile.write(json.dumps(result, indent=4))
    resultFile.close()


def downloadImages(inputFile):
    print(f"'{os.getcwd()}'")

    with open(inputFile, "r") as f:
        reader = csv.reader(f)

        header = next(reader)
        inputRows = [row for row in reader]

    imageCol = -1
    captionCol = -1
    ratingCol = -1

    for col, heading in enumerate(header):
        headingLower = heading.lower()

        if headingLower.__contains__('image'):
            imageCol = col
        elif headingLower.__contains__('caption'):
            captionCol = col
        elif headingLower.__contains__('rating'):
            ratingCol = col
        elif heading != '':
            print(f"WARNING: Unknown column '{heading}' in input csv file will be ignored.")

    
    if imageCol == -1 or captionCol == -1 or ratingCol == -1:
        print(f"ERROR: Input csv file does not contain columns named 'image' and 'caption'. Aborting...")
    
    print(f"Data validation completed, downloading images...")

    for col, row in enumerate(inputRows):
        imageUrl = row[imageCol]
        caption = row[captionCol]
        rating = row[ratingCol]

        image = imageUrl.split('/')[-1]

        if os.path.exists(image):
            print(f"Already downloaded {image} before.")
            continue

        print(f"Downloading {image}")

        imgData = requests.get(imageUrl).content  

        with open(f'{image}', 'wb') as handler:
            handler.write(imgData)
            handler.close()


def main():
    opt = parseArgs()

    formatData(opt.inputFile)


if __name__== "__main__":
    main()