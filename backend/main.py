from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import math

app = FastAPI(title="Urban Crash Analytics API")

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load data once when server starts 
print("Loading data...")

segment_risk = pd.read_csv("data/segment_risk.csv")

with open("data/graph_edges.json") as f:
    graph_edges = json.load(f)

print(f"Loaded {len(segment_risk):,} segments and {len(graph_edges):,} edges")

# ── Build graph once when server starts ───────────────────────────────────────
# Each road segment becomes an edge in a graph
# Nodes are intersections (lat/lon points)
# Weight = risk × length so Dijkstra avoids dangerous roads

def build_graph(edges):
    nodes = {}
    adj   = {}
    for e in edges:
        sk = f"{e['start'][0]:.5f},{e['start'][1]:.5f}"
        ek = f"{e['end'][0]:.5f},{e['end'][1]:.5f}"
        if sk not in nodes: nodes[sk] = e['start']
        if ek not in nodes: nodes[ek] = e['end']
        if sk not in adj: adj[sk] = []
        if ek not in adj: adj[ek] = []
        rw = {'Low':1,'Moderate':3,'High':10}.get(e['risk'], 1)
        d  = e['length']
        adj[sk].append({
            'node': ek, 'w': rw*d, 'd': d,
            'risk': e['risk'], 'coords': e['coords'], 'street': e['street']
        })
        adj[ek].append({
            'node': sk, 'w': rw*d, 'd': d,
            'risk': e['risk'], 'coords': list(reversed(e['coords'])), 'street': e['street']
        })
    return nodes, adj

print("Building road graph...")
NODES, ADJ = build_graph(graph_edges)
print(f"Graph ready — {len(NODES):,} nodes")

# ── Helper functions ──────────────────
def nearest_node(lat, lon):
    # find the closest intersection to a given GPS point
    best, best_d = None, float('inf')
    for k, n in NODES.items():
        d = (n[0]-lat)**2 + (n[1]-lon)**2
        if d < best_d:
            best_d = d
            best = k
    return best

def dijkstra(start_key, end_key, weight_fn):
    # classic shortest path — finds minimum cost route through graph
    dist    = {start_key: 0}
    prev    = {}
    prev_e  = {}
    visited = set()
    queue   = [(0, start_key)]

    while queue:
        queue.sort(key=lambda x: x[0])
        d, u = queue.pop(0)
        if u in visited:
            continue
        visited.add(u)
        if u == end_key:
            break
        for edge in ADJ.get(u, []):
            nd = d + weight_fn(edge)
            if nd < dist.get(edge['node'], float('inf')):
                dist[edge['node']] = nd
                prev[edge['node']] = u
                prev_e[edge['node']] = edge
                queue.append((nd, edge['node']))

    # reconstruct path
    path, cur = [], end_key
    while cur in prev:
        path.insert(0, prev_e[cur])
        cur = prev[cur]
    return path

def path_stats(path):
    dist, risk_score, high = 0, 0, 0
    rw = {'Low':1,'Moderate':3,'High':10}
    for e in path:
        dist       += e['d']
        risk_score += rw.get(e['risk'], 1) * e['d'] * 111
        if e['risk'] == 'High':
            high += 1
    return {
        'distance_km': round(dist * 111, 2),
        'risk_score':  round(risk_score),
        'high_risk_segments': high,
        'coords': [c for e in path for c in e['coords']]
    }

# ── API Endpoints ─────────────────────

@app.get("/")
def root():
    return {"status": "ok", "project": "Urban Crash Analytics"}


@app.get("/stats")
def get_stats():
    # summary numbers shown on the frontend dashboard
    risk_counts = segment_risk['risk_class'].value_counts().to_dict()
    return {
        "total_crashes":    461425,
        "total_segments":   len(segment_risk),
        "date_range":       "Feb 2021 – Mar 2026",
        "model_f1":         0.848,
        "model_auc":        0.971,
        "risk_distribution": {
            "low":      int(risk_counts.get('Low', 0)),
            "moderate": int(risk_counts.get('Moderate', 0)),
            "high":     int(risk_counts.get('High', 0)),
        }
    }


class RouteRequest(BaseModel):
    start_lat: float
    start_lon: float
    end_lat:   float
    end_lon:   float


@app.post("/route")
def find_routes(req: RouteRequest):
    # snap user's clicked points to nearest graph nodes
    sk = nearest_node(req.start_lat, req.start_lon)
    ek = nearest_node(req.end_lat,   req.end_lon)

    if not sk or not ek:
        return {"error": "Could not find nearby road nodes"}

    # three routes with different priorities
    safe     = dijkstra(sk, ek, lambda e: e['w'])               # minimizes risk
    shortest = dijkstra(sk, ek, lambda e: e['d'])               # minimizes distance
    balanced = dijkstra(sk, ek,                                  # balance both
        lambda e: {'Low':1,'Moderate':2,'High':5}.get(e['risk'],1) * e['d'])

    if not safe and not shortest:
        return {"error": "No route found between these points"}

    return {
        "safe":     path_stats(safe),
        "shortest": path_stats(shortest),
        "balanced": path_stats(balanced),
    }
    
    
@app.get("/borough-stats")
def borough_stats():
    # borough level risk breakdown for the stats page
    borough_map = {
        'Manhattan':    {'f1': 0.837, 'segments': 7657},
        'Brooklyn':     {'f1': 0.848, 'segments': 18174},
        'Queens':       {'f1': 0.852, 'segments': 22742},
        'Bronx':        {'f1': 0.830, 'segments': 9684},
        'Staten Island':{'f1': 0.835, 'segments': 6218},
    }
    return {
        "boroughs": borough_map,
        "models": {
            "XGBoost":            {"f1": 0.848, "auc": 0.971},
            "Random Forest":      {"f1": 0.840, "auc": 0.961},
            "Decision Tree":      {"f1": 0.810, "auc": 0.870},
            "Logistic Regression":{"f1": 0.561, "auc": 0.770},
        }
    }