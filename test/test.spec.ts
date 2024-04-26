import assert from "assert";
import { Gene, GeneticCore } from "../src/index";

describe("Gene test", () => {
  const gene = new Gene(3);

  it("Gene edit", () => {
    assert(gene.edit(0, 1));
    assert(gene.edit(6, 1));
    assert(gene.edit(13, 1));
  });
  it("Gene get", () => {
    assert(gene.get(0));
    assert(gene.get(6));
    assert(gene.get(13));
  });
  it("Gene toNumber", () => {
    const x = (1 << 13) | (1 << 7) | (1 << 0);
    assert(gene.toNumber(14) == x);
  });
  it("Gene getBinary", () => {
    assert(gene.getBinary(14) == "10000010000001");
  });
  it("Gene mix", () => {
    const gene = new Gene(10);

    gene.mix();

    let ok = false;
    for (let i = 0; i < 8 * 10; i++) {
      if (gene.get(i)) ok = true;
    }

    assert(ok);
  });
});
describe("GeneCore", () => {
  let geneCore: GeneticCore;
  it("Construct", () => {
    geneCore = new GeneticCore(5, 10, 4, 0.4);
    assert(geneCore.genes.length == 10);
  });
  it("Step Generation", () => {
    const f = (gene: Gene) => Math.pow(gene.toNumber(5) + 1, 2);

    geneCore.stepGeneration(f);
    assert(geneCore.tempGenes.length == geneCore.tempGeneCount);
    assert(geneCore.genes.length == geneCore.geneCount);

    for (let i = 0; i < 100; i++) {
      geneCore.stepGeneration(f);
    }
    assert(geneCore.get(f)[0].toNumber(5) > 20);
  });
  it("Find min of function", () => {
    geneCore = new GeneticCore(5, 100, 40, 0.04);

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
    assert(Math.abs(gene.toNumber(5) / 7.5 - 3) < 1);
  });
});
