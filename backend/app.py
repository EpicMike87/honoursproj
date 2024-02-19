from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, DATA

import os
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

data_files = UploadSet('data', DATA)
app.config['UPLOADED_DATA_DEST'] = os.path.join(os.getcwd(), 'data')
configure_uploads(app, data_files)

# API Routes

@app.route('/api/csv-upload', methods=['POST'])
def perform_csv_upload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = data_files.save(file)

        if filename.endswith('.csv'):
            headings = get_csv_column_headings(filename)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify(headings=headings), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/json-upload', methods=['POST'])
def perform_json_upload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = data_files.save(file)

        if filename.endswith('.json'):
            headings = get_json_column_headings(filename)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify(headings=headings), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-uploaded-filenames', methods=['GET'])
def get_uploaded_filenames():
    try:
        filenames = [f for f in os.listdir(app.config['UPLOADED_DATA_DEST']) if os.path.isfile(os.path.join(app.config['UPLOADED_DATA_DEST'], f))]
        return jsonify({'filenames': filenames}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get-headings', methods=['GET'])
def get_headings():
    try:
        selected_file = request.args.get('file')

        if not selected_file:
            return jsonify({'error': 'No file specified'}), 400

        if not os.path.exists(os.path.join(app.config['UPLOADED_DATA_DEST'], selected_file)):
            return jsonify({'error': 'File not found'}), 404

        if selected_file.endswith('.csv'):
            headings = get_csv_column_headings(selected_file)
        elif selected_file.endswith('.json'):
            headings = get_json_column_headings(selected_file)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify({'headings': headings}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/generate-histogram', methods=['POST'])
def generate_histogram():
    try:
        selected_file = request.json.get('selected_file')
        selected_column = request.json.get('selected_column')

        if not selected_file or not selected_column:
            return jsonify({'error': 'No selected file or column provided'}), 400

        histogram_data = calculate_histogram(selected_file, selected_column)

        return jsonify({'histogram_data': histogram_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500    
    
# Functions

def get_csv_column_headings(filename):
    data = pd.read_csv(os.path.join(app.config['UPLOADED_DATA_DEST'], filename))
    headings = list(data.columns)
    return headings

def get_json_column_headings(filename):
    try:
        with open(os.path.join(app.config['UPLOADED_DATA_DEST'], filename), 'r') as json_file:
            json_data = json.load(json_file)

            if isinstance(json_data, list) and len(json_data) > 0:
                headings = list(json_data[0].keys())
                return headings
            elif isinstance(json_data, dict):
                headings = list(json_data.keys())
                return headings
            else:
                raise ValueError('Invalid JSON file structure')
    except Exception as e:
        raise ValueError('Invalid JSON file') from e
    
def calculate_histogram(selected_file, column_name):
    try:
        file_path = os.path.join(app.config['UPLOADED_DATA_DEST'], selected_file)
        data = pd.read_csv(file_path)
        histogram_data = data[column_name].value_counts().tolist()

        return histogram_data

    except Exception as e:
        raise ValueError('Error calculating histogram') from e  

if __name__ == '__main__':
    app.run(debug=True)
