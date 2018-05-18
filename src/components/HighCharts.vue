<template>
  <div class="highchart-container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts);
Highmaps(Highcharts);

export default {
  props: ['options', 'styles'],
  name: 'HighCharts',
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      console.log(this.$el);
      this.$el.style.width = (this.styles.width || 45) + '%';
      this.$el.style.height = (this.styles.height || 400) + 'px';
      this.$el.style.float = (this.styles.float || 'left');
      this.chart = new Highcharts.Chart(this.$el, this.options);
    }
  }
}
</script>

<style scoped>
.highchart-container {
  width: 45%;
  height: 400px;
  float: left
}
</style>
