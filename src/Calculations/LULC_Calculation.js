import {i18n} from 'boot/i18n'
import { Log } from "src/Services/Logger";

export function LulcPieChart(stats) {
  let chardata = {};
  let data = matchlength(stats.stats.mapping, stats.stats);
  chardata.labels = stats.stats.mapping.map(a => i18n.t(`legend.${a.label}`));
  chardata.borderColor = stats.stats.mapping.map(a => a.color);
  chardata.backgroundColor = stats.stats.mapping.map(a => a.color);
  chardata.data = data.map(a => a.value);
  Log("LulcPieChart ",chardata,"stats ", stats);
  return chardata;
}
export function LulcChangePieChart(stats, colors) {
  let chardata = {};
  chardata.labels = stats.stats.map(a => i18n.t(`legend.${a.label}`));
  chardata.borderColor = colors.map(a => a.color);
  chardata.backgroundColor = colors.map(a => a.color);
  chardata.data = stats.stats.map(a => a.area);
  return chardata;
}

export function matchlength(mapping, stats) {
  //match stats to the mapping
  // Log(" matchlength", stats.stats[0].stats, "Mapping ", mapping);
  let data = [];
  let k;
  mapping.forEach((map, i) => {
    stats.stats[0].stats.forEach((stat, j) => {
      if (stat.key === map.val) {
        k = i;
        data[i] = { value: stat.value };
      }
      if (k !== i) {
        data[i] = {
          value: 0
        };
      }
    });
  });
  return data;
}
