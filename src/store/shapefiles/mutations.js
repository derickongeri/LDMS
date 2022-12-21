export const regional = (state, regional) => {   
    state.regional = regional
}
export const regionalvect = (state, regionalvect) => {   
    state.regionalvect =regionalvect
}
export const vect0 = (state, vect0) => {   
    state.vect0 = vect0
}
export const vect1 = (state, vect1) => {   
    state.vect1 = vect1
}
export const vect2 = (state, vect2) => {   
    state.vect2 = vect2
}
export const geojson0 = (state, geojson) => {   
    state.geojson0.push(geojson)
}
export const geojson1 = (state, geojson) => {   
    state.geojson1.push(geojson)
}
export const geojson2 = (state, geojson) => {   
    state.geojson2.push(geojson)
}
export const currentGeoJson = (state, currentGeoJson) => {   
    state.currentGeoJson=currentGeoJson;
}
export const geometry_loaded = (state, geometry_loaded) => {   
    state.geometry_loaded=geometry_loaded;
}
export const customShapefiles = (state, customShapefiles) => {   
    state.customShapefiles=customShapefiles;
}