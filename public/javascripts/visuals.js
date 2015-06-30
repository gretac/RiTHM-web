google.setOnLoadCallback(drawChart);

function drawChart() {
  var plotArea = document.getElementById('plot_area'),
      propArea = plotArea.children;

  var options = {
    title: 'Truth over time',
    legend: { position: 'none' },
    vAxis: { ticks: [{v:0, f:'F'}, {v:2, f:'T'}, {v:1, f:'Tp'}] }
  };

  for (var i = 0; i < propArea.length; i++) {
    var area = propArea[i];

    var plotDiv = area.children[1], // area contains h4 and div elements
        plotDataStr = plotDiv.getAttribute("data-plot"),
        plotData = JSON.parse(plotDataStr);

    var chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Time');
    chartData.addColumn('number', 'Truth Value');
    chartData.addRows(plotData);

    var chart = new google.visualization.SteppedAreaChart(plotDiv);
    chart.draw(chartData, options);
  }
}
