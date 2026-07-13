import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Polygon,
  Polyline,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const BLUE = '#0868F3';
const PURPLE = '#9C7CFF';
const GRID = '#D7E2F4';
const LABEL = '#33405F';

function polygonPoints(values: number[], centerX: number, centerY: number, radius: number) {
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / values.length;
    const pointRadius = radius * value;
    return `${centerX + Math.cos(angle) * pointRadius},${centerY + Math.sin(angle) * pointRadius}`;
  }).join(' ');
}

export function CompetencyRadar({ width = 220, height = 230 }: { width?: number; height?: number }) {
  const centerX = width / 2;
  const centerY = height / 2 + 2;
  const radius = Math.min(width, height) * 0.31;
  const labels = ['Bài tập', 'Kiểm tra', 'Điểm thi', 'Hoàn thành', 'Chuyên cần', 'Tương tác'];
  const personal = [0.88, 0.82, 0.9, 0.78, 0.95, 0.7];
  const average = [0.68, 0.72, 0.72, 0.64, 0.76, 0.6];

  return (
    <View accessible accessibilityLabel="Biểu đồ năng lực cá nhân so với trung bình đơn vị">
      <Svg width={width} height={height}>
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <Polygon
            key={scale}
            points={polygonPoints(new Array(6).fill(scale), centerX, centerY, radius)}
            fill={scale === 1 ? '#F8FBFF' : 'transparent'}
            stroke={GRID}
            strokeWidth={1}
          />
        ))}
        {new Array(6).fill(0).map((_, index) => {
          const angle = -Math.PI / 2 + (index * Math.PI * 2) / 6;
          return (
            <Line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(angle) * radius}
              y2={centerY + Math.sin(angle) * radius}
              stroke={GRID}
            />
          );
        })}
        <Polygon points={polygonPoints(average, centerX, centerY, radius)} fill="rgba(156,124,255,.08)" stroke={PURPLE} strokeWidth={2} strokeDasharray="6 5" />
        <Polygon points={polygonPoints(personal, centerX, centerY, radius)} fill="rgba(8,104,243,.14)" stroke={BLUE} strokeWidth={3} />
        {personal.map((value, index) => {
          const angle = -Math.PI / 2 + (index * Math.PI * 2) / 6;
          return <Circle key={index} cx={centerX + Math.cos(angle) * radius * value} cy={centerY + Math.sin(angle) * radius * value} r={4} fill={BLUE} />;
        })}
        {labels.map((label, index) => {
          const angle = -Math.PI / 2 + (index * Math.PI * 2) / 6;
          const x = centerX + Math.cos(angle) * (radius + 24);
          const y = centerY + Math.sin(angle) * (radius + 24);
          return <SvgText key={label} x={x} y={y} fontSize={10} fill={LABEL} textAnchor="middle">{label}</SvgText>;
        })}
      </Svg>
    </View>
  );
}

export function RankingLineChart({ width, height = 180 }: { width: number; height?: number }) {
  const values = [18, 16, 15, 12];
  const left = 26;
  const right = width - 14;
  const top = 24;
  const bottom = height - 28;
  const points = values.map((value, index) => {
    const x = left + ((right - left) * index) / (values.length - 1);
    const y = top + ((value - 5) / 20) * (bottom - top);
    return { x, y, value };
  });

  return (
    <Svg width={width} height={height} accessibilityLabel="Biểu đồ thay đổi thứ hạng từ 18 lên 12">
      {[5, 10, 15, 20, 25].map((rank) => {
        const y = top + ((rank - 5) / 20) * (bottom - top);
        return (
          <Line key={rank} x1={left} y1={y} x2={right} y2={y} stroke={GRID} strokeDasharray="4 4" />
        );
      })}
      <Polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke={BLUE} strokeWidth={3} />
      {points.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={5} fill={BLUE} stroke="#FFFFFF" strokeWidth={2} />
      ))}
      {points.map((point, index) => (
        <SvgText key={`v-${index}`} x={point.x} y={point.y - 10} fontSize={10} fontWeight="700" fill="#12347B" textAnchor="middle">{point.value}</SvgText>
      ))}
      {['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'].map((label, index) => (
        <SvgText key={label} x={points[index].x} y={height - 7} fontSize={9} fill={LABEL} textAnchor="middle">{label}</SvgText>
      ))}
    </Svg>
  );
}

export function ScoreBarChart({ width, height = 180 }: { width: number; height?: number }) {
  const values = [780, 810, 835, 865];
  const left = 22;
  const right = width - 10;
  const top = 24;
  const bottom = height - 28;
  const chartHeight = bottom - top;
  const slot = (right - left) / values.length;
  const barWidth = Math.max(18, slot * 0.5);

  return (
    <Svg width={width} height={height} accessibilityLabel="Biểu đồ điểm năng lực tăng từ 780 lên 865">
      <Defs>
        <LinearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2F7BF7" />
          <Stop offset="1" stopColor="#8DB8FF" />
        </LinearGradient>
      </Defs>
      {[0, 250, 500, 750, 1000].map((score) => {
        const y = bottom - (score / 1000) * chartHeight;
        return <Line key={score} x1={left} y1={y} x2={right} y2={y} stroke={GRID} strokeDasharray="4 4" />;
      })}
      {values.map((value, index) => {
        const x = left + slot * index + (slot - barWidth) / 2;
        const barHeight = (value / 1000) * chartHeight;
        const y = bottom - barHeight;
        return (
          <Rect key={value} x={x} y={y} width={barWidth} height={barHeight} rx={4} fill="url(#scoreGradient)" />
        );
      })}
      {values.map((value, index) => {
        const x = left + slot * index + slot / 2;
        const y = bottom - (value / 1000) * chartHeight;
        return <SvgText key={`v-${value}`} x={x} y={y - 7} fontSize={10} fontWeight="700" fill="#12347B" textAnchor="middle">{value}</SvgText>;
      })}
      {['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'].map((label, index) => (
        <SvgText key={label} x={left + slot * index + slot / 2} y={height - 7} fontSize={9} fill={LABEL} textAnchor="middle">{label}</SvgText>
      ))}
    </Svg>
  );
}
