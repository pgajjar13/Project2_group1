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
    with open('Bicycle_Thefts_Open_Data.geojson') as data: 
        geo=json.load(data)
    return jsonify(geo)


if __name__ == '__main__':
    app.run(debug=True)