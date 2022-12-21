
import {Log} from 'src/Services/Logger'
const classes = { //holds raster types and the selection1 that uses them
    "LULC": {
        "classifications": ["Land Cover", "forest change", "Carbon stock",
        "Land Cover Change","Carbon Stock Change",'Land degradation Change',
        "Trajectory","State","Performance","Land Productivity","Land degradation"
    ],
        "url": '/lulc/'
    },
    "SOC": {
        "classifications": ["not used"],//
        "url": "/soc/"
    },
    // "NDVI": {
    //     "classifications": ["Trajectory","State","Performance","Land Productivity","Land degradation"],
    // }
}
let rasters = Object.keys(classes)
export function selection_url(rasterTypes, selection) {
    Log("selection sdg_selection  ",selection );
    let details = {};
    Object.values(classes).forEach((element, i) => {
        for (const j in element.classifications) {
            if (element.classifications[j] === selection.selection1) {
                details.type = rasterTypes.filter(type => {
                    return type.name === rasters[i];
                })
                details.url = element.url
            }
        }
    });

    switch (selection.selection1) {
        case "Carbon Stock Change":
            details.url = '/soc/';
            break;
        case "Carbon Stock":
            details.url = '/soc/';
            break;
        case "Trajectory":
            details.url = '/trajectory/';
            break;
        case "State":
            details.url = '/state/';
            break;
        case "Performance":
            details.url = '/performance/';
            break;
        case "Land Productivity":
            details.url = '/productivity/';
            break;
        case "Land degradation":
            details.url = '/degradation/';
            break;
    }
    Log("type ==", details);

    return details

}