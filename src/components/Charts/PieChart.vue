<script>
import { Pie } from "vue-chartjs";
import Chart from "chart.js";
import { Log } from "src/Services/Logger";
import datalabels from "chartjs-plugin-datalabels";
export default {
  extends: Pie,
  data() {
    return {
      options: {
        legend: {
          display: true,
          position: "right",
          labels: {
            // This more specific font property overrides the global property
            fontColor: "black"
          }
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = ((value * 100) / sum).toFixed(0) + "%";
              if ((value * 100) / sum > 3) {
                return percentage;
              } else {
                return "";
              }
            },
            color: "black"
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //get the concerned dataset
              var dataset = data.datasets[tooltipItem.datasetIndex];
              //calculate the total of this data set
              var total = dataset.data.reduce(function(
                previousValue,
                currentValue,
                currentIndex,
                array
              ) {
                return previousValue + currentValue;
              });
              //get the current items value
              var currentValue = dataset.data[tooltipItem.index];
              //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
              var percentage = ((currentValue / total) * 100).toFixed(0);
              return `${data.labels[tooltipItem.index]} ${(
                currentValue / 10000
              ).toFixed(2)} ha (${percentage} %)`;
            }
          }
        }
      }
    };
  },
  props: {
    piedata: {
      type: Object
    }
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      Chart.defaults.global.plugins.datalabels.display = true;
      let chartData = {
        labels: this.piedata.labels,
        datasets: [
          {
            borderWidth: 1,
            borderColor: this.piedata.borderColor,
            backgroundColor: this.piedata.backgroundColor,
            data: this.piedata.data
          }
        ]
      };
      this.renderChart(chartData, this.options);
    }
  },
  watch: {
    piedata: {
      handler(val) {
        Log("piechart data watch", val);
        this.createChart();
      },
      deep: true
    }
  }
};
</script>
