<script>
var maxval;
var minval;
import { Bar } from "vue-chartjs";
import Chart from "chart.js";
import maxValue from "vuelidate/lib/validators/maxValue";
import { Log } from "src/Services/Logger";
export default {
  extends: Bar,
  props: {
    BarData: {
      type: Object
    }
  },
  data() {
    return {
      options: {
        plugins: {
          datalabels: {
            anchor: "end",
            align: "top",
            formatter: Math.round
            // font: {
            //   weight: "bold"
            // }
          }
        },
        // showDatapoints: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                maxTicksLimit: 8,
                callback: function(label, index, labels) {
                  return label.toLocaleString();
                },
                suggestedMin: minval,
                suggestedMax: minval
              },
              gridLines: {
                display: false
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //get the concerned dataset
              let dataset = data.datasets[tooltipItem.datasetIndex];
              //get the current items value
              let currentValue = dataset.data[tooltipItem.index];

              return `${currentValue.toLocaleString()}`;
            }
          }
        }
      }
    };
  },
  watch: {
    BarData() {
      this.chart_graph();
    }
  },
  mounted() {
    Log("Bar data ", this.BarData);
    this.chart_graph();
  },
  methods: {
    chart_graph() {
      if (this.BarData) {
        maxval = Math.max(...this.BarData.datasets[0].data) + 10;
        minval = Math.min(...this.BarData.datasets[0].data) - 10;
        Chart.defaults.global.plugins.datalabels.display = false;
        if (this.BarData.datasets[0].data.length > 0) {
          if (maxval > 0)
            this.options.scales.yAxes[0].ticks.suggestedMax = maxval;
          if (minval < 0)
            this.options.scales.yAxes[0].ticks.suggestedMin = minval;
        } else {
          this.options.scales.yAxes[0].ticks.suggestedMax = 0;
          this.options.scales.yAxes[0].ticks.suggestedMin = 0;
        }
        Log(
          "max value y",
          maxval,
          "min ",
          minval,
          "dtataset ",
          this.BarData.datasets[0].data
        );
        this.renderChart(this.BarData, this.options);
      }
    }
  }
};
</script>
