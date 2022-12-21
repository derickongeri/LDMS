import { Log } from "src/Services/Logger";

export default function Analize_Hansen(stats,years){
    let data = stats.stats.stats[0].stats
    Log("Analize Hansen ",stats, " years ",years)
    let year = years-stats.base
    let required_stat = data.filter(stat=>{
        return stat.key === year
    })
    return required_stat
}