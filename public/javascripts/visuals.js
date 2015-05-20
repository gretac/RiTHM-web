google.setOnLoadCallback(drawChart);

function drawChart() {
  var dataStr = document.getElementById('results_chart').getAttribute('data-chartResults'),
      dataVals = [],
      chartData = new google.visualization.DataTable();

  chartData.addColumn('string', 'Time');
  chartData.addColumn('number', 'Truth Value');

  dataStr.split('\n').forEach(function (rowStr) {
    var rowVals = rowStr.split(',');
    if (rowVals.length < 2) return;
    // rowVals[0] = parseFloat(rowVals[0]);
    rowVals[1] = rowVals[1] === 'T' ? 1 : 0;
    dataVals.push(rowVals);
  });
  chartData.addRows(dataVals);

  var options = {
    title: 'Truth over time',
    legend: { position: 'none' },
    vAxis: { ticks: [{v:0, f:'F'}, {v:1, f:'T'}] }
  };

  var chart = new google.visualization.SteppedAreaChart(document.getElementById('results_chart'));
  chart.draw(chartData, options);
}
