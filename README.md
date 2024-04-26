# Genetic-Algorithm

Genetic algorithm library

## Usage

### Gene.get

Get a bit

```ts
get(x: number): number | undefined
```

### Gene.edit

Edit a bit

```ts
edit(x: number, data: number): boolean
```

### Gene.mix

Get random bits

```ts
mix(): boolean
```

### Gene.toNumber

Get number

```ts
toNumber(length: number): number
```

### Gene.getBinary

Get binary string

```ts
toNumber(length: number): string
```

### GeneticCore.GeneticCore

Construct GeneticCore

```ts
toNumber(bitSize: number, geneCount: number, tempGeneCount: number, mutationP: number)
```

### GeneticCore.reset

Reset all genes

```ts
reset(): void
```

### GeneticCore.stepGeneratioin

Step one generation

```ts
stepGeneration(f: ScoreFunction): void
```

### GeneticCore.get

Get current gene

```ts
get(f: ScoreFunction): [Gene, number]
```

## Example

Finding the function minimum point

```ts
import { Gene, GeneticCore } from "@smiilliin/genetic-algorithm";

//gene can have 0 ~ 31 because bit count is 5
const geneCore: GeneticCore = new GeneticCore(5, 100, 40, 0.04);

const scoreF = (gene: Gene) => s(f(gene.toNumber(5) / 7.5));
const f = (x: number) =>
  Math.pow(x, 4) / 4 -
  (11 * Math.pow(x, 3)) / 6 +
  (9 / 2) * Math.pow(x, 2) -
  (9 * x) / 2 +
  3;
//score function
const s = (x: number) => Math.pow(2, -2 * (x - 3));

for (let i = 0; i < 500; i++) {
  geneCore.stepGeneration(scoreF);
}
const [gene] = geneCore.get(scoreF);
console.log(gene.toNumber(5) / 7.5);
```

## Test

Test with ts-mocha

```
npm run test
```

It results like this

```
  Gene test
    ✔ Gene edit
    ✔ Gene get
    ✔ Gene toNumber
    ✔ Gene getBinary
    ✔ Gene mix

  GeneCore
    ✔ Construct
    ✔ Step Generation
    ✔ Find min of function (44ms)


  8 passing (54ms)
```
