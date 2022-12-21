import GeoRasterLayer from "georaster-layer-for-leaflet";
import { Log } from "src/Services/Logger";
export function renderGeoraster(geotiff_name, georaster, data, colors) {
 
  let layer = new GeoRasterLayer({
    debugLevel: 0,
    geotiff_name: geotiff_name,
    georaster: georaster,
    opacity: 1,
    pixelValuesToColorFn: function(values) {
      if (values[0] === georaster.noDataValue) {
        return null;
      }
      if (data.includes(values[0])) {
        return colors[data.indexOf(values[0])].color;
      }
      if (geotiff_name === "Forest Fire") {
        if (values[0] >= -500 && values[0] <= -101) return "#768833";
        // if(values[0] >=-250 && values[0]<=-101) return "#a8bf54"
        if (values[0] >= -100 && values[0] <= 99) return "#0ce244";
        if (values[0] >= 100 && values[0] <= 269) return "#f5fe0c";
        // if(values[0] >=270 && values[0]<=439) return "#f8b040"
        if (values[0] >= 270 && values[0] <= 659) return "#fa671a";
        if (values[0] >= 660 && values[0] <= 1300) return "#a500d2";
      }
    },
    resolution: 64 // optional parameter for adjusting display resolution
  });
  return layer;
}
export function renderForestGeoraster(geotiff_name, georaster, data, colors) {
  let layer = new GeoRasterLayer({
    debugLevel: 1,
    geotiff_name: geotiff_name,
    georaster: georaster,
    opacity: 0.7,
    pixelValuesToColorFn: function(values) {
      if (values[0] === georaster.noDataValue) return null;
      if (values[0] !== 7) return "white";
      if (data.includes(values[0])) {
        Log("values  found forest", values[0]);
        return colors[data.indexOf(values[0])].color;
      }
    },
    resolution: 64, // optional parameter for adjusting display resolution
    debugLevel: 0
  });
  return layer;
}
