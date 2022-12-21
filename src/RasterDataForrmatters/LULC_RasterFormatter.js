import { Log } from "src/Services/Logger";

export function LulcFormatter({stats,selection}) {
    Log("LulcFormatter 5:", stats, "selection in lulcFormater ", selection);
    try {
        let classification = []
        let colors = []
        stats.stats.mapping.forEach((stat,i) => {
            classification.push(stat.val)
            colors.push({
                color: stat.color,
                value: stat.label,
                number:classification[i]
            })
            // colors.push(stat.color)
        })
        Log("classification lulc", classification);
        return { classification, colors }
    } catch (error) {
        Log("LulcFormatter error ", error);
    }
}
export function Lulc_changeFormatter({stats,selection}) {
    let color =[ '#ffffe1','green','red']
    let labels =[ 'Stable','Vegetation Gain','Vegetation Loss'] //change labels for vegetation loss/gain
    Log("Lulc_changeFormatter 25", stats.stats,"Selection ", selection);
    if( stats.stats.length === 2) color.splice(1,1); //maintain colors for stable and degraded
    try {
        let classification = [];
        let colors=[]
        let sorted = stats.stats.sort((a,b) => a.change_type - b.change_type);
        Log("es6 ",sorted)
        sorted.forEach((stat,i) => {
            classification.push(stat.change_type)
           if(selection.LDH){ //check if data is for Veg Loss/Gain
            colors.push({
                color: color[i],
                value: labels[i],
             number:classification[i]
            })
           }else{ //Otherwise use the labels from the api
            colors.push({
                color: color[i],
                value: stat.label,
                number:classification[i]
            })
           }
        })
        Log("classification 39", classification);
        return {classification, colors}
    } catch (error) {
        Log("Lulc Change Formatter error ", error);
    }
}