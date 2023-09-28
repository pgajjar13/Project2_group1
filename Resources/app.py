# Import the dependencies.

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

import datetime as datetime

import json

engine = create_engine("sqlite:///Bicycle_thefts.sqlite")


session = Session(engine)

app = Flask(__name__)



#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template('index.html')

#################################################

@app.route("/data")
def toronto_thefts_data():
    
    results=session.execute('select * from info').all()
    bicycle_thefts=[]
    for incidents in results: 
        thefts = dict(incidents)
        bicycle_thefts.append(thefts)

    return jsonify(bicycle_thefts)

if __name__ == '__main__':
    app.run(debug=True)