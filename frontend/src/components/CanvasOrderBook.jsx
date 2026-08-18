import { useRef, useEffect } from 'react';

function CanvasOrderBook({ bids = [], asks = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVolume = Math.max(
      ...bids.map((b) => b.volume), ...asks.map((a) => a.volume), 1
    );
    const rowHeight = 20;

    bids.forEach((level, i) => {
      const barWidth = (level.volume / maxVolume) * (canvas.width / 2 - 10);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fillRect(canvas.width / 2 - barWidth, i * rowHeight, barWidth, rowHeight - 2);
      ctx.fillStyle = '#10b981';
      ctx.font = '11px monospace';
      ctx.fillText(level.price.toFixed(2), 10, i * rowHeight + 14);
    });

    asks.forEach((level, i) => {
      const barWidth = (level.volume / maxVolume) * (canvas.width / 2 - 10);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(canvas.width / 2, i * rowHeight, barWidth, rowHeight - 2);
      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.fillText(level.price.toFixed(2), canvas.width - 60, i * rowHeight + 14);
    });
  }, [bids, asks]);

  return (
    <div className="canvas-order-book">
      <h2>Order Book (Canvas)</h2>
      <canvas ref={canvasRef} width={340} height={200} style={{ background: '#0f1117' }} />
    </div>
  );
}

export default CanvasOrderBook;