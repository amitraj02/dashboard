// LightweightCharts is loaded via CDN

document.addEventListener('DOMContentLoaded', () => {
  // Update Time
  const timeEl = document.getElementById('current-time');
  setInterval(() => {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  }, 1000);

  // Strategy Toggle
  const toggle = document.getElementById('strategy-toggle');
  const statusTxt = document.getElementById('strategy-status');
  toggle.addEventListener('change', (e) => {
    if(e.target.checked) {
      statusTxt.textContent = 'ON';
      statusTxt.className = 'status-on';
    } else {
      statusTxt.textContent = 'OFF';
      statusTxt.className = 'status-off';
    }
  });

  // Initialize Chart
  const chartContainer = document.getElementById('tv-chart');
  
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: '#94a3b8',
    },
    grid: {
      vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
      horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: '#94a3b8',
        width: 1,
        style: 1,
        labelBackgroundColor: '#1e293b',
      },
      horzLine: {
        color: '#94a3b8',
        width: 1,
        style: 1,
        labelBackgroundColor: '#1e293b',
      },
    },
    timeScale: {
      borderColor: '#1e293b',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: '#1e293b',
    },
  });

  const mainSeries = chart.addCandlestickSeries({
    upColor: '#10b981',
    downColor: '#ef4444',
    borderDownColor: '#ef4444',
    borderUpColor: '#10b981',
    wickDownColor: '#ef4444',
    wickUpColor: '#10b981',
  });

  // Generate Dummy Data (NIFTY 5 Min)
  const initialData = [];
  let baseTime = Math.floor(Date.now() / 1000) - 100 * 300; // 100 candles ago
  let currentPrice = 24200;

  for (let i = 0; i < 100; i++) {
    const open = currentPrice + (Math.random() * 20 - 10);
    const high = open + Math.random() * 20;
    const low = open - Math.random() * 20;
    const close = low + Math.random() * (high - low);
    
    initialData.push({
      time: baseTime + (i * 300),
      open, high, low, close
    });
    currentPrice = close;
  }

  mainSeries.setData(initialData);

  // Add Markers (Swing Lows, Buy/Sell Arrows)
  const markers = [];
  
  // Find a swing low roughly in the middle
  const middleIndex = 50;
  markers.push({
    time: initialData[middleIndex].time,
    position: 'belowBar',
    color: '#3b82f6',
    shape: 'arrowUp',
    text: 'Swing Low',
  });

  // Buy Signal
  markers.push({
    time: initialData[75].time,
    position: 'belowBar',
    color: '#10b981',
    shape: 'arrowUp',
    text: 'BUY',
  });

  // Sell Signal
  markers.push({
    time: initialData[90].time,
    position: 'aboveBar',
    color: '#ef4444',
    shape: 'arrowDown',
    text: 'SELL',
  });

  mainSeries.setMarkers(markers);

  // Handle Resize
  new ResizeObserver(entries => {
    if (entries.length === 0 || entries[0].target !== chartContainer) { return; }
    const newRect = entries[0].contentRect;
    chart.applyOptions({ height: newRect.height, width: newRect.width });
  }).observe(chartContainer);

  // Generate Option Chain Data
  const ocBody = document.getElementById('oc-body');
  const strikes = [24100, 24150, 24200, 24250, 24300, 24350, 24400, 24450, 24500, 24550, 24600];
  const atmStrike = 24350;

  let ocHTML = '';
  strikes.forEach(strike => {
    const isATM = strike === atmStrike;
    const isCE_ITM = strike < atmStrike;
    const isPE_ITM = strike > atmStrike;

    const ceClass = isCE_ITM ? 'itm-ce' : '';
    const peClass = isPE_ITM ? 'itm-pe' : '';
    const rowClass = isATM ? 'atm' : '';

    const cePrice = (Math.random() * 200 + 50).toFixed(1);
    const ceOI = (Math.random() * 50 + 10).toFixed(1) + 'L';
    const pePrice = (Math.random() * 200 + 50).toFixed(1);
    const peOI = (Math.random() * 50 + 10).toFixed(1) + 'L';

    ocHTML += `
      <div class="oc-row ${rowClass}">
        <div class="oc-col ${ceClass}">
          <span class="oc-price ${isCE_ITM ? 'green-text' : ''}">${cePrice}</span>
          <span class="oc-oi">${ceOI}</span>
        </div>
        <div class="strike-val">${strike}</div>
        <div class="oc-col ${peClass}">
          <span class="oc-price ${isPE_ITM ? 'green-text' : ''}">${pePrice}</span>
          <span class="oc-oi">${peOI}</span>
        </div>
      </div>
    `;
  });

  ocBody.innerHTML = ocHTML;
});
