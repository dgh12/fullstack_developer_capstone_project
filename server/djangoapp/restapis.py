"""rest api calls"""
import os
import requests
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
    """Generalized GET request function"""
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"
            print(f"Key {key} Value {value}")
        requests_url = backend_url + endpoint + "?" + params
    requests_url = backend_url + endpoint
    print(f"GET from {requests_url}")
    try:
        response = requests.get(requests_url, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in restapis 1: \
              \n {err=}, {type(err)=}")
        return {"message": f"Network exception occurred in restapis 1: \
              \n {err=}, {type(err)=}/n",
                "URL": f"{requests_url}"}


# def analyze_review_sentiments(text):
# request_url = sentiment_analyzer_url+"analyze/"+text
# Add code for retrieving sentiments
def analyze_review_sentiments(text):
    """Analyze the sentiment of a given text using an
       external sentiment analysis service."""
    request_url = sentiment_analyzer_url + "/analyze/" + text
    print(f"GET to {request_url}")
    try:
        response = requests.get(request_url, timeout=5)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in restapis 2: \
               \n {err=}, {type(err)=}")
        return {"message": f"Network exception occurred in restapis 2: \
               \n {err=}, {type(err)=}"}


# def post_review(data_dict):
# Add code for posting review
def post_review(data_dict):
    """Post a review to the backend service."""
    endpoint = "/insert_review"
    requests_url = backend_url + endpoint
    print(f"POST to {requests_url} ")
    try:
        response = requests.post(requests_url, json=data_dict, timeout=5)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred in respais 3: \
              \n {err=}, {type(err)=}")
        return {f"Network exception occurred in respais 3: \
              \n {err=}, {type(err)=}"}
