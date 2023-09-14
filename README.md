# FlashGenius

## Overview

FlashGenius is a revolutionary flashcard generator built to make the process of learning and revising more efficient. By leveraging Natural Language Processing (NLP), FlashGenius takes in a block of text and generates key terms and their meanings in the form of flashcards. Users can review, categorize, and rate these flashcards based on their confidence level, making for a personalized learning experience.

## Prerequisites

- Node.js and npm for frontend development
- Python 3.x for backend development
- Pipenv for Python package management
- Django for backend framework
- Django REST Framework for building APIs
- Django CORS Headers for handling CORS
- React for frontend development

## Getting Started

### Setting up the Backend

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ellahinator/FlashGenius.git
   ```

2. **Navigate to the backend directory**

   ```bash
   cd FlashGenius/backend
   ```

3. **Install Pipenv if you haven't**

   ```bash
   pip install pipenv
   ```

4. **Install dependencies**

   ```bash
   pipenv install
   ```

5. **Install Django, Django REST Framework and Django CORS Headers**

   ```bash
   pipenv install django djangorestframework django-cors-headers
   ```

6. **Run the backend server**

   ```bash
   python manage.py runserver
   ```

### Setting up the Frontend

1. **Navigate to the frontend directory**

   ```bash
   cd FlashGenius/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the frontend server**

   ```bash
   npm start
   ```

## Features

- Automated Flashcard Generation using NLP
- User Authentication and Profiles
- Flashcard Review System based on Confidence Levels
- Categorized Flashcard Sets
- And much more...
