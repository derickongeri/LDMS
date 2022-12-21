import {i18n} from 'boot/i18n'

export function ESAICalculations(stats){
if(process.env.DEV) console.log(" ESAI ESAICalculations", stats);
// const _colors =[ '#ffffe1','green','red','blue','brown','yellow'];
const _colors =[ '#007500','#009b01','#61c800','#cdee81','#fffeda','#ffef9f','#fedb57','#fdb509'].reverse();

let labels =[];
let area =[];
let colors =[];
let classification=[];
stats.stats.forEach((stat,i) => {
    classification.push(stat.change_type);
    labels.push( i18n.t(`legend.${stat.label}`))
    area.push(stat.area)
    colors.push({
        color:_colors[i],
        value:stat.label,
        number:classification[i]
    });
    

});
let chart_data={
    backgroundColor:_colors,
    borderColor:_colors,
    data:area,
    labels:labels
}
const esai ={
    labels,chart_data,colors, classification
}
if(process.env.DEV) console.log("ESAICalculations ", esai);
return esai
}

export function CQICalculations(stats){

// const _colors =[ '#ffffe1','green','red','blue','brown','yellow'];
const _colors =[ 'green','#ffffe1','red','blue','brown','yellow'];
let labels =[];
let area =[];
let colors =[];
let classification=[];
stats.stats.forEach((stat,i) => {
    classification.push(stat.change_type);
    labels.push(i18n.t(`legend.${stat.label}`))
    area.push(stat.area)
    colors.push({
        color:_colors[i],
        value:stat.label,
        number:classification[i]
    });
   

});
let chart_data={
    backgroundColor:_colors,
    borderColor:_colors,
    data:area,
    labels:labels
}
const data ={
    labels,chart_data,colors, classification
}
if(process.env.DEV) console.log("medalus ", data);
return data
}