export type Guest = {
  first_name: string;
  last_name: string;
  phone: string; // TODO - this is the DB Key
  guests: { name: string }[]; // TODO - change to int
  gluten_free: number; // TODO - remove
  vegan: number; // TODO - remove
  coming: string; // TODO - change to boolean (includes coming and not coming)
  not_coming?: string; // TODO - remove
};
