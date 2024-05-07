export type Field = {
  id: number;
  x: number;
  y: number;
  state: "virgin" | "clicked" | "flagged" | "exploded";
  bomb: boolean;
  bombsInTouch: number;
};
