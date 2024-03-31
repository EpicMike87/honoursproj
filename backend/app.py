from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, DATA
import xml.etree.ElementTree as ET
import os
import pandas as pd
import numpy as np
import json

app = Flask(__name__)
CORS(app)

data_files = UploadSet('data', DATA)
app.config['UPLOADED_DATA_DEST'] = os.path.join(os.getcwd(), 'data')
configure_uploads(app, data_files)

# API Routes

# Get DATA

@app.route('/api/csv-upload', methods=['POST'])
def perform_csv_upload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = data_files.save(file)

        if filename.endswith('.csv'):
            full_path = data_files.path(filename)

            data = pd.read_csv(full_path)
            data.replace({np.nan: "missing"}, inplace=True)
            data.to_csv(full_path, index=False)

            headings = data.columns.tolist()
            json_data = data.to_dict(orient='records')

            return jsonify({'headings': headings, 'data_values': json_data}), 200
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

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
    
@app.route('/api/xml-upload', methods=['POST'])
def perform_xml_upload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = file.filename

        if not filename.endswith('.xml'):
            return jsonify({'error': 'Unsupported file type'}), 400

        file_path = os.path.join(app.config['UPLOADED_DATA_DEST'], filename)
        file.save(file_path)

        headings = get_xml_headings(filename)

        return jsonify(headings=headings), 200

    except Exception as e:
        print("Exception:", e)
        return jsonify({'error': 'Internal Server Error'}), 500


# Get Values

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
    
def get_csv_column_headings(filename):
    try:
        full_path = data_files.path(filename)
        data = pd.read_csv(full_path)
        column_headings = data.columns.tolist()
        return column_headings
    except Exception as e:
        raise ValueError(f'Error reading CSV file: {e}') from e

def get_json_column_headings(filename):
    try:
        full_path = data_files.path(filename)
        with open(full_path, 'r') as json_file:
            json_data = json.load(json_file)
            if isinstance(json_data, list):
                column_headings = list(json_data[0].keys()) if json_data else []
                return column_headings
            elif isinstance(json_data, dict):
                column_headings = list(json_data.keys())
                return column_headings
            else:
                raise ValueError('Invalid JSON file structure')

    except Exception as e:
        raise ValueError(f'Error reading JSON file: {e}') from e

if __name__ == '__main__':
    app.run(debug=True)  

def get_xml_headings(filename):
    try:
        tree = ET.parse(os.path.join(app.config['UPLOADED_DATA_DEST'], filename))
        root = tree.getroot()

        def traverse(element, headings):
            headings.add(element.tag)
            for child in element:
                traverse(child, headings)

        headings = set()
        traverse(root, headings)
        return list(headings)

    except FileNotFoundError as file_not_found_error:
        raise ValueError(f'XML file not found: {filename}') from file_not_found_error

    except ET.ParseError as parse_error:
        raise ValueError(f'Error parsing XML file {filename}: {parse_error}') from parse_error

    except Exception as e:
        raise ValueError(f'Unexpected error while processing XML file {filename}: {e}') from e      

@app.route('/api/get-csv-data-values', methods=['GET'])
def get_csv_data_values():
    try:
        selected_file = request.args.get('file')
        if not selected_file:
            return jsonify({'error': 'No file specified'}), 400

        file_path = os.path.join(app.config['UPLOADED_DATA_DEST'], selected_file)
        data = pd.read_csv(file_path)
        column_headings = data.columns.tolist()
        data_values = data.to_dict(orient='records')
        return jsonify({'headings': column_headings, 'data_values': data_values}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-json-data-values', methods=['GET'])
def get_json_data_values():
    try:
        selected_file = request.args.get('file')
        if not selected_file:
            return jsonify({'error': 'No file specified'}), 400

        file_path = os.path.join(app.config['UPLOADED_DATA_DEST'], selected_file)
        with open(file_path, 'r') as json_file:
            json_data = json.load(json_file)
            if isinstance(json_data, list):
                column_headings = list(json_data[0].keys()) if json_data else []
                return jsonify({'headings': column_headings, 'data_values': json_data}), 200
            elif isinstance(json_data, dict):
                column_headings = list(json_data.keys())
                return jsonify({'headings': column_headings, 'data_values': [json_data]}), 200
            else:
                raise ValueError('Invalid JSON file structure')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-xml-data-values', methods=['GET'])
def get_xml_data_values():
    try:
        selected_file = request.args.get('file')
        if not selected_file:
            return jsonify({'error': 'No file specified'}), 400

        file_path = os.path.join(app.config['UPLOADED_DATA_DEST'], selected_file)
        
        tree = ET.parse(file_path)
        root = tree.getroot()
        headings = set()
        data_values = []

        for child in root:
            row = {}
            for element in child:
                row[element.tag] = element.text
                headings.add(element.tag)
            data_values.append(row)

        return jsonify({'headings': list(headings), 'data_values': data_values}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-histogram', methods=['POST'])
def generate_histogram():
    try:
        selected_file = request.form['file']
        selected_column = request.form['column']
    
        data = pd.read_csv(f"data/{selected_file}")

        if selected_column not in data.columns:
            return jsonify({'error': f'Column {selected_column} not found in the dataset'}), 400

        histogram_data = data[selected_column].value_counts().sort_index().tolist()

        return jsonify({'histogram_data': histogram_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
