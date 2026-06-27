#!/bin/bash
python -c "import nltk; nltk.download('stopwords')"
gunicorn search:app --bind 0.0.0.0:$PORT
