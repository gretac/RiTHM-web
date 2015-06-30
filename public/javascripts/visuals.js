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

    if (rowVals[1] === 'Satisfied') {
      rowVals[1] = 2;
    } else if (rowVals[1] === 'Violated') {
      rowVals[1] = 0;
    } else if (rowVals[1] === 'Presumably Satisfied') {
      rowVals[1] = 1;
    } else {
      rowVals[1] = -1;
    }

    dataVals.push(rowVals);
  });
  chartData.addRows(dataVals);

  var options = {
    title: 'Truth over time',
    legend: { position: 'none' },
    vAxis: { ticks: [{v:0, f:'F'}, {v:2, f:'T'}, {v:1, f:'Tp'}] }
  };

  var chart = new google.visualization.SteppedAreaChart(document.getElementById('results_chart'));
  chart.draw(chartData, options);
}
