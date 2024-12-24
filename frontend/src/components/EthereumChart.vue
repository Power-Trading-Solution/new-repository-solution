<template>
    <div class="eth-chart-page">
      <h2>График и курс Эфириума</h2>
      
      <div class="buttons">
        <button @click="changePeriod('1')">День</button>
        <button @click="changePeriod('30')">Месяц</button>
        <button @click="changePeriod('365')">Год</button>
      </div>
      
      <canvas ref="ethChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  const ethPrices = ref([]);  // Массив для хранения цен Ethereum
  const chartInstance = ref(null);  // Для хранения экземпляра графика
  const selectedPeriod = ref('30');  // По умолчанию показываем за 30 дней
  
  // Функция для получения данных о стоимости Ethereum
  const fetchEthPrices = async (days) => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
        params: {
          vs_currency: 'usd',
          days: days,  // Период, который мы получаем (день, месяц, квартал, год)
        }
      });
  
      ethPrices.value = response.data.prices.map((price) => ({
        time: new Date(price[0]),
        value: price[1]
      }));
  
      // Обновляем график
      updateChart();
  
    } catch (error) {
      console.error('Error fetching Ethereum prices:', error);
    }
  }
  
  // Функция для обновления графика
  const updateChart = () => {
    const ctx = document.querySelector('canvas').getContext('2d');
    
    // Если график уже существует, уничтожаем его перед созданием нового
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
  
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ethPrices.value.map(price => price.time.toLocaleDateString()),  // Отображаем только дату
        datasets: [{
          label: 'График Эфириума',
          data: ethPrices.value.map(price => price.value),
          borderColor: '#794ee6',  // Новый цвет линии графика
          backgroundColor: 'rgba(121, 78, 230, 0.2)',  // Полупрозрачный фон графика (опционально)
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { 
              display: true, 
              text: 'Date',
              color: 'white' // Цвет для заголовка оси X
            },
            ticks: {
              color: 'white', // Цвет подписей оси X
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)' // Цвет сетки оси X
            }
          },
          y: {
            title: { 
              display: true, 
              text: 'Price (USD)',
              color: 'white' // Цвет для заголовка оси Y
            },
            ticks: {
              color: 'white', // Цвет подписей оси Y
              callback: function(value) { return `$${value}`; }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)' // Цвет сетки оси Y
            }
          }
        },
        // Настройки всплывающих подсказок (tooltips)
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItem) {
                // Возвращаем только дату (метка оси X)
                return tooltipItem[0].label;
              },
              label: function(tooltipItem) {
                const time = ethPrices.value[tooltipItem.dataIndex].time.toLocaleTimeString();
                const price = tooltipItem.raw;
                // Форматируем подпись для tooltip с точным временем и ценой
                return `Price: $${price} at ${time}`;
              }
            }
          }
        }
      }
    });
  }
  
  // Функция для изменения периода
  const changePeriod = (days) => {
    selectedPeriod.value = days;
    fetchEthPrices(days);
  }
  
  onMounted(() => {
    // Загружаем данные за 30 дней при монтировании компонента
    fetchEthPrices('30');
  });
  </script>
  
  <style scoped>
  .eth-chart-page {
    padding: 20px;
    background-color: #20153c;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    color: white;
  }
  
  canvas {
    max-width: 100%;
    height: auto;
    color: white;
  }
  
  .buttons {
    margin-bottom: 20px;
    color: white;
    height: 70px;
  }
  
  .buttons button {
    border-radius: 5px;
    padding: 10px 20px;
    margin-right: 10px;
    background-color: #6340bc;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .buttons button:hover {
    background-color: #4d3291;
    color: white;
  }
  </style>
  