import { useState } from "react";

export const Athlete = (id: number, name: string, pr: number, gew: string) => {
  return { id: id, name: name, pr: pr, gew: gew };
};

export const setName = (athlete: Athlete, n: string) => {
  athlete.name = n;
};

export default Athlete;
