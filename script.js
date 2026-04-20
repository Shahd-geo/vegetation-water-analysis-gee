var oman =ee.Filter.eq('NAME_ENGLI','WILAYAT SOHAR')
var albatinah=table.filter(oman)
var sentinal = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
var filter = sentinal.filterBounds(albatinah)
  .filterDate('2024-01-02','2024-08-13')
  .median();
Map.addLayer(filter,{bands:['B4','B3','B2'],min:0,max:3000},"RGB"); 
//calculate NDVI,NDWI
var NDVI=filter.normalizedDifference(['B8','B4']);
var NDWI=filter.normalizedDifference(['B3','B8']);
var NBR = filter.normalizedDifference(['B8','B12']);

//VISUALIZE NDVI 'NDWI
// Make a palette: a list of hex strings.
var vis = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
              '74A901', '66A000', '529400', '3E8601', '207401', '056201',
              '004C00', '023B01', '012E01', '011D01', '011301'];
              
Map.addLayer(NDVI,{min:0,max:1,palette:vis},'NDVI');
Map.addLayer(NDWI,{min:-1,max:1,palette:vis},"NDWI");
Map.addLayer(NBR,{min:0,max:1,palette:vis},'NBR');


//define thresholds

var scar=0.6 //all values of nbr>0.6 are burn scars
var vege=0.7
var water=0.1

//show the water bodies
var ndwi_thr=NDWI.gt(water)
var myndwi=ndwi_thr.updateMask(ndwi_thr).clip(albatinah);
Map.addLayer(myndwi,{palette:'blue'},'water');

//show the burn scars

var brn_thr=NBR.gt(scar)//all values greater than or gt than 0.6

var my_burn=brn_thr.updateMask(brn_thr).clip(albatinah);

Map.addLayer(my_burn,{palette:'red'},'scar');
