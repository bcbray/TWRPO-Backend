import React from 'react';
import * as d3 from 'd3';
import { useMeasure } from 'react-use';
import {
  subWeeks,
  subDays,
  subMonths
} from 'date-fns';
import { TimeseriesResponse } from '@twrpo/types';

import { useCurrentServer } from './CurrentServer';
import {
  useLoading,
  isSuccess,
} from './LoadingState';
import { useNow } from './Data';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import { formatViewers } from './utils';

type Metric = 'streamers' | 'viewers';

interface TimeseriesParams {
    metric?: Metric;
    start?: Date;
    end?: Date;
    serverKey?: string;
    serverId?: number;
    channelTwitchId?: string;
}

const queryStringForTimeseriesParams = (params: TimeseriesParams): string => {
  const {
    metric,
    start,
    end,
    serverKey,
    serverId,
    channelTwitchId,
  } = params;

  const searchParams = new URLSearchParams();
  if (metric !== undefined) {
    searchParams.set('metric', metric);
  }
  if (start !== undefined) {
    searchParams.set('start', start.toISOString());
  }
  if (end !== undefined) {
    searchParams.set('end', end.toISOString());
  }
  if (serverKey !== undefined) {
    searchParams.set('serverKey', serverKey);
  }
  if (serverId !== undefined) {
    searchParams.set('serverId', `${serverId|0}`);
  }
  if (channelTwitchId !== undefined) {
    searchParams.set('channelTwitchId', channelTwitchId);
  }
  return searchParams.toString();
};

type TimeSpan = '1d' | '7d' | '3m' | 'start';

interface TimeseriesProps {
  data: TimeseriesResponse;
  width: number;
  height: number;
  margin: { top: number, right: number, bottom: number, left: number };
  metric: Metric;
  span: TimeSpan;
}

const timeSpanFormat = (timeSpan: TimeSpan) => {
  if (timeSpan === '1d' || timeSpan === '7d') {
    return '%b %-d, %Y %-I:%M %p';
  } else {
    return '%b %-d, %Y %-I %p'
  }
}


