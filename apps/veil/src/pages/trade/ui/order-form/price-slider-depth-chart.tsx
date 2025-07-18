import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import last from 'lodash/last';
import { useRef, useEffect } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { useBook } from '../../api/book';
import { Trace } from '@/shared/api/server/book/types';
import { scaleCanvas, drawFilledPath } from '@/shared/ui/canvas-toolkit';

const bgColor = 'rgba(250, 250, 250, 0.05)';

function DepthChartRenderer({
  scale,
  width,
  height,
}: {
  scale: ScaleLinear<number, number>;
  width: number;
  height: number;
}) {
  const deptchChartRef = useRef<HTMLCanvasElement>(null);
  const { data } = useBook();

  useEffect(() => {
    if (deptchChartRef.current) {
      scaleCanvas(deptchChartRef.current, { width, height });

      const ctx = deptchChartRef.current.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const maxBuyTotal = maxBy(data?.multiHops.buy ?? [], order => Number(order.total))?.total;
      const maxSellTotal = maxBy(data?.multiHops.sell ?? [], order => Number(order.total))?.total;
      const maxTotal = Math.max(Number(maxBuyTotal), Number(maxSellTotal));
      const totalScale = scaleLinear().domain([0, maxTotal]).range([height, 0]);

      function getCoordinates(orders: Trace[], isBuySide: boolean) {
        return orders.map((order, index) => {
          const price = order.price;
          const total = order.total;

          const neighboringOrder = orders[index + (isBuySide ? -1 : 1)];
          const price0 = isBuySide && neighboringOrder ? neighboringOrder.price : price;
          const price1 = !isBuySide && neighboringOrder ? neighboringOrder.price : price;

          const totalCoordinate = totalScale(Number(total));

          return {
            order,
            x0: scale(Number(price0)),
            x1: scale(Number(price1)),
            y0: totalCoordinate,
            y1: totalCoordinate,
          };
        });
      }

      const buyCoordinates = getCoordinates(
        orderBy(data?.multiHops.buy ?? [], 'price', 'asc'),
        true,
      );
      const sellCoordinates = getCoordinates(
        orderBy(data?.multiHops.sell ?? [], 'price', 'asc'),
        false,
      );

      if (buyCoordinates.length) {
        drawFilledPath(
          ctx,
          [
            ...buyCoordinates.flatMap(({ x0, y0, x1, y1 }) => [
              [x0, y0],
              [x1, y1],
            ]),
            // draw a line from the last buy coordinate to the bottom of the chart
            [last(buyCoordinates)?.x1, height],
            // draw a line from the bottom of the chart to the left of the chart
            [0, height],
            // draw a line from the left of the chart to the first buy coordinate
            [0, buyCoordinates[0]?.y0 ?? 0],
          ] as [number, number][],
          bgColor,
        );
      }

      if (sellCoordinates.length) {
        drawFilledPath(
          ctx,
          [
            ...sellCoordinates.flatMap(({ x0, y0, x1, y1 }) => [
              [x0, y0],
              [x1, y1],
            ]),
            // draw a line from the last sell coordinate to the right of the chart
            [width, last(sellCoordinates)?.y1],
            // draw a line from the right of the chart to the bottom of the chart
            [width, height],
            // draw a line from the bottom of the chart to the first sell coordinate
            [sellCoordinates[0]?.x0 ?? width, height],
          ] as [number, number][],
          bgColor,
        );
      }
    }
  }, [data, width, height, scale]);

  return <canvas ref={deptchChartRef} />;
}

export default DepthChartRenderer;
