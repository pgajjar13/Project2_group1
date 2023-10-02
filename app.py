# Import the dependencies.

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import sqlalchemy as sql

from flask import Flask, jsonify, render_template

import datetime as datetime

import json

engine=sql.create_engine('sqlite:///Resources/Bicycle_thefts.sqlite')


session = Session(engine)

app = Flask(__name__)



#################################################
# Flask Routes
#################################################

@app.route("/data")
def toronto_thefts_data():
    
    results=engine.execute('select * from info').fetchall()
    bicycle_thefts=[]
    for incidents in results: 
        thefts = dict(incidents)
        bicycle_thefts.append(thefts)

    return jsonify(bicycle_thefts)

@app.route('/hood')
def return_boroughs():
    with open('Resources/Bicycle_Thefts_Open_Data.geojson') as f: 
        geo=json.load(f)
    return jsonify(geo)

@app.route("/")
def home():
    return render_template('index.html')

#################################################


if __name__ == '__main__':
    app.run(debug=True)