const Timeseries: React.FC<TimeseriesProps> = ({
  data,
  width,
  height,
  margin,
  metric,
  span,
}) => {
  const svgRef = React.useRef(null);
  // const margin = { top: 30, right: 30, bottom: 30, left: 60 };
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  const parsedData = React.useMemo(() => (
    data.data.map(({ date, count }) => ({ date: new Date(date), count }))
  ), [data]);

  React.useEffect(() => {
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([
        0,
        (d3.max(parsedData, (d) => d.count) ?? 0) * 1.1
      ])
      .range([height, 0])
      .nice();
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("g")
      .selectAll("rect")
      .data([undefined])
      .join("rect")
        .attr("fill", "none")
        .attr("stroke", "none")
        .attr("pointer-events", "all")
        .attr("x", -margin.left)
        .attr("y", -margin.top)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

   const xAxis = d3.axisBottom(xScale)
     .ticks(5)
     .tickSize(-height - 8);
   const xAxisGroup = svg.append("g")
     .attr("transform", `translate(0, ${height + 8})`)
     .call(xAxis);
   xAxisGroup.select(".domain").remove();
   xAxisGroup.selectAll("line").attr("stroke", "var(--theme-gray-200)");
   xAxisGroup.selectAll("text")
     .attr("color", "var(--theme-gray-600)")
     .attr("font-size", "0.75rem");

   const yAxis = d3.axisLeft(yScale)
     .ticks(5)
     .tickSize(-width)
     .tickFormat(d3.format('~s'));
   const yAxisGroup = svg.append("g").call(yAxis);
   yAxisGroup.select(".domain").remove();
   yAxisGroup.selectAll("line").attr("stroke", "var(--theme-gray-200)");
   yAxisGroup.selectAll("text")
     .attr("color", "var(--theme-gray-600)")
     .attr("font-size", "0.75rem");

    const line = d3.line<{date: Date, count: number}>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.count));
    svg.selectAll(".line")
      .data([parsedData])
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "var(--theme-primary-color)")
      .attr("stroke-width", 2)
      .attr("d", (d) => line(d));

    const annotationLine = svg.append("g")
      .selectAll("line")
      .data([undefined])
      .join("line")
      .attr("opacity", "0.5")
      .attr("stroke", "var(--theme-gray-600)")
      .style("display", "none");

    const highlightRadius = 3;
    const highlightLine = svg.append("g")
      .selectAll("line")
      .data([undefined])
      .join("line")
      .attr("opacity", "0.5")
      .attr("stroke", "var(--theme-primary-color-hover)")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", height)
      .style("display", "none");
    const highlightPoint = svg.append("g")
      .selectAll("circle")
      .data([undefined])
      .join("circle")
      .attr("fill", "var(--theme-primary-color-hover)")
      .attr("r", `${highlightRadius}`)
      .style("display", "none");

    const tooltip = svg.append("g")
      .style("pointer-events", "none")
      .style("display", "none");

    const tooltip2 = svg.append("g")
      .style("pointer-events", "none")
      .style("display", "none");

    svg
      .on("pointerenter pointermove", (event) => {
        const mouseXPos = d3.pointer(event)[0];
        const i = d3.bisectCenter(parsedData.map(d => d.date), xScale.invert(mouseXPos));
        const date = parsedData[i].date;
        const count = parsedData[i].count;
        tooltip.style("display", null);
        tooltip2.style("display", null);
        highlightPoint.style("display", null);
        highlightLine.style("display", null);
        annotationLine.style("display", null);

        const path = tooltip.selectAll("path")
          .data([undefined])
          .join("path")
            .attr("fill", "var(--theme-gray-200)");

        const text = tooltip.selectAll("text")
          .attr("fill", "currentColor")
          .data([undefined])
          .join("text")
            .call(text => text
              .selectAll("tspan")
              .data([xScale.tickFormat(0, timeSpanFormat(span))(date)])
              // .data([xScale.tickFormat(0, timeSpanFormat(span))(date), `${count} streamers`])
              .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                // .attr("font-weight", (_, i) => i ? null : "bold")
                .attr("color", "var(--theme-gray-900)")
                .attr("font-size", "0.75rem")
                .text(d => d));


        const path2 = tooltip2.selectAll("rect")
                .data([undefined])
                .join("rect")
                // .attr("opacity", 0.6)
                .attr("rx", 4)
                .attr("fill", "var(--theme-gray-200)");

        const text2 = tooltip2.selectAll("text")
                .attr("fill", "currentColor")
                .data([undefined])
                .join("text")
                  .call(text => text
                    .selectAll("tspan")
                    .data([metric === 'viewers'
                      ? formatViewers(count)
                      : `${count} streamers`])
                    .join("tspan")
                      .attr("x", 0)
                      .attr("y", (_, i) => `${i * 1.1}em`)
                      // .attr("font-weight", (_, i) => i ? null : "bold")
                      .attr("color", "var(--theme-gray-900)")
                      .attr("font-size", "0.75rem")
                      .text(d => d));


        const { y, width: w, height: h } = (text.node() as SVGGraphicsElement).getBBox();
        const tt = { w: 12.8 * 0.5, h: 6.4 * 0.5 };
        const m = { h: 8, v: 5 };
        const xPos = xScale(date);
        const yPos = yScale(count);
        const flipped = false; // yPos - tth > 0;
        const offset = xPos + w / 2 + m.h > width + margin.right
          ? (xPos + w / 2 + m.h) - width - margin.right
          : xPos - w / 2 - m.h < -margin.left
          ? (xPos - w / 2 - m.h) + margin.left
          : 0;

        highlightPoint.attr("transform", `translate(${xPos}, ${yPos})`);
        highlightLine.attr("transform", `translate(${Math.min(Math.max(mouseXPos,0), width)}, 0)`);
        tooltip.attr("transform", `translate(${xPos}, ${height + highlightRadius / 2})`);
        text.attr("transform", `translate(${-w / 2 - offset}, ${tt.h + m.v - y - (flipped ? tt.h : 0)})`);
        const r = 4;
        path.attr("d", `
          M ${-w / 2 - m.h + r - offset} ${tt.h}
          H ${-tt.w / 2}
          L 0 0
          L ${tt.w / 2} ${tt.h}
          H ${w / 2 + m.h - r - offset}
          A ${r} ${r} 0 0 1 ${w / 2 + m.h - offset} ${tt.h + r}
          V ${h + m.v + m.v + tt.h - r}
          A ${r} ${r} 0 0 1 ${w / 2 + m.h - r - offset} ${h + m.v + m.v + tt.h}
          H ${-w / 2 - m.h + r - offset}
          A ${r} ${r} 0 0 1 ${-w / 2 - m.h - offset} ${h + m.v + m.v + tt.h - r}
          L ${-w / 2 - m.h - offset} ${tt.h + r}
          A ${r} ${r} 0 0 1 ${-w / 2 - m.h + r - offset} ${tt.h}
          z
        `);
        path.attr("transform", `rotate(${flipped ? 180 : 0}, 0, ${(h + 20 + tt.h) / 2})`)

        const { y: y2, width: w2, height: h2 } = (text2.node() as SVGGraphicsElement).getBBox();
        const yTarget = Math.round((yPos / height) * 6) / 6 * height;
        tooltip2.attr("transform", `translate(${xPos < width / 2 ? xPos + 25: xPos - w2 - 16 - 25}, ${yTarget < h2 + 60 ? yTarget + 20 : yTarget - 20 - h2 - 10})`);

        path2
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", w2 + 16)
          .attr("height", h2 + 10)
        text2.attr("transform", `translate(8, ${5 - y2})`);

        annotationLine
          .attr("x1", xPos)
          .attr("y1", yPos)
          .attr("x2", xPos < width / 2 ? xPos + 25 + 4: xPos - 25 - 4)
          .attr("y2", yTarget < h2 + 60 ? yTarget + 20 + 4 : yTarget - 20 - 4);

        svg.property("value", parsedData[i]).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("pointerleave", () => {
        tooltip.style("display", "none");
        tooltip2.style("display", "none");
        highlightPoint.style("display", "none");
        highlightLine.style("display", "none");
        annotationLine.style("display", "none");
        svg.property("value", null).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("touchstart", event => event.preventDefault());

  }, [parsedData, width, height, margin.bottom, margin.top, margin.left, margin.right, metric, span, svgWidth, svgHeight]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

const timeSpans: TimeSpan[] = ['1d', '7d', '3m', 'start']

const timeSpanName = (timeSpan: TimeSpan) => {
  if (timeSpan === '1d') {
    return '1 day';
  } else if (timeSpan === '7d') {
    return '1 week';
  } else if (timeSpan === '3m') {
    return '3 months';
  } else {
    return 'All'
  }
}

interface TimeSpanLineItem extends LineItem {
  span: TimeSpan;
}

const metrics: Metric[] = ['streamers', 'viewers'];

const metricName = (metric: Metric) => {
  if (metric === 'streamers') {
    return 'Streamers';
  } else {
    return 'Viewers'
  }
}

interface MetricLineItem extends LineItem {
  metric: Metric;
}

export interface TimeseriesContainerProps {
  channelTwitchId?: string;
  constrainToServer?: boolean;
  availableMetrics?: Metric[];
}

const TimeseriesContainer: React.FC<TimeseriesContainerProps> = ({
  channelTwitchId,
  constrainToServer = true,
  availableMetrics = metrics,
}) => {
  const { server } = useCurrentServer();
  const now = useNow(1000 * 60 * 60 * 24);

  const [metric, setMetric] = React.useState<Metric>(availableMetrics.at(0) ?? 'streamers');
  const [timeSpan, setTimeSpan] = React.useState<TimeSpan>('7d');

  const query = queryStringForTimeseriesParams({
    metric,
    serverId: constrainToServer ? server.id : undefined,
    channelTwitchId,
    start: timeSpan === '1d'
      ? subDays(now, 1)
      : timeSpan === '7d'
      ? subWeeks(now, 1)
      : timeSpan === '3m'
      ? subMonths(now, 3)
      : undefined,
  });

  const [loadState] = useLoading<TimeseriesResponse>(`/api/v2/timeseries${query ? `?${query}` : ''}`);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const margin = { top: 8, right: 8, bottom: 30, left: 30 };

  const timeSpanLineItems: TimeSpanLineItem[] = timeSpans.map(ts => ({
    id: ts,
    span: ts,
    name: timeSpanName(ts),
    element: <DropdownItem
      key={ts}
      onClick={e => e.preventDefault()}
      eventKey={ts}
      active={ts === timeSpan}
    >
      {timeSpanName(ts)}
    </DropdownItem>
  }));

  const metricLineItems: MetricLineItem[] = availableMetrics.map(m => ({
    id: m,
    metric: m,
    name: metricName(m),
    element: <DropdownItem
      key={m}
      onClick={e => e.preventDefault()}
      eventKey={m}
      active={m === metric}
    >
      {metricName(m)}
    </DropdownItem>
  }))

  return <>
    <FancyDropdown
      title={timeSpanName(timeSpan)}
      items={timeSpanLineItems}
      onSelect={item => item && setTimeSpan(item.span)}
    />
    {availableMetrics.length > 1 &&
      <FancyDropdown
        title={metricName(metric)}
        items={metricLineItems}
        onSelect={item => item && setMetric(item.metric)}
      />
    }
    <div ref={ref}>
      {isSuccess(loadState) &&
        <Timeseries
          data={loadState.data}
          width={width - margin.left - margin.right}
          height={300}
          margin={margin}
          metric={metric}
          span={timeSpan}
        />
      }
    </div>
  </>;
};

export default TimeseriesContainer;
