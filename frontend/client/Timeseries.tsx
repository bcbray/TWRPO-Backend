import React from 'react';
import * as d3 from 'd3';
import { useMeasure } from 'react-use';
import { TimeseriesResponse } from '@twrpo/types';

import { useCurrentServer } from './CurrentServer';
import {
  useLoading,
  isSuccess,
} from './LoadingState';

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

interface TimeseriesProps {
  data: TimeseriesResponse;
  width: number;
  height: number;
  margin: { top: number, right: number, bottom: number, left: number };
}


const Timeseries: React.FC<TimeseriesProps> = ({
  data,
  width,
  height,
  margin,
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
        tooltip.attr("transform", `translate(${xScale(date)}, ${yScale(count)})`);

        const path = tooltip.selectAll("path")
          .data([undefined,undefined])
          .join("path")
            .attr("fill", "var(--theme-gray-800)")
            .attr("stroke", "var(--theme-primary-900)");

        const text = tooltip.selectAll("text")
          .attr("fill", "currentColor")
          .data([undefined,undefined])
          .join("text")
            .call(text => text
              .selectAll("tspan")
              .data([xScale.tickFormat(0, "%b %-d, %Y")(date), `${count} streamers`])
              .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .attr("color", "var(--theme-white)")
                .text(d => d));

        const { y, width: w, height: h } = (text.node() as SVGGraphicsElement).getBBox();
        text.attr("transform", `translate(${-w / 2}, ${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        svg.property("value", parsedData[i]).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("pointerleave", () => {
        tooltip.style("display", "none");
        svg.property("value", null).dispatch("input", {bubbles: true, cancelable: true, detail: null});
      })
      .on("touchstart", event => event.preventDefault());

  }, [parsedData, width, height, margin.bottom, margin.top, margin.left, margin.right]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

const TimeseriesContainer: React.FC<{}> = () => {
  const { server } = useCurrentServer();

  const query = queryStringForTimeseriesParams({ serverId: server.id });

  const [loadState] = useLoading<TimeseriesResponse>(`/api/v2/timeseries${query ? `?${query}` : ''}`);
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return <div ref={ref}>
    {isSuccess(loadState) &&
      <Timeseries
        data={loadState.data}
        width={width - 60}
        height={300}
        margin={{ top: 0, right: 0, bottom: 30, left: 30 }}
      />
    }
  </div>;
};

export default TimeseriesContainer;
