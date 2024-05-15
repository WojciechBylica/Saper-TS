export type Field = {
  id: number;
  x: number;
  y: number;
  state: "virgin" | "clicked" | "flagged" | "exploded";
  bomb: boolean;
  bombsInTouch: number;
};

export type PlayAreaSize = 10 | 15;

export type Count = 10 | 40 | 60 | 80;

export type OnButtonClickAction = (
  id: number,
  hydratedFields: Field[],
  setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>,
) => void;

export type SetHydratedFields = React.Dispatch<React.SetStateAction<Field[]>>;
