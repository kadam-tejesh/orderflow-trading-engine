import { useRef, useEffect } from 'react';

function DepthVisualizer({ bids = [], asks = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cumBid = 0;
    const bidPoints = bids.map((b) => { cumBid += b.volume; return cumBid; });
    let cumAsk = 0;
    const askPoints = asks.map((a) => { cumAsk += a.volume; return cumAsk; });

    const maxCum = Math.max(...bidPoints, ...askPoints, 1);
    const midX = canvas.width / 2;

    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.beginPath();
    ctx.moveTo(midX, canvas.height);
    bidPoints.forEach((v, i) => {
      const x = midX - (i + 1) * (midX / bidPoints.length);
      const y = canvas.height - (v / maxCum) * canvas.height;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(0, canvas.height - (bidPoints.at(-1) / maxCum) * canvas.height);
    ctx.stroke();
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.moveTo(midX, canvas.height);
    askPoints.forEach((v, i) => {
      const x = midX + (i + 1) * (midX / askPoints.length);
      const y = canvas.height - (v / maxCum) * canvas.height;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(canvas.width, canvas.height - (askPoints.at(-1) / maxCum) * canvas.height);
    ctx.stroke();
    ctx.fill();
  }, [bids, asks]);

  return (
    <div className="depth-visualizer">
      <h2>Depth of Market</h2>
      <canvas ref={canvasRef} width={500} height={150} style={{ background: '#0f1117' }} />
    </div>
  );
}

export default DepthVisualizer;