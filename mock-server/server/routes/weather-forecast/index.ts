export default eventHandler((_event) => {
  // weatherForecasts
  return [
    {
      date: '2023-07-01',
      temperatureC: 25,
      temperatureF: 77,
      summary: 'Sunny',
    },
    {
      date: '2023-07-02',
      temperatureC: 18,
      temperatureF: 64,
      summary: 'Partly cloudy',
    },
    {
      date: '2023-07-03',
      temperatureC: 22,
      temperatureF: 71,
      summary: 'Cloudy',
    },
  ];
});
