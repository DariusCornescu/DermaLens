from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import get_settings, ensure_directories
from app.api.routes import health, analyze

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Ensure directories exist
ensure_directories()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="""
    DermaLens API - AI-Powered Skin Lesion Analysis with Explainable Results
    
    This API provides skin lesion classification using deep learning models
    with Grad-CAM explainability visualization.
    
    **Important:** This is a research tool and should not be used for clinical diagnosis.
    Always consult a qualified dermatologist for medical advice.
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])


@app.on_event("startup")
async def startup_event():
    """Initialize model on startup."""
    logger.info("Starting DermaLens API...")

    # Pre-load the model — fail fast if weights are missing
    from app.core.model import get_model
    try:
        model = get_model()
        logger.info(f"Model loaded: {model.is_loaded()}")
    except FileNotFoundError as e:
        logger.error(f"FATAL: {e}")
        raise SystemExit(1)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise SystemExit(1)

    logger.info("DermaLens API started successfully")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "description": "AI-Powered Skin Lesion Analysis with Explainable Results",
        "docs": "/docs",
        "health": "/api/health"
    }
