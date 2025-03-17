from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    animal_name = request.form.get('animal_name')
    sanctuary_name = request.form.get('sanctuary_name')
    
    if not animal_name or not sanctuary_name:
        return jsonify({"error": "Animal name and sanctuary name are required"}), 400
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(filepath)
        
        # Save metadata to Firestore
        doc_ref = db.collection('photos').document()
        doc_ref.set({
            'filename': filename,
            'animal_name': animal_name,
            'sanctuary_name': sanctuary_name,
            'upload_date': datetime.now()
        })
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "animal_name": animal_name,
            "sanctuary_name": sanctuary_name
        }), 201
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/photos/<filename>', methods=['GET'])
def get_photo(filename):
    try:
        return send_file(
            os.path.join(app.config['UPLOAD_FOLDER'], filename),
            mimetype='image/jpeg'
        )
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@app.route('/photos', methods=['GET'])
def list_photos():
    search_term = request.args.get('search', '').lower()
    
    photos_ref = db.collection('photos')
    
    if search_term:
        # Search in both animal_name and sanctuary_name using composite query
        docs = photos_ref.where('animal_name', '>=', search_term)\
                        .where('animal_name', '<=', search_term + '\uf8ff')\
                        .get()
        
        # Also search in sanctuary_name
        sanctuary_docs = photos_ref.where('sanctuary_name', '>=', search_term)\
                                 .where('sanctuary_name', '<=', search_term + '\uf8ff')\
                                 .get()
        
        # Combine and deduplicate results
        all_docs = list(docs) + list(sanctuary_docs)
        unique_docs = {doc.id: doc for doc in all_docs}.values()
        docs = unique_docs
    else:
        docs = photos_ref.get()
    
    photos = []
    for doc in docs:
        data = doc.to_dict()
        photos.append({
            "filename": data.get('filename'),
            "animal_name": data.get('animal_name'),
            "sanctuary_name": data.get('sanctuary_name'),
            "upload_date": data.get('upload_date').isoformat() if data.get('upload_date') else None,
            "url": f"/photos/{data.get('filename')}"
        })
    
    return jsonify(photos)

@app.route('/search', methods=['GET'])
def search_photos():
    animal = request.args.get('animal', '').lower()
    sanctuary = request.args.get('sanctuary', '').lower()
    
    photos_ref = db.collection('photos')
    query = photos_ref
    
    if animal:
        query = query.where('animal_name', '>=', animal)\
                    .where('animal_name', '<=', animal + '\uf8ff')
    
    if sanctuary:
        # If we already have an animal filter, we need a new query for sanctuary
        if animal:
            sanctuary_query = photos_ref.where('sanctuary_name', '>=', sanctuary)\
                                      .where('sanctuary_name', '<=', sanctuary + '\uf8ff')
            sanctuary_docs = sanctuary_query.get()
            animal_docs = query.get()
            
            # Combine and filter results that match both conditions
            animal_dict = {doc.id: doc.to_dict() for doc in animal_docs}
            sanctuary_dict = {doc.id: doc.to_dict() for doc in sanctuary_docs}
            
            # Find common documents
            common_ids = set(animal_dict.keys()) & set(sanctuary_dict.keys())
            docs = [{'id': doc_id, 'data': animal_dict[doc_id]} for doc_id in common_ids]
        else:
            query = query.where('sanctuary_name', '>=', sanctuary)\
                        .where('sanctuary_name', '<=', sanctuary + '\uf8ff')
            docs = [{'id': doc.id, 'data': doc.to_dict()} for doc in query.get()]
    else:
        docs = [{'id': doc.id, 'data': doc.to_dict()} for doc in query.get()]
    
    photos = []
    for doc in docs:
        data = doc['data']
        photos.append({
            "filename": data.get('filename'),
            "animal_name": data.get('animal_name'),
            "sanctuary_name": data.get('sanctuary_name'),
            "upload_date": data.get('upload_date').isoformat() if data.get('upload_date') else None,
            "url": f"/photos/{data.get('filename')}"
        })
    
    return jsonify(photos)

if __name__ == '__main__':
    app.run(debug=True, port=5000)