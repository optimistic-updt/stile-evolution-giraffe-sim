export interface Giraffe {
  id: number;
  x: number;
  neckHeight: number;
  alive: boolean;
  eating: boolean;
  opacity: number;
  bodySpots: Array<{ x: number; y: number; radius: number }>;
  neckSpots: Array<{ x: number; y: number; radius: number }>;
}

export const createGiraffe = (i: number) => {
  let neckHeight = 60 + Math.random() * 140; // Random neck height between 60-200

  // Generate body spots
  let bodySpots = [];
  for (let j = 0; j < 5; j++) {
    bodySpots.push({
      x: -10 + Math.random() * 20,
      y: -20 - Math.random() * 30,
      radius: 5,
    });
  }

  // Generate neck spots
  let neckSpots = [];
  let neckSpotCount = Math.floor(neckHeight / 20);
  for (let j = 0; j < neckSpotCount; j++) {
    neckSpots.push({
      x: -5 + Math.random() * 10,
      y: -60 - j * 20 - Math.random() * 10,
      radius: 4,
    });
  }

  return {
    id: i,
    x: 50 + i * 75,
    neckHeight,
    alive: true,
    eating: false,
    opacity: 1,
    bodySpots,
    neckSpots,
  };
};
