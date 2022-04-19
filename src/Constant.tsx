
export const NOKIA_RESOLUTION = {
    x: 96,
    y: 65,
  };
  
  export const ASPECT_RATIO = NOKIA_RESOLUTION.x / NOKIA_RESOLUTION.y;
  
  export enum Direction {
    Up,
    Down,
    Left,
    Right,
  }
  
  export function opposite(a, b) {
      return a == Direction.Up && b == Direction.Down || 
              b == Direction.Up && a == Direction.Down ||
              b == Direction.Left && a == Direction.Right ||
              b == Direction.Right && a == Direction.Left 
  }