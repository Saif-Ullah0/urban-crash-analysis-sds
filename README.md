# Urban Crash Analytics: A Spatial Analysis of Road Collision Risk in New York City

**Student:** Saif Ullah (BSCS23065)  
**Course:** CS592 — Spatial Data Science, Spring 2026  
**Instructor:** Dr. Adnan Siddique  
**Institution:** Information Technology University, Lahore  

---

## Project Overview

This project predicts road collision risk for NYC road segments using spatial 
analysis and machine learning. We analyze 500,000 crash records (2021–2026), 
apply spatial techniques including choropleth mapping, Moran's I, LISA, KDE, 
and spatial regression, then train an XGBoost classifier achieving F1 0.848 
and AUC 0.971.

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

| Library | Purpose |
|---------|---------|
| GeoPandas | Spatial data handling and spatial join |
| libpysal | Spatial weights matrix |
| esda | Moran's I and LISA |
| Folium | Interactive maps |
| Shapely | Geometric operations |
| Scikit-Learn | ML models (Random Forest, Logistic Regression, Decision Tree) |
| XGBoost | Gradient boosting classifier |
| imbalanced-learn | SMOTE for class balancing |
| OSMnx | Road network download |
| NetworkX | Graph-based safe route finding |
| SciPy | Kernel Density Estimation |

---

## Key Results

| Technique | Result |
|-----------|--------|
| Choropleth Map | Brooklyn and Queens have highest crash counts |
| Point Pattern KDE | Crash density peaks in Manhattan and inner Brooklyn/Queens |
| Global Moran's I | 0.1643 (p=0.001) — significant positive spatial clustering |
| LISA High-High Hotspots | 33 confirmed dangerous clusters identified |
| LISA Low-Low Coldspots | 2,602 safe corridors identified |
| Spatial Regression | R² improved from 0.5674 to 0.5691 with spatial lag |
| XGBoost F1 | 0.848 |
| XGBoost AUC | 0.971 |
| Overall Accuracy | 89% |
| Borough F1 range | 0.830 – 0.852 (consistent across all five boroughs) |

---

## Data Sources

- NYC Motor Vehicle Collisions — https://data.cityofnewyork.us/resource/h9gi-nx95.csv
- NYC Street Centerline — https://data.cityofnewyork.us/resource/inkn-q76z.geojson
- NYC Borough Boundaries — https://github.com/dwillis/nyc-maps