# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

# def get_request(endpoint, **kwargs):
# Add code for get requests to back end

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"
            print(f"Key {key} Value {value}")

    requests_url = backend_url + endpoint + "?" + params

    print("GET from {} ".format(requests_url))
    try:
        response = requests.get(requests_url)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in restapis 1: \n {err=}, {type(err)=}")
        return {"message": "Network exception occurred"}


# def analyze_review_sentiments(text):
# request_url = sentiment_analyzer_url+"analyze/"+text
# Add code for retrieving sentiments
def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "/analyze/" + text
    print("GET to {} ".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in restapis 2: \n {err=}, {type(err)=}")
        return {"message": "Network exception occurred"}

# def post_review(data_dict):
# Add code for posting review
def post_review(data_dict):
    endpoint = "/insert_review"
    requests_url = backend_url + endpoint
    print("POST to {} ".format(requests_url))
    try:
        response = requests.post(requests_url, json=data_dict)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in respais 3: \n {err=}, {type(err)=}")
        return {"message": "Network exception occurred"}
    
def delete_review(review_id):
    endpoint = f"/deleteReview/{review_id}"
    requests_url = backend_url + endpoint
    print("DELETE to {} ".format(requests_url))
    try:
        response = requests.delete(requests_url)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in respais 4: \n {err=}, {type(err)=}")
        return {"message": "Network exception occurred"}
