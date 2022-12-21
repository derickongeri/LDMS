import{Log} from 'src/Services/Logger'
export function forestfirestats(stats){
    Log("forestfirestats ",stats)
    const keys=[
        { color: "#768833", value: "Enhanced Regrowth", api_name:"Enhanced Regrowth, Low"},
        { color: "#0ce244", value: "Unburned",api_name: "Unburned" },
        { color: "#f5fe0c", value: "Low Severity",api_name: "Low Severity"},
        { color: "#fa671a", value: "Moderate Severity",api_name:"Moderate-high Severity" },
        { color: "#a500d2", value: "High Severity",api_name:"High Severity" },
    ]
    const validStats = stats.filter(({class:val1})=> keys.some(({api_name:val2})=>val1=== val2)) //filter stats to get only ones we need
    Log("validStats ", validStats)
    let backgroundColor = []
    let borderColor = []
    let labels=[]
    let data =[]
    keys.forEach(key=>{
        backgroundColor.push(key.color)
        labels.push(key.value)
    })
    validStats.reverse().forEach(stat=>{
        data.push(stat.hectares*10000)
    })
    borderColor = backgroundColor
    let PieChartData ={
        backgroundColor,
        borderColor,
        labels,
        data
    }
    
    Log("forestfirestats validStats ",PieChartData)
    return PieChartData
}