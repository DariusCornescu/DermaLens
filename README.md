# DermaLens

**Skin lesion classification with visual explanations.** Upload a dermoscopic image and get a prediction across 7 lesion classes, a confidence level, and a Grad-CAM heatmap that shows which part of the image drove the result.

> **Research and education only.** DermaLens is not a medical device and must not be used for diagnosis. See a qualified dermatologist for any skin concern.

## What it does

- **Classifies** a lesion into one of 7 classes (melanoma, melanocytic nevus, basal cell carcinoma, actinic keratosis, benign keratosis, dermatofibroma, vascular lesion).
- **Explains** each prediction with a Grad-CAM heatmap overlaid on the image, with an opacity slider.
- **Flags uncertainty**: low-confidence predictions are marked as uncertain and show a warning, using confidence thresholds and prediction entropy.
- **Answers questions** about the result through a small chat widget (OpenAI `gpt-4o-mini`, optional).

## How it's built

```
Next.js frontend  ──►  FastAPI backend  ──►  Keras model  ──►  Grad-CAM
 (upload, results,      (validation,          (EfficientNetV2-B0)   (heatmap
  heatmap viewer)        preprocessing,                              as base64)
                         inference)
```

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend | FastAPI, Pydantic, TensorFlow / Keras, OpenCV |
| Explainability | Grad-CAM implemented on the last convolutional layer, including backbones nested inside the model |
| Packaging | Docker Compose |

## The model study

The `notebooks/` folder holds the experiments behind the model. They compare four pretrained backbones (**EfficientNetV2-B0, InceptionResNetV2, MobileNetV3-Large, ResNet152V2**) on dermoscopic images merged from **HAM10000, BCN20000 and MSK** (ISIC 2019). For each backbone the notebooks cover:

- **Data-size tiers**: five training-set sizes, from about 8k to 20k images, to see how much data each architecture needs.
- **Training strategies**: a naive fine-tune, a linear-probe-then-fine-tune (LP-FT) baseline, and **Optuna** hyperparameter search.
- **Loss and evaluation**: focal loss for class imbalance, with a final evaluation and Grad-CAM notebook per model.

The dataset split is made at the lesion level, so images of the same lesion never appear in both training and test sets.

## Run it

Trained weights are not included in the repository. Put a Keras model at `backend/models/final.keras` (or set `MODEL_PATH`), then:

```bash
docker-compose up --build
```

The frontend runs at http://localhost:3000 and the API at http://localhost:8000/docs.

To run each part separately:

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Upload an image, receive prediction, confidence, and heatmap |
| `GET` | `/api/health` | Service and model status |

## License

MIT. See [LICENSE](LICENSE).
