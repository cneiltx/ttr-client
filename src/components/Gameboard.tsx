import { useEffect, useRef } from 'react';
import usMap from '../images/ttr-us-map.png';
import blackCar from '../images/train-cars/car-black.png';
import blueCar from '../images/train-cars/car-blue.png';
import greenCar from '../images/train-cars/car-green.png';
import purpleCar from '../images/train-cars/car-purple.png';
import redCar from '../images/train-cars/car-red.png';
import yellowCar from '../images/train-cars/car-yellow.png';
import { GameMap } from '../model/GameMap';
import { Route } from '../model/Route';
import { RouteColor } from '../model/RouteColor';
import { TrainColor } from '../model/TrainColor';
import { Box } from '@mui/material';
import { USCities } from '../model/USCities';

export type GameboardProps = {
  extraProps?: any;
}

export const Gameboard = (props: GameboardProps) => {
  const map = new GameMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = new Image();

  useEffect(() => {
    window.addEventListener('resize', onResize);
    image.src = usMap;
    image.onload = () => {
      onResize();
    }
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onResize = () => {
    const canvas = canvasRef.current!;
    canvas.width = canvas.clientHeight * image.width / image.height;
    canvas.height = canvas.clientHeight;
    drawMap(canvas.clientHeight / image.height);
  }

  const drawMap = (scale: number) => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.7;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.restore();
    context.scale(scale, scale);
    drawRoutes(context);
    drawCities(context);
  }

  const drawRoutes = (context: CanvasRenderingContext2D) => {
    for (const route of map.routes) {
      for (const segment of route.segments) {
        drawRouteSegment(context, segment.x, segment.y, segment.angle, route.color, route.segmentLength);
      }
    }
  }

  const drawCities = (context: CanvasRenderingContext2D) => {
    drawCity(context, 120, 45, USCities.Vancouver, 10, -20, 'right');
    drawCity(context, 330, 25, USCities.Calgary, 10, -15, 'left');
    drawCity(context, 698, 91, USCities.Winnipeg, -10, -20, 'left');
    drawCity(context, 1005, 175, USCities.SaultSteMarie, 0, -40, 'center');
    drawCity(context, 1264, 158, USCities.Montreal, -10, -20, 'left');
    drawCity(context, 1353, 255, USCities.Boston, 15, 0, 'left');
    drawCity(context, 116, 106, USCities.Seattle, -15, 5, 'right');
    drawCity(context, 432, 215, USCities.Billings, -31, 13, 'right'); // substituted for Helena
    drawCity(context, 799, 266, USCities.Minneapolis, -37, 15, 'right'); // substituted for Duluth
    drawCity(context, 1154, 255, USCities.Toronto, 15, 0, 'left');
    drawCity(context, 724, 389, USCities.Omaha, -11, 23, 'right');
    drawCity(context, 936, 347, USCities.Chicago, 2, 26, 'left');
    drawCity(context, 1148, 364, USCities.Pittsburgh, -10, -38, 'right');
    drawCity(context, 1304, 316, USCities.NewYork, 12, 17, 'left');
    drawCity(context, 1229, 402, USCities.Washington, 16, 21, 'left');
    drawCity(context, 84, 188, USCities.Portland, -12, -10, 'right');
    drawCity(context, 27, 430, USCities.SanFrancisco, 30, 27, 'left');
    drawCity(context, 318, 381, USCities.SaltLakeCity, -45, -20, 'right');
    drawCity(context, 498, 437, USCities.Denver, -40, 22, 'right');
    drawCity(context, 761, 465, USCities.KansasCity, 9, 31, 'left');
    drawCity(context, 877, 472, USCities.SaintLouis, -14, -45, 'right');
    drawCity(context, 985, 545, USCities.Nashville, 15, 0, 'left');
    drawCity(context, 1208, 516, USCities.Raleigh, 15, 0, 'left');
    drawCity(context, 1064, 615, USCities.Atlanta, -35, -10, 'right');
    drawCity(context, 1210, 608, USCities.Charleston, 15, 3, 'left');
    drawCity(context, 105, 573, USCities.LosAngeles, 5, 20, 'right');
    drawCity(context, 213, 524, USCities.LasVegas, -5, 20, 'left');
    drawCity(context, 286, 614, USCities.Phoenix, 0, 20, 'right');
    drawCity(context, 458, 564, USCities.SantaFe, 12, 25, 'left');
    drawCity(context, 697, 588, USCities.OklahomaCity, 39, -28, 'left');
    drawCity(context, 843, 608, USCities.LittleRock, 15, 14, 'left');
    drawCity(context, 450, 708, USCities.ElPaso, 0, 25, 'right');
    drawCity(context, 720, 682, USCities.Dallas, -27, -10, 'right');
    drawCity(context, 762, 769, USCities.Houston, 0, 25, 'center');
    drawCity(context, 932, 766, USCities.NewOrleans, 0, 22, 'right');
    drawCity(context, 1238, 862, USCities.Miami, 15, 0, 'left');
  }

  const citySplitNames = new Map([
    [USCities.KansasCity, 'Kansas\nCity'],
    [USCities.OklahomaCity, 'Oklahoma\nCity'],
    [USCities.SaintLouis, 'Saint\nLouis'],
    [USCities.SaultSteMarie, 'Sault Ste.\nMarie'],
  ]);

  const drawCity = (context: CanvasRenderingContext2D, x: number, y: number, city: USCities, xOffset: number, yOffset: number, align: CanvasTextAlign) => {
    context.save();
    const cityRadius = 7.5;
    context.strokeStyle = 'gold';
    context.lineWidth = 4
    const gradient = context.createRadialGradient(x, y, cityRadius / 4, x, y, cityRadius);
    gradient.addColorStop(0, 'firebrick');
    gradient.addColorStop(.55, 'indianred');
    gradient.addColorStop(1, 'firebrick');
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(x, y, cityRadius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    const fontSize = 16;
    context.strokeStyle = 'white';
    context.font = `bold ${fontSize}px system-ui`;
    context.lineWidth = 2;
    context.fillStyle = 'black';
    context.textAlign = align;
    context.textBaseline = 'middle';
    let lines = [city.toString()];
    if (citySplitNames.has(city)) {
      lines = citySplitNames.get(city)!.split('\n');
    }

    lines.forEach((line, index) => {
      context.strokeText(line, x + xOffset, y + yOffset + fontSize * index);
      context.fillText(line, x + xOffset, y + yOffset + fontSize * index);
    });

    context.restore();
  }

  const drawRouteSegment = (context: CanvasRenderingContext2D, x: number, y: number, angle: number, color: RouteColor, carLength: number) => {
    context.save();
    const carWidth = 15;

    switch (color) {
      case RouteColor.Grey:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'dimgrey';
        break;
      case RouteColor.Black:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'black';
        break;
      case RouteColor.White:
        context.strokeStyle = 'dimgrey';
        context.fillStyle = 'floralwhite';
        break;
      case RouteColor.Red:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'firebrick';
        break;
      case RouteColor.Yellow:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'gold';
        break;
      case RouteColor.Blue:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'royalblue';
        break;
      case RouteColor.Orange:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'orange';
        break;
      case RouteColor.Green:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'mediumseagreen';
        break;
      case RouteColor.Pink:
        context.strokeStyle = 'floralwhite';
        context.fillStyle = 'palevioletred';
        break;
    }

    context.lineWidth = 4
    context.translate(x, y);
    context.rotate(angle * Math.PI / 180);
    context.globalAlpha = 0.45;
    context.strokeRect(-carLength / 2, -carWidth / 2, carLength, carWidth);
    context.fillRect(-carLength / 2, -carWidth / 2, carLength, carWidth);
    context.restore();
  }

  const drawTrain = (context: CanvasRenderingContext2D, route: Route) => {
    const carWidth = 15;

    for (const segment of route.segments) {
      const image = new Image();

      switch (route.train) {
        case TrainColor.Red:
          image.src = redCar;
          break;
        case TrainColor.Yellow:
          image.src = yellowCar;
          break;
        case TrainColor.Blue:
          image.src = blueCar;
          break;
        case TrainColor.Green:
          image.src = greenCar;
          break;
        case TrainColor.Purple:
          image.src = purpleCar;
          break;
        case TrainColor.Black:
          image.src = blackCar;
          break;
      }

      context.save();
      context.translate(segment.x, segment.y);
      context.rotate(segment.angle * Math.PI / 180);
      context.drawImage(image, -route.segmentLength / 2, -carWidth / 2, route.segmentLength, carWidth);
      context.restore();
    }
  }

  return <Box border='solid red' component='canvas' ref={canvasRef} {...props.extraProps} />
}