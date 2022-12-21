export const RasterList = (state, rasters) => {   
    state.RasterList = rasters
}
export const Raster = (state, raster) => {   
    state.Rasters.push(raster)
}
export const Rasterfile = (state, rasterfile) => {   
    state.Rasterfiles.push(rasterfile)
}
export const storeTiffFile = (state, tiff) => {   
    state.TiffFile = tiff
}