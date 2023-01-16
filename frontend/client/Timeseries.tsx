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

interface TimeseriesParams {
    start?: Date;
    end?: Date;
    serverKey?: string;
    serverId?: number;
}


const queryStringForTimeseriesParams = (params: TimeseriesParams): string => {
  const {
    start,
    end,
    serverKey,
    serverId,
  } = params;

  const searchParams = new URLSearchParams();
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
  return searchParams.toString();
};

type TimeSpan = '1d' | '7d' | '3m' | 'start';

interface TimeseriesProps {
  data: TimeseriesResponse;
  width: number;
  height: number;
  margin: { top: number, right: number, bottom: number, left: number };
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
        d3.max(parsedData, (d) => d.count) ?? 0
      ])
      .range([height, 0]);
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
        .attr("width", width)
        .attr("height", height);

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
     .tickFormat((val) => `${val}`);
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
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d));

    const tooltip = svg.append("g")
        .style("pointer-events", "none");
    svg
      .on("pointerenter pointermove", (event) => {
        const i = d3.bisectCenter(parsedData.map(d => d.date), xScale.invert(d3.pointer(event)[0]));
        const date = parsedData[i].date;
        const count = parsedData[i].count;
        tooltip.style("display", null);

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
              .data([xScale.tickFormat(0, timeSpanFormat(span))(date), `${count} streamers`])
              .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .attr("color", "var(--theme-gray-900)")
                .text(d => d));

        const { y, width: w, height: h } = (text.node() as SVGGraphicsElement).getBBox();
        const tt = { w: 12.8, h: 6.4 };
        const yPos = yScale(count);
        const tth = (h + 20 + tt.h);
        const flipped = yPos - tth > 0;

        tooltip.attr("transform", `translate(${xScale(date)}, ${yPos - (flipped ? tth : 0)})`);
        text.attr("transform", `translate(${-w / 2}, ${tt.h + 10 - y - (flipped ? tt.h : 0)})`);
        const r = 4;
        path.attr("d", `
          M ${-w / 2 - 10 + r} ${tt.h}
          H ${-tt.w / 2}
          l ${tt.w / 2} -${tt.h}
          l ${tt.w / 2} ${tt.h}
          H ${w / 2 + 10 - r}
          A ${r} ${r} 0 0 1 ${w / 2 + 10} ${tt.h + r}
          V ${h + 20 + tt.h - r}
          A ${r} ${r} 0 0 1 ${w / 2 + 10 - r} ${h + 20 + tt.h}
          H ${-w / 2 - 10 + r}
          A ${r} ${r} 0 0 1 ${-w / 2 - 10} ${h + 20 + tt.h - r}
          L ${-w / 2 - 10} ${tt.h + r}
          A ${r} ${r} 0 0 1 ${-w / 2 - 10 + r} ${tt.h}
          z
        `);
        path.attr("transform", `rotate(${flipped ? 180 : 0}, 0, ${(h + 20 + tt.h) / 2})`)
        svg.property("value", parsedData[i]).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("pointerleave", () => {
        tooltip.style("display", "none");
        svg.property("value", null).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("touchstart", event => event.preventDefault());

  }, [parsedData, width, height, margin.bottom, margin.top, margin.left, margin.right, span]);

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

const TimeseriesContainer: React.FC<{}> = () => {
  const { server } = useCurrentServer();
  const now = useNow(1000 * 60 * 60 * 24);

  const [timeSpan, setTimeSpan] = React.useState<TimeSpan>('3m');

  const query = queryStringForTimeseriesParams({
    serverId: server.id,
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

  const lineItems: TimeSpanLineItem[] = timeSpans.map(ts => ({
    id: ts,
    span: ts,
    name: timeSpanName(ts),
    element: <DropdownItem
      key={ts}
      onClick={e => e.preventDefault()}
      eventKey={ts}
      active={ts === timeSpan}
    >
      {ts}
    </DropdownItem>
  }))

  return <>
    <FancyDropdown
      title={timeSpanName(timeSpan)}
      items={lineItems}
      onSelect={item => item && setTimeSpan(item.span)}
    />
    <div ref={ref}>
      {isSuccess(loadState) &&
        <Timeseries
          data={loadState.data}
          width={width - 60}
          height={300}
          margin={{ top: 0, right: 0, bottom: 30, left: 30 }}
          span={timeSpan}
        />
      }
    </div>
  </>;
};

export default TimeseriesContainer;
