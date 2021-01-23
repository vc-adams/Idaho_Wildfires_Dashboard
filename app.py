import os
import numpy as np
import pandas as pd
import random

from flask import Flask, flash, request, jsonify, render_template


# try:
#     db_uri = os.environ['DATABASE_URL']
# except KeyError:
#     db_uri = f"postgres://postgres:{Posgres_Pswrd}@localhost:5432/wildfires_db"



app = Flask(__name__)

data_path = './static/data/'

def process_input(data):
    infile=""
    # convert to dataframe for easy processing
    df = pd.DataFrame([data])
    
    counties = pd.read_csv(data_path + 'idaho_counties.csv')
    counties_dummy = pd.get_dummies(counties["NAME"],prefix="NAME")
    counties_dummy = counties_dummy.iloc[:1]
    counties_dummy.fillna(0)

    county= 'NAME_' + df['County']
    counties_dummy.at[0, county]=1
    
    df['Temperature'] = df['Temperature'].astype(float)
    df['Precipitation'] = df['Precipitation'].astype(float)
    df['D0'] = df['D0'].astype(float)
    df['D1'] = df['D1'].astype(float)
    df['D2'] = df['D2'].astype(float)
    df['D3'] = df['D3'].astype(float)
    df['D4'] = df['D4'].astype(float)

    df['DAY_AVG_TEMP_1'] = df['Temperature'] * random.uniform(1.015, 1.025)
    df['DAY_AVG_TEMP_2'] = df['Temperature'] * random.uniform(1.015, 1.025)
    df['DAY_AVG_TEMP_3'] = df['Temperature'] * random.uniform(1.015, 1.025)
    df['DAY_AVG_TEMP_4'] = df['Temperature'] * random.uniform(1.015, 1.025)

    df['DAY_PRCP_1'] = df['Precipitation'] * random.uniform(1.015, 1.025)
    df['DAY_PRCP_2'] = df['Precipitation'] * random.uniform(1.015, 1.025)
    df['DAY_PRCP_3'] = df['Precipitation'] * random.uniform(1.015, 1.025)
    df['DAY_PRCP_4'] = df['Precipitation'] * random.uniform(1.015, 1.025)

    df = df.drop(['County','Temperature', 'Precipitation'], axis = 1)

    new_df = pd.concat([df, counties_dummy], axis=1)

    # new_df.to_csv(data_path + 'idaho_counties.csv')

    return new_df




@app.route("/")
def home():
    
    return render_template('index.html')

    

@app.route('/calc_fires', methods=['GET', 'POST'])
def calc_fires():
    message=''
    if request.method == 'POST':
        message = "data posted"
        input_data = request.form.to_dict()
        data = process_input(input_data)
        
    return render_template('calc_fires.html', result=message)  

    

@app.route('/calc_fires2', methods=['GET', 'POST'])
def calc_fires2():
    message=''
    if request.method == 'POST':
        message = "data posted"
        input_data = request.form.to_dict()
        data = process_input(input_data)
        
    return render_template('calc_fires2.html', result=message)



if __name__ == '__main__':
    app.run(debug=True)