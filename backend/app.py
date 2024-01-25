from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, DATA

app = Flask(__name__)

@app.route('/api/data-analysis', methods=['POST'])
def perform_data_analysis():
    try:
        data = request.get_json()
        result = your_data_analysis_function(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def your_data_analysis_function(data):
    result = {'sum': sum(data['numbers'])}
    return result

if __name__ == '__main__':
    app.run(debug=True)