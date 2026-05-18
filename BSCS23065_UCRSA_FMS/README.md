

# Urban Crash Analytics: A Spatial Analysis of Road Collision Risk in New York City

**Student:** Saif Ullah (BSCS23065)  
**Course:** CS592 — Spatial Data Science, Spring 2026  
**Instructor:** Dr. Adnan Siddique  
**Institution:** Information Technology University, Lahore  

---

## Project Overview

This project predicts road collision risk for NYC road segments using spatial 
analysis and machine learning. We analyze 500,000 crash records (2021–2026), 
apply spatial techniques (Moran's I, LISA, KDE, spatial regression), and train 
an XGBoost classifier achieving F1 0.848 and AUC 0.971.

---

## How to Run

### 1. Install dependencies
```bash
pip install pandas numpy geopandas shapely osmnx networkx
pip install scikit-learn xgboost imbalanced-learn
pip install folium matplotlib seaborn
pip install esda libpysal scipy
```

### 2. Run the final notebook
Open and run all cells in order:
```
notebooks/BSCS23065_UCRSA_FMS.ipynb
```

All paths are set relative to the notebook location.
No manual path changes needed.

### 3. Data
Raw data is downloaded automatically via API in the notebook.
Processed data is included in `data/processed/`.

---

## Project Structure

```
urban-crash-analytics/
├── notebooks/
│   └── BSCS23065_UCRSA_FMS.ipynb   ← final submission notebook
├── data/
│   ├── raw/                          ← downloaded via API
│   ├── processed/                    ← cleaned datasets
│   │   ├── crashes_cleaned.csv
│   │   ├── segment_risk.csv
│   │   └── features.csv
│   └── external/                     ← road network, borough boundaries
├── outputs/
│   ├── figures/                      ← all charts and maps
│   └── maps/                         ← interactive Folium maps
└── README.md
```

---

## Libraries Used

| Library | Purpose | Covered in Class |
|---------|---------|-----------------|
| GeoPandas | Spatial data handling, spatial join | Yes |
| libpysal | Spatial weights matrix | Yes |
| esda | Moran's I, LISA | Yes |
| Folium | Interactive maps | Yes |
| Shapely | Geometric operations | Yes |
| Scikit-Learn | ML models | No |
| XGBoost | Gradient boosting classifier | No |
| imbalanced-learn | SMOTE oversampling | No |
| OSMnx | Road network download | No |
| NetworkX | Graph-based routing | No |
| SciPy | KDE point pattern analysis | No |

---

## Key Results

| Technique | Result |
|-----------|--------|
| Moran's I | 0.1643 (p=0.001) — significant spatial clustering |
| LISA Hotspots | 33 High-High segments identified |
| XGBoost F1 | 0.848 |
| XGBoost AUC | 0.971 |
| Overall Accuracy | 89% |
| Borough F1 range | 0.830 – 0.852 (consistent across all boroughs) |

---

## Data Sources

- NYC Motor Vehicle Collisions — https://data.cityofnewyork.us/resource/h9gi-nx95.csv
- NYC Street Centerline — https://data.cityofnewyork.us/resource/inkn-q76z.geojson
- NYC Borough Boundaries — https://github.com/dwillis/nyc-maps


