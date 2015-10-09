import {
  CoffeeMaker,
  Teapot,
  EspressoMachine,
  CoffeeFilter,
  TeaStrainer,
  EspressoTamper,
  CoffeeGrounds,
  LooseTea,
  GroundEspressoBeans
} from './symbols';

export default [
  { symbols: [CoffeeMaker, Teapot, EspressoMachine] },
  { symbols: [CoffeeFilter, TeaStrainer, EspressoTamper] },
  { symbols: [CoffeeGrounds, LooseTea, GroundEspressoBeans] }
];
