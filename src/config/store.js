import { proxy, useSnapshot } from "valtio";
const state = proxy({
  current: null,
  items: {},
  textures: {},
});

export default state;
