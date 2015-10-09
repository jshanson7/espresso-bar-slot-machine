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

import {
  CupOfCoffee,
  CupOfTea,
  CupOfEspresso
} from './rewards';

export default [
  { reward: CupOfCoffee, symbols: [CoffeeMaker, CoffeeFilter, CoffeeGrounds] },
  { reward: CupOfTea, symbols: [Teapot, TeaStrainer, LooseTea] },
  { reward: CupOfEspresso, symbols: [EspressoMachine, EspressoTamper, GroundEspressoBeans] }
];
