'use client'

import { useState } from 'react'
import { Pie, PieChart, Sector } from 'recharts'

import { ChartContainer } from '@/components/ui/chart'

export interface PieChartData {
  name: string
  percentage: number
  hoverTitle: string
  color?: string
}

interface PieChartProps {
  data: PieChartData[]
  width?: number
  height?: number
  className?: string
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-20}
        textAnchor='middle'
        fill={fill}
        className='text-sm font-medium'
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        textAnchor='middle'
        fill={fill}
        className='text-lg font-bold'
      >
        {`${payload.percentage}%`}
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        textAnchor='middle'
        fill={fill}
        className='text-xs'
      >
        {payload.hoverTitle}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export function PieChartComponent({
  data,
  width = 400,
  height = 400,
  className = '',
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const chartData = data.map((item, index) => ({
    ...item,
    value: item.percentage,
    fill: item.color || `hsl(var(--chart-${(index % 5) + 1}))`,
  }))

  const config = chartData.reduce((acc, item, index) => {
    return {
      ...acc,
      [item.name]: {
        label: item.name,
        color: item.fill,
      },
    }
  }, {})

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  return (
    <ChartContainer
      config={config}
      className={`aspect-square min-h-96 w-full max-w-full ${className}`}
    >
      <PieChart width={width} height={height}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={chartData}
          cx='50%'
          cy='50%'
          innerRadius={100}
          outerRadius={150}
          dataKey='value'
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          nameKey='name'
          fill='#8884d8'
        >
          {chartData.map((entry, index) => (
            <Sector key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
