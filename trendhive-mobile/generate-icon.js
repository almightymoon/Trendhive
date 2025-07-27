const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Read the SVG file
const svgContent = fs.readFileSync('./assets/icon.svg', 'utf8');

// Create a canvas
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Create a simple icon design directly on canvas
function drawIcon() {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, '#10B981');
  gradient.addColorStop(1, '#059669');
  
  // Background circle
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(512, 512, 480, 0, 2 * Math.PI);
  ctx.fill();
  
  // White border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Shopping bag
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(320, 320);
  ctx.lineTo(320, 280);
  ctx.quadraticCurveTo(320, 240, 360, 240);
  ctx.lineTo(664, 240);
  ctx.quadraticCurveTo(704, 240, 704, 280);
  ctx.lineTo(704, 320);
  ctx.lineTo(800, 320);
  ctx.lineTo(800, 720);
  ctx.quadraticCurveTo(800, 760, 760, 760);
  ctx.lineTo(264, 760);
  ctx.quadraticCurveTo(224, 760, 224, 720);
  ctx.lineTo(224, 320);
  ctx.closePath();
  ctx.fill();
  
  // Bag handles
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(320, 320);
  ctx.lineTo(320, 360);
  ctx.quadraticCurveTo(320, 380, 340, 380);
  ctx.lineTo(684, 380);
  ctx.quadraticCurveTo(704, 380, 704, 360);
  ctx.lineTo(704, 320);
  ctx.stroke();
  
  // Trend lines
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(400, 480);
  ctx.lineTo(480, 440);
  ctx.lineTo(560, 460);
  ctx.lineTo(640, 420);
  ctx.lineTo(720, 440);
  ctx.stroke();
  
  ctx.lineWidth = 6;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(400, 520);
  ctx.lineTo(480, 480);
  ctx.lineTo(560, 500);
  ctx.lineTo(640, 460);
  ctx.lineTo(720, 480);
  ctx.stroke();
  
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(400, 560);
  ctx.lineTo(480, 520);
  ctx.lineTo(560, 540);
  ctx.lineTo(640, 500);
  ctx.lineTo(720, 520);
  ctx.stroke();
  
  // Reset alpha
  ctx.globalAlpha = 1;
  
  // Trend dots
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(480, 440, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(560, 460, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(640, 420, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(720, 440, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Sparkle elements
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = 0.8;
  
  // Top left sparkle
  ctx.beginPath();
  ctx.moveTo(360, 360);
  ctx.lineTo(370, 350);
  ctx.lineTo(380, 360);
  ctx.lineTo(370, 370);
  ctx.closePath();
  ctx.fill();
  
  // Top right sparkle
  ctx.beginPath();
  ctx.moveTo(680, 360);
  ctx.lineTo(690, 350);
  ctx.lineTo(700, 360);
  ctx.lineTo(690, 370);
  ctx.closePath();
  ctx.fill();
  
  // Bottom sparkle
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(520, 680);
  ctx.lineTo(530, 670);
  ctx.lineTo(540, 680);
  ctx.lineTo(530, 690);
  ctx.closePath();
  ctx.fill();
}

// Draw the icon
drawIcon();

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./assets/icon.png', buffer);

console.log('Icon generated successfully!'); 