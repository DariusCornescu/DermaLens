# DermaLens

AI-Powered Skin Lesion Analysis with Explainable Results

## Overview

DermaLens is a web platform for skin cancer detection using deep learning models with explainability (XAI). The platform allows clinicians and researchers to upload dermoscopic images and receive:

- **Classification**: Predicted class (benign vs malignant or multi-class)
- **Confidence Score**: Model certainty with calibration information
- **Explainability Visualization**: Grad-CAM heatmaps showing model attention
- **Medical Disclaimer**: Clear indication that this is a research tool

> ⚠️ **Research Tool Only** - This platform is for educational and research purposes. Always consult a qualified dermatologist for medical advice.

## Features

### MVP Features
- Drag-and-drop image upload with validation
- Real-time skin lesion classification
- Grad-CAM heatmap visualization with opacity control
- Confidence calibration display
- Uncertainty warnings for low-confidence predictions
- Medical disclaimers throughout

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query

**Backend:**
- FastAPI
- Python 3.11+
- PyTorch
- pytorch-grad-cam

## Project Structure

```
dermalens/
├── frontend/           # Next.js application
├── backend/            # FastAPI application
├── notebooks/          # Jupyter notebooks for training
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (optional)

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker Setup

```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload image and get analysis |
| GET | `/api/results/{id}` | Fetch cached result |
| GET | `/api/health` | Health check |

## Model Information

The platform uses a pre-trained EfficientNet-B0 model fine-tuned on the HAM10000 dataset for skin lesion classification.

### Classes
- Melanoma (MEL)
- Melanocytic Nevus (NV)
- Basal Cell Carcinoma (BCC)
- Actinic Keratosis (AKIEC)
- Benign Keratosis (BKL)
- Dermatofibroma (DF)
- Vascular Lesion (VASC)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Disclaimer

This software is provided for research and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.
