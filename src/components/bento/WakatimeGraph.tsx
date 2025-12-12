'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { getLanguageIcon } from '@/components/bento/LanguageIcons'

interface Language {
  name: string
  hours: number
  fill: string
}

interface Props {
  omitLanguages?: string[]
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
] as const

const WAKATIME_API_URL =
  'https://wakatime.com/share/@jktrn/ef6e633b-589d-44f2-9ae6-0eb93445cf2a.json'
const MAX_LANGUAGES = 7
const ICON_SIZE = 20
const CIRCLE_RADIUS = 16

const formatDuration = (hours: number): string => {
  if (hours >= 10) {
    return `${Math.round(hours)}h`
  } else {
    const totalMinutes = Math.round(hours * 60)
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    if (h > 0) {
      return `${h}h ${m}m`
    }
    return `${m}m`
  }
}

const chartConfig: ChartConfig = {
  hours: {
    label: 'Time',
    color: 'var(--primary)',
  },
  label: {
    color: 'var(--muted-foreground)',
  },
  ...CHART_COLORS.reduce(
    (acc, color, index) => ({
      ...acc,
      [`language${index}`]: { label: `App ${index + 1}`, color },
    }),
    {},
  ),
}

const CustomYAxisTick = ({ x, y, payload }: any) => {
  const icon = getLanguageIcon(payload.value.toLowerCase())
  const centerX = x - 15
  const centerY = y

  return (
    <g transform={`translate(${centerX},${centerY})`}>
      <title>{payload.value}</title>
      <rect
        x={-CIRCLE_RADIUS}
        y={-CIRCLE_RADIUS}
        width={CIRCLE_RADIUS * 2}
        height={CIRCLE_RADIUS * 2}
        fill="var(--border)"
        fillOpacity="0.5"
      />
      <foreignObject
        width={ICON_SIZE}
        height={ICON_SIZE}
        x={-ICON_SIZE / 2}
        y={-ICON_SIZE / 2}
      >
        <div className="flex h-full w-full items-center justify-center p-0.5">
          {icon ? (
            React.cloneElement(
              icon as React.ReactElement,
              {
                size: ICON_SIZE - 2,
                className: 'text-foreground',
              } as any,
            )
          ) : (
            <span className="text-foreground text-sm font-medium">
              {payload.value.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

const LoadingSkeleton = () => (
  <div className="size-full rounded-3xl p-6">
    <div className="space-y-1.5">
      {Array.from({ length: MAX_LANGUAGES }).map((_, index) => (
        <div key={index} className="flex items-center gap-x-2">
          <Skeleton className="size-8" />
          <div className="flex-1">
            <Skeleton
              className="h-8"
              style={{ width: `${100 * Math.pow(0.75, index)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const useWakatimeData = (omitLanguages: string[]) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Screen time data based on user's phone usage
    const hardcodedData = [
      { name: 'WeChat', hours: 25.75 },      // 25小时 44分钟 40秒
      { name: 'PiliPala', hours: 6.78 },     // 6小时 46分钟 12秒
      { name: 'Google', hours: 2.64 },       // 2小时 38分钟 21秒
      { name: '狐猴浏览器', hours: 1.78 },    // 1小时 46分钟 46秒
      { name: 'QQ', hours: 1.19 },           // 1小时 11分钟 32秒
      { name: '小红书', hours: 1.06 },        // 1小时 3分钟 24秒
      { name: 'Music', hours: 0.79 },        // 47分钟 9秒
    ]

    const combinedLanguages = hardcodedData
      .map((lang, index) => ({
        name: lang.name,
        hours: lang.hours,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))

    setLanguages(combinedLanguages)
    setIsLoading(false)
  }, [])

  return { languages, isLoading, error }
}

const WakatimeGraph = ({ omitLanguages = [] }: Props) => {
  const { languages, isLoading, error } = useWakatimeData(omitLanguages)

  if (isLoading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl p-4">
        <div className="text-center">
          <p className="text-destructive">Error loading data</p>
          <p className="text-muted-foreground text-sm">Please email me!</p>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="size-full p-4">
      <BarChart
        accessibilityLayer
        data={languages}
        layout="vertical"
        margin={{
          left: 0,
          right: 16,
          top: 4,
          bottom: 4,
        }}
        width={undefined}
        height={undefined}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={45}
          tick={<CustomYAxisTick />}
        />
        <XAxis type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="hours" radius={[0, 0, 0, 0]} isAnimationActive={false}>
          <LabelList
            dataKey="hours"
            position="right"
            formatter={(value: number) => {
              if (value >= 10) {
                return `${Math.round(value)}h`
              } else {
                const minutes = Math.round(value * 60)
                return `${minutes}m`
              }
            }}
            className="fill-foreground/80 font-medium"
            fontSize={13}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default WakatimeGraph
