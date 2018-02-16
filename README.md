# spectra_visualization

### Linux (Ubuntu):

```sh
# install nodejs, npm and module
cd src
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install express

# copy data
cd ..
mkdir data
cp testcases/rawdata/CPTAC_Intact_rep3_15Jan15_Bane_C2-14-08-02RZ_7000-7300.mzML data/CPTAC_Intact_rep3_15Jan15_Bane_C2-14-08-02RZ_7000-7300.mzML

# run server
cd src
node server.js
```
Then open link http://127.0.0.1:8081/index.